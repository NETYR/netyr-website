const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteConfig = {
  name: "North East Texas Young Republicans",
  shortName: "NETYR",
  description:
    "North East Texas Young Republicans cultivates Republican leaders, strengthens East Texas communities, and connects grassroots engagement with political leadership.",
  url: configuredSiteUrl ?? "https://netyr.org",
  locale: "en_US",
  logo: "/images/brand/netyr-logo.webp",
  socialImage: "/images/og-default.jpg",
  xHandle: "@NET_YR25",
} as const;
