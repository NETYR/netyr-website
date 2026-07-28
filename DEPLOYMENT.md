# Deployment

## Production model

```text
main branch
  -> GitHub Actions validation and static build
  -> out/ artifact
  -> GitHub Pages
  -> netyr.org
```

The site uses `output: "export"`, unoptimized static images, and trailing
slashes. It has no Node.js production server. The GitHub Pages workflow uses
official checkout, Node setup, Pages configuration, artifact upload, and Pages
deployment actions.

## Release procedure

1. Work on a review branch.
2. Run `npm ci` from a clean dependency state.
3. Run `npm run check` and `npm audit`.
4. Run the browser, link, integration, privacy, metadata, and responsive checks
   described in [OPERATIONS_AND_RECOVERY.md](OPERATIONS_AND_RECOVERY.md).
5. Review `git diff --check` and the complete staged diff.
6. Open and review a pull request.
7. Merge to `main`.
8. Monitor the `Deploy to GitHub Pages` workflow until both build and deploy
   jobs succeed.
9. Verify `https://netyr.org`, all routes, public feeds, the contact embed,
   sitemap, robots file, icons, HTTPS, and `www` behavior.

The workflow can be run manually for validation, but its deploy job is limited
to `main`.

## Domain and DNS

- GitHub Pages custom domain: `netyr.org`
- HTTPS enforcement: enabled
- Apex A records: GitHub Pages addresses
- `www`: CNAME to the NETYR GitHub Pages host
- Nameservers: Squarespace Domains DNS
- Email: Google Workspace MX and related TXT records

Never remove or replace email, verification, SPF, DKIM, or DMARC records during
a website deployment. DNS access and renewal authority must be verified by an
authorized NETYR registrar administrator; public DNS proves configuration, not
account ownership.

## Rollback

1. Identify the last known-good commit and successful Pages deployment.
2. Revert the faulty commit with a new commit; do not rewrite `main`.
3. Push the revert and monitor the Pages workflow.
4. Verify production and all integrations.
5. For an Apps Script migration, restore the previous GitHub endpoint variable
   or server-side resource property and keep both deployments available until
   recovery is confirmed.

The audit baseline is also preserved in an offline Git bundle and annotated
local tag. Those artifacts are not committed to the public repository.
