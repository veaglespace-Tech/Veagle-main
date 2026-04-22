import { API_BASE_URL } from "@/lib/site";

const CHATBOT_BASE = `${API_BASE_URL}/api/public/chatbot`;

const STRICT_RESPONSES = [
  {
    patterns: [
      /^what services do you offer$/,
      /^which services do you offer$/,
    ],
    answer:
      "We offer software development, website and e-commerce development, ERP solutions, mobile app development, digital marketing, UI/UX and graphic design, BPO/KPO, data entry, banking software solutions, Zoho implementation, and resource outsourcing services.",
  },
  {
    patterns: [
      /^how can i get a project quote$/,
      /^how do i get a project quote$/,
      /(project|quote|pricing|price|cost|budget)/,
    ],
    answer:
      "Yes, we handle custom project requirements for websites, software, apps, ERP, marketing, and more. Share your requirement through the Contact page, email info@veaglespace.com, or call +91 82379 99101 and our team will get back within 24 hours.",
  },
  {
    patterns: [
      /^do you develop mobile apps$/,
      /(mobile app|android|ios)/,
    ],
    answer:
      "Yes, Veagle Space develops mobile applications for Android and iOS along with the required backend systems when needed. If you share your app idea, we can help you shape the right scope.",
  },
  {
    patterns: [
      /^how do i apply for a job$/,
      /^how can i apply$/,
      /(career|job|jobs|apply|hiring|interview|hr)/,
    ],
    answer:
      "Veagle Space hires both freshers and experienced candidates. You can apply from the Career page on our website or reach HR at hr@veaglespacetech.com.",
  },
  {
    patterns: [
      /^where are you located$/,
      /^what is your address$/,
      /^where is your office$/,
      /(where.*(located|based))/,
      /(office|company).*(address|location)/,
    ],
    answer:
      "Veagle Space is located at Office no 207, Kudale Patil Chambers, Heritage, near Bhairavnath Temple, Jadhav Nagar, Vadgaon Budruk, Pune, Maharashtra 411041.",
  },
  {
    patterns: [
      /^how can i contact you$/,
      /^what is your phone number$/,
      /^what is your email$/,
      /(contact|email|phone|call|whatsapp|get in touch|reach you)/,
    ],
    answer:
      "You can reach Veagle Space through the Contact page, email info@veaglespace.com, or call +91 82379 99101.",
  },
];

function normalizeMessage(message = "") {
  return String(message).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getStrictResponse(message) {
  const normalized = normalizeMessage(message);

  for (const entry of STRICT_RESPONSES) {
    if (entry.patterns.some((pattern) => pattern.test(normalized))) {
      return {
        answer: entry.answer,
        confidence: "high",
        showForm: false,
      };
    }
  }

  return null;
}

/**
 * Send a chat message to the Veagle assistant.
 * Returns: { answer, confidence, showForm }
 */
export async function askVeagleBot(message, loggedIn = false) {
  const strictResponse = getStrictResponse(message);
  if (strictResponse) {
    return strictResponse;
  }

  const res = await fetch(`${CHATBOT_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, loggedIn }),
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
