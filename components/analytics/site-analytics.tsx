"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

import {
  flushPendingAnalyticsEvents,
  isAnalyticsEventName,
  trackAnalyticsEvent,
} from "@/lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
const productionAnalyticsHosts = new Set(["netyr.org", "www.netyr.org"]);
const subscribeToHostname = () => () => undefined;

export function SiteAnalytics() {
  const pathname = usePathname();
  const isEnabled = useSyncExternalStore(
    subscribeToHostname,
    () => productionAnalyticsHosts.has(window.location.hostname),
    () => false,
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (
      !measurementId ||
      !isEnabled ||
      !isReady ||
      typeof window.gtag !== "function"
    )
      return;

    window.gtag("config", measurementId, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      anonymize_ip: true,
      page_location: `${window.location.origin}${pathname}`,
      page_path: pathname,
      page_title: document.title,
      send_page_view: true,
    });
  }, [isEnabled, isReady, pathname]);

  useEffect(() => {
    if (!isEnabled) return;

    function handleTrackedClick(event: MouseEvent) {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-analytics-event]")
          : null;
      const eventName = target?.dataset.analyticsEvent;

      if (!eventName || !isAnalyticsEventName(eventName)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      let outboundDomain = "";
      if (anchor) {
        const destination = new URL(anchor.href, window.location.origin);
        if (destination.origin !== window.location.origin) {
          outboundDomain = destination.hostname;
        }
      }

      const parameters = {
        link_location: target.dataset.analyticsContext ?? "website",
        link_label:
          target.dataset.analyticsLabel ??
          target.textContent?.trim().slice(0, 100) ??
          "unlabeled",
        ...(outboundDomain ? { outbound_domain: outboundDomain } : {}),
        page_path: window.location.pathname,
        page_title: document.title,
      };

      const shouldDelayNavigation =
        anchor &&
        !anchor.download &&
        anchor.target !== "_blank" &&
        event.button === 0 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        isReady &&
        typeof window.gtag === "function";

      if (!shouldDelayNavigation) {
        trackAnalyticsEvent(eventName, parameters);
        return;
      }

      event.preventDefault();

      let hasNavigated = false;
      const navigate = () => {
        if (hasNavigated) return;
        hasNavigated = true;
        window.location.assign(anchor.href);
      };

      trackAnalyticsEvent(eventName, {
        ...parameters,
        event_callback: navigate,
        event_timeout: 700,
      });
      window.setTimeout(navigate, 750);
    }

    document.addEventListener("click", handleTrackedClick, true);
    return () =>
      document.removeEventListener("click", handleTrackedClick, true);
  }, [isEnabled, isReady]);

  if (!measurementId || !isEnabled) return null;

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
