import type { Event, EventStatus } from "@/types/content";

export type EventProvider = {
  getEvents: () => Promise<Event[]>;
};

type FeedEvent = {
  allDay?: unknown;
  date?: unknown;
  description?: unknown;
  detailsUrl?: unknown;
  end?: unknown;
  endDate?: unknown;
  featured?: unknown;
  graphicAlt?: unknown;
  graphicUrl?: unknown;
  id?: unknown;
  location?: unknown;
  registrationUrl?: unknown;
  slug?: unknown;
  start?: unknown;
  status?: unknown;
  title?: unknown;
};

const allowedStatuses: EventStatus[] = [
  "upcoming",
  "completed",
  "sold-out",
  "cancelled",
];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPublicUrl(value: unknown) {
  const candidate = asString(value);

  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "event"
  );
}

function eventStatus(
  status: unknown,
  endDate: string | undefined,
  startDate: string,
): EventStatus {
  if (
    typeof status === "string" &&
    allowedStatuses.includes(status as EventStatus)
  ) {
    return status as EventStatus;
  }

  const comparisonDate = new Date(endDate ?? startDate);
  return !Number.isNaN(comparisonDate.valueOf()) &&
    comparisonDate.valueOf() < Date.now()
    ? "completed"
    : "upcoming";
}

export function normalizeEvent(value: unknown): Event | null {
  if (!value || typeof value !== "object") return null;

  const source = value as FeedEvent;
  const title = asString(source.title);
  const date = asString(source.start ?? source.date);
  const endDate = asString(source.end ?? source.endDate) || undefined;

  if (!title || !date || Number.isNaN(new Date(date).valueOf())) return null;

  const id = asString(source.id) || undefined;
  const slug =
    asString(source.slug) ||
    `${slugify(title)}-${slugify(id ?? date.slice(0, 10))}`;

  return {
    allDay: source.allDay === true,
    date,
    description: asString(source.description),
    detailsUrl: asPublicUrl(source.detailsUrl),
    endDate,
    featured: source.featured === true,
    graphicAlt: asString(source.graphicAlt) || undefined,
    graphicUrl: asPublicUrl(source.graphicUrl),
    id,
    location: asString(source.location) || undefined,
    registrationUrl: asPublicUrl(source.registrationUrl),
    slug,
    status: eventStatus(source.status, endDate, date),
    title,
  };
}

export function parseEventFeed(payload: unknown) {
  const source = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        Array.isArray((payload as { events?: unknown }).events)
      ? (payload as { events: unknown[] }).events
      : [];

  return source
    .map(normalizeEvent)
    .filter((event): event is Event => Boolean(event))
    .sort(
      (left, right) =>
        new Date(left.date).valueOf() - new Date(right.date).valueOf(),
    );
}

export function buildAddToCalendarUrl(event: Event) {
  const start = toGoogleCalendarDate(event.date, event.allDay);
  const end = toGoogleCalendarDate(event.endDate ?? event.date, event.allDay);
  const parameters = new URLSearchParams({
    action: "TEMPLATE",
    dates: `${start}/${end}`,
    details: event.description,
    location: event.location ?? "",
    text: event.title,
  });

  return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
}

function toGoogleCalendarDate(value: string, allDay = false) {
  if (allDay) return value.slice(0, 10).replaceAll("-", "");

  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? value.replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    : date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
}
