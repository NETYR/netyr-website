# Website Events Security

- The script reads only the fixed tab name `Website Events`.
- The browser cannot choose a workbook or sheet name.
- The spreadsheet ID stays in Apps Script properties and is never returned.
- The manifest requests read-only spreadsheet access through the advanced
  Sheets service. It does not request permission to modify the workbook.
- Rows containing formulas are skipped.
- Only active rows with a title and start date are returned.
- Text is stripped of HTML and control characters and length-limited.
- Only HTTPS graphic and registration links are returned.
- Errors return a generic message without a stack trace.
- The response never includes workbook metadata, notes, formulas, Last Updated,
  or another sheet's content.
- The private roster workbook and its other tabs must never be made public.
- Deployment access should be limited to the minimum audience that still lets
  the public website retrieve the feed.
