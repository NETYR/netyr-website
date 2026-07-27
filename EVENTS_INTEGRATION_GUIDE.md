# Events Integration Guide

## Production source of truth

The dedicated **NETYR Public Events** Google Calendar is the only production
event source. Administrators add approved events there; the website retrieves a
sanitized public feed through the separate Apps Script project in
`integrations/google-apps-script/website-events/`.

The public website never receives a Calendar ID, private Calendar URL,
attendee data, organizer data, internal notes, or credentials.

## Public event fields

The endpoint returns only:

- title
- start and end times
- all-day status
- public location
- sanitized public description
- optional approved registration link
- optional approved graphic URL
- featured status

Past events are excluded. Events are ordered chronologically. The endpoint
uses a short cache, so a calendar update may take a few minutes to appear.

## Calendar authoring workflow

1. Use only **NETYR Public Events**.
2. Add a clear public title and start date. Add end time, location, and public
   description as appropriate.
3. For optional enhancements, add these exact description markers on separate
   lines:

   ```text
   Registration: https://public-registration.example/
   Graphic: https://public-image.example/event.jpg
   Featured: true
   ```

4. Keep the URLs public and HTTPS. Leave a marker out when it is not needed.
5. Do not put Google Meet links, attendee information, contact details, internal
   notes, credentials, or administrative content in the event.
6. Review `/events/` once the feed cache refreshes. The website uses a branded
   fallback when no graphic is supplied.

## Apps Script deployment and maintenance

1. Open the organization-owned **NETYR Website Events** Apps Script project.
2. Keep `PUBLIC_CALENDAR_ID` in Script Properties only; do not put it in source
   files, environment variables, or documentation.
3. Confirm the code and `appsscript.json` match the repository package.
4. Run `runWebsiteEventsTests()` after any source change.
5. Deploy or update the web app to execute as the organization account with
   public access.
6. Test the `/exec` endpoint returns JSON containing no private information.
7. Store the public endpoint only in `NEXT_PUBLIC_EVENTS_ENDPOINT` locally and
   as the corresponding GitHub repository variable.
8. Build and review `/events/` on mobile and desktop before deployment.

## Safe test

Create one temporary future Calendar event with a distinct test title and only
non-sensitive public fields. Confirm it appears with the correct date, time,
fallback graphic, and any approved link. Delete that exact test event afterward.
Do not leave test events visible to the public.

## Failure behavior

If no endpoint is configured, the endpoint fails, or there are no approved
upcoming events, the site displays its professional empty or unavailable state;
it never shows sample events.
