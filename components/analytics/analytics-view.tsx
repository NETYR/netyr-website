"use client";

import { useEffect, useRef } from "react";

import { type AnalyticsEventName, trackAnalyticsEvent } from "@/lib/analytics";

export function AnalyticsView({
  category,
  event,
}: {
  category: string;
  event: AnalyticsEventName;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    trackAnalyticsEvent(event, {
      event_category: category,
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }, [category, event]);

  return null;
}
