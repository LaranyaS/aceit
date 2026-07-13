"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getInterviewers() {
  const clerkUser = await currentUser();

  try {
    const interviewers = await db.user.findMany({
      where: {
        role: "INTERVIEWER",

        ...(clerkUser && {
          clerkUserId: {
            not: clerkUser.id,
          },
        }),
      },

      include: {
        interviewerProfile: {
          include: {
            availabilities: {
              where: {
                status: "AVAILABLE",
              },
              orderBy: {
                startTime: "asc",
              },
              take: 1,
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return interviewers;
  } catch (error) {
    console.error("Error fetching interviewers:", error);
    return [];
  }
}