import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

function loadAppsScript(path) {
  const code = readFileSync(path, "utf8");
  const context = vm.createContext({});
  new vm.Script(code, { filename: path }).runInContext(context);
  return { code, context };
}

const eventsPath = resolve(
  "integrations/google-apps-script/website-events/Code.gs",
);
const sponsorsPath = resolve(
  "integrations/google-apps-script/website-sponsors/Code.gs",
);
const eventCalendarPath = resolve("components/events/event-calendar.tsx");
const contactPagePath = resolve("app/contact/page.tsx");

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
assert.equal(sponsorTests.passed, 5);
assert.match(sponsors.code, /SPONSOR_SHEET_NAME = "Master Contacts"/);
assert.match(sponsors.code, /getRange\(1, 1, rowCount, 3\)/);
assert.match(sponsors.code, /getRange\(1, 10, rowCount, 5\)/);
assert.doesNotMatch(sponsors.code, /Website Sponsors/);

const eventCalendar = readFileSync(eventCalendarPath, "utf8");
assert.match(
  eventCalendar,
  /No public events are currently scheduled for this month\./,
);

const contactPage = readFileSync(contactPagePath, "utf8");
assert.doesNotMatch(contactPage, /Open the contact form in a new window/i);

console.log(
  `Public integration verification passed (${eventTests.passed} event tests, ${sponsorTests.passed} sponsor tests).`,
);
