"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { parseSponsorFeed } from "@/lib/sponsors/provider";
import type { Sponsor, SponsorTier } from "@/types/content";

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
      <EmptyState
        description="The community-partner connection is temporarily unavailable. Please check back soon."
        title="Community partners could not be loaded"
      />
    );
  }

  if (sponsors.length === 0) {
    return (
      <EmptyState
        description="Approved contributing members will appear here when they qualify for public recognition."
        title="Community partner recognition coming soon"
      />
    );
  }

  return (
    <div className="grid gap-12">
      {(["Patron", "Sustaining", "Supporting"] as SponsorTier[]).map((tier) => {
        const tierSponsors = sponsors.filter(
          (sponsor) => sponsor.tier === tier,
        );
        if (tierSponsors.length === 0) return null;

        return (
          <section aria-labelledby={`sponsor-tier-${tier}`} key={tier}>
            <div className="mb-4 border-b border-slate-200 pb-3">
              <h3
                className="text-brand-navy text-2xl font-bold uppercase"
                id={`sponsor-tier-${tier}`}
              >
                {tier} Community Partners
              </h3>
            </div>
            <ul className="grid gap-x-10 border-y border-slate-200 bg-white px-5 py-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
              {tierSponsors.map((sponsor) => (
                <li
                  className="text-brand-navy border-b border-slate-100 py-4 text-lg font-bold last:border-b-0 sm:last:border-b"
                  key={`${tier}-${sponsor.name}`}
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
