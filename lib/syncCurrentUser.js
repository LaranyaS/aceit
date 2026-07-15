import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

const MONTHLY_CREDITS_BY_PLAN = {
  pro: 15,
  starter: 5,
  free: 1,
};

async function getUserPlan() {
  const { has } = await auth();

  if (has({ plan: "pro" })) {
    return "pro";
  }

  if (has({ plan: "starter" })) {
    return "starter";
  }

  return "free";
}

function shouldRefreshCredits(userFromDb, activePlan) {
  // Coaches earn credits through completed bookings.
  // Their candidate credits should not be refreshed monthly.
  if (userFromDb.role === "INTERVIEWER") {
    return false;
  }

  if (userFromDb.currentPlan !== activePlan) {
    return true;
  }

  if (!userFromDb.creditsLastAllocatedAt) {
    return true;
  }

  const now = new Date();
  const lastRefresh = new Date(
    userFromDb.creditsLastAllocatedAt
  );

  const currentMonthNumber =
    now.getFullYear() * 12 + now.getMonth();

  const lastRefreshMonthNumber =
    lastRefresh.getFullYear() * 12 +
    lastRefresh.getMonth();

  return currentMonthNumber > lastRefreshMonthNumber;
}

export async function syncCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  try {
    const primaryEmail =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses?.[0]?.emailAddress;

    if (!primaryEmail) {
      throw new Error(
        "The signed-in Clerk account does not have an email address."
      );
    }

    const normalizedEmail = primaryEmail
      .trim()
      .toLowerCase();

    const activePlan = await getUserPlan();

    const monthlyCredits =
      MONTHLY_CREDITS_BY_PLAN[activePlan] ?? 1;

    /*
     * First, find the user using Clerk's permanent user ID.
     */
    let existingUser = await db.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },

      include: {
        interviewerProfile: true,
      },
    });

    /*
     * Recovery case:
     *
     * The database may contain this email under an older Clerk user ID,
     * especially after recreating Clerk accounts or resetting the database.
     *
     * Instead of creating a duplicate UNASSIGNED user, reconnect the
     * existing email row to the current Clerk account.
     */
    if (!existingUser) {
      const userWithSameEmail = await db.user.findUnique({
        where: {
          email: normalizedEmail,
        },

        include: {
          interviewerProfile: true,
        },
      });

      if (userWithSameEmail) {
        existingUser = await db.user.update({
          where: {
            id: userWithSameEmail.id,
          },

          data: {
            clerkUserId: clerkUser.id,
            name:
              [clerkUser.firstName, clerkUser.lastName]
                .filter(Boolean)
                .join(" ") ||
              userWithSameEmail.name,
            imageUrl:
              clerkUser.imageUrl ||
              userWithSameEmail.imageUrl,
          },

          include: {
            interviewerProfile: true,
          },
        });
      }
    }

    if (existingUser) {
      if (
        !shouldRefreshCredits(existingUser, activePlan)
      ) {
        return existingUser;
      }

      const updatedCredits =
        monthlyCredits + (existingUser.credits ?? 0);

      return await db.user.update({
        where: {
          id: existingUser.id,
        },

        data: {
          credits: updatedCredits,
          currentPlan: activePlan,
          creditsLastAllocatedAt: new Date(),
        },

        include: {
          interviewerProfile: true,
        },
      });
    }

    const fullName = [
      clerkUser.firstName,
      clerkUser.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name: fullName || normalizedEmail.split("@")[0],
        imageUrl: clerkUser.imageUrl,
        email: normalizedEmail,
        credits: monthlyCredits,
        currentPlan: activePlan,
        creditsLastAllocatedAt: new Date(),

        // Usually Prisma already defaults to UNASSIGNED,
        // but making it explicit removes ambiguity.
        role: "UNASSIGNED",
      },

      include: {
        interviewerProfile: true,
      },
    });
  } catch (error) {
    console.error(
      "syncCurrentUser error:",
      error instanceof Error
        ? error.message
        : error
    );

    return null;
  }
}