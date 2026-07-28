# Sponsor endpoint testing

Run `verifySponsorSource()` and `runWebsiteSponsorsTests()` in the Apps Script
editor before deployment. All 20 isolated tests must pass. They cover all four
internal thresholds, under-minimum omission, formatted currency, blank and
invalid values, nonpositive rows, real transaction status and privacy controls,
the `Master Contacts` public-display control, Contact ID aggregation,
case-insensitive name fallback, cumulative aggregation, deduplication,
alphabetical sorting, level movement after an amount change, and the minimal
public response. They also verify the authoritative checkbox behavior, accepted
legacy values, and the private-only versus no-qualifying internal diagnostics.

Then verify the deployed `/exec` URL returns a JSON object with a `sponsors`
array whose records contain exactly `name` and `level`. Do not read, print, or
expose donor contact data while testing.

For a live privacy check, test one checked contact, one unchecked contact, and
one blank Public Display cell. Revert only the test changes you made. The
endpoint must return names and levels only, and Script Executions may log only
privacy-safe diagnostic codes and counts.
