import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { FeatureCard } from "@/components/ui/feature-card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About NETYR | North East Texas Young Republicans",
  description:
    "Learn about the mission, purpose, and community focus of the North East Texas Young Republicans.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <Hero
        compact
        description="NETYR is a home for young Republicans and young professionals who want to connect, grow, serve, and make a difference in Northeast Texas."
        eyebrow="About NETYR"
        title="Rooted in Northeast Texas. Built for the future."
      />
      <Section
        description="We bring together the next generation of conservative leaders around shared principles, strong communities, and meaningful participation."
        eyebrow="Who we are"
        title="A place to connect and contribute"
        tone="white"
      >
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          NETYR creates opportunities for members to build lasting
          relationships, learn from one another, support Republican candidates
          and principles, and take an active role in the civic life of our
          region.
        </p>
      </Section>
      <Section
        description="Our chapter is built around the experiences that help young conservatives find their voice and put their values into action."
        eyebrow="Why NETYR"
        title="Leadership, fellowship, and local action"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard title="Develop leaders">
            <p>
              Gain experience, build confidence, and prepare to lead in the
              Republican Party and the wider community.
            </p>
          </FeatureCard>
          <FeatureCard title="Build fellowship">
            <p>
              Meet other young Republicans through networking, chapter
              activities, and a shared commitment to Northeast Texas.
            </p>
          </FeatureCard>
          <FeatureCard title="Get involved">
            <p>
              Participate in events, service, civic engagement, and Republican
              efforts that strengthen our communities.
            </p>
          </FeatureCard>
        </div>
      </Section>
      <Section
        description="NETYR connects local members with the broader Young Republican movement across Texas."
        eyebrow="Federation"
        title="Part of a statewide Young Republican network"
        tone="navy"
      >
        <p className="max-w-3xl leading-7 text-slate-300">
          Through the Texas Young Republican Federation, NETYR members can
          connect with fellow Young Republicans, exchange ideas, and take part
          in leadership development beyond our local chapter.
        </p>
        <a
          aria-label="Visit the Texas Young Republicans website (opens in a new tab)"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm font-bold text-white underline decoration-blue-300 underline-offset-4 hover:text-blue-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
          href="https://texasyr.gop/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Visit the Texas Young Republicans
          <svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              d="M6 3h7v7M13 3 7.5 8.5M12 9v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </a>
      </Section>
      <Section
        description="NETYR is rooted in Van Zandt County and connected to adjacent communities across Northeast Texas."
        eyebrow="Our region"
        title="Local roots. Regional impact."
        tone="white"
      >
        <p className="max-w-3xl leading-7 text-slate-600">
          Our members bring a young, energetic perspective to Republican
          involvement in the places where they live and work. Whether
          you&apos;re ready to attend your first event or take on a larger
          leadership role, NETYR offers a welcoming place to begin.
        </p>
        <Button className="mt-6" href="/get-involved/" variant="secondary">
          Find your next step
        </Button>
      </Section>
      <Callout
        actions={
          <>
            <Button href="/membership/">Explore membership</Button>
            <Button href="/leadership/" variant="secondary">
              Meet the leadership
            </Button>
          </>
        }
        description="Explore membership, meet the leadership team, and find your place in NETYR."
        title="Learn more about NETYR"
      />
    </>
  );
}
