import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  description?: string;
  eyebrow?: string;
  id?: string;
  title?: string;
  tone?: "light" | "white" | "navy";
};

export function Section({
  children,
  className,
  description,
  eyebrow,
  id,
  title,
  tone = "light",
}: SectionProps) {
  const isDark = tone === "navy";

  return (
    <section
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        tone === "light" && "bg-brand-paper",
        tone === "white" && "bg-white",
        isDark && "bg-brand-navy text-white",
        className,
      )}
      id={id}
    >
      <Container>
        {title || description ? (
          <div className="mb-10 max-w-3xl">
            {eyebrow ? (
              <p
                className={cn(
                  "mb-3 text-sm font-bold tracking-[0.18em] uppercase",
                  isDark ? "text-blue-300" : "text-brand-blue",
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  "text-3xl font-bold tracking-tight text-balance uppercase sm:text-4xl",
                  isDark ? "text-white" : "text-brand-navy",
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "mt-4 text-lg leading-8 text-pretty",
                  isDark ? "text-slate-300" : "text-slate-600",
                )}
              >
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
