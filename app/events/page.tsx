import type { Metadata } from "next";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { EventsDirectory } from "@/components/events/events-directory";
import { Hero } from "@/components/ui/hero";
import { events } from "@/data/events";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "NETYR Events | Meetings, Service and Conservative Engagement",
  description:
    "View upcoming North East Texas Young Republicans meetings, socials, volunteer opportunities, and public events.",
  path: "/events/",
});

export default function EventsPage() {
  const eventsEndpoint = process.env.NEXT_PUBLIC_EVENTS_ENDPOINT;

  return (
    <>
      <AnalyticsView category="events_page" event="event_view" />
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
