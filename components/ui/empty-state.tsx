import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  title: string;
};

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <Card className="border-brand-blue/35 border-dashed bg-blue-50/45 text-center">
      <div
        aria-hidden="true"
        className="bg-brand-navy mx-auto mb-5 flex size-12 items-center justify-center rounded-full text-xl font-black text-white"
      >
        N
      </div>
      <h2 className="text-brand-navy text-xl font-bold uppercase">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  );
}
