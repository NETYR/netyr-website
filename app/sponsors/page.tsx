import type { Metadata } from "next";

import { SponsorDirectory } from "@/components/sponsors/sponsor-directory";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { sponsorProgram, sponsors } from "@/data/sponsors";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Community Partners",
  description:
    "Recognizing approved NETYR community partners by cumulative contributing-membership classification.",
  path: "/sponsors/",
});

export default function SponsorsPage() {
  const sponsorsFeedUrl = process.env.NEXT_PUBLIC_SPONSORS_FEED_URL;

  return (
    <>
      <Hero
        compact
        description="Community partners can help NETYR create meaningful opportunities while connecting with young conservative leaders across Northeast Texas."
        eyebrow="Community Partners"
        title="Support the work. Strengthen the network."
      />
      <Section
        description="NETYR recognizes contributing members through the classifications established in the organization’s governing documents."
        eyebrow="Program"
        title="Contributing membership"
        tone="white"
      >
        <dl className="grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-3">
          {sponsorProgram.tiers.map((tier) => (
            <div className="border-brand-blue border-l-2 pl-4" key={tier.name}>
              <dt className="text-brand-navy text-lg font-bold uppercase">
                {tier.name}
              </dt>
              <dd className="text-brand-blue mt-1 text-sm font-bold">
                {tier.amount}
              </dd>
            </div>
          ))}
        </dl>
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
