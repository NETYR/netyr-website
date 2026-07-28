"use client";

import { useEffect, useState } from "react";

import { parseEventFeed } from "@/lib/events/provider";
import type { Event } from "@/types/content";

export function useEvents(initialEvents: Event[], endpoint?: string) {
  const [events, setEvents] = useState(initialEvents);
  const [isLoading, setIsLoading] = useState(Boolean(endpoint));
  const [couldNotLoad, setCouldNotLoad] = useState(false);

  useEffect(() => {
    if (!endpoint) return;
    const requestUrl = endpoint;
    const controller = new AbortController();
    let initialRequest = true;

    async function loadEvents() {
      try {
        const response = await fetch(requestUrl, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Event feed request failed.");

        const payload: unknown = await response.json();
        setEvents(parseEventFeed(payload));
        setCouldNotLoad(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setCouldNotLoad(true);
      } finally {
        if (initialRequest) {
          initialRequest = false;
          setIsLoading(false);
        }
      }
    }

    void loadEvents();
    const refreshTimer = window.setInterval(
      () => void loadEvents(),
      5 * 60 * 1000,
    );

    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, [endpoint]);

  return { couldNotLoad, events, isLoading };
}
