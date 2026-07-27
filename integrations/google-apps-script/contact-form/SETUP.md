# Contact Form Apps Script Setup

This directory is the complete source for the NETYR custom contact-form web
app. It hosts the form, writes accepted submissions only to `Website Contacts`,
and sends one private notification after each newly accepted submission.

See [CONTACT_FORM_SETUP.md](../../../CONTACT_FORM_SETUP.md) for the full
operating procedure.

## Required private Script Properties

| Property                 | Value                                             |
| ------------------------ | ------------------------------------------------- |
| `SPREADSHEET_ID`         | `YOUR_SPREADSHEET_ID` for the private destination |
| `NOTIFICATION_RECIPIENT` | Organization-controlled notification mailbox      |

These values belong only in Apps Script Project Settings. Never put real values
in the repository, a public environment variable, browser code, or logs.

## Required runs

1. Run `setupContactSystem()` and approve the requested organization-account
   permissions. It modifies only the fixed `Website Contacts` tab when safe.
2. Run `runContactSystemTests()` and confirm all 11 isolated tests pass. The
   tests do not create live contact rows or send a real notification.
3. Update the existing production web-app deployment with a new version.
4. Perform one non-sensitive end-to-end test, confirm one notification and a
   `New` status, then remove only the created test row.

The public `/exec` URL is the only form value permitted in
`NEXT_PUBLIC_CONTACT_FORM_EMBED_URL`.
