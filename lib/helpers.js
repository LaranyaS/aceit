import {
  format,
  isToday,
  isTomorrow,
  addDays,
  addMinutes,
  isBefore,
  isAfter,
  set,
  differenceInMinutes,
} from "date-fns";

export function formatDate(iso) {
  return format(new Date(iso), "EEE, MMM d, yyyy");
}

export function formatDateFull(date) {
  return format(new Date(date), "EEEE, MMMM d, yyyy");
}

export function formatTime(date) {
  return format(new Date(date), "h:mm a");
}

export function formatDuration(start, end) {
  const minutes = differenceInMinutes(new Date(end), new Date(start));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return hours > 0
    ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""}`
    : `${remainingMinutes}m`;
}

export function formatDateTab(date) {
  const bottom = format(new Date(date), "MMM d");

  if (isToday(date)) {
    return {
      top: "Today",
      bottom,
    };
  }

  if (isTomorrow(date)) {
    return {
      top: "Tomorrow",
      bottom,
    };
  }

  return {
    top: format(new Date(date), "EEE"),
    bottom,
  };
}

export function generateDates(daysAhead) {
  return Array.from({ length: daysAhead }, (_, index) =>
    addDays(new Date(), index)
  );
}

export function generateSlots(
  date,
  availabilityStartTime,
  availabilityEndTime,
  bookedSlots = [],
  slotDurationMinutes = 45
) {
  const availabilityStart = new Date(availabilityStartTime);
  const availabilityEnd = new Date(availabilityEndTime);

  const start = set(new Date(date), {
    hours: availabilityStart.getHours(),
    minutes: availabilityStart.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });

  const end = set(new Date(date), {
    hours: availabilityEnd.getHours(),
    minutes: availabilityEnd.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });

  const now = new Date();
  const slots = [];

  let cursor = start;

  while (isBefore(cursor, end)) {
    const slotEnd = addMinutes(cursor, slotDurationMinutes);

    if (isAfter(slotEnd, end)) {
      break;
    }

    const isBooked = bookedSlots.some((booking) => {
      const bookedStart = new Date(booking.startTime);
      const bookedEnd = new Date(booking.endTime);

      return isBefore(cursor, bookedEnd) && isAfter(slotEnd, bookedStart);
    });

    if (isAfter(cursor, now)) {
      slots.push({
        startTime: cursor,
        endTime: slotEnd,
        isBooked,
        available: !isBooked,
      });
    }

    cursor = slotEnd;
  }

  return slots;
}