import type { Metadata } from "next";

import { DonateForward } from "@/components/donate/donate-forward";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { cheddarUpLinks } from "@/data/cheddar-up";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Donate",
  description:
    "Support NETYR through its approved external payment collection.",
  path: "/donate/",
});

export default function DonatePage() {
  return (
    <>
      <DonateForward href={cheddarUpLinks.donations} />
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
