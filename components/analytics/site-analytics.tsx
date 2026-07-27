"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

import {
  flushPendingAnalyticsEvents,
  isAnalyticsEventName,
  trackAnalyticsEvent,
} from "@/lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export function SiteAnalytics() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!measurementId || !isReady || typeof window.gtag !== "function") return;

    window.gtag("config", measurementId, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      anonymize_ip: true,
      page_location: window.location.href,
      page_path: `${pathname}${window.location.search}`,
      page_title: document.title,
      send_page_view: true,
    });
  }, [isReady, pathname]);

  useEffect(() => {
    function handleTrackedClick(event: MouseEvent) {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-analytics-event]")
          : null;
      const eventName = target?.dataset.analyticsEvent;

      if (!eventName || !isAnalyticsEventName(eventName)) return;

      trackAnalyticsEvent(eventName, {
        link_context: target.dataset.analyticsContext ?? "website",
        link_label:
          target.dataset.analyticsLabel ??
          target.textContent?.trim().slice(0, 100) ??
          "unlabeled",
      });
    }

    document.addEventListener("click", handleTrackedClick);
    return () => document.removeEventListener("click", handleTrackedClick);
  }, []);

  if (!measurementId) return null;

  return (
    <>
      <Script id="netyr-google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
          window.gtag("consent", "default", {
            ad_personalization: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            analytics_storage: "granted",
            functionality_storage: "granted",
            personalization_storage: "denied",
            security_storage: "granted"
          });
          window.gtag("js", new Date());
        `}
      </Script>
      <Script
        onReady={() => {
          flushPendingAnalyticsEvents();
          setIsReady(true);
        }}
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          measurementId,
        )}`}
        strategy="afterInteractive"
      />
    </>
  );
}
