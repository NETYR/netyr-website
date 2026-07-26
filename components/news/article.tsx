import { Container } from "@/components/ui/container";
import { Hero } from "@/components/ui/hero";
import type { NewsArticle } from "@/types/content";

export function Article({ article }: { article: NewsArticle }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date,
    description: article.excerpt,
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        type="application/ld+json"
      />
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
