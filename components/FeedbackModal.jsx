"use client";

import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RATING_CONFIG } from "@/lib/data";

export function FeedbackModal({
  open,
  onOpenChange,
  feedback,
  intervieweeName,
}) {
  if (!feedback) {
    return null;
  }

  const rating =
    RATING_CONFIG?.[feedback.overallRating] ?? {
      label: feedback.overallRating || "Not rated",
      emoji: "✦",
      className:
        "border-violet-500/25 text-violet-600 dark:text-violet-300",
      bg: "from-violet-500/15",
    };

  const analysisSections = [
    {
      icon: Brain,
      label: "Technical performance",
      value: feedback.technical,
    },
    {
      icon: MessageSquare,
      label: "Communication",
      value: feedback.communication,
    },
    {
      icon: TrendingUp,
      label: "Problem solving",
      value: feedback.problemSolving,
    },
  ].filter((section) => section.value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-border bg-background p-0 text-foreground sm:max-w-4xl">
        <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400" />

        <div className="relative overflow-hidden p-6 md:p-8">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[480px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px]" />

          <div className="relative z-10">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                  <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-300" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
                    AceIt performance report
                  </p>

                  <DialogTitle className="mt-2 text-left text-3xl font-bold tracking-tight">
                    Interview feedback
                  </DialogTitle>

                  <DialogDescription className="mt-2 text-left text-sm leading-relaxed">
                    {intervieweeName
                      ? `Detailed performance analysis for ${intervieweeName}.`
                      : "Review the key strengths, gaps, and recommended next steps from this interview."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Overall rating */}
            <section
              className={`mt-8 overflow-hidden rounded-[2rem] border ${rating.className} bg-gradient-to-br ${rating.bg} to-transparent p-6`}
            >
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                    Overall performance
                  </p>

                  <p className="mt-2 text-4xl font-bold">
                    {rating.label}
                  </p>

                  {feedback.sessionRating && (
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-current" />

                      <span className="font-medium">
                        {feedback.sessionRating}/5 session rating
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-current/15 bg-background/40 text-4xl shadow-lg">
                  {rating.emoji}
                </div>
              </div>
            </section>

            {/* Summary */}
            {feedback.summary && (
              <section className="mt-6 rounded-[2rem] border border-violet-500/20 bg-violet-500/5 p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-300" />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                      Executive summary
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                      Overall assessment
                    </h3>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  {feedback.summary}
                </p>
              </section>
            )}

            {/* Analysis sections */}
            {analysisSections.length > 0 && (
              <section className="mt-6 grid gap-4 md:grid-cols-3">
                {analysisSections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <article
                      key={section.label}
                      className="rounded-3xl border border-border bg-card/70 p-5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                        <Icon className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                      </div>

                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {section.label}
                      </p>

                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {section.value}
                      </p>
                    </article>
                  );
                })}
              </section>
            )}

            {/* Strengths and improvements */}
            <section className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
                      What went well
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Key strengths
                    </h3>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  {feedback.strengths?.length ? (
                    feedback.strengths.map((strength, index) => (
                      <div
                        key={`${strength}-${index}`}
                        className="flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-background/30 p-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {strength}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No strengths were listed.
                    </p>
                  )}
                </div>
              </article>

              <article className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
                      Growth areas
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      What to improve
                    </h3>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  {feedback.improvements?.length ? (
                    feedback.improvements.map((improvement, index) => (
                      <div
                        key={`${improvement}-${index}`}
                        className="flex items-start gap-3 rounded-2xl border border-amber-500/15 bg-background/30 p-3"
                      >
                        <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {improvement}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No improvement areas were listed.
                    </p>
                  )}
                </div>
              </article>
            </section>

            {/* Recommendation */}
            {feedback.recommendation && (
              <section className="mt-6 rounded-[2rem] border border-border bg-card/70 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Recommended next step
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Coach recommendation
                    </h3>
                  </div>
                </div>

                <Separator className="my-5" />

                <p className="text-sm leading-7 text-muted-foreground">
                  {feedback.recommendation}
                </p>
              </section>
            )}

            {/* Interviewer comment */}
            {feedback.sessionComment && (
              <section className="mt-6 rounded-[2rem] border border-border bg-background/40 p-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-violet-600 dark:text-violet-300" />

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Session note
                  </p>
                </div>

                <p className="mt-4 text-sm italic leading-7 text-muted-foreground">
                  “{feedback.sessionComment}”
                </p>
              </section>
            )}

            <div className="mt-8 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-300"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Personalized report
              </Badge>

              <Badge variant="outline">
                <Brain className="mr-1.5 h-3.5 w-3.5" />
                Skills analysis
              </Badge>

              <Badge variant="outline">
                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                Actionable improvements
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}