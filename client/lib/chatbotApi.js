import { readStoredSession } from "@/lib/auth-session";

const CHATBOT_BASE = "/api/chatbot";

/**
 * Send a chat message to the Veagle assistant.
 * Returns: { answer, confidence, showForm }
 */
export async function askVeagleBot(message) {
  const session = readStoredSession();
  const headers = {
    "Content-Type": "application/json",
    "X-Chatbot-Logged-In": session?.token ? "true" : "false",
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${CHATBOT_BASE}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message }),
    credentials: "same-origin",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Server error ${res.status}`);
  }

  return res.json();
}

/**
 * Submit a support ticket via the chatbot widget.
 * Returns: { success, ticketId, message }
 */
export async function submitVeagleBotSupport({ name, email, subject, message }) {
  const res = await fetch(`${CHATBOT_BASE}/support`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message }),
    credentials: "same-origin",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Server error ${res.status}`);
  }

  return res.json();
}
