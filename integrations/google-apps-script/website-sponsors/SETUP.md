# NETYR Website Sponsors setup

This package publishes Community Partner names from the existing NETYR master
donor workbook. It uses only the fixed `Donations` and `Master Contacts` tabs
and never accepts a sheet name from a browser.

1. Use the organization-owned Apps Script project named **NETYR Website
   Sponsors**.
2. Add `Code.gs` and `appsscript.json` from this directory.
3. Keep the private Script Property `SPREADSHEET_ID` set to the master
   donor/contact workbook. Never put that value in repository files.
4. Confirm the `Donations` transaction header is row 9 and the `Master
Contacts` header is row 1.
5. Run `verifySponsorSource()` and `runWebsiteSponsorsTests()`.
6. Update the production web-app deployment to execute as the
   organization-managed account and allow public access.
7. Store only its public `/exec` URL in `NEXT_PUBLIC_SPONSORS_FEED_URL`.

The transaction table begins at row 10. `Donor Name` is column B, `Donation
Amount` is column E, and `Contact ID` is column G. The adapter uses the real
`Public Display` field in `Master Contacts` to protect donors who have not
chosen public recognition. Aggregation uses Contact ID when present and a
trimmed, case-insensitive donor-name fallback otherwise.
