# Website Events Endpoint Testing

Complete these checks before adding the endpoint to GitHub Pages:

1. Add one future test event to `Website Events`.
2. Enter an Event Title and Start Date, then check Active.
3. Leave Graphic URL blank and confirm the website uses its branded fallback.
4. Open the deployed `/exec` URL in a private browser window.
5. Confirm the response has `ok: true` and contains only the test event's public
   fields.
6. Uncheck Active, reload after 60 seconds, and confirm the event is absent.
7. Re-enable the event and add a valid public HTTPS Graphic URL.
8. Confirm the graphic loads and a broken or non-HTTPS URL falls back safely.
9. Add an incomplete row without a title or start date and confirm it is
   skipped without breaking the response.
10. Add a formula to a test row and confirm that entire row is skipped.
11. Confirm past events are excluded unless `INCLUDE_PAST_EVENTS` is `true`.
12. Confirm events are chronological.
13. Confirm the response does not contain other tab names, workbook metadata,
    formulas, notes, or roster data.
14. Set `NEXT_PUBLIC_EVENTS_ENDPOINT` locally, run `npm run build`, and review
    `/events/` at mobile and desktop widths.
15. Remove all test rows that are not approved for public display.

The endpoint is not live until the deployed URL has passed these checks.
