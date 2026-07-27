# Sponsor Integration Guide

## Production source and public contract

`Website Sponsors` is a separate private sheet tab for approved sponsor names.
The dedicated Apps Script project under
`integrations/google-apps-script/website-sponsors/` accesses only this tab and
returns only active sponsor names to the public website.

The public feed never returns a spreadsheet identifier, formulas, rows from
other tabs, sponsor notes, contacts, contracts, tiers, logos, benefits, payment
data, or workbook metadata.

## Sheet fields

| Field         | Use                             |
| ------------- | ------------------------------- |
| Sponsor Name  | Required public display name    |
| Active        | Publish only when true          |
| Display Order | Optional order for active names |

## Administrator workflow

1. Open only the `Website Sponsors` tab.
2. Add the approved public sponsor name.
3. Mark it active only after approval.
4. Give active names an optional display order.
5. Review `/sponsors/` after the feed cache refreshes.
6. To remove a sponsor, set `Active` to false rather than modifying unrelated
   tabs or exposing a private workbook.

## Endpoint maintenance

1. Open the organization-owned **NETYR Website Sponsors** Apps Script project.
2. Keep `SPREADSHEET_ID` in Script Properties only.
3. Run `setupSponsorSheet()` and `runWebsiteSponsorsTests()` after a source
   update.
4. Deploy the web app as the organization account with public access.
5. Add its public `/exec` URL to `NEXT_PUBLIC_SPONSORS_FEED_URL` locally and in
   GitHub Actions repository variables.
6. Build and review the Sponsors page before a production deployment.

No sponsor is displayed until an active approved name is supplied. The website
uses a professional empty state rather than sample sponsors.
