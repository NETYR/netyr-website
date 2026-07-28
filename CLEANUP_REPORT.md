# Cleanup Report

Audit branch: `audit/full-site-and-account-cleanup`

## Size and count

| Measure       |  Baseline | Audited working tree |
| ------------- | --------: | -------------------: |
| Tracked files |       123 |                  114 |
| Tracked bytes | 6,736,990 |            2,113,965 |
| Tracked MiB   |     6.425 |                2.016 |

The cleanup removed 4,623,025 bytes (68.6%). The dominant reduction is an
unlinked 4.6 MB public PDF. The official source logo remains intentionally
retained.

## Deleted

- Unlinked public governing-document PDF and its empty directory marker. The
  source remains recoverable from the verified Git bundle and organization
  records; it is no longer directly public.
- Empty `hooks/index.ts`.
- Fifteen superseded planning, setup, review, roadmap, release-note, source-note,
  integration-guide, structure, and performance Markdown files after current
  material was consolidated.

No active integration code, official brand asset, route, deployment workflow,
environment reference, redirect behavior, or production dependency was deleted.

## Consolidated

The former documentation set was consolidated into:

- `README.md`
- `SITE_INVENTORY.md`
- `INTEGRATIONS.md`
- `DEPLOYMENT.md`
- `ENVIRONMENT_VARIABLES.md`
- `ACCOUNT_OWNERSHIP_MATRIX.md`
- `GOOGLE_APPS_SCRIPT_AUDIT.md`
- `MIGRATION_PLAN.md`
- `CLEANUP_REPORT.md`
- `OPERATIONS_AND_RECOVERY.md`

`CONTRIBUTING.md` and `SECURITY.md` remain focused and current.

## Code and route corrections

- Added accurate Privacy and Accessibility routes and footer links.
- Kept the approved-only News listing while removing an unreachable empty
  dynamic detail route that Next.js cannot export without approved articles.
- Centralized and restored the public organizational contact email.
- Preserved an email alternative when the embedded contact form is unavailable.
- Replaced the automatic Donate redirect with an accessible NETYR handoff page
  and explicit external payment action.
- Removed unused exports while retaining internal parsing behavior.
- Registered operational browser, screenshot, and live-contact scripts as npm
  commands so their purpose is explicit.
- Changed `.env.example` to variable names only.

## Ownership corrections

- Created private repository and Google rollback artifacts.
- Confirmed direct cross-organization Google ownership transfer is unsupported.
- Created managed-account copies of the donor and roster/contact workbooks.
- Preserved the donor workbook’s bound Apps Script in the institutional copy.
- Switched the production sponsor and contact Apps Script properties to those
  managed copies without changing public endpoints.
- Confirmed the calendar and all production web-app projects are already managed
  by the NETYR account.
- Removed an obsolete events spreadsheet property.

Legacy personal workbooks remain private rollback resources, not production
dependencies. Account-level continuity work still required is listed in
`MIGRATION_PLAN.md`.

## Retained as uncertain or intentionally future-facing

- The official source-resolution logo is retained for brand maintenance.
- The local news content model is retained for approved future announcements;
  no fabricated article or empty dynamic route is published.
- Legacy private workbooks are retained temporarily for rollback.
- No dependency was removed because every direct dependency has a verified use.

## Validation status

The audited working tree passed:

- Node.js 24 and npm 11 verification.
- Formatting, lint, strict type checking, and static export.
- Eleven isolated contact tests.
- Three event-adapter and twelve Community Partners adapter tests.
- Dependency audit with zero known vulnerabilities.
- Unused-file/export analysis with no unresolved findings.
- Twenty-four route/viewport browser checks covering every public route at
  desktop and mobile sizes.
- Browser landmark, primary-heading, overflow, console, runtime, and network
  assertions.
- Live Events and Community Partners feed checks.
- Live contact rendering, required-field validation, successful submission,
  default `New` status, and exact audit-row removal.
- Minimal Community Partners response contract (`name` and `tier` only), two
  unique alphabetized public names, no public currency, and working inquiry
  link.
- Live robots, sitemap, favicon, DNS, custom 404, and HTTPS checks.

`npm ci` reported one review-only install-script warning for the transitive
`unrs-resolver` postinstall. Installation, lint, type checking, tests, and the
production build succeeded without approving a new script policy. No
vulnerability is reported; re-review the transitive package on dependency
updates rather than granting a blanket approval.

Production deployment and post-deployment verification are recorded after the
audit pull request is merged.

## Community Partners required test results

|   # | Test                                                                  | Result |
| --: | --------------------------------------------------------------------- | ------ |
|   1 | Production uses the managed institutional donor workbook              | Pass   |
|   2 | Fixed worksheet is `Donations`                                        | Pass   |
|   3 | Header row is 9                                                       | Pass   |
|   4 | Donor Name maps to column B                                           | Pass   |
|   5 | Donation Amount maps to column E and parses formatted currency        | Pass   |
|   6 | Multiple donations aggregate case-insensitively by trimmed donor name | Pass   |
|   7 | Public names are unique                                               | Pass   |
|   8 | Cumulative totals select the correct internal category                | Pass   |
|   9 | Names are alphabetized within categories                              | Pass   |
|  10 | Empty categories are hidden                                           | Pass   |
|  11 | No amount appears visually                                            | Pass   |
|  12 | No amount appears in rendered HTML                                    | Pass   |
|  13 | No amount appears in browser state                                    | Pass   |
|  14 | No amount appears in the public response                              | Pass   |
|  15 | Browser receives only `name` and `tier`                               | Pass   |
|  16 | Ask About Sponsorship routes to the contact form section              | Pass   |
|  17 | No invented approval or membership filter controls recognition        | Pass   |
|  18 | Workbook and production script are managed by NETYR                   | Pass   |

The production feed returned the two current public donor names exactly once,
alphabetized, in the correct nonempty category. The names are public recognition
data; amounts, transaction details, workbook metadata, and private contact
fields never entered the browser.
