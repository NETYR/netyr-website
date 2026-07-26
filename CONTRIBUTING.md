# Contributing

## Branch workflow

1. Start from an up-to-date `main`.
2. Create a focused branch using the `codex/` prefix for Codex-authored work.
3. Keep commits small and descriptive.
4. Open a pull request; do not push directly to `main`.
5. Require review before merging public-facing content.

## Before submitting changes

Run:

```bash
npm run check
```

The formatter, ESLint, TypeScript, and production static export must all pass.
Also run `npm audit` and review the generated `out` directory for the expected
robots, sitemap, metadata, and downloadable assets.

## Content standards

- Use only organization-approved facts, language, logos, imagery, links, event
  information, and contact details.
- Use explicit placeholders when approved material is unavailable.
- Do not publish personal information without authorization.
- Write clear headings and concise link text.
- Record every unresolved item in `CONTENT_CHECKLIST.md` and source provenance
  or conflicts in `SOURCE_NOTES.md`.
- Do not put payment, contact, event, leader, or sponsor facts directly in page
  markup; update the appropriate typed file in `data/`.

## Accessibility

- Preserve a logical heading hierarchy.
- Ensure all functionality works with a keyboard.
- Maintain visible focus indicators.
- Meet WCAG AA color contrast.
- Label controls by purpose, not appearance.
- Respect reduced-motion preferences.
- Test responsive layouts at narrow and wide viewport sizes.

## Components and styling

- Reuse existing components before creating new variants.
- Keep page-specific styling out of shared primitives.
- Use mobile-first Tailwind utilities.
- Prefer semantic elements over generic containers.
- Avoid unnecessary Client Components and third-party dependencies.

## Static hosting

The site is configured for GitHub Pages static export. Do not add
server-only Next.js features unless the hosting strategy is intentionally
changed and documented.
