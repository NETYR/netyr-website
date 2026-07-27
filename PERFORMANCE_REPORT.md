# Production Performance Report

Audit date: July 26, 2026

The analytics-enabled static export was served locally in production mode and
audited with Lighthouse using current Chrome. Scores are listed as Performance /
Accessibility / Best Practices / SEO.

| Route        | Mobile                | Desktop               | Mobile LCP | Mobile CLS |
| ------------ | --------------------- | --------------------- | ---------- | ---------- |
| Home         | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1.75 s     | 0          |
| Events       | 97 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 2.42 s     | 0.035      |
| Contact      | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1.74 s     | 0          |
| Get Involved | 99 / 100 / 100 / 100  | 100 / 100 / 100 / 100 | 2.19 s     | 0          |
| News         | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1.66 s     | 0          |

All tested routes exceed the project goals of 90 Performance and 95 for
Accessibility, Best Practices, and SEO. The Events page is the slowest mobile
route because it initializes the live event feed, but its 2.42-second LCP and
small CLS remain within acceptable thresholds. No material accessibility,
metadata, image sizing, font loading, heading, link-label, or touch-target
regressions were reported.

Repeat this matrix against production after significant layout, analytics,
image, navigation, or integration changes. Field performance may differ from a
controlled Lighthouse run.
