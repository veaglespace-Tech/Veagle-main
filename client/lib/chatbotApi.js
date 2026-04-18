import { API_BASE_URL } from "@/lib/site";

const CHATBOT_BASE = `${API_BASE_URL}/api/public/chatbot`;

/**
 * Send a chat message to the Veagle assistant.
 * Returns: { answer, confidence, showForm }
 */
export async function askVeagleBot(message) {
  const res = await fetch(`${CHATBOT_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
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
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Server error ${res.status}`);
  }

  return res.json();
}
