import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  description?: string;
  title?: string;
};

export function Section({
  children,
  className,
  description,
  title,
}: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <Container>
        {title || description ? (
          <div className="mb-10 max-w-3xl">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight text-balance text-slate-950 sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-lg leading-8 text-pretty text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
