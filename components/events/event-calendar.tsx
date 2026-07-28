"use client";

import { useEffect, useMemo, useState } from "react";

import { EventJsonLd } from "@/components/seo/event-json-ld";
import { Card } from "@/components/ui/card";
import {
  eventMonthKey,
  formatEventDate,
  formatEventTime,
} from "@/lib/events/format";
import { buildAddToCalendarUrl } from "@/lib/events/provider";
import type { Event } from "@/types/content";

function monthLabel(month: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(month);
}

function monthKey(month: Date) {
  return `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

function monthFromKey(value: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (!Number.isInteger(year) || month < 0 || month > 11) return null;

  return new Date(Date.UTC(year, month, 1));
}

function currentCentralMonth() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== "literal") result[part.type] = part.value;
      return result;
    }, {});

  return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, 1));
}

export function EventCalendar({ events }: { events: Event[] }) {
  const [visibleMonth, setVisibleMonth] = useState(currentCentralMonth);

  useEffect(() => {
    const requestedMonth = new URLSearchParams(window.location.search).get(
      "month",
    );
    const parsedMonth = requestedMonth ? monthFromKey(requestedMonth) : null;
    if (!parsedMonth) return;

    const update = window.setTimeout(() => setVisibleMonth(parsedMonth), 0);
    return () => window.clearTimeout(update);
  }, []);

  const visibleMonthKey = monthKey(visibleMonth);
  const monthEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            event.status !== "cancelled" &&
            eventMonthKey(event.date) === visibleMonthKey,
        )
        .sort(
          (left, right) =>
            new Date(left.date).valueOf() - new Date(right.date).valueOf(),
        ),
    [events, visibleMonthKey],
  );

  const year = visibleMonth.getUTCFullYear();
  const month = visibleMonth.getUTCMonth();
  const previousMonth = new Date(Date.UTC(year, month - 1, 1));
  const nextMonth = new Date(Date.UTC(year, month + 1, 1));

  return (
    <div>
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            aria-label={`Show ${monthLabel(previousMonth)}`}
            className="text-brand-navy focus-visible:outline-brand-blue inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-slate-200 font-bold hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => setVisibleMonth(previousMonth)}
            type="button"
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <div className="text-center">
            <p className="text-brand-blue text-xs font-bold tracking-[0.14em] uppercase">
              Public events
            </p>
            <h3 className="text-brand-navy mt-1 text-2xl font-bold uppercase sm:text-3xl">
              {monthLabel(visibleMonth)}
            </h3>
          </div>
          <button
            aria-label={`Show ${monthLabel(nextMonth)}`}
            className="text-brand-navy focus-visible:outline-brand-blue inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-slate-200 font-bold hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => setVisibleMonth(nextMonth)}
            type="button"
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </Card>

      <div aria-live="polite" className="mt-6">
        {monthEvents.length === 0 ? (
          <Card className="border-dashed bg-slate-50 text-center">
            <p className="text-brand-navy text-lg font-bold">
              No public events are currently scheduled for this month.
            </p>
          </Card>
        ) : (
          <ol className="grid gap-5">
            {monthEvents.map((event) => {
              const detailsUrl = event.registrationUrl ?? event.detailsUrl;
              const eventId = `event-${event.id ?? event.slug}`;

              return (
                <li id={eventId} key={event.id ?? event.slug}>
                  <EventJsonLd event={event} />
                  <Card className="grid gap-5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:p-7">
                    <div className="border-brand-blue/25 bg-brand-paper flex min-h-24 flex-col items-center justify-center rounded-sm border px-3 py-4 text-center">
                      <span className="text-brand-blue text-xs font-black tracking-[0.14em] uppercase">
                        {formatEventDate(event, { month: "short" })}
                      </span>
                      <span className="text-brand-navy mt-1 text-4xl leading-none font-black">
                        {formatEventDate(event, { day: "numeric" })}
                      </span>
                      <span className="mt-2 text-xs font-bold text-slate-600">
                        {formatEventDate(event, { weekday: "short" })}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-brand-navy text-2xl font-bold uppercase">
                        {event.title}
                      </h3>
                      <dl className="mt-3 grid gap-2 text-sm text-slate-700">
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="font-bold">Time:</dt>
                          <dd>{formatEventTime(event)}</dd>
                        </div>
                        {event.location ? (
                          <div className="flex flex-wrap gap-x-2">
                            <dt className="font-bold">Location:</dt>
                            <dd>{event.location}</dd>
                          </div>
                        ) : null}
                      </dl>
                      {event.description ? (
                        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                          {event.description}
                        </p>
                      ) : null}
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {detailsUrl ? (
                          <a
                            className="text-brand-blue inline-flex min-h-11 items-center font-bold underline underline-offset-4"
                            data-analytics-context="events"
                            data-analytics-event="event_link_click"
                            data-analytics-label="registration_or_details"
                            href={detailsUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Event details or registration
                            <span className="sr-only">
                              {" "}
                              (opens in a new tab)
                            </span>
                          </a>
                        ) : null}
                        {event.status !== "completed" ? (
                          <a
                            className="text-brand-blue inline-flex min-h-11 items-center font-bold underline underline-offset-4"
                            data-analytics-context="events"
                            data-analytics-event="event_link_click"
                            data-analytics-label="add_to_google_calendar"
                            href={buildAddToCalendarUrl(event)}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Add to Google Calendar
                            <span className="sr-only">
                              {" "}
                              (opens in a new tab)
                            </span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
