# NETYR Website

Production website for the North East Texas Young Republicans (NETYR), built as
a statically exported Next.js application and deployed to GitHub Pages.

- Production: <https://netyr.org>
- Repository: `NETYR/netyr-website`
- Production branch: `main`
- Runtime: Node.js 24 and npm 11 or newer

## Local development

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Populate only the public endpoint values needed for local integration testing.
Never place a spreadsheet ID, OAuth credential, password, token, private Drive
URL, or service-account key in an environment file used by the browser.

## Validation

```powershell
npm run format:check
npm run lint
npm run typecheck
npm run test:contact-integration
npm run test:public-integrations
npm run build
npm run test:links
npm audit
```

Optional operational checks:

```powershell
npm run test:contact-browser
npm run test:browser
npm run screenshots
```

`test:contact-live` creates a real contact submission and must be run only by an
authorized administrator who will remove the exact test row afterward.

## Architecture

- `app/` contains public routes and metadata.
- `components/` contains reusable layout, interface, integration, analytics,
  social, and SEO components.
- `data/` contains human-editable public content and public link configuration.
- `lib/` contains parsing, formatting, analytics, metadata, and site utilities.
- `integrations/google-apps-script/` is the reviewed source for the three
  production Google Apps Script projects.
- `scripts/` contains local and browser validation tools.
- `public/` contains only active brand and browser assets.
- `.github/workflows/deploy-pages.yml` validates, builds, and deploys `out/`.

The site has no server runtime, API routes, middleware, database, or private
credential in the browser. Google integrations are exposed through
NETYR-managed Apps Script web applications that return only public fields or
render the contact form.

## Operations

Start with:

- [SITE_INVENTORY.md](SITE_INVENTORY.md)
- [INTEGRATIONS.md](INTEGRATIONS.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)
- [OPERATIONS_AND_RECOVERY.md](OPERATIONS_AND_RECOVERY.md)
- [ACCOUNT_OWNERSHIP_MATRIX.md](ACCOUNT_OWNERSHIP_MATRIX.md)
- [GOOGLE_APPS_SCRIPT_AUDIT.md](GOOGLE_APPS_SCRIPT_AUDIT.md)
- [MIGRATION_PLAN.md](MIGRATION_PLAN.md)
- [CLEANUP_REPORT.md](CLEANUP_REPORT.md)

## Content guardrails

Do not publish private member, donor, contact, roster, payment, or workbook
data. Events must be entered in the NETYR public calendar. Community Partner
recognition must come from the restricted donor workbook through the reviewed
server-side adapter. News, leadership, links, and organization copy must use
approved information only.
