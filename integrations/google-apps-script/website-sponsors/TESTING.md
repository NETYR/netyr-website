# Sponsor endpoint testing

Run `runWebsiteSponsorsTests()` in the Apps Script editor before deployment.
Then verify the deployed `/exec` URL returns a JSON object with a `sponsors`
array, contains only active sponsor names, and returns an empty array when no
public sponsor is approved. Remove any temporary test record immediately after
testing. Do not inspect or expose roster data during testing.
