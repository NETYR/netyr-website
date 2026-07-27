# NETYR Website Operations Guide

This guide records the production operating model for the official North East
Texas Young Republicans website without including passwords, tokens, private
workbook identifiers, deployment identifiers, or personal submissions. Keep all
services under organization-controlled accounts and limit administrator access
to people who need it.

## Production ownership and deployment

- Repository: `NETYR/netyr-website`
- Production branch: `main`
- Public URL: `https://netyr.org`
- Hosting: GitHub Pages
- Workflow: `.github/workflows/deploy-pages.yml`
- Static artifact: `out/`

The workflow runs `npm ci`, the combined validation command, a dependency audit,
the static export, Pages artifact upload, and Pages deployment. It receives
public runtime configuration through these GitHub Actions repository variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_EVENTS_ENDPOINT`
- `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL`
- `NEXT_PUBLIC_SPONSORS_FEED_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

These variables may contain only public website endpoints or public measurement
configuration. Never place Google credentials, spreadsheet identifiers, tokens,
contact submissions, or administrative URLs in a `NEXT_PUBLIC_*` value.

## Custom domain and DNS

GitHub Pages is configured for the apex domain `netyr.org`. The DNS provider
must retain the GitHub Pages apex records and the `www` record required by
GitHub. Do not remove or overwrite Google Workspace MX, SPF, DKIM, DMARC,
verification, or other email-related records while changing website DNS.

After any DNS change, confirm:

1. `https://netyr.org` resolves to the current Pages deployment.
2. `https://www.netyr.org` resolves or redirects consistently to the apex site.
3. GitHub Pages reports the custom domain as valid.
4. HTTPS is enforced and the certificate is valid.
5. Organizational email continues to send and receive.

## Google Search Console

The organization-managed Google account owns a Domain property for `netyr.org`.
The production sitemap is `https://netyr.org/sitemap.xml`; the robots file is
`https://netyr.org/robots.txt`.

To submit or resubmit the sitemap, select the domain property, open **Sitemaps**,
enter the production sitemap URL, and submit it. Use **URL inspection** for a
specific public page, run a live test, and request indexing only after the page
is deployed and stable. Review indexing, HTTPS, mobile usability, and structured
data reports quarterly and after significant route changes.

Do not record DNS verification values in this repository.

## Google Analytics

The GA4 account and property use the organization name. The web stream targets
`https://netyr.org`, and its public measurement ID is supplied through
`NEXT_PUBLIC_GA_MEASUREMENT_ID`.

The website tracks:

- ordinary `page_view` events;
- membership link clicks;
- contact form views and successful submissions;
- public contact email clicks;
- social profile clicks;
- event registration, details, and calendar clicks;
- sponsor-interest clicks; and
- approved news article views.

No analytics event may include names, email addresses, phone numbers, messages,
form-field values, sheet data, or other personally identifying information.
Advertising storage, ad personalization, and Google signals are disabled.

To verify analytics, open GA4 Realtime in the organization property, visit the
production site in a separate tab, navigate to a second page, and trigger one
non-sensitive tracked action. Confirm the page view and event name appear
without personal parameters.

## Contact form

The custom contact form is an organization-owned Google Apps Script HTML Service
web app embedded on `/contact/`. The private workbook identifier exists only in
Apps Script Properties. Server code writes only to the fixed `Website Contacts`
sheet and never returns sheet rows.

The website receives a cross-origin message containing only a fixed success
signal after Apps Script confirms submission. That signal records
`contact_form_submission_success`; no form fields cross into analytics.

When updating the contact Apps Script:

1. Apply the repository source to the existing organization-owned Apps Script
   project.
2. Run the isolated contact tests.
3. Create a new version and update the production deployment.
4. Test validation and one non-sensitive production submission.
5. Confirm the test row has status `New` in `Website Contacts`.
6. Remove only that identified test row.
7. Confirm a success event appears in GA4 without form values.

## Events publishing

`Website Events` is the sole production source for public events. The
organization-owned Apps Script endpoint reads only that fixed tab and returns
approved public fields as JSON. Administrators do not edit React components for
routine events.

Before publishing:

1. Add the event to `Website Events`.
2. Complete the required title, start date, and active fields.
3. Use an approved public URL for registration and any graphic.
4. Keep a draft or unapproved event inactive.
5. Confirm Central Time dates and times.
6. Load `/events/` and verify the card, link, graphic or branded fallback, and
   Event structured data.

Inactive records do not display. Past records follow the endpoint and website
status rules. Temporary workflow-test rows must remain inactive and be removed
after verification.

## News publishing

News is intentionally file-based in `data/news.ts`; no CMS is installed. Add
only approved organization content with a unique slug, accurate publication
date, supported category, excerpt, and article body. Run validation, inspect the
article metadata and structured data, then deploy through `main`. Do not publish
draft political statements or invented updates.

## Social profiles and sharing

Verified URLs are centralized in `data/social-links.ts`. The same list powers
public links and Organization `sameAs` schema. Confirm ownership before adding
or replacing an account. A handle seen on one platform is not evidence for
another platform.

At this review, the organization-controlled Facebook, Instagram, TikTok, and X
profiles were verified. Recheck access and public ownership presentation during
each quarterly review.

The default social preview is `public/images/og-default.jpg` at 1200 × 630.
Every route generates canonical Open Graph and large X card metadata. After
changing an image or metadata, deploy first and then request a new scrape through
the destination platform's sharing debugger or validator. Social platforms can
cache an older preview for hours or days.

## Rollback and incident response

For a website regression, identify the last known-good commit and create a new
revert commit; do not rewrite `main` history. Push the revert, monitor the Pages
workflow, then verify production. The previous deployment can provide recovery
evidence, but source control remains the deployment record.

For a contact or event integration incident, clear only the affected public
endpoint repository variable, redeploy the safe website fallback, and repair
Apps Script separately. Never make a private workbook public as a workaround.

## Dependency updates

Review dependencies at least quarterly:

1. Create a maintenance branch.
2. Apply supported patch and minor updates.
3. Run formatting, lint, type checking, integration tests, build, and
   `npm audit`.
4. Test navigation, integrations, accessibility, and Lighthouse results.
5. Merge only after review, then monitor the Pages deployment.

## Quarterly review checklist

- Confirm GitHub and Google administrators are current.
- Review branch protection and Pages workflow permissions.
- Confirm the domain registration and organization payment method are current.
- Verify DNS, HTTPS, Search Console, sitemap, and robots status.
- Review GA4 Realtime and events for personal-data leakage.
- Test the contact form and remove the test submission.
- Test the inactive and active Events workflow without publishing fake content.
- Review social profile ownership and remove obsolete links.
- Check membership and other external links.
- Run `npm audit` and the full validation suite.
- Run mobile and desktop Lighthouse audits on the principal routes.
- Review privacy, accessibility, content placeholders, and legal-review items.

## Access responsibility checklist

The organization should retain at least two appropriate administrators, recovery
methods, and documented succession for:

- [ ] GitHub organization and repository
- [ ] Domain registrar and DNS provider
- [ ] Google Workspace or organization-managed Google account
- [ ] Google Search Console
- [ ] Google Analytics
- [ ] Google Apps Script contact and event projects
- [ ] Google Sheets contact and event destinations
- [ ] Facebook
- [ ] Instagram
- [ ] X
- [ ] TikTok
- [ ] Cheddar Up
- [ ] Organizational email

Do not place usernames, passwords, backup codes, tokens, private workbook URLs,
or personal account recovery information in this repository.
