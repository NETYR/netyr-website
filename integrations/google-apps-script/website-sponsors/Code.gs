const SPONSOR_CONTACT_SHEET_NAME = "Master Contacts";
const SPONSOR_DONATION_SHEET_NAME = "Donations";
const CONTACT_IDENTITY_HEADERS = Object.freeze([
  "First Name",
  "Last Name",
  "Organization",
]);
const CONTACT_ID_HEADER = "Contact ID";
const PUBLIC_DISPLAY_HEADER = "Public Display";
const DONATION_HEADERS = Object.freeze([
  "Donation Date",
  "Donor Name",
  "Organization",
  "Donation Reason",
  "Donation Amount",
  "Notes",
  "Contact ID",
  "Donation ID",
  "Date Entered",
]);
const SPONSOR_TIERS = Object.freeze(["Patron", "Sustaining", "Supporting"]);
const SPONSOR_CONFIG = Object.freeze({
  spreadsheetProperty: "SPREADSHEET_ID",
  cacheSeconds: 300,
  contactMaximumRows: 5000,
  donationHeaderRow: 9,
  donationMaximumRows: 20000,
});

function doGet() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get("netyr-public-sponsors-v3");
    if (cached) return jsonText_(cached);

    const sponsors = readPublicSponsors_();
    const response = JSON.stringify({ ok: true, sponsors: sponsors });
    cache.put(
      "netyr-public-sponsors-v3",
      response,
      SPONSOR_CONFIG.cacheSeconds,
    );
    return jsonText_(response);
  } catch (_error) {
    return unavailableResponse_();
  }
}

function clearSponsorCache() {
  CacheService.getScriptCache().remove("netyr-public-sponsors-v3");
  return { ok: true };
}

function verifySponsorSource() {
  const source = getSponsorSource_();
  verifyContactHeaders_(source.contacts);
  verifyDonationHeaders_(source.donations);
  return {
    ok: true,
    message:
      "Master Contacts and Donations are ready for cumulative public recognition.",
  };
}

function readPublicSponsors_() {
  const source = getSponsorSource_();
  verifyContactHeaders_(source.contacts);
  verifyDonationHeaders_(source.donations);

  return aggregateCommunityPartners_(
    readContactRecords_(source.contacts),
    readDonationRecords_(source.donations),
  );
}

function readContactRecords_(sheet) {
  const lastRow = Math.min(
    sheet.getLastRow(),
    SPONSOR_CONFIG.contactMaximumRows,
  );
  if (lastRow < 2) return [];

  const rowCount = lastRow - 1;
  const identityRange = sheet.getRange(2, 1, rowCount, 3);
  const contactIdRange = sheet.getRange(2, 9, rowCount, 1);
  const publicDisplayRange = sheet.getRange(2, 13, rowCount, 1);
  const identityValues = identityRange.getDisplayValues();
  const identityFormulas = identityRange.getFormulas();
  const contactIds = contactIdRange.getDisplayValues();
  const contactIdFormulas = contactIdRange.getFormulas();
  const publicDisplayValues = publicDisplayRange.getValues();
  const publicDisplayFormulas = publicDisplayRange.getFormulas();

  return identityValues.map(function (identityRow, index) {
    return {
      contactId: contactIds[index][0],
      hasFormula:
        identityFormulas[index].some(Boolean) ||
        Boolean(contactIdFormulas[index][0]) ||
        Boolean(publicDisplayFormulas[index][0]),
      identityRow: identityRow,
      publicDisplay: publicDisplayValues[index][0],
    };
  });
}

function readDonationRecords_(sheet) {
  const firstDataRow = SPONSOR_CONFIG.donationHeaderRow + 1;
  const lastRow = Math.min(
    sheet.getLastRow(),
    SPONSOR_CONFIG.donationMaximumRows,
  );
  if (lastRow < firstDataRow) return [];

  const rowCount = lastRow - firstDataRow + 1;

  // Read only Donation Reason through Donation ID (D:H). Names, dates, and
  // dashboard cells are not needed for cumulative classification.
  const donationRange = sheet.getRange(firstDataRow, 4, rowCount, 5);
  const values = donationRange.getValues();
  const formulas = donationRange.getFormulas();

  return values.map(function (row, index) {
    return {
      hasFormula: formulas[index].some(Boolean),
      row: row,
    };
  });
}

function aggregateCommunityPartners_(contactRecords, donationRecords) {
  const contactsById = {};
  const cumulativeCentsById = {};
  const seenDonationIds = {};

  contactRecords.forEach(function (record) {
    const contact = contactFromRecord_(record);
    if (!contact || contactsById[contact.id]) return;
    contactsById[contact.id] = contact;
  });

  donationRecords.forEach(function (record) {
    const donation = donationFromRecord_(record);
    if (!donation) return;

    if (donation.donationId) {
      if (seenDonationIds[donation.donationId]) return;
      seenDonationIds[donation.donationId] = true;
    }

    cumulativeCentsById[donation.contactId] =
      (cumulativeCentsById[donation.contactId] || 0) + donation.amountCents;
  });

  const partners = [];
  Object.keys(cumulativeCentsById).forEach(function (contactId) {
    const contact = contactsById[contactId];
    if (!contact) return;

    const tier = tierForCents_(cumulativeCentsById[contactId]);
    if (!tier) return;
    partners.push({ name: contact.name, tier: tier });
  });

  const unique = [];
  const seenNames = {};
  partners
    .sort(function (left, right) {
      return (
        tierOrder_(left.tier) - tierOrder_(right.tier) ||
        left.name.localeCompare(right.name)
      );
    })
    .forEach(function (partner) {
      const key = partner.name.toLowerCase();
      if (seenNames[key]) return;
      seenNames[key] = true;
      unique.push(partner);
    });

  return unique;
}

function contactFromRecord_(record) {
  if (!record || record.hasFormula) return null;

  const identityRow = record.identityRow || [];
  const firstName = cleanText_(identityRow[0], 80);
  const lastName = cleanText_(identityRow[1], 80);
  const organization = cleanText_(identityRow[2], 180);
  const personName = cleanText_([firstName, lastName].join(" "), 180);
  const name = organization || personName;
  const id = idKey_(record.contactId);

  if (
    !id ||
    !name ||
    !publicDisplay_(record.publicDisplay) ||
    anonymousDisplayName_(name)
  ) {
    return null;
  }

  return { id: id, name: name };
}

function donationFromRecord_(record) {
  if (!record || record.hasFormula) return null;

  const row = record.row || [];
  const reason = cleanText_(row[0], 200);
  const amountCents = amountToCents_(row[1]);
  const notes = cleanText_(row[2], 500);
  const contactId = idKey_(row[3]);
  const donationId = idKey_(row[4]);
  const controlText = [reason, notes, donationId].join(" ").toLowerCase();

  if (!contactId || !amountCents) return null;
  if (/\b(test|dummy|sample)\b/i.test(controlText)) return null;
  if (/\b(deleted|void(?:ed)?|cancel(?:led|ed))\b/i.test(controlText))
    return null;

  // A positive row explicitly marked refunded or reversed is excluded. A
  // negative refund/reversal remains a signed adjustment so it can cancel the
  // original contribution in the cumulative total.
  if (
    amountCents > 0 &&
    /\b(refund(?:ed)?|revers(?:ed|al))\b/i.test(controlText)
  ) {
    return null;
  }

  return {
    amountCents: amountCents,
    contactId: contactId,
    donationId: donationId,
  };
}

function getSponsorSource_() {
  const spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  const contacts = spreadsheet.getSheetByName(SPONSOR_CONTACT_SHEET_NAME);
  const donations = spreadsheet.getSheetByName(SPONSOR_DONATION_SHEET_NAME);
  if (!contacts || !donations) {
    throw new Error("Community partner source is unavailable.");
  }
  return { contacts: contacts, donations: donations };
}

function verifyContactHeaders_(sheet) {
  const identity = sheet
    .getRange(1, 1, 1, CONTACT_IDENTITY_HEADERS.length)
    .getDisplayValues()[0];
  const contactId = sheet.getRange(1, 9).getDisplayValue();
  const publicDisplay = sheet.getRange(1, 13).getDisplayValue();

  if (
    !headersMatch_(identity, CONTACT_IDENTITY_HEADERS) ||
    String(contactId || "").trim() !== CONTACT_ID_HEADER ||
    String(publicDisplay || "").trim() !== PUBLIC_DISPLAY_HEADER
  ) {
    throw new Error(
      "Master Contacts has unexpected public-recognition headers.",
    );
  }
}

function verifyDonationHeaders_(sheet) {
  const headers = sheet
    .getRange(SPONSOR_CONFIG.donationHeaderRow, 1, 1, DONATION_HEADERS.length)
    .getDisplayValues()[0];
  if (!headersMatch_(headers, DONATION_HEADERS)) {
    throw new Error("Donations has unexpected transaction headers.");
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
  if (!spreadsheetId)
    throw new Error("Community partner source is unavailable.");
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

function idKey_(value) {
  return cleanText_(value, 180).toLowerCase();
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

function anonymousDisplayName_(value) {
  const candidate = cleanText_(value, 180)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return /^anonymous(?: donor| supporter| member)?$/.test(candidate);
}

function amountToCents_(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value * 100);
  }

  const candidate = cleanText_(value, 80);
  if (!candidate) return 0;
  const isParentheticalNegative = /^\(.*\)$/.test(candidate);
  const parsed = Number(candidate.replace(/[,$()\s]/g, ""));
  if (!Number.isFinite(parsed)) return 0;
  return Math.round((isParentheticalNegative ? -parsed : parsed) * 100);
}

function tierForCents_(amountCents) {
  if (amountCents >= 50000) return "Patron";
  if (amountCents >= 25000) return "Sustaining";
  if (amountCents >= 2000) return "Supporting";
  return "";
}

function tierOrder_(tier) {
  const index = SPONSOR_TIERS.indexOf(tier);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
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
  const contact = function (id, name, publicDisplay) {
    return {
      contactId: id,
      hasFormula: false,
      identityRow: ["", "", name],
      publicDisplay: publicDisplay === undefined ? true : publicDisplay,
    };
  };
  const donation = function (contactId, amount, donationId, reason, notes) {
    return {
      hasFormula: false,
      row: [reason || "", amount, notes || "", contactId, donationId || ""],
    };
  };
  const partners = function (contacts, donations) {
    return aggregateCommunityPartners_(contacts, donations);
  };

  test("one $20 donation is Supporting", function () {
    const result = partners(
      [contact("supporting", "Twenty Donor")],
      [donation("supporting", 20, "d-20")],
    );
    if (result.length !== 1 || result[0].tier !== "Supporting") {
      throw new Error("Supporting threshold failed.");
    }
  });

  test("multiple donations totaling $250 are Sustaining", function () {
    const result = partners(
      [contact("sustaining", "Two Donation Donor")],
      [
        donation("sustaining", 125, "d-125-a"),
        donation("sustaining", 125, "d-125-b"),
      ],
    );
    if (result.length !== 1 || result[0].tier !== "Sustaining") {
      throw new Error("Sustaining aggregation failed.");
    }
  });

  test("multiple donations totaling $500 are Patron", function () {
    const donations = [1, 2, 3, 4, 5].map(function (value) {
      return donation("patron", 100, "d-100-" + value);
    });
    const result = partners(
      [contact("patron", "Five Donation Donor")],
      donations,
    );
    if (result.length !== 1 || result[0].tier !== "Patron") {
      throw new Error("Patron aggregation failed.");
    }
  });

  test("a total below $20 is omitted", function () {
    const result = partners(
      [contact("under", "Under Threshold")],
      [donation("under", 15, "d-15")],
    );
    if (result.length) throw new Error("Under-threshold donor was published.");
  });

  test("refunded and reversed donations do not qualify", function () {
    const result = partners(
      [
        contact("refunded", "Refunded Donor"),
        contact("reversed", "Reversed Donor"),
      ],
      [
        donation("refunded", 500, "refund-1", "Refunded"),
        donation("reversed", 500, "reverse-1", "Reversed"),
      ],
    );
    if (result.length) throw new Error("Invalid donations were published.");
  });

  test("negative refunds reduce cumulative contributions", function () {
    const result = partners(
      [contact("adjusted", "Adjusted Donor")],
      [
        donation("adjusted", 500, "original"),
        donation("adjusted", -500, "refund", "Refund"),
      ],
    );
    if (result.length) throw new Error("Refund adjustment was not applied.");
  });

  test("anonymous donors are omitted", function () {
    const result = partners(
      [contact("anonymous", "Anonymous Donor")],
      [donation("anonymous", 500, "anonymous-1")],
    );
    if (result.length) throw new Error("Anonymous donor was published.");
  });

  test("a donor is displayed once after cumulative aggregation", function () {
    const result = partners(
      [contact("once", "One Public Name")],
      [
        donation("once", 100, "once-1"),
        donation("once", 100, "once-2"),
        donation("once", 100, "once-3"),
      ],
    );
    if (
      result.length !== 1 ||
      result[0].name !== "One Public Name" ||
      result[0].tier !== "Sustaining"
    ) {
      throw new Error("Cumulative deduplication failed.");
    }
  });

  test("changed amounts move the donor to the correct tier", function () {
    const contacts = [contact("changed", "Changed Amount Donor")];
    const supporting = partners(contacts, [
      donation("changed", 249.99, "changed-1"),
    ]);
    const sustaining = partners(contacts, [
      donation("changed", 250, "changed-1"),
    ]);
    if (
      supporting[0].tier !== "Supporting" ||
      sustaining[0].tier !== "Sustaining"
    ) {
      throw new Error("Changed-amount classification failed.");
    }
  });

  test("private contacts are omitted", function () {
    const result = partners(
      [contact("private", "Private Donor", false)],
      [donation("private", 500, "private-1")],
    );
    if (result.length) throw new Error("Private donor was published.");
  });

  test("duplicate transaction IDs are counted once", function () {
    const result = partners(
      [contact("duplicate", "Duplicate Transaction Donor")],
      [
        donation("duplicate", 125, "same-id"),
        donation("duplicate", 125, "same-id"),
      ],
    );
    if (result.length !== 1 || result[0].tier !== "Supporting") {
      throw new Error("Duplicate donation was counted twice.");
    }
  });

  test("the public contract contains names and tiers only", function () {
    const result = partners(
      [contact("contract", "Public Contract Donor")],
      [donation("contract", 500, "contract-1")],
    );
    const keys = Object.keys(result[0]).sort().join(",");
    if (keys !== "name,tier") {
      throw new Error("Private or unnecessary fields entered the public feed.");
    }
  });

  return { ok: true, passed: results.length, tests: results };
}
