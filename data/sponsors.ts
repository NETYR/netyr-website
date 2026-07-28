import type { Sponsor } from "@/types/content";

// Add sponsor names, tiers, logos, and links only after approval.
export const sponsors: Sponsor[] = [];

export const sponsorProgram = {
  tiers: [
    { amount: "$500", name: "Patron" },
    { amount: "$250", name: "Sustaining" },
    { amount: "$20", name: "Supporting" },
  ],
} as const;
