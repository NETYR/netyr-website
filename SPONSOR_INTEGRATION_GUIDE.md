# Community Partners integration guide

## Production source and verified schema

The existing **NETYR Master Donor & Sponsor Contacts** workbook is the sole
source of truth. The organization-owned **NETYR Website Sponsors** Apps Script
project uses these fixed mappings:

### `Master Contacts`

| Column | Header         | Use                                                       |
| ------ | -------------- | --------------------------------------------------------- |
| A      | First Name     | Person display-name fallback                              |
| B      | Last Name      | Person display-name fallback                              |
| C      | Organization   | Preferred display name when present                       |
| I      | Contact ID     | Stable donor identifier and join key                      |
| M      | Public Display | Required explicit approval before a name may be published |

Phone, email, address, primary-contact, notes, website, logo, manual tier, and
display-order fields are not read for Community Partners.

### `Donations`

The transaction table header is row 9.

| Column | Header          | Use                                                      |
| ------ | --------------- | -------------------------------------------------------- |
| D      | Donation Reason | Server-only invalid/refund/test control check            |
| E      | Donation Amount | Signed amount converted to integer cents and accumulated |
| F      | Notes           | Server-only invalid/refund/test control check            |
| G      | Contact ID      | Stable join to `Master Contacts!I:I`                     |
| H      | Donation ID     | Transaction deduplication when present                   |

Donation dates, donor names, organizations, and date-entered values are not
read by the public feed. The workbook has no dedicated transaction-status,
refund-status, anonymity, or deleted-record column.

## Aggregation and classification

1. Build the approved contact map by `Contact ID`.
2. Read donation control, amount, contact ID, and donation ID fields only.
3. Ignore blank IDs, zero or invalid amounts, formula-backed rows, test/sample
   records, and rows marked deleted, voided, or cancelled.
4. Exclude positive rows explicitly marked refunded or reversed. Include
   negative refund/reversal rows as signed adjustments so they cancel original
   contributions in the cumulative total.
5. Deduplicate repeated nonblank `Donation ID` values.
6. Sum signed donation cents for each `Contact ID`.
7. Classify the cumulative total:
   - Patron: $500 or more
   - Sustaining: $250 through $499.99
   - Supporting: $20 through $249.99
   - Below $20: not displayed
8. Prefer Organization as the public name, otherwise use First Name plus Last
   Name.
9. Require `Public Display`; suppress anonymous display names; alphabetize names
   within each tier; and remove duplicate display names.

The browser receives only:

```json
{ "name": "Approved public name", "tier": "Patron" }
```

No totals, transaction data, contact details, workbook identifiers, notes, or
internal controls enter the public response.

## Administrator workflow

1. Record donations in the existing `Donations` transaction table with the
   correct `Contact ID`.
2. Confirm the donor has a matching `Master Contacts` record.
3. Set `Public Display` only after public recognition is approved.
4. Wait up to five minutes for the feed cache and website refresh.
5. Clear `Public Display` to withdraw recognition without deleting financial
   history.

Manual sponsorship-level, website, logo, and display-order entries do not
control the Community Partners classification.

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
