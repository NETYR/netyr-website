"use client";

import { useMemo, useState } from "react";

import { EventCard } from "@/components/events/event-card";
import { Card } from "@/components/ui/card";
import type { Event } from "@/types/content";

const centralTime = "America/Chicago";
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: centralTime,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(parsed)
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== "literal") result[part.type] = part.value;
      return result;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function monthLabel(month: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(month);
}

function eventDateLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: centralTime,
    weekday: "long",
  }).format(new Date(`${date}T12:00:00-05:00`));
}

export function EventCalendar({ events }: { events: Event[] }) {
  const currentMonth = new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), 1)),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((event) => {
      const key = dateKey(event.date);
      if (!key) return;
      map.set(key, [...(map.get(key) ?? []), event]);
    });
    return map;
  }, [events]);

  const year = visibleMonth.getUTCFullYear();
  const month = visibleMonth.getUTCMonth();
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const days = Array.from({ length: firstWeekday + daysInMonth }, (_, index) =>
    index < firstWeekday ? null : index - firstWeekday + 1,
  );
  const selectedEvents = selectedDate
    ? (eventsByDate.get(selectedDate) ?? [])
    : [];

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <button
            aria-label={`Show ${monthLabel(new Date(Date.UTC(year, month - 1, 1)))}`}
            className="text-brand-navy focus-visible:outline-brand-blue inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-slate-200 font-bold hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() =>
              setVisibleMonth(new Date(Date.UTC(year, month - 1, 1)))
            }
            type="button"
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <h3 className="text-brand-navy text-center text-xl font-bold uppercase sm:text-2xl">
            {monthLabel(visibleMonth)}
          </h3>
          <button
            aria-label={`Show ${monthLabel(new Date(Date.UTC(year, month + 1, 1)))}`}
            className="text-brand-navy focus-visible:outline-brand-blue inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-slate-200 font-bold hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() =>
              setVisibleMonth(new Date(Date.UTC(year, month + 1, 1)))
            }
            type="button"
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-px overflow-hidden rounded-sm border border-slate-200 bg-slate-200">
          {weekdayLabels.map((label) => (
            <div
              className="bg-slate-50 px-1 py-2 text-center text-[0.65rem] font-bold tracking-wide text-slate-600 uppercase sm:text-xs"
              key={label}
            >
              <span className="sm:hidden">{label.slice(0, 1)}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
          {days.map((day, index) => {
            if (!day) {
              return (
                <div className="min-h-20 bg-white sm:min-h-28" key={index} />
              );
            }

            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventsByDate.get(key) ?? [];
            const isSelected = selectedDate === key;
            const label = `${eventDateLabel(key)}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}` : ""}`;

            return (
              <button
                aria-label={label}
                aria-pressed={isSelected}
                className={`focus-visible:outline-brand-blue min-h-20 bg-white p-1.5 text-left align-top hover:bg-blue-50 focus-visible:z-10 focus-visible:outline-2 sm:min-h-28 sm:p-2 ${
                  isSelected
                    ? "ring-brand-blue bg-blue-50 ring-2 ring-inset"
                    : ""
                }`}
                key={key}
                onClick={() => setSelectedDate(key)}
                type="button"
              >
                <span className="text-brand-navy text-sm font-bold">{day}</span>
                {dayEvents.slice(0, 2).map((event) => (
                  <span
                    className="bg-brand-blue mt-1 block truncate rounded-sm px-1.5 py-0.5 text-[0.6rem] font-bold text-white sm:text-xs"
                    key={event.id ?? event.slug}
                    title={event.title}
                  >
                    {event.title}
                  </span>
                ))}
                {dayEvents.length > 2 ? (
                  <span className="mt-1 block text-[0.6rem] font-bold text-slate-600 sm:text-xs">
                    +{dayEvents.length - 2} more
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>
      <aside aria-live="polite" className="self-start">
        <Card className="bg-slate-50">
          <p className="text-brand-blue text-xs font-bold tracking-[0.14em] uppercase">
            {selectedDate ? eventDateLabel(selectedDate) : "Select a date"}
          </p>
          <h3 className="text-brand-navy mt-2 text-2xl font-bold uppercase">
            {selectedDate
              ? selectedEvents.length
                ? "Events on this date"
                : "No events scheduled"
              : "Event details"}
          </h3>
          <p className="mt-3 leading-7 text-slate-600">
            {selectedDate
              ? selectedEvents.length
                ? "Choose an event below for its full details."
                : "Choose another date to see NETYR events."
              : "Use the calendar to find a date and view every event scheduled for it."}
          </p>
        </Card>
        {selectedEvents.length > 0 ? (
          <div className="mt-5 grid gap-5">
            {selectedEvents.map((event) => (
              <EventCard event={event} key={event.id ?? event.slug} />
            ))}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
