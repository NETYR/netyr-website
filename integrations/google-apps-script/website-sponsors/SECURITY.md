# Sponsor endpoint security

The spreadsheet ID remains in private Apps Script properties. The endpoint uses
only the fixed `Master Contacts` and `Donations` sheets and accepts no browser
parameters. It reads only contact identity, Contact ID, Public Display, signed
amount, transaction ID, and server-only transaction-control fields. It rejects
formula-backed records and returns only `{name, tier}`. Contact IDs,
contribution totals, transaction details, notes, phone, email, address,
formulas, and workbook metadata never enter the response. Errors are generic.
