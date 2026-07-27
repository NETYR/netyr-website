import Image from "next/image";

import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/social/social-links";
import { contactConfig } from "@/data/contact";
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
                <li key={item.href}>
                  <a
                    className="inline-flex min-h-11 items-center text-sm text-slate-200 hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
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
          <p className="mt-6 text-sm text-slate-300">
            Email{" "}
            <a
              className="font-semibold text-white underline underline-offset-4"
              data-analytics-context="footer"
              data-analytics-event="contact_email_click"
              data-analytics-label="president@netyr.org"
              href={`mailto:${contactConfig.publicEmail}`}
            >
              {contactConfig.publicEmail}
            </a>
          </p>
        </div>
      </Container>
      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>
            Based in {organizationContent.location}. Serving Van Zandt County
            and adjoining counties.
          </p>
        </Container>
      </div>
    </footer>
  );
}
