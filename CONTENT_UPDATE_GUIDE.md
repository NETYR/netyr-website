# Content Update Guide

This guide is for NETYR administrators updating approved public content without
editing React components.

## Events

1. Open the dedicated **NETYR Public Events** Google Calendar.
2. Create or update the event with only approved public details: title, dates,
   times, location, and description.
3. For optional website enhancements, place one marker per line in the event
   description:

   ```text
   Registration: https://public-registration.example/
   Graphic: https://public-image.example/event.jpg
   Featured: true
   ```

4. Do not add attendee lists, private meeting links, internal notes, personal
   contact details, or credentials.
5. Publish the event only when its details are ready for public display.
6. Allow the endpoint cache to refresh, then review `/events/` on desktop and
   mobile. Remove or correct the Calendar event to remove it from the site.

See [EVENTS_INTEGRATION_GUIDE.md](EVENTS_INTEGRATION_GUIDE.md) for endpoint
maintenance and testing.

## Sponsors

1. Open the existing master donor/contact workbook and use only the public
   sponsor fields on `Master Contacts`.
2. Choose `Patron`, `Sustaining`, or `Supporting` under Sponsorship Level.
3. Add an optional public HTTPS website URL, logo URL, and display order.
4. Check `Public Display` only after recognition is approved.
5. Review `/sponsors/` after the five-minute feed cache refresh.
6. To withdraw recognition, clear `Public Display`; do not delete unrelated
   donor or contact information.

The public endpoint reads only first name, last name, organization, and the
five public sponsor fields. Phone, email, address, notes, contact IDs, donation
amounts, and other workbook tabs are not read or returned.

## Leadership and organization copy

- Update centralized typed records under `data/` only after approval.
- Use current officer names, offices, and approved terms; do not add private
  contact information.
- Preserve the Governing Documents link and do not alter the approved PDF.

## News

- Add only a leadership-approved announcement or article in the existing static
  news content structure.
- Use an accurate title, date, category, excerpt, and approved image.
- Do not publish drafts, internal recaps, personal data, or unverified claims.

## Cheddar Up links

`data/cheddar-up.ts` is the only place to update public collection URLs. Use
the approved public collection link, never an administrative or edit URL.

## Social links and preview artwork

- Update verified social profile URLs in `data/social-links.ts`.
- Update the branded social-preview asset in `public/images/` if needed, then
  retain the 1200 × 630 composition and review page metadata after deployment.
- Never guess a social profile URL.

## Before publishing

```bash
npm run format
npm run lint
npm run typecheck
npm run test:contact-integration
npm run test:public-integrations
npm run build
npm audit
```

Review the changed page locally, commit a focused change, push `main`, monitor
the Pages workflow, then verify the live route.
