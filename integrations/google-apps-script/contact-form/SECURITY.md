# Contact Form Security

## Trust boundary

The GitHub Pages site embeds a public Google Apps Script HTML Service web app.
The form calls `google.script.run`; only server-side Apps Script opens the
private workbook. The website never receives the spreadsheet ID, authorization
credentials, existing rows, or another tab's data.

## Data controls

- The workbook ID is stored only in the `SPREADSHEET_ID` Script Property.
- The sheet name is the fixed server constant `Website Contacts`.
- Browser input cannot choose a workbook or tab.
- The setup function verifies that it is being run interactively by the
  deployment owner rather than by a public web-app visitor.
- The server returns only structured success or error messages, never rows.
- Server logs do not contain submitted names, contact details, or messages.
- Submitted timestamps and UUIDs are generated on the server.
- HTML-like input is rejected and submitted HTML is never rendered.
- leading `=`, `+`, `-`, and `@` values are prefixed before spreadsheet writes
  to prevent formula execution.
- A honeypot, server-issued form session, minimum completion time, duplicate
  cache, per-address hash rate limit, length limits, and enumeration checks
  reduce basic abuse.
- No IP address, device fingerprint, payment information, date of birth, voter
  information, home street address, or political history is collected.

## Iframe note

Apps Script must use `XFrameOptionsMode.ALLOWALL` for the form to render inside
`netyr.org`. Google Apps Script cannot set a custom `frame-ancestors` response
header. The embedded page therefore contains no account controls, payment
actions, private reads, or destructive operations. The public `/exec` URL must
be treated as public.

## Operational controls

- Deploy from an organization-managed Google account.
- Limit edit access to authorized administrators.
- Review Apps Script deployments and workbook access periodically.
- Establish retention, assignment, and deletion practices before launch.
- Update the web-app deployment after every code change and repeat the
  end-to-end tests.
- Revoke the deployment immediately if unexpected access or submissions occur.

Do not report suspected vulnerabilities in public issues with personal data.
Use the approved organization email and omit sensitive submission content.
