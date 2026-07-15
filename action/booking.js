"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { StreamClient } from "@stream-io/node-sdk";
import { request } from "@arcjet/next";

import { db } from "@/lib/prisma";
import {
  checkRateLimit,
  createRateLimiter,
} from "@/lib/arcjet";

// Five quick attempts are allowed.
// After that, tokens refill at two per hour.
const bookingLimiter = createRateLimiter({
  refillRate: 2,
  interval: "1h",
  capacity: 5,
});

export async function getInterviewerProfile(interviewerId) {
  if (!interviewerId) {
    return null;
  }

  try {
    const interviewer = await db.user.findFirst({
      where: {
        id: interviewerId,
        role: "INTERVIEWER",
      },

      select: {
        id: true,
        clerkUserId: true,
        name: true,
        imageUrl: true,

        interviewerProfile: {
          select: {
            id: true,
            title: true,
            company: true,
            yearsExp: true,
            bio: true,
            categories: true,
            creditRate: true,

            availabilities: {
              where: {
                status: "AVAILABLE",
                endTime: {
                  gt: new Date(),
                },
              },
              select: {
                id: true,
                startTime: true,
                endTime: true,
              },
              orderBy: {
                startTime: "asc",
              },
            },
          },
        },

        bookingsAsInterviewer: {
          where: {
            status: "SCHEDULED",
            endTime: {
              gt: new Date(),
            },
          },
          select: {
            id: true,
            startTime: true,
            endTime: true,
          },
          orderBy: {
            startTime: "asc",
          },
        },
      },
    });

    if (!interviewer?.interviewerProfile) {
      return null;
    }

    return interviewer;
  } catch (error) {
    console.error("getInterviewerProfile error:", error);
    throw new Error("Failed to load this coach.");
  }
}

export async function bookSlot({
  interviewerId,
  startTime,
  endTime,
}) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("You must be signed in to book a session.");
  }

  /*
   * Arcjet rate limiting
   *
   * This runs before any database or Stream work so bots cannot repeatedly
   * create expensive booking requests.
   */
  const req = await request();

  const rateLimitError = await checkRateLimit(
    bookingLimiter,
    req,
    clerkUser.id
  );

  if (rateLimitError) {
    throw new Error(rateLimitError);
  }

  if (!interviewerId || !startTime || !endTime) {
    throw new Error("Missing booking information.");
  }

  const requestedStart = new Date(startTime);
  const requestedEnd = new Date(endTime);

  if (
    Number.isNaN(requestedStart.getTime()) ||
    Number.isNaN(requestedEnd.getTime())
  ) {
    throw new Error("The selected date or time is invalid.");
  }

  if (requestedStart >= requestedEnd) {
    throw new Error(
      "The booking end time must be after its start time."
    );
  }

  if (requestedStart <= new Date()) {
    throw new Error("You cannot book a session in the past.");
  }

  const [interviewee, interviewer] = await Promise.all([
    db.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        imageUrl: true,
        role: true,
        credits: true,
      },
    }),

    db.user.findFirst({
      where: {
        id: interviewerId,
        role: "INTERVIEWER",
      },
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        imageUrl: true,
        role: true,

        interviewerProfile: {
          select: {
            id: true,
            creditRate: true,
          },
        },
      },
    }),
  ]);

  if (!interviewee) {
    throw new Error(
      "Your AceIt user account could not be found."
    );
  }

  if (interviewee.role !== "INTERVIEWEE") {
    throw new Error(
      "Only candidates can book interview sessions."
    );
  }

  if (!interviewer?.interviewerProfile) {
    throw new Error("The selected coach could not be found.");
  }

  if (interviewee.id === interviewer.id) {
    throw new Error("You cannot book a session with yourself.");
  }

  const creditsRequired =
    interviewer.interviewerProfile.creditRate ?? 1;

  if (interviewee.credits < creditsRequired) {
    throw new Error(
      `You need ${creditsRequired} ${
        creditsRequired === 1 ? "credit" : "credits"
      } to book this session. Please upgrade your plan or choose another coach.`
    );
  }

  /*
   * Confirm that the requested session is inside one of the coach's
   * published availability windows.
   */
  const matchingAvailability =
    await db.availability.findFirst({
      where: {
        interviewerId: interviewer.interviewerProfile.id,
        status: "AVAILABLE",
        startTime: {
          lte: requestedStart,
        },
        endTime: {
          gte: requestedEnd,
        },
      },
      select: {
        id: true,
      },
    });

  if (!matchingAvailability) {
    throw new Error(
      "This time is outside the coach's available schedule."
    );
  }

  /*
   * Check for an overlapping booking before creating the Stream call.
   */
  const existingConflict = await db.booking.findFirst({
    where: {
      interviewerId: interviewer.id,
      status: "SCHEDULED",
      startTime: {
        lt: requestedEnd,
      },
      endTime: {
        gt: requestedStart,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingConflict) {
    throw new Error(
      "This time was just booked by someone else. Please choose another slot."
    );
  }

  const streamApiKey =
    process.env.NEXT_PUBLIC_STREAM_API_KEY;

  const streamSecret =
    process.env.STREAM_SECRET_KEY;

  if (!streamApiKey || !streamSecret) {
    throw new Error(
      "Stream Video is not configured. Add the Stream environment variables."
    );
  }

  let streamCallId;

  try {
    const streamClient = new StreamClient(
      streamApiKey,
      streamSecret
    );

    await streamClient.upsertUsers([
      {
        id: interviewee.clerkUserId,
        name: interviewee.name || "Candidate",
        image: interviewee.imageUrl || undefined,
        role: "user",
      },
      {
        id: interviewer.clerkUserId,
        name: interviewer.name || "Coach",
        image: interviewer.imageUrl || undefined,
        role: "user",
      },
    ]);

    streamCallId = `mock_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const call = streamClient.video.call(
      "default",
      streamCallId
    );

    await call.getOrCreate({
      data: {
        created_by_id: interviewee.clerkUserId,

        members: [
          {
            user_id: interviewee.clerkUserId,
            role: "host",
          },
          {
            user_id: interviewer.clerkUserId,
            role: "host",
          },
        ],

        settings_override: {
          recording: {
            mode: "available",
            quality: "1080p",
          },

          screensharing: {
            enabled: true,
          },

          transcription: {
            mode: "auto-on",
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Stream call creation failed:",
      error
    );

    throw new Error(
      "AceIt could not create the video call. Please try again."
    );
  }

  try {
    const booking = await db.$transaction(async (tx) => {
      /*
       * Check for a conflict again inside the transaction.
       */
      const transactionConflict =
        await tx.booking.findFirst({
          where: {
            interviewerId: interviewer.id,
            status: "SCHEDULED",
            startTime: {
              lt: requestedEnd,
            },
            endTime: {
              gt: requestedStart,
            },
          },
          select: {
            id: true,
          },
        });

      if (transactionConflict) {
        throw new Error(
          "This slot was just booked. Please choose another time."
        );
      }

      /*
       * Check the latest credit balance inside the transaction.
       */
      const latestInterviewee =
        await tx.user.findUnique({
          where: {
            id: interviewee.id,
          },
          select: {
            credits: true,
          },
        });

      if (
        !latestInterviewee ||
        latestInterviewee.credits < creditsRequired
      ) {
        throw new Error(
          "You no longer have enough credits for this booking."
        );
      }

      const newBooking = await tx.booking.create({
        data: {
          intervieweeId: interviewee.id,
          interviewerId: interviewer.id,
          availabilityId: matchingAvailability.id,
          startTime: requestedStart,
          endTime: requestedEnd,
          status: "SCHEDULED",
          creditsCharged: creditsRequired,
          streamCallId,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: interviewee.id,
          amount: -creditsRequired,
          type: "BOOKING_DEDUCTION",
          bookingId: newBooking.id,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: interviewer.id,
          amount: creditsRequired,
          type: "BOOKING_EARNING",
          bookingId: newBooking.id,
        },
      });

      await tx.user.update({
        where: {
          id: interviewee.id,
        },
        data: {
          credits: {
            decrement: creditsRequired,
          },
        },
      });

      /*
       * Coach earnings belong on InterviewerProfile in your schema.
       */
      await tx.interviewerProfile.update({
        where: {
          userId: interviewer.id,
        },
        data: {
          creditBalance: {
            increment: creditsRequired,
          },
        },
      });

      return newBooking;
    });

    revalidatePath("/explore");
    revalidatePath(
      `/interviewers/${interviewerId}`
    );
    revalidatePath(
      `/interviewers/${interviewerId}/book`
    );
    revalidatePath("/appointments");
    revalidatePath("/dashboard");

    return {
      success: true,
      bookingId: booking.id,
      streamCallId,
    };
  } catch (error) {
    console.error(
      "bookSlot transaction failed:",
      error
    );

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error(
      "The booking could not be completed. Please try again."
    );
  }
}