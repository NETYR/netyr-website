"use client";

import { EventCard } from "@/components/events/event-card";
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
        description="Plan your next chance to connect with NETYR."
        eyebrow="Calendar"
        title="Upcoming events"
        tone="white"
      >
        {isLoading ? (
          <p aria-live="polite" className="text-slate-600">
            Loading upcoming events…
          </p>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard event={event} key={event.id ?? event.slug} />
            ))}
          </div>
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
