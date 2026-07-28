# Sponsor Integration Guide

## Production source and public contract

The existing NETYR master donor/contact workbook is the sponsor source of
truth. The organization-owned **NETYR Website Sponsors** Apps Script project
reads only two fixed ranges from `Master Contacts`:

- first name, last name, and organization;
- Sponsorship Level, Website URL, Logo URL, Public Display, and Display Order.

It does not read phone, email, address, internal notes, contact identifiers,
donation history, amounts, or any other workbook tab. The public response
contains only the approved display name, tier, optional public HTTPS website
and logo URLs, and display order.

## Public sponsor fields

| Field             | Use                                                    |
| ----------------- | ------------------------------------------------------ |
| Sponsorship Level | Patron, Sustaining, or Supporting                      |
| Website URL       | Optional approved public HTTPS destination             |
| Logo URL          | Optional approved public HTTPS image                   |
| Public Display    | Required explicit opt-in for public recognition        |
| Display Order     | Optional number controlling order within the same tier |

The page presents Patron ($500) most prominently, Sustaining ($250) with medium
prominence, and Supporting ($20) with standard recognition.

## Administrator workflow

1. Open `Master Contacts` in the existing master donor/contact workbook.
2. Use only the five public sponsor fields for website presentation.
3. Choose one approved tier and add optional public HTTPS links.
4. Check `Public Display` only after the person or organization approves public
   recognition.
5. Wait up to five minutes, then review `/sponsors/`.
6. Clear `Public Display` to remove a recognition entry without changing donor
   history or private contact information.

## Endpoint maintenance

1. Open the organization-owned **NETYR Website Sponsors** Apps Script project.
2. Keep `SPREADSHEET_ID` in Script Properties only.
3. Run `verifySponsorSource()` and `runWebsiteSponsorsTests()` after a source
   change.
4. Run `clearSponsorCache()` to make an approved update visible immediately
   during verification.
5. Update the production web-app deployment so it executes as the organization
   account and allows public access.
6. Keep the public `/exec` URL only in `NEXT_PUBLIC_SPONSORS_FEED_URL` locally
   and in the GitHub Actions repository variable.

No sponsor is displayed until `Public Display` is explicitly enabled. Empty or
unavailable feeds produce professional states rather than sample sponsors.
