# Content Update Guide

Routine website content is centralized in typed files under `data/` or in the
curated Google sources described below. Do not copy private workbook content
into source files.

## Common updates

| Content                            | Update location                                   | Notes                                                           |
| ---------------------------------- | ------------------------------------------------- | --------------------------------------------------------------- |
| Site identity and homepage summary | `data/site.ts`                                    | Keep claims accurate and concise.                               |
| Navigation                         | `data/navigation.ts`                              | Preserve eight primary items and the Get Involved submenu.      |
| Leadership                         | `data/leadership.ts`                              | Use public officer fields only; never copy private member data. |
| Public events                      | `Website Events` sheet tab                        | Only Active rows with required fields are eligible.             |
| Local event fallback               | `data/events.ts`                                  | Use only if the live endpoint is intentionally disabled.        |
| News                               | `data/news.ts`                                    | Add approved articles and metadata only.                        |
| Membership rules                   | `data/membership.ts`                              | Review governing documents before substantive changes.          |
| Cheddar Up links                   | `data/cheddar-up.ts`                              | Public collection URLs only; never add admin links.             |
| Social links                       | `data/social-links.ts`                            | Official public profiles only.                                  |
| Sponsors                           | Future curated sponsor feed or `data/sponsors.ts` | Obtain permission for names, logos, tiers, and links.           |
| Public contact configuration       | `data/contact.ts`                                 | Public email and tested Apps Script `/exec` URL only.           |
| Contact submissions                | Private `Website Contacts` tab                    | Apps Script appends only; never expose workbook data.           |
| Governing documents                | `data/governing-documents.ts`                     | Publish only reviewed files in `public/documents/`.             |

## Event workflow

1. Add or update the approved public event in `Website Events`.
2. Enter Event Title, Start Date, and check Active.
3. Add optional time, location, descriptions, public HTTPS Graphic URL,
   Registration URL, Featured status, and Display Order.
4. Uncheck Active to remove an event from the public feed.
5. Test the Events page after the endpoint cache refreshes.

See `EVENTS_INTEGRATION_GUIDE.md` for field, deployment, and security details.

## Contact workflow

The Contact page always displays `president@netyr.org`. The custom Apps Script
form appears only when `NEXT_PUBLIC_CONTACT_FORM_EMBED_URL` is a valid public
Apps Script production URL ending in `/exec`. The same tested public URL powers
the secondary new-window link.

Administrators manage the server code in
`integrations/google-apps-script/contact-form/`. The private workbook ID belongs
only in the Apps Script `SPREADSHEET_ID` property. The script appends only to
`Website Contacts` and never returns Sheet rows to the website. See
`CONTACT_FORM_SETUP.md`.

The organization-managed Apps Script project was deployed and its production
`/exec` URL passed a local embedded end-to-end test on July 26, 2026. The URL is
stored only in ignored local environment configuration. Before an approved
GitHub Pages launch, add the same public URL as the repository variable
`NEXT_PUBLIC_CONTACT_FORM_EMBED_URL`.

After changing any Apps Script source, rerun the isolated tests and update the
existing production deployment to a new version. Saving editor changes alone
does not update the deployed web app.

## Sponsors

Until a curated sponsor feed is approved, update `data/sponsors.ts`. A future
feed should return only active, public sponsor fields and must never expose the
source spreadsheet or credentials. See `SPONSOR_INTEGRATION_GUIDE.md`.

## Images

Place approved web images under `public/images/` in a descriptive subfolder.
Retain original sources separately, create a suitably sized WebP or JPEG for the
website, and write meaningful alternative text whenever the image conveys
information.

## News article routes

When the first article is ready:

1. Add its content to `data/news.ts`.
2. Create `app/news/[slug]/page.tsx`.
3. Export every public slug from `generateStaticParams()`.
4. Use `components/news/article.tsx`.
5. Add Article structured data and verify the exported route.

## Before publication

Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm run build`, and
`npm audit`. Review affected pages at mobile and desktop widths. Remove an item
from `CONTENT_CHECKLIST.md` only after its content, privacy, and operational
checks are complete.
