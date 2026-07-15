"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getInterviewerById(id) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("You must be signed in to view a coach profile.");
  }

  try {
    const interviewer = await db.user.findFirst({
      where: {
        id,
        role: "INTERVIEWER",
      },

      include: {
        interviewerProfile: {
          include: {
            availabilities: {
              where: {
                status: "AVAILABLE",
                startTime: {
                  gte: new Date(),
                },
              },
              orderBy: {
                startTime: "asc",
              },
            },
          },
        },
      },
    });

    return interviewer;
  } catch (error) {
    console.error("getInterviewerById error:", error);
    return null;
  }
}