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

The deployed sponsor project must point to the institutional **NETYR Master
Donor & Sponsor Contacts** workbook. If qualifying checked donors are missing,
verify this private script property before changing filters or donor records. A
property aimed at another workbook can produce a valid but empty public feed.

The transaction table begins at row 10. `Donor Name` is column B, `Donation
Amount` is column E, and `Contact ID` is column G. The adapter uses the real
`Public Display` field in `Master Contacts` to protect donors who have not
chosen public recognition. Aggregation uses Contact ID when present and a
trimmed, case-insensitive donor-name fallback otherwise.

## Public Display administration

`Master Contacts` has headers on row 1: first name in A, last name in B, Contact
ID in I, and Public Display in M. Column M must use native checkbox validation:

- checked / boolean `TRUE`: the donor name may be returned publicly
- unchecked / boolean `FALSE`: private
- blank: private

The sheet header note should read: “Checked means the donor’s name may appear on
the public Community Partners page.”

The adapter also accepts normalized legacy positive values (`true`, `yes`, `y`,
`1`, `public`, `display`, `publish`, and `approved`) so an older valid record
does not disappear during migration. Administrators should use only the
checkbox interface going forward.

Responses are cached for 60 seconds. The live site checks for fresh data every
five minutes while open and when a visitor returns to a tab whose last request
is more than one minute old. Routine recognition changes do not require a
manual script run, cache clear, site rebuild, or deployment.
