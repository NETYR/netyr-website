# NETYR Website Operations Guide

This guide describes the production operating model without recording passwords,
tokens, private identifiers, personal submissions, or administrative URLs.

## Ownership and deployment

- Repository: `NETYR/netyr-website`
- Production branch: `main`
- Hosting: GitHub Pages
- Production URL: `https://netyr.org`
- Workflow: `.github/workflows/deploy-pages.yml`
- Artifact: `out/`

The workflow uses these public repository variables: `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_EVENTS_ENDPOINT`, `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL`,
`NEXT_PUBLIC_SPONSORS_FEED_URL`, and `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Never use
them for secrets, private identifiers, or administrative links.

## Domain, discovery, and analytics

- Keep the GitHub Pages custom domain, HTTPS, and apex/`www` behavior healthy.
- Do not alter Google Workspace mail records while maintaining website DNS.
- The organization-managed Google account owns the Search Console Domain
  property. Resubmit `https://netyr.org/sitemap.xml` after material URL changes
  and review HTTPS, mobile, indexing, and structured-data reports quarterly.
- GA4 receives page views and reviewed non-personal events for membership,
  contact form view/success, social links, events, sponsors, and news.
  Form contents and other personal data must never enter analytics.

## Events publishing

`NETYR Public Events` is the source of truth. Add only approved public events
there; the dedicated Apps Script endpoint reads that one Calendar and returns
sanitized public fields. Follow [EVENTS_INTEGRATION_GUIDE.md](EVENTS_INTEGRATION_GUIDE.md).
After replacing its web-app deployment, update the public Events endpoint
repository variable and redeploy the site.

## Contact-form operations

The custom Apps Script form writes only to `Website Contacts` and sends one
private notification after each newly accepted submission. See
[CONTACT_FORM_SETUP.md](CONTACT_FORM_SETUP.md). For updates, match the
repository source, run setup and all 11 isolated tests, update the existing
production web-app deployment, then conduct one non-sensitive test and remove
only its created row.

## Sponsor publishing

Use only `Website Sponsors` for approved names. The public endpoint returns
active names only. See [SPONSOR_INTEGRATION_GUIDE.md](SPONSOR_INTEGRATION_GUIDE.md).
After a replacement endpoint deployment, update the Sponsor repository variable
and redeploy.

## News, social links, and previews

- News remains file-based; publish only approved, accurate content via the
  centralized data file and `main` deployment workflow.
- Update social profiles only after confirming official ownership in
  `data/social-links.ts`.
- Social preview artwork lives in `public/images/`; after deployment, use each
  platform’s official debugger or validator to request a refreshed preview.

## Rollback and quarterly review

Revert a faulty `main` commit with a new commit; do not rewrite shared history.
Wait for Pages and verify the affected live route. For an endpoint failure,
disable only the affected public variable and redeploy the safe fallback while
repairing Apps Script separately.

Quarterly: review access, GitHub permissions, DNS/HTTPS, Search Console, GA4
data hygiene, social ownership, Cheddar Up links, public events, sponsor names,
news workflow, full validation, Lighthouse, and a non-sensitive contact-form
test with its test row removed.

## Access-responsibility checklist

Keep at least two appropriate administrators and recovery methods for:

- [ ] GitHub organization and repository
- [ ] Domain registrar and DNS provider
- [ ] Google Workspace or organization-managed Google account
- [ ] Google Search Console and Google Analytics
- [ ] Google Apps Script, Calendar, and Sheets
- [ ] Facebook, Instagram, X, and TikTok
- [ ] Cheddar Up
- [ ] Organizational email and notification mailbox
