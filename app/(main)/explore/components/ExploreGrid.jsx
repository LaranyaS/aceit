"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExploreGrid({ interviewers }) {
  if (!interviewers?.length) {
    return (
      <div className="rounded-3xl border border-border bg-card/70 px-6 py-16 text-center shadow-lg backdrop-blur-xl">
        <UserRound className="mx-auto h-10 w-10 text-violet-600 dark:text-violet-300" />

        <h2 className="mt-5 text-2xl font-bold">
          No interview coaches available yet
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          New coaches will appear here after they complete onboarding and create
          their profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {interviewers.map((user) => {
        const profile = user.interviewerProfile;
        const nextAvailability = profile?.availabilities?.[0];

        return (
          <article
            key={user.id}
            className="flex h-full flex-col rounded-3xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-violet-500/10"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name || "Interview coach"}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">
                  {user.name || "AceIt Coach"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {profile?.title || "Interview Coach"}
                </p>

                {profile?.company && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <BriefcaseBusiness className="h-4 w-4" />
                    <span>{profile.company}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {profile?.bio ||
                "This coach has not added a profile description yet."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {profile?.categories?.slice(0, 4).map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-600 dark:text-violet-300"
                >
                  {category.replaceAll("_", " ")}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">
                  {profile?.yearsExp
                    ? `${profile.yearsExp}+ years`
                    : "Not listed"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Session cost</span>
                <span className="font-medium">
                  {profile?.creditRate ?? 1} credit
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  Next available
                </span>

                <span className="text-right text-xs font-medium">
                  {nextAvailability
                    ? new Date(nextAvailability.startTime).toLocaleString(
                        "en-CA",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )
                    : "No slots yet"}
                </span>
              </div>
            </div>

            <div className="mt-auto flex gap-3 pt-6">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/explore/${user.id}`}>View Profile</Link>
              </Button>

              <Button className="flex-1 gap-2" asChild>
                <Link href={`/explore/${user.id}`}>
                  <CalendarDays className="h-4 w-4" />
                  Book
                </Link>
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}