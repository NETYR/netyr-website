import Link from "next/link";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Navigation } from "@/components/layout/navigation";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <Link
          className="rounded-sm text-lg font-bold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          href="/"
        >
          {siteConfig.shortName}
        </Link>
        <Navigation className="hidden md:block" />
        <MobileNavigation />
      </Container>
    </header>
  );
}
