import type { Metadata } from "next";

import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility",
  description:
    "Read NETYR's accessibility commitment and learn how to report a website access barrier.",
  path: "/accessibility/",
});

export default function AccessibilityPage() {
  return (
    <>
      <Hero
        compact
        description="NETYR wants its public website to be useful to every visitor."
        eyebrow="Accessibility"
        title="Access for everyone"
      />
      <Section
        description="We work to provide clear content, keyboard access, visible focus states, readable contrast, responsive layouts, and meaningful labels for interactive elements."
        eyebrow="Our commitment"
        title="An accessible public experience"
        tone="white"
      >
        <div className="max-w-3xl space-y-5 text-base leading-7 text-slate-700">
          <p>
            Accessibility is reviewed as the website changes. Some linked or
            embedded third-party services are operated by their respective
            providers, but NETYR aims to offer an accessible path to the same
            information or service whenever practical.
          </p>
          <p>
            If you encounter a barrier, please describe the page and the problem
            through the{" "}
            <a
              className="text-brand-blue font-semibold underline decoration-2 underline-offset-4"
              href="/contact/#contact-form"
            >
              NETYR contact form
            </a>
            . We will review the report and work toward a practical solution.
          </p>
        </div>
      </Section>
    </>
  );
}
