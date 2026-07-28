# Security

## Reporting

Report website security concerns through an organization-managed private
channel. Do not include passwords, payment-card information, roster data, or
another person’s contact submission in a public issue.

## Project safeguards

- Secrets and private identifiers never belong in source control.
- `NEXT_PUBLIC_*` values are browser-visible and may contain only approved
  public URLs or the public analytics measurement ID.
- Membership, dues, and Donate activity use the approved public Cheddar Up
  collection; the website does not process card information.
- The custom contact-form Apps Script writes only to `Website Contacts` and
  never returns private sheet data.
- The Events feed reads only the dedicated public-events Calendar.
- The Community Partners feed uses only fixed, server-side fields from
  `Master Contacts` and `Donations`. It joins by Contact ID, applies public
  recognition controls, and returns only the approved name and calculated
  tier. Contact IDs, transaction details, contribution totals, notes, and
  contact details are never returned.

See the integration-package security notes for the respective trust boundaries
and operating controls.
