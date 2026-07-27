const EVENTS_CONFIG = Object.freeze({
  publicCalendarProperty: "PUBLIC_CALENDAR_ID",
  includePastProperty: "INCLUDE_PAST_EVENTS",
  cacheSeconds: 300,
  maximumFutureDays: 548,
  timeZone: "America/Chicago",
});

function doGet() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get("netyr-public-events-v2");
    if (cached) return jsonText_(cached);

    const properties = PropertiesService.getScriptProperties();
    const calendarId = String(
      properties.getProperty(EVENTS_CONFIG.publicCalendarProperty) || "",
    ).trim();
    if (!calendarId) return unavailableResponse_();

    const includePast =
      properties.getProperty(EVENTS_CONFIG.includePastProperty) === "true";
    const events = readPublicCalendarEvents_(calendarId, includePast);
    const response = JSON.stringify({ ok: true, events: events });
    cache.put("netyr-public-events-v2", response, EVENTS_CONFIG.cacheSeconds);
    return jsonText_(response);
  } catch (_error) {
    return unavailableResponse_();
  }
}

function readPublicCalendarEvents_(calendarId, includePast) {
  const calendar = CalendarApp.getCalendarById(calendarId);
  if (!calendar) throw new Error("Public calendar is unavailable.");

  const now = new Date();
  const earliest = includePast
    ? new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    : new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const latest = new Date(
    now.getTime() + EVENTS_CONFIG.maximumFutureDays * 24 * 60 * 60 * 1000,
  );

  return calendar
    .getEvents(earliest, latest)
    .map(publicEvent_)
    .filter(Boolean)
    .filter(function (event) {
      return includePast || new Date(event.end).getTime() >= now.getTime();
    })
    .sort(function (left, right) {
      return new Date(left.start).getTime() - new Date(right.start).getTime();
    });
}

function publicEvent_(calendarEvent) {
  const title = cleanText_(calendarEvent.getTitle(), 160);
  if (!title) return null;

  const allDay = calendarEvent.isAllDayEvent();
  const start = formatIso_(calendarEvent.getStartTime(), allDay);
  const end = formatIso_(calendarEvent.getEndTime(), allDay);
  if (!start || !end) return null;

  const details = publicDetails_(calendarEvent.getDescription());
  const location = cleanText_(calendarEvent.getLocation(), 240);
  const stableId = digest_(title + "|" + start + "|" + end).slice(0, 24);

  return {
    id: stableId,
    title: title,
    start: start,
    end: end,
    allDay: allDay,
    location: location,
    description: details.description,
    registrationUrl: details.registrationUrl,
    graphicUrl: details.graphicUrl,
    featured: details.featured,
  };
}

function publicDetails_(description) {
  const lines = cleanText_(description, 5000).split("\n");
  let registrationUrl = "";
  let graphicUrl = "";
  let featured = false;
  const publicLines = [];

  lines.forEach(function (line) {
    const registrationMatch = /^registration\s*:\s*(.+)$/i.exec(line);
    const graphicMatch = /^graphic\s*:\s*(.+)$/i.exec(line);
    const featuredMatch = /^featured\s*:\s*(true|yes)$/i.exec(line);

    if (registrationMatch) {
      registrationUrl = publicUrl_(registrationMatch[1]);
      return;
    }
    if (graphicMatch) {
      graphicUrl = publicUrl_(graphicMatch[1]);
      return;
    }
    if (featuredMatch) {
      featured = true;
      return;
    }

    const safeLine = line
      .replace(/https?:\/\/meet\.google\.com\/[^\s]+/gi, "")
      .replace(/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (safeLine) publicLines.push(safeLine);
  });

  return {
    description: publicLines.join("\n").slice(0, 1200),
    registrationUrl: registrationUrl,
    graphicUrl: graphicUrl,
    featured: featured,
  };
}

function formatIso_(value, allDay) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "";
  if (allDay) {
    return (
      Utilities.formatDate(value, EVENTS_CONFIG.timeZone, "yyyy-MM-dd") +
      "T00:00:00" +
      Utilities.formatDate(value, EVENTS_CONFIG.timeZone, "XXX")
    );
  }
  return Utilities.formatDate(
    value,
    EVENTS_CONFIG.timeZone,
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  );
}

function cleanText_(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function publicUrl_(value) {
  const candidate = cleanText_(value, 2000);
  return /^https:\/\//i.test(candidate) ? candidate : "";
}

function digest_(value) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8,
  );
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, "");
}

function unavailableResponse_() {
  return jsonText_(
    JSON.stringify({
      ok: false,
      message: "Events are temporarily unavailable.",
      events: [],
    }),
  );
}

function jsonText_(value) {
  return ContentService.createTextOutput(value).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function runWebsiteEventsTests() {
  const results = [];
  const test = function (name, callback) {
    callback();
    results.push(name);
  };

  test("extracts approved public event markers", function () {
    const details = publicDetails_(
      "Open meeting.\nRegistration: https://example.org/register\nGraphic: https://example.org/graphic.png\nFeatured: true",
    );
    if (
      details.description !== "Open meeting." ||
      details.registrationUrl !== "https://example.org/register" ||
      details.graphicUrl !== "https://example.org/graphic.png" ||
      details.featured !== true
    ) {
      throw new Error("Public marker parsing failed.");
    }
  });

  test("does not return private contact or Meet details", function () {
    const details = publicDetails_(
      "Email person@example.org\nhttps://meet.google.com/abc-defg-hij\nPublic note",
    );
    if (/example\.org|meet\.google\.com/i.test(details.description)) {
      throw new Error("Private detail filtering failed.");
    }
  });

  test("requires https marker links", function () {
    const details = publicDetails_("Registration: http://example.org");
    if (details.registrationUrl) throw new Error("Insecure link accepted.");
  });

  return { ok: true, passed: results.length, tests: results };
}
