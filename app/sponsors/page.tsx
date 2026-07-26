import type { Metadata } from "next";

import { SponsorDirectory } from "@/components/sponsors/sponsor-directory";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
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
        description="NETYR is developing opportunities for businesses, organizations, and community partners to support our work."
        eyebrow="Program"
        title="Partner with NETYR"
        tone="white"
      >
        {sponsorProgram.tiers.length === 0 ? (
          <EmptyState
            action={<Button href="/contact/">Ask about sponsorship</Button>}
            description="Interested in partnering with NETYR? Contact our team to start a conversation."
            title="Sponsorship opportunities are coming"
          />
        ) : null}
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
        <Button href="/contact/">Contact NETYR</Button>
      </Section>
    </>
  );
}
