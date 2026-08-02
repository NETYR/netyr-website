import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

let staticServer;
let siteOrigin;

if (process.env.SITE_ORIGIN) {
  siteOrigin = new URL(process.env.SITE_ORIGIN);
} else {
  const outputDirectory = path.join(process.cwd(), "out");
  staticServer = createServer(async (request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url ?? "/", "http://127.0.0.1").pathname,
    );
    const relativePath =
      pathname === "/"
        ? "index.html"
        : pathname.endsWith("/")
          ? path.join(pathname.slice(1), "index.html")
          : pathname.slice(1);
    const requestedPath = path.resolve(outputDirectory, relativePath);

    if (!requestedPath.startsWith(`${outputDirectory}${path.sep}`)) {
      response.writeHead(400).end();
      return;
    }

    try {
      const body = await readFile(requestedPath);
      const extension = path.extname(requestedPath);
      const contentType = {
        ".css": "text/css",
        ".html": "text/html; charset=utf-8",
        ".jpg": "image/jpeg",
        ".js": "text/javascript",
        ".png": "image/png",
        ".txt": "text/plain; charset=utf-8",
        ".webp": "image/webp",
        ".xml": "application/xml",
      }[extension];
      response.writeHead(200, { "Content-Type": contentType ?? "text/plain" });
      response.end(body);
    } catch {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(await readFile(path.join(outputDirectory, "404.html")));
    }
  });
  await new Promise((resolve) => staticServer.listen(0, "127.0.0.1", resolve));
  const address = staticServer.address();
  assert.ok(address && typeof address === "object");
  siteOrigin = new URL(`http://127.0.0.1:${address.port}`);
}
const expectedRoutes = [
  "/",
  "/about/",
  "/leadership/",
  "/events/",
  "/get-involved/",
  "/membership/",
  "/news/",
  "/news/matt-proper-appointed-treasurer/",
  "/sponsors/",
  "/governing-documents/",
  "/donate/",
  "/contact/",
  "/privacy/",
  "/accessibility/",
];

const checked = new Map();
const discovered = new Set(expectedRoutes);
const descriptions = new Map();
const titles = new Map();

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractAttributes(html, attribute) {
  const expression = new RegExp(
    `\\b${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`,
    "gi",
  );
  return [...html.matchAll(expression)].map((match) =>
    decodeHtml(match[1] ?? match[2] ?? ""),
  );
}

function extractMetaContent(html, attribute, value) {
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributeValue = extractAttributes(tag, attribute)[0];
    if (attributeValue?.toLowerCase() !== value.toLowerCase()) continue;
    return extractAttributes(tag, "content")[0] ?? "";
  }
  return "";
}

async function request(url) {
  const key = url.toString();
  if (checked.has(key)) return checked.get(key);

  const response = await fetch(url, { redirect: "follow" });
  const contentType = response.headers.get("content-type") ?? "";
  const result = {
    contentType,
    finalUrl: response.url,
    ok: response.ok,
    status: response.status,
    text: /(text|html|xml|json|javascript)/i.test(contentType)
      ? await response.text()
      : "",
  };
  checked.set(key, result);
  return result;
}

for (const route of expectedRoutes) {
  const result = await request(new URL(route, siteOrigin));
  assert.equal(result.status, 200, `${route} returned ${result.status}.`);
  assert.match(result.contentType, /text\/html/i, `${route} is not HTML.`);
  const title = decodeHtml(
    result.text.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "",
  );
  const description = extractMetaContent(result.text, "name", "description");
  assert.ok(title, `${route} has no title.`);
  assert.ok(description, `${route} has no meta description.`);
  titles.set(route, title);
  descriptions.set(route, description);
  assert.match(
    result.text,
    /<link\s+rel="canonical"\s+href="https:\/\/netyr\.org\/[^"]*"/i,
    `${route} has no production canonical URL.`,
  );
  assert.doesNotMatch(
    result.text,
    /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i,
    `${route} is unexpectedly marked noindex.`,
  );
  for (const [attribute, name] of [
    ["property", "og:title"],
    ["property", "og:description"],
    ["property", "og:url"],
    ["property", "og:image"],
    ["name", "twitter:card"],
    ["name", "twitter:title"],
    ["name", "twitter:description"],
    ["name", "twitter:image"],
  ]) {
    assert.ok(
      extractMetaContent(result.text, attribute, name),
      `${route} is missing ${name}.`,
    );
  }
  for (const attribute of ["href", "src"]) {
    for (const value of extractAttributes(result.text, attribute)) {
      if (
        !value ||
        value.startsWith("#") ||
        /^(mailto:|tel:|data:|javascript:)/i.test(value)
      ) {
        continue;
      }
      const target = new URL(value, new URL(route, siteOrigin));
      if (target.origin !== siteOrigin.origin) continue;
      target.hash = "";
      discovered.add(`${target.pathname}${target.search}`);
    }
  }
}

assert.equal(
  new Set(titles.values()).size,
  titles.size,
  "Public page titles must be unique.",
);
assert.equal(
  new Set(descriptions.values()).size,
  descriptions.size,
  "Public page descriptions must be unique.",
);

const homepage = await request(new URL("/", siteOrigin));
const jsonLdPayloads = [
  ...homepage.text.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  ),
].map((match) => JSON.parse(decodeHtml(match[1])));
const schemaTypes = jsonLdPayloads.flatMap((payload) =>
  Array.isArray(payload?.["@graph"])
    ? payload["@graph"].map((entry) => entry?.["@type"])
    : [payload?.["@type"]],
);
assert.ok(schemaTypes.includes("Organization"));
assert.ok(schemaTypes.includes("WebSite"));
assert.doesNotMatch(
  JSON.stringify(jsonLdPayloads),
  /"(?:email|telephone|contactPoint|address)"\s*:/i,
  "Organization schema contains unsupported public contact fields.",
);
const leadership = await request(new URL("/leadership/", siteOrigin));
assert.match(leadership.text, /Matt Proper/);
assert.match(leadership.text, />Treasurer</);
assert.match(
  leadership.text,
  /Remainder of current term (?:â€”|&#x2014;|—) through January 2028/,
);
assert.doesNotMatch(
  leadership.text,
  /Treasurer[\s\S]{0,120}Vacant|Vacant[\s\S]{0,120}Treasurer/i,
);

for (const path of discovered) {
  const result = await request(new URL(path, siteOrigin));
  assert.equal(result.ok, true, `${path} returned ${result.status}.`);
}

const sitemap = await request(new URL("/sitemap.xml", siteOrigin));
assert.equal(sitemap.status, 200);
for (const route of expectedRoutes) {
  const expectedUrl =
    route === "/" ? "https://netyr.org" : `https://netyr.org${route}`;
  assert.match(
    sitemap.text,
    new RegExp(`<loc>${expectedUrl.replaceAll("/", "\\/")}</loc>`),
    `${route} is missing from the sitemap.`,
  );
}

const robots = await request(new URL("/robots.txt", siteOrigin));
assert.equal(robots.status, 200);
assert.match(robots.text, /^Allow:\s*\/$/im);
assert.match(robots.text, /https:\/\/netyr\.org\/sitemap\.xml/i);
assert.doesNotMatch(robots.text, /^Disallow:\s*\/\s*$/im);

for (const icon of ["/favicon.png", "/apple-touch-icon.png"]) {
  const result = await request(new URL(icon, siteOrigin));
  assert.equal(result.status, 200);
  assert.match(result.contentType, /image\/png/i);
}

const builtJavaScript = [...checked.values()]
  .filter(({ contentType }) => /javascript/i.test(contentType))
  .map(({ text }) => text)
  .join("\n");
assert.match(
  builtJavaScript,
  /G-EBJ8ZHMVVG/,
  "The approved Analytics measurement configuration is missing.",
);
assert.match(
  builtJavaScript,
  /netyr\.org.*www\.netyr\.org|www\.netyr\.org.*netyr\.org/,
  "Analytics must be restricted to production hostnames.",
);

console.log(
  JSON.stringify({
    checkedResources: checked.size,
    discoveredInternalResources: discovered.size,
    routesChecked: expectedRoutes.length,
  }),
);

await new Promise((resolve) => staticServer?.close(resolve) ?? resolve());
