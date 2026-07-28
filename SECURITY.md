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
- The Sponsors feed reads only identity columns A:C and explicit public sponsor
  columns J:N on `Master Contacts`; it never reads donor contact details,
  donation data, notes, or other tabs.

See the integration-package security notes for the respective trust boundaries
and operating controls.
