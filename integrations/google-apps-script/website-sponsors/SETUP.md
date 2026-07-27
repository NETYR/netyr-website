# NETYR Website Sponsors setup

This Apps Script project publishes only approved sponsor names from the private
`Website Sponsors` tab. It never reads the roster tab and never returns workbook
metadata, formulas, inactive records, or any other sponsor field.

1. Create an organization-owned Apps Script project named **NETYR Website Sponsors**.
2. Add `Code.gs` and `appsscript.json` from this directory.
3. Set the private Script Property `SPREADSHEET_ID` to `YOUR_SPREADSHEET_ID`.
4. Run `setupSponsorSheet()` once. It creates the fixed `Website Sponsors` tab
   with `Sponsor Name`, `Active`, and `Display Order` only when it is missing.
5. Run `runWebsiteSponsorsTests()` and confirm it passes.
6. Deploy a production web app that executes as the organization-managed account
   and permits public access. Use its `/exec` URL only for
   `NEXT_PUBLIC_SPONSORS_FEED_URL`.

Add a sponsor only after the name is approved for public recognition. Mark it
active only when it may appear on the public website. Keep private agreements,
amounts, contacts, logos, links, and notes out of this tab.
