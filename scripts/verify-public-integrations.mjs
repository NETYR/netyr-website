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
assert.match(sponsorDirectory, /\{level\}s/);
assert.match(
  sponsorDirectory,
  /Community partner recognition will be updated soon\./,
);
assert.match(
  sponsorDirectory,
  /Community partner information is temporarily unavailable\./,
);
assert.doesNotMatch(sponsorDirectory, /sponsor\.(logo|href)/);

const publicSources = ["app", "components", "data", "lib", "types"].flatMap(
  (directory) => readPublicSourceTree(resolve(directory)),
);
const forbiddenPublicLanguage =
  /\b(?:governing documents?|constitution|bylaws?|constitutional classifications?|bylaw classifications?)\b/i;
const publicLanguageFindings = publicSources.filter(({ source }) =>
  forbiddenPublicLanguage.test(source),
);
assert.deepEqual(
  publicLanguageFindings.map(({ path }) => path),
  [],
  "Public source still contains governing-document language.",
);
console.log(
  `Public integration verification passed (${eventTests.passed} event tests, ${sponsorTests.passed} sponsor tests).`,
);
