import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type PageMetadata = {
  description: string;
  path: string;
  title: string;
};

export function buildMetadata({
  description,
  path,
  title,
}: PageMetadata): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonicalPath,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [
        {
          url: siteConfig.socialImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [siteConfig.socialImage],
    },
  };
}
