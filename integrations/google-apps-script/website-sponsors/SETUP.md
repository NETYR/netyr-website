# NETYR Website Sponsors setup

This package publishes approved Community Partner names from the existing
NETYR master donor/contact workbook. It uses the fixed `Master Contacts` and
`Donations` tabs and never accepts a sheet name from a browser.

1. Use the organization-owned Apps Script project named **NETYR Website
   Sponsors**.
2. Add `Code.gs` and `appsscript.json` from this directory.
3. Keep the private Script Property `SPREADSHEET_ID` set to the master
   donor/contact workbook. Never put that value in repository files.
4. Confirm the fixed headers and positions documented in
   `SPONSOR_INTEGRATION_GUIDE.md`. The `Donations` transaction header is row 9.
5. Run `verifySponsorSource()` and `runWebsiteSponsorsTests()`.
6. Update the production web-app deployment to execute as the
   organization-managed account and allow public access.
7. Store only its public `/exec` URL in `NEXT_PUBLIC_SPONSORS_FEED_URL`.

Transactions must use the stable Contact ID. `Public Display` controls public
recognition; manual tier, logo, website, and display-order values do not control
the Community Partners page.
