import type { Metadata } from "next";

import { EventsDirectory } from "@/components/events/events-directory";
import { Hero } from "@/components/ui/hero";
import { events } from "@/data/events";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Events",
  description:
    "Find public meetings, activities, and events from the North East Texas Young Republicans.",
  path: "/events/",
});

export default function EventsPage() {
  const eventsEndpoint = process.env.NEXT_PUBLIC_EVENTS_ENDPOINT;

  return (
    <>
      <Hero
        compact
        description="Join NETYR for meetings, socials, volunteer opportunities, and other activities across Northeast Texas."
        eyebrow="Events"
        title="Connect in person"
      />
      <EventsDirectory endpoint={eventsEndpoint} initialEvents={events} />
    </>
  );
}
