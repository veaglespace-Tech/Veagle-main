import { API_BASE_URL } from "@/lib/site";

const LOCAL_BACKEND_BASES = ["http://localhost:8080", "http://127.0.0.1:8080"];

function isLocalHost(host = "") {
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host.trim());
}

function joinUrl(baseUrl, path) {
  const normalizedBase = String(baseUrl || "").replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function buildBackendBases(request) {
  const host = request.headers.get("host") || "";
  const envBases = [
    process.env.CHATBOT_API_BASE_URL,
    process.env.NEXT_PUBLIC_CHATBOT_API_BASE_URL,
    process.env.BACKEND_URL,
  ].filter(Boolean);

  if (isLocalHost(host)) {
    return [...envBases, ...LOCAL_BACKEND_BASES];
  }

  return [...envBases, API_BASE_URL];
}

function buildCandidates(request, path) {
  return [...new Set(buildBackendBases(request).map((baseUrl) => joinUrl(baseUrl, path)))];
}

function parsePayload(rawText) {
  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return rawText;
  }
}

function asErrorPayload(payload, fallback) {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload === "string" && payload.trim()) {
    return { error: payload };
  }

  return { error: fallback };
}

function asSuccessPayload(payload) {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload === "string" && payload.trim()) {
    return { message: payload };
  }

  return {};
}

export async function proxyChatbotPost(request, path) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid chatbot request payload." },
      { status: 400 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const loggedInHint = request.headers.get("x-chatbot-logged-in");
  const candidates = buildCandidates(request, path);

  let lastError = "";

  for (const endpoint of candidates) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (authHeader) {
        headers.Authorization = authHeader;
      }

      if (loggedInHint) {
        headers["X-Chatbot-Logged-In"] = loggedInHint;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        cache: "no-store",
      });

      const rawText = await response.text();
      const payload = parsePayload(rawText);

      if (response.ok) {
        return Response.json(asSuccessPayload(payload), {
          status: response.status,
        });
      }

      lastError =
        (payload && typeof payload === "object" && !Array.isArray(payload)
          ? payload.error || payload.message
          : typeof payload === "string"
            ? payload
            : "") || `Chatbot request failed with status ${response.status}.`;

      if (response.status < 500) {
        return Response.json(asErrorPayload(payload, lastError), {
          status: response.status,
        });
      }
    } catch (error) {
      lastError = error?.message || "Chatbot service is unavailable.";
    }
  }

  return Response.json(
    {
      error:
        lastError ||
        "Chatbot service is unavailable. Make sure the backend is running.",
    },
    { status: 503 },
  );
}
