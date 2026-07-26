# Events Integration Guide

## Architecture

`Website Events` is the single event source for the public website:

```text
Website Events tab
        ↓
Read-only Google Apps Script web endpoint
        ↓
NEXT_PUBLIC_EVENTS_ENDPOINT
        ↓
NETYR event cards
```

The browser receives only the public event JSON produced by Apps Script. It
never receives the workbook ID, another sheet name, a Google credential, a
formula, a note, or a roster row.

## Website Events columns

| Column            | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| Event ID          | Optional stable public identifier                    |
| Event Title       | Required public title                                |
| Start Date        | Required event date                                  |
| Start Time        | Optional; blank creates an all-day event             |
| End Date          | Optional; defaults to Start Date                     |
| End Time          | Optional; defaults to one hour after Start Time      |
| Location          | Optional public location                             |
| Short Description | Optional event-card summary                          |
| Full Description  | Used when no short description is provided           |
| Graphic URL       | Optional public HTTPS promotional image              |
| Registration URL  | Optional public HTTPS registration/details link      |
| Featured          | Adds featured styling without changing chronology    |
| Active            | Required checkbox; only checked rows are published   |
| Display Order     | Tie-breaker when two events have the same start time |
| Last Updated      | Administrator-only tracking; never returned          |

Only Event Title, Start Date, and Active are required. If a graphic is absent,
invalid, or fails to load, the site uses the branded NETYR fallback.

## Administrator event workflow

1. Open only the `Website Events` tab.
2. Add one row per public event.
3. Enter Event Title and Start Date.
4. Add Start Time if the event is not all day.
5. Add optional public location, descriptions, graphic, and registration link.
6. Check Featured only when special visual emphasis is appropriate.
7. Check Active only when the row is approved for public display.
8. Review the public Events page after the endpoint's brief cache refresh.
9. To remove an event, uncheck Active. Do not delete the private roster or edit
   another workbook tab.

Never enter attendee lists, private video links, internal notes, personal
contact details, or draft operational information in a row marked Active.

## Deployment

1. Review
   `integrations/google-apps-script/website-events/SETUP.md`,
   `TESTING.md`, and `SECURITY.md`.
2. Create the organization-owned Apps Script project.
3. Store the real workbook ID only in Apps Script Properties as
   `SPREADSHEET_ID`.
4. Deploy as a web app and copy the production URL ending in `/exec`.
5. Complete every endpoint test.
6. Add the tested URL locally as:

   ```text
   NEXT_PUBLIC_EVENTS_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

7. Build and review `/events/` at mobile and desktop widths.
8. Add the same URL as the GitHub Actions repository variable
   `NEXT_PUBLIC_EVENTS_ENDPOINT`.

The organization-managed Apps Script project is deployed, the endpoint is
configured locally and in GitHub, and the production JSON and temporary-event
rendering tests pass. The endpoint uses a read-only advanced Sheets service and
the fixed `Website Events` tab. An empty event list is expected until an
administrator publishes an approved active event.
