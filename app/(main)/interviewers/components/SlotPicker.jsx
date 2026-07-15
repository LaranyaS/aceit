"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Coins,
  Loader2,
  Sparkles,
  Video,
} from "lucide-react";

import { bookSlot } from "@/action/booking";
import useFetch from "@/hook/use-fetch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatDateFull,
  formatDateTab,
  formatTime,
  generateDates,
  generateSlots,
} from "@/lib/helpers";

const SLOT_DURATION_MINUTES = 45;
const DAYS_AHEAD = 7;

export default function SlotPicker({
  interviewer,
  interviewerCredits,
  userCredits,
}) {
  const router = useRouter();
  const summaryRef = useRef(null);

  const dates = useMemo(() => generateDates(DAYS_AHEAD), []);

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showCreditWarning, setShowCreditWarning] =
    useState(false);

  const {
    data,
    loading,
    error,
    fn: bookFn,
  } = useFetch(bookSlot);

  const profile = interviewer?.interviewerProfile;

  const availabilities =
    profile?.availabilities ?? [];

  const bookedSessions =
    interviewer?.bookingsAsInterviewer ?? [];

  const creditsRequired =
    interviewerCredits ??
    profile?.creditRate ??
    1;

  const currentCredits = userCredits ?? 0;

  const canAfford =
    currentCredits >= creditsRequired;

  /*
   * Find the availability window belonging to the
   * currently selected calendar date.
   */
  const selectedAvailability = useMemo(() => {
    return availabilities.find((availability) => {
      const availabilityDate = new Date(
        availability.startTime
      );

      return (
        availabilityDate.toDateString() ===
        selectedDate.toDateString()
      );
    });
  }, [availabilities, selectedDate]);

  /*
   * Turn the selected availability window into
   * 45-minute bookable slots.
   */
  const slots = useMemo(() => {
    if (!selectedAvailability) {
      return [];
    }

    return generateSlots(
      selectedDate,
      selectedAvailability.startTime,
      selectedAvailability.endTime,
      bookedSessions,
      SLOT_DURATION_MINUTES
    );
  }, [
    selectedDate,
    selectedAvailability,
    bookedSessions,
  ]);

  useEffect(() => {
    if (selectedSlot && summaryRef.current) {
      summaryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedSlot]);

  useEffect(() => {
    if (data?.success) {
      router.push("/appointments");
      router.refresh();
    }
  }, [data, router]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setShowCreditWarning(false);
  };

  const handleSlotClick = (slot) => {
    if (!slot.available || slot.isBooked) {
      return;
    }

    if (!canAfford) {
      setShowCreditWarning(true);
      return;
    }

    setShowCreditWarning(false);

    setSelectedSlot((previousSlot) => {
      const sameSlot =
        previousSlot?.startTime.getTime() ===
        slot.startTime.getTime();

      return sameSlot ? null : slot;
    });
  };

  const handleConfirm = async () => {
    if (!selectedSlot || loading) {
      return;
    }

    await bookFn({
      interviewerId: interviewer.id,
      startTime:
        selectedSlot.startTime.toISOString(),
      endTime:
        selectedSlot.endTime.toISOString(),
    });
  };

  const balanceAfterBooking =
    currentCredits - creditsRequired;

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card/90 shadow-xl backdrop-blur-xl">
        <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400" />

        <div className="p-5">
          {/* Compact heading */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-300">
                <CalendarDays className="h-4 w-4" />
                Book a session
              </div>

              <h2 className="mt-2 text-xl font-bold">
                Choose a date and time
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {SLOT_DURATION_MINUTES}-minute mock
                interview
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-violet-500/25 bg-violet-500/10 px-4 py-3 text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Cost
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-violet-600 dark:text-violet-300" />

                <span className="text-xl font-bold text-violet-600 dark:text-violet-300">
                  {creditsRequired}
                </span>

                <span className="text-xs text-muted-foreground">
                  {creditsRequired === 1
                    ? "credit"
                    : "credits"}
                </span>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3 text-xs">
            <span className="text-muted-foreground">
              Your balance
            </span>

            <span
              className={
                canAfford
                  ? "font-semibold text-foreground"
                  : "font-semibold text-red-500"
              }
            >
              {currentCredits}{" "}
              {currentCredits === 1
                ? "credit"
                : "credits"}
            </span>
          </div>

          {/* Date tabs */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select date
            </p>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
              {dates.map((date) => {
                const label = formatDateTab(date);

                const active =
                  date.toDateString() ===
                  selectedDate.toDateString();

                const hasAvailability =
                  availabilities.some(
                    (availability) =>
                      new Date(
                        availability.startTime
                      ).toDateString() ===
                      date.toDateString()
                  );

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() =>
                      handleDateChange(date)
                    }
                    className={`relative flex min-w-[72px] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 text-xs transition-all ${
                      active
                        ? "border-violet-500 bg-violet-500/10 text-violet-600 shadow-sm dark:text-violet-300"
                        : "border-border text-muted-foreground hover:border-violet-500/30 hover:text-foreground"
                    }`}
                  >
                    <span className="font-semibold">
                      {label.top}
                    </span>

                    <span className="mt-0.5 opacity-70">
                      {label.bottom}
                    </span>

                    {hasAvailability && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="my-5" />

          {/* Time slots */}
          <div>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Available times
                </p>

                <p className="mt-1 text-sm font-medium">
                  {formatDateFull(selectedDate)}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Available
              </div>
            </div>

            {!selectedAvailability ? (
              <div className="rounded-2xl border border-dashed border-border bg-background/30 px-5 py-8 text-center">
                <Clock3 className="mx-auto h-6 w-6 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">
                  No availability on this date
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Choose a date with a green dot.
                </p>
              </div>
            ) : slots.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background/30 px-5 py-8 text-center">
                <Clock3 className="mx-auto h-6 w-6 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">
                  No remaining time slots
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  These times may have passed or already
                  been booked.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const isSelected =
                    selectedSlot?.startTime.getTime() ===
                    slot.startTime.getTime();

                  return (
                    <button
                      key={slot.startTime.toISOString()}
                      type="button"
                      disabled={slot.isBooked}
                      onClick={() =>
                        handleSlotClick(slot)
                      }
                      className={`relative rounded-xl border px-2 py-2.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "border-violet-500 bg-violet-500/15 text-violet-600 shadow-sm dark:text-violet-300"
                          : slot.isBooked
                            ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/40"
                            : "cursor-pointer border-border bg-background/30 text-foreground hover:border-violet-500/40 hover:bg-violet-500/5"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        {isSelected && (
                          <Check className="h-3.5 w-3.5" />
                        )}

                        {formatTime(slot.startTime)}
                      </span>

                      {slot.isBooked && (
                        <span className="mt-0.5 block text-[9px]">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Credit warning */}
      {showCreditWarning && (
        <section className="rounded-2xl border border-red-500/25 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <Coins className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <div>
              <h3 className="font-semibold">
                Not enough credits
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                This session costs {creditsRequired}{" "}
                {creditsRequired === 1
                  ? "credit"
                  : "credits"}
                . Your balance is {currentCredits}.
              </p>

              <Button
                type="button"
                size="sm"
                className="mt-4"
                onClick={() =>
                  router.push("/#membership")
                }
              >
                View membership plans
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Confirmation */}
      {selectedSlot && (
        <section
          ref={summaryRef}
          className="overflow-hidden rounded-[2rem] border border-violet-500/30 bg-card/90 shadow-xl backdrop-blur-xl"
        >
          <div className="h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400" />

          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-300" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Booking summary
                </p>

                <h2 className="font-bold">
                  Confirm your session
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-background/40 p-4">
              <div className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground">
                  Date
                </span>

                <span className="text-right font-medium">
                  {formatDateFull(
                    selectedSlot.startTime
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground">
                  Time
                </span>

                <span className="text-right font-medium">
                  {formatTime(
                    selectedSlot.startTime
                  )}{" "}
                  –{" "}
                  {formatTime(
                    selectedSlot.endTime
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground">
                  Duration
                </span>

                <span className="font-medium">
                  {SLOT_DURATION_MINUTES} minutes
                </span>
              </div>

              <Separator />

              <div className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground">
                  Credits charged
                </span>

                <span className="font-bold text-violet-600 dark:text-violet-300">
                  −{creditsRequired}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground">
                  Balance after
                </span>

                <span className="font-medium">
                  {balanceAfterBooking}{" "}
                  {balanceAfterBooking === 1
                    ? "credit"
                    : "credits"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
              <Video className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-300" />

              <p className="text-xs leading-relaxed text-muted-foreground">
                A private AceIt video room will be
                created after confirmation.
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/5 p-3 text-xs text-red-500">
                {error?.message ||
                  String(error) ||
                  "The booking could not be completed."}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={loading}
                onClick={() =>
                  setSelectedSlot(null)
                }
              >
                Change time
              </Button>

              <Button
                type="button"
                size="sm"
                className="flex-1 gap-2"
                disabled={loading}
                onClick={handleConfirm}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}