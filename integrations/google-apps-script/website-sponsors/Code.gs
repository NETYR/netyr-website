const PARTNER_DONATION_SHEET_NAME = "Donations";
const PARTNER_CONTACT_SHEET_NAME = "Master Contacts";
const DONOR_NAME_HEADER = "Donor Name";
const DONATION_AMOUNT_HEADER = "Donation Amount";
const CONTACT_ID_HEADER = "Contact ID";
const PUBLIC_DISPLAY_HEADER = "Public Display";
const OPTIONAL_PRIVACY_HEADERS = Object.freeze([
  "Anonymous",
  "Private",
  "Do Not Publish",
]);
const OPTIONAL_STATUS_HEADERS = Object.freeze([
  "Status",
  "Transaction Status",
  "Payment Status",
]);
const OPTIONAL_EXCLUSION_HEADERS = Object.freeze([
  "Deleted",
  "Refunded",
  "Reversed",
  "Test",
  "Test Record",
]);
const PARTNER_LEVELS = Object.freeze([
  "President’s Posse Sponsor",
  "Texas Pioneer Sponsor",
  "Lone Star Sponsor",
  "Piney Woods Sponsor",
]);
const PARTNER_CONFIG = Object.freeze({
  spreadsheetProperty: "SPREADSHEET_ID",
  cacheKey: "netyr-public-community-partners-v7",
  cacheSeconds: 60,
  donationHeaderRow: 9,
  contactHeaderRow: 1,
  maximumRows: 20000,
});

function doGet() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get(PARTNER_CONFIG.cacheKey);
    if (cached) return jsonText_(cached);

    const result = readPublicPartnersWithDiagnostics_();
    logPartnerDiagnostics_(result.diagnostics);
    const response = JSON.stringify({ ok: true, sponsors: result.sponsors });
    cache.put(PARTNER_CONFIG.cacheKey, response, PARTNER_CONFIG.cacheSeconds);
    return jsonText_(response);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "community_partners_feed",
        status: "SOURCE_FAILURE",
        message: cleanText_(error && error.message, 240),
      }),
    );
    return unavailableResponse_();
  }
}

function clearSponsorCache() {
  CacheService.getScriptCache().remove(PARTNER_CONFIG.cacheKey);
  return { ok: true };
}

function verifySponsorSource() {
  const spreadsheet = getSpreadsheet_();
  const donationSheet = getRequiredSheet_(
    spreadsheet,
    PARTNER_DONATION_SHEET_NAME,
  );
  const contactSheet = getRequiredSheet_(
    spreadsheet,
    PARTNER_CONTACT_SHEET_NAME,
  );
  const donationSource = verifyDonationSource_(donationSheet);
  const contactSource = verifyContactSource_(contactSheet);

  return {
    ok: true,
    donationSheetName: PARTNER_DONATION_SHEET_NAME,
    donationHeaderRow: PARTNER_CONFIG.donationHeaderRow,
    donorNameColumn: donationSource.donorNameColumn,
    donationAmountColumn: donationSource.donationAmountColumn,
    donationContactIdColumn: donationSource.contactIdColumn,
    contactSheetName: PARTNER_CONTACT_SHEET_NAME,
    contactHeaderRow: PARTNER_CONFIG.contactHeaderRow,
    contactIdColumn: contactSource.contactIdColumn,
    publicDisplayColumn: contactSource.publicDisplayColumn,
    message: "The Community Partners source is ready.",
  };
}

function readPublicPartners_() {
  return readPublicPartnersWithDiagnostics_().sponsors;
}

function readPublicPartnersWithDiagnostics_() {
  const spreadsheet = getSpreadsheet_();
  const donationSheet = getRequiredSheet_(
    spreadsheet,
    PARTNER_DONATION_SHEET_NAME,
  );
  const contactSheet = getRequiredSheet_(
    spreadsheet,
    PARTNER_CONTACT_SHEET_NAME,
  );
  const donationSource = verifyDonationSource_(donationSheet);
  const contactSource = verifyContactSource_(contactSheet);
  const publicDisplayLookup = readPublicDisplayLookup_(
    contactSheet,
    contactSource,
  );

  return aggregateCommunityPartnersWithDiagnostics_(
    readDonationRecords_(donationSheet, donationSource),
    publicDisplayLookup,
  );
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(getSpreadsheetId_());
}

function getRequiredSheet_(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error("Community Partners source is unavailable.");
  return sheet;
}

function readHeaders_(sheet, headerRow) {
  return sheet
    .getRange(headerRow, 1, 1, sheet.getLastColumn())
    .getDisplayValues()[0]
    .map(function (header) {
      return cleanText_(header, 120);
    });
}

function columnForHeader_(headers, header) {
  const index = headers.indexOf(header);
  return index >= 0 ? index + 1 : 0;
}

function columnsForHeaders_(headers, allowedHeaders) {
  return headers.reduce(function (columns, header, index) {
    if (allowedHeaders.indexOf(header) !== -1) columns.push(index + 1);
    return columns;
  }, []);
}

function verifyDonationSource_(sheet) {
  const headers = readHeaders_(sheet, PARTNER_CONFIG.donationHeaderRow);
  const donorNameColumn = columnForHeader_(headers, DONOR_NAME_HEADER);
  const donationAmountColumn = columnForHeader_(
    headers,
    DONATION_AMOUNT_HEADER,
  );
  const contactIdColumn = columnForHeader_(headers, CONTACT_ID_HEADER);

  if (!donorNameColumn || !donationAmountColumn) {
    throw new Error("Donation Transaction Ledger headers are unexpected.");
  }

  return {
    donorNameColumn: donorNameColumn,
    donationAmountColumn: donationAmountColumn,
    contactIdColumn: contactIdColumn,
    privacyColumns: columnsForHeaders_(headers, OPTIONAL_PRIVACY_HEADERS),
    statusColumns: columnsForHeaders_(headers, OPTIONAL_STATUS_HEADERS),
    exclusionColumns: columnsForHeaders_(headers, OPTIONAL_EXCLUSION_HEADERS),
  };
}

function verifyContactSource_(sheet) {
  const headers = readHeaders_(sheet, PARTNER_CONFIG.contactHeaderRow);
  const contactIdColumn = columnForHeader_(headers, CONTACT_ID_HEADER);
  const publicDisplayColumn = columnForHeader_(headers, PUBLIC_DISPLAY_HEADER);
  const firstNameColumn = columnForHeader_(headers, "First Name");
  const lastNameColumn = columnForHeader_(headers, "Last Name");

  if (
    !contactIdColumn ||
    !publicDisplayColumn ||
    !firstNameColumn ||
    !lastNameColumn
  ) {
    throw new Error("Master Contacts privacy headers are unavailable.");
  }

  return {
    contactIdColumn: contactIdColumn,
    publicDisplayColumn: publicDisplayColumn,
    firstNameColumn: firstNameColumn,
    lastNameColumn: lastNameColumn,
  };
}

function readColumn_(sheet, firstRow, rowCount, column) {
  if (!column) return [];
  return sheet.getRange(firstRow, column, rowCount, 1).getDisplayValues();
}

function readColumns_(sheet, firstRow, rowCount, columns) {
  return columns.map(function (column) {
    return readColumn_(sheet, firstRow, rowCount, column);
  });
}

function valuesAt_(columnValues, index) {
  return columnValues.map(function (values) {
    return values[index][0];
  });
}

function readDonationRecords_(sheet, source) {
  const firstDataRow = PARTNER_CONFIG.donationHeaderRow + 1;
  const lastRow = Math.min(sheet.getLastRow(), PARTNER_CONFIG.maximumRows);
  if (lastRow < firstDataRow) return [];

  const rowCount = lastRow - firstDataRow + 1;
  const names = readColumn_(
    sheet,
    firstDataRow,
    rowCount,
    source.donorNameColumn,
  );
  const amounts = readColumn_(
    sheet,
    firstDataRow,
    rowCount,
    source.donationAmountColumn,
  );
  const contactIds = readColumn_(
    sheet,
    firstDataRow,
    rowCount,
    source.contactIdColumn,
  );
  const privacyValues = readColumns_(
    sheet,
    firstDataRow,
    rowCount,
    source.privacyColumns,
  );
  const statusValues = readColumns_(
    sheet,
    firstDataRow,
    rowCount,
    source.statusColumns,
  );
  const exclusionValues = readColumns_(
    sheet,
    firstDataRow,
    rowCount,
    source.exclusionColumns,
  );

  return names.map(function (nameRow, index) {
    return {
      amount: amounts[index][0],
      contactId: source.contactIdColumn ? contactIds[index][0] : "",
      donorName: nameRow[0],
      exclusionValues: valuesAt_(exclusionValues, index),
      privacyValues: valuesAt_(privacyValues, index),
      statusValues: valuesAt_(statusValues, index),
    };
  });
}

function readPublicDisplayLookup_(sheet, source) {
  const firstDataRow = PARTNER_CONFIG.contactHeaderRow + 1;
  const lastRow = Math.min(sheet.getLastRow(), PARTNER_CONFIG.maximumRows);
  const lookup = { byId: {}, byName: {}, required: true };
  if (lastRow < firstDataRow) return lookup;

  const rowCount = lastRow - firstDataRow + 1;
  const contactIds = readColumn_(
    sheet,
    firstDataRow,
    rowCount,
    source.contactIdColumn,
  );
  const firstNames = readColumn_(
    sheet,
    firstDataRow,
    rowCount,
    source.firstNameColumn,
  );
  const lastNames = readColumn_(
    sheet,
    firstDataRow,
    rowCount,
    source.lastNameColumn,
  );
  const publicValues = readColumn_(
    sheet,
    firstDataRow,
    rowCount,
    source.publicDisplayColumn,
  );

  contactIds.forEach(function (contactIdRow, index) {
    const contactId = idKey_(contactIdRow[0]);
    const publicDisplay = isPublicDisplayValue_(publicValues[index][0]);
    const displayName = cleanText_(
      firstNames[index][0] + " " + lastNames[index][0],
      180,
    );
    const displayNameKey = nameKey_(displayName);

    if (contactId) lookup.byId[contactId] = publicDisplay;
    if (displayNameKey) lookup.byName[displayNameKey] = publicDisplay;
  });

  return lookup;
}

function aggregateCommunityPartners_(records, publicDisplayLookup) {
  return aggregateCommunityPartnersWithDiagnostics_(
    records,
    publicDisplayLookup,
  ).sponsors;
}

function aggregateCommunityPartnersWithDiagnostics_(
  records,
  publicDisplayLookup,
) {
  const lookup = publicDisplayLookup || {
    byId: {},
    byName: {},
    required: false,
  };
  const canonicalIdByName = {};
  const totals = {};

  records.forEach(function (record) {
    const donorNameKey = nameKey_(record && record.donorName);
    const contactId = idKey_(record && record.contactId);
    if (donorNameKey && contactId) canonicalIdByName[donorNameKey] = contactId;
  });

  records.forEach(function (record) {
    const donorName = cleanText_(record && record.donorName, 180);
    const donorNameKey = nameKey_(donorName);
    const contactId =
      idKey_(record && record.contactId) ||
      canonicalIdByName[donorNameKey] ||
      "";
    const key = contactId ? "id:" + contactId : "name:" + donorNameKey;
    const amountCents = amountToCents_(record && record.amount);

    if (!donorNameKey || amountCents <= 0 || isExcludedTransaction_(record)) {
      return;
    }

    if (!totals[key]) {
      totals[key] = {
        name: donorName,
        cents: 0,
        publicDisplay: isPublicDonor_(contactId, donorNameKey, lookup),
      };
    }
    totals[key].cents += amountCents;
  });

  const qualifying = Object.keys(totals)
    .map(function (key) {
      const donor = totals[key];
      const level = levelForCents_(donor.cents);
      return level
        ? {
            name: donor.name,
            level: level,
            publicDisplay: donor.publicDisplay,
          }
        : null;
    })
    .filter(Boolean);
  const sponsors = qualifying
    .filter(function (donor) {
      return donor.publicDisplay;
    })
    .map(function (donor) {
      return { name: donor.name, level: donor.level };
    })
    .sort(function (left, right) {
      return (
        levelOrder_(left.level) - levelOrder_(right.level) ||
        left.name.localeCompare(right.name, undefined, {
          sensitivity: "base",
        })
      );
    });

  return {
    sponsors: sponsors,
    diagnostics: {
      qualifyingDonorCount: qualifying.length,
      privateQualifyingDonorCount: qualifying.filter(function (donor) {
        return !donor.publicDisplay;
      }).length,
      publicSponsorCount: sponsors.length,
    },
  };
}

function logPartnerDiagnostics_(diagnostics) {
  const status =
    diagnostics.qualifyingDonorCount === 0
      ? "NO_QUALIFYING_DONATIONS"
      : diagnostics.publicSponsorCount === 0
        ? "ALL_QUALIFYING_DONORS_PRIVATE"
        : "PUBLIC_SPONSORS_READY";
  console.info(
    JSON.stringify({
      event: "community_partners_feed",
      status: status,
      qualifyingDonorCount: diagnostics.qualifyingDonorCount,
      privateQualifyingDonorCount: diagnostics.privateQualifyingDonorCount,
      publicSponsorCount: diagnostics.publicSponsorCount,
    }),
  );
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

function levelForCents_(amountCents) {
  if (amountCents >= 75000) return "President’s Posse Sponsor";
  if (amountCents >= 50000) return "Texas Pioneer Sponsor";
  if (amountCents >= 20000) return "Lone Star Sponsor";
  if (amountCents >= 5000) return "Piney Woods Sponsor";
  return "";
}

function levelOrder_(level) {
  const index = PARTNER_LEVELS.indexOf(level);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

function nameKey_(value) {
  return cleanText_(value, 180).toLocaleLowerCase();
}

function idKey_(value) {
  return cleanText_(value, 120).toLocaleLowerCase();
}

function isPublicDisplayValue_(value) {
  if (value === true) return true;
  const candidate = cleanText_(value, 40).toLocaleLowerCase();
  return (
    candidate === "true" ||
    candidate === "yes" ||
    candidate === "y" ||
    candidate === "1" ||
    candidate === "public" ||
    candidate === "display" ||
    candidate === "publish" ||
    candidate === "approved"
  );
}

function isPublicDonor_(contactId, donorNameKey, lookup) {
  if (!lookup.required) return true;
  if (
    contactId &&
    Object.prototype.hasOwnProperty.call(lookup.byId, contactId)
  ) {
    return lookup.byId[contactId] === true;
  }
  if (
    donorNameKey &&
    Object.prototype.hasOwnProperty.call(lookup.byName, donorNameKey)
  ) {
    return lookup.byName[donorNameKey] === true;
  }
  return false;
}

function isTruthyFlag_(value) {
  if (value === true) return true;
  const candidate = cleanText_(value, 40).toLocaleLowerCase();
  return (
    candidate === "true" ||
    candidate === "yes" ||
    candidate === "y" ||
    candidate === "1"
  );
}

function isPrivateValue_(value) {
  if (isTruthyFlag_(value)) return true;
  const candidate = cleanText_(value, 40).toLocaleLowerCase();
  return (
    candidate === "anonymous" ||
    candidate === "private" ||
    candidate === "do not publish"
  );
}

function isExcludedStatus_(value) {
  const candidate = cleanText_(value, 80).toLocaleLowerCase();
  return /(?:refund|revers|delete|test|void|cancel|failed|chargeback)/.test(
    candidate,
  );
}

function isExcludedTransaction_(record) {
  return (
    (record.privacyValues || []).some(isPrivateValue_) ||
    (record.statusValues || []).some(isExcludedStatus_) ||
    (record.exclusionValues || []).some(isTruthyFlag_)
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
      message: "Community partner information is temporarily unavailable.",
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
  const record = function (donorName, amount, options) {
    const source = options || {};
    return {
      donorName: donorName,
      amount: amount,
      contactId: source.contactId || "",
      exclusionValues: source.exclusionValues || [],
      privacyValues: source.privacyValues || [],
      statusValues: source.statusValues || [],
    };
  };
  const publicLookup = function (entries) {
    const lookup = { byId: {}, byName: {}, required: true };
    entries.forEach(function (entry) {
      if (entry.contactId) {
        lookup.byId[idKey_(entry.contactId)] = entry.publicDisplay;
      }
      if (entry.name) {
        lookup.byName[nameKey_(entry.name)] = entry.publicDisplay;
      }
    });
    return lookup;
  };
  const partners = function (records, lookup) {
    return aggregateCommunityPartners_(records, lookup);
  };

  test("a total of 49.99 is omitted", function () {
    if (partners([record("Under Minimum", 49.99)]).length) {
      throw new Error("Under-minimum donor was published.");
    }
  });

  test("a total of 50 is Piney Woods", function () {
    const result = partners([record("Piney Donor", 50)]);
    if (result[0].level !== "Piney Woods Sponsor") {
      throw new Error("Piney Woods threshold failed.");
    }
  });

  test("a total of 200 is Lone Star", function () {
    const result = partners([record("Lone Star Donor", "$200.00")]);
    if (result[0].level !== "Lone Star Sponsor") {
      throw new Error("Lone Star threshold failed.");
    }
  });

  test("a total of 500 is Texas Pioneer", function () {
    const result = partners([record("Pioneer Donor", 500)]);
    if (result[0].level !== "Texas Pioneer Sponsor") {
      throw new Error("Texas Pioneer threshold failed.");
    }
  });

  test("a total of 750 is President's Posse", function () {
    const result = partners([record("Posse Donor", 750)]);
    if (result[0].level !== "President’s Posse Sponsor") {
      throw new Error("President's Posse threshold failed.");
    }
  });

  test("multiple donations are cumulative", function () {
    const result = partners([
      record("Cumulative Donor", 100),
      record("cumulative donor", 100),
    ]);
    if (result.length !== 1 || result[0].level !== "Lone Star Sponsor") {
      throw new Error("Cumulative aggregation failed.");
    }
  });

  test("crossing a threshold changes the level", function () {
    const before = partners([record("Moving Donor", 499.99)]);
    const after = partners([
      record("Moving Donor", 499.99),
      record("moving donor", 0.01),
    ]);
    if (
      before[0].level !== "Lone Star Sponsor" ||
      after[0].level !== "Texas Pioneer Sponsor"
    ) {
      throw new Error("Level reassignment failed.");
    }
  });

  test("stable contact IDs combine renamed records", function () {
    const result = partners([
      record("Original Name", 100, { contactId: "CONTACT-001" }),
      record("Updated Name", 100, { contactId: "contact-001" }),
    ]);
    if (result.length !== 1 || result[0].level !== "Lone Star Sponsor") {
      throw new Error("Contact ID aggregation failed.");
    }
  });

  test("name fallback is trimmed and case-insensitive", function () {
    const result = partners([
      record("  One   Public Name ", 25),
      record("one public name", 25),
    ]);
    if (
      result.length !== 1 ||
      result[0].name !== "One Public Name" ||
      result[0].level !== "Piney Woods Sponsor"
    ) {
      throw new Error("Name fallback failed.");
    }
  });

  test("donors appear only once", function () {
    const result = partners([
      record("Unique Donor", 25, { contactId: "CONTACT-002" }),
      record("unique donor", 25),
    ]);
    if (result.length !== 1) throw new Error("Duplicate donor was published.");
  });

  test("names are alphabetized inside a level", function () {
    const result = partners([
      record("Zulu Donor", 50),
      record("Alpha Donor", 50),
    ]);
    if (result[0].name !== "Alpha Donor" || result[1].name !== "Zulu Donor") {
      throw new Error("Alphabetical sorting failed.");
    }
  });

  test("blank invalid and nonpositive rows are omitted", function () {
    const result = partners([
      record("", 500),
      record("Blank Amount", ""),
      record("Invalid Amount", "not a number"),
      record("Zero Amount", 0),
      record("Negative Amount", -50),
    ]);
    if (result.length) throw new Error("Invalid rows were published.");
  });

  test("formatted currency is parsed", function () {
    const result = partners([record("Currency Donor", "$50.00")]);
    if (result[0].level !== "Piney Woods Sponsor") {
      throw new Error("Formatted currency parsing failed.");
    }
  });

  test("real status and exclusion fields are honored", function () {
    const result = partners([
      record("Refunded Donor", 750, { statusValues: ["Refunded"] }),
      record("Reversed Donor", 750, { statusValues: ["Reversed"] }),
      record("Test Donor", 750, { exclusionValues: ["Yes"] }),
    ]);
    if (result.length) throw new Error("Excluded transactions were published.");
  });

  test("transaction privacy fields are honored", function () {
    const result = partners([
      record("Anonymous Donor", 750, {
        privacyValues: ["Anonymous"],
      }),
      record("Private Donor", 750, { privacyValues: ["Yes"] }),
    ]);
    if (result.length) throw new Error("Private transactions were published.");
  });

  test("Master Contacts Public Display is enforced", function () {
    const lookup = publicLookup([
      { contactId: "PUBLIC-1", name: "Public Donor", publicDisplay: true },
      { contactId: "PRIVATE-1", name: "Private Donor", publicDisplay: false },
    ]);
    const result = partners(
      [
        record("Public Donor", 50, { contactId: "PUBLIC-1" }),
        record("Private Donor", 750, { contactId: "PRIVATE-1" }),
        record("Unknown Donor", 750, { contactId: "UNKNOWN-1" }),
      ],
      lookup,
    );
    if (result.length !== 1 || result[0].name !== "Public Donor") {
      throw new Error("Public Display privacy enforcement failed.");
    }
  });

  test("checkbox and normalized legacy Public Display values are supported", function () {
    if (
      isPublicDisplayValue_("") ||
      isPublicDisplayValue_(false) ||
      !isPublicDisplayValue_(true) ||
      !isPublicDisplayValue_("approved")
    ) {
      throw new Error("Public Display value normalization failed.");
    }
  });

  test("private-only and no-qualifying diagnostics remain distinct", function () {
    const privateLookup = publicLookup([
      {
        contactId: "PRIVATE-DIAGNOSTIC",
        name: "Private Diagnostic",
        publicDisplay: false,
      },
    ]);
    const privateOnly = aggregateCommunityPartnersWithDiagnostics_(
      [
        record("Private Diagnostic", 200, {
          contactId: "PRIVATE-DIAGNOSTIC",
        }),
      ],
      privateLookup,
    );
    const noQualifying = aggregateCommunityPartnersWithDiagnostics_([
      record("Under Minimum Diagnostic", 49.99),
    ]);
    if (
      privateOnly.diagnostics.qualifyingDonorCount !== 1 ||
      privateOnly.diagnostics.publicSponsorCount !== 0 ||
      noQualifying.diagnostics.qualifyingDonorCount !== 0
    ) {
      throw new Error("Internal empty-state diagnostics failed.");
    }
  });

  test("all four levels sort from highest to lowest", function () {
    const result = partners([
      record("Piney", 50),
      record("Lone Star", 200),
      record("Pioneer", 500),
      record("Posse", 750),
    ]);
    if (
      result
        .map(function (partner) {
          return partner.level;
        })
        .join("|") !== PARTNER_LEVELS.join("|")
    ) {
      throw new Error("Level order failed.");
    }
  });

  test("the public contract contains name and level only", function () {
    const result = partners([record("Public Contract Donor", 750)]);
    if (Object.keys(result[0]).sort().join(",") !== "level,name") {
      throw new Error("The public contract exposed unnecessary fields.");
    }
  });

  return { ok: true, passed: results.length, tests: results };
}
