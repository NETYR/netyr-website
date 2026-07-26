"use client";

import { useEffect, useRef, useState } from "react";

import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/cn";

type NavigationProps = {
  className?: string;
};

export function Navigation({ className }: NavigationProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        navigationRef.current &&
        !navigationRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openMenu) {
        setOpenMenu(null);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu]);

  return (
    <nav
      aria-label="Primary navigation"
      className={cn(className)}
      ref={navigationRef}
    >
      <ul className="flex items-center gap-0.5">
        {navigationItems.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const isOpen = openMenu === item.href;

          return (
            <li className="relative" key={item.label}>
              {hasChildren ? (
                <>
                  <div className="flex items-center">
                    <a
                      className="hover:text-brand-blue focus-visible:outline-brand-blue rounded-sm py-3 pr-1.5 pl-2.5 text-xs font-bold tracking-wide text-slate-700 uppercase hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
                      href={item.href}
                    >
                      {item.label}
                    </a>
                    <button
                      aria-controls="desktop-get-involved-menu"
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Close" : "Open"} ${item.label} menu`}
                      className="hover:text-brand-blue focus-visible:outline-brand-blue inline-flex min-h-11 min-w-8 items-center justify-center rounded-sm text-slate-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
                      onClick={() =>
                        setOpenMenu((current) =>
                          current === item.href ? null : item.href,
                        )
                      }
                      ref={menuButtonRef}
                      type="button"
                    >
                      <svg
                        aria-hidden="true"
                        className={cn(
                          "size-3 transition-transform",
                          isOpen && "rotate-180",
                        )}
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="m3 4.5 3 3 3-3"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </div>
                  {isOpen ? (
                    <ul
                      className="absolute top-full left-0 z-50 mt-1 w-64 rounded-sm border border-slate-200 bg-white p-2 shadow-xl"
                      id="desktop-get-involved-menu"
                    >
                      {item.children?.map((child) => (
                        <li key={child.href}>
                          <a
                            className="text-brand-navy hover:text-brand-blue focus-visible:outline-brand-blue block min-h-11 rounded-sm px-4 py-3 text-sm font-bold hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-1"
                            href={child.href}
                            onClick={() => setOpenMenu(null)}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <a
                  className="hover:text-brand-blue focus-visible:outline-brand-blue rounded-sm px-2.5 py-3 text-xs font-bold tracking-wide text-slate-700 uppercase hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
                  href={item.href}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
