import Image from "next/image";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Navigation } from "@/components/layout/navigation";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cheddarUpLinks } from "@/data/cheddar-up";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex min-h-20 items-center justify-between gap-5">
        <a
          className="focus-visible:outline-brand-blue flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          href="/"
        >
          <Image
            alt=""
            aria-hidden="true"
            className="h-16 w-16 object-contain"
            height={64}
            priority
            src={siteConfig.logo}
            width={64}
          />
          <span className="text-brand-navy hidden max-w-48 text-sm leading-tight font-black tracking-wide uppercase sm:block">
            North East Texas
            <span className="text-brand-blue block text-xs tracking-[0.16em]">
              Young Republicans
            </span>
          </span>
          <span className="text-brand-navy text-xl font-black sm:hidden">
            NETYR
          </span>
        </a>
        <div className="hidden items-center gap-3 xl:flex">
          <Navigation />
          <a
            className={buttonStyles({
              className: "px-4",
              variant: "secondary",
            })}
            data-analytics-context="desktop_header"
            data-analytics-event="donate_click"
            data-analytics-label="donate"
            href={cheddarUpLinks.donations}
            rel="noopener noreferrer"
            target="_blank"
          >
            Donate
          </a>
          <a
            className={buttonStyles({ className: "px-4" })}
            data-analytics-context="desktop_header"
            data-analytics-event="join_click"
            data-analytics-label="join"
            href="/membership/"
          >
            Join
          </a>
        </div>
        <MobileNavigation />
      </Container>
    </header>
  );
}
