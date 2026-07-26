const EVENTS_CONFIG = Object.freeze({
  spreadsheetProperty: "SPREADSHEET_ID",
  includePastProperty: "INCLUDE_PAST_EVENTS",
  sheetName: "Website Events",
  timeZone: "America/Chicago",
  cacheSeconds: 60,
  maximumRows: 5000,
});

const EVENT_HEADERS = Object.freeze([
  "Event ID",
  "Event Title",
  "Start Date",
  "Start Time",
  "End Date",
  "End Time",
  "Location",
  "Short Description",
  "Full Description",
  "Graphic URL",
  "Registration URL",
  "Featured",
  "Active",
  "Display Order",
  "Last Updated",
]);

function doGet() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get("public-website-events");
    if (cached) return jsonText_(cached);

    const properties = PropertiesService.getScriptProperties();
    const spreadsheetId = properties.getProperty(
      EVENTS_CONFIG.spreadsheetProperty,
    );
    if (!spreadsheetId) {
      return jsonResponse_({
        ok: false,
        message: "Events are temporarily unavailable.",
        events: [],
      });
    }

    const includePast =
      properties.getProperty(EVENTS_CONFIG.includePastProperty) === "true";
    const events = readPublicEvents_(spreadsheetId, includePast);
    const result = JSON.stringify({
      ok: true,
      generatedAt: new Date().toISOString(),
      events: events,
    });

    cache.put("public-website-events", result, EVENTS_CONFIG.cacheSeconds);
    return jsonText_(result);
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: "Events are temporarily unavailable.",
      events: [],
    });
  }
}

function readPublicEvents_(spreadsheetId, includePast) {
  const rangeName =
    "'" +
    EVENTS_CONFIG.sheetName.replace(/'/g, "''") +
    "'!A1:O" +
    (EVENTS_CONFIG.maximumRows + 1);
  const workbook = Sheets.Spreadsheets.get(spreadsheetId, {
    fields: "properties.timeZone",
  });
  const valueResult = Sheets.Spreadsheets.Values.get(spreadsheetId, rangeName, {
    majorDimension: "ROWS",
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "SERIAL_NUMBER",
  });
  const formulaResult = Sheets.Spreadsheets.Values.get(
    spreadsheetId,
    rangeName,
    {
      majorDimension: "ROWS",
      valueRenderOption: "FORMULA",
      dateTimeRenderOption: "SERIAL_NUMBER",
    },
  );
  const rows = valueResult.values || [];
  const formulaRows = formulaResult.values || [];
  const headers = rows[0] || [];
  const hasExpectedHeaders = EVENT_HEADERS.every(function (header, index) {
    return headers[index] === header;
  });
  if (!hasExpectedHeaders) throw new Error("Unexpected event sheet structure.");
  if (rows.length < 2) return [];

  const spreadsheetTimeZone =
    (workbook.properties && workbook.properties.timeZone) ||
    EVENTS_CONFIG.timeZone;
  const now = new Date();

  return rows
    .slice(1)
    .map(function (row, index) {
      const formulaRow = formulaRows[index + 1] || [];
      if (
        formulaRow.some(function (value) {
          return typeof value === "string" && value.trim().startsWith("=");
        })
      ) {
        return null;
      }

      return publicEvent_(row, spreadsheetTimeZone);
    })
    .filter(function (event) {
      if (!event || event.active !== true) return false;
      return includePast || new Date(event.end).getTime() >= now.getTime();
    })
    .sort(function (left, right) {
      const dateDifference =
        new Date(left.start).getTime() - new Date(right.start).getTime();
      if (dateDifference !== 0) return dateDifference;
      return left.displayOrder - right.displayOrder;
    })
    .map(function (event) {
      delete event.active;
      delete event.displayOrder;
      return event;
    });
}

function publicEvent_(row, spreadsheetTimeZone) {
  const title = cleanText_(row[1], 160);
  const datePart = datePart_(row[2], spreadsheetTimeZone);
  const active = boolean_(row[12]);
  if (!title || !datePart || active !== true) return null;

  const startTime = timePart_(row[3], spreadsheetTimeZone);
  const allDay = !startTime;
  const endDatePart = datePart_(row[4], spreadsheetTimeZone) || datePart;
  const endTime = timePart_(row[5], spreadsheetTimeZone);
  const start = zonedIso_(datePart, startTime || "00:00:00");
  let end;

  if (allDay) {
    end = zonedIso_(addDays_(endDatePart, 1), "00:00:00");
  } else {
    end = zonedIso_(endDatePart, endTime || addMinutes_(startTime, 60));
  }

  if (!start || !end) return null;

  const shortDescription = cleanText_(row[7], 600);
  const fullDescription = cleanText_(row[8], 4000);
  const eventId =
    cleanText_(row[0], 200) ||
    slugify_(title + "-" + datePart + "-" + (startTime || "all-day"));

  return {
    id: eventId,
    title: title,
    description: shortDescription || fullDescription,
    start: start,
    end: end,
    allDay: allDay,
    location: cleanText_(row[6], 240),
    graphicUrl: publicUrl_(row[9]),
    registrationUrl: publicUrl_(row[10]),
    featured: boolean_(row[11]),
    status:
      new Date(end).getTime() < new Date().getTime() ? "completed" : "upcoming",
    active: active,
    displayOrder: finiteNumber_(row[13]),
  };
}

function datePart_(value, sourceTimeZone) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, sourceTimeZone, "yyyy-MM-dd");
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const milliseconds = Math.round((Math.floor(value) - 25569) * 86400000);
    return Utilities.formatDate(new Date(milliseconds), "UTC", "yyyy-MM-dd");
  }
  const candidate = String(value || "").trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(candidate);
  if (isoMatch) return candidate;
  const usMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(candidate);
  if (!usMatch) return "";
  return [
    usMatch[3],
    String(usMatch[1]).padStart(2, "0"),
    String(usMatch[2]).padStart(2, "0"),
  ].join("-");
}

function timePart_(value, sourceTimeZone) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, sourceTimeZone, "HH:mm:ss");
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const fraction = ((value % 1) + 1) % 1;
    const totalSeconds = Math.round(fraction * 86400) % 86400;
    return [
      String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
      String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
      String(totalSeconds % 60).padStart(2, "0"),
    ].join(":");
  }
  const candidate = String(value || "").trim();
  const twelveHourMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(
    candidate,
  );
  if (twelveHourMatch) {
    let hour = Number(twelveHourMatch[1]) % 12;
    if (twelveHourMatch[4].toUpperCase() === "PM") hour += 12;
    return [
      String(hour).padStart(2, "0"),
      twelveHourMatch[2],
      twelveHourMatch[3] || "00",
    ].join(":");
  }
  const twentyFourHourMatch =
    /^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(candidate);
  if (!twentyFourHourMatch) return "";
  return [
    String(Number(twentyFourHourMatch[1])).padStart(2, "0"),
    twentyFourHourMatch[2],
    twentyFourHourMatch[3] || "00",
  ].join(":");
}

function zonedIso_(datePart, timePart) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
  const timeMatch = /^(\d{2}):(\d{2}):(\d{2})$/.exec(timePart);
  if (!match || !timeMatch) return "";

  const utcGuess = new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(timeMatch[1]),
      Number(timeMatch[2]),
      Number(timeMatch[3]),
    ),
  );
  const offsetText = Utilities.formatDate(
    utcGuess,
    EVENTS_CONFIG.timeZone,
    "Z",
  );
  const offsetSign = offsetText[0] === "-" ? -1 : 1;
  const offsetMinutes =
    offsetSign *
    (Number(offsetText.slice(1, 3)) * 60 + Number(offsetText.slice(3, 5)));
  const instant = new Date(utcGuess.getTime() - offsetMinutes * 60000);

  return Utilities.formatDate(
    instant,
    EVENTS_CONFIG.timeZone,
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  );
}

function addDays_(datePart, days) {
  const parts = datePart.split("-").map(Number);
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + days));
  return Utilities.formatDate(date, "UTC", "yyyy-MM-dd");
}

function addMinutes_(timePart, minutes) {
  const parts = timePart.split(":").map(Number);
  const date = new Date(
    Date.UTC(1970, 0, 1, parts[0], parts[1] + minutes, parts[2]),
  );
  return Utilities.formatDate(date, "UTC", "HH:mm:ss");
}

function boolean_(value) {
  return value === true || String(value).toLowerCase() === "true";
}

function finiteNumber_(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER;
}

function publicUrl_(value) {
  const candidate = cleanText_(value, 2000);
  return /^https:\/\//i.test(candidate) ? candidate : "";
}

function cleanText_(value, maxLength) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function slugify_(value) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "event"
  );
}

function jsonResponse_(payload) {
  return jsonText_(JSON.stringify(payload));
}

function jsonText_(value) {
  return ContentService.createTextOutput(value).setMimeType(
    ContentService.MimeType.JSON,
  );
}
