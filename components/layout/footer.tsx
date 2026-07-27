import Image from "next/image";

import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/social/social-links";
import { footerNavigationItems } from "@/data/navigation";
import { organizationContent } from "@/data/site";
import { socialLinks } from "@/data/social-links";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="from-brand-blue to-brand-red h-1 bg-gradient-to-r via-white" />
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <a
            className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
            href="/"
          >
            <Image
              alt={siteConfig.name}
              className="h-auto w-44"
              height={184}
              src={siteConfig.logo}
              width={180}
            />
          </a>
          <p className="mt-5 max-w-md leading-7 text-slate-300">
            {organizationContent.mission}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-[0.18em] text-blue-300 uppercase">
            Explore NETYR
          </h2>
          <nav aria-label="Footer navigation" className="mt-5">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
              {footerNavigationItems.map((item) => (
                <FooterNavigationLink item={item} key={item.href} />
              ))}
            </ul>
          </nav>
          <h2 className="mt-7 text-sm font-bold tracking-[0.18em] text-blue-300 uppercase">
            Follow NETYR
          </h2>
          <SocialLinks
            className="mt-3 text-sm text-slate-200"
            links={socialLinks}
          />
        </div>
      </Container>
      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>
            Based in {organizationContent.location}. Serving Van Zandt County
            and adjacent counties.
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterNavigationLink({
  item,
}: {
  item: (typeof footerNavigationItems)[number];
}) {
  const external = item.href.startsWith("https://");

  return (
    <li>
      <a
        className="inline-flex min-h-11 items-center text-sm text-slate-200 hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
        href={item.href}
        rel={external ? "noopener noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {item.label}
        {external ? (
          <span className="sr-only"> (opens in a new tab)</span>
        ) : null}
      </a>
    </li>
  );
}
