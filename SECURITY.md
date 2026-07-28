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
- The Community Partners feed reads only fixed server-side fields from
  `Donations` and `Master Contacts`. It aggregates by Contact ID when available,
  applies the real Public Display and any transaction privacy/status controls,
  and returns only the name and calculated level. Amounts, dates, reasons,
  notes, organizations, IDs, contact details, row numbers, and workbook metadata
  are never returned.

See the integration-package security notes for the respective trust boundaries
and operating controls.
