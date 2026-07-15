import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Sparkles,
  Star,
  Target,
  Video,
} from "lucide-react";

import { getInterviewerById } from "@/action/interviewer";
import SlotPicker from "../components/SlotPicker";
import { syncCurrentUser } from "@/lib/syncCurrentUser";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_LABEL } from "@/lib/data";

export default async function InterviewerProfilePage({ params }) {
  const { id } = await params;

  const [interviewer, currentUser] = await Promise.all([
    getInterviewerById(id),
    syncCurrentUser(),
  ]);

  if (!interviewer || !interviewer.interviewerProfile) {
    notFound();
  }

  const profile = interviewer.interviewerProfile;

  const {
    title,
    company,
    yearsExp,
    bio,
    categories = [],
    creditRate = 1,
  } = profile;

  const initials =
    interviewer.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 py-10 text-foreground">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Button variant="ghost" className="mb-8 gap-2" asChild>
          <Link href="/explore">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1fr_460px]">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            {/* Profile hero */}
            <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card/80 shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-violet-600/30 via-purple-500/15 to-transparent" />

              <div className="relative px-8 pb-8 pt-20 md:px-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                    <AvatarImage
                      src={interviewer.imageUrl || undefined}
                      alt={interviewer.name || "Interview coach"}
                    />

                    <AvatarFallback className="bg-violet-500/15 text-3xl font-bold text-violet-600 dark:text-violet-300">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                        {interviewer.name || "AceIt Coach"}
                      </h1>

                      <BadgeCheck className="h-6 w-6 text-violet-500" />
                    </div>

                    <p className="mt-3 text-xl text-muted-foreground">
                      {title || "Interview Coach"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {company && (
                        <span className="flex items-center gap-2">
                          <BriefcaseBusiness className="h-4 w-4" />
                          {company}
                        </span>
                      )}

                      {yearsExp && (
                        <span className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          {yearsExp}+ years of experience
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Experience
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      {yearsExp ? `${yearsExp}+ years` : "Experienced"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Interview types
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      {categories.length || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Session rate
                    </p>

                    <p className="mt-2 text-xl font-bold text-violet-600 dark:text-violet-300">
                      {creditRate}{" "}
                      {creditRate === 1 ? "credit" : "credits"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* About */}
            <Card className="rounded-[2rem] border-border bg-card/80 shadow-xl backdrop-blur-xl">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                    <MessageSquareText className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Coach introduction
                    </p>

                    <h2 className="text-2xl font-bold">
                      About this coach
                    </h2>
                  </div>
                </div>

                <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
                  {bio || "This coach has not added a biography yet."}
                </p>
              </CardContent>
            </Card>

            {/* Interview specialties */}
            <Card className="rounded-[2rem] border-border bg-card/80 shadow-xl backdrop-blur-xl">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                    <Target className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Areas of focus
                    </p>

                    <h2 className="text-2xl font-bold">
                      Interview specialties
                    </h2>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <span
                        key={category}
                        className="flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-300"
                      >
                        <CheckCircle2 className="h-4 w-4" />

                        {CATEGORY_LABEL[category] ||
                          category.replaceAll("_", " ")}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No interview specialties listed yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Session experience */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-lg backdrop-blur-xl">
                <Video className="h-6 w-6 text-violet-600 dark:text-violet-300" />

                <h3 className="mt-4 font-semibold">
                  Live mock interview
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Practice in a realistic one-on-one interview environment.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-lg backdrop-blur-xl">
                <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-300" />

                <h3 className="mt-4 font-semibold">
                  Personalized feedback
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Receive focused feedback on your answers and communication.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-lg backdrop-blur-xl">
                <Clock3 className="h-6 w-6 text-violet-600 dark:text-violet-300" />

                <h3 className="mt-4 font-semibold">
                  45-minute session
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Enough time for practice, discussion, and clear next steps.
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT BOOKING PANEL */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <SlotPicker
              interviewer={interviewer}
              interviewerCredits={creditRate}
              userCredits={currentUser?.credits ?? 0}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}