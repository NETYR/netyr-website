import type { SocialLink } from "@/types/content";

const iconPaths = {
  Facebook:
    "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24V7.9h-1.51c-1.49 0-1.96.93-1.96 1.88v2.29h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z",
  Instagram:
    "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.15 1.5a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  TikTok:
    "M12.53.02c1.35-.02 2.69-.01 4.03-.02.08 1.58.65 3.19 1.8 4.3 1.15 1.14 2.78 1.66 4.36 1.84v4.14a10.9 10.9 0 0 1-4.32-1c-.59-.27-1.13-.6-1.67-.95-.01 3 .01 6.01-.02 9a7.53 7.53 0 0 1-1.39 4.04 7.66 7.66 0 0 1-6.1 3.34 7.36 7.36 0 0 1-4.23-1.07 7.6 7.6 0 0 1-3.77-5.88 8.4 8.4 0 0 1-.01-1.56 7.84 7.84 0 0 1 2.67-5.12 7.63 7.63 0 0 1 6.34-1.78c.02 1.52-.04 3.04-.04 4.56a3.38 3.38 0 0 0-3.11.39 3.2 3.2 0 0 0-1.41 1.79c-.22.52-.16 1.1-.15 1.66.25 1.68 1.87 3.09 3.59 2.94 1.14-.01 2.23-.68 2.82-1.65.19-.34.4-.68.41-1.08.1-1.79.06-3.58.07-5.37.01-4.04-.01-8.08.03-12.12Z",
  X: "M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.26-8.3L2.97 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.73L8.43 4.05H6.58L17.8 19.84Z",
} as const;

export function SocialLinks({
  className = "",
  iconOnly = false,
  links,
}: {
  className?: string;
  iconOnly?: boolean;
  links: SocialLink[];
}) {
  if (links.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`.trim()}>
      {links.map((item) => (
        <li key={item.href}>
          <a
            aria-label={`Visit NETYR on ${item.label} (opens in a new tab)`}
            className={`focus-visible:outline-brand-blue inline-flex min-h-11 items-center justify-center gap-2 rounded-sm font-semibold underline-offset-4 hover:bg-blue-50 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              iconOnly ? "min-w-11 px-2" : "px-2"
            }`}
            data-analytics-context="social_profiles"
            data-analytics-event="social_link_click"
            data-analytics-label={item.label}
            href={item.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="size-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d={iconPaths[item.label]} />
            </svg>
            <span className={iconOnly ? "sr-only" : undefined}>
              {item.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
