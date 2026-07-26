import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { FeatureCard } from "@/components/ui/feature-card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Get Involved",
  description:
    "Find ways to join, attend, volunteer, connect, and support the North East Texas Young Republicans.",
  path: "/get-involved/",
});

const opportunities = [
  {
    title: "Join NETYR",
    description:
      "Explore eligibility, membership categories, and the benefits of becoming part of NETYR.",
    href: "/membership/",
    action: "Explore membership",
  },
  {
    title: "Pay membership dues",
    description:
      "Ready to join? Start on the Membership page before continuing to NETYR's secure Cheddar Up collection.",
    href: "/membership/",
    action: "Membership and dues",
  },
  {
    title: "Attend an event",
    description:
      "Find upcoming meetings, socials, volunteer opportunities, and other chapter activities.",
    href: "/events/",
    action: "View events",
  },
  {
    title: "Volunteer",
    description:
      "Tell us how you would like to help with events, outreach, service, or other chapter efforts.",
    href: "/contact/",
    action: "Start a conversation",
  },
  {
    title: "Connect with us",
    description:
      "Ask a question, introduce yourself, or let the NETYR team know how you would like to participate.",
    href: "/contact/",
    action: "Contact NETYR",
  },
  {
    title: "Support or sponsor",
    description:
      "Learn how community partners and supporters can help strengthen NETYR's work.",
    href: "/sponsors/",
    action: "Explore sponsorship",
  },
] as const;

export default function GetInvolvedPage() {
  return (
    <>
      <Hero
        compact
        description="There is more than one way to make an impact. Join the chapter, attend an event, volunteer, or connect with NETYR."
        eyebrow="Get involved"
        title="Turn shared principles into local action"
      />
      <Section
        description="Choose the path that fits you and take your next step."
        eyebrow="Start here"
        title="Choose your next step"
        tone="white"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opportunity) => (
            <FeatureCard key={opportunity.title} title={opportunity.title}>
              <p>{opportunity.description}</p>
              <Button
                className="mt-5"
                href={opportunity.href}
                variant="secondary"
              >
                {opportunity.action}
              </Button>
            </FeatureCard>
          ))}
        </div>
      </Section>
      <Callout
        actions={
          <>
            <Button href="/membership/">Join NETYR</Button>
            <Button href="/contact/" variant="secondary">
              Contact us
            </Button>
          </>
        }
        description="Have a question or not sure where to begin? We would be glad to help."
        title="Ready to get involved?"
      />
    </>
  );
}
