"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createAvailability,
  deleteAvailability,
} from "@/action/availability";
import useFetch from "@/hook/use-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  formatDateFull,
  formatDuration,
  formatTime,
} from "@/lib/helpers";

function getTodayString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function AvailabilityManager({
  initialAvailability = [],
}) {
  const [availability, setAvailability] =
    useState(initialAvailability);

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const {
    loading,
    error,
    fn: createAvailabilityFn,
  } = useFetch(createAvailability);

  const minimumDate = useMemo(() => getTodayString(), []);

  const formComplete =
    form.date && form.startTime && form.endTime;

  const clearForm = () => {
    setForm({
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleSubmit = async () => {
    if (!formComplete || loading) {
      return;
    }

    /*
     * Browser date/time inputs represent the user's local timezone.
     * Convert them to ISO strings before sending them to the server.
     */
    const start = new Date(
      `${form.date}T${form.startTime}:00`
    );

    const end = new Date(
      `${form.date}T${form.endTime}:00`
    );

    const result = await createAvailabilityFn({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });

    if (result?.success && result.availability) {
      setAvailability((previous) =>
        [...previous, result.availability].sort(
          (a, b) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        )
      );

      clearForm();
    }
  };

  const handleDelete = async (availabilityId) => {
    setDeletingId(availabilityId);
    setDeleteError("");

    try {
      const result = await deleteAvailability(
        availabilityId
      );

      if (result?.success) {
        setAvailability((previous) =>
          previous.filter(
            (item) => item.id !== availabilityId
          )
        );
      }
    } catch (deleteActionError) {
      setDeleteError(
        deleteActionError?.message ||
          "Could not delete this availability."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      {/* Create availability */}
      <section className="h-fit overflow-hidden rounded-[2rem] border border-border bg-card/80 shadow-xl backdrop-blur-xl lg:sticky lg:top-8">
        <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400" />

        <div className="p-6 md:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
            <Plus className="h-6 w-6 text-violet-600 dark:text-violet-300" />
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            Add availability
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Choose a date and time window. AceIt will
            divide it into 45-minute booking slots.
          </p>

          <div className="mt-7 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="availability-date">
                Date
              </Label>

              <Input
                id="availability-date"
                type="date"
                min={minimumDate}
                value={form.date}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    date: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availability-start">
                  Start time
                </Label>

                <Input
                  id="availability-start"
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      startTime: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability-end">
                  End time
                </Label>

                <Input
                  id="availability-end"
                  type="time"
                  value={form.endTime}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      endTime: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-300" />

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Example: 9:00 AM–12:00 PM creates
                  slots beginning at 9:00, 9:45, 10:30,
                  and 11:15.
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-500">
                {error?.message ||
                  String(error) ||
                  "Could not create availability."}
              </div>
            )}

            <Button
              type="button"
              className="w-full gap-2"
              size="lg"
              disabled={!formComplete || loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving availability...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add availability
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Existing availability */}
      <section className="rounded-[2rem] border border-border bg-card/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10">
            <CalendarDays className="h-5 w-5 text-violet-600 dark:text-violet-300" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Upcoming availability
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage the time windows candidates can book.
            </p>
          </div>
        </div>

        <Separator className="my-7" />

        {deleteError && (
          <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-500">
            {deleteError}
          </div>
        )}

        {availability.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-background/30 px-6 py-16 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-5 text-xl font-semibold">
              No availability added
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Add your first availability window so
              candidates can begin booking mock interviews.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availability.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl border border-border bg-background/40 p-5 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.03]"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                      <CalendarDays className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {formatDateFull(item.startTime)}
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock3 className="h-4 w-4" />

                        {formatTime(item.startTime)} –{" "}
                        {formatTime(item.endTime)}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDuration(
                          item.startTime,
                          item.endTime
                        )}{" "}
                        availability window
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-500 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500"
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}

                    Remove
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}