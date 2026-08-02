import type { Metadata } from "next";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "NETYR Governing Documents | Public Records",
  description:
    "Find information about approved public records for the North East Texas Young Republicans and how to request current materials.",
  path: "/governing-documents/",
});

export default function GoverningDocumentsPage() {
  return (
    <>
      <AnalyticsView
        category="public_records"
        event="governing_document_view"
      />
      <Hero
        compact
        description="Learn where to find approved public records and how to request current organizational materials."
        eyebrow="Public records"
        title="Governing documents"
      />
      <Section
        description="NETYR maintains records that guide its operations and membership. Approved public copies will be posted here after publication review."
        eyebrow="Current materials"
        title="Public records from NETYR"
        tone="white"
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/about/" variant="secondary">
            Learn about NETYR
          </Button>
          <Button href="/membership/" variant="secondary">
            Review membership
          </Button>
        </div>
      </Section>
      <Callout
        actions={<Button href="/contact/">Request information</Button>}
        description="Contact NETYR with a question about an approved public organizational record."
        title="Need a current public copy?"
      />
    </>
  );
}
