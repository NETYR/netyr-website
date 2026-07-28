import assert from "node:assert/strict";

const siteOrigin = new URL(process.env.SITE_ORIGIN ?? "http://127.0.0.1:4173");
const expectedRoutes = [
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

const checked = new Map();
const discovered = new Set(expectedRoutes);

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
    text: /(text|html|xml|json)/i.test(contentType)
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
  assert.match(result.text, /<title>[^<]+<\/title>/i, `${route} has no title.`);
  assert.match(
    result.text,
    /<meta\s+name="description"\s+content="[^"]+"/i,
    `${route} has no meta description.`,
  );
  assert.match(
    result.text,
    /<link\s+rel="canonical"\s+href="https:\/\/netyr\.org\/[^"]*"/i,
    `${route} has no production canonical URL.`,
  );
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

console.log(
  JSON.stringify({
    checkedResources: checked.size,
    discoveredInternalResources: discovered.size,
    routesChecked: expectedRoutes.length,
  }),
);
