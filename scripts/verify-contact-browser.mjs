import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize, resolve } from "node:path";

const chromePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const integrationDirectory = resolve(
  "integrations/google-apps-script/contact-form",
);
const outDirectory = resolve("out");
const expectedEmbed = process.env.EXPECT_CONTACT_EMBED === "true";
const testEndpoint = [
  "https://script.google.com/macros/s",
  "BROWSER_TEST_ONLY",
  "exec",
].join("/");

const indexTemplate = readFileSync(
  join(integrationDirectory, "Index.html"),
  "utf8",
);
const styles = readFileSync(
  join(integrationDirectory, "Stylesheet.html"),
  "utf8",
);
const client = readFileSync(
  join(integrationDirectory, "JavaScript.html"),
  "utf8",
);

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");

  if (url.pathname === "/form/") {
    const mode = url.searchParams.get("mode") ?? "empty";
    const html = buildFormHarness(mode);
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html);
    return;
  }

  serveStaticExport(url.pathname, response);
});

await new Promise((resolveListening) => {
  server.listen(0, "127.0.0.1", resolveListening);
});

const address = server.address();
assert.ok(address && typeof address === "object");
const origin = `http://127.0.0.1:${address.port}`;

try {
  const siteDom = await dumpDom(`${origin}/contact/`, 1500, "390,1400");
  assert.match(siteDom, /data-horizontal-overflow="false"/);

  if (expectedEmbed) {
    assert.match(siteDom, /Contact North East Texas Young Republicans/);
    assert.match(siteDom, new RegExp(escapeRegExp(testEndpoint)));
    assert.doesNotMatch(siteDom, /Open the contact form in a new window/);
    assert.match(siteDom, /<iframe/);
  } else {
    assert.doesNotMatch(siteDom, /<iframe/);
    assert.doesNotMatch(siteDom, /Open the contact form in a new window/);
    assert.match(siteDom, /contact form is temporarily unavailable/i);
  }

  const emptyDom = await dumpDom(
    `${origin}/form/?mode=empty`,
    1200,
    "390,1400",
  );
  assert.match(emptyDom, /id="firstName"[^>]*aria-invalid="true"/);
  assert.match(emptyDom, /data-active-element="firstName"/);
  assert.match(emptyDom, /data-horizontal-overflow="false"/);

  const loadingDom = await dumpDom(
    `${origin}/form/?mode=loading`,
    1200,
    "390,1400",
  );
  assert.match(loadingDom, /id="submit-button"[^>]*disabled/);
  assert.match(loadingDom, />Sending</);
  assert.match(loadingDom, /data-horizontal-overflow="false"/);

  const successDom = await dumpDom(
    `${origin}/form/?mode=success`,
    1800,
    "900,1300",
  );
  assert.match(openingTag(successDom, "contact-form"), /\shidden/);
  assert.doesNotMatch(openingTag(successDom, "success-panel"), /\shidden/);
  assert.match(successDom, /data-active-element="success-panel"/);
  assert.match(successDom, /Thank you for contacting NETYR/);
  assert.match(successDom, /data-horizontal-overflow="false"/);

  const errorDom = await dumpDom(
    `${origin}/form/?mode=error`,
    1800,
    "900,1300",
  );
  assert.doesNotMatch(openingTag(errorDom, "retry-button"), /\shidden/);
  assert.match(errorDom, /data-preserved-first-name="Test"/);
  assert.match(errorDom, /data-active-element="submission-status"/);
  assert.match(errorDom, /data-horizontal-overflow="false"/);

  console.log(
    `Chrome contact checks passed (${expectedEmbed ? "configured embed" : "unavailable-form state"}, validation, loading, success, retry, mobile overflow).`,
  );
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}

function buildFormHarness(mode) {
  const serverStub = `<script>
    window.__contactTestMode = ${JSON.stringify(mode)};
    window.google = {
      script: {
        run: {
          successHandler: null,
          failureHandler: null,
          withSuccessHandler: function (handler) {
            this.successHandler = handler;
            return this;
          },
          withFailureHandler: function (handler) {
            this.failureHandler = handler;
            return this;
          },
          submitContactForm: function () {
            if (window.__contactTestMode === "loading") return;
            var result = window.__contactTestMode === "success"
              ? {
                  ok: true,
                  message: "Thank you for contacting NETYR. Your message has been received, and a member of our team will follow up."
                }
              : {
                  ok: false,
                  message: "We could not send your message right now. Please wait a moment and try again.",
                  fieldErrors: {}
                };
            var self = this;
            window.setTimeout(function () {
              self.successHandler(result);
            }, 120);
          }
        }
      }
    };
  </script>`;

  const automation = `<script>
    window.addEventListener("DOMContentLoaded", function () {
      var mode = window.__contactTestMode;
      var form = document.getElementById("contact-form");

      if (mode !== "empty") {
        document.getElementById("firstName").value = "Test";
        document.getElementById("lastName").value = "Visitor";
        document.getElementById("email").value = "visitor@example.com";
        document.getElementById("county").value = "Example County";
        document.getElementById("inquiryType").value = "General Question";
        document.getElementById("message").value =
          "This is a browser validation test message.";
        document.getElementById("consent").checked = true;
      }

      form.requestSubmit();

      window.setTimeout(function () {
        document.body.dataset.activeElement =
          document.activeElement && document.activeElement.id
            ? document.activeElement.id
            : "";
        document.body.dataset.preservedFirstName =
          document.getElementById("firstName").value;
        document.body.dataset.horizontalOverflow = String(
          document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        );
      }, 600);
    });
  </script>`;

  return indexTemplate
    .replace('<?!= include_("Stylesheet"); ?>', styles)
    .replace(
      '<?!= include_("JavaScript"); ?>',
      `${serverStub}${client}${automation}`,
    )
    .replace("<?= sessionToken ?>", "browser-test-session");
}

function serveStaticExport(pathname, response) {
  const requestedPath = pathname.endsWith("/")
    ? `${pathname}index.html`
    : pathname;
  const relativePath = normalize(requestedPath).replace(
    /^([/\\])+|(\.\.[/\\])/g,
    "",
  );
  const filePath = resolve(outDirectory, relativePath);

  if (!filePath.startsWith(outDirectory) || !existsAsFile(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const contentTypes = {
    ".css": "text/css",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".png": "image/png",
    ".svg": "image/svg+xml",
  };
  response.writeHead(200, {
    "Content-Type":
      contentTypes[extname(filePath)] ?? "application/octet-stream",
  });
  const contents = readFileSync(filePath);
  if (extname(filePath) === ".html") {
    const html = contents.toString("utf8").replace(
      "</body>",
      `<script>
        window.setTimeout(function () {
          document.body.dataset.horizontalOverflow = String(
            document.documentElement.scrollWidth >
              document.documentElement.clientWidth
          );
        }, 700);
      </script></body>`,
    );
    response.end(html);
    return;
  }

  response.end(contents);
}

function existsAsFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

async function dumpDom(url, virtualTimeBudget, windowSize) {
  const profilePrefix = join(tmpdir(), "netyr-contact-browser-");
  const profileDirectory = mkdtempSync(profilePrefix);

  try {
    const result = await runProcess(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--no-default-browser-check",
      "--no-first-run",
      "--disable-background-networking",
      `--user-data-dir=${profileDirectory}`,
      `--window-size=${windowSize}`,
      `--virtual-time-budget=${virtualTimeBudget}`,
      "--dump-dom",
      url,
    ]);

    assert.equal(result.code, 0, result.stderr);
    assert.doesNotMatch(
      result.stderr,
      /CONSOLE.*(?:Uncaught|Hydration|Warning:|Error:)/i,
      result.stderr,
    );
    return result.stdout;
  } finally {
    const normalizedProfile = resolve(profileDirectory);
    const normalizedPrefix = resolve(tmpdir(), "netyr-contact-browser-");
    if (normalizedProfile.startsWith(normalizedPrefix)) {
      rmSync(normalizedProfile, { recursive: true, force: true });
    }
  }
}

function runProcess(command, args) {
  return new Promise((resolveProcess, rejectProcess) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", rejectProcess);
    child.on("close", (code) => {
      resolveProcess({ code, stderr, stdout });
    });
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function openingTag(html, id) {
  const match = html.match(
    new RegExp(`<[^>]+\\bid="${escapeRegExp(id)}"[^>]*>`, "i"),
  );
  assert.ok(match, `Missing element #${id}.`);
  return match[0];
}
