# Sponsor Integration Guide

## Current status

The sponsor page and centralized provider adapter are ready, but no private
sheet or live sponsor endpoint is connected. With no feed configured, the page
shows a professional empty state and a contact path.

## Recommended curated fields

- Sponsor Name
- Sponsorship Tier
- Logo URL
- Website URL
- Short Description
- Active
- Display Order
- Start Date
- End Date

Only active, public, permission-cleared sponsor records should reach the
website. Do not expose spreadsheet IDs, private sheet URLs, prices, benefits,
contracts, internal notes, or credentials in browser code.

## Future provider contract

The website adapter accepts either an array of sponsor records or:

```json
{
  "sponsors": [
    {
      "sponsorName": "Public sponsor name",
      "sponsorshipTier": "Public tier",
      "logoUrl": "https://example.org/logo.png",
      "websiteUrl": "https://example.org/",
      "shortDescription": "Public description",
      "active": true,
      "displayOrder": 1,
      "startDate": "2026-01-01",
      "endDate": "2026-12-31"
    }
  ]
}
```

The example describes the schema only; it is not displayed as sponsor content.

## Activation steps

1. Approve the sponsor sheet, fields, content owners, and publication policy.
2. Build a read-only Apps Script feed that returns only the fields above.
3. Keep the sheet ID in Apps Script Properties.
4. Test active/inactive filtering, order, broken-logo fallback, external-link
   behavior, and date handling.
5. Add the production public endpoint as the GitHub Actions repository variable
   `NEXT_PUBLIC_SPONSORS_FEED_URL`.
6. Rebuild and complete leadership review before publishing.

No sponsor integration should be made live until sponsor names, logos, tiers,
benefits, and links are authorized for public display.
