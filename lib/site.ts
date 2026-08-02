const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteConfig = {
  name: "North East Texas Young Republicans",
  shortName: "NETYR",
  description:
    "Connect with the North East Texas Young Republicans, discover upcoming events, become a member, and help develop the next generation of conservative leaders.",
  url: configuredSiteUrl ?? "https://netyr.org",
  locale: "en_US",
  logo: "/images/brand/netyr-logo.webp",
  socialImage: "/images/og-default.jpg",
  xHandle: "@NET_YR25",
} as const;
