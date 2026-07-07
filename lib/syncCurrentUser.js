import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

const MONTHLY_CREDITS_BY_PLAN = {
  pro: 15,
  starter: 5,
  free: 1,
};

const getUserPlan = async () => {
  const { has } = await auth();

  if (has({ plan: "pro" })) return "pro";
  if (has({ plan: "starter" })) return "starter";

  return "free";
};

const shouldRefreshCredits = (userFromDb, activePlan) => {
  if (userFromDb.role === "INTERVIEWER") return false;

  if (userFromDb.currentPlan !== activePlan) return true;

  if (!userFromDb.creditsLastAllocatedAt) return true;

  const now = new Date();
  const lastRefresh = new Date(userFromDb.creditsLastAllocatedAt);

  const currentMonthNumber = now.getFullYear() * 12 + now.getMonth();
  const lastRefreshMonthNumber =
    lastRefresh.getFullYear() * 12 + lastRefresh.getMonth();

  return currentMonthNumber > lastRefreshMonthNumber;
};

export const syncCurrentUser = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  try {
    const activePlan = await getUserPlan();
    const monthlyCredits = MONTHLY_CREDITS_BY_PLAN[activePlan];

    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
    });

    if (existingUser) {
      if (!shouldRefreshCredits(existingUser, activePlan)) {
        return existingUser;
      }

      const updatedCredits = monthlyCredits + (existingUser.credits ?? 0);

      return await db.user.update({
        where: {
          clerkUserId: clerkUser.id,
        },
        data: {
          credits: updatedCredits,
          currentPlan: activePlan,
          creditsLastAllocatedAt: new Date(),
        },
      });
    }

    const fullName = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ");

    return await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name: fullName,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0].emailAddress,
        credits: monthlyCredits,
        currentPlan: activePlan,
        creditsLastAllocatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("syncCurrentUser error:", error.message);
    return null;
  }
};