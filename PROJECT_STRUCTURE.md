# Project Structure

## Top-level directories

```text
app/                  App Router routes, layouts, and metadata routes
components/           Shared React components
  events/             Event loading, cards, previews, and directory
  layout/             Site-wide header, footer, and navigation
  news/               Reusable article presentation
  seo/                Structured-data components
  sponsors/           Sponsor feed and directory presentation
  ui/                 Reusable presentation primitives
data/                 Typed, non-secret site data
hooks/                Shared client-side React hooks
integrations/         Undeployed external-service source and setup notes
  google-apps-script/ Privacy-scoped events and contact-form web apps
lib/                  Utilities and site-wide configuration
  events/             Event provider and normalization
  sponsors/           Sponsor provider and normalization
public/               Static files copied directly to the build output
  documents/          Approved, privacy-reviewed public downloads when supplied
  images/             Approved images and social artwork
styles/               Global styles and design tokens
types/                Shared TypeScript types
```

## Architecture guidelines

- Keep route files focused on composition and route-specific metadata.
- Put reusable layout elements in `components/layout`.
- Put general-purpose visual primitives in `components/ui`.
- Prefer Server Components. Add `"use client"` only when browser state, event
  handlers, or browser APIs are required.
- Keep organization content in `data` once approved instead of embedding it
  repeatedly in components.
- Keep secrets out of `NEXT_PUBLIC_*` variables and out of the repository.
- Use semantic HTML before adding ARIA. Every interactive control must support
  keyboard use and visible focus.
- Add meaningful alternative text for informative images and empty alternative
  text for decorative images.

## Static export constraints

GitHub Pages serves the generated `out` directory uploaded by
`.github/workflows/deploy-pages.yml`. Every route must be renderable at build
time. Dynamic routes must provide `generateStaticParams`. The production site
uses the custom root domain, so no repository-name base path is configured.
Do not introduce request-time server features without an explicit hosting
architecture review.

Internal navigation intentionally uses semantic anchors instead of Next.js
client-navigation links. This avoids exported React Server Component prefetch
paths that generic GitHub Pages hosting cannot rewrite, while preserving normal
URLs, keyboard behavior, and static document navigation.

## Deployment workflow

The GitHub Actions workflow has separate build and deploy jobs. It runs
validation and a static build with Node 24, uploads `out/` using the official
Pages artifact action, and deploys only from `main` with Pages and OIDC
permissions. Concurrency prevents overlapping deployments.

## Core components

- `Header`: site identity and navigation shell
- `Footer`: site-wide footer
- `Navigation`: desktop primary navigation
- `MobileNavigation`: accessible mobile menu
- `EventsDirectory` and `EventsPreview`: runtime public event-feed views
- `EventCard`: event graphic, fallback, details, and add-to-calendar actions
- Contact page: responsive custom Apps Script form embed with an email fallback
- `SponsorDirectory`: curated sponsor-feed presentation
- `Hero`: reusable page introduction
- `Button`: link and native-button variants
- `Card`: bordered content surface
- `Section`: consistent vertical section spacing and headings
- `Container`: responsive maximum-width wrapper
- `CheddarUpButton`: safe external payment/registration action with a disabled
  state when an approved URL is absent
- `EmptyState`: non-misleading presentation for content awaiting approval
- `Callout` and `FeatureCard`: reusable action and information surfaces

## Public routes

`/`, `/about`, `/leadership`, `/events`, `/membership`, `/get-involved`,
`/news`, `/sponsors`, `/donate`, `/contact`, `/governing-documents`,
`/privacy`, and `/accessibility`, plus a custom not-found page.

The individual news route is intentionally deferred until an approved article
exists. Static export requires every dynamic slug to be known at build time.
