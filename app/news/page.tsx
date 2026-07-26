import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/empty-state";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { newsArticles } from "@/data/news";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "News",
  description:
    "Read approved announcements, meeting recaps, community updates, and public statements from NETYR.",
  path: "/news/",
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
              <article
                className="rounded-sm border border-slate-200 bg-white p-6"
                key={article.slug}
              >
                <p className="text-brand-blue text-xs font-bold tracking-wider uppercase">
                  {article.category}
                </p>
                <h2 className="text-brand-navy mt-2 text-2xl font-bold uppercase">
                  <a href={`/news/${article.slug}/`}>{article.title}</a>
                </h2>
                <p className="mt-3 text-slate-600">{article.excerpt}</p>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
