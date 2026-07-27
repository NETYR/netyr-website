"use client";

import { EventCard } from "@/components/events/event-card";
import { EventCalendar } from "@/components/events/event-calendar";
import { useEvents } from "@/components/events/use-events";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import type { Event } from "@/types/content";

type EventsDirectoryProps = {
  endpoint?: string;
  initialEvents: Event[];
};

export function EventsDirectory({
  endpoint,
  initialEvents,
}: EventsDirectoryProps) {
  const { couldNotLoad, events, isLoading } = useEvents(
    initialEvents,
    endpoint,
  );
  const upcomingEvents = events.filter(
    (event) => event.status !== "completed" && event.status !== "cancelled",
  );
  const pastEvents = events.filter((event) => event.status === "completed");

  return (
    <>
      <Section
        description="Browse the NETYR calendar, select a date for details, and plan your next chance to connect."
        eyebrow="Calendar"
        title="NETYR event calendar"
        tone="white"
      >
        {isLoading ? (
          <p aria-live="polite" className="text-slate-600">
            Loading upcoming events…
          </p>
        ) : upcomingEvents.length > 0 ? (
          <EventCalendar events={upcomingEvents} />
        ) : (
          <EmptyState
            description={
              couldNotLoad
                ? "Events could not be loaded right now. Please check back soon."
                : "Upcoming events will be posted here soon. Check back for meetings, socials, volunteer opportunities, and other NETYR activities."
            }
            title={
              couldNotLoad
                ? "Please try again later"
                : "More events are on the way"
            }
          />
        )}
      </Section>
      {upcomingEvents.length > 0 ? (
        <Section
          description="Every upcoming event from the NETYR public calendar, ordered by date."
          eyebrow="Coming up"
          title="Upcoming events"
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard event={event} key={event.id ?? event.slug} />
            ))}
          </div>
        </Section>
      ) : null}
      {pastEvents.length > 0 ? (
        <Section
          description="Look back at recent NETYR meetings and activities."
          eyebrow="Archive"
          title="Past events"
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard event={event} key={event.id ?? event.slug} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
