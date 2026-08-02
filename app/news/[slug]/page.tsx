import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnalyticsView } from "@/components/analytics/analytics-view";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { newsArticles } from "@/data/news";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const newsDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function getArticle(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) return {};

  return buildMetadata({
    title: `${article.title} | NETYR`,
    description: article.metaDescription,
    openGraphType: "article",
    path: `/news/${article.slug}/`,
  });
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const formattedDate = newsDateFormatter.format(
    new Date(`${article.date}T00:00:00Z`),
  );
  const articleUrl = `${siteConfig.url}/news/${article.slug}/`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: articleUrl,
    image: `${siteConfig.url}${siteConfig.socialImage}`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
  };

  return (
    <>
      <AnalyticsView
        category={article.category.toLowerCase()}
        event="news_article_view"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <Hero
        compact
        description={formattedDate}
        eyebrow={article.category}
        title={article.title}
      />
      <Section tone="white">
        <article className="mx-auto max-w-3xl">
          {article.kicker ? (
            <p className="text-brand-blue mb-8 text-sm font-bold tracking-[0.18em] uppercase">
              {article.kicker}
            </p>
          ) : null}
          <div className="space-y-6 text-lg leading-8 text-slate-700">
            {article.body.map((paragraph) =>
              paragraph.startsWith("“") ? (
                <blockquote
                  className="border-brand-red-dark text-brand-navy border-l-4 py-1 pl-6 font-semibold"
                  key={paragraph}
                >
                  {paragraph}
                </blockquote>
              ) : (
                <p key={paragraph}>{paragraph}</p>
              ),
            )}
          </div>

          {article.mediaContact ? (
            <aside className="bg-brand-paper mt-12 rounded-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-brand-navy text-xl font-bold uppercase">
                Media Contact
              </h2>
              <address className="mt-4 leading-7 text-slate-700 not-italic">
                <strong>{article.mediaContact.name}</strong>
                <br />
                {article.mediaContact.title}
                <br />
                {article.mediaContact.organization}
                <br />
                <a
                  className="text-brand-blue font-semibold underline underline-offset-4"
                  href={`mailto:${article.mediaContact.email}`}
                >
                  {article.mediaContact.email}
                </a>
              </address>
            </aside>
          ) : null}

          <Button className="mt-10" href="/news/" variant="secondary">
            Back to News
          </Button>
        </article>
      </Section>
    </>
  );
}
