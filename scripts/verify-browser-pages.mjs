import assert from "node:assert/strict";

const cdpOrigin = process.env.CDP_ORIGIN ?? "http://127.0.0.1:9333";
const siteOrigin = process.env.SITE_ORIGIN ?? "http://127.0.0.1:4173";
const eventsEndpoint = process.env.EVENTS_ENDPOINT ?? "";
const sponsorsEndpoint = process.env.SPONSORS_ENDPOINT ?? "";
const expectTemporaryData = process.env.EXPECT_TEST_DATA === "1";

const targets = await fetch(`${cdpOrigin}/json/list`).then((response) =>
  response.json(),
);
const target = targets.find((candidate) => candidate.type === "page");
assert.ok(
  target?.webSocketDebuggerUrl,
  "A debuggable Chrome page is required.",
);

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const consoleErrors = [];
const runtimeErrors = [];
const failedRequests = [];

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method === "Runtime.consoleAPICalled") {
    if (message.params.type === "error") {
      consoleErrors.push(
        message.params.args
          .map((argument) => argument.value ?? argument.description ?? "")
          .join(" "),
      );
    }
  } else if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(message.params.exceptionDetails.text);
  } else if (message.method === "Network.loadingFailed") {
    const error = message.params.errorText ?? "";
    if (!/ERR_ABORTED/.test(error)) failedRequests.push(error);
  }
});

function send(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

async function delay(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function navigate(path, wait = 5000) {
  consoleErrors.length = 0;
  runtimeErrors.length = 0;
  failedRequests.length = 0;
  await send("Page.navigate", { url: `${siteOrigin}${path}` });
  await delay(wait);
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result.value;
}

async function assertPageHealth(path, viewport) {
  await navigate(path, path === "/contact/" ? 6000 : 2500);
  const page = await evaluate(`({
    hasMain: Boolean(document.querySelector("main")),
    hasPrimaryHeading: Boolean(document.querySelector("main h1")),
    viewportWidth: document.documentElement.clientWidth,
    pageWidth: document.documentElement.scrollWidth
  })`);
  assert.equal(page.hasMain, true, `${path} is missing its main landmark.`);
  assert.equal(
    page.hasPrimaryHeading,
    true,
    `${path} is missing its primary heading.`,
  );
  assert.ok(
    page.pageWidth <= page.viewportWidth + 1,
    `${path} has horizontal overflow at ${viewport}.`,
  );
  assert.deepEqual(
    consoleErrors,
    [],
    `${path} logged a console error at ${viewport}.`,
  );
  assert.deepEqual(
    runtimeErrors,
    [],
    `${path} raised a runtime error at ${viewport}.`,
  );
  assert.deepEqual(
    failedRequests,
    [],
    `${path} had a failed network request at ${viewport}.`,
  );
}

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `
    (() => {
      const originalFetch = window.fetch.bind(window);
      window.__netyrFeedResults = [];
      window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        const url = String(args[0] instanceof Request ? args[0].url : args[0]);
        if (/script\\.google|googleusercontent/.test(url)) {
          try {
            const payload = await response.clone().json();
            window.__netyrFeedResults.push({
              eventCount: Array.isArray(payload?.events) ? payload.events.length : -1,
              sponsorCount: Array.isArray(payload?.sponsors) ? payload.sponsors.length : -1
            });
          } catch {
            window.__netyrFeedResults.push({ eventCount: -2, sponsorCount: -2 });
          }
        }
        return response;
      };
    })();
  `,
});

await navigate("/", 8000);
const eventFeed = eventsEndpoint
  ? await evaluate(`fetch(${JSON.stringify(eventsEndpoint)})
      .then(async (response) => ({
        ok: response.ok,
        status: response.status,
        payload: await response.json()
      }))
      .then((result) => ({
        ok: result.ok,
        status: result.status,
        count: Array.isArray(result.payload?.events)
          ? result.payload.events.length
          : -1
      }))
      .catch((error) => ({ ok: false, status: 0, count: -1, error: error.name }))`)
  : { ok: false, status: 0, count: -1 };
const announcement = await evaluate(
  `document.querySelector('aside[aria-label="Next NETYR event"]')?.innerText ?? ""`,
);
const homepageGoogleRequests = await evaluate(
  `performance.getEntriesByType("resource").filter((entry) =>
    /script\\.google|googleusercontent/.test(entry.name)
  ).length`,
);
const homepageFeedResults = await evaluate(`window.__netyrFeedResults ?? []`);
assert.equal(eventFeed.ok, true, "Browser could not load the Events feed.");
assert.ok(eventFeed.count >= 0);
if (expectTemporaryData) {
  assert.ok(announcement, "The next-event announcement should be visible.");
}
assert.deepEqual(consoleErrors, []);
assert.deepEqual(runtimeErrors, []);
assert.deepEqual(failedRequests, []);

await navigate("/events/?month=2026-07", 8000);
const eventPage = await evaluate(`document.body.innerText`);
const eventsGoogleRequests = await evaluate(
  `performance.getEntriesByType("resource").filter((entry) =>
    /script\\.google|googleusercontent/.test(entry.name)
  ).length`,
);
const eventsFeedResults = await evaluate(`window.__netyrFeedResults ?? []`);
assert.match(eventPage, /July 2026/i);
if (expectTemporaryData) {
  assert.match(
    eventPage,
    /NETYR WEBSITE VALIDATION UPDATED/i,
    "The edited July test event should appear in July.",
  );
} else {
  assert.ok(
    /NETYR WEBSITE VALIDATION/i.test(eventPage) ||
      /No public events are currently scheduled for this month\./.test(
        eventPage,
      ),
    "Events page must show the selected month's event data or exact empty state.",
  );
}
assert.deepEqual(consoleErrors, []);
assert.deepEqual(runtimeErrors, []);
assert.deepEqual(failedRequests, []);

await navigate("/sponsors/", 3500);
const sponsorFeed = sponsorsEndpoint
  ? await evaluate(`fetch(${JSON.stringify(sponsorsEndpoint)})
      .then(async (response) => ({
        ok: response.ok,
        status: response.status,
        payload: await response.json()
      }))
      .then((result) => ({
        ok: result.ok,
        status: result.status,
        count: Array.isArray(result.payload?.sponsors)
          ? result.payload.sponsors.length
          : -1,
        keys: Array.isArray(result.payload?.sponsors)
          ? [...new Set(result.payload.sponsors.flatMap((sponsor) => Object.keys(sponsor)))].sort()
          : [],
        contractIsMinimal: Array.isArray(result.payload?.sponsors)
          ? result.payload.sponsors.every((sponsor) =>
              Object.keys(sponsor).sort().join(",") === "name,tier"
            )
          : false,
        namesAreUnique: Array.isArray(result.payload?.sponsors)
          ? new Set(result.payload.sponsors.map((sponsor) =>
              String(sponsor.name).toLocaleLowerCase()
            )).size === result.payload.sponsors.length
          : false,
        names: Array.isArray(result.payload?.sponsors)
          ? result.payload.sponsors.map((sponsor) => sponsor.name)
          : [],
        responseContainsCurrency: /\\$\\s*\\d|\\b\\d+\\.\\d{2}\\b/.test(
          JSON.stringify(result.payload?.sponsors ?? [])
        )
      }))
      .catch((error) => ({ ok: false, status: 0, count: -1, error: error.name }))`)
  : { ok: false, status: 0, count: -1 };
const sponsorPage = await evaluate(`document.body.innerText`);
const sponsorMain = await evaluate(`({
  html: document.querySelector("main")?.innerHTML ?? "",
  text: document.querySelector("main")?.innerText ?? ""
})`);
assert.equal(sponsorFeed.ok, true, "Browser could not load the Sponsors feed.");
assert.ok(sponsorFeed.count >= 0);
assert.equal(
  sponsorFeed.contractIsMinimal,
  true,
  "The Community Partners response exposed fields beyond name and tier.",
);
assert.equal(
  sponsorFeed.namesAreUnique,
  true,
  "The Community Partners response contained duplicate public names.",
);
assert.deepEqual(
  [...sponsorFeed.names].sort((left, right) => left.localeCompare(right)),
  ["Dana Oatley", "Jill Dutton"],
);
assert.equal(sponsorFeed.responseContainsCurrency, false);
assert.match(sponsorPage, /Supporting Partners/i);
assert.match(sponsorPage, /Dana Oatley/i);
assert.match(sponsorPage, /Jill Dutton/i);
assert.doesNotMatch(sponsorPage, /Patron Partners/i);
assert.doesNotMatch(sponsorPage, /Sustaining Partners/i);
assert.doesNotMatch(sponsorMain.text, /\$\s*\d/);
assert.doesNotMatch(sponsorMain.html, /\$\s*\d/);
assert.doesNotMatch(sponsorPage, /Approved contributing members/i);
assert.equal(
  await evaluate(
    `document.querySelector('a[href="/contact/#contact-form"]')?.textContent?.trim() ?? ""`,
  ),
  "Ask about sponsorship",
);
if (expectTemporaryData) {
  assert.match(
    sponsorPage,
    /NETYR Integration Test Sponsor 2026-07-27/i,
    "The approved temporary sponsor should be visible.",
  );
}
assert.deepEqual(consoleErrors, []);
assert.deepEqual(runtimeErrors, []);
assert.deepEqual(failedRequests, []);

await navigate("/contact/", 5000);
const contact = await evaluate(`({
  hasIframe: Boolean(document.querySelector('iframe[title="Contact North East Texas Young Republicans"]')),
  hasExternalOpen: /open the contact form in a new window/i.test(document.body.innerText),
  iframeHeight: document.querySelector('iframe')?.getBoundingClientRect().height ?? 0
})`);
assert.equal(contact.hasIframe, true);
assert.equal(contact.hasExternalOpen, false);
assert.ok(contact.iframeHeight >= 720);

await send("Emulation.setDeviceMetricsOverride", {
  deviceScaleFactor: 1,
  height: 844,
  mobile: true,
  screenHeight: 844,
  screenWidth: 390,
  width: 390,
});
await navigate("/", 5000);
const mobile = await evaluate(`({
  socialLinks: document.querySelectorAll('a[aria-label^="Visit NETYR on"]').length,
  viewportWidth: document.documentElement.clientWidth,
  pageWidth: document.documentElement.scrollWidth
})`);
assert.ok(mobile.socialLinks >= 3, "Expected confirmed social profile icons.");
assert.equal(
  mobile.pageWidth,
  mobile.viewportWidth,
  "Horizontal overflow was detected on mobile.",
);

await navigate("/sponsors/", 5000);
const mobileSponsors = await evaluate(`({
  hasCommunityPartnersHeading: /Community Partners/i.test(document.body.innerText),
  viewportWidth: document.documentElement.clientWidth,
  pageWidth: document.documentElement.scrollWidth
})`);
assert.equal(mobileSponsors.hasCommunityPartnersHeading, true);
assert.equal(
  mobileSponsors.pageWidth,
  mobileSponsors.viewportWidth,
  "Horizontal overflow was detected on the mobile Community Partners page.",
);

const publicRoutes = [
  "/",
  "/about/",
  "/leadership/",
  "/events/",
  "/get-involved/",
  "/membership/",
  "/news/",
  "/sponsors/",
  "/donate/",
  "/contact/",
  "/privacy/",
  "/accessibility/",
];

await send("Emulation.setDeviceMetricsOverride", {
  deviceScaleFactor: 1,
  height: 900,
  mobile: false,
  screenHeight: 900,
  screenWidth: 1440,
  width: 1440,
});
for (const path of publicRoutes) {
  await assertPageHealth(path, "desktop");
}

await send("Emulation.setDeviceMetricsOverride", {
  deviceScaleFactor: 1,
  height: 844,
  mobile: true,
  screenHeight: 844,
  screenWidth: 390,
  width: 390,
});
for (const path of publicRoutes) {
  await assertPageHealth(path, "mobile");
}

assert.deepEqual(consoleErrors, [], "Browser console errors were detected.");
assert.deepEqual(
  runtimeErrors,
  [],
  "Uncaught browser exceptions were detected.",
);
assert.deepEqual(
  failedRequests,
  [],
  "Unexpected network failures were detected.",
);

console.log(
  JSON.stringify({
    announcementVisible: Boolean(announcement),
    contactIframeHeight: contact.iframeHeight,
    eventFeedCount: eventFeed.count,
    eventsGoogleRequests,
    eventsFeedResults,
    homepageGoogleRequests,
    homepageFeedResults,
    pagesChecked: publicRoutes.length * 2,
    sponsorFeedCount: sponsorFeed.count,
  }),
);

socket.close();
process.exit(0);
