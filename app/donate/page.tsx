import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Donate",
  description:
    "Review NETYR's external donation process and important payment disclosures.",
  path: "/donate/",
});

export default function DonatePage() {
  return (
    <>
      <Hero
        compact
        description="Support helps NETYR create opportunities for young Republicans to connect, serve, and lead."
        eyebrow="Donate"
        title="Support the next generation of Republican leadership"
      />
      <Section
        description="Online giving is not available at this time."
        eyebrow="Giving"
        title="Donation information coming soon"
        tone="white"
      >
        <EmptyState
          action={<Button href="/contact/">Contact NETYR</Button>}
          description="Please check back for future ways to support NETYR, or contact our team with a question."
          title="Check back soon"
        />
      </Section>
    </>
  );
}
