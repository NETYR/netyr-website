# Deployment Guide

## GitHub Pages architecture

GitHub Actions builds the Next.js static export and uploads `out/` to GitHub
Pages. The workflow is `.github/workflows/deploy-pages.yml`.

- Automatic trigger: pushes to `main`.
- Manual trigger: `workflow_dispatch`.
- Node.js: 24 LTS, matching `.node-version`.
- Install command: `npm ci`.
- Validation and build: `npm run check` and `npm audit`.
- Artifact directory: `out`.
- Deployment environment: `github-pages`.
- Production origin: `https://netyr.org`.

The workflow uses official GitHub Pages actions with Pages/OIDC permissions and
deployment concurrency. Public integration URLs are supplied through GitHub
Actions repository variables; they must never contain spreadsheet IDs,
credentials, edit links, OAuth tokens, or API keys.

## Public integration variables

| Variable                             | Purpose                              | Enable only after                          |
| ------------------------------------ | ------------------------------------ | ------------------------------------------ |
| `NEXT_PUBLIC_EVENTS_ENDPOINT`        | Public read-only event JSON endpoint | Apps Script deployment and event tests     |
| `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL` | Public contact-form `/exec` URL      | Apps Script setup and end-to-end form test |
| `NEXT_PUBLIC_SPONSORS_FEED_URL`      | Future public sponsor feed           | Sponsor approval and feed test             |

An unset event value leaves a professional empty state. An unset contact-form
value leaves the public email as the Contact page's working contact method.

The contact-form and Website Events production `/exec` endpoints were deployed,
passed local end-to-end tests on July 26, 2026, and are stored in ignored
`.env.local` plus the corresponding GitHub Actions repository variables. The
Events service uses the advanced Sheets API with a read-only OAuth scope.

## Release procedure

1. Resolve or approve each launch-blocking item in `CONTENT_CHECKLIST.md`.
2. Deploy and test any integration intended to be live.
3. Add only tested public `/exec` and feed URLs to GitHub Actions repository
   variables.
4. Run `npm ci`, `npm run check`, and `npm audit`.
5. Inspect `out/` and test navigation, the form embed, event graphics, external
   destinations, metadata, and the custom 404 page.
6. Review the Privacy page against the exact enabled services.
7. Confirm `netyr.org` remains configured in GitHub Pages settings.
8. Merge through the approved Git workflow, allow the `main` workflow to run,
   and verify HTTPS and production routes.

## Static-export guardrails

Do not add API routes, middleware, Server Actions, request-time authentication,
or dynamic routes without complete `generateStaticParams()` coverage. Preserve
trailing slashes and root-domain paths; do not add a repository-name base path.
Payment and registration remain on public Cheddar Up collections.

Runtime Google event data reaches the browser only through the explicitly
deployed read-only Apps Script endpoint. The custom contact form runs inside a
separate Apps Script HTML Service web app and uses `google.script.run` for
server-side validation and append-only submission handling. Spreadsheet IDs,
private Sheet URLs, edit links, OAuth tokens, API keys, and service-account
files remain outside the website repository and browser bundle.

Updating the Apps Script editor does not update the production web app. For
future contact-form changes, rerun `runContactSystemTests()`, update the existing
deployment to a new version, repeat the embedded end-to-end test, and retain the
production `/exec` URL unless Google replaces it.

## Domain and email safeguards

The custom domain is set to `netyr.org` in GitHub Pages settings. During DNS
cutover, replace only the existing Squarespace web-hosting A records and the
`www` CNAME. Do not remove or alter Google Workspace MX, SPF, DKIM, DMARC, TXT,
or verification records.

## Rollback

Use the previous successful GitHub Pages deployment. Do not rewrite Git history.
Correct the issue on a new branch and repeat the release checks.
