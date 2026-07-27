# NETYR Website

Official public website for the North East Texas Young Republicans.

The project uses Next.js, React, TypeScript, Tailwind CSS, the App Router,
ESLint, and Prettier. It is configured as a static export for deployment to
GitHub Pages.

## Prerequisites

- Node.js 24 LTS
- npm 11 or newer
- Git

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:contact-integration
npm run build
```

Run the complete validation sequence with:

```bash
npm run check
```

## Environment variables

Copy `.env.example` to `.env.local`. The site URL is required; integration
values stay blank until the related Google service has been published and
tested:

```text
NEXT_PUBLIC_SITE_URL=https://netyr.org
NEXT_PUBLIC_EVENTS_ENDPOINT=
NEXT_PUBLIC_CONTACT_FORM_EMBED_URL=
NEXT_PUBLIC_SPONSORS_FEED_URL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

These are browser-visible values. Use only public feed or web-app URLs. Never
put a spreadsheet ID, private Drive URL, OAuth token, API key, or credential in
any `NEXT_PUBLIC_*` variable.

`NEXT_PUBLIC_GA_MEASUREMENT_ID` enables the reduced-data Google Analytics
configuration and matching Privacy-page disclosure at build time. The
measurement ID is public website configuration, but it remains centralized in
local and GitHub Actions environment configuration instead of being duplicated
across components.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml`:

- runs for pushes to `main` and supports manual dispatch;
- installs with `npm ci`;
- runs the combined validation, production build, and dependency audit;
- uploads `out/` as the GitHub Pages artifact; and
- deploys with the official GitHub Pages actions and required permissions.

The application uses `output: "export"` in `next.config.ts`. Avoid features
that require a runtime server, including Server Actions, request-time cookies,
and dynamic routes without `generateStaticParams`.

The custom domain is `https://netyr.org`; it must be configured in the
repository's Pages settings when deployment is approved. GitHub's custom
Actions workflow ignores `CNAME` files, so none is required. DNS and Google
Workspace records are outside this repository and must not be changed as part
of normal application development.

## Documentation

- [Project structure](./PROJECT_STRUCTURE.md)
- [Contributing](./CONTRIBUTING.md)
- [Content update guide](./CONTENT_UPDATE_GUIDE.md)
- [Deployment guide](./DEPLOYMENT_GUIDE.md)
- [Events integration guide](./EVENTS_INTEGRATION_GUIDE.md)
- [Sponsor integration guide](./SPONSOR_INTEGRATION_GUIDE.md)
- [Contact form setup](./CONTACT_FORM_SETUP.md)
- [Content checklist](./CONTENT_CHECKLIST.md)
- [Source notes](./SOURCE_NOTES.md)
- [Final review](./FINAL_REVIEW.md)
- [Operations guide](./OPERATIONS_GUIDE.md)
- [Performance report](./PERFORMANCE_REPORT.md)

## Current content state

The public architecture, refined organization copy, current officer names and
terms, official federation link, public email, and approved membership Cheddar
Up destination are integrated. The custom Apps Script contact form has been
created, deployed, and tested end to end in the local production build. Its
public `/exec` URL and the Website Events endpoint are environment-configured in
the live GitHub Pages build. The sponsor provider remains inactive until an
approved source is supplied. Review `CONTENT_CHECKLIST.md` for post-launch
content and operational tasks.
