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

function getAllowedOrigins(env) {
  const raw = env.ALLOWED_ORIGINS || "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function corsHeaders(origin, allowedOrigins) {
  const allowOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitize(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = getAllowedOrigins(env);
    const responseCorsHeaders = corsHeaders(origin, allowedOrigins);

    if (pathname !== "/api/contact") {
      return jsonResponse({ ok: false, error: "Not found" }, 404, responseCorsHeaders);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: responseCorsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { ok: false, error: "Method not allowed" },
        405,
        responseCorsHeaders,
      );
    }

    if (!allowedOrigins.includes(origin)) {
      return jsonResponse(
        { ok: false, error: "Origin not allowed" },
        403,
        responseCorsHeaders,
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse(
        { ok: false, error: "Invalid JSON body" },
        400,
        responseCorsHeaders,
      );
    }

    const name = sanitize(payload.name, 120);
    const email = sanitize(payload.email, 254).toLowerCase();
    const message = sanitize(payload.message, 5000);
    const company = sanitize(payload.company, 120);
    const source = sanitize(payload.source, 500);

    if (company) {
      return jsonResponse({ ok: true }, 200, responseCorsHeaders);
    }

    if (!name || name.length < 2) {
      return jsonResponse(
        { ok: false, error: "Name is required" },
        400,
        responseCorsHeaders,
      );
    }

    if (!isValidEmail(email)) {
      return jsonResponse(
        { ok: false, error: "A valid email is required" },
        400,
        responseCorsHeaders,
      );
    }

    if (!message || message.length < 10) {
      return jsonResponse(
        { ok: false, error: "Message is too short" },
        400,
        responseCorsHeaders,
      );
    }

    const safeMessageHtml = message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");

    const resendPayload = {
      from: env.RESEND_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `Portfolio inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        source ? `Source: ${source}` : "",
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <h2>New portfolio inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${source ? `<p><strong>Source:</strong> ${source}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${safeMessageHtml}</p>
      `,
    };

    try {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resendPayload),
      });

      if (!resendResponse.ok) {
        const errorBody = await resendResponse.text();
        console.error("Resend error:", resendResponse.status, errorBody);
        return jsonResponse(
          { ok: false, error: "Email provider rejected request" },
          502,
          responseCorsHeaders,
        );
      }

      return jsonResponse({ ok: true }, 200, responseCorsHeaders);
    } catch (error) {
      console.error("Worker contact error:", error);
      return jsonResponse(
        { ok: false, error: "Server error" },
        500,
        responseCorsHeaders,
      );
    }
  },
};
