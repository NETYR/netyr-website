# Content Checklist

## Completed

- [x] Production origin centralized as `https://netyr.org`.
- [x] Public organization email set to `president@netyr.org`.
- [x] Official Texas Young Republicans link added to the About page.
- [x] Current officer names, titles, and January 2026 – January 2028 terms
      verified from the private club roster without importing private member
      data.
- [x] Officer terms restored for the four occupied offices; the Treasurer
      vacancy has no term.
- [x] Contact Us restored as a top-level desktop and mobile navigation item.
- [x] Get Involved uses separate overview-link and submenu-button controls.
- [x] Membership remains available under Get Involved.
- [x] Approved Cheddar Up membership-dues collection centralized in
      `data/cheddar-up.ts`.
- [x] `Website Events` structured as the isolated 15-column event source.
- [x] Event endpoint adapter, cards, loading/error/empty states, graphic
      fallback, and Apps Script source implemented.
- [x] Custom Apps Script contact-form package, embed support, and email-only
      fallback implemented.
- [x] Sponsor provider interface implemented for a future curated feed.
- [x] Public-facing source-audit and development language removed from pages.

## Website Events production status

- [ ] Add approved public events to the `Website Events` tab.
- [x] Deploy `integrations/google-apps-script/website-events/` with an
      organization-managed account.
- [x] Store the workbook ID only in the Apps Script `SPREADSHEET_ID` property.
- [x] Test the production `/exec` response using the integration testing guide.
- [x] Add the tested endpoint as the GitHub Actions repository variable
      `NEXT_PUBLIC_EVENTS_ENDPOINT`.
- [x] Verify a temporary future event renders through the endpoint and Events
      page, then remove only the test row and confirm it leaves the feed.
- [ ] Verify an event create, update, deactivate, graphic, registration,
      featured, and past-event administration flow when the first approved
      event is published.

## Custom contact form status and remaining launch actions

- [x] Create the deployable HTML Service form and server validation package in
      `integrations/google-apps-script/contact-form/`.
- [x] Confirm the private `Website Contacts` tab has the intended 15 headers
      without reading submission or roster rows.
- [x] Create the organization-managed Apps Script project and copy the generated
      project files.
- [x] Store the real workbook ID only in the private Apps Script
      `SPREADSHEET_ID` property.
- [x] Run and authorize `setupContactSystem()`.
- [x] Run `runContactSystemTests()` and confirm all ten isolated tests pass.
- [x] Deploy the web app for public access and obtain the production `/exec`
      URL.
- [x] Add the tested URL to ignored local configuration as
      `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL`.
- [x] Test one real submission and confirm it appears only in
      `Website Contacts`, then remove the clearly marked test row.
- [x] Add the tested `/exec` URL as the GitHub Actions repository variable
      `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL` before an approved launch.
- [ ] Establish contact-submission retention, access, assignment, and deletion
      practices.
- [x] Complete a final Privacy-page review after the form is active.

## Remaining content and approvals

- [ ] Approve final homepage, About, Leadership, Get Involved, Sponsors, Contact,
      Privacy, and Accessibility copy.
- [ ] Confirm the Treasurer vacancy is suitable for public display.
- [ ] Supply approved officer biographies and headshots if leadership wants them
      displayed.
- [x] Verify and connect official Facebook, Instagram, TikTok, and X profiles.
- [ ] Supply approved sponsor tiers, benefits, current sponsor names, logos,
      descriptions, and links.
- [ ] Supply or approve a curated sponsor feed and access method before setting
      `NEXT_PUBLIC_SPONSORS_FEED_URL`.
- [ ] Supply the Cheddar Up donation collection URL.
- [ ] Supply the Cheddar Up sponsorship collection URL.
- [ ] Supply any approved event or merchandise Cheddar Up URLs.
- [ ] Approve donation-purpose language and complete legal/tax review.
- [ ] Approve sponsorship language and any financial terms.
- [ ] Approve a public, signature-free NETYR governing-document PDF or authorize
      publication of the signed source.
- [ ] Confirm current TYRF charter status.
- [ ] Review membership citizenship and geographic eligibility language.
- [ ] Supply approved organization, leadership, event, and community photos.
- [ ] Supply approved news articles or announcements.
- [ ] Activate `app/news/[slug]/` with `generateStaticParams()` when the first
      approved news article is supplied.
- [ ] Complete legal review of any required political disclaimer.
- [x] Enable GitHub Pages with GitHub Actions as the publishing source.
- [x] Configure `netyr.org` in GitHub Pages settings without
      changing unrelated Google Workspace DNS records.

## Optional enhancements

- [ ] Add captions or transcripts for future public videos.
- [x] Complete Google Analytics service-terms approval in the
      organization-managed account.
- [x] Create the GA4 production property and web stream.
- [x] Configure `NEXT_PUBLIC_GA_MEASUREMENT_ID` for GitHub Actions.
- [ ] Confirm a production Realtime page view and reviewed conversion events
      after the analytics-enabled deployment.
- [ ] Obtain organizational legal review of the analytics/privacy disclosure
      and future consent requirements.
- [x] Run the post-deployment Lighthouse matrix and record final scores in
      `PERFORMANCE_REPORT.md`.
- [ ] Replace derived favicon assets with an approved dedicated icon set.
