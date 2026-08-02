import type { Sponsor, SponsorLevel } from "@/types/content";

type SponsorLogo = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

type SponsorPresentation = {
  aliases: readonly string[];
  level: SponsorLevel;
  logo: SponsorLogo;
  name: string;
};

function normalizeSponsorName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

const vztvPresentation: SponsorPresentation = {
  aliases: ["VZTV", "Grand Saline Sun VZTV", "Grand Saline Sun / VZTV"],
  level: "President’s Posse Sponsor",
  logo: {
    alt: "VZTV — Grand Saline Sun, Live Local NOW!",
    height: 318,
    src: "/images/sponsors/vztv.png",
    width: 371,
  },
  name: "VZTV",
};

const sponsorPresentations = [vztvPresentation] as const;

export function getSponsorPresentation(name: string) {
  const normalizedName = normalizeSponsorName(name);

  return sponsorPresentations.find((presentation) =>
    presentation.aliases.some(
      (alias) => normalizeSponsorName(alias) === normalizedName,
    ),
  );
}

export function applySponsorPresentation(sponsors: Sponsor[]) {
  const presentedSponsors = sponsors.map((sponsor) => {
    const presentation = getSponsorPresentation(sponsor.name);

    return presentation
      ? { level: presentation.level, name: presentation.name }
      : sponsor;
  });

  for (const presentation of sponsorPresentations) {
    if (
      !presentedSponsors.some(
        (sponsor) =>
          normalizeSponsorName(sponsor.name) ===
          normalizeSponsorName(presentation.name),
      )
    ) {
      presentedSponsors.push({
        level: presentation.level,
        name: presentation.name,
      });
    }
  }

  return presentedSponsors;
}
