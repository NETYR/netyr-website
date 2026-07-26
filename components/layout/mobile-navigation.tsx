"use client";

import Link from "next/link";
import { useState } from "react";

import { navigationItems } from "@/data/navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-slate-300 text-slate-950 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="sr-only">
          {isOpen ? "Close navigation" : "Open navigation"}
        </span>
        <svg
          aria-hidden="true"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          )}
        </svg>
      </button>
      {isOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="absolute top-full right-0 z-40 mt-2 min-w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
          id="mobile-navigation"
        >
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="block rounded-md px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-blue-700"
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
