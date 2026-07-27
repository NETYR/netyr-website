# Contact Form Setup and Maintenance

The custom NETYR contact form is an organization-owned Google Apps Script HTML
Service web app. It embeds on `/contact/`, appends accepted submissions only to
the private `Website Contacts` sheet, and sends one private notification after
each newly accepted submission.

The website never receives the workbook identifier, existing contact rows, or
notification-recipient configuration.

## Private Apps Script properties

Set only in the organization-owned Apps Script project’s **Project Settings**:

| Property                 | Private value                                  |
| ------------------------ | ---------------------------------------------- |
| `SPREADSHEET_ID`         | Identifier of the private destination workbook |
| `NOTIFICATION_RECIPIENT` | Organization-controlled notification mailbox   |

Never commit these values, put them in `.env.local`, GitHub repository
variables, browser code, or public documentation.

## Project files

The Apps Script project must match:

```text
integrations/google-apps-script/contact-form/
  Code.gs
  Index.html
  Stylesheet.html
  JavaScript.html
  appsscript.json
```

The manifest includes the spreadsheet, mail-send, and current-user scopes needed
by the form. Do not add unrelated scopes.

## Safe update procedure

1. Open the organization-owned **NETYR Website Contact Form** Apps Script
   project.
2. Update the project files from this repository.
3. Confirm the two private Script Properties remain present and private.
4. Run `setupContactSystem()`. It checks or safely initializes only the fixed
   `Website Contacts` tab and does not inspect unrelated tabs or overwrite
   existing submissions.
5. Run `runContactSystemTests()` and confirm all 11 isolated tests pass.
6. In **Manage deployments**, create a new version for the existing production
   web app and deploy it. This preserves the public endpoint.
7. Test one clearly marked non-sensitive submission through the live website.
8. Confirm the private sheet received one row with default status `New` and the
   private notification was delivered once.
9. Remove only the test row created for this test.

## Website configuration

The production web-app URL ending in `/exec` is the only App Script value stored
in `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL`. Keep it as an ignored local value for
local testing and as a GitHub Actions repository variable for the production
build. It is a public endpoint, but its edit URL and all private configuration
remain confidential.

## Test expectations

- Required fields, honeypot, minimum completion time, input validation, rate
  limiting, duplicate protection, and formula neutralization work server-side.
- The website records only a fixed submission-success analytics event; it does
  not send names, addresses, contact details, or message text to analytics.
- The web app never returns spreadsheet rows, workbook metadata, or private
  identifiers.
- A duplicate or rejected submission does not send an additional notification.
