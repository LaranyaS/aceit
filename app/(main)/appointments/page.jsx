import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  History,
  Search,
  Sparkles,
} from "lucide-react";

import { getIntervieweeAppointments } from "@/action/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import { PageHeader } from "@/components/reusables";
import { Button } from "@/components/ui/button";

export default async function MyAppointmentsPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/");
  }

  const appointments = await getIntervieweeAppointments();
  const now = new Date();

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === "SCHEDULED" &&
        new Date(appointment.endTime) > now
    )
    .sort(
      (first, second) =>
        new Date(first.startTime).getTime() -
        new Date(second.startTime).getTime()
    );

  const completedAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === "COMPLETED" ||
        (appointment.status === "SCHEDULED" &&
          new Date(appointment.endTime) <= now)
    )
    .sort(
      (first, second) =>
        new Date(second.startTime).getTime() -
        new Date(first.startTime).getTime()
    );

  const cancelledAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === "CANCELLED" ||
        appointment.status === "NO_SHOW"
    )
    .sort(
      (first, second) =>
        new Date(second.startTime).getTime() -
        new Date(first.startTime).getTime()
    );

  const nextAppointment = upcomingAppointments[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background effects */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 top-80 h-80 w-80 rounded-full bg-purple-500/5 blur-[110px]" />

      <div className="relative z-10">
        <PageHeader
          label="My appointments"
          gray="Your interview"
          gold="sessions"
          description="Manage upcoming mock interviews, review completed sessions, and revisit your feedback."
        />

        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-20">
          {/* Overview cards */}
          {appointments.length > 0 && (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10">
                  <CalendarCheck2 className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                </div>

                <p className="mt-5 text-3xl font-bold">
                  {upcomingAppointments.length}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Upcoming sessions
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <p className="mt-5 text-3xl font-bold">
                  {completedAppointments.length}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Completed sessions
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <p className="mt-5 text-3xl font-bold">
                  {
                    completedAppointments.filter(
                      (appointment) => appointment.feedback
                    ).length
                  }
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Feedback reports
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10">
                  <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>

                <p className="mt-5 text-lg font-bold">
                  {nextAppointment
                    ? new Date(nextAppointment.startTime).toLocaleDateString(
                        "en-CA",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : "None"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Next interview
                </p>
              </div>
            </section>
          )}

          {/* Empty state */}
          {appointments.length === 0 && (
            <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card/80 px-6 py-20 text-center shadow-xl backdrop-blur-xl">
              <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

              <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-violet-500/20 bg-violet-500/10">
                  <CalendarDays className="h-9 w-9 text-violet-600 dark:text-violet-300" />
                </div>

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-300">
                  Your journey starts here
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  No sessions booked yet
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                  Browse experienced interview coaches, choose the right
                  specialty, and schedule your first mock interview.
                </p>

                <Button className="mt-8 gap-2" size="lg" asChild>
                  <Link href="/explore">
                    <Search className="h-4 w-4" />
                    Explore interview coaches
                  </Link>
                </Button>
              </div>
            </section>
          )}

          {/* Upcoming section */}
          {upcomingAppointments.length > 0 && (
            <section className="flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-300">
                    <CalendarCheck2 className="h-4 w-4" />
                    Coming up
                  </div>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight">
                    Upcoming interviews
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Prepare for your scheduled mock interview sessions.
                  </p>
                </div>

                <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-300">
                  {upcomingAppointments.length}{" "}
                  {upcomingAppointments.length === 1 ? "session" : "sessions"}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    booking={appointment}
                    mode="interviewee"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed section */}
          {completedAppointments.length > 0 && (
            <section className="flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <History className="h-4 w-4" />
                    Your progress
                  </div>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight">
                    Completed interviews
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Review previous sessions and open any available feedback.
                  </p>
                </div>

                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {completedAppointments.length} completed
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {completedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    booking={appointment}
                    mode="interviewee"
                    isPast
                  />
                ))}
              </div>
            </section>
          )}

          {/* Cancelled / no-show section */}
          {cancelledAppointments.length > 0 && (
            <section className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Cancelled and missed
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Other appointments
                </h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {cancelledAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    booking={appointment}
                    mode="interviewee"
                    isPast
                  />
                ))}
              </div>
            </section>
          )}

          {/* Explore more */}
          {appointments.length > 0 && (
            <section className="flex flex-col items-start justify-between gap-5 rounded-[2rem] border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent p-7 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">
                  Keep improving
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Ready for another practice session?
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Explore more coaches and practice a different interview style.
                </p>
              </div>

              <Button className="shrink-0 gap-2" asChild>
                <Link href="/explore">
                  <Search className="h-4 w-4" />
                  Find another coach
                </Link>
              </Button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}