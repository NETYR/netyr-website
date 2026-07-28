# Cleanup Report

Audit branch: `audit/full-site-and-account-cleanup`

## Size and count

| Measure       |  Baseline | Audited working tree |
| ------------- | --------: | -------------------: |
| Tracked files |       123 |                  114 |
| Tracked bytes | 6,736,990 |            2,118,176 |
| Tracked MiB   |     6.425 |                2.020 |

The cleanup removed 4,618,814 bytes (68.6%). The dominant reduction is an
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
- Three event-adapter and eighteen Community Partners adapter tests.
- Dependency audit with zero known vulnerabilities.
- Unused-file/export analysis with no unresolved findings.
- Twenty-four route/viewport browser checks covering every public route at
  desktop and mobile sizes.
- Browser landmark, primary-heading, overflow, console, runtime, and network
  assertions.
- Live Events and Community Partners feed checks.
- Live contact rendering, required-field validation, successful submission,
  default `New` status, and exact audit-row removal.
- Minimal Community Partners response contract (`name` and `level` only),
  unique alphabetized public names, no public currency, and working inquiry
  link.
- Live robots, sitemap, favicon, DNS, custom 404, and HTTPS checks.

`npm ci` reported one review-only install-script warning for the transitive
`unrs-resolver` postinstall. Installation, lint, type checking, tests, and the
production build succeeded without approving a new script policy. No
vulnerability is reported; re-review the transitive package on dependency
updates rather than granting a blanket approval.

The audited commits were merged through pull request review, GitHub Pages
completed successfully, and post-deployment route, integration, privacy, DNS,
HTTPS, browser, and screenshot checks passed.

## Community Partners sponsorship-level update

The adapter now uses Contact ID from the fixed `Donations` ledger when present,
with a normalized-name fallback. It consults the real `Public Display` field in
`Master Contacts`, honors real transaction privacy/status fields when present,
totals valid transactions server-side, and returns only `name` and `level`.

|   # | Test                                                   | Result |
| --: | ------------------------------------------------------ | ------ |
|   1 | A cumulative total below the public minimum is omitted | Pass   |
|   2 | Piney Woods minimum classification                     | Pass   |
|   3 | Lone Star minimum classification                       | Pass   |
|   4 | Texas Pioneer minimum classification                   | Pass   |
|   5 | President’s Posse minimum classification               | Pass   |
|   6 | Multiple donations aggregate                           | Pass   |
|   7 | Crossing a threshold changes the level                 | Pass   |
|   8 | Stable Contact ID combines renamed records             | Pass   |
|   9 | Name fallback is trimmed and case-insensitive          | Pass   |
|  10 | Public names are unique                                | Pass   |
|  11 | Names are alphabetized within levels                   | Pass   |
|  12 | Invalid and nonpositive records are omitted            | Pass   |
|  13 | Formatted currency parses correctly                    | Pass   |
|  14 | Real status and privacy controls are honored           | Pass   |
|  15 | Public Display is enforced                             | Pass   |
|  16 | All four levels sort from highest to lowest            | Pass   |
|  17 | Browser receives only `name` and `level`               | Pass   |
|  18 | No amount or private donor field enters the browser    | Pass   |
