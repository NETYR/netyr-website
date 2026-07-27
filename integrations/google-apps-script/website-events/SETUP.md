# NETYR Public Events Endpoint Setup

This Apps Script package reads only the dedicated **NETYR Public Events** Google
Calendar and returns sanitized public event fields as JSON. It does not access
the roster workbook, `Website Events`, a Google Sheet, or browser-provided
resource identifiers.

## Private configuration

In Apps Script **Project Settings**, set:

| Property             | Value                                                    |
| -------------------- | -------------------------------------------------------- |
| `PUBLIC_CALENDAR_ID` | Identifier of the dedicated NETYR public-events Calendar |

Keep the value inside Apps Script only. Never commit it, publish it in browser
code, place it in a repository variable, or include it in documentation.

## Deployment

1. Open the organization-owned **NETYR Website Events** Apps Script project.
2. Confirm `Code.gs` and `appsscript.json` match this directory.
3. Keep the Calendar read-only manifest scope; do not add Sheets or Drive
   scopes.
4. Run `runWebsiteEventsTests()`.
5. Deploy the web app to execute as the organization account with public access.
6. Copy only the production `/exec` URL.
7. Store that public URL in `NEXT_PUBLIC_EVENTS_ENDPOINT` locally and as the
   GitHub Actions repository variable.
8. Build the website and review `/events/` before production deployment.

## Calendar entry markers

The endpoint recognizes these optional public markers in an event description:

```text
Registration: https://public-registration.example/
Graphic: https://public-image.example/event.jpg
Featured: true
```

The rest of the description is sanitized as public event copy. Do not add
private meeting links, attendees, internal notes, personal contacts, or
credentials to this Calendar.
