import type { Metadata } from "next";

import { SponsorDirectory } from "@/components/sponsors/sponsor-directory";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { sponsors } from "@/data/sponsors";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "NETYR Community Partners and Sponsors",
  description:
    "Recognizing the community partners and sponsors who support the mission of the North East Texas Young Republicans.",
  path: "/sponsors/",
});

export default function SponsorsPage() {
  const sponsorsFeedUrl = process.env.NEXT_PUBLIC_SPONSORS_FEED_URL;

  return (
    <>
      <Hero
        compact
        description="We are proud to recognize the community partners whose support helps NETYR connect, serve, and lead across Northeast Texas."
        eyebrow="Community Partners"
        title="Investing in the next generation"
      />
      <Section
        description="We are proud to recognize the community partners who support NETYR."
        eyebrow="Recognition"
        title="Community partners"
        tone="white"
      >
        <Button
          className="mb-10"
          data-analytics-context="sponsors_page"
          data-analytics-event="sponsor_interest_click"
          data-analytics-label="ask_about_sponsorship"
          href="/contact/#contact-form"
        >
          Ask about sponsorship
        </Button>
        <SponsorDirectory
          feedUrl={sponsorsFeedUrl}
          initialSponsors={sponsors}
        />
      </Section>
      <Section
        description="Tell us about your organization and how you would like to support NETYR."
        eyebrow="Get started"
        title="Start a partnership conversation"
        tone="navy"
      >
        <Button
          data-analytics-context="sponsors_page"
          data-analytics-event="sponsor_interest_click"
          data-analytics-label="start_partnership_conversation"
          href="/contact/#contact-form"
        >
          Contact NETYR
        </Button>
      </Section>
    </>
  );
}
