# Production Performance Report

Audit date: July 26, 2026

The analytics-enabled GitHub Pages deployment at `https://netyr.org` was audited
with Lighthouse using current Chrome. Scores are listed as Performance /
Accessibility / Best Practices / SEO.

| Route        | Mobile                | Desktop               | Mobile LCP | Mobile CLS |
| ------------ | --------------------- | --------------------- | ---------- | ---------- |
| Home         | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1.66 s     | 0          |
| Events       | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0.81 s     | 0.035      |
| Contact      | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0.80 s     | 0          |
| Get Involved | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0.86 s     | 0          |
| News         | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0.82 s     | 0          |

All tested routes exceed the project goals of 90 Performance and 95 for
Accessibility, Best Practices, and SEO. No tested route produced a JavaScript
console error. No material accessibility, metadata, image sizing, font loading,
heading, link-label, or touch-target regressions were reported.

Repeat this matrix against production after significant layout, analytics,
image, navigation, or integration changes. Field performance may differ from a
controlled Lighthouse run.
