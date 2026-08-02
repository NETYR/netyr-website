import { HomepageCarousel } from "@/components/homepage/homepage-carousel";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { FeatureCard } from "@/components/ui/feature-card";
import { Section } from "@/components/ui/section";
import { cheddarUpLinks } from "@/data/cheddar-up";
import { membershipContent } from "@/data/membership";
import { newsArticles } from "@/data/news";
import { organizationContent } from "@/data/site";
import { sponsors } from "@/data/sponsors";
import { getLatestPublishedNews } from "@/lib/news";

const newsDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export default function HomePage() {
  const latestNewsArticle = getLatestPublishedNews(newsArticles);

  return (
    <>
      <HomepageCarousel />

      <Section
        description={organizationContent.purpose}
        eyebrow="Our purpose"
        title="Develop leaders. Strengthen communities."
        tone="white"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard eyebrow="Leadership" title="Prepare to lead">
            <p>
              Grow the relationships and experience needed to make a difference
              in public life.
            </p>
          </FeatureCard>
          <FeatureCard eyebrow="Community" title="Connect and serve">
            <p>
              Build fellowship with young Republicans through networking,
              service, and shared purpose.
            </p>
          </FeatureCard>
          <FeatureCard eyebrow="Engagement" title="Put principles into action">
            <p>
              Participate in civic life and support Republican candidates and
              principles across Northeast Texas.
            </p>
          </FeatureCard>
        </div>
      </Section>

      <Section
        description={`Active Membership is available to eligible people ages ${membershipContent.activeMember.ageMinimum} through ${membershipContent.activeMember.ageMaximum} who live in ${membershipContent.activeMember.geography}.`}
        eyebrow="Membership"
        title="There is a place to participate"
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/membership/">Explore membership</Button>
          <Button href="/about/" variant="secondary">
            Learn about NETYR
          </Button>
        </div>
      </Section>

      <Section
        description="A committed officer team keeps NETYR focused on service, growth, and meaningful opportunities for members."
        eyebrow="Organization"
        title="Leadership with a local purpose"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <h3 className="text-brand-navy text-xl font-bold uppercase">
              Ready to serve
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              NETYR&apos;s officers bring young conservatives together and help
              turn good ideas into local action.
            </p>
          </Card>
          <Card>
            <h3 className="text-brand-navy text-xl font-bold uppercase">
              Building the next generation
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Meet the team creating opportunities to connect, participate, and
              lead across Northeast Texas.
            </p>
            <Button className="mt-5" href="/leadership/" variant="secondary">
              Meet the leadership
            </Button>
          </Card>
        </div>
      </Section>

      <Section
        description="Choose a path that fits your interests and take your next step with NETYR."
        eyebrow="Take part"
        title="Get involved"
        tone="navy"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "Become a member",
              "Connect with other young Republicans and take part in chapter life.",
            ],
            [
              "Attend an event",
              "Meet members and guests at upcoming meetings and activities.",
            ],
            [
              "Build local engagement",
              "Volunteer, serve, and strengthen Republican involvement in our communities.",
            ],
          ].map(([title, description]) => (
            <Card className="border-white/15 bg-white/5 text-white" key={title}>
              <h3 className="text-xl font-bold uppercase">{title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{description}</p>
            </Card>
          ))}
        </div>
        <Button className="mt-8" href="/get-involved/">
          Find your next step
        </Button>
      </Section>

      <Section
        description="Follow chapter announcements, event updates, community service, and organization news."
        eyebrow="Updates"
        title="Latest news"
        tone="white"
      >
        {latestNewsArticle ? (
          <article className="max-w-3xl">
            <a
              className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
              href={`/news/${latestNewsArticle.slug}/`}
            >
              <Card className="transition-colors group-hover:border-blue-300 group-hover:bg-blue-50/40">
                <time
                  className="text-brand-blue text-xs font-bold tracking-wider uppercase"
                  dateTime={latestNewsArticle.date}
                >
                  {newsDateFormatter.format(
                    new Date(`${latestNewsArticle.date}T00:00:00Z`),
                  )}
                </time>
                <h3 className="text-brand-navy mt-3 text-2xl font-bold text-balance uppercase group-hover:underline">
                  {latestNewsArticle.title}
                </h3>
                <p className="mt-4 leading-7 text-slate-600">
                  {latestNewsArticle.excerpt}
                </p>
                <span className="text-brand-red-dark mt-6 inline-flex min-h-11 items-center text-sm font-bold tracking-wider uppercase group-hover:underline">
                  Read More
                </span>
              </Card>
            </a>
          </article>
        ) : (
          <div>
            <p className="max-w-2xl leading-7 text-slate-600">
              New updates will be shared here soon.
            </p>
            <Button className="mt-5" href="/news/" variant="secondary">
              Visit the news page
            </Button>
          </div>
        )}
      </Section>

      <Section
        description="Community partners help expand NETYR's ability to connect, serve, and lead."
        eyebrow="Community support"
        title="Sponsors"
      >
        {sponsors.length === 0 ? (
          <div>
            <p className="max-w-2xl leading-7 text-slate-600">
              Learn how your organization can connect with NETYR and support our
              work.
            </p>
            <Button className="mt-5" href="/sponsors/" variant="secondary">
              Sponsorship information
            </Button>
          </div>
        ) : null}
      </Section>

      <Section
        description="Your support helps NETYR create opportunities for young Republicans to connect, serve, and lead."
        eyebrow="Support"
        title="Help build what comes next"
        tone="white"
      >
        <Button
          data-analytics-context="homepage_support"
          data-analytics-event="donate_click"
          data-analytics-label="support_netyr"
          href={cheddarUpLinks.donations}
          rel="noopener noreferrer"
          target="_blank"
        >
          Support NETYR
        </Button>
      </Section>

      <Callout
        actions={
          <>
            <Button
              data-analytics-context="homepage_final_callout"
              data-analytics-event="join_click"
              data-analytics-label="join_netyr"
              href="/membership/"
            >
              Join NETYR
            </Button>
            <Button href="/contact/" variant="secondary">
              Contact NETYR
            </Button>
          </>
        }
        description="Review membership eligibility, watch for upcoming events, and connect with a growing network of young Republicans in Northeast Texas."
        title="Ready to take the next step?"
      />
    </>
  );
}
