const CONTACT_SHEET_NAME = "Website Contacts";

const CONTACT_HEADERS = Object.freeze([
  "Submission ID",
  "Submitted At",
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "County",
  "Inquiry Type",
  "Preferred Contact Method",
  "Message",
  "Consent",
  "Status",
  "Assigned To",
  "Follow-Up Notes",
  "Last Updated",
]);

const CONTACT_CONFIG = Object.freeze({
  spreadsheetProperty: "SPREADSHEET_ID",
  minimumCompletionMilliseconds: 4000,
  sessionLifetimeSeconds: 1800,
  duplicateWindowSeconds: 600,
  rateLimitWindowSeconds: 900,
  rateLimitMaximum: 4,
  inquiryTypes: Object.freeze([
    "General Question",
    "Membership",
    "Upcoming Event",
    "Volunteer",
    "Sponsorship",
    "Media",
    "Other",
  ]),
  contactMethods: Object.freeze(["Email", "Phone", "Either"]),
  statusChoices: Object.freeze(["New", "In Progress", "Closed"]),
});

function doGet() {
  const template = HtmlService.createTemplateFromFile("Index");
  const sessionToken = Utilities.getUuid();

  CacheService.getScriptCache().put(
    sessionCacheKey_(sessionToken),
    String(Date.now()),
    CONTACT_CONFIG.sessionLifetimeSeconds,
  );

  template.sessionToken = sessionToken;

  return template
    .evaluate()
    .setTitle("Contact North East Texas Young Republicans")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include_(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function submitContactForm(payload) {
  try {
    const validation = validateSubmission_(payload, {
      requireSession: true,
    });

    if (!validation.ok) {
      return {
        ok: false,
        message: validation.message,
        fieldErrors: validation.fieldErrors || {},
      };
    }

    const values = validation.values;
    const cache = CacheService.getScriptCache();
    const rateKey = rateLimitCacheKey_(values.email);
    const duplicateKey = duplicateCacheKey_(values);

    const writeResult = processApprovedSubmission_(
      values,
      rateKey,
      duplicateKey,
      cache,
    );

    if (writeResult === "rate-limited") {
      return genericFailureResult_();
    }

    if (writeResult === "duplicate") {
      return {
        ok: false,
        message:
          "It looks like this message was already received. Please wait before trying again.",
        fieldErrors: {},
      };
    }

    cache.remove(sessionCacheKey_(values.sessionToken));

    return {
      ok: true,
      message:
        "Thank you for contacting NETYR. Your message has been received, and a member of our team will follow up.",
    };
  } catch (_error) {
    console.error("Contact submission failed.");
    return genericFailureResult_();
  }
}

function setupContactSystem() {
  assertAdministratorInvocation_();

  const spreadsheetId = getSpreadsheetId_();
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = getContactSheetFromSpreadsheet_(spreadsheet);
  let created = false;
  let headersAdded = false;
  let warning = "";

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONTACT_SHEET_NAME);
    created = true;
  }

  const lastRow = sheet.getLastRow();
  const existingHeaders =
    sheet.getLastColumn() > 0
      ? sheet
          .getRange(
            1,
            1,
            1,
            Math.max(sheet.getLastColumn(), CONTACT_HEADERS.length),
          )
          .getDisplayValues()[0]
          .slice(0, CONTACT_HEADERS.length)
      : [];
  const headerState = compareHeaders_(existingHeaders);

  if (lastRow === 0 || (lastRow === 1 && headerState !== "exact")) {
    sheet
      .getRange(1, 1, 1, CONTACT_HEADERS.length)
      .setValues([CONTACT_HEADERS]);
    headersAdded = true;
  } else if (headerState !== "exact") {
    if (headerState === "same-fields") {
      warning =
        "Existing columns use a different order. No existing data was moved; submissions will follow the current header positions.";
    } else {
      throw new Error(
        "Website Contacts has unexpected headers. No existing data was changed.",
      );
    }
  }

  formatContactSheet_(sheet);
  SpreadsheetApp.flush();

  const result = {
    ok: true,
    created: created,
    headersAdded: headersAdded,
    warning: warning,
    message: warning
      ? "Contact system is ready with a header-order warning."
      : "Contact system is ready.",
  };

  console.log(result.message);
  return result;
}

function processApprovedSubmission_(values, rateKey, duplicateKey, cache) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    throw new Error("Contact destination is busy.");
  }

  try {
    if (isRateLimited_(rateKey, cache)) return "rate-limited";
    if (isDuplicate_(duplicateKey, cache)) return "duplicate";

    appendSubmission_(values);
    cache.put(duplicateKey, "1", CONTACT_CONFIG.duplicateWindowSeconds);
    return "written";
  } finally {
    lock.releaseLock();
  }
}

function appendSubmission_(values) {
  const spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  const sheet = getContactSheetFromSpreadsheet_(spreadsheet);

  if (!sheet) {
    throw new Error("Contact destination is not configured.");
  }

  const headerMap = getHeaderMap_(sheet);
  const missingHeaders = CONTACT_HEADERS.filter(function (header) {
    return !Object.prototype.hasOwnProperty.call(headerMap, header);
  });

  if (missingHeaders.length) {
    throw new Error("Contact destination headers are incomplete.");
  }

  const now = new Date();
  const rowByHeader = {
    "Submission ID": Utilities.getUuid(),
    "Submitted At": now,
    "First Name": safeForSheet_(values.firstName),
    "Last Name": safeForSheet_(values.lastName),
    Email: safeForSheet_(values.email),
    Phone: safeForSheet_(values.phone),
    County: safeForSheet_(values.county),
    "Inquiry Type": safeForSheet_(values.inquiryType),
    "Preferred Contact Method": safeForSheet_(values.preferredContactMethod),
    Message: safeForSheet_(values.message),
    Consent: "Yes",
    Status: "New",
    "Assigned To": "",
    "Follow-Up Notes": "",
    "Last Updated": now,
  };

  const output = new Array(sheet.getLastColumn()).fill("");
  CONTACT_HEADERS.forEach(function (header) {
    output[headerMap[header]] = rowByHeader[header];
  });

  sheet.appendRow(output);
}

function validateSubmission_(payload, options) {
  const input = payload && typeof payload === "object" ? payload : {};
  const fieldErrors = {};
  const values = {
    firstName: normalizeText_(input.firstName),
    lastName: normalizeText_(input.lastName),
    email: normalizeText_(input.email).toLowerCase(),
    phone: normalizeText_(input.phone),
    county: normalizeText_(input.county),
    inquiryType: normalizeText_(input.inquiryType),
    preferredContactMethod: normalizeText_(input.preferredContactMethod),
    message: normalizeMultilineText_(input.message),
    consent:
      input.consent === true ||
      input.consent === "true" ||
      input.consent === "on",
    website: normalizeText_(input.website),
    sessionToken: normalizeText_(input.sessionToken),
  };

  if (values.website) {
    return {
      ok: false,
      message: "We could not send your message. Please try again.",
      fieldErrors: {},
      reason: "honeypot",
    };
  }

  validateLength_(fieldErrors, "firstName", values.firstName, 1, 60);
  validateLength_(fieldErrors, "lastName", values.lastName, 1, 60);

  if (!values.email) {
    fieldErrors.email = "Enter your email address.";
  } else if (values.email.length > 254 || !isValidEmail_(values.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (values.phone.length > 30) {
    fieldErrors.phone = "Phone number must be 30 characters or fewer.";
  }

  validateLength_(fieldErrors, "county", values.county, 1, 80);

  if (CONTACT_CONFIG.inquiryTypes.indexOf(values.inquiryType) === -1) {
    fieldErrors.inquiryType = "Choose an inquiry type.";
  }

  if (
    values.preferredContactMethod &&
    CONTACT_CONFIG.contactMethods.indexOf(values.preferredContactMethod) === -1
  ) {
    fieldErrors.preferredContactMethod = "Choose Email, Phone, or Either.";
  }

  validateLength_(fieldErrors, "message", values.message, 10, 2000);

  if (!values.consent) {
    fieldErrors.consent = "Confirm that NETYR may contact you.";
  }

  ["firstName", "lastName", "email", "phone", "county", "message"].forEach(
    function (field) {
      if (containsHtml_(values[field])) {
        fieldErrors[field] = "Remove HTML tags and try again.";
      }
    },
  );

  if (options && options.requireSession) {
    const sessionResult = validateSession_(values.sessionToken);
    if (!sessionResult.ok) {
      return {
        ok: false,
        message: sessionResult.message,
        fieldErrors: {},
        reason: sessionResult.reason,
      };
    }
  }

  if (Object.keys(fieldErrors).length) {
    return {
      ok: false,
      message: "Please review the highlighted fields.",
      fieldErrors: fieldErrors,
      values: values,
    };
  }

  return {
    ok: true,
    message: "",
    fieldErrors: {},
    values: values,
  };
}

function validateSession_(sessionToken) {
  if (!sessionToken) {
    return {
      ok: false,
      message: "Please refresh the form and try again.",
      reason: "missing-session",
    };
  }

  const startedAt = Number(
    CacheService.getScriptCache().get(sessionCacheKey_(sessionToken)),
  );

  if (!startedAt) {
    return {
      ok: false,
      message: "Please refresh the form and try again.",
      reason: "expired-session",
    };
  }

  if (Date.now() - startedAt < CONTACT_CONFIG.minimumCompletionMilliseconds) {
    return {
      ok: false,
      message: "Please review your message and try again.",
      reason: "too-fast",
    };
  }

  return { ok: true };
}

function isRateLimited_(cacheKey, cache) {
  const current = Number(cache.get(cacheKey) || "0");
  if (current >= CONTACT_CONFIG.rateLimitMaximum) return true;

  cache.put(
    cacheKey,
    String(current + 1),
    CONTACT_CONFIG.rateLimitWindowSeconds,
  );
  return false;
}

function isDuplicate_(cacheKey, cache) {
  return cache.get(cacheKey) === "1";
}

function formatContactSheet_(sheet) {
  sheet.setFrozenRows(1);

  const headerRange = sheet.getRange(1, 1, 1, CONTACT_HEADERS.length);
  headerRange
    .setFontWeight("bold")
    .setBackground("#e5e7eb")
    .setFontColor("#071a33")
    .setWrap(true);

  sheet.setRowHeight(1, 34);
  sheet.setColumnWidths(1, CONTACT_HEADERS.length, 150);
  sheet.setColumnWidth(2, 175);
  sheet.setColumnWidth(5, 220);
  sheet.setColumnWidth(10, 420);
  sheet.setColumnWidth(14, 300);
  sheet.setColumnWidth(15, 175);

  const headerMap = getHeaderMap_(sheet);
  if (Object.prototype.hasOwnProperty.call(headerMap, "Status")) {
    const statusColumn = headerMap.Status + 1;
    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONTACT_CONFIG.statusChoices, true)
      .setAllowInvalid(false)
      .setHelpText("Choose a contact follow-up status.")
      .build();
    sheet
      .getRange(2, statusColumn, Math.max(sheet.getMaxRows() - 1, 1), 1)
      .setDataValidation(statusRule);
  }

  ["Submitted At", "Last Updated"].forEach(function (header) {
    if (Object.prototype.hasOwnProperty.call(headerMap, header)) {
      sheet
        .getRange(
          2,
          headerMap[header] + 1,
          Math.max(sheet.getMaxRows() - 1, 1),
          1,
        )
        .setNumberFormat("mmm d, yyyy h:mm AM/PM");
    }
  });
}

function getHeaderMap_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (!lastColumn) return {};

  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  return headers.reduce(function (map, header, index) {
    const normalized = normalizeText_(header);
    if (normalized) map[normalized] = index;
    return map;
  }, {});
}

function getContactSheetFromSpreadsheet_(spreadsheet) {
  return spreadsheet.getSheetByName(CONTACT_SHEET_NAME);
}

function getSpreadsheetId_() {
  const value = PropertiesService.getScriptProperties().getProperty(
    CONTACT_CONFIG.spreadsheetProperty,
  );

  if (!value) {
    throw new Error("Contact destination is not configured.");
  }

  return value;
}

function assertAdministratorInvocation_() {
  const activeEmail = Session.getActiveUser().getEmail();
  const effectiveEmail = Session.getEffectiveUser().getEmail();

  if (
    !activeEmail ||
    !effectiveEmail ||
    activeEmail.toLowerCase() !== effectiveEmail.toLowerCase()
  ) {
    throw new Error(
      "Run setupContactSystem from the Apps Script editor as the deployment owner.",
    );
  }
}

function compareHeaders_(headers) {
  const normalized = headers.map(normalizeText_).filter(Boolean);
  if (
    normalized.length === CONTACT_HEADERS.length &&
    normalized.every(function (header, index) {
      return header === CONTACT_HEADERS[index];
    })
  ) {
    return "exact";
  }

  if (
    normalized.length === CONTACT_HEADERS.length &&
    CONTACT_HEADERS.every(function (header) {
      return normalized.indexOf(header) !== -1;
    })
  ) {
    return "same-fields";
  }

  return "different";
}

function validateLength_(errors, field, value, minimum, maximum) {
  if (value.length < minimum) {
    errors[field] =
      minimum === 1
        ? "This field is required."
        : "Use at least " + minimum + " characters.";
  } else if (value.length > maximum) {
    errors[field] = "Use " + maximum + " characters or fewer.";
  }
}

function normalizeText_(value) {
  return String(value == null ? "" : value)
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeMultilineText_(value) {
  return String(value == null ? "" : value)
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function containsHtml_(value) {
  return /<\/?[a-z][^>]*>/i.test(value);
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeForSheet_(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function sessionCacheKey_(token) {
  return "contact-session:" + token;
}

function rateLimitCacheKey_(email) {
  return "contact-rate:" + digest_(email);
}

function duplicateCacheKey_(values) {
  return (
    "contact-duplicate:" +
    digest_(
      [
        values.email,
        values.firstName,
        values.lastName,
        values.inquiryType,
        values.message,
      ].join("|"),
    )
  );
}

function digest_(value) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8,
  );
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, "");
}

function genericFailureResult_() {
  return {
    ok: false,
    message:
      "We could not send your message right now. Please wait a moment and try again.",
    fieldErrors: {},
  };
}

function runContactSystemTests() {
  const tests = [];

  runTest_(
    "valid submission acceptance",
    function () {
      assert_(
        validateSubmission_(validTestPayload_(), {}).ok,
        "Expected valid.",
      );
    },
    tests,
  );

  runTest_(
    "missing required field rejection",
    function () {
      const payload = validTestPayload_();
      payload.firstName = "";
      const result = validateSubmission_(payload, {});
      assert_(
        !result.ok && result.fieldErrors.firstName,
        "Expected rejection.",
      );
    },
    tests,
  );

  runTest_(
    "invalid inquiry type rejection",
    function () {
      const payload = validTestPayload_();
      payload.inquiryType = "Not Approved";
      const result = validateSubmission_(payload, {});
      assert_(
        !result.ok && result.fieldErrors.inquiryType,
        "Expected rejection.",
      );
    },
    tests,
  );

  runTest_(
    "invalid contact preference rejection",
    function () {
      const payload = validTestPayload_();
      payload.preferredContactMethod = "Carrier Pigeon";
      const result = validateSubmission_(payload, {});
      assert_(
        !result.ok && result.fieldErrors.preferredContactMethod,
        "Expected rejection.",
      );
    },
    tests,
  );

  runTest_(
    "formula injection neutralization",
    function () {
      assert_(
        safeForSheet_("=1+1") === "'=1+1",
        "Formula was not neutralized.",
      );
      assert_(
        safeForSheet_("Mary-Jane") === "Mary-Jane",
        "Ordinary punctuation changed.",
      );
    },
    tests,
  );

  runTest_(
    "honeypot rejection",
    function () {
      const payload = validTestPayload_();
      payload.website = "filled";
      const result = validateSubmission_(payload, {});
      assert_(
        !result.ok && result.reason === "honeypot",
        "Expected rejection.",
      );
    },
    tests,
  );

  runTest_(
    "duplicate submission rejection",
    function () {
      const cache = fakeCache_();
      const key = "test-duplicate";
      assert_(!isDuplicate_(key, cache), "Unexpected duplicate.");
      cache.put(key, "1", 60);
      assert_(isDuplicate_(key, cache), "Expected duplicate.");
    },
    tests,
  );

  runTest_(
    "message length enforcement",
    function () {
      const shortPayload = validTestPayload_();
      shortPayload.message = "Too short";
      const longPayload = validTestPayload_();
      longPayload.message = new Array(2002).join("x");
      assert_(
        validateSubmission_(shortPayload, {}).fieldErrors.message,
        "Short message accepted.",
      );
      assert_(
        validateSubmission_(longPayload, {}).fieldErrors.message,
        "Long message accepted.",
      );
    },
    tests,
  );

  runTest_(
    "Website Contacts tab restriction",
    function () {
      const requested = [];
      const spreadsheet = {
        getSheetByName: function (name) {
          requested.push(name);
          return { name: name };
        },
      };
      getContactSheetFromSpreadsheet_(spreadsheet);
      assert_(
        requested.length === 1 && requested[0] === CONTACT_SHEET_NAME,
        "Unexpected tab requested.",
      );
    },
    tests,
  );

  runTest_(
    "no roster access",
    function () {
      assert_(
        CONTACT_SHEET_NAME === "Website Contacts" &&
          CONTACT_HEADERS.indexOf("Voter ID") === -1 &&
          CONTACT_HEADERS.indexOf("Date of Birth") === -1 &&
          CONTACT_HEADERS.indexOf("Address") === -1,
        "Private roster field detected.",
      );
    },
    tests,
  );

  const result = { ok: true, passed: tests.length, tests: tests };
  console.log("Contact tests passed: " + tests.length);
  return result;
}

function runTest_(name, callback, tests) {
  callback();
  tests.push(name);
}

function assert_(condition, message) {
  if (!condition) throw new Error(message);
}

function validTestPayload_() {
  return {
    firstName: "Test",
    lastName: "Visitor",
    email: "visitor@example.com",
    phone: "",
    county: "Example County",
    inquiryType: "General Question",
    preferredContactMethod: "Email",
    message: "This is a valid isolated test message.",
    consent: true,
    website: "",
    sessionToken: "isolated-test",
  };
}

function fakeCache_() {
  const values = {};
  return {
    get: function (key) {
      return Object.prototype.hasOwnProperty.call(values, key)
        ? values[key]
        : null;
    },
    put: function (key, value) {
      values[key] = value;
    },
    remove: function (key) {
      delete values[key];
    },
  };
}
