# Sponsor endpoint security

The spreadsheet ID remains in private Apps Script properties. The endpoint uses
a fixed sheet name, accepts no browser parameters, reads only the three approved
columns, rejects rows containing formulas, and returns names only. Errors are
generic and never reveal spreadsheet identifiers, rows, formulas, or metadata.
