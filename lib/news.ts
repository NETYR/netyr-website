import type { NewsArticle } from "@/types/content";

function getPublishedTime(article: NewsArticle) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(article.date)) return null;

  const publishedTime = Date.parse(`${article.date}T00:00:00Z`);
  if (Number.isNaN(publishedTime)) return null;

  return new Date(publishedTime).toISOString().slice(0, 10) === article.date
    ? publishedTime
    : null;
}

export function getLatestPublishedNews(
  articles: readonly NewsArticle[],
  asOf = new Date(),
) {
  return [...articles]
    .filter((article) => {
      const publishedTime = getPublishedTime(article);

      return (
        article.publicationStatus !== "draft" &&
        article.publicationStatus !== "archived" &&
        Boolean(article.slug.trim()) &&
        Boolean(article.title.trim()) &&
        Boolean(article.excerpt.trim()) &&
        publishedTime !== null &&
        publishedTime <= asOf.getTime()
      );
    })
    .sort((left, right) => {
      const publishedDateDifference =
        (getPublishedTime(right) ?? 0) - (getPublishedTime(left) ?? 0);

      return publishedDateDifference || left.slug.localeCompare(right.slug);
    })[0];
}
