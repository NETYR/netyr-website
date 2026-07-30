# Operations and Recovery

## Routine publishing

### Events

1. Add or update an event in `NETYR Public Events` using the managed account.
2. Use only public title, time, location, and description content.
3. Optional description directives supported by the server adapter are
   documented in the Events Apps Script `SETUP.md`.
4. Allow up to five minutes for the feed cache to expire. No script run or
   website deployment is required.
5. Verify the homepage banner, selected-month listing, time zone, links, graphic
   fallback, and event structured data.
6. Remove temporary inactive test content.

### Community Partners

1. Select an existing donor in the `Donations` entry area and record the
   transaction through the workbook’s `NETYR Contact Tools` workflow.
2. Confirm the success line reports the ledger row and whether public
   recognition is enabled. The workflow writes and verifies the selected
   contact’s existing Contact ID before reporting success.
3. In `Master Contacts`, use the `Public Display` checkbox in column M. Checked
   (`TRUE`) means the donor’s name may appear publicly; unchecked, `FALSE`, and
   blank remain private. The header note repeats this guidance.
4. Keep donor contact and operational notes private.
5. The server adapter totals valid transactions by Contact ID when available,
   applies Public Display and any real transaction privacy/status controls, and
   returns names and sponsorship levels only.
6. Allow up to one minute for the feed cache to expire. The open page refreshes
   every five minutes and rechecks on tab focus when its data is older than one
   minute. No script run or website deployment is required.
7. Verify no amount or private field appears in the response, HTML, or page.

The organization-managed Shared Drive workbook has a container-bound project
named **NETYR Donor and Contact Administration**. Its
`Refresh Public Recognition Controls` menu command repairs checkbox validation
and guidance without changing donor choices.

If checked, qualifying donors are still missing, verify that the sponsor web
app's private `SPREADSHEET_ID` property targets the organization-managed Shared
Drive workbook. Do not expose the value in repository files, screenshots,
support logs, or browser code. Script Property changes do not require a new web
app deployment.

### Contact

1. Keep `Website Contacts` separate from every roster/member tab.
2. Test the embedded form quarterly using non-sensitive data.
3. Confirm required validation, success state, `New` status, institutional
   notification, and exactly one new row.
4. Remove only the test row created for that check.
5. Never inspect, export, or log genuine submissions during website testing.

### News

1. Add only approved content to `data/news.ts`.
2. Supply a unique slug, ISO date, approved category, excerpt, body, and optional
   approved image.
3. Add and test a static-export-compatible article detail route with the first
   approved record. Do not ship an empty dynamic route.
4. Add the approved article URL to the sitemap and verify metadata, structured
   data, and analytics.
5. Build and review the listing and article before deployment.

### Leadership, links, and public copy

- Leadership: `data/leadership.ts`
- Navigation: `data/navigation.ts`
- Social profiles: `data/social-links.ts`
- Public organization copy: `data/site.ts`
- Membership copy: `data/membership.ts`
- Cheddar Up links: `data/cheddar-up.ts`

Do not add a person, claim, event, sponsor, profile, payment URL, or contact
detail without approval.

## Quarterly review

- Run the complete validation suite and `npm audit`.
- Review dependency support without broad major upgrades.
- Verify all repository variables and Apps Script properties.
- Test all public routes at mobile and desktop widths.
- Test contact, events, Community Partners, analytics, Cheddar Up, and social
  links.
- Review GitHub Actions, Pages, certificate, DNS, Search Console, and GA4.
- Review administrators, former-user access, MFA, recovery, billing, and renewal
  responsibility across all services.
- Review Apps Script deployments, scopes, triggers, failures, and notifications.
- Confirm private workbooks remain restricted and public feeds remain minimal.

## Officer transition

1. Create the incoming officer’s individual managed account.
2. Add role-based access before removing the outgoing officer.
3. Verify MFA and recovery under organizational control.
4. Add and test GitHub, Workspace, Drive, Calendar, Apps Script, Search Console,
   Analytics, domain, Cheddar Up, social, and email access.
5. Transfer billing/renewal responsibility.
6. Run production and recovery checks.
7. Revoke the former user only after a second administrator confirms continuity.
8. Never share a password or reuse a personal recovery method.

## Incident recovery

### Website

Revert the faulty commit, push the revert to `main`, monitor Pages, and verify
production. The audited Git bundle can reconstruct the repository if GitHub is
unavailable.

### Google integration

Keep the prior deployment and resource property during migration. Restore the
previous property or endpoint, test the adapter, then investigate without
deleting the last working resource.

### Domain

Use the registrar’s institutional recovery path. Preserve GitHub Pages, Google
Workspace MX, SPF, DKIM, DMARC, verification, and other TXT records. Do not
rebuild DNS from memory.

### Account loss

Use a second managed administrator and organization-controlled recovery. If no
second administrator exists, follow the provider’s verified organizational
recovery process; do not move control to another personal account as a permanent
solution.

## Preview cache refresh

After metadata or social-image changes, deploy first, verify page source, then
use the relevant platform’s sharing debugger or card validator to request a
refresh. Platform caches may not update immediately.
