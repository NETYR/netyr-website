import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const integrationDirectory = resolve(
  "integrations/google-apps-script/contact-form",
);
const code = readFileSync(resolve(integrationDirectory, "Code.gs"), "utf8");
const context = vm.createContext({
  console: {
    error() {},
    log() {},
  },
});

new vm.Script(code, { filename: "Code.gs" }).runInContext(context);

assert.equal(
  vm.runInContext('CONTACT_SHEET_NAME === "Website Contacts"', context),
  true,
  "Contact code must use only Website Contacts.",
);

const testResult = vm.runInContext("runContactSystemTests()", context);
assert.equal(testResult.ok, true);
assert.equal(testResult.passed, 10);

const requiredFiles = [
  "Index.html",
  "Stylesheet.html",
  "JavaScript.html",
  "appsscript.json",
  "SETUP.md",
  "TESTING.md",
  "SECURITY.md",
];

for (const filename of requiredFiles) {
  assert.ok(
    readFileSync(resolve(integrationDirectory, filename), "utf8").length > 0,
    `${filename} must not be empty.`,
  );
}

const index = readFileSync(resolve(integrationDirectory, "Index.html"), "utf8");
const client = readFileSync(
  resolve(integrationDirectory, "JavaScript.html"),
  "utf8",
);

assert.match(index, /<label for="firstName"/);
assert.match(index, /aria-live="polite"/);
assert.match(index, /name="website"/);
assert.match(client, /google\.script\.run/);
assert.doesNotMatch(code, /getSheets\s*\(/);
assert.doesNotMatch(code, /getDataRange\s*\(/);

console.log(
  `Contact Apps Script verification passed (${testResult.passed} isolated tests).`,
);
