import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { cheddarUpLinks } from "@/data/cheddar-up";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Donate to NETYR | North East Texas Young Republicans",
  description:
    "Support the North East Texas Young Republicans through its secure external contribution collection.",
  path: "/donate/",
});

export default function DonatePage() {
  return (
    <>
      <Hero
        compact
        description="Support NETYR through the chapter's approved external payment collection."
        eyebrow="Donate"
        title="Support the next generation of Republican leadership"
      />
      <Section
        description="Payments are completed securely through Cheddar Up, an external provider. NETYR does not collect or process card information on this website."
        eyebrow="Support NETYR"
        title="Continue to the approved payment collection"
        tone="white"
      >
        <Button
          data-analytics-context="donate_page"
          data-analytics-event="donate_click"
          data-analytics-label="continue_to_cheddar_up"
          href={cheddarUpLinks.donations}
          rel="noopener noreferrer"
          target="_blank"
        >
          Continue to Cheddar Up
          <span className="sr-only"> (opens in a new tab)</span>
        </Button>
      </Section>
    </>
  );
}
