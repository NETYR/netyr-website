import { siteConfig } from "@/lib/site";
import type { Event } from "@/types/content";

export function EventJsonLd({ event }: { event: Event }) {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || undefined,
    startDate: event.date,
    endDate: event.endDate,
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: event.location
      ? "https://schema.org/OfflineEventAttendanceMode"
      : undefined,
    image: event.graphicUrl ? [event.graphicUrl] : undefined,
    location: event.location
      ? {
          "@type": "Place",
          name: event.location,
        }
      : undefined,
    organizer: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url:
      event.detailsUrl ?? event.registrationUrl ?? `${siteConfig.url}/events/`,
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(eventJsonLd).replaceAll("<", "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
