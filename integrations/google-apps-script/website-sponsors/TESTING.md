# Sponsor endpoint testing

Run `verifySponsorSource()` and `runWebsiteSponsorsTests()` in the Apps Script
editor before deployment. All 12 isolated tests must pass. They cover the three
internal thresholds, under-threshold omission, formatted currency, blank and
invalid values, nonpositive rows, optional privacy controls, case-insensitive
name normalization, cumulative aggregation, deduplication, alphabetical
sorting, tier movement after an amount change, and the names-and-tiers-only
response.

Then verify the deployed `/exec` URL returns a JSON object with a `sponsors`
array whose records contain exactly `name` and `tier`. Do not read, print, or
expose donor contact data while testing.
