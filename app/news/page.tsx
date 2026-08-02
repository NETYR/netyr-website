import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { newsArticles } from "@/data/news";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "NETYR News | North East Texas Young Republicans",
  description:
    "Read announcements, organizational updates, event recaps, and public news from the North East Texas Young Republicans.",
  path: "/news/",
});

const newsDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export default function NewsPage() {
  return (
    <>
      <Hero
        compact
        description="Follow chapter announcements, event recaps, community service, federation activity, and other updates from NETYR."
        eyebrow="News"
        title="Updates from NETYR"
      />
      <Section
        description="Find the latest news and stories from the North East Texas Young Republicans."
        eyebrow="Latest"
        title="Organization news"
        tone="white"
      >
        {newsArticles.length === 0 ? (
          <EmptyState
            description="New chapter updates will be shared here soon."
            title="Stay tuned"
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((article) => (
              <article key={article.slug}>
                <a
                  className="group block h-full rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
                  href={`/news/${article.slug}/`}
                >
                  <Card className="h-full transition-colors group-hover:border-blue-300 group-hover:bg-blue-50/40">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold tracking-wider uppercase">
                      <span className="text-brand-blue">
                        {article.category}
                      </span>
                      <time className="text-slate-500" dateTime={article.date}>
                        {newsDateFormatter.format(
                          new Date(`${article.date}T00:00:00Z`),
                        )}
                      </time>
                    </div>
                    <h2 className="text-brand-navy mt-3 text-2xl font-bold text-balance uppercase group-hover:underline">
                      {article.title}
                    </h2>
                    <p className="mt-4 leading-7 text-slate-600">
                      {article.excerpt}
                    </p>
                    <span className="text-brand-red-dark mt-6 inline-flex min-h-11 items-center text-sm font-bold tracking-wider uppercase group-hover:underline">
                      Read More
                    </span>
                  </Card>
                </a>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
