import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type PageMetadata = {
  description: string;
  openGraphType?: "article" | "website";
  path: string;
  title: string;
};

export function buildMetadata({
  description,
  openGraphType = "website",
  path,
  title,
}: PageMetadata): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: openGraphType,
      locale: siteConfig.locale,
      url: canonicalPath,
      siteName: siteConfig.name,
      title,
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
      site: siteConfig.xHandle,
      title,
      description,
      images: [siteConfig.socialImage],
    },
  };
}
