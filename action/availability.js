"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

async function getCurrentInterviewer() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("You must be signed in.");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: clerkUser.id,
    },

    select: {
      id: true,
      role: true,

      interviewerProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Your AceIt account could not be found.");
  }

  if (user.role !== "INTERVIEWER") {
    throw new Error("Only coaches can manage availability.");
  }

  if (!user.interviewerProfile) {
    throw new Error(
      "Your coach profile could not be found. Please complete onboarding."
    );
  }

  return {
    userId: user.id,
    profileId: user.interviewerProfile.id,
  };
}

export async function getMyAvailability() {
  try {
    const { profileId } = await getCurrentInterviewer();

    return await db.availability.findMany({
      where: {
        interviewerId: profileId,
        endTime: {
          gt: new Date(),
        },
      },

      orderBy: {
        startTime: "asc",
      },
    });
  } catch (error) {
    console.error("getMyAvailability error:", error);
    return [];
  }
}

export async function createAvailability({
  startTime,
  endTime,
}) {
  const { profileId } = await getCurrentInterviewer();

  if (!startTime || !endTime) {
    throw new Error("Please select a start and end time.");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new Error("The selected date or time is invalid.");
  }

  if (start <= new Date()) {
    throw new Error("Availability must begin in the future.");
  }

  if (end <= start) {
    throw new Error("End time must be later than start time.");
  }

  const durationMinutes =
    (end.getTime() - start.getTime()) / 60000;

  if (durationMinutes < 45) {
    throw new Error(
      "Availability must be at least 45 minutes long."
    );
  }

  /*
   * Prevent the coach from creating overlapping availability windows.
   */
  const overlap = await db.availability.findFirst({
    where: {
      interviewerId: profileId,

      startTime: {
        lt: end,
      },

      endTime: {
        gt: start,
      },
    },

    select: {
      id: true,
    },
  });

  if (overlap) {
    throw new Error(
      "This availability overlaps with another time window."
    );
  }

  const availability = await db.availability.create({
    data: {
      interviewerId: profileId,
      startTime: start,
      endTime: end,
      status: "AVAILABLE",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/availability");
  revalidatePath("/explore");
  revalidatePath("/interviewers");

  return {
    success: true,
    availability,
  };
}

export async function deleteAvailability(availabilityId) {
  const { profileId } = await getCurrentInterviewer();

  if (!availabilityId) {
    throw new Error("Availability ID is required.");
  }

  const availability = await db.availability.findFirst({
    where: {
      id: availabilityId,
      interviewerId: profileId,
    },

    select: {
      id: true,
    },
  });

  if (!availability) {
    throw new Error(
      "This availability does not exist or does not belong to you."
    );
  }

  /*
   * Do not delete an availability window if it already has a booking.
   */
  const booking = await db.booking.findFirst({
    where: {
      availabilityId,
      status: "SCHEDULED",
    },

    select: {
      id: true,
    },
  });

  if (booking) {
    throw new Error(
      "You cannot delete availability that has a scheduled booking."
    );
  }

  await db.availability.delete({
    where: {
      id: availabilityId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/availability");
  revalidatePath("/explore");

  return {
    success: true,
  };
}
