import type { Metadata } from "next";

import { CheddarUpButton } from "@/components/ui/cheddar-up-button";
import { FeatureCard } from "@/components/ui/feature-card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { cheddarUpLinks } from "@/data/cheddar-up";
import { membershipContent } from "@/data/membership";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Join NETYR | North East Texas Young Republicans Membership",
  description:
    "Review NETYR membership eligibility, learn about annual dues, and join the North East Texas Young Republicans.",
  path: "/membership/",
});

export default function MembershipPage() {
  return (
    <>
      <Hero
        actions={
          <CheddarUpButton
            href={cheddarUpLinks.membership}
            label="Join NETYR and pay annual dues"
          />
        }
        compact
        description="Membership connects eligible young Republicans with leadership development, local engagement, and an organized Northeast Texas network."
        eyebrow="Membership"
        title="Your place to participate"
      />
      <Section
        description="Review the eligibility requirements below before completing membership registration and payment."
        eyebrow="Active Membership"
        title="Who may join as an Active Member"
        tone="white"
      >
        <ol className="grid gap-4 md:grid-cols-2">
          {membershipContent.activeMember.requirements.map(
            (requirement, index) => (
              <li
                className="bg-brand-paper flex gap-4 rounded-sm border border-slate-200 p-5"
                key={requirement}
              >
                <span
                  aria-hidden="true"
                  className="bg-brand-blue flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                >
                  {index + 1}
                </span>
                <span className="leading-7 text-slate-700">{requirement}</span>
              </li>
            ),
          )}
        </ol>
      </Section>
      <Section
        description={`Annual NETYR dues are currently $${membershipContent.annualDues}. Registration and payment are completed through NETYR's public Cheddar Up collection.`}
        eyebrow="Annual dues"
        title={`$${membershipContent.annualDues} per year`}
      >
        <p className="max-w-3xl leading-7 text-slate-600">
          Registration and payment take place through NETYR&apos;s approved
          public Cheddar Up collection, not on this website. Paying dues is one
          step in the membership process; Active Membership rights still require
          meeting the eligibility requirements above.
        </p>
        <CheddarUpButton
          className="mt-6"
          href={cheddarUpLinks.membership}
          label="Join NETYR and pay $30 annual dues"
        />
      </Section>
      <Section
        description="NETYR recognizes multiple ways to participate while reserving voting rights for Active Members."
        eyebrow="Classifications"
        title="Membership categories"
        tone="white"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {membershipContent.classifications.map((classification) => (
            <FeatureCard key={classification.name} title={classification.name}>
              <p>{classification.description}</p>
            </FeatureCard>
          ))}
        </div>
      </Section>
      <Section
        description={membershipContent.activeMember.votingRights}
        eyebrow="Participation"
        title="Voting and leadership eligibility"
        tone="navy"
      >
        <p className="max-w-3xl leading-7 text-slate-300">
          Associate Members, Community Supporters, and non-Active Honorary
          Members do not vote or hold office.
        </p>
      </Section>
    </>
  );
}
