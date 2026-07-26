"use client";

import { useEffect, useRef, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { navigationItems } from "@/data/navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGetInvolvedOpen, setIsGetInvolvedOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGetInvolvedOpen(false);
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="xl:hidden">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        className="border-brand-navy/25 text-brand-navy focus-visible:outline-brand-blue inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={() => {
          if (isOpen) setIsGetInvolvedOpen(false);
          setIsOpen((open) => !open);
        }}
        ref={menuButtonRef}
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
          className="absolute inset-x-0 top-full max-h-[calc(100vh-5rem)] overflow-y-auto border-y border-slate-200 bg-white p-4 shadow-xl"
          id="mobile-navigation"
        >
          <ul className="mx-auto grid max-w-3xl gap-1">
            {navigationItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);

              return (
                <li key={item.href}>
                  {hasChildren ? (
                    <>
                      <div className="flex items-center">
                        <a
                          className="text-brand-navy hover:text-brand-blue focus-visible:outline-brand-blue flex min-h-11 flex-1 items-center rounded-sm px-4 py-3 font-bold tracking-wide uppercase hover:bg-blue-50 focus-visible:outline-2"
                          href={item.href}
                          onClick={() => {
                            setIsGetInvolvedOpen(false);
                            setIsOpen(false);
                          }}
                        >
                          {item.label}
                        </a>
                        <button
                          aria-controls="mobile-get-involved-menu"
                          aria-expanded={isGetInvolvedOpen}
                          aria-label={`${isGetInvolvedOpen ? "Close" : "Open"} ${item.label} menu`}
                          className="text-brand-navy hover:text-brand-blue focus-visible:outline-brand-blue inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm hover:bg-blue-50 focus-visible:outline-2"
                          onClick={() =>
                            setIsGetInvolvedOpen((current) => !current)
                          }
                          type="button"
                        >
                          <svg
                            aria-hidden="true"
                            className={`size-4 transition-transform ${
                              isGetInvolvedOpen ? "rotate-180" : ""
                            }`}
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
                      {isGetInvolvedOpen ? (
                        <ul
                          className="ml-4 grid gap-1 border-l-2 border-blue-100 pl-3"
                          id="mobile-get-involved-menu"
                        >
                          {item.children?.map((child) => (
                            <li key={child.href}>
                              <a
                                className="text-brand-navy hover:text-brand-blue focus-visible:outline-brand-blue block min-h-11 rounded-sm px-4 py-3 font-semibold hover:bg-blue-50 focus-visible:outline-2"
                                href={child.href}
                                onClick={() => {
                                  setIsGetInvolvedOpen(false);
                                  setIsOpen(false);
                                }}
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
                      className="text-brand-navy hover:text-brand-blue focus-visible:outline-brand-blue block min-h-11 rounded-sm px-4 py-3 font-bold tracking-wide uppercase hover:bg-blue-50 focus-visible:outline-2"
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-3 border-t border-slate-200 pt-4">
            <a
              className={buttonStyles({ variant: "secondary" })}
              href="/donate/"
              onClick={() => setIsOpen(false)}
            >
              Donate
            </a>
            <a
              className={buttonStyles()}
              href="/membership/"
              onClick={() => setIsOpen(false)}
            >
              Join NETYR
            </a>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
