# Deployment Guide

## Production model

```text
main branch -> GitHub Actions -> GitHub Pages -> https://netyr.org
```

The Pages workflow is `.github/workflows/deploy-pages.yml`. It uses `npm ci`,
runs the project validation, produces the static `out/` export, uploads it to
GitHub Pages, and deploys with the official Pages actions.

## Required public repository variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_EVENTS_ENDPOINT`
- `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL`
- `NEXT_PUBLIC_SPONSORS_FEED_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

Values may contain only public production endpoints or the public analytics
measurement ID. Never put credentials, private spreadsheet or Calendar IDs,
private recipient addresses, administrative URLs, or tokens in repository
variables.

The Events and Sponsors values must be updated after creating a replacement
Apps Script web-app deployment. Updating the existing contact web-app
deployment retains its public endpoint.

## Release steps

1. Verify the working tree contains only intended changes.
2. Run:

   ```bash
   npm run format
   npm run lint
   npm run typecheck
   npm run test:contact-integration
   npm run build
   npm audit
   ```

3. Review the generated static site locally.
4. Commit a focused change and push `main`.
5. Monitor the Pages workflow until both build and deployment jobs succeed.
6. Verify the live homepage and changed route on desktop and mobile.
7. Verify sitemap, robots, images, metadata, external Cheddar Up actions, and
   any affected Apps Script feed.

## Domain safeguards

GitHub Pages owns the website deployment for `netyr.org`. Do not remove or
alter Google Workspace MX, SPF, DKIM, DMARC, verification, or other mail
records when maintaining website DNS. Confirm both apex and `www` behavior,
HTTPS, and the Pages custom-domain status after DNS changes.

## Rollback

1. Find the last known good commit on `main`.
2. Revert the problematic commit with a new commit; do not rewrite shared
   history.
3. Push `main`, wait for GitHub Pages, and verify production again.
4. If an endpoint itself is faulty, first disable the affected public source or
   update its Apps Script deployment; do not expose a private source as a
   workaround.
