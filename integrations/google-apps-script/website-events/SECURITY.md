# NETYR Public Events Endpoint Security

- The endpoint reads only the dedicated Calendar selected by the private fixed
  `PUBLIC_CALENDAR_ID` Script Property.
- The browser cannot choose a Calendar, resource, tab, or time range.
- The Calendar identifier is never returned.
- The manifest has Calendar read-only access only.
- Past events are excluded and upcoming events are sorted chronologically.
- Returned descriptions are sanitized and limited; known private-style content
  such as email addresses and Google Meet links is removed.
- Only public HTTPS registration and graphic URLs are accepted.
- Errors are generic and do not disclose stack traces, Calendar metadata, or
  identifiers.
- No roster or spreadsheet source is referenced by this package.
