import assert from "node:assert/strict";

const cdpOrigin = process.env.CDP_ORIGIN ?? "http://127.0.0.1:9333";
const contactEndpoint = process.env.CONTACT_ENDPOINT ?? "";

assert.match(
  contactEndpoint,
  /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/,
  "A production Apps Script contact endpoint is required.",
);

const targets = await fetch(`${cdpOrigin}/json/list`).then((response) =>
  response.json(),
);
const target = targets.find((candidate) => candidate.type === "page");
assert.ok(
  target?.webSocketDebuggerUrl,
  "A debuggable Chrome page is required.",
);

let nextId = 0;
const pending = new Map();
const consoleErrors = [];
const runtimeErrors = [];
let socket;

function handleMessage({ data }) {
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
  }
}

async function connect(webSocketDebuggerUrl) {
  socket = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  socket.addEventListener("message", handleMessage);
}

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

await connect(target.webSocketDebuggerUrl);
await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: contactEndpoint });
await delay(5000);

let formReady = await evaluate(
  `Boolean(document.querySelector("#contact-form") && document.querySelector("#sessionToken")?.value)`,
);

if (!formReady) {
  const refreshedTargets = await fetch(`${cdpOrigin}/json/list`).then(
    (response) => response.json(),
  );
  const iframeTarget = refreshedTargets.find(
    (candidate) =>
      candidate.type === "iframe" &&
      /googleusercontent\.com\/userCodeAppPanel/.test(candidate.url),
  );
  assert.ok(
    iframeTarget?.webSocketDebuggerUrl,
    "The deployed Apps Script form frame was not available.",
  );

  socket.close();
  await connect(iframeTarget.webSocketDebuggerUrl);
  await send("Page.enable");
  await send("Runtime.enable");
  await delay(2000);
  formReady = await evaluate(
    `(() => {
      const frameDocument =
        document.querySelector("#userHtmlFrame")?.contentDocument ?? document;
      return Boolean(
        frameDocument.querySelector("#contact-form") &&
        frameDocument.querySelector("#sessionToken")?.value
      );
    })()`,
  );
}

assert.equal(formReady, true, "The deployed contact form did not load.");

await evaluate(`(() => {
  const frameDocument =
    document.querySelector("#userHtmlFrame")?.contentDocument ?? document;
  frameDocument.querySelector("#contact-form").requestSubmit();
})()`);
await delay(500);
const validationErrorCount = await evaluate(
  `(() => {
    const frameDocument =
      document.querySelector("#userHtmlFrame")?.contentDocument ?? document;
    return Array.from(frameDocument.querySelectorAll(".field-error"))
      .filter((element) => element.textContent.trim()).length;
  })()`,
);
assert.ok(validationErrorCount >= 5, "Required-field validation did not run.");

await evaluate(`(() => {
  const frameDocument =
    document.querySelector("#userHtmlFrame")?.contentDocument ?? document;
  const values = {
    firstName: "NETYR",
    lastName: "Validation",
    email: "test@example.com",
    county: "Test County",
    inquiryType: "General Question",
    preferredContactMethod: "Email",
    message: "NETYR automated contact validation - remove after test - 2026-07-27 17:31 CT."
  };
  for (const [id, value] of Object.entries(values)) {
    const field = frameDocument.getElementById(id);
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }
  const consent = frameDocument.getElementById("consent");
  consent.checked = true;
  consent.dispatchEvent(new Event("change", { bubbles: true }));
})()`);

await delay(4500);
await evaluate(`(() => {
  const frameDocument =
    document.querySelector("#userHtmlFrame")?.contentDocument ?? document;
  frameDocument.querySelector("#contact-form").requestSubmit();
})()`);

let submissionResult = null;
for (let attempt = 0; attempt < 30; attempt += 1) {
  submissionResult = await evaluate(`({
    success: !(
      document.querySelector("#userHtmlFrame")?.contentDocument ?? document
    ).getElementById("success-panel").hidden,
    status: (
      document.querySelector("#userHtmlFrame")?.contentDocument ?? document
    ).getElementById("submission-status").textContent.trim(),
    submitDisabled: (
      document.querySelector("#userHtmlFrame")?.contentDocument ?? document
    ).getElementById("submit-button").disabled
  })`);
  if (
    submissionResult.success ||
    /could not|error/i.test(submissionResult.status)
  ) {
    break;
  }
  await delay(1000);
}

assert.equal(
  submissionResult?.success,
  true,
  `Contact submission did not succeed: ${submissionResult?.status ?? "unknown error"}`,
);
assert.deepEqual(consoleErrors, [], "Browser console errors were detected.");
assert.deepEqual(runtimeErrors, [], "Browser runtime errors were detected.");

socket.close();
console.log(
  JSON.stringify({
    formLoaded: true,
    requiredValidation: true,
    submissionSucceeded: true,
  }),
);
