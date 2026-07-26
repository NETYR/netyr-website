"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { buildAddToCalendarUrl } from "@/lib/events/provider";
import { cn } from "@/lib/cn";
import type { Event } from "@/types/content";

const centralTime = "America/Chicago";

function formatDate(event: Event) {
  const date = new Date(event.date);
  if (Number.isNaN(date.valueOf())) return event.date;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: centralTime,
  }).format(date);
}

function formatTime(event: Event) {
  if (event.allDay) return "All day";

  const start = new Date(event.date);
  if (Number.isNaN(start.valueOf())) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: centralTime,
    timeZoneName: "short",
  });
  const end = event.endDate ? new Date(event.endDate) : null;

  if (!end || Number.isNaN(end.valueOf())) return formatter.format(start);
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function EventCard({ event }: { event: Event }) {
  const [imageFailed, setImageFailed] = useState(false);
  const detailsUrl = event.registrationUrl ?? event.detailsUrl;

  return (
    <Card
      className={cn(
        "overflow-hidden p-0",
        event.featured && "border-brand-red ring-brand-red/15 ring-4",
      )}
    >
      <div className="bg-brand-navy relative aspect-[16/9] overflow-hidden">
        {event.graphicUrl && !imageFailed ? (
          // Remote event graphics are administered outside the repository.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={event.graphicAlt ?? `${event.title} event graphic`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
            referrerPolicy="no-referrer"
            src={event.graphicUrl}
          />
        ) : (
          <div className="from-brand-navy via-brand-blue flex h-full items-center justify-center bg-gradient-to-br to-blue-900 p-8 text-center text-white">
            <div>
              <span
                aria-hidden="true"
                className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/35 text-xl font-black"
              >
                N
              </span>
              <p className="mt-4 text-sm font-black tracking-[0.16em] uppercase">
                NETYR Event
              </p>
            </div>
          </div>
        )}
        {event.featured ? (
          <span className="bg-brand-red-dark absolute top-3 left-3 rounded-sm px-3 py-1 text-xs font-black tracking-wider text-white uppercase">
            Featured
          </span>
        ) : null}
      </div>
      <div className="p-6">
        <p className="text-brand-blue text-xs font-bold tracking-[0.14em] uppercase">
          {formatDate(event)}
        </p>
        <h3 className="text-brand-navy mt-2 text-2xl font-bold uppercase">
          {event.title}
        </h3>
        <dl className="mt-4 grid gap-2 text-sm text-slate-600">
          <div>
            <dt className="sr-only">Time</dt>
            <dd className="font-semibold">{formatTime(event)}</dd>
          </div>
          {event.location ? (
            <div>
              <dt className="sr-only">Location</dt>
              <dd>{event.location}</dd>
            </div>
          ) : null}
        </dl>
        {event.description ? (
          <p className="mt-4 leading-7 text-slate-600">{event.description}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {detailsUrl ? (
            <a
              className="text-brand-blue inline-flex min-h-11 items-center font-bold underline underline-offset-4"
              href={detailsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Registration or details
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
          {event.status !== "completed" && event.status !== "cancelled" ? (
            <a
              className="text-brand-blue inline-flex min-h-11 items-center font-bold underline underline-offset-4"
              href={buildAddToCalendarUrl(event)}
              rel="noopener noreferrer"
              target="_blank"
            >
              Add to Google Calendar
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
