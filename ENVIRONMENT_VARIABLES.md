# Environment Variables

All variables in this project are public build configuration. They are embedded
in the static export and must never contain a secret.

| Variable                             | Required in production | Purpose                                                                    | Owner/location                     |
| ------------------------------------ | ---------------------- | -------------------------------------------------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | Yes                    | Canonical production origin used by metadata, sitemap, and structured data | Workflow-level constant            |
| `NEXT_PUBLIC_EVENTS_ENDPOINT`        | Yes                    | Public NETYR Events Apps Script `/exec` endpoint                           | GitHub Actions repository variable |
| `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL` | Yes                    | Public NETYR Contact Form Apps Script `/exec` endpoint                     | GitHub Actions repository variable |
| `NEXT_PUBLIC_SPONSORS_FEED_URL`      | Yes                    | Public Community Partners Apps Script `/exec` endpoint                     | GitHub Actions repository variable |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`      | Yes                    | Public GA4 web-stream measurement ID                                       | GitHub Actions repository variable |
| `CDP_ORIGIN`                         | No                     | Local Chrome debugging origin for manual browser scripts                   | Local shell only                   |
| `SITE_ORIGIN`                        | No                     | Local preview origin for screenshot/browser scripts                        | Local shell only                   |
| `SCREENSHOT_DIRECTORY`               | No                     | Output folder for review screenshots                                       | Local shell only                   |
| `EVENTS_ENDPOINT`                    | No                     | Expected events endpoint for browser verification                          | Local shell only                   |
| `SPONSORS_ENDPOINT`                  | No                     | Expected partner endpoint for browser verification                         | Local shell only                   |
| `CONTACT_ENDPOINT`                   | No                     | Contact endpoint used by the authorized live-submission test               | Local shell only                   |
| `EXPECT_CONTACT_EMBED`               | No                     | Selects configured/unconfigured contact browser assertions                 | Local shell only                   |
| `EXPECT_TEST_DATA`                   | No                     | Enables explicit temporary-data assertions                                 | Local shell only                   |
| `CHROME_PATH`                        | No                     | Overrides the local Chrome executable path                                 | Local shell only                   |

## Google Apps Script properties

These are private server-side configuration and are not environment variables:

| Project          | Property names                             | Rule                                           |
| ---------------- | ------------------------------------------ | ---------------------------------------------- |
| Contact Form     | `SPREADSHEET_ID`, `NOTIFICATION_RECIPIENT` | Configure only in Apps Script Project Settings |
| Website Events   | `PUBLIC_CALENDAR_ID`                       | Configure only in Apps Script Project Settings |
| Website Sponsors | `SPREADSHEET_ID`                           | Configure only in Apps Script Project Settings |

Do not place the values in GitHub, source files, documentation, client network
payloads, or screenshots.

## Rotation

Public `/exec` endpoints are not credentials, but changing a deployment can
change an endpoint. Update the corresponding repository variable, run a branch
build, verify the new endpoint, deploy, and retain the old deployment until the
production check passes. Spreadsheet and calendar identifiers stay in Apps
Script properties and must be changed through the same tested rollback process.
