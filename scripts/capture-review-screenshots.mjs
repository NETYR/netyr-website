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
  await delay(250);

  const screenshot = await send("Page.captureScreenshot", {
    captureBeyondViewport: false,
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

await capture({
  filename: "homepage-banner.png",
  height: 1000,
  path: "/",
  width: 1440,
});
await capture({
  filename: "events-monthly.png",
  height: 1000,
  path: "/events/?month=2026-07",
  wait: 7000,
  width: 1440,
});
await capture({
  filename: "sponsors.png",
  height: 1000,
  path: "/sponsors/",
  scrollY: 950,
  wait: 5000,
  width: 1440,
});
await capture({
  filename: "contact-form.png",
  height: 1000,
  path: "/contact/",
  wait: 5000,
  width: 1440,
});
await capture({
  filename: "mobile-header-social.png",
  height: 844,
  mobile: true,
  path: "/",
  width: 390,
});

socket.close();
console.log(`Captured 5 review screenshots in ${outputDirectory}`);
