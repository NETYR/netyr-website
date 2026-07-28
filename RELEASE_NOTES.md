# Release Notes

## Cumulative Community Partners correction

- Replaced manual sponsor-tier publishing with cumulative contribution
  aggregation from the existing `Donations` transaction table.
- Removed the unrelated `Master Contacts` and `Public Display` dependency.
- Mapped the actual row-9 ledger headers and aggregated Donor Name column B with
  Donation Amount column E.
- Applied the internal Patron, Sustaining, and Supporting recognition rules.
- Reduced the public feed and page to alphabetized recognition names and tiers
  only; no individual totals, links, logos, or private donor data are exposed.
- Added isolated coverage for formatted currency, positive valid rows,
  aggregation, normalization, deduplication, optional privacy controls, tier
  changes, sorting, and the minimal public response contract.

## Production integration refinement

- Removed public document-route, menu, sitemap, metadata, and visitor-facing
  language that framed ordinary website content through internal documents.
- Routed all Donate calls to action to the approved external Cheddar Up
  collection and updated public copy to use “adjacent counties.”
- Removed the former public Privacy and Accessibility routes, links, and public
  contact-email display while preserving accessibility implementation.
- Updated the custom contact form to send a single private notification after
  each newly accepted submission; 11 isolated Apps Script tests pass.
- Replaced the old sheet-based events model with the dedicated `NETYR Public
Events` Calendar and responsive branded event-calendar interface.
- Added the isolated Sponsor feed using only the fixed Donor Name and Donation
  Amount ledger columns; private donor fields are not read or returned.
- Added a compact next-event announcement above the header, a native
  month-specific Events view, and a top utility row for confirmed social
  profiles.
- Removed the contact form’s external-window link and added responsive
  cross-frame height reporting while preserving the existing Apps Script
  submission flow.
- Completed add/edit/remove Calendar validation, public/private Sponsor
  validation, a live contact submission and cleanup, desktop and mobile browser
  checks, static export, and dependency audit.
- Updated deployment, content, source, security, review, and operations
  documentation for the current production architecture.
