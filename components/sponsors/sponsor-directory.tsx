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
          <p className="text-brand-blue text-xs font-bold tracking-wider uppercase">
            Community partner
          </p>
          <h3 className="text-brand-navy mt-2 text-xl font-bold uppercase">
            {sponsor.name}
          </h3>
        </Card>
      ))}
    </div>
  );
}
