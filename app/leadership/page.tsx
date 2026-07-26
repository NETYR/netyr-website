import type { Metadata } from "next";

import { FeatureCard } from "@/components/ui/feature-card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { leadershipRoles } from "@/data/leadership";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Leadership",
  description:
    "Meet the current officers of the North East Texas Young Republicans.",
  path: "/leadership/",
});

export default function LeadershipPage() {
  return (
    <>
      <Hero
        compact
        description="NETYR is led by a team of young conservatives committed to growing our organization, serving our community, and creating opportunities for the next generation of Republican leaders."
        eyebrow="Leadership"
        title="Organized to serve and lead"
      />
      <Section
        description="Meet the current officers of the North East Texas Young Republicans."
        eyebrow="Officer team"
        title="Current officers"
        tone="white"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {leadershipRoles.map((leader) => (
            <FeatureCard
              key={leader.role}
              title={
                leader.status === "vacant" ? leader.role : (leader.name ?? "")
              }
            >
              {leader.status === "vacant" ? (
                <p className="text-brand-blue text-sm font-bold tracking-wide uppercase">
                  Vacant
                </p>
              ) : (
                <>
                  <p className="text-brand-blue text-sm font-bold tracking-wide uppercase">
                    {leader.role}
                  </p>
                  {leader.term ? (
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      {leader.term}
                    </p>
                  ) : null}
                </>
              )}
            </FeatureCard>
          ))}
        </div>
      </Section>
    </>
  );
}
