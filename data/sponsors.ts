import type { Sponsor } from "@/types/content";

// Public names are normally supplied by the cumulative-donation feed.
export const sponsors: Sponsor[] = [];

export const sponsorProgram = {
  tiers: [
    { amount: "$500 or more", name: "Patron" },
    { amount: "$250–$499.99", name: "Sustaining" },
    { amount: "$20–$249.99", name: "Supporting" },
  ],
} as const;
