# NETYR Website Sponsors setup

This package publishes approved sponsor-recognition fields from the existing
NETYR master donor/contact workbook. It uses the fixed `Master Contacts` tab and
never accepts a sheet name from a browser.

1. Use the organization-owned Apps Script project named **NETYR Website
   Sponsors**.
2. Add `Code.gs` and `appsscript.json` from this directory.
3. Keep the private Script Property `SPREADSHEET_ID` set to the master
   donor/contact workbook. Never put that value in repository files.
4. Confirm the `Master Contacts` headers include First Name, Last Name,
   Organization, Sponsorship Level, Website URL, Logo URL, Public Display, and
   Display Order in the positions documented by the source.
5. Run `verifySponsorSource()` and `runWebsiteSponsorsTests()`.
6. Update the production web-app deployment to execute as the
   organization-managed account and allow public access.
7. Store only its public `/exec` URL in `NEXT_PUBLIC_SPONSORS_FEED_URL`.

The five website-specific columns should use a tier dropdown, a checkbox for
Public Display, and optional public HTTPS links. Do not copy private donor
information into them.
