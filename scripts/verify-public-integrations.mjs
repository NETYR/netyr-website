import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

function loadAppsScript(path) {
  const code = readFileSync(path, "utf8");
  const context = vm.createContext({});
  new vm.Script(code, { filename: path }).runInContext(context);
  return { code, context };
}

function readPublicSourceTree(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return readPublicSourceTree(path);
    if (!statSync(path).isFile() || !/\.(?:ts|tsx|js|jsx)$/.test(path)) {
      return [];
    }
    return [{ path, source: readFileSync(path, "utf8") }];
  });
}

const eventsPath = resolve(
  "integrations/google-apps-script/website-events/Code.gs",
);
const sponsorsPath = resolve(
  "integrations/google-apps-script/website-sponsors/Code.gs",
);
const eventCalendarPath = resolve("components/events/event-calendar.tsx");
const contactPagePath = resolve("app/contact/page.tsx");
const sponsorDirectoryPath = resolve(
  "components/sponsors/sponsor-directory.tsx",
);
const sponsorPresentationPath = resolve("lib/sponsors/presentation.ts");
const homepagePath = resolve("app/page.tsx");
const newsSelectionPath = resolve("lib/news.ts");
const eventHookPath = resolve("components/events/use-events.ts");
const runtimeFeedPath = resolve("lib/integrations/runtime-feed.ts");
const analyticsPath = resolve("lib/analytics.ts");
const siteAnalyticsPath = resolve("components/analytics/site-analytics.tsx");

const events = loadAppsScript(eventsPath);
const eventTests = vm.runInContext("runWebsiteEventsTests()", events.context);
assert.equal(eventTests.ok, true);
assert.equal(eventTests.passed, 3);
assert.match(events.code, /PUBLIC_CALENDAR_ID/);
assert.doesNotMatch(events.code, /getAllCalendars\s*\(/);

const sponsors = loadAppsScript(sponsorsPath);
const sponsorTests = vm.runInContext(
  "runWebsiteSponsorsTests()",
  sponsors.context,
);
assert.equal(sponsorTests.ok, true);
assert.equal(sponsorTests.passed, 20);
assert.match(sponsors.code, /PARTNER_DONATION_SHEET_NAME = "Donations"/);
assert.match(sponsors.code, /PARTNER_CONTACT_SHEET_NAME = "Master Contacts"/);
assert.match(sponsors.code, /donationHeaderRow: 9/);
assert.match(sponsors.code, /contactHeaderRow: 1/);
assert.match(sponsors.code, /DONOR_NAME_HEADER = "Donor Name"/);
assert.match(sponsors.code, /DONATION_AMOUNT_HEADER = "Donation Amount"/);
assert.match(sponsors.code, /CONTACT_ID_HEADER = "Contact ID"/);
assert.match(sponsors.code, /PUBLIC_DISPLAY_HEADER = "Public Display"/);
assert.match(sponsors.code, /cacheSeconds: 60/);
assert.match(sponsors.code, /ALL_QUALIFYING_DONORS_PRIVATE/);
assert.match(sponsors.code, /amountCents >= 75000/);
assert.match(sponsors.code, /amountCents >= 50000/);
assert.match(sponsors.code, /amountCents >= 20000/);
assert.match(sponsors.code, /amountCents >= 5000/);
assert.doesNotMatch(sponsors.code, /Website Sponsors/);

const eventCalendar = readFileSync(eventCalendarPath, "utf8");
assert.match(
  eventCalendar,
  /No public events are currently scheduled for this month\./,
);

const contactPage = readFileSync(contactPagePath, "utf8");
assert.doesNotMatch(contactPage, /Open the contact form in a new window/i);

const sponsorDirectory = readFileSync(sponsorDirectoryPath, "utf8");
const sponsorPresentation = readFileSync(sponsorPresentationPath, "utf8");
const homepage = readFileSync(homepagePath, "utf8");
const newsSelection = readFileSync(newsSelectionPath, "utf8");
const eventHook = readFileSync(eventHookPath, "utf8");
const runtimeFeed = readFileSync(runtimeFeedPath, "utf8");
assert.match(sponsorDirectory, /President’s Posse Tier Sponsors/);
assert.match(
  sponsorDirectory,
  /Community partner recognition will be updated soon\./,
);
assert.match(
  sponsorDirectory,
  /Community partner information is temporarily unavailable\./,
);
assert.doesNotMatch(sponsorDirectory, /sponsor\.(logo|href)/);
assert.match(sponsorDirectory, /applySponsorPresentation/);
assert.match(sponsorDirectory, /getSponsorPresentation/);
assert.match(sponsorPresentation, /name: "VZTV"/);
assert.match(sponsorPresentation, /level: "President’s Posse Sponsor"/);
assert.match(sponsorPresentation, /src: "\/images\/sponsors\/vztv\.png"/);
assert.match(
  sponsorPresentation,
  /alt: "VZTV — Grand Saline Sun, Live Local NOW!"/,
);
assert.match(sponsorPresentation, /Grand Saline Sun \/ VZTV/);
assert.match(sponsorPresentation, /name: "Sen\. Bob Hall"/);
assert.match(sponsorPresentation, /name: "State Rep\. Keith Bell"/);
assert.match(sponsorPresentation, /aliases: \["Bob Hall", "Sen\. Bob Hall"/);
assert.match(sponsorPresentation, /"Representative Keith Bell"/);
assert.match(sponsorPresentation, /src: "\/images\/sponsors\/bob-hall\.png"/);
assert.match(sponsorPresentation, /src: "\/images\/sponsors\/keith-bell\.jpg"/);
assert.match(sponsorDirectory, /max-w-\[170px\]/);
assert.match(sponsorDirectory, /sm:max-w-\[210px\]/);
assert.match(sponsorDirectory, /presentation\.name/);
assert.match(homepage, /getLatestPublishedNews\(newsArticles\)/);
assert.match(homepage, /latestNewsArticle\.excerpt/);
assert.match(homepage, /\/news\/\$\{latestNewsArticle\.slug\}\//);
assert.match(newsSelection, /publicationStatus !== "draft"/);
assert.match(newsSelection, /publicationStatus !== "archived"/);
assert.match(newsSelection, /publishedTime <= asOf\.getTime\(\)/);
assert.match(newsSelection, /left\.slug\.localeCompare\(right\.slug\)/);
assert.match(sponsorDirectory, /visibilitychange/);
assert.match(sponsorDirectory, /withRuntimeCacheBust/);
assert.match(eventHook, /visibilitychange/);
assert.match(eventHook, /withRuntimeCacheBust/);
assert.match(runtimeFeed, /runtimeFeedRefreshMilliseconds = 5 \* 60 \* 1000/);
assert.match(runtimeFeed, /runtimeFeedFocusStaleMilliseconds = 60 \* 1000/);

const analytics = readFileSync(analyticsPath, "utf8");
const siteAnalytics = readFileSync(siteAnalyticsPath, "utf8");
for (const eventName of [
  "join_click",
  "membership_link_click",
  "donate_click",
  "contact_form_view",
  "contact_form_submission_success",
  "event_view",
  "event_registration_click",
  "social_link_click",
  "sponsor_interest_click",
  "news_article_view",
  "governing_document_view",
  "governing_document_download",
]) {
  assert.match(analytics, new RegExp(`"${eventName}"`));
}
assert.doesNotMatch(siteAnalytics, /window\.location\.search/);
assert.match(siteAnalytics, /productionAnalyticsHosts/);
assert.match(siteAnalytics, /send_page_view: false/);
assert.match(siteAnalytics, /window\.gtag\?\.\("event", "page_view"/);
assert.match(siteAnalytics, /}, 100\)/);
assert.match(siteAnalytics, /setTimeout\(.*location\.assign/s);
assert.match(siteAnalytics, /750/);
assert.match(siteAnalytics, /handleTrackedClick, true/);
assert.match(siteAnalytics, /"netyr\.org"/);
assert.match(siteAnalytics, /"www\.netyr\.org"/);
assert.match(analytics, /send_to: measurementId/);
assert.match(analytics, /transport_type: "beacon"/);
assert.doesNotMatch(
  `${analytics}\n${siteAnalytics}`,
  /\b(?:firstName|lastName|email|phone|message|contactId|spreadsheetId)\b/i,
  "Analytics source includes a prohibited personal-data field.",
);

const publicSources = ["app", "components", "data", "lib", "types"].flatMap(
  (directory) => readPublicSourceTree(resolve(directory)),
);
const governingDocumentsPage = publicSources.find(({ path }) =>
  path.endsWith(resolve("app/governing-documents/page.tsx")),
);
assert.ok(governingDocumentsPage, "The public-records route is missing.");
assert.match(governingDocumentsPage.source, /governing_document_view/);
console.log(
  `Public integration verification passed (${eventTests.passed} event tests, ${sponsorTests.passed} sponsor tests).`,
);
