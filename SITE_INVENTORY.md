# Site Inventory

Inventory date: July 28, 2026. Baseline: 123 tracked files, 6,736,990 bytes
(6.425 MiB). Audited working tree: 114 files, 2,113,965 bytes (2.016 MiB).
Every retained path is listed below. No tracked file contains a production
secret; integration identifiers are supplied through GitHub variables or
private Apps Script properties.

## Public routes

| Route                | Source                       | Purpose and dynamic behavior                           | Sitemap | Integration                        |
| -------------------- | ---------------------------- | ------------------------------------------------------ | ------- | ---------------------------------- |
| `/`                  | `app/page.tsx`               | Homepage; next-event announcement is rendered globally | Yes     | Events feed, Cheddar Up            |
| `/about/`            | `app/about/page.tsx`         | Organization overview and federation link              | Yes     | Official external federation link  |
| `/leadership/`       | `app/leadership/page.tsx`    | Verified public officers                               | Yes     | Centralized leadership data        |
| `/events/`           | `app/events/page.tsx`        | Client monthly public-event directory                  | Yes     | Events Apps Script                 |
| `/get-involved/`     | `app/get-involved/page.tsx`  | Action hub                                             | Yes     | Internal routes and approved links |
| `/membership/`       | `app/membership/page.tsx`    | Membership information and dues action                 | Yes     | Cheddar Up                         |
| `/news/`             | `app/news/page.tsx`          | Approved news listing or empty state                   | Yes     | Local approved records             |
| `/sponsors/`         | `app/sponsors/page.tsx`      | Community Partner recognition                          | Yes     | Partners Apps Script               |
| `/donate/`           | `app/donate/page.tsx`        | Approved external support handoff                      | Yes     | Cheddar Up                         |
| `/contact/`          | `app/contact/page.tsx`       | Embedded contact form and email alternative            | Yes     | Contact Apps Script                |
| `/privacy/`          | `app/privacy/page.tsx`       | Accurate website data-practice summary                 | Yes     | Describes active services          |
| `/accessibility/`    | `app/accessibility/page.tsx` | Access commitment and barrier-reporting path           | Yes     | Organizational email               |
| `/robots.txt`        | `app/robots.ts`              | Public crawl policy and sitemap pointer                | N/A     | Static metadata route              |
| `/sitemap.xml`       | `app/sitemap.ts`             | Active static routes and approved articles             | N/A     | Static metadata route              |
| all unmatched routes | `app/not-found.tsx`          | Branded 404                                            | No      | None                               |

No API route, dynamic route, server action, middleware, server function,
database, or production Node runtime exists. The first approved news article
will require adding a static-export-compatible detail route.

## Retained manifest

### Production application

All paths in this group are production required. App Router discovers route
files dynamically by framework convention; other files are reached through
static imports. Risk is low when validation passes.

```text
app/about/page.tsx
app/accessibility/page.tsx
app/contact/page.tsx
app/donate/page.tsx
app/events/page.tsx
app/get-involved/page.tsx
app/layout.tsx
app/leadership/page.tsx
app/membership/page.tsx
app/news/page.tsx
app/not-found.tsx
app/page.tsx
app/privacy/page.tsx
app/robots.ts
app/sitemap.ts
app/sponsors/page.tsx
components/analytics/site-analytics.tsx
components/contact/contact-form-embed.tsx
components/events/event-announcement.tsx
components/events/event-calendar.tsx
components/events/events-directory.tsx
components/events/use-events.ts
components/layout/footer.tsx
components/layout/header.tsx
components/layout/mobile-navigation.tsx
components/layout/navigation.tsx
components/seo/event-json-ld.tsx
components/seo/organization-json-ld.tsx
components/social/social-links.tsx
components/social/social-utility-bar.tsx
components/sponsors/sponsor-directory.tsx
components/ui/button.tsx
components/ui/callout.tsx
components/ui/card.tsx
components/ui/cheddar-up-button.tsx
components/ui/container.tsx
components/ui/empty-state.tsx
components/ui/feature-card.tsx
components/ui/hero.tsx
components/ui/section.tsx
data/cheddar-up.ts
data/contact.ts
data/events.ts
data/leadership.ts
data/membership.ts
data/navigation.ts
data/news.ts
data/site.ts
data/social-links.ts
data/sponsors.ts
lib/analytics.ts
lib/cn.ts
lib/events/format.ts
lib/events/provider.ts
lib/metadata.ts
lib/site.ts
lib/sponsors/provider.ts
styles/globals.css
types/content.ts
types/navigation.ts
```

The `data/` files are the human-editable public-content layer. They contain no
private roster or donor records. Event and sponsor provider files validate and
minimize untrusted public feed payloads. Client components are used only where
navigation, analytics, embedded content, or live feeds
require browser behavior. The News content model is ready for approved records;
a detail route should be added with the first approved article.

### Google integration source

These paths are integration required and are the reviewable source of deployed
Apps Script projects. `Code.gs` files may reference private property names but
contain no property values.

```text
integrations/google-apps-script/contact-form/appsscript.json
integrations/google-apps-script/contact-form/Code.gs
integrations/google-apps-script/contact-form/Index.html
integrations/google-apps-script/contact-form/JavaScript.html
integrations/google-apps-script/contact-form/SECURITY.md
integrations/google-apps-script/contact-form/SETUP.md
integrations/google-apps-script/contact-form/Stylesheet.html
integrations/google-apps-script/contact-form/TESTING.md
integrations/google-apps-script/website-events/appsscript.json
integrations/google-apps-script/website-events/Code.gs
integrations/google-apps-script/website-events/SECURITY.md
integrations/google-apps-script/website-events/SETUP.md
integrations/google-apps-script/website-events/TESTING.md
integrations/google-apps-script/website-sponsors/appsscript.json
integrations/google-apps-script/website-sponsors/Code.gs
integrations/google-apps-script/website-sponsors/SECURITY.md
integrations/google-apps-script/website-sponsors/SETUP.md
integrations/google-apps-script/website-sponsors/TESTING.md
```

### Active public assets

| Path                                        | Purpose                          | References               | Classification/action         |
| ------------------------------------------- | -------------------------------- | ------------------------ | ----------------------------- |
| `public/apple-touch-icon.png`               | iOS/home-screen icon, 180×180    | `app/layout.tsx`         | Production required; retain   |
| `public/favicon.png`                        | Browser icon, 64×64              | `app/layout.tsx`         | Production required; retain   |
| `public/images/brand/netyr-logo.webp`       | Optimized visible logo           | `lib/site.ts`            | Production required; retain   |
| `public/images/brand/netyr-logo-source.png` | Official lossless source artwork | Asset-maintenance source | Official brand source; retain |
| `public/images/og-default.jpg`              | Social preview, 1200×630         | `lib/site.ts`            | Production required; retain   |

No video, font, screenshot, download, temporary export, mock asset, or duplicate
logo remains in the tracked public tree. The source PNG is intentionally larger
than the web derivative and is retained as the official editable-quality asset.

### Build, deployment, development, and test files

```text
.env.example
.github/workflows/deploy-pages.yml
.gitignore
.node-version
.prettierignore
.prettierrc.json
eslint.config.mjs
next.config.ts
package-lock.json
package.json
postcss.config.mjs
scripts/capture-review-screenshots.mjs
scripts/verify-browser-pages.mjs
scripts/verify-contact-apps-script.mjs
scripts/verify-contact-browser.mjs
scripts/verify-live-contact-submission.mjs
scripts/verify-links-and-metadata.mjs
scripts/verify-public-integrations.mjs
tsconfig.json
```

Configuration files are development or deployment required. The seven scripts are
test/operations required and are exposed through explicit npm commands.
`verify-live-contact-submission.mjs` is intentionally excluded from the routine
check because it writes a real test submission.

### Operating documentation

```text
ACCOUNT_OWNERSHIP_MATRIX.md
CLEANUP_REPORT.md
CONTRIBUTING.md
DEPLOYMENT.md
ENVIRONMENT_VARIABLES.md
GOOGLE_APPS_SCRIPT_AUDIT.md
INTEGRATIONS.md
MIGRATION_PLAN.md
OPERATIONS_AND_RECOVERY.md
README.md
SECURITY.md
SITE_INVENTORY.md
```

These files are documentation required. Sensitive IDs, tokens, recovery codes,
private URLs, workbook rows, and credentials are intentionally excluded.

## Dependency inventory

| Dependency                                        | Scope                             | Exact use                                                         | Action                                  |
| ------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------- | --------------------------------------- |
| `next`                                            | Production                        | App Router, metadata, static export, images, navigation utilities | Retain                                  |
| `react`                                           | Production                        | Component rendering and hooks                                     | Retain                                  |
| `react-dom`                                       | Production                        | Next.js browser rendering                                         | Retain                                  |
| `@tailwindcss/postcss`                            | Development/build                 | Tailwind PostCSS integration                                      | Retain                                  |
| `tailwindcss`                                     | Development/build                 | Utility generation from `styles/globals.css` and components       | Retain                                  |
| `postcss` (transitive override)                   | Development/build                 | CSS processing security floor                                     | Retain                                  |
| `typescript`                                      | Development/build                 | Strict type checking and Next compilation                         | Retain                                  |
| `@types/node`                                     | Development                       | Node/build/test script types                                      | Retain                                  |
| `@types/react`                                    | Development                       | React TypeScript declarations                                     | Retain                                  |
| `@types/react-dom`                                | Development                       | React DOM TypeScript declarations                                 | Retain                                  |
| `eslint`                                          | Development                       | Source linting                                                    | Retain                                  |
| `eslint-config-next`                              | Development                       | Next.js lint rules                                                | Retain                                  |
| `eslint-config-prettier`                          | Development                       | Prevent formatter/linter conflicts                                | Retain                                  |
| `prettier`                                        | Development                       | Formatting                                                        | Retain                                  |
| `prettier-plugin-tailwindcss`                     | Development                       | Stable Tailwind class order                                       | Retain                                  |
| `brace-expansion`, `minimatch`, `sharp` overrides | Transitive security/compatibility | Patched transitive versions used by build tooling                 | Retain and review with lockfile updates |

No direct dependency is duplicated or unused. An unused-file/export scan was
manually reviewed: operational scripts were retained and wired to npm scripts;
the news components were connected to the static article route; empty hooks and
unnecessary exports were removed.

## Generated and ignored items

`node_modules/`, `.next/`, `out/`, `*.tsbuildinfo`, `next-env.d.ts`, `.env.local`,
coverage, logs, editor caches, and OS metadata are generated or local-only and
are ignored. They may exist in a working directory but are not part of the
repository inventory or deployment artifact.

## Sensitive boundaries

- The public repository contains no spreadsheet/calendar/deployment ID value.
- Public `/exec` endpoints are supplied only as build variables.
- Browser responses contain approved event fields or partner `name`/`tier`.
- Contact submissions, donor transactions, member/roster data, recovery data,
  and account credentials remain outside the repository.
