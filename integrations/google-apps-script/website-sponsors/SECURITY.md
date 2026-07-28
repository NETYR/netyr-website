# Sponsor endpoint security

The spreadsheet ID remains in private Apps Script properties. The endpoint uses
the fixed `Master Contacts` sheet, accepts no browser parameters, reads only
identity columns A:C and public sponsor columns J:N, rejects formula-backed
records, and returns only public presentation fields. It never reads phone,
email, address, notes, contact identifiers, donation data, or other tabs.
Errors are generic and never reveal identifiers, rows, formulas, or metadata.
