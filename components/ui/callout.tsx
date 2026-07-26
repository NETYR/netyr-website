import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

type CalloutProps = {
  actions?: ReactNode;
  description: string;
  title: string;
};

export function Callout({ actions, description, title }: CalloutProps) {
  return (
    <section className="bg-brand-blue py-14 text-white sm:py-16">
      <Container className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-balance uppercase sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-lg leading-8 text-blue-50">{description}</p>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
        ) : null}
      </Container>
    </section>
  );
}
