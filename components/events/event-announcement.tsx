"use client";

import { useEvents } from "@/components/events/use-events";
import {
  formatEventDate,
  formatEventTime,
  isFutureEvent,
} from "@/lib/events/format";
import type { Event } from "@/types/content";

type EventAnnouncementProps = {
  endpoint?: string;
  initialEvents?: Event[];
};

function eventHref(event: Event) {
  const detailsUrl = event.registrationUrl ?? event.detailsUrl;
  if (detailsUrl) return detailsUrl;

  const month = event.date.slice(0, 7);
  return `/events/?month=${encodeURIComponent(month)}#event-${encodeURIComponent(
    event.id ?? event.slug,
  )}`;
}

export function EventAnnouncement({
  endpoint,
  initialEvents = [],
}: EventAnnouncementProps) {
  const { events, isLoading } = useEvents(initialEvents, endpoint);
  const nextEvent = events.find((event) => isFutureEvent(event));

  if (isLoading || !nextEvent) return null;

  const href = eventHref(nextEvent);
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <aside
      aria-label="Next NETYR event"
      className="bg-brand-navy border-b border-white/10 text-white"
    >
      <div className="mx-auto flex min-h-11 w-full max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm sm:px-6 lg:px-8">
        <span className="font-black tracking-wide uppercase">
          {nextEvent.title}
        </span>
        <span className="text-blue-100">
          {formatEventDate(nextEvent, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
          <span aria-hidden="true"> · </span>
          {formatEventTime(nextEvent, false)}
        </span>
        <a
          className="focus-visible:outline-brand-blue inline-flex min-h-9 items-center rounded-sm font-bold text-white underline decoration-blue-300 underline-offset-4 hover:text-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2"
          href={href}
          rel={isExternal ? "noopener noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          View event
          {isExternal ? (
            <span className="sr-only"> (opens in a new tab)</span>
          ) : null}
        </a>
      </div>
    </aside>
  );
}
