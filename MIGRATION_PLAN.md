# Migration Plan

## Completed during this audit

1. Created a verified repository bundle and annotated baseline tag.
2. Created private native Google backups of both critical workbooks.
3. Confirmed direct ownership transfer from the personal Google organization to
   the NETYR Workspace tenant is blocked by Google.
4. Created managed-account copies of the donor and roster/contact workbooks.
5. Preserved the donor workbook’s container-bound Apps Script in the copy.
6. Updated the production Community Partners script property to the managed
   donor workbook.
7. Updated the production Contact Form script property to the managed
   roster/contact workbook.
8. Confirmed the Community Partners public response is successful, contains two
   current public names, and exposes only `name` and `tier`.
9. Confirmed the contact form still renders and exposes no workbook identifier.
10. Confirmed the NETYR public-events calendar and all three production web-app
    projects are already owned by the managed NETYR account.
11. Confirmed the managed account has no installable Apps Script triggers.
12. Verified the contact form end to end against the institutional workbook,
    confirmed the default `New` status, and removed only the audit submission.
13. Verified four active named Workspace accounts, active Workspace billing,
    and an active domain-registration subscription.
14. Confirmed only one Workspace Super Admin exists and organization-wide
    two-step-verification enforcement is currently off.

The personal-account workbooks remain private rollback sources and are no longer
the production target. Do not delete them until the retention period and live
contact submission verification are complete.

## Remaining institutional-control work

| Priority | Resource                 | Required authorized action                                                                                                                                                                        | Why automation stopped                                                                                                                       | Risk if unresolved                                                     |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Critical | Google Workspace         | Select one of the existing managed officer accounts as a second Super Admin, enroll all administrators in MFA, then enable enforcement; verify organizational recovery and payment responsibility | Choosing which officer receives unrestricted tenant authority requires NETYR approval                                                        | Loss of the only Super Admin could interrupt all Google administration |
| Critical | Squarespace Domains      | Confirm organizational owner, renewal payment, MFA, recovery, and a second administrator without changing working DNS                                                                             | An active managed domain-registration billing relationship was observed, but no authenticated registrar administration session was available | Domain loss would take down web and email                              |
| Critical | Cheddar Up               | Confirm NETYR-controlled owner, payout/billing contacts, MFA, recovery, and backup administrator                                                                                                  | Administrative session not verified                                                                                                          | Membership/payment access may depend on an individual                  |
| High     | GitHub organization      | Add a second NETYR-controlled organization owner and enable `main` protection                                                                                                                     | No second authorized account exists in the current organization                                                                              | One-account lockout risk                                               |
| High     | Search Console           | Add a second NETYR-controlled verified owner                                                                                                                                                      | Only one user is currently present                                                                                                           | Search administration lockout risk                                     |
| High     | Google Analytics         | Add a second NETYR-controlled administrator                                                                                                                                                       | Only one user is currently present                                                                                                           | Analytics continuity risk                                              |
| High     | Calendar and Apps Script | Add a second managed editor/administrator without creating duplicate triggers                                                                                                                     | Only one managed Workspace user is verified                                                                                                  | Operational lockout risk                                               |
| High     | Social platforms         | Confirm two NETYR-controlled administrators, MFA, recovery, and removal process for former officers                                                                                               | Platform login/roles not verified                                                                                                            | Profile loss or former-user access                                     |
| Medium   | Google Drive             | After production soak testing, evaluate moving workbook copies into a NETYR Shared Drive and test the bound donor script before moving                                                            | Shared Drive move can affect bound-script and ownership behavior                                                                             | My Drive still depends on one managed user, though it is institutional |
| Medium   | Legacy Google workbooks  | After retention and comparison, restrict or archive personal-account originals; do not remove the only rollback copy                                                                              | Production migration must prove stable first                                                                                                 | Continued unnecessary personal access to sensitive historical data     |

## Workbook rollback

If either migrated path fails:

1. Restore the affected Apps Script property to the previous private workbook.
2. Re-run the relevant project test function.
3. Verify the unchanged production `/exec` endpoint.
4. Investigate copy parity and permissions.
5. Repeat migration only after a new backup.

Never expose either workbook ID in GitHub, website source, client code,
documentation, screenshots, or chat.
