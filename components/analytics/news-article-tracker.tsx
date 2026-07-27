"use client";

import { useEffect } from "react";

import { trackAnalyticsEvent } from "@/lib/analytics";

export function NewsArticleTracker({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) {
  useEffect(() => {
    trackAnalyticsEvent("news_article_view", {
      article_category: category,
      article_slug: slug,
    });
  }, [category, slug]);

  return null;
}
