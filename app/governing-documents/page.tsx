import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/empty-state";
import { FeatureCard } from "@/components/ui/feature-card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { governingDocuments } from "@/data/governing-documents";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Governing Documents",
  description:
    "Find public governing documents for the North East Texas Young Republicans.",
  path: "/governing-documents/",
});

export default function GoverningDocumentsPage() {
  const publishedDocuments = governingDocuments.filter(
    (document) => document.publicStatus === "approved" && document.href,
  );

  return (
    <>
      <Hero
        compact
        description="Find NETYR governing documents and other chapter records available for public review."
        eyebrow="Governance"
        title="Governing documents"
      />
      <Section
        description="Public copies will be posted here as they become available."
        eyebrow="Chapter records"
        title="Available documents"
        tone="white"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {governingDocuments.map((document) => (
            <FeatureCard
              eyebrow={
                document.publicStatus === "approved"
                  ? "Available"
                  : "Not yet available"
              }
              key={document.title}
              title={document.title}
            >
              <p>{document.description}</p>
              {document.effectiveDate ? (
                <p className="mt-3 text-sm font-semibold">
                  Effective date: {document.effectiveDate}
                </p>
              ) : null}
              {document.href ? (
                <a
                  className="text-brand-blue mt-5 inline-flex min-h-11 items-center font-bold underline"
                  href={document.href}
                >
                  View {document.fileType}
                </a>
              ) : (
                <p className="mt-5 text-sm font-semibold text-slate-500">
                  A public download is not currently available.
                </p>
              )}
            </FeatureCard>
          ))}
        </div>
      </Section>
      {publishedDocuments.length === 0 ? (
        <Section>
          <EmptyState
            description="Public copies of NETYR governing documents will be posted here when available."
            title="Documents coming soon"
          />
        </Section>
      ) : null}
      <Section
        description="NETYR is part of the Texas Young Republican Federation, which maintains separate statewide governing materials."
        eyebrow="Federation"
        title="Statewide resources"
        tone="navy"
      >
        <p className="max-w-3xl leading-7 text-slate-300">
          Visit the About page to learn more about NETYR&apos;s connection to
          the statewide Young Republican network.
        </p>
      </Section>
    </>
  );
}
