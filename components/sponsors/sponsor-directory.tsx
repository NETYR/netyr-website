"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  runtimeFeedFocusStaleMilliseconds,
  runtimeFeedRefreshMilliseconds,
  withRuntimeCacheBust,
} from "@/lib/integrations/runtime-feed";
import {
  applySponsorPresentation,
  getSponsorPresentation,
} from "@/lib/sponsors/presentation";
import { parseSponsorFeed, sponsorLevels } from "@/lib/sponsors/provider";
import type { Sponsor } from "@/types/content";

type SponsorDirectoryProps = {
  feedUrl?: string;
  initialSponsors: Sponsor[];
};

export function SponsorDirectory({
  feedUrl,
  initialSponsors,
}: SponsorDirectoryProps) {
  const [sponsors, setSponsors] = useState(() =>
    parseSponsorFeed({ sponsors: applySponsorPresentation(initialSponsors) }),
  );
  const [isLoading, setIsLoading] = useState(Boolean(feedUrl));
  const [couldNotLoad, setCouldNotLoad] = useState(false);
  const lastRequestAt = useRef(0);
  const requestInFlight = useRef(false);

  useEffect(() => {
    if (!feedUrl) return;
    const feedEndpoint = feedUrl;

    const controller = new AbortController();

    async function loadSponsors() {
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
        if (!response.ok) throw new Error("Sponsor feed request failed.");

        const payload: unknown = await response.json();
        if (
          !payload ||
          typeof payload !== "object" ||
          (payload as { ok?: unknown }).ok !== true
        ) {
          throw new Error("Sponsor feed reported an unavailable source.");
        }
        setSponsors(
          parseSponsorFeed({
            sponsors: applySponsorPresentation(parseSponsorFeed(payload)),
          }),
        );
        setCouldNotLoad(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setCouldNotLoad(true);
      } finally {
        requestInFlight.current = false;
        setIsLoading(false);
      }
    }

    void loadSponsors();
    const refreshTimer = window.setInterval(
      () => void loadSponsors(),
      runtimeFeedRefreshMilliseconds,
    );
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRequestAt.current >= runtimeFeedFocusStaleMilliseconds
      ) {
        void loadSponsors();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [feedUrl]);

  if (isLoading) {
    return (
      <p aria-live="polite" className="text-slate-600">
        Loading community partners…
      </p>
    );
  }

  if (couldNotLoad) {
    return (
      <p
        aria-live="polite"
        className="border-l-4 border-red-700 bg-white px-5 py-4 text-slate-700"
      >
        Community partner information is temporarily unavailable.
      </p>
    );
  }

  if (sponsors.length === 0) {
    return (
      <p className="border-l-4 border-slate-300 bg-white px-5 py-4 text-slate-700">
        Community partner recognition will be updated soon.
      </p>
    );
  }

  return (
    <div className="grid gap-12">
      {sponsorLevels.map((level) => {
        const levelSponsors = sponsors.filter(
          (sponsor) => sponsor.level === level,
        );
        if (levelSponsors.length === 0) return null;

        return (
          <section aria-labelledby={`sponsor-level-${level}`} key={level}>
            <div className="mb-4 border-b border-slate-200 pb-3">
              <h3
                className="text-brand-navy text-2xl font-bold uppercase"
                id={`sponsor-level-${level}`}
              >
                {level === "President’s Posse Sponsor"
                  ? "President’s Posse Tier Sponsors"
                  : `${level}s`}
              </h3>
            </div>
            <ul className="grid gap-x-10 border-y border-slate-200 bg-white px-5 py-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
              {levelSponsors.map((sponsor) => {
                const presentation = getSponsorPresentation(sponsor.name);

                return (
                  <li
                    className="text-brand-navy flex min-h-16 items-center border-b border-slate-100 py-4 text-lg font-bold last:border-b-0 sm:last:border-b"
                    key={`${level}-${sponsor.name}`}
                  >
                    {presentation ? (
                      <Image
                        alt={presentation.logo.alt}
                        className="h-auto w-full max-w-[340px] object-contain"
                        height={presentation.logo.height}
                        sizes="(max-width: 640px) calc(100vw - 5.5rem), 340px"
                        src={presentation.logo.src}
                        width={presentation.logo.width}
                      />
                    ) : (
                      sponsor.name
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
