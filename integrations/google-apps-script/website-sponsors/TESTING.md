# Sponsor endpoint testing

Run `runWebsiteSponsorsTests()` in the Apps Script editor before deployment.
Then verify the deployed `/exec` URL returns a JSON object with a `sponsors`
array, groups only explicitly approved Patron, Sustaining, or Supporting
records, and returns an empty array when no public sponsor is approved. Test
Public Display on and off with one clearly labeled non-sensitive temporary
record; delete only that record afterward. Do not inspect or expose donor
contact data during testing.
