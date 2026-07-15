"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getIntervieweeAppointments() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return [];
  }

  try {
    const dbUser = await db.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!dbUser || dbUser.role !== "INTERVIEWEE") {
      return [];
    }

    const appointments = await db.booking.findMany({
      where: {
        intervieweeId: dbUser.id,
      },

      include: {
        interviewer: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            email: true,

            interviewerProfile: {
              select: {
                title: true,
                company: true,
                yearsExp: true,
                categories: true,
              },
            },
          },
        },

        feedback: true,
      },

      orderBy: {
        startTime: "desc",
      },
    });

    return appointments;
  } catch (error) {
    console.error("getIntervieweeAppointments error:", error);
    return [];
  }
}