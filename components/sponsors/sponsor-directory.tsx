"use client";

import { useEffect, useState } from "react";

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
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [isLoading, setIsLoading] = useState(Boolean(feedUrl));
  const [couldNotLoad, setCouldNotLoad] = useState(false);

  useEffect(() => {
    if (!feedUrl) return;

    const endpoint = feedUrl;
    const controller = new AbortController();

    async function loadSponsors() {
      try {
        const response = await fetch(endpoint, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Sponsor feed request failed.");

        const payload: unknown = await response.json();
        if (
          !payload ||
          typeof payload !== "object" ||
          (payload as { ok?: unknown }).ok !== true
        ) {
          throw new Error("Sponsor feed reported an unavailable source.");
        }
        setSponsors(parseSponsorFeed(payload));
        setCouldNotLoad(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setCouldNotLoad(true);
      } finally {
        setIsLoading(false);
      }
    }

    void loadSponsors();
    const refreshTimer = window.setInterval(
      () => void loadSponsors(),
      5 * 60 * 1000,
    );

    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
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
        Community partner recognition is temporarily unavailable. Please check
        back soon.
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
                {level}s
              </h3>
            </div>
            <ul className="grid gap-x-10 border-y border-slate-200 bg-white px-5 py-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
              {levelSponsors.map((sponsor) => (
                <li
                  className="text-brand-navy border-b border-slate-100 py-4 text-lg font-bold last:border-b-0 sm:last:border-b"
                  key={`${level}-${sponsor.name}`}
                >
                  {sponsor.name}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
