import { siteConfig } from "@/lib/site";

export function OrganizationJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: new URL(siteConfig.logo, siteConfig.url).toString(),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      type="application/ld+json"
    />
  );
}
