# Release Notes

## Cumulative Community Partners correction

- Replaced manual sponsor-tier publishing with cumulative contribution
  aggregation from the existing `Donations` transaction table.
- Joined donations to approved `Master Contacts` records by stable Contact ID.
- Applied the constitutional Patron, Sustaining, and Supporting thresholds.
- Reduced the public feed and page to alphabetized recognition names and tiers
  only; no individual totals, links, logos, or private donor data are exposed.
- Added isolated coverage for aggregation, refund/reversal handling,
  deduplication, anonymity, public approval, tier changes, and the minimal
  public response contract.

## Production integration refinement

- Published the approved NETYR constitution and bylaws PDF through a dedicated
  Governing Documents page and About submenu.
- Routed all Donate calls to action to the approved external Cheddar Up
  collection and updated public copy to use “adjacent counties.”
- Removed the former public Privacy and Accessibility routes, links, and public
  contact-email display while preserving accessibility implementation.
- Updated the custom contact form to send a single private notification after
  each newly accepted submission; 11 isolated Apps Script tests pass.
- Replaced the old sheet-based events model with the dedicated `NETYR Public
Events` Calendar and responsive branded event-calendar interface.
- Added the isolated Sponsor feed using explicit public-recognition fields in
  the existing master donor/contact source; private donor fields are not read.
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
