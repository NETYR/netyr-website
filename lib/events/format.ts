import type { Event } from "@/types/content";

const centralTimeZone = "America/Chicago";

function dateParts(value: Date, timeZone = centralTimeZone) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  })
    .formatToParts(value)
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== "literal") result[part.type] = part.value;
      return result;
    }, {});
}

function allDayDate(value: string, subtractDays = 0) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return null;

  const parts = dateParts(parsed);
  return new Date(
    Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day) - subtractDays,
    ),
  );
}

export function eventMonthKey(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: centralTimeZone,
    year: "numeric",
    month: "2-digit",
  })
    .formatToParts(parsed)
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== "literal") result[part.type] = part.value;
      return result;
    }, {});

  return `${parts.year}-${parts.month}`;
}

export function formatEventDate(
  event: Event,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "full",
  },
) {
  const date = new Date(event.date);
  if (Number.isNaN(date.valueOf())) return event.date;

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: centralTimeZone,
  }).format(date);
}

export function formatEventDateRange(event: Event) {
  const start = event.allDay ? allDayDate(event.date) : new Date(event.date);
  const rawEnd = event.endDate
    ? event.allDay
      ? allDayDate(event.endDate, 1)
      : new Date(event.endDate)
    : null;

  if (!start || Number.isNaN(start.valueOf())) return event.date;

  const timeZone = event.allDay ? "UTC" : centralTimeZone;
  const end =
    rawEnd && !Number.isNaN(rawEnd.valueOf()) && rawEnd >= start
      ? rawEnd
      : null;
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone,
    year: "numeric",
  });

  if (!end || dateFormatter.format(start) === dateFormatter.format(end)) {
    return dateFormatter.format(start);
  }

  const startParts = dateParts(start, timeZone);
  const endParts = dateParts(end, timeZone);
  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone,
  });

  if (
    startParts.year === endParts.year &&
    startParts.month === endParts.month
  ) {
    return `${monthFormatter.format(start)} ${Number(startParts.day)}–${Number(
      endParts.day,
    )}, ${startParts.year}`;
  }

  if (startParts.year === endParts.year) {
    return `${monthFormatter.format(start)} ${Number(
      startParts.day,
    )} – ${monthFormatter.format(end)} ${Number(endParts.day)}, ${
      startParts.year
    }`;
  }

  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}

export function formatEventTime(event: Event, includeZone = true) {
  if (event.allDay) return "All day";

  const start = new Date(event.date);
  if (Number.isNaN(start.valueOf())) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: centralTimeZone,
    ...(includeZone ? { timeZoneName: "short" } : {}),
  });
  const end = event.endDate ? new Date(event.endDate) : null;

  if (!end || Number.isNaN(end.valueOf())) return formatter.format(start);
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function isFutureEvent(event: Event, now = Date.now()) {
  if (event.status === "cancelled" || event.status === "completed")
    return false;

  const comparison = new Date(event.endDate ?? event.date).valueOf();
  return !Number.isNaN(comparison) && comparison >= now;
}
