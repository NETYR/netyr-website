# Integrations

## Data-flow summary

| Feature                 | Source                                         | Server-side boundary                   | Public output                                       | Failure state                                             |
| ----------------------- | ---------------------------------------------- | -------------------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| Events and announcement | `NETYR Public Events` calendar                 | NETYR Website Events Apps Script       | Approved event fields only                          | Explicit unavailable state; not treated as an empty month |
| Community Partners      | Institutional donor workbook, fixed donor tabs | NETYR Website Sponsors Apps Script     | `name` and `level` only                             | Explicit connection-error state                           |
| Contact                 | Institutional workbook, `Website Contacts` tab | NETYR Website Contact Form Apps Script | Embedded HTML form and generic success/error result | Email alternative and unavailable message                 |
| Membership and support  | Cheddar Up public collection                   | External Cheddar Up service            | Outbound link only                                  | Link remains a normal external destination                |
| Analytics               | Browser page and approved interaction events   | Google Analytics 4                     | Aggregate analytics events                          | Site remains functional when disabled                     |
| Social links            | `data/social-links.ts`                         | None                                   | Verified public profile URLs                        | Link omitted until verified                               |

## Events

The Apps Script uses only the server-side `PUBLIC_CALENDAR_ID` property. It reads
the NETYR-owned calendar with read-only scope, limits the date window, sanitizes
text, extracts optional registration/graphic directives, hashes an event ID, and
returns no owner, attendee, organizer, calendar, or email metadata. Responses
are cached for five minutes. The calendar itself is not public; the web app is
the public-data boundary.

## Community Partners

The Apps Script opens only the configured workbook and fixed `Donations` and
`Master Contacts` tabs. It verifies the live headers, aggregates valid ledger
transactions by Contact ID when available, uses a normalized-name fallback,
enforces the real Public Display control, assigns the finalized sponsorship
level, de-duplicates, sorts, and returns only the public display name and level.
No amount, date, reason, note, contact field, row number, workbook metadata, or
identifier enters the browser.

`Master Contacts!M:M` is the administrative recognition control. A checked
checkbox (the boolean value `TRUE`) permits public name recognition; unchecked,
`FALSE`, and blank values remain private. The adapter continues to normalize
legacy positive values for migration safety, but the workbook interface uses
checkboxes as the authoritative format. The public response is cached for one
minute, and the page rechecks the endpoint every minute while open.

The adapter logs privacy-safe status codes for administrators:
`NO_QUALIFYING_DONATIONS`, `ALL_QUALIFYING_DONORS_PRIVATE`,
`PUBLIC_SPONSORS_READY`, or `SOURCE_FAILURE`. Counts only are logged; donor
names, IDs, amounts, and contact fields are not.

## Contact

The contact web app opens only the configured workbook and fixed `Website
Contacts` tab. It uses server-side validation, allowlisted inquiry/contact
choices, a honeypot, a minimum completion time, rate limiting, duplicate
protection, locks, server-generated UUIDs/timestamps, formula neutralization,
generic errors, and an institutional notification recipient. The website embeds
the form; it does not read response rows.

## Analytics

`components/analytics/site-analytics.tsx` loads GA4 only when the public
measurement ID is configured. It sends page views and allowlisted interaction
events. No form field value or other personally identifying content is included.

## Public link services

The official Texas Young Republicans link, verified social links, and approved
Cheddar Up collection are direct external links with safe new-tab behavior where
appropriate. Account control for Cheddar Up and social platforms must be
reviewed in their respective administrative interfaces; a verified public URL
does not prove administrative ownership.
