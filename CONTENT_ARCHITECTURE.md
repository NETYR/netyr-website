# Content Architecture

## Content ownership

Routine organization content lives in typed files under `data/`. Components
render those records and should not duplicate facts.

| Content                                | File                         |
| -------------------------------------- | ---------------------------- |
| Organization purpose and homepage copy | `data/site.ts`               |
| Navigation                             | `data/navigation.ts`         |
| Leadership roles and approved people   | `data/leadership.ts`         |
| Events                                 | Google Calendar feed adapter |
| News articles                          | `data/news.ts`               |
| Community Partners                     | Google Apps Script feed      |
| Membership requirements                | `data/membership.ts`         |
| Cheddar Up destinations                | `data/cheddar-up.ts`         |
| Social profiles                        | `data/social-links.ts`       |
| Contact methods                        | `data/contact.ts`            |

Shared interfaces live in `types/content.ts`.

## Route model

Every public route is statically generated. The reusable article renderer lives
in `components/news/article.tsx`. Because Next.js static export rejects an empty
dynamic route, `app/news/[slug]/page.tsx` must be added when the first approved
record is added to `data/news.ts`. Until then, the listing presents an empty
state and no fake detail route is generated.

## Source rules

1. Use reviewed internal NETYR sources for organizational facts without
   exposing source-review language to public visitors.
2. Use explicit current organizational records for time-sensitive details.
3. Use TYRF documents only for Federation context.
4. Keep empty arrays and blank URLs when approved information is unavailable.
5. Add every unresolved public-content need to `CONTENT_CHECKLIST.md`.

## Publishing workflow

1. Obtain approval and a source for the new fact or asset.
2. Update the relevant `data` file.
3. Add source attribution or a decision note to `SOURCE_NOTES.md`.
4. Add images under `public/images` with meaningful filenames.
5. Run `npm run check`.
6. Review at mobile and desktop sizes before release.
