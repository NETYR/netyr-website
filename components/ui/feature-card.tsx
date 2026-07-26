import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type FeatureCardProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
};

export function FeatureCard({ children, eyebrow, title }: FeatureCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="from-brand-blue to-brand-red absolute inset-x-0 top-0 h-1 bg-gradient-to-r"
      />
      {eyebrow ? (
        <p className="text-brand-blue text-xs font-bold tracking-[0.16em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="text-brand-navy mt-2 text-xl font-bold uppercase">
        {title}
      </h3>
      <div className="mt-3 leading-7 text-slate-600">{children}</div>
    </Card>
  );
}
