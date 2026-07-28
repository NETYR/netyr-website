import type { Sponsor, SponsorLevel } from "@/types/content";

export const sponsorLevels: SponsorLevel[] = [
  "President’s Posse Sponsor",
  "Texas Pioneer Sponsor",
  "Lone Star Sponsor",
  "Piney Woods Sponsor",
];
const levelOrder = new Map(sponsorLevels.map((level, index) => [level, index]));

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asLevel(value: unknown) {
  const candidate = asString(value);
  return sponsorLevels.includes(candidate as SponsorLevel)
    ? (candidate as SponsorLevel)
    : null;
}

function normalizeSponsor(value: unknown): Sponsor | null {
  if (!value || typeof value !== "object") return null;

  const source = value as Record<string, unknown>;
  const name = asString(source.name);
  const level = asLevel(source.level);

  if (!name || !level) return null;

  return {
    level,
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
    .filter((sponsor): sponsor is Sponsor => Boolean(sponsor))
    .sort(
      (left, right) =>
        (levelOrder.get(left.level) ?? Number.MAX_SAFE_INTEGER) -
          (levelOrder.get(right.level) ?? Number.MAX_SAFE_INTEGER) ||
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
