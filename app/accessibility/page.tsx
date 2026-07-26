import type { Metadata } from "next";

import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { contactConfig } from "@/data/contact";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility",
  description:
    "Read NETYR's accessibility intent, implemented website practices, and feedback status.",
  path: "/accessibility/",
});

const accessibilityPractices = [
  "Semantic page landmarks and heading hierarchy",
  "Keyboard-operable navigation and controls",
  "A skip link to the main content",
  "Visible focus indicators",
  "Mobile touch targets of at least 44 pixels",
  "Reduced-motion support",
  "High-contrast text and controls",
  "Alternative text for informative images",
  "No autoplaying audio or essential color-only information",
] as const;

export default function AccessibilityPage() {
  return (
    <>
      <Hero
        compact
        description="NETYR intends to provide a website that is usable by the broadest practical audience and to improve it as content and services evolve."
        eyebrow="Accessibility"
        title="Access is part of good public service"
      />
      <Section
        description="The site targets WCAG 2.2 Level AA best practices. This is an intent and engineering target, not an unsupported certification claim."
        eyebrow="Our approach"
        title="Accessible by design"
        tone="white"
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {accessibilityPractices.map((practice) => (
            <li
              className="bg-brand-paper flex gap-3 rounded-sm border border-slate-200 p-5 leading-7 text-slate-700"
              key={practice}
            >
              <span aria-hidden="true" className="text-brand-blue font-black">
                ✓
              </span>
              {practice}
            </li>
          ))}
        </ul>
      </Section>
      <Section
        description="We welcome feedback that can help make the NETYR website easier to use."
        eyebrow="Feedback"
        title="Tell us how we can improve"
      >
        <p className="max-w-3xl leading-7 text-slate-600">
          If you encounter an accessibility barrier, email{" "}
          <a
            className="text-brand-blue font-bold underline underline-offset-4"
            href={`mailto:${contactConfig.publicEmail}?subject=Website%20accessibility%20feedback`}
          >
            {contactConfig.publicEmail}
          </a>{" "}
          with the page and a brief description of the issue.
        </p>
      </Section>
    </>
  );
}
