"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { parseSponsorFeed } from "@/lib/sponsors/provider";
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
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      } finally {
        setIsLoading(false);
      }
    }

    void loadSponsors();
    return () => controller.abort();
  }, [feedUrl]);

  if (isLoading) {
    return (
      <p aria-live="polite" className="text-slate-600">
        Loading community partners…
      </p>
    );
  }

  if (sponsors.length === 0) {
    return (
      <EmptyState
        description="Community-partner recognition will be shared here as the NETYR sponsor program grows."
        title="Sponsor recognition coming soon"
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {sponsors.map((sponsor) => (
        <Card key={sponsor.name}>
          <SponsorLogo logo={sponsor.logo} name={sponsor.name} />
          {sponsor.tier ? (
            <p className="text-brand-blue mt-4 text-xs font-bold tracking-wider uppercase">
              {sponsor.tier}
            </p>
          ) : null}
          <h3 className="text-brand-navy mt-2 text-xl font-bold uppercase">
            {sponsor.href ? (
              <a
                className="underline-offset-4 hover:underline"
                data-analytics-context="sponsor_directory"
                data-analytics-event="sponsor_interest_click"
                data-analytics-label={sponsor.name}
                href={sponsor.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {sponsor.name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              sponsor.name
            )}
          </h3>
          {sponsor.description ? (
            <p className="mt-3 leading-7 text-slate-600">
              {sponsor.description}
            </p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

function SponsorLogo({
  logo,
  name,
}: {
  logo: string | undefined;
  name: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!logo || imageFailed) return null;

  return (
    // Remote sponsor logos are administered outside the repository.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`${name} logo`}
      className="h-24 w-full object-contain object-left"
      loading="lazy"
      onError={() => setImageFailed(true)}
      referrerPolicy="no-referrer"
      src={logo}
    />
  );
}
