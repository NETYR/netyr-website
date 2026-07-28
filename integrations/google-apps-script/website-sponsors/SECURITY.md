# Sponsor endpoint security

The spreadsheet ID remains in private Apps Script properties. The endpoint uses
only the fixed `Donations` sheet and accepts no browser parameters. It reads
only Donor Name and Donation Amount, plus an optional exact `Anonymous`,
`Private`, or `Do Not Publish` column if one exists. Aggregation and
classification happen server-side, and the response contains only
`{name, tier}`. Amounts, dates, reasons, notes, organizations, IDs, contact
details, row numbers, formulas, and workbook metadata never enter the response.
Errors are generic.
