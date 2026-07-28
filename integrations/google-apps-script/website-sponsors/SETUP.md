# NETYR Website Sponsors setup

This package publishes Community Partner names from the existing NETYR master
donor workbook. It uses only the fixed `Donations` tab and never accepts a
sheet name from a browser.

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

The fixed transaction table begins at row 10 beneath the row-9 headers. Donor
Name is column B and Donation Amount is column E. The endpoint never reads
`Master Contacts` or requires a membership or approval flag.
