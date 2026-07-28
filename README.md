# NETYR Website

Official public website for the North East Texas Young Republicans (NETYR).

The project uses Next.js, React, TypeScript, Tailwind CSS, the App Router,
ESLint, and Prettier. It statically exports to GitHub Pages for
`https://netyr.org`.

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

## Validation

```bash
npm run format
npm run lint
npm run typecheck
npm run test:contact-integration
npm run test:public-integrations
npm run build
npm audit
```

`npm run check` runs the project’s combined validation sequence.

## Public build configuration

Copy `.env.example` to `.env.local` for local work. The GitHub Pages workflow
receives the same public values through repository variables:

```text
NEXT_PUBLIC_SITE_URL=https://netyr.org
NEXT_PUBLIC_EVENTS_ENDPOINT=
NEXT_PUBLIC_CONTACT_FORM_EMBED_URL=
NEXT_PUBLIC_SPONSORS_FEED_URL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

These values are visible in a built site. Store only public web-app/feed URLs
or the public analytics measurement ID. Never store spreadsheet or calendar
identifiers, private Drive links, credentials, tokens, or Apps Script editor
URLs in a `NEXT_PUBLIC_*` value.

## Publishing model

- **Events:** NETYR administrators create approved events in the dedicated
  `NETYR Public Events` Google Calendar. The read-only Apps Script endpoint
  returns only public event fields to the Events page.
- **Contact:** The custom Apps Script HTML Service form writes only to the
  `Website Contacts` sheet and sends one private notification after each newly
  accepted submission. The website does not expose the workbook or submission
  data.
- **Community Partners:** The existing master donor/contact workbook remains
  the sole source of truth. The Apps Script feed reads the fixed `Donations`
  ledger, cumulatively aggregates positive valid rows by normalized Donor Name,
  assigns the internal recognition tier, and returns only the name and tier.
- **Membership and donations:** The approved public Cheddar Up collection is
  the external destination for membership, dues, and Donate calls to action.

## Deployment

`.github/workflows/deploy-pages.yml` runs on pushes to `main` and manual
dispatch. It installs with `npm ci`, validates, builds the static `out/`
directory, uploads the Pages artifact, and deploys it with the official GitHub
Pages actions. Do not add server-only Next.js features without changing the
hosting architecture.

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md),
[CONTENT_UPDATE_GUIDE.md](CONTENT_UPDATE_GUIDE.md), and
[OPERATIONS_GUIDE.md](OPERATIONS_GUIDE.md) for operating procedures.
