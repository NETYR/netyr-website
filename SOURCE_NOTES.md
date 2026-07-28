# Source Notes

## Source inventory

| Source                                | Purpose and authority                                    | Public use                                                                     |
| ------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Signed constitution.pdf`             | Primary NETYR governing source, adopted October 9, 2025  | Approved governing-document PDF and factual guardrail for About and Membership |
| TYRF constitution and bylaws PDFs     | Federation context only                                  | Referenced for context; not published as NETYR documents                       |
| `NETYR.png`                           | Approved NETYR logo                                      | Header, footer, icons, and social-preview artwork                              |
| Supplied reference recordings         | Originality, pacing, interaction, and design guidance    | Not published                                                                  |
| NETYR Club Roster                     | Current officer verification only                        | Private verification source; never downloaded, exported, or published          |
| `NETYR Public Events` Google Calendar | Source of truth for approved public events               | Reached only through the isolated public Apps Script feed                      |
| Master donor/contact workbook         | Approved sponsor identity, tier, and public presentation | Feed reads only fixed identity and explicit public sponsor columns             |
| Approved Cheddar Up collection        | Membership, dues, and Donate destination                 | Public external link only                                                      |

**NETYR Club Roster — Private verification source; not approved for public
distribution.** It is never a public website source, public Apps Script feed,
or build input. Only current officer name, office, and term details appropriate
for display may be verified from it.

## Governing-document facts used

- The organization is North East Texas Young Republicans.
- Eligible Active Members are ages 18 through 40 and meet the governing
  document’s voter and residence requirements.
- Active Members hold the governing document’s voting rights; paying dues alone
  does not override eligibility or participation rules.
- The supplied document describes NETYR’s relationship to the Texas Young
  Republican Federation. The public site describes the broader Young Republican
  movement without asserting a separately verified current charter certificate.
- Public copy consistently uses “adjacent counties.” The governing document
  itself is preserved unaltered.

## Public-document review

The approved signed constitution and bylaws PDF was selected for publication as
the organization’s governing document. It is linked only through
`/governing-documents/`. Federation reference PDFs are not presented as NETYR
documents.

## Integration privacy boundaries

- The contact form accesses only `Website Contacts` and sends a private notice
  after a newly accepted submission. It does not return contact rows or roster
  data.
- The Events endpoint reads only the dedicated NETYR public-events Calendar and
  returns only sanitized, public event fields.
- The Sponsors endpoint reads only fixed identity columns and the explicit
  public sponsor fields on `Master Contacts`. It does not read donor contact
  data, donation amounts, internal notes, or other tabs.
- Real workbook and Calendar identifiers, deployment identifiers, and private
  recipient configuration remain outside the repository.

## Content requiring human approval

- Event titles, locations, descriptions, graphics, and registrations before
  adding them to the public Calendar.
- Sponsor names before setting a sponsor record active.
- News articles, officer biographies, headshots, and donation-purpose claims.
- Any future legal, privacy, accessibility, or tax statement beyond the current
  factual site behavior.
