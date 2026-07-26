import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

type HeroProps = {
  actions?: ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
};

export function Hero({ actions, description, eyebrow, title }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="bg-slate-950 text-white">
      <Container className="py-20 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-4 text-sm font-bold tracking-widest text-blue-300 uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            id="hero-title"
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-pretty text-slate-300">
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className="mt-8 flex flex-wrap gap-4">{actions}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
