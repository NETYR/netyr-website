const SPONSOR_SHEET_NAME = "Website Sponsors";
const SPONSOR_HEADERS = Object.freeze([
  "Sponsor Name",
  "Active",
  "Display Order",
]);
const SPONSOR_CONFIG = Object.freeze({
  spreadsheetProperty: "SPREADSHEET_ID",
  cacheSeconds: 300,
  maximumRows: 1000,
});

function doGet() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get("netyr-public-sponsors-v1");
    if (cached) return jsonText_(cached);

    const sponsors = readPublicSponsors_();
    const response = JSON.stringify({ ok: true, sponsors: sponsors });
    cache.put(
      "netyr-public-sponsors-v1",
      response,
      SPONSOR_CONFIG.cacheSeconds,
    );
    return jsonText_(response);
  } catch (_error) {
    return unavailableResponse_();
  }
}

function setupSponsorSheet() {
  const spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  let sheet = spreadsheet.getSheetByName(SPONSOR_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SPONSOR_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet
      .getRange(1, 1, 1, SPONSOR_HEADERS.length)
      .setValues([SPONSOR_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, SPONSOR_HEADERS.length).setFontWeight("bold");
  } else {
    const headers = sheet
      .getRange(1, 1, 1, SPONSOR_HEADERS.length)
      .getDisplayValues()[0];
    if (!headersMatch_(headers)) {
      throw new Error("Website Sponsors has unexpected headers.");
    }
  }

  return { ok: true, message: "Website Sponsors is ready." };
}

function readPublicSponsors_() {
  const spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  const sheet = spreadsheet.getSheetByName(SPONSOR_SHEET_NAME);
  if (!sheet) throw new Error("Sponsor destination is unavailable.");

  const rowCount = Math.min(sheet.getLastRow(), SPONSOR_CONFIG.maximumRows);
  if (rowCount < 2) return [];

  const range = sheet.getRange(1, 1, rowCount, SPONSOR_HEADERS.length);
  const values = range.getDisplayValues();
  const formulas = range.getFormulas();
  if (!headersMatch_(values[0])) throw new Error("Unexpected sponsor headers.");

  return values
    .slice(1)
    .map(function (row, index) {
      if (formulas[index + 1].some(Boolean)) return null;
      const name = cleanName_(row[0]);
      if (!name || boolean_(row[1]) !== true) return null;
      return { name: name, displayOrder: finiteNumber_(row[2]) };
    })
    .filter(Boolean)
    .sort(function (left, right) {
      return (
        left.displayOrder - right.displayOrder ||
        left.name.localeCompare(right.name)
      );
    })
    .map(function (sponsor) {
      return sponsor.name;
    });
}

function headersMatch_(headers) {
  return SPONSOR_HEADERS.every(function (header, index) {
    return String(headers[index] || "").trim() === header;
  });
}

function getSpreadsheetId_() {
  const spreadsheetId = String(
    PropertiesService.getScriptProperties().getProperty(
      SPONSOR_CONFIG.spreadsheetProperty,
    ) || "",
  ).trim();
  if (!spreadsheetId) throw new Error("Sponsor destination is unavailable.");
  return spreadsheetId;
}

function cleanName_(value) {
  return String(value == null ? "" : value)
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function boolean_(value) {
  return value === true || String(value).toLowerCase() === "true";
}

function finiteNumber_(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER;
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
  const exactHeaders = headersMatch_(SPONSOR_HEADERS);
  const cleaned =
    cleanName_("  Community <b>Partner</b> ") === "Community Partner";
  const active = boolean_("TRUE") && !boolean_("false");
  if (!exactHeaders || !cleaned || !active) {
    throw new Error("Website sponsor tests failed.");
  }
  return { ok: true, passed: 3 };
}
