import { socialLinks } from "@/data/social-links";
import { siteConfig } from "@/lib/site";

export function OrganizationJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: new URL(siteConfig.logo, siteConfig.url).toString(),
        },
        sameAs: socialLinks.map((link) => link.href),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        description: siteConfig.description,
        inLanguage: "en-US",
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        url: siteConfig.url,
      },
    ],
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replaceAll("<", "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
