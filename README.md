# NETYR Website

Official website foundation for the North East Texas Young Republicans.

The project uses Next.js, React, TypeScript, Tailwind CSS, the App Router,
ESLint, and Prettier. It is configured as a static export for deployment to
Cloudflare Pages.

## Prerequisites

- Node.js 24 LTS
- npm 11 or newer
- Git

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Run the complete validation sequence with:

```bash
npm run check
```

## Environment variables

Copy `.env.example` to `.env.local` and set the production website URL:

```text
NEXT_PUBLIC_SITE_URL=https://example.com
```

Replace the example value with the approved NETYR production domain before
deployment. The value supplies canonical, sitemap, robots, and social metadata
URLs.

## Cloudflare Pages

Use these Pages build settings:

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npm run build`
- Build output directory: `out`
- Node version: `24.18.0` (pinned in `.node-version`)

The application uses `output: "export"` in `next.config.ts`. Avoid features
that require a runtime server, including Server Actions, request-time cookies,
and dynamic routes without `generateStaticParams`.

## Documentation

- [Project structure](./PROJECT_STRUCTURE.md)
- [Contributing](./CONTRIBUTING.md)

Organization copy, photography, branding, links, and program details remain
placeholders until approved source material is supplied.
