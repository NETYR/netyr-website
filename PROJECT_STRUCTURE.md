# Project Structure

## Top-level directories

```text
app/                  App Router routes, layouts, and metadata routes
components/           Shared React components
  layout/             Site-wide header, footer, and navigation
  ui/                 Reusable presentation primitives
data/                 Typed, non-secret site data
hooks/                Shared client-side React hooks
lib/                  Utilities and site-wide configuration
public/               Static files copied directly to the build output
  documents/          Public downloadable documents
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

Cloudflare Pages serves the generated `out` directory. Every route must be
renderable at build time. Dynamic routes must provide `generateStaticParams`.
Do not introduce request-time server features without an explicit hosting
architecture review.

## Core components

- `Header`: site identity and navigation shell
- `Footer`: site-wide footer
- `Navigation`: desktop primary navigation
- `MobileNavigation`: accessible mobile menu
- `Hero`: reusable page introduction
- `Button`: link and native-button variants
- `Card`: bordered content surface
- `Section`: consistent vertical section spacing and headings
- `Container`: responsive maximum-width wrapper
