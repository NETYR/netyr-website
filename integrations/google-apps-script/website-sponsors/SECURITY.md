# Sponsor endpoint security

The spreadsheet ID remains in private Apps Script properties. The endpoint uses
only the fixed `Donations` and `Master Contacts` sheets and accepts no browser
parameters. It reads the donor name, amount, and Contact ID from the ledger,
plus only real transaction-status or privacy fields when present. The master
contact read is limited to first name, last name, Contact ID, and Public
Display. Aggregation and classification happen server-side, and the response
contains only `{name, level}`. Amounts, dates, reasons, notes, organizations,
IDs, contact details, row numbers, formulas, and workbook metadata never enter
the response. Public Display remains deny-by-default: only a checked boolean
`TRUE` or a normalized positive legacy value is public. Errors are generic.
Administrator logs contain only status codes and aggregate counts.
