# Google Apps Script Audit

Reviewed July 28, 2026. Script IDs, deployment IDs, endpoint URLs, workbook IDs,
calendar IDs, and private property values are intentionally omitted.

## Production projects

| Project                     | Type and owner                                  | Purpose                                                                                                | OAuth scopes                                                            | Properties                          | Deployment                                                       | Triggers                                                             |
| --------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| NETYR Website Contact Form  | Standalone; managed NETYR account               | Render secure embedded form, validate and append to fixed contact tab, send institutional notification | Sheets, send mail, user email                                           | Workbook and notification recipient | Production web app; execute as managed owner; public form access | None                                                                 |
| NETYR Website Events        | Standalone; managed NETYR account               | Read the NETYR-owned public-events calendar and return sanitized public event JSON                     | Calendar read-only                                                      | Public calendar                     | Production web app; execute as managed owner; public read access | None                                                                 |
| NETYR Website Sponsors      | Standalone; managed NETYR account               | Aggregate donor ledger and return only public names/categories                                         | Sheets                                                                  | Institutional donor workbook        | Production web app; execute as managed owner; public read access | None                                                                 |
| Donor administration script | Container-bound to institutional donor workbook | Administrative workbook menu and donor-entry workflow                                                  | Inherited from bound project; requires separate review before expansion | Bound document context              | No website deployment observed                                   | Copied with workbook; no managed-account installable trigger present |

The managed account’s global Apps Script trigger list showed zero installable
triggers. Current website web apps are request-driven and do not require
scheduled, form-submit, edit, or open triggers.

The Community Partners production deployment was rechecked after migration: it
is an active versioned web app, executes as the managed president account, and
allows public access to the sanitized feed. Older archived deployments were
retained as rollback evidence because their removal is not required for
production and their purpose cannot be proven obsolete without a retention
decision. The unchanged Contact and Events public endpoints passed live checks.

## Source and deployment consistency

Repository source is stored in:

- `integrations/google-apps-script/contact-form/`
- `integrations/google-apps-script/website-events/`
- `integrations/google-apps-script/website-sponsors/`

Each deployment must be updated from the corresponding reviewed source. Future
source changes require a new Apps Script version or deployment update; changing
a script property does not require client code changes when the `/exec` endpoint
is unchanged.

## Security review

### Contact

- Fixed sheet name; browser cannot select a workbook or tab.
- Server-side allowlists and length limits.
- Hidden honeypot, minimum completion time, session token, rate limit, duplicate
  protection, script lock, UUID, timestamps, formula neutralization.
- Generic public errors and no row-reading endpoint.
- No form field content sent to analytics.
- Live rendering, required validation, write, default status, and exact
  audit-row removal passed against the institutional workbook.

### Events

- Read-only calendar scope.
- Fixed server-side calendar property.
- Sanitized text and allowlisted public fields.
- No attendee, organizer, owner, email, or calendar metadata returned.
- Five-minute cache and explicit unavailable response.

### Community Partners

- Fixed `Donations` tab and verified header positions.
- Server-side cumulative aggregation and privacy filtering.
- Public response contains only `name` and `tier`.
- No donor contact, transaction, amount, workbook, row, or identifier data.
- Five-minute cache and explicit unavailable response.

## Cloud and OAuth

All three projects use Apps Script default Google Cloud projects. No repository
evidence or project configuration showed a custom OAuth client, API key,
service-account credential, key file, external database, webhook secret, or
custom billing project. The manifests request only the scopes listed above.

## Change procedure

1. Back up repository source and record the current deployment version.
2. Compare the Apps Script editor files with the repository.
3. Update and save all changed files.
4. Run the project’s isolated test function.
5. Create a new version or update the managed production deployment.
6. Test the `/exec` endpoint and browser integration.
7. Update a GitHub repository variable only if the endpoint changes.
8. Retain the old deployment until production passes.
9. Remove obsolete properties and deployments only after rollback is no longer
   needed.
