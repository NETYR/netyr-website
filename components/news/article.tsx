import { NewsArticleTracker } from "@/components/analytics/news-article-tracker";
import { Container } from "@/components/ui/container";
import { Hero } from "@/components/ui/hero";
import { siteConfig } from "@/lib/site";
import type { NewsArticle } from "@/types/content";

export function Article({ article }: { article: NewsArticle }) {
  const articleUrl = `${siteConfig.url}/news/${article.slug}/`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        datePublished: article.date,
        description: article.excerpt,
        image: article.featuredImage
          ? [new URL(article.featuredImage, siteConfig.url).toString()]
          : [new URL(siteConfig.socialImage, siteConfig.url).toString()],
        mainEntityOfPage: articleUrl,
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "News",
            item: `${siteConfig.url}/news/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(graph).replaceAll("<", "\\u003c"),
        }}
        type="application/ld+json"
      />
      <NewsArticleTracker category={article.category} slug={article.slug} />
      <Hero
        compact
        description={article.excerpt}
        eyebrow={article.category}
        title={article.title}
      />
      <article className="bg-white py-16 sm:py-20">
        <Container className="max-w-3xl">
          <time
            className="text-sm font-semibold text-slate-500"
            dateTime={article.date}
          >
            {article.date}
          </time>
          <div className="mt-8 space-y-6 text-lg leading-8 text-slate-700">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </article>
    </>
  );
}
