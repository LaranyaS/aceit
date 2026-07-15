"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Coins,
  ExternalLink,
  LockKeyhole,
  PlayCircle,
  Sparkles,
  Star,
  Video,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedbackModal } from "./FeedbackModal";
import {
  formatDate,
  formatDuration,
  formatTime,
} from "@/lib/helpers";
import {
  CATEGORY_LABEL,
  RATING_LABEL,
  RATING_STYLES,
  STATUS_STYLES,
} from "@/lib/data";

export function AppointmentCard({
  booking,
  mode,
  isPast = false,
}) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const { has, isLoaded } = useAuth();

  const {
    startTime,
    endTime,
    status,
    creditsCharged,
    streamCallId,
    recordingUrl,
    feedback,
  } = booking;

  const isInterviewerMode = mode === "interviewer";

  /*
   * On the interviewee appointments page, person is the coach.
   * On a future interviewer dashboard, person will be the candidate.
   */
  const person = isInterviewerMode
    ? booking.interviewee
    : booking.interviewer;

  /*
   * Coach-specific fields are stored inside InterviewerProfile
   * in your Prisma schema.
   */
  const interviewerProfile = !isInterviewerMode
    ? booking.interviewer?.interviewerProfile
    : null;

  const title = interviewerProfile?.title;
  const company = interviewerProfile?.company;
  const categories = interviewerProfile?.categories ?? [];

  const safeCreditsCharged = creditsCharged ?? 0;

  const creditsLabel = isInterviewerMode
    ? `+${safeCreditsCharged} ${
        safeCreditsCharged === 1 ? "credit" : "credits"
      } earned`
    : `−${safeCreditsCharged} ${
        safeCreditsCharged === 1 ? "credit" : "credits"
      }`;

  const creditsStyle = isInterviewerMode
    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-300";

  const now = new Date();

  const isUpcoming =
    status === "SCHEDULED" &&
    new Date(endTime) > now;

  const isProUser =
    isLoaded && Boolean(has?.({ plan: "pro" }));

  const isStarterUser =
    isLoaded && Boolean(has?.({ plan: "starter" }));

  const hasRecording = Boolean(recordingUrl);
  const hasFeedback = Boolean(feedback);

  /*
   * Recordings are a Pro-only feature.
   */
  const canViewRecording =
    hasRecording && isProUser;

  /*
   * Starter and Pro users can view full feedback.
   */
  const canViewFeedback =
    hasFeedback && (isStarterUser || isProUser);

  /*
   * A locked recording CTA appears when a recording exists
   * but the current user is not subscribed to Pro.
   */
  const showLockedRecording =
    hasRecording && isLoaded && !isProUser;

  const initials =
    person?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const statusLabel = status
    ? status.charAt(0) + status.slice(1).toLowerCase()
    : "Unknown";

  return (
    <>
      <FeedbackModal
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        feedback={feedback}
        intervieweeName={
          isInterviewerMode
            ? booking.interviewee?.name
            : undefined
        }
      />

      <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card/85 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-violet-500/10">
        {/* Hover glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-full flex-col gap-6 p-6">
          {/* Person and appointment status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-14 w-14 shrink-0 rounded-2xl border border-border">
                <AvatarImage
                  src={person?.imageUrl || undefined}
                  alt={person?.name || "AceIt user"}
                  className="rounded-2xl object-cover"
                />

                <AvatarFallback className="rounded-2xl border border-violet-500/20 bg-violet-500/10 text-base font-semibold text-violet-600 dark:text-violet-300">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">
                  {person?.name || "AceIt User"}
                </p>

                {!isInterviewerMode && (title || company) ? (
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {title || "Interview Coach"}
                    {company ? ` · ${company}` : ""}
                  </p>
                ) : (
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {person?.email || "No email available"}
                  </p>
                )}

                {!isInterviewerMode &&
                  categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {categories
                        .slice(0, 3)
                        .map((category) => (
                          <span
                            key={category}
                            className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium text-violet-600 dark:text-violet-300"
                          >
                            {CATEGORY_LABEL?.[category] ||
                              category.replaceAll("_", " ")}
                          </span>
                        ))}

                      {categories.length > 3 && (
                        <span className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
                          +{categories.length - 3}
                        </span>
                      )}
                    </div>
                  )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <Badge
                variant="outline"
                className={
                  STATUS_STYLES?.[status] ||
                  "border-border text-muted-foreground"
                }
              >
                {statusLabel}
              </Badge>

              <Badge
                variant="outline"
                className={creditsStyle}
              >
                <Coins className="mr-1 h-3 w-3" />
                {creditsLabel}
              </Badge>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Date, time, and duration */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />

                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  Date
                </span>
              </div>

              <p className="mt-3 text-sm font-medium">
                {formatDate(startTime)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" />

                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  Time
                </span>
              </div>

              <p className="mt-3 text-sm font-medium">
                {formatTime(startTime)}
                <span className="mx-1 text-muted-foreground">
                  –
                </span>
                {formatTime(endTime)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Video className="h-4 w-4" />

                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  Duration
                </span>
              </div>

              <p className="mt-3 text-sm font-medium">
                {formatDuration(startTime, endTime)}
              </p>
            </div>
          </div>

          {/* Feedback preview */}
          {feedback?.summary && (
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-300" />

                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                    Interview feedback
                  </p>
                </div>

                {feedback.overallRating && (
                  <Badge
                    variant="outline"
                    className={
                      RATING_STYLES?.[
                        feedback.overallRating
                      ] ||
                      "border-border text-muted-foreground"
                    }
                  >
                    <Star className="mr-1 h-3 w-3" />

                    {RATING_LABEL?.[
                      feedback.overallRating
                    ] || feedback.overallRating}
                  </Badge>
                )}
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {feedback.summary}
              </p>
            </div>
          )}

          {/* Recording availability message */}
          {hasRecording && (
            <div
              className={`rounded-2xl border p-4 ${
                isProUser
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-violet-500/20 bg-violet-500/5"
              }`}
            >
              <div className="flex items-start gap-3">
                {isProUser ? (
                  <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-300" />
                )}

                <div>
                  <p className="text-sm font-semibold">
                    {isProUser
                      ? "Your session recording is ready"
                      : "Recording available with Pro"}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {isProUser
                      ? "Review the full interview to study your answers, communication, and improvement areas."
                      : "Upgrade to Pro to watch and review recordings from your completed mock interviews."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
            {!isPast &&
              streamCallId &&
              isUpcoming && (
                <Button
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <Link href={`/call/${streamCallId}`}>
                    <Video className="h-4 w-4" />
                    Join interview
                  </Link>
                </Button>
              )}

            {/* Pro recording button */}
            {canViewRecording && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-emerald-500/25 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                asChild
              >
                <a
                  href={recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlayCircle className="h-4 w-4" />
                  Watch recording
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}

            {/* Locked recording button for non-Pro plans */}
            {showLockedRecording && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-violet-500/25 text-violet-600 hover:bg-violet-500/10 dark:text-violet-300"
                asChild
              >
                <Link href="/#membership">
                  <LockKeyhole className="h-4 w-4" />
                  Unlock recording with Pro
                </Link>
              </Button>
            )}

            {/* Starter and Pro feedback */}
            {canViewFeedback && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-violet-500/25 text-violet-600 hover:bg-violet-500/10 dark:text-violet-300"
                onClick={() => setFeedbackOpen(true)}
              >
                <Sparkles className="h-4 w-4" />
                View full feedback
              </Button>
            )}

            {/* Feedback upgrade message */}
            {hasFeedback &&
              isLoaded &&
              !canViewFeedback && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground"
                  asChild
                >
                  <Link href="/#membership">
                    <LockKeyhole className="h-4 w-4" />
                    Upgrade to view full feedback
                  </Link>
                </Button>
              )}

            {!isUpcoming &&
              !hasRecording &&
              !hasFeedback && (
                <p className="text-xs text-muted-foreground">
                  No recording or feedback is available for this
                  session yet.
                </p>
              )}
          </div>
        </div>
      </article>
    </>
  );
}