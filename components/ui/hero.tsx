import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type HeroProps = {
  actions?: ReactNode;
  compact?: boolean;
  description?: string;
  eyebrow?: string;
  media?: ReactNode;
  title: string;
};

export function Hero({
  actions,
  compact = false,
  description,
  eyebrow,
  media,
  title,
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="bg-brand-navy relative overflow-hidden text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_75%_30%,rgba(0,112,202,0.32),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="from-brand-blue to-brand-red absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r via-white"
      />
      <Container
        className={
          compact
            ? "relative py-16 sm:py-20"
            : "relative py-20 sm:py-28 lg:py-36"
        }
      >
        <div
          className={cn(
            Boolean(media) &&
              "grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]",
          )}
        >
          <div className="max-w-4xl">
            {eyebrow ? (
              <p className="mb-4 text-sm font-bold tracking-[0.2em] text-blue-300 uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1
              className={cn(
                "font-bold tracking-tight text-balance uppercase",
                compact
                  ? "text-4xl sm:text-5xl"
                  : "text-4xl sm:text-6xl lg:text-7xl",
              )}
              id="hero-title"
            >
              {title}
            </h1>
            {description ? (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-pretty text-slate-200 sm:text-xl">
                {description}
              </p>
            ) : null}
            {actions ? (
              <div className="mt-8 flex flex-wrap gap-4">{actions}</div>
            ) : null}
          </div>
          {media ? (
            <div className="mx-auto w-full max-w-md">{media}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
