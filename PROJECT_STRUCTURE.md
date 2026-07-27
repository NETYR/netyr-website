# Project Structure

```text
app/                  Static App Router routes and metadata routes
components/           Reusable interface components
  donate/             External Donate forwarding
  events/             Calendar, feed state, cards, and previews
  layout/             Header, footer, and accessible navigation
  sponsors/           Sponsor-name feed presentation
  ui/                 Shared visual primitives
data/                 Typed, non-secret organization content
integrations/         Version-controlled Apps Script source and safe setup notes
  google-apps-script/
    contact-form/     HTML Service contact form and server validation
    website-events/   Dedicated Calendar public-events endpoint
    website-sponsors/ Sponsor-name public-feed endpoint
lib/                  Site configuration and provider utilities
public/               Static website assets
  documents/          Approved public governing-document PDF
  images/             Brand and social-preview images
styles/               Global styles and design tokens
types/                Shared TypeScript types
```

## Architecture rules

- Keep route files focused on composition and route metadata.
- Keep repeated organization facts in `data/`, never in multiple page files.
- Use Server Components by default; use a client component only for genuine
  browser interaction such as menus and the event calendar.
- Keep sensitive identifiers and credentials out of the repository and out of
  all `NEXT_PUBLIC_*` variables.
- Treat the three Apps Script packages as separate trust boundaries. Each
  package accesses only its fixed private resource and returns only approved
  public data.
- Use semantic HTML, keyboard access, visible focus, and meaningful image
  alternatives before adding ARIA.

## Static-export constraints

GitHub Pages serves the generated `out/` directory from
`.github/workflows/deploy-pages.yml`. Routes must render at build time. Do not
introduce request-time cookies, API routes, middleware, Server Actions, or
other server-runtime features without an explicit hosting review.

The production domain is the root domain, `https://netyr.org`; no repository
base path is configured. Internal navigation uses semantic anchors so exported
URLs remain reliable on generic static hosting.

## Core components

- `Header`, `Navigation`, and `MobileNavigation`: accessible global navigation
- `Footer`: organization summary, public navigation, and verified social links
- `EventCalendar`, `EventsDirectory`, and `EventCard`: public Calendar feed UI
- `SponsorDirectory`: public sponsor-name feed UI
- `CheddarUpButton`: safe external payment and registration action
- `Hero`, `Button`, `Card`, `Section`, and `Container`: shared layout primitives
