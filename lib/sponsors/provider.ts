import type { Sponsor } from "@/types/content";

export type SponsorProvider = {
  getSponsors: () => Promise<Sponsor[]>;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asUrl(value: unknown) {
  const candidate = asString(value);
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function normalizeSponsor(value: unknown): Sponsor | null {
  if (!value || typeof value !== "object") return null;

  const source = value as Record<string, unknown>;
  const name = asString(source.name ?? source.sponsorName);
  if (!name || source.active === false) return null;

  return {
    active: source.active !== false,
    description: asString(source.description ?? source.shortDescription),
    displayOrder:
      typeof source.displayOrder === "number"
        ? source.displayOrder
        : Number.POSITIVE_INFINITY,
    endDate: asString(source.endDate) || undefined,
    href: asUrl(source.websiteUrl ?? source.href),
    logo: asUrl(source.logoUrl ?? source.logo),
    name,
    startDate: asString(source.startDate) || undefined,
    tier: asString(source.tier ?? source.sponsorshipTier) || undefined,
  };
}

export function parseSponsorFeed(payload: unknown) {
  const source = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        Array.isArray((payload as { sponsors?: unknown }).sponsors)
      ? (payload as { sponsors: unknown[] }).sponsors
      : [];

  return source
    .map(normalizeSponsor)
    .filter((sponsor): sponsor is Sponsor => Boolean(sponsor))
    .sort(
      (left, right) =>
        (left.displayOrder ?? Number.POSITIVE_INFINITY) -
          (right.displayOrder ?? Number.POSITIVE_INFINITY) ||
        left.name.localeCompare(right.name),
    );
}
