"use client";

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

  return (
    <Section
      description="Choose a month to see only the public NETYR events scheduled during that month."
      eyebrow="Calendar"
      title="NETYR public events"
      tone="white"
    >
      {isLoading ? (
        <p aria-live="polite" className="text-slate-600">
          Loading public events…
        </p>
      ) : couldNotLoad ? (
        <EmptyState
          description="The public events connection is temporarily unavailable. Please check back soon."
          title="Events could not be loaded"
        />
      ) : (
        <EventCalendar events={events} />
      )}
    </Section>
  );
}
