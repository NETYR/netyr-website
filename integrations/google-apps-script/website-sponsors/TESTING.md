# Sponsor endpoint testing

Run `verifySponsorSource()` and `runWebsiteSponsorsTests()` in the Apps Script
editor before deployment. All 12 isolated tests must pass. They cover the $20,
$250, and $500 thresholds; under-threshold omission; refunds and reversals;
anonymous and private records; cumulative and transaction deduplication; tier
movement after an amount change; and the names-and-tiers-only response.

Then verify the deployed `/exec` URL returns a JSON object with a `sponsors`
array whose records contain exactly `name` and `tier`. Do not read, print, or
expose donor contact data while testing.
