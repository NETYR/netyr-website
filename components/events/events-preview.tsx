"use client";

import { EventCard } from "@/components/events/event-card";
import { useEvents } from "@/components/events/use-events";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { Event } from "@/types/content";

type EventsPreviewProps = {
  endpoint?: string;
  initialEvents: Event[];
};

export function EventsPreview({ endpoint, initialEvents }: EventsPreviewProps) {
  const { events, isLoading } = useEvents(initialEvents, endpoint);
  const upcoming = events
    .filter(
      (event) => event.status !== "completed" && event.status !== "cancelled",
    )
    .slice(0, 3);

  if (isLoading) {
    return (
      <p aria-live="polite" className="text-slate-600">
        Loading upcoming events…
      </p>
    );
  }

  if (upcoming.length === 0) {
    return (
      <EmptyState
        action={<Button href="/events/">Visit the events page</Button>}
        description="Upcoming events will be posted here soon. Check back for meetings, socials, volunteer opportunities, and other NETYR activities."
        title="More events are on the way"
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {upcoming.map((event) => (
          <EventCard event={event} key={event.id ?? event.slug} />
        ))}
      </div>
      <Button className="mt-8" href="/events/" variant="secondary">
        View all events
      </Button>
    </>
  );
}
