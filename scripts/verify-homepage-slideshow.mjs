import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import slides from "../data/homepage-slideshow.generated.json" with { type: "json" };

assert.equal(slides.length, 29);
assert.equal(
  slides.some(({ src }) =>
    ["community-leadership.webp", "community-interview.webp"].some((removed) =>
      src.endsWith(removed),
    ),
  ),
  false,
);

const cdpOrigin = process.env.CDP_ORIGIN ?? "http://127.0.0.1:9333";
const siteOrigin = process.env.SITE_ORIGIN ?? "http://localhost:3000";
const screenshotDirectory = process.env.SCREENSHOT_DIRECTORY ?? os.tmpdir();

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
    const { reject, resolve } = pending.get(message.id);
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
    pending.set(id, { reject, resolve });
  });
}

async function delay(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function navigate(wait = 1_500) {
  consoleErrors.length = 0;
  runtimeErrors.length = 0;
  failedRequests.length = 0;
  await send("Page.navigate", { url: `${siteOrigin}/` });
  await delay(wait);
}

async function setViewport({ height, mobile, width }) {
  await send("Emulation.setDeviceMetricsOverride", {
    deviceScaleFactor: 1,
    height,
    mobile,
    screenHeight: height,
    screenWidth: width,
    width,
  });
}

async function currentImageSource() {
  return evaluate(
    `document.querySelector('[aria-roledescription="carousel"] img')?.src ?? ""`,
  );
}

async function capture(filename) {
  const screenshot = await send("Page.captureScreenshot", {
    captureBeyondViewport: false,
    format: "png",
    fromSurface: true,
  });
  await writeFile(
    path.join(screenshotDirectory, filename),
    Buffer.from(screenshot.data, "base64"),
  );
}

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Page.bringToFront");
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
});

await setViewport({ height: 900, mobile: false, width: 1440 });
await navigate();
await send("Input.dispatchMouseEvent", {
  type: "mouseMoved",
  x: 1430,
  y: 890,
});

const desktop = await evaluate(`(() => {
  const carousel = document.querySelector('[aria-roledescription="carousel"]');
  const image = carousel?.querySelector('img');
  return {
    carouselHeight: carousel?.getBoundingClientRect().height ?? 0,
    hasHeading: Boolean(carousel?.querySelector('h1')),
    hasImage: Boolean(image?.complete && image?.naturalWidth),
    hasJoin: Boolean(carousel?.querySelector('a[href="/membership/"]')),
    hasEvents: Boolean(carousel?.querySelector('a[href="/events/"]')),
    hasGetInvolved: Boolean(carousel?.querySelector('a[href="/get-involved/"]')),
    indicatorCount: carousel?.querySelectorAll('[aria-label^="Show slide "]').length ?? 0,
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  };
})()`);

assert.equal(desktop.hasHeading, true);
assert.equal(desktop.hasImage, true);
assert.equal(desktop.hasJoin, true);
assert.equal(desktop.hasEvents, true);
assert.equal(desktop.hasGetInvolved, true);
assert.equal(desktop.indicatorCount, slides.length);
assert.equal(
  await evaluate(
    `Boolean(document.querySelector('button[aria-label="Pause slideshow"], button[aria-label="Resume slideshow"]'))`,
  ),
  false,
);
assert.equal(desktop.carouselHeight, 540);
assert.ok(desktop.pageWidth <= desktop.viewportWidth + 1);

const firstSource = await currentImageSource();
await delay(6_300);
const rotatedSource = await currentImageSource();
assert.notEqual(
  rotatedSource,
  firstSource,
  "Automatic rotation did not advance.",
);

await evaluate(`document.querySelector('[aria-roledescription="carousel"]')
  ?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))`);
const hoveredSource = await currentImageSource();
await delay(6_300);
assert.equal(
  await currentImageSource(),
  hoveredSource,
  "The slideshow did not pause on hover.",
);
await evaluate(`document.querySelector('[aria-roledescription="carousel"]')
  ?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))`);

await evaluate(
  `document.querySelector('button[aria-label="Show next slide"]')?.click()`,
);
assert.notEqual(await currentImageSource(), hoveredSource);
const afterNext = await currentImageSource();
await evaluate(`(() => {
  const button = document.querySelector('button[aria-label="Show next slide"]');
  button?.focus();
  button?.dispatchEvent(new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'ArrowLeft'
  }));
})()`);
assert.notEqual(await currentImageSource(), afterNext);

const assetResults = await evaluate(`Promise.all(
  ${JSON.stringify(slides.map((slide) => slide.src))}.map(async (src) => {
    const response = await fetch(src);
    return {
      ok: response.ok,
      type: response.headers.get('content-type')
    };
  })
)`);
assert.equal(
  assetResults.every(({ ok }) => ok),
  true,
);
assert.equal(
  assetResults.every(({ type }) => type === "image/webp"),
  true,
);
await capture("netyr-homepage-slideshow-desktop.png");

await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});
await navigate();
const reducedMotionSource = await currentImageSource();
await delay(6_300);
assert.equal(await currentImageSource(), reducedMotionSource);
assert.equal(
  await evaluate(
    `Boolean(document.querySelector('button[aria-label="Pause slideshow"]'))`,
  ),
  false,
);

await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
});
await setViewport({ height: 844, mobile: true, width: 390 });
await navigate();
const mobile = await evaluate(`(() => {
  const carousel = document.querySelector('[aria-roledescription="carousel"]');
  return {
    carouselHeight: carousel?.getBoundingClientRect().height ?? 0,
    counter: carousel?.querySelector('[data-carousel-counter]')?.textContent?.trim() ?? "",
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  };
})()`);
assert.equal(mobile.carouselHeight, 420);
assert.equal(mobile.counter, `1 / ${slides.length}`);
assert.ok(mobile.pageWidth <= mobile.viewportWidth + 1);

const beforeSwipe = await currentImageSource();
const box = await evaluate(`(() => {
  const rect = document.querySelector('[aria-roledescription="carousel"]')
    .getBoundingClientRect();
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
})()`);
const swipeY = Math.round(box.y + box.height / 2);
await send("Input.dispatchTouchEvent", {
  touchPoints: [{ x: 310, y: swipeY }],
  type: "touchStart",
});
await send("Input.dispatchTouchEvent", {
  touchPoints: [{ x: 110, y: swipeY }],
  type: "touchMove",
});
await send("Input.dispatchTouchEvent", { touchPoints: [], type: "touchEnd" });
await delay(250);
assert.notEqual(await currentImageSource(), beforeSwipe);
await capture("netyr-homepage-slideshow-mobile.png");

await send("Network.emulateNetworkConditions", {
  connectionType: "cellular3g",
  downloadThroughput: (1.5 * 1024 * 1024) / 8,
  latency: 150,
  offline: false,
  uploadThroughput: (750 * 1024) / 8,
});
await navigate(5_000);
assert.equal(
  await evaluate(
    `Boolean(document.querySelector('[aria-roledescription="carousel"] img')?.naturalWidth)`,
  ),
  true,
);
await send("Network.emulateNetworkConditions", {
  downloadThroughput: -1,
  latency: 0,
  offline: false,
  uploadThroughput: -1,
});

assert.deepEqual(consoleErrors, []);
assert.deepEqual(runtimeErrors, []);
assert.deepEqual(failedRequests, []);

socket.close();
console.log(
  JSON.stringify(
    {
      autoplay: "passed",
      desktop: "passed",
      keyboard: "passed",
      mobile: "passed",
      reducedMotion: "passed",
      slideAssets: slides.length,
      slowNetwork: "passed",
      touchSwipe: "passed",
    },
    null,
    2,
  ),
);
