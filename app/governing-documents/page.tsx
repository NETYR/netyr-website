import type { Metadata } from "next";

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
  return (
    <>
      <Hero
        compact
        description="Review the official records that guide NETYR's organization and membership."
        eyebrow="Governance"
        title="Governing documents"
      />
      <Section
        description="The official governing document controls if a summary elsewhere on this website differs from it."
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
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  <a
                    className="text-brand-blue inline-flex min-h-11 items-center font-bold underline underline-offset-4"
                    href={document.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View {document.fileType}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <a
                    className="text-brand-blue inline-flex min-h-11 items-center font-bold underline underline-offset-4"
                    download
                    href={document.href}
                  >
                    Download {document.fileType}
                  </a>
                </div>
              ) : (
                <p className="mt-5 text-sm font-semibold text-slate-500">
                  A public download is not currently available.
                </p>
              )}
              {document.fileSize ? (
                <p className="mt-3 text-sm text-slate-500">
                  {document.fileType} · {document.fileSize}
                </p>
              ) : null}
            </FeatureCard>
          ))}
        </div>
      </Section>
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
