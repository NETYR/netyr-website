import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-sm border border-slate-200 bg-white p-6 shadow-[0_12px_36px_-24px_rgba(7,26,51,0.35)]",
        className,
      )}
      {...props}
    />
  );
}
