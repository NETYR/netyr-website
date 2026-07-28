import type { Event } from "@/types/content";

const centralTimeZone = "America/Chicago";

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
