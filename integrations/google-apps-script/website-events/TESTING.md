# NETYR Public Events Endpoint Testing

1. Run `runWebsiteEventsTests()` and confirm the isolated tests pass.
2. Create one temporary future event in **NETYR Public Events** with a distinct
   test title and non-sensitive public details.
3. Leave the graphic marker out and confirm the website uses the branded
   fallback.
4. Open the deployed `/exec` URL and confirm it returns `ok: true` and only
   public event fields.
5. Add valid public `Registration`, `Graphic`, and `Featured` markers. Confirm
   the public interface handles them correctly.
6. Confirm a malformed optional marker does not break the feed.
7. Confirm a past Calendar event is absent from the endpoint.
8. Confirm events are chronological and no Google Meet link, attendee,
   organizer, Calendar identifier, metadata, or private description is exposed.
9. Configure the public endpoint locally, build, and review `/events/` on
   mobile and desktop.
10. Delete only the temporary test event afterward.

The feed is not production-ready until the public response and website review
pass without private data exposure.
