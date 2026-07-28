import type { Metadata } from "next";

import { SponsorDirectory } from "@/components/sponsors/sponsor-directory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { sponsorProgram, sponsors } from "@/data/sponsors";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Sponsors",
  description:
    "Learn about sponsorship opportunities and community partners of the North East Texas Young Republicans.",
  path: "/sponsors/",
});

export default function SponsorsPage() {
  const sponsorsFeedUrl = process.env.NEXT_PUBLIC_SPONSORS_FEED_URL;

  return (
    <>
      <Hero
        compact
        description="Community partners can help NETYR create meaningful opportunities while connecting with young conservative leaders across Northeast Texas."
        eyebrow="Sponsors"
        title="Support the work. Strengthen the network."
      />
      <Section
        description="NETYR recognizes contributing members through the classifications established in the organization’s governing documents."
        eyebrow="Program"
        title="Contributing membership"
        tone="white"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {sponsorProgram.tiers.map((tier) => (
            <Card key={tier.name}>
              <p className="text-brand-blue text-xs font-bold tracking-[0.14em] uppercase">
                {tier.amount}
              </p>
              <h3 className="text-brand-navy mt-2 text-2xl font-bold uppercase">
                {tier.name}
              </h3>
            </Card>
          ))}
        </div>
        <Button
          className="mt-7"
          data-analytics-context="sponsors_page"
          data-analytics-event="sponsor_interest_click"
          data-analytics-label="ask_about_sponsorship"
          href="/contact/"
        >
          Ask about sponsorship
        </Button>
      </Section>
      <Section
        description="We are grateful to the community partners who help NETYR connect, serve, and lead."
        eyebrow="Recognition"
        title="Community partners"
      >
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
          href="/contact/"
        >
          Contact NETYR
        </Button>
      </Section>
    </>
  );
}
