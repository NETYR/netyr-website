# Contact Form Apps Script Setup

This directory contains the complete Google Apps Script project for NETYR's
custom contact form. The script hosts the form with HTML Service and appends
approved submissions only to `Website Contacts`.

Use [CONTACT_FORM_SETUP.md](../../../CONTACT_FORM_SETUP.md) for the complete
administrator walkthrough.

## Required private configuration

Add this Apps Script property in Project Settings:

| Property         | Value                                              |
| ---------------- | -------------------------------------------------- |
| `SPREADSHEET_ID` | `YOUR_SPREADSHEET_ID` from the private destination |

Never put the real value in this repository, a website environment variable,
or browser code.

## Required first run

Run `setupContactSystem()` in the Apps Script editor and approve the requested
Google Sheets authorization. The function creates the fixed `Website Contacts`
tab only when missing, adds the approved headers only when safe, freezes and
formats the header, and adds Status validation. It does not delete submissions.

Then run `runContactSystemTests()`. These tests are isolated and do not create
contact rows.

## Web-app deployment

Deploy as a web app that executes as the organization-managed deploying user.
Choose the public access option required for unauthenticated website visitors.
Copy the production URL ending in `/exec`; never use the development `/dev` URL
or the Apps Script editor URL.

The public `/exec` URL is the only Apps Script value allowed in:

```text
NEXT_PUBLIC_CONTACT_FORM_EMBED_URL=
```

Google authorization and web-app deployment must be completed manually by an
authorized NETYR administrator.
