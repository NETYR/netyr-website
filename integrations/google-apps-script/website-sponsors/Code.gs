const PARTNER_DONATION_SHEET_NAME = "Donations";
const DONOR_NAME_HEADER = "Donor Name";
const DONATION_AMOUNT_HEADER = "Donation Amount";
const OPTIONAL_PRIVACY_HEADERS = Object.freeze([
  "Anonymous",
  "Private",
  "Do Not Publish",
]);
const PARTNER_TIERS = Object.freeze(["Patron", "Sustaining", "Supporting"]);
const PARTNER_CONFIG = Object.freeze({
  spreadsheetProperty: "SPREADSHEET_ID",
  cacheKey: "netyr-public-community-partners-v5",
  cacheSeconds: 300,
  donationHeaderRow: 9,
  donationMaximumRows: 20000,
});

function doGet() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get(PARTNER_CONFIG.cacheKey);
    if (cached) return jsonText_(cached);

    const partners = readPublicPartners_();
    const response = JSON.stringify({ ok: true, sponsors: partners });
    cache.put(PARTNER_CONFIG.cacheKey, response, PARTNER_CONFIG.cacheSeconds);
    return jsonText_(response);
  } catch (_error) {
    console.error("Community Partners feed failed.");
    return unavailableResponse_();
  }
}

function clearSponsorCache() {
  CacheService.getScriptCache().remove(PARTNER_CONFIG.cacheKey);
  return { ok: true };
}

function verifySponsorSource() {
  const sheet = getDonationSheet_();
  const source = verifyDonationSource_(sheet);
  return {
    ok: true,
    sheetName: PARTNER_DONATION_SHEET_NAME,
    headerRow: PARTNER_CONFIG.donationHeaderRow,
    donorNameColumn: source.donorNameColumn,
    donationAmountColumn: source.donationAmountColumn,
    privacyHeader: source.privacyHeader,
    message: "The Donation Transaction Ledger is ready.",
  };
}

function readPublicPartners_() {
  const sheet = getDonationSheet_();
  const source = verifyDonationSource_(sheet);
  return aggregateCommunityPartners_(
    readDonationRecords_(sheet, source.privacyColumn),
  );
}

function getDonationSheet_() {
  const spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  const sheet = spreadsheet.getSheetByName(PARTNER_DONATION_SHEET_NAME);
  if (!sheet) {
    throw new Error("Community Partners source is unavailable.");
  }
  return sheet;
}

function verifyDonationSource_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < 5) {
    throw new Error("Donation Transaction Ledger headers are incomplete.");
  }

  const headers = sheet
    .getRange(PARTNER_CONFIG.donationHeaderRow, 1, 1, lastColumn)
    .getDisplayValues()[0]
    .map(function (header) {
      return cleanText_(header, 120);
    });

  if (
    headers[1] !== DONOR_NAME_HEADER ||
    headers[4] !== DONATION_AMOUNT_HEADER
  ) {
    throw new Error("Donation Transaction Ledger headers are unexpected.");
  }

  const privacyIndex = headers.findIndex(function (header) {
    return OPTIONAL_PRIVACY_HEADERS.indexOf(header) !== -1;
  });

  return {
    donorNameColumn: 2,
    donationAmountColumn: 5,
    privacyColumn: privacyIndex >= 0 ? privacyIndex + 1 : 0,
    privacyHeader: privacyIndex >= 0 ? headers[privacyIndex] : "",
  };
}

function readDonationRecords_(sheet, privacyColumn) {
  const firstDataRow = PARTNER_CONFIG.donationHeaderRow + 1;
  const lastRow = Math.min(
    sheet.getLastRow(),
    PARTNER_CONFIG.donationMaximumRows,
  );
  if (lastRow < firstDataRow) return [];

  const rowCount = lastRow - firstDataRow + 1;
  const names = sheet.getRange(firstDataRow, 2, rowCount, 1).getDisplayValues();
  const amounts = sheet
    .getRange(firstDataRow, 5, rowCount, 1)
    .getDisplayValues();
  const privacyValues = privacyColumn
    ? sheet
        .getRange(firstDataRow, privacyColumn, rowCount, 1)
        .getDisplayValues()
    : [];

  return names.map(function (nameRow, index) {
    return {
      amount: amounts[index][0],
      donorName: nameRow[0],
      privateValue: privacyColumn ? privacyValues[index][0] : "",
    };
  });
}

function aggregateCommunityPartners_(records) {
  const totalsByName = {};

  records.forEach(function (record) {
    const donorName = cleanText_(record && record.donorName, 180);
    const amountCents = amountToCents_(record && record.amount);
    const key = nameKey_(donorName);

    if (
      !key ||
      amountCents <= 0 ||
      isPrivateValue_(record && record.privateValue)
    ) {
      return;
    }

    if (!totalsByName[key]) {
      totalsByName[key] = { name: donorName, cents: 0 };
    }
    totalsByName[key].cents += amountCents;
  });

  return Object.keys(totalsByName)
    .map(function (key) {
      const donor = totalsByName[key];
      const tier = tierForCents_(donor.cents);
      return tier ? { name: donor.name, tier: tier } : null;
    })
    .filter(Boolean)
    .sort(function (left, right) {
      return (
        tierOrder_(left.tier) - tierOrder_(right.tier) ||
        left.name.localeCompare(right.name, undefined, {
          sensitivity: "base",
        })
      );
    });
}

function amountToCents_(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value * 100);
  }

  const candidate = cleanText_(value, 80);
  if (!candidate) return 0;
  const parentheticalNegative = /^\(.*\)$/.test(candidate);
  const parsed = Number(candidate.replace(/[,$()\s]/g, ""));
  if (!Number.isFinite(parsed)) return 0;
  return Math.round((parentheticalNegative ? -parsed : parsed) * 100);
}

function tierForCents_(amountCents) {
  if (amountCents >= 50000) return "Patron";
  if (amountCents >= 25000) return "Sustaining";
  if (amountCents >= 2000) return "Supporting";
  return "";
}

function tierOrder_(tier) {
  const index = PARTNER_TIERS.indexOf(tier);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

function nameKey_(value) {
  return cleanText_(value, 180).toLocaleLowerCase();
}

function isPrivateValue_(value) {
  if (value === true) return true;
  const candidate = cleanText_(value, 40).toLocaleLowerCase();
  return (
    candidate === "true" ||
    candidate === "yes" ||
    candidate === "y" ||
    candidate === "anonymous" ||
    candidate === "private" ||
    candidate === "do not publish"
  );
}

function getSpreadsheetId_() {
  const spreadsheetId = String(
    PropertiesService.getScriptProperties().getProperty(
      PARTNER_CONFIG.spreadsheetProperty,
    ) || "",
  ).trim();
  if (!spreadsheetId) {
    throw new Error("Community Partners source is unavailable.");
  }
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

function unavailableResponse_() {
  return jsonText_(
    JSON.stringify({
      ok: false,
      message: "Community partner recognition is temporarily unavailable.",
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
  const record = function (donorName, amount, privateValue) {
    return {
      donorName: donorName,
      amount: amount,
      privateValue: privateValue || "",
    };
  };
  const partners = function (records) {
    return aggregateCommunityPartners_(records);
  };

  test("one $20 donation is Supporting", function () {
    const result = partners([record("Twenty Donor", 20)]);
    if (result.length !== 1 || result[0].tier !== "Supporting") {
      throw new Error("Supporting threshold failed.");
    }
  });

  test("multiple donations totaling $250 are Sustaining", function () {
    const result = partners([
      record("Two Donation Donor", 125),
      record("two donation donor", 125),
    ]);
    if (result.length !== 1 || result[0].tier !== "Sustaining") {
      throw new Error("Sustaining aggregation failed.");
    }
  });

  test("multiple donations totaling $500 are Patron", function () {
    const result = partners([
      record("Five Donation Donor", 100),
      record("Five Donation Donor", 100),
      record("Five Donation Donor", 100),
      record("Five Donation Donor", 100),
      record("Five Donation Donor", 100),
    ]);
    if (result.length !== 1 || result[0].tier !== "Patron") {
      throw new Error("Patron aggregation failed.");
    }
  });

  test("formatted currency is parsed", function () {
    const result = partners([record("Currency Donor", "$200.00")]);
    if (result.length !== 1 || result[0].tier !== "Supporting") {
      throw new Error("Formatted currency parsing failed.");
    }
  });

  test("blank names and invalid amounts are omitted", function () {
    const result = partners([
      record("", 500),
      record("Blank Amount", ""),
      record("Invalid Amount", "not a number"),
    ]);
    if (result.length) throw new Error("Invalid rows were published.");
  });

  test("nonpositive donations are omitted", function () {
    const result = partners([
      record("Zero Donor", 0),
      record("Negative Donor", -500),
    ]);
    if (result.length) throw new Error("Nonpositive rows were published.");
  });

  test("a total below $20 is omitted", function () {
    const result = partners([record("Under Threshold", 19.99)]);
    if (result.length) throw new Error("Under-threshold donor was published.");
  });

  test("optional privacy values are honored", function () {
    const result = partners([
      record("Anonymous Donor", 500, "Anonymous"),
      record("Private Donor", 500, "Yes"),
      record("Do Not Publish Donor", 500, "Do Not Publish"),
    ]);
    if (result.length) throw new Error("Private donors were published.");
  });

  test("names are normalized and donors are listed once", function () {
    const result = partners([
      record("  One   Public Name ", 100),
      record("one public name", 100),
      record("ONE PUBLIC NAME", 100),
    ]);
    if (
      result.length !== 1 ||
      result[0].name !== "One Public Name" ||
      result[0].tier !== "Sustaining"
    ) {
      throw new Error("Name normalization failed.");
    }
  });

  test("names are alphabetized inside a tier", function () {
    const result = partners([
      record("Zulu Donor", 20),
      record("Alpha Donor", 20),
    ]);
    if (
      result.length !== 2 ||
      result[0].name !== "Alpha Donor" ||
      result[1].name !== "Zulu Donor"
    ) {
      throw new Error("Alphabetical sorting failed.");
    }
  });

  test("changed totals move donors between tiers", function () {
    const supporting = partners([record("Changed Donor", 249.99)]);
    const sustaining = partners([record("Changed Donor", 250)]);
    if (
      supporting[0].tier !== "Supporting" ||
      sustaining[0].tier !== "Sustaining"
    ) {
      throw new Error("Tier reassignment failed.");
    }
  });

  test("the public contract contains names and tiers only", function () {
    const result = partners([record("Public Contract Donor", 500)]);
    if (Object.keys(result[0]).sort().join(",") !== "name,tier") {
      throw new Error("The public contract exposed unnecessary fields.");
    }
  });

  return { ok: true, passed: results.length, tests: results };
}
