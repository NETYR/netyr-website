const SPONSOR_SHEET_NAME = "Master Contacts";
const IDENTITY_HEADERS = Object.freeze([
  "First Name",
  "Last Name",
  "Organization",
]);
const PUBLIC_SPONSOR_HEADERS = Object.freeze([
  "Sponsorship Level",
  "Website URL",
  "Logo URL",
  "Public Display",
  "Display Order",
]);
const SPONSOR_TIERS = Object.freeze(["Patron", "Sustaining", "Supporting"]);
const SPONSOR_CONFIG = Object.freeze({
  spreadsheetProperty: "SPREADSHEET_ID",
  cacheSeconds: 300,
  maximumRows: 5000,
});

function doGet() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get("netyr-public-sponsors-v2");
    if (cached) return jsonText_(cached);

    const sponsors = readPublicSponsors_();
    const response = JSON.stringify({ ok: true, sponsors: sponsors });
    cache.put(
      "netyr-public-sponsors-v2",
      response,
      SPONSOR_CONFIG.cacheSeconds,
    );
    return jsonText_(response);
  } catch (_error) {
    return unavailableResponse_();
  }
}

function clearSponsorCache() {
  CacheService.getScriptCache().remove("netyr-public-sponsors-v2");
  return { ok: true };
}

function verifySponsorSource() {
  const sheet = getSponsorSheet_();
  verifyHeaders_(sheet);
  return {
    ok: true,
    message: "The Master Contacts public sponsor fields are ready.",
  };
}

function readPublicSponsors_() {
  const sheet = getSponsorSheet_();
  verifyHeaders_(sheet);

  const rowCount = Math.min(sheet.getLastRow(), SPONSOR_CONFIG.maximumRows);
  if (rowCount < 2) return [];

  // Read only identity fields A:C and the public sponsor fields J:N.
  // Private phone, email, address, notes, and contact-id columns are never read.
  const identityRange = sheet.getRange(1, 1, rowCount, 3);
  const publicRange = sheet.getRange(1, 10, rowCount, 5);
  const identityValues = identityRange.getDisplayValues();
  const identityFormulas = identityRange.getFormulas();
  const publicValues = publicRange.getDisplayValues();
  const publicFormulas = publicRange.getFormulas();
  const sponsors = [];

  for (let index = 1; index < rowCount; index += 1) {
    const sponsor = sponsorFromRows_(
      identityValues[index],
      publicValues[index],
      identityFormulas[index],
      publicFormulas[index],
    );
    if (sponsor) sponsors.push(sponsor);
  }

  const unique = [];
  const seenNames = {};
  sponsors
    .sort(function (left, right) {
      return (
        tierOrder_(left.tier) - tierOrder_(right.tier) ||
        left.displayOrder - right.displayOrder ||
        left.name.localeCompare(right.name)
      );
    })
    .forEach(function (sponsor) {
      const key = sponsor.name.toLowerCase();
      if (seenNames[key]) return;
      seenNames[key] = true;
      unique.push(sponsor);
    });

  return unique;
}

function sponsorFromRows_(
  identityRow,
  publicRow,
  identityFormulas,
  publicFormulas,
) {
  if (
    (identityFormulas || []).some(Boolean) ||
    (publicFormulas || []).some(Boolean)
  ) {
    return null;
  }

  const firstName = cleanText_(identityRow[0], 80);
  const lastName = cleanText_(identityRow[1], 80);
  const organization = cleanText_(identityRow[2], 180);
  const tier = sponsorTier_(publicRow[0]);
  const isPublic = publicDisplay_(publicRow[3]);
  const personName = cleanText_([firstName, lastName].join(" "), 180);
  const name = organization || personName;

  if (!isPublic || !name || !tier) return null;

  return {
    name: name,
    tier: tier,
    websiteUrl: publicUrl_(publicRow[1]),
    logoUrl: publicUrl_(publicRow[2]),
    displayOrder: finiteNumber_(publicRow[4]),
  };
}

function getSponsorSheet_() {
  const spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  const sheet = spreadsheet.getSheetByName(SPONSOR_SHEET_NAME);
  if (!sheet) throw new Error("Sponsor source is unavailable.");
  return sheet;
}

function verifyHeaders_(sheet) {
  const identity = sheet
    .getRange(1, 1, 1, IDENTITY_HEADERS.length)
    .getDisplayValues()[0];
  const publicFields = sheet
    .getRange(1, 10, 1, PUBLIC_SPONSOR_HEADERS.length)
    .getDisplayValues()[0];

  if (
    !headersMatch_(identity, IDENTITY_HEADERS) ||
    !headersMatch_(publicFields, PUBLIC_SPONSOR_HEADERS)
  ) {
    throw new Error("Master Contacts has unexpected sponsor headers.");
  }
}

function headersMatch_(actual, expected) {
  return expected.every(function (header, index) {
    return String(actual[index] || "").trim() === header;
  });
}

function getSpreadsheetId_() {
  const spreadsheetId = String(
    PropertiesService.getScriptProperties().getProperty(
      SPONSOR_CONFIG.spreadsheetProperty,
    ) || "",
  ).trim();
  if (!spreadsheetId) throw new Error("Sponsor source is unavailable.");
  return spreadsheetId;
}

function cleanText_(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sponsorTier_(value) {
  const candidate = cleanText_(value, 40);
  return SPONSOR_TIERS.indexOf(candidate) >= 0 ? candidate : "";
}

function publicDisplay_(value) {
  if (value === true) return true;
  const candidate = cleanText_(value, 20).toLowerCase();
  return (
    candidate === "true" ||
    candidate === "yes" ||
    candidate === "approved" ||
    candidate === "public"
  );
}

function publicUrl_(value) {
  const candidate = cleanText_(value, 2000);
  return /^https:\/\//i.test(candidate) ? candidate : "";
}

function finiteNumber_(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER;
}

function tierOrder_(tier) {
  const index = SPONSOR_TIERS.indexOf(tier);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

function unavailableResponse_() {
  return jsonText_(
    JSON.stringify({
      ok: false,
      message: "Sponsor recognition is temporarily unavailable.",
      sponsors: [],
    }),
  );
}

function jsonText_(value) {
  return ContentService.createTextOutput(value).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function runWebsiteSponsorsTests() {
  const results = [];
  const test = function (name, callback) {
    callback();
    results.push(name);
  };

  test("publishes an approved organization sponsor", function () {
    const sponsor = sponsorFromRows_(
      ["Private", "Contact", "Approved Business"],
      ["Patron", "https://example.org", "", "TRUE", "1"],
      ["", "", ""],
      ["", "", "", "", ""],
    );
    if (
      !sponsor ||
      sponsor.name !== "Approved Business" ||
      sponsor.tier !== "Patron"
    ) {
      throw new Error("Approved organization sponsor mapping failed.");
    }
  });

  test("falls back to an approved person name", function () {
    const sponsor = sponsorFromRows_(
      ["Public", "Supporter", ""],
      ["Supporting", "", "", "yes", ""],
      ["", "", ""],
      ["", "", "", "", ""],
    );
    if (!sponsor || sponsor.name !== "Public Supporter") {
      throw new Error("Approved person-name fallback failed.");
    }
  });

  test("rejects records without public approval", function () {
    const sponsor = sponsorFromRows_(
      ["Private", "Donor", "Private Business"],
      ["Sustaining", "", "", "FALSE", ""],
      ["", "", ""],
      ["", "", "", "", ""],
    );
    if (sponsor) throw new Error("Private sponsor was published.");
  });

  test("rejects unapproved levels and insecure links", function () {
    const invalidTier = sponsorFromRows_(
      ["Test", "Person", ""],
      ["Gold", "", "", "TRUE", ""],
      ["", "", ""],
      ["", "", "", "", ""],
    );
    const secureSponsor = sponsorFromRows_(
      ["Test", "Person", ""],
      [
        "Patron",
        "http://example.org",
        "http://example.org/logo.png",
        "TRUE",
        "",
      ],
      ["", "", ""],
      ["", "", "", "", ""],
    );
    if (
      invalidTier ||
      !secureSponsor ||
      secureSponsor.websiteUrl ||
      secureSponsor.logoUrl
    ) {
      throw new Error("Sponsor validation failed.");
    }
  });

  test("rejects formula-backed public records", function () {
    const sponsor = sponsorFromRows_(
      ["Test", "Person", ""],
      ["Patron", "", "", "TRUE", ""],
      ["", "", ""],
      ["=A1", "", "", "", ""],
    );
    if (sponsor) throw new Error("Formula-backed sponsor was published.");
  });

  return { ok: true, passed: results.length, tests: results };
}
