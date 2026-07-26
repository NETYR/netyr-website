# Website Events Endpoint Setup

This Apps Script package is prepared but not deployed. It publishes only active,
public-safe rows from the fixed `Website Events` tab as JSON.

## Administrator setup

1. Sign in with the Google Workspace account that administers NETYR resources.
2. Open [Google Apps Script](https://script.google.com/) and select **New
   project**.
3. Name the project `NETYR Website Events`.
4. Replace the starter code with the contents of `Code.gs`.
5. Open **Project Settings**, enable **Show "appsscript.json" manifest file in
   editor**, and replace the manifest with `appsscript.json`.
6. In **Project Settings → Script properties**, add:
   - Property: `SPREADSHEET_ID`
   - Value: `YOUR_SPREADSHEET_ID`
7. Optional: add `INCLUDE_PAST_EVENTS` with the value `true` only if past events
   should be returned. The default is `false`.
8. In the editor, select `doGet`, click **Run**, and approve the read-only Sheets
   permission. The project uses the advanced Sheets service so the manifest does
   not need write access.
9. Choose **Deploy → New deployment**.
10. Click **Select type → Web app**.
11. Set **Execute as** to the organization account that owns or can read the
    workbook.
12. Choose the audience required for the public website to retrieve the feed.
13. Click **Deploy** and copy the production URL ending in `/exec`.
14. Test the production URL using `TESTING.md`.
15. Add that `/exec` URL to the website build variable
    `NEXT_PUBLIC_EVENTS_ENDPOINT`.
16. Rebuild the site and complete the browser checks in
    `EVENTS_INTEGRATION_GUIDE.md`.

Never put the real spreadsheet ID in this repository or in browser-visible
configuration.

## Sheet columns

The `Website Events` tab must use these exact headers in A:O:

`Event ID`, `Event Title`, `Start Date`, `Start Time`, `End Date`, `End Time`,
`Location`, `Short Description`, `Full Description`, `Graphic URL`,
`Registration URL`, `Featured`, `Active`, `Display Order`, `Last Updated`.

Only `Event Title`, `Start Date`, and `Active` are required. An empty Start Time
creates an all-day event.
