# Contact Form Testing

## Isolated server tests

1. Open the Apps Script project.
2. Select `runContactSystemTests`.
3. Click **Run**.
4. Confirm the returned result reports ten passing tests.

The suite verifies:

- valid submission acceptance;
- required-field, inquiry-type, preference, and message-length rejection;
- spreadsheet-formula neutralization without changing hyphenated names;
- honeypot and duplicate rejection;
- access to the fixed `Website Contacts` tab only; and
- absence of roster fields from the destination schema.

The suite uses in-memory fixtures and does not append test rows.

## Administrator setup test

1. Run `setupContactSystem()`.
2. Confirm the result says the contact system is ready.
3. In the private workbook, confirm the `Website Contacts` tab has the approved
   headers and a frozen first row.
4. Do not move the form to the roster tab.

If an existing populated tab has the same headers in another order, the setup
function leaves the data in place and reports a warning. New submissions map by
header name. Resolve any structural warning with a private backup and an
administrator-reviewed migration.

## End-to-end test

After deploying the `/exec` URL:

1. Open it directly in a private browser window.
2. Submit the empty form and confirm visible field errors.
3. Submit one clearly marked administrator test inquiry.
4. Confirm the button shows a loading state and then the success message.
5. Confirm exactly one row appears in `Website Contacts`.
6. Confirm `Status` is `New` and both timestamps are server-generated.
7. Submit the same content again and confirm duplicate protection.
8. Test a recoverable error by temporarily disconnecting the browser, then
   confirm the entered content remains and **Try Again** is available.
9. Remove the administrator test row after confirming the workflow.
10. Confirm no roster tab or private workbook content appears in the response,
    page source, browser console, or network response.

Finally, test the embedded Contact page at mobile and desktop widths.
