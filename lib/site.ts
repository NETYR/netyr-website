const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteConfig = {
  name: "North East Texas Young Republicans",
  shortName: "NETYR",
  description: "Official website of the North East Texas Young Republicans.",
  url: configuredSiteUrl ?? "http://localhost:3000",
} as const;
