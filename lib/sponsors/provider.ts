import type { Sponsor } from "@/types/content";

export type SponsorProvider = {
  getSponsors: () => Promise<Sponsor[]>;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSponsor(value: unknown): Sponsor | null {
  const name =
    typeof value === "string"
      ? asString(value)
      : value && typeof value === "object"
        ? asString((value as Record<string, unknown>).name)
        : "";
  if (!name) return null;

  return {
    name,
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

  const normalized = source
    .map(normalizeSponsor)
    .filter((sponsor): sponsor is Sponsor => Boolean(sponsor));

  return normalized.filter(
    (sponsor, index) =>
      normalized.findIndex(
        (candidate) =>
          candidate.name.toLowerCase() === sponsor.name.toLowerCase(),
      ) === index,
  );
}
