# Security

## Reporting

Report website security concerns privately to `president@netyr.org`. Do not
include passwords, payment-card information, private roster data, or another
person's contact submission in a public issue.

## Project safeguards

- Secrets and private workbook identifiers do not belong in source control.
- `NEXT_PUBLIC_*` values are browser-visible and may contain only approved
  public URLs.
- Payment and membership registration remain on the approved public Cheddar Up
  collection; this website does not process card information.
- Contact submissions are handled by the separately deployed Apps Script
  project in `integrations/google-apps-script/contact-form/`.
- Event data is read through its dedicated public-data adapter; private
  workbook tabs must never be returned.

See
[`integrations/google-apps-script/contact-form/SECURITY.md`](integrations/google-apps-script/contact-form/SECURITY.md)
for the contact form's trust boundary, validation, and abuse controls.
