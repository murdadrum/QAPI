const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

function getBearerToken(request) {
  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Bearer ")) return "";
  return header.slice("Bearer ".length).trim();
}

function isValidEventShape(payload) {
  if (!payload || typeof payload !== "object") return false;
  if (typeof payload.event_name !== "string" || !payload.event_name) return false;
  if (typeof payload.repository !== "string" || !payload.repository) return false;
  if (typeof payload.event_id !== "string" || !payload.event_id) return false;
  return true;
}

function sanitizeSegment(value, fallback = "unknown") {
  const safe = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return safe || fallback;
}

function toNdjsonLine(payload) {
  return `${JSON.stringify(payload)}\n`;
}

async function storeInR2(env, payload, eventReceivedAt) {
  if (!env.CI_EVENTS_BUCKET) {
    return { stored: false, reason: "No R2 bucket binding configured" };
  }

  const eventDate = new Date(eventReceivedAt);
  const yyyy = eventDate.getUTCFullYear();
  const mm = String(eventDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(eventDate.getUTCDate()).padStart(2, "0");
  const hh = String(eventDate.getUTCHours()).padStart(2, "0");

  const repoSegment = sanitizeSegment(payload.repository, "repo");
  const eventSegment = sanitizeSegment(payload.event_name, "event");
  const eventIdSegment = sanitizeSegment(payload.event_id, crypto.randomUUID());

  const key = `events/year=${yyyy}/month=${mm}/day=${dd}/hour=${hh}/repo=${repoSegment}/event=${eventSegment}/${eventIdSegment}.ndjson`;
  await env.CI_EVENTS_BUCKET.put(key, toNdjsonLine({ ...payload, ingested_at: eventReceivedAt }), {
    httpMetadata: { contentType: "application/x-ndjson; charset=utf-8" },
  });

  return { stored: true, key };
}

async function forwardEventIfConfigured(env, payload) {
  if (!env.DOWNSTREAM_INGEST_URL) {
    return { forwarded: false, reason: "No downstream endpoint configured" };
  }

  const headers = {
    "Content-Type": "application/json",
    "X-CI-Source": "ci-observability-ingest-worker",
  };

  if (env.DOWNSTREAM_INGEST_TOKEN) {
    headers.Authorization = `Bearer ${env.DOWNSTREAM_INGEST_TOKEN}`;
  }

  const response = await fetch(env.DOWNSTREAM_INGEST_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Downstream ingest failed (${response.status}): ${body}`);
  }

  return { forwarded: true };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/healthz") {
      return jsonResponse({ ok: true, service: "ci-observability-ingest" }, 200);
    }

    if (url.pathname !== "/api/ci-events") {
      return jsonResponse({ ok: false, error: "Not found" }, 404);
    }

    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed" }, 405, {
        Allow: "POST",
      });
    }

    if (!env.INGEST_TOKEN) {
      return jsonResponse({ ok: false, error: "Server not configured" }, 500);
    }

    const providedToken = getBearerToken(request);
    if (!providedToken || providedToken !== env.INGEST_TOKEN) {
      return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON body" }, 400);
    }

    if (!isValidEventShape(payload)) {
      return jsonResponse(
        { ok: false, error: "Invalid event payload shape" },
        400,
      );
    }

    const eventReceivedAt = new Date().toISOString();

    try {
      const storageResult = await storeInR2(env, payload, eventReceivedAt);
      const forwardResult = await forwardEventIfConfigured(env, {
        ...payload,
        ingested_at: eventReceivedAt,
      });

      return jsonResponse(
        {
          ok: true,
          stored: storageResult.stored,
          storage_key: storageResult.key || null,
          forwarded: forwardResult.forwarded,
        },
        202,
      );
    } catch (error) {
      console.error("Failed to process CI event:", error);
      return jsonResponse({ ok: false, error: "Failed to process event" }, 502);
    }
  },
};
