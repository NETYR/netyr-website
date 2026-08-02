const analyticsEventNames = [
  "join_click",
  "membership_link_click",
  "donate_click",
  "contact_form_view",
  "contact_form_submission_success",
  "social_link_click",
  "event_view",
  "event_registration_click",
  "sponsor_interest_click",
  "news_article_view",
  "governing_document_view",
  "governing_document_download",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

type AnalyticsParameters = Record<
  string,
  boolean | number | string | (() => void)
>;
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

function withAnalyticsDestination(parameters: AnalyticsParameters) {
  return measurementId
    ? { ...parameters, send_to: measurementId, transport_type: "beacon" }
    : parameters;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    netyrAnalyticsQueue?: {
      name: AnalyticsEventName;
      parameters: AnalyticsParameters;
    }[];
  }
}

export function isAnalyticsEventName(
  value: string,
): value is AnalyticsEventName {
  return analyticsEventNames.includes(value as AnalyticsEventName);
}

export function trackAnalyticsEvent(
  name: AnalyticsEventName,
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag !== "function") {
    window.netyrAnalyticsQueue = window.netyrAnalyticsQueue ?? [];
    window.netyrAnalyticsQueue.push({ name, parameters });
    return;
  }

  window.gtag("event", name, withAnalyticsDestination(parameters));
}

export function flushPendingAnalyticsEvents() {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;

  const queue = window.netyrAnalyticsQueue ?? [];
  window.netyrAnalyticsQueue = [];

  queue.forEach(({ name, parameters }) => {
    window.gtag?.("event", name, withAnalyticsDestination(parameters));
  });
}
