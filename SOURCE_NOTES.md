# Source Notes

## Source inventory

| Source                                | Purpose and authority                              | Public use                                                            |
| ------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| `Signed constitution.pdf`             | Internal factual source, adopted October 9, 2025   | Retained as an internal source; not linked from the public website    |
| TYRF constitution and bylaws PDFs     | Federation context only                            | Referenced for context; not published as NETYR documents              |
| `NETYR.png`                           | Approved NETYR logo                                | Header, footer, icons, and social-preview artwork                     |
| Supplied reference recordings         | Originality, pacing, interaction, and design input | Not published                                                         |
| NETYR Club Roster                     | Current officer verification only                  | Private verification source; never downloaded, exported, or published |
| `NETYR Public Events` Google Calendar | Source of truth for approved public events         | Reached only through the isolated public Apps Script feed             |
| Master donor/contact workbook         | Community Partner transaction ledger               | Fixed fields aggregate server-side; only names and tiers are returned |
| Approved Cheddar Up collection        | Membership, dues, and Donate destination           | Public external link only                                             |

**NETYR Club Roster — Private verification source; not approved for public
distribution.** It is never a public website source, public Apps Script feed,
or build input. Only current officer name, office, and term details appropriate
for display may be verified from it.

## Internal facts used

- The organization is North East Texas Young Republicans.
- Eligible Active Members are ages 18 through 40 and meet the internal voter
  and residence requirements.
- Paying dues alone does not override eligibility or participation
  requirements.
- Public copy describes the broader Young Republican movement without asserting
  a separately verified current charter certificate.
- Public copy consistently uses “adjacent counties.” Internal source files are
  preserved unaltered.

## Public-document review

Internal organizational PDFs remain retained as source material but are not
linked from public pages, navigation, metadata, structured data, or sitemap.
Federation reference PDFs are not presented as NETYR documents.

## Integration privacy boundaries

- The contact form accesses only `Website Contacts` and sends a private notice
  after a newly accepted submission. It does not return contact rows or roster
  data.
- The Events endpoint reads only the dedicated NETYR public-events Calendar and
  returns only sanitized public event fields.
- The Community Partners endpoint uses the actual `Donations` worksheet. Its
  header is row 9, Donor Name is column B, Donation Amount is column E, and data
  begins on row 10.
- The endpoint reads only Donor Name and Donation Amount. It aggregates positive
  valid amounts by trimmed, case-insensitive donor name and returns only
  `{name, tier}`. Donation date, organization, reason, notes, IDs, row numbers,
  amounts, contact details, and workbook metadata are not returned.
- The current worksheet has no `Anonymous`, `Private`, or `Do Not Publish`
  field. If one is added under one of those exact headers, truthy rows are
  suppressed.
- Real workbook and Calendar identifiers, deployment identifiers, and private
  recipient configuration remain outside the repository.

## Content requiring human approval

- Event titles, locations, descriptions, graphics, and registrations before
  adding them to the public Calendar.
- Community Partner ledger names and any future explicit privacy controls.
- News articles, officer biographies, headshots, and donation-purpose claims.
- Any future legal, privacy, accessibility, or tax statement beyond the current
  factual site behavior.
