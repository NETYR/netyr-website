import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const cdpOrigin = process.env.CDP_ORIGIN ?? "http://127.0.0.1:9333";
const siteOrigin = process.env.SITE_ORIGIN ?? "http://127.0.0.1:4173";
const outputDirectory =
  process.env.SCREENSHOT_DIRECTORY ??
  path.join(process.cwd(), "review-screenshots");

const targets = await fetch(`${cdpOrigin}/json/list`).then((response) =>
  response.json(),
);
const target = targets.find((candidate) => candidate.type === "page");

if (!target?.webSocketDebuggerUrl) {
  throw new Error("A debuggable Chrome page is required.");
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id || !pending.has(message.id)) return;

  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);

  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
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

async function capture({
  filename,
  fullPage = true,
  height,
  mobile = false,
  path: pagePath,
  scrollY = 0,
  wait = 5000,
  width,
}) {
  await send("Emulation.setDeviceMetricsOverride", {
    deviceScaleFactor: 1,
    height,
    mobile,
    screenHeight: height,
    screenWidth: width,
    width,
  });
  await send("Page.navigate", { url: `${siteOrigin}${pagePath}` });
  await delay(wait);
  await send("Runtime.evaluate", {
    expression: `window.scrollTo(0, ${scrollY})`,
  });
  await delay(500);
  const metrics = await send("Page.getLayoutMetrics");
  const contentHeight = Math.min(
    Math.ceil(metrics.cssContentSize?.height ?? height),
    12000,
  );

  const screenshot = await send("Page.captureScreenshot", {
    captureBeyondViewport: fullPage,
    ...(fullPage
      ? {
          clip: {
            height: contentHeight,
            scale: 1,
            width,
            x: 0,
            y: 0,
          },
        }
      : {}),
    format: "png",
    fromSurface: true,
  });
  await writeFile(
    path.join(outputDirectory, filename),
    Buffer.from(screenshot.data, "base64"),
  );
}

await mkdir(outputDirectory, { recursive: true });
await send("Page.enable");
await send("Runtime.enable");

const routes = [
  ["home", "/"],
  ["about", "/about/"],
  ["leadership", "/leadership/"],
  ["events", "/events/"],
  ["get-involved", "/get-involved/"],
  ["membership", "/membership/"],
  ["news", "/news/"],
  ["community-partners", "/sponsors/"],
  ["donate", "/donate/"],
  ["contact", "/contact/"],
  ["privacy", "/privacy/"],
  ["accessibility", "/accessibility/"],
];

for (const [name, pagePath] of routes) {
  await capture({
    filename: `${name}-desktop.png`,
    height: 900,
    path: pagePath,
    wait: pagePath === "/contact/" ? 7000 : 4000,
    width: 1440,
  });
  await capture({
    filename: `${name}-mobile.png`,
    height: 844,
    mobile: true,
    path: pagePath,
    wait: pagePath === "/contact/" ? 7000 : 4000,
    width: 390,
  });
}

await capture({
  filename: "contact-form-detail-desktop.png",
  fullPage: false,
  height: 1000,
  path: "/contact/",
  scrollY: 420,
  wait: 8000,
  width: 1440,
});
await capture({
  filename: "contact-form-detail-mobile.png",
  fullPage: false,
  height: 844,
  mobile: true,
  path: "/contact/",
  scrollY: 260,
  wait: 8000,
  width: 390,
});

socket.close();
console.log(
  `Captured ${routes.length * 2 + 2} route screenshots in ${outputDirectory}`,
);
