# Community Partners integration guide

## Production source and verified schema

The existing **NETYR Master Donor & Sponsor Contacts** workbook is the sole
source of truth. The organization-owned **NETYR Website Sponsors** Apps Script
project uses these fixed mappings:

### `Donations`

The transaction table header is row 9.

| Column | Header          | Use                                                    |
| ------ | --------------- | ------------------------------------------------------ |
| A      | Donation Date   | Not read                                               |
| B      | Donor Name      | Public recognition name after normalization            |
| C      | Organization    | Not read                                               |
| D      | Donation Reason | Not read                                               |
| E      | Donation Amount | Converted to integer cents and accumulated server-side |
| F      | Notes           | Not read                                               |

The deployed endpoint reads only columns B and E. The current worksheet has no
`Anonymous`, `Private`, or `Do Not Publish` column. If one of those exact
headers is added later, the endpoint will read only that additional column and
suppress truthy rows. It does not read `Master Contacts`, contact details,
organization names, dates, reasons, notes, IDs, formulas, or workbook metadata.

## Aggregation and classification

1. Read Donor Name and Donation Amount from row 10 onward.
2. Trim and collapse whitespace in names, and compare names case-insensitively.
3. Parse numeric and formatted currency values into integer cents.
4. Ignore blank names, blank or nonnumeric amounts, and zero or negative
   amounts.
5. Sum all positive valid rows for each normalized donor name.
6. Classify the cumulative total:
   - Patron: $500 or more
   - Sustaining: $250 through $499.99
   - Supporting: $20 through $249.99
   - Below $20: not displayed
7. Return each qualifying donor once and alphabetize names within each tier.

The browser receives only:

```json
{ "name": "Public donor name", "tier": "Patron" }
```

No totals, transaction data, contact details, workbook identifiers, notes, or
internal controls enter the public response.

## Administrator workflow

1. Record each contribution in the existing `Donations` transaction table.
2. Use a consistent donor name in column B.
3. Enter the positive contribution amount in column E.
4. Wait up to five minutes for the feed cache and website refresh.
5. If a privacy control is needed, add one exact `Anonymous`, `Private`, or
   `Do Not Publish` header and mark only the rows that must be suppressed.

Organization, donation reason, notes, IDs, logos, websites, and manual
classification fields do not control the Community Partners page.

## Endpoint maintenance

1. Keep the workbook ID in the Apps Script `SPREADSHEET_ID` property only.
2. Run `verifySponsorSource()` after a workbook schema change.
3. Run `runWebsiteSponsorsTests()`; all isolated cumulative and privacy tests
   must pass.
4. Run `clearSponsorCache()` when immediate verification is necessary.
5. Update the existing production web-app deployment.
6. Keep the public `/exec` endpoint only in
   `NEXT_PUBLIC_SPONSORS_FEED_URL`.

Empty or unavailable feeds produce restrained public states rather than fake
Community Partners.
