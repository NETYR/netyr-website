"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { parseSponsorFeed } from "@/lib/sponsors/provider";
import type { Sponsor, SponsorTier } from "@/types/content";

type SponsorDirectoryProps = {
  feedUrl?: string;
  initialSponsors: Sponsor[];
};

const tierDetails: Record<
  SponsorTier,
  { amount: string; description: string }
> = {
  Patron: {
    amount: "$500",
    description: "Patron contributing membership",
  },
  Sustaining: {
    amount: "$250",
    description: "Sustaining contributing membership",
  },
  Supporting: {
    amount: "$20",
    description: "Supporting contributing membership",
  },
};

function SponsorCard({
  featured = false,
  sponsor,
}: {
  featured?: boolean;
  sponsor: Sponsor;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const details = tierDetails[sponsor.tier];

  return (
    <Card
      className={
        featured ? "border-brand-red ring-brand-red/10 h-full ring-4" : "h-full"
      }
    >
      {sponsor.logo && !logoFailed ? (
        <div className="mb-5 flex min-h-28 items-center justify-center rounded-sm border border-slate-100 bg-white p-4">
          {/* Sponsor logos are approved remote assets supplied through the private master sheet. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${sponsor.name} logo`}
            className="max-h-24 max-w-full object-contain"
            loading="lazy"
            onError={() => setLogoFailed(true)}
            referrerPolicy="no-referrer"
            src={sponsor.logo}
          />
        </div>
      ) : null}
      <p className="text-brand-blue text-xs font-bold tracking-[0.14em] uppercase">
        {sponsor.tier} · {details.amount}
      </p>
      <h3 className="text-brand-navy mt-2 text-xl font-bold uppercase sm:text-2xl">
        {sponsor.name}
      </h3>
      <p className="mt-2 text-sm text-slate-600">{details.description}</p>
      {sponsor.href ? (
        <a
          className="text-brand-blue mt-4 inline-flex min-h-11 items-center font-bold underline underline-offset-4"
          href={sponsor.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          Visit website
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
    </Card>
  );
}

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
        Loading approved sponsors…
      </p>
    );
  }

  if (couldNotLoad) {
    return (
      <EmptyState
        description="The sponsor-recognition connection is temporarily unavailable. Please check back soon."
        title="Sponsors could not be loaded"
      />
    );
  }

  if (sponsors.length === 0) {
    return (
      <EmptyState
        description="Approved sponsor recognition will appear here as the NETYR sponsor program grows."
        title="Sponsor recognition coming soon"
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
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
              <h3
                className="text-brand-navy text-2xl font-bold uppercase"
                id={`sponsor-tier-${tier}`}
              >
                {tier}
              </h3>
              <p className="text-sm font-bold text-slate-600">
                {tierDetails[tier].amount}
              </p>
            </div>
            <div
              className={
                tier === "Patron"
                  ? "grid gap-6 lg:grid-cols-2"
                  : tier === "Sustaining"
                    ? "grid gap-5 md:grid-cols-2"
                    : "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              }
            >
              {tierSponsors.map((sponsor) => (
                <SponsorCard
                  featured={tier === "Patron"}
                  key={`${tier}-${sponsor.name}`}
                  sponsor={sponsor}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
