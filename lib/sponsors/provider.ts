import type { Sponsor, SponsorTier } from "@/types/content";

export type SponsorProvider = {
  getSponsors: () => Promise<Sponsor[]>;
};

const sponsorTiers: SponsorTier[] = ["Patron", "Sustaining", "Supporting"];
const tierOrder = new Map(sponsorTiers.map((tier, index) => [tier, index]));

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPublicUrl(value: unknown) {
  const candidate = asString(value);
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function asTier(value: unknown) {
  const candidate = asString(value);
  return sponsorTiers.includes(candidate as SponsorTier)
    ? (candidate as SponsorTier)
    : null;
}

function asDisplayOrder(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function normalizeSponsor(value: unknown): Sponsor | null {
  if (!value || typeof value !== "object") return null;

  const source = value as Record<string, unknown>;
  const name = asString(source.name);
  const tier = asTier(source.tier);

  if (!name || !tier || source.active === false) return null;

  return {
    displayOrder: asDisplayOrder(source.displayOrder),
    href: asPublicUrl(source.websiteUrl ?? source.href),
    logo: asPublicUrl(source.logoUrl ?? source.logo),
    name,
    tier,
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
    .filter((sponsor): sponsor is Sponsor => Boolean(sponsor))
    .sort(
      (left, right) =>
        (tierOrder.get(left.tier) ?? Number.MAX_SAFE_INTEGER) -
          (tierOrder.get(right.tier) ?? Number.MAX_SAFE_INTEGER) ||
        (left.displayOrder ?? Number.MAX_SAFE_INTEGER) -
          (right.displayOrder ?? Number.MAX_SAFE_INTEGER) ||
        left.name.localeCompare(right.name),
    );

  return normalized.filter(
    (sponsor, index) =>
      normalized.findIndex(
        (candidate) =>
          candidate.name.toLocaleLowerCase() ===
          sponsor.name.toLocaleLowerCase(),
      ) === index,
  );
}
