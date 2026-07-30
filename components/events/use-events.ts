"use client";

import { useEffect, useRef, useState } from "react";

import { parseEventFeed } from "@/lib/events/provider";
import {
  runtimeFeedFocusStaleMilliseconds,
  runtimeFeedRefreshMilliseconds,
  withRuntimeCacheBust,
} from "@/lib/integrations/runtime-feed";
import type { Event } from "@/types/content";

export function useEvents(initialEvents: Event[], endpoint?: string) {
  const [events, setEvents] = useState(initialEvents);
  const [isLoading, setIsLoading] = useState(Boolean(endpoint));
  const [couldNotLoad, setCouldNotLoad] = useState(false);
  const lastRequestAt = useRef(0);
  const requestInFlight = useRef(false);

  useEffect(() => {
    if (!endpoint) return;
    const feedEndpoint = endpoint;
    const controller = new AbortController();
    let initialRequest = true;

    async function loadEvents() {
      if (requestInFlight.current) return;
      requestInFlight.current = true;
      lastRequestAt.current = Date.now();

      try {
        const response = await fetch(
          withRuntimeCacheBust(feedEndpoint, lastRequestAt.current),
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) throw new Error("Event feed request failed.");

        const payload: unknown = await response.json();
        setEvents(parseEventFeed(payload));
        setCouldNotLoad(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setCouldNotLoad(true);
      } finally {
        requestInFlight.current = false;
        if (initialRequest) {
          initialRequest = false;
          setIsLoading(false);
        }
      }
    }

    void loadEvents();
    const refreshTimer = window.setInterval(
      () => void loadEvents(),
      runtimeFeedRefreshMilliseconds,
    );
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRequestAt.current >= runtimeFeedFocusStaleMilliseconds
      ) {
        void loadEvents();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [endpoint]);

  return { couldNotLoad, events, isLoading };
}
