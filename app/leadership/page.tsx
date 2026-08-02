import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { leadershipRoles } from "@/data/leadership";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "NETYR Leadership | North East Texas Young Republicans",
  description:
    "Meet the officers leading the North East Texas Young Republicans and building opportunities for young conservative leaders across the region.",
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
                  {leader.appointmentNote ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {leader.appointmentNote}
                    </p>
                  ) : null}
                </>
              )}
            </FeatureCard>
          ))}
        </div>
        <Button className="mt-8" href="/get-involved/" variant="secondary">
          Get involved with NETYR
        </Button>
      </Section>
    </>
  );
}
