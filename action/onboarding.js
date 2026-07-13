"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function completeOnboarding(data) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("You must be signed in to complete onboarding.");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: clerkUser.id,
    },
  });

  if (!user) {
    throw new Error("User not found. Please refresh and try again.");
  }

  const updatedUser = await db.user.update({
    where: {
      clerkUserId: clerkUser.id,
    },
    data: {
      role: data.role,
    },
  });

    if (data.role === "INTERVIEWER") {
    await db.interviewerProfile.upsert({
      where: {
        userId: updatedUser.id,
      },
      update: {
        title: data.title,
        company: data.company,
        yearsExp: data.yearsExp,
        bio: data.bio,
        categories: data.categories,
      },
      create: {
        userId: updatedUser.id,
        title: data.title,
        company: data.company,
        yearsExp: data.yearsExp,
        bio: data.bio,
        categories: data.categories,
      },
    });
  }

  return await db.user.findUnique({
    where: {
      id: updatedUser.id,
    },
    include: {
      interviewerProfile: true,
    },
  });
}