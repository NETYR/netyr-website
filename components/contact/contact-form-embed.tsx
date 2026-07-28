"use client";

import { useEffect, useRef, useState } from "react";

import { trackAnalyticsEvent } from "@/lib/analytics";

const allowedContactFormHosts = [
  "script.google.com",
  "script.googleusercontent.com",
];

function isAllowedContactOrigin(origin: string) {
  try {
    const host = new URL(origin).hostname;
    return allowedContactFormHosts.some(
      (allowedHost) =>
        host === allowedHost ||
        host.endsWith(`.${allowedHost}`) ||
        (allowedHost === "script.googleusercontent.com" &&
          host.endsWith(`-${allowedHost}`)),
    );
  } catch {
    return false;
  }
}

export function ContactFormEmbed({ src }: { src: string }) {
  const trackedSuccess = useRef(false);
  const [height, setHeight] = useState(1100);

  useEffect(() => {
    trackAnalyticsEvent("contact_form_view", {
      form_provider: "google_apps_script",
    });

    function handleMessage(event: MessageEvent) {
      if (
        !isAllowedContactOrigin(event.origin) ||
        !event.data ||
        typeof event.data !== "object"
      ) {
        return;
      }

      const message = event.data as {
        event?: unknown;
        height?: unknown;
        source?: unknown;
      };

      if (
        message.source === "netyr-contact-form" &&
        message.event === "height_change" &&
        typeof message.height === "number" &&
        Number.isFinite(message.height)
      ) {
        setHeight(Math.min(1800, Math.max(720, Math.ceil(message.height))));
        return;
      }

      if (
        !trackedSuccess.current &&
        message.source === "netyr-contact-form" &&
        message.event === "submission_success"
      ) {
        trackedSuccess.current = true;
        trackAnalyticsEvent("contact_form_submission_success", {
          form_provider: "google_apps_script",
        });
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <iframe
      className="block w-full border-0 bg-white"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      src={src}
      style={{ height }}
      title="Contact North East Texas Young Republicans"
    />
  );
}
