# Contact Form Security

## Trust boundary

The public site embeds an Apps Script HTML Service form. Only server-side Apps
Script accesses the private workbook. The public site never receives a workbook
identifier, credentials, existing rows, notification recipient, or any other
sheet tab.

## Controls

- Script Properties hold the workbook identifier and notification recipient.
- The destination tab is the fixed server constant `Website Contacts`; browser
  input cannot choose a workbook or sheet.
- Accepted submissions receive server-generated timestamps and UUIDs.
- HTML-like input is rejected; leading spreadsheet-formula characters are
  neutralized before writes.
- A honeypot, server-issued session, minimum completion time, duplicate cache,
  per-address hash rate limit, validation, and length limits reduce abuse.
- The endpoint returns only generic success or error messages, never rows,
  metadata, or stack traces.
- Server logs never contain submitted personal content.
- The notification is sent after a newly accepted write only. Failures to send
  it do not expose content or cause a duplicate sheet write.

## Operational safeguards

- Deploy from an organization-managed Google account.
- Limit project, sheet, and mailbox access to authorized administrators.
- Use the existing production deployment when updating code, then test a single
  non-sensitive submission and remove it afterward.
- Revoke or disable the endpoint immediately if it behaves unexpectedly.

Do not report suspected issues in a public issue with personal data. Use an
organization-managed private reporting channel.
