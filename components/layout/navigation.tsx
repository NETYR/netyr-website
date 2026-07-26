import Link from "next/link";

import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/cn";

type NavigationProps = {
  className?: string;
};

export function Navigation({ className }: NavigationProps) {
  return (
    <nav aria-label="Primary navigation" className={cn(className)}>
      <ul className="flex items-center gap-1">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link
              className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
