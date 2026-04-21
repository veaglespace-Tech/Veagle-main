"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageSquareText, SendHorizontal, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { askVeagleBot, submitVeagleBotSupport } from "@/lib/chatbotApi";

// ─── Quick questions shown before any conversation ───────────────────────────
const QUICK_QUESTIONS = [
  "Services you offer?",
  "How to get a quote?",
  "Do you develop mobile apps?",
  "How do I apply for a job?",
  "Where are you located?",
  "How can I contact you?",
];

const QUICK_QUESTION_ROWS = [
  [QUICK_QUESTIONS[0], QUICK_QUESTIONS[1]],
  [QUICK_QUESTIONS[2]],
  [QUICK_QUESTIONS[3]],
  [QUICK_QUESTIONS[4], QUICK_QUESTIONS[5]],
];

// ─── Layout constants ─────────────────────────────────────────────────────────
const PANEL_VIEWPORT_CLASS =
  "[--vb-top-gap:4.75rem] [--vb-bottom-gap:1rem] bottom-[calc(env(safe-area-inset-bottom)+var(--vb-bottom-gap))] max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-var(--vb-top-gap)-var(--vb-bottom-gap))] sm:[--vb-top-gap:1rem] sm:[--vb-bottom-gap:1.25rem] sm:max-h-[min(34rem,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-var(--vb-top-gap)-var(--vb-bottom-gap)))] lg:max-h-[min(35rem,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-var(--vb-top-gap)-var(--vb-bottom-gap)))]";

const FAB_POSITION_CLASS =
  "bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:bottom-[calc(env(safe-area-inset-bottom)+1.25rem)]";

const SUPPORT_SUBJECT_MAX = 120;
const SUPPORT_MESSAGE_MAX = 500;
const CHAT_BODY_TEXT_CLASS = "text-[12px] leading-[1.55] font-normal";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const CHAT_THEME = {
  light: {
    panel:
      "border border-slate-200/90 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.99),rgba(246,248,252,0.98)_58%,rgba(234,239,247,0.96)_100%)] text-slate-900 shadow-[0_32px_88px_rgba(148,163,184,0.28)] backdrop-blur-2xl",
    header: "bg-[linear-gradient(120deg,#1e56a8_0%,#2f75d6_58%,#7fd4e8_100%)]",
    headerSubtle: "text-white/88",
    statusText: "text-white/82",
    introBubble:
      "border border-slate-200/90 bg-white/96 text-slate-700 shadow-[0_14px_30px_rgba(148,163,184,0.14)]",
    botBubble:
      "border border-slate-200/90 bg-white/96 text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.14)]",
    userBubble:
      "bg-[linear-gradient(135deg,#2458ad,#5f8ff0)] text-white shadow-[0_14px_28px_rgba(59,130,246,0.26)]",
    loaderBubble:
      "border border-slate-200/90 bg-white/96 shadow-[0_12px_28px_rgba(148,163,184,0.14)]",
    loaderDot: "bg-blue-500",
    messages:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(244,247,252,0.72))]",
    section: "border-slate-200/80 bg-[rgba(248,250,254,0.84)]",
    sectionText: "text-slate-500",
    quickButton:
      "inline-flex max-w-full items-center justify-center whitespace-normal break-words rounded-full border border-slate-200 bg-white px-3 py-1.5 text-center text-[12px] font-normal leading-[1.4] text-slate-800 shadow-[0_10px_22px_rgba(148,163,184,0.12)] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:px-3.5 sm:py-1.5",
    inputWrap: "border-slate-200/80 bg-[rgba(248,250,254,0.84)]",
    input:
      "border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] focus:border-blue-400 focus:ring-2 focus:ring-blue-200/70",
    sendButton:
      "flex h-[2.9rem] w-[2.9rem] flex-shrink-0 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#91aef6,#5e88ec)] p-0 text-white shadow-[0_14px_28px_rgba(96,136,236,0.34)] transition hover:brightness-105 disabled:opacity-40",
    supportCard:
      "border border-slate-200/90 bg-white/95 text-slate-800 shadow-[0_14px_32px_rgba(148,163,184,0.18)]",
    supportTitle: "text-slate-900",
    supportLabel: "text-slate-500",
    supportReadonly:
      "border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed",
    supportEditable:
      "border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/70",
    supportNote: "text-slate-500",
    submitButton:
      "w-full rounded-xl bg-[linear-gradient(135deg,#2458ad,#5f8ff0)] px-4 py-2 text-[12px] font-normal leading-[1.55] text-white shadow-[0_12px_24px_rgba(59,130,246,0.24)] transition hover:brightness-105 disabled:opacity-50",
    successBox: "bg-emerald-50 border border-emerald-200 text-emerald-800",
    successText: "text-emerald-700",
    avatarBorder: "border-slate-200/90",
    fab: "h-14 w-14 rounded-[1.7rem] bg-[linear-gradient(135deg,#2458ad,#5f8ff0)] text-white shadow-[0_22px_54px_rgba(96,136,236,0.35)] transition hover:brightness-105",
    fabActive:
      "h-14 w-14 rounded-[1.7rem] bg-white border border-slate-200 text-slate-700 shadow-[0_14px_30px_rgba(148,163,184,0.22)] transition hover:bg-slate-50",
  },
  dark: {
    panel:
      "border border-[#24334e] bg-[radial-gradient(circle_at_top,rgba(17,27,46,0.98),rgba(14,22,37,0.985)_58%,rgba(10,16,29,0.99)_100%)] text-slate-100 shadow-[0_34px_96px_rgba(2,8,23,0.68)] backdrop-blur-2xl",
    header: "bg-[linear-gradient(120deg,#1c4a95_0%,#2a61bb_58%,#4c7ce2_100%)]",
    headerSubtle: "text-white/84",
    statusText: "text-white/78",
    introBubble:
      "border border-[#2a3853] bg-[#10192c] text-slate-100 shadow-[0_16px_34px_rgba(2,8,23,0.32)]",
    botBubble:
      "border border-[#2a3853] bg-[#10192c] text-slate-100 shadow-[0_14px_30px_rgba(2,8,23,0.32)]",
    userBubble:
      "bg-[linear-gradient(135deg,#2c67cb,#6bb3f0)] text-white shadow-[0_14px_28px_rgba(37,99,235,0.3)]",
    loaderBubble:
      "border border-[#2a3853] bg-[#10192c] shadow-[0_14px_30px_rgba(2,8,23,0.32)]",
    loaderDot: "bg-cyan-400",
    messages:
      "bg-[linear-gradient(180deg,rgba(12,18,32,0.36),rgba(9,15,28,0.74))]",
    section: "border-[#24334e] bg-[#0f1729]",
    sectionText: "text-slate-400",
    quickButton:
      "inline-flex max-w-full items-center justify-center whitespace-normal break-words rounded-full border border-[#344560] bg-[#121d31] px-3 py-1.5 text-center text-[12px] font-normal leading-[1.4] text-slate-100 shadow-[0_10px_22px_rgba(2,8,23,0.22)] transition hover:border-blue-400/60 hover:bg-[#16223a] hover:text-white sm:px-3.5 sm:py-1.5",
    inputWrap: "border-[#24334e] bg-[#0f1729]",
    input:
      "border border-[#334569] bg-[#121d31] text-slate-100 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30",
    sendButton:
      "flex h-[2.9rem] w-[2.9rem] flex-shrink-0 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#234e9c,#3b73d8)] p-0 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] transition hover:brightness-110 disabled:opacity-40",
    supportCard:
      "border border-[#283753] bg-[#10192c] text-slate-100 shadow-[0_16px_34px_rgba(2,8,23,0.38)]",
    supportTitle: "text-slate-100",
    supportLabel: "text-slate-400",
    supportReadonly:
      "border border-[#2a3656] bg-[#0d1527] text-slate-500 cursor-not-allowed",
    supportEditable:
      "border border-[#334569] bg-[#121d31] text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30",
    supportNote: "text-slate-500",
    submitButton:
      "w-full rounded-xl bg-[linear-gradient(135deg,#234e9c,#3b73d8)] px-4 py-2 text-[12px] font-normal leading-[1.55] text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)] transition hover:brightness-110 disabled:opacity-50",
    successBox:
      "bg-emerald-500/10 border border-emerald-500/25 text-emerald-100",
    successText: "text-emerald-200",
    avatarBorder: "border-[#334569]",
    fab: "h-14 w-14 rounded-[1.7rem] bg-[linear-gradient(135deg,#234e9c,#3b73d8)] text-white shadow-[0_24px_58px_rgba(3,10,28,0.54)] transition hover:brightness-110",
    fabActive:
      "h-14 w-14 rounded-[1.7rem] bg-[#10192c] border border-[#334569] text-slate-200 shadow-[0_16px_34px_rgba(2,8,23,0.36)] transition hover:bg-[#16223a]",
  },
};

// ─── Bot avatar ───────────────────────────────────────────────────────────────
function BotAvatar({ avatarBorder }) {
  return (
    <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center sm:h-10 sm:w-10">
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1rem] border bg-white p-0.5 shadow-sm sm:rounded-[1.1rem] ${avatarBorder}`}
      >
        <Image
          src="/veagle-logo.webp"
          alt="Veagle Assistant"
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

// ─── Support form ─────────────────────────────────────────────────────────────
function SupportForm({ onSubmit, loading, theme }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errors = { name: "", email: "", message: "" };
    if (!form.name.trim() || form.name.trim().length < 2)
      errors.name = "Please enter your name (min 2 characters).";
    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    )
      errors.email = "Please enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10)
      errors.message = "Please describe your query (min 10 characters).";
    return errors;
  };

  const handleSubmit = async () => {
    setError("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    const result = await onSubmit({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim() || undefined,
      message: form.message.trim(),
    });

    if (result?.success) {
      setDone(true);
      setTicketId(result.ticketId);
    } else {
      setError(result?.error || "Something went wrong. Please try again.");
    }
  };

  if (done) {
    return (
      <div
        className={`rounded-xl p-3 ${CHAT_BODY_TEXT_CLASS} ${theme.successBox}`}
      >
        <p>Query submitted!</p>
        <p className={`mt-0.5 ${CHAT_BODY_TEXT_CLASS} ${theme.successText}`}>
          Ticket #{ticketId} created. We will reply to {form.email} within 24
          hours.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-[1.25rem] p-3 sm:flex-1 sm:rounded-[1.4rem] ${CHAT_BODY_TEXT_CLASS} ${theme.supportCard}`}
    >
      <p className={`mb-2 ${CHAT_BODY_TEXT_CLASS} ${theme.supportTitle}`}>
        Contact our team
      </p>
      <div className="flex flex-col gap-2">
        <div>
          <label
            className={`mb-1 block ${CHAT_BODY_TEXT_CLASS} ${theme.supportLabel}`}
          >
            Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            maxLength={120}
            placeholder="Your name"
            className={`w-full rounded-xl px-2.5 py-2 focus:outline-none ${CHAT_BODY_TEXT_CLASS} ${theme.supportEditable}`}
          />
          {fieldErrors.name && (
            <p className={`mt-1 ${CHAT_BODY_TEXT_CLASS} text-rose-500`}>
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label
            className={`mb-1 block ${CHAT_BODY_TEXT_CLASS} ${theme.supportLabel}`}
          >
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            maxLength={191}
            placeholder="your@email.com"
            className={`w-full rounded-xl px-2.5 py-2 focus:outline-none ${CHAT_BODY_TEXT_CLASS} ${theme.supportEditable}`}
          />
          {fieldErrors.email && (
            <p className={`mt-1 ${CHAT_BODY_TEXT_CLASS} text-rose-500`}>
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <label
            className={`mb-1 block ${CHAT_BODY_TEXT_CLASS} ${theme.supportLabel}`}
          >
            Subject
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={set("subject")}
            placeholder="Brief topic"
            maxLength={SUPPORT_SUBJECT_MAX}
            className={`w-full rounded-xl px-2.5 py-2 focus:outline-none ${CHAT_BODY_TEXT_CLASS} ${theme.supportEditable}`}
          />
        </div>
        <div>
          <label
            className={`mb-1 block ${CHAT_BODY_TEXT_CLASS} ${theme.supportLabel}`}
          >
            Message *
          </label>
          <textarea
            value={form.message}
            onChange={set("message")}
            placeholder="How can we help you?"
            rows={3}
            maxLength={SUPPORT_MESSAGE_MAX}
            className={`w-full resize-none rounded-xl px-2.5 py-2 focus:outline-none ${CHAT_BODY_TEXT_CLASS} ${theme.supportEditable}`}
          />
          {fieldErrors.message && (
            <p className={`mt-1 ${CHAT_BODY_TEXT_CLASS} text-rose-500`}>
              {fieldErrors.message}
            </p>
          )}
        </div>
        {error && (
          <p className={`${CHAT_BODY_TEXT_CLASS} text-rose-500`}>{error}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={theme.submitButton}
        >
          {loading ? "Sending..." : "Send message"}
        </button>
        <p
          className={`text-center ${CHAT_BODY_TEXT_CLASS} ${theme.supportNote}`}
        >
          We reply within 24 hours
        </p>
      </div>
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function VeagleWidget() {
  const { isDark, theme: appTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const bottomRef = useRef(null);

  const appUsesDarkTheme = appTheme === "veagle-dark" || Boolean(isDark);
  const resolvedTheme = mounted
    ? appUsesDarkTheme
      ? "dark"
      : "light"
    : "light";
  const theme = CHAT_THEME[resolvedTheme];
  const isPristineState = messages.length === 0 && !chatLoading && !showForm;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading, showForm]);

  const addMsg = (role, content) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), role, content },
    ]);

  const closeChat = () => {
    setOpen(false);
    setMessages([]);
    setInput("");
    setShowForm(false);
  };

  const handleAsk = async (question) => {
    const q = typeof question === "string" ? question : input;
    if (!q.trim() || chatLoading) return;

    setInput("");
    setShowForm(false);
    addMsg("user", q);
    setChatLoading(true);

    try {
      const data = await askVeagleBot(q.trim());
      addMsg("bot", data.answer);
      setShowForm(Boolean(data.showForm && data.unrelated));
    } catch {
      addMsg(
        "bot",
        "I'm having a bit of trouble right now. Feel free to reach us at info@veaglespace.com or call +91 82379 99101!",
      );
      setShowForm(false);
    } finally {
      setChatLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      const data = await submitVeagleBotSupport(formData);
      setShowForm(false);
      return { success: true, ticketId: data.ticketId };
    } catch (err) {
      return { success: false, error: err?.message || "Failed to submit." };
    } finally {
      setFormLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk(input);
    }
  };

  return (
    <>
      {/* ── Chat panel ── */}
      {open && (
        <div
          className={`fixed left-3 right-3 z-50 flex w-auto min-w-0 max-w-none flex-col overflow-hidden rounded-[1.8rem] border shadow-xl overscroll-contain sm:left-auto sm:right-4 sm:w-[27.5rem] sm:max-w-[calc(100vw-2rem)] sm:rounded-[2rem] md:w-[29.5rem] lg:w-[31rem] ${PANEL_VIEWPORT_CLASS} ${theme.panel}`}
        >
          {/* Header */}
          <div
            className={`relative flex flex-shrink-0 items-start gap-2.5 overflow-hidden px-3.5 py-3.5 sm:items-start sm:gap-3 sm:px-4 sm:py-4 ${theme.header}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_28%)]" />

            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center sm:h-11 sm:w-11">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1rem] border border-white/25 bg-white p-0.5 shadow sm:rounded-[1.15rem]">
                <Image
                  src="/veagle-logo.webp"
                  alt="Veagle Assistant"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="relative min-w-0 flex-1 pt-0.5">
              <p className="text-[0.98rem] font-semibold leading-tight text-white sm:text-[1.04rem]">
                Veagle Assistant
              </p>
              <p
                className={`pr-2 pt-0.5 text-[0.8rem] leading-[1.3] ${theme.headerSubtle}`}
              >
                Ask us anything about our services
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span
                  className={`text-[0.82rem] leading-none ${theme.statusText}`}
                >
                  Always on
                </span>
              </div>
            </div>

            <button
              onClick={closeChat}
              className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/10 text-white/90 transition hover:bg-white/20 hover:text-white sm:h-11 sm:w-11"
              aria-label="Close Veagle Assistant"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            className={`flex flex-col gap-2.5 px-3.5 py-3.5 sm:px-4 sm:py-4 ${isPristineState ? "flex-none overflow-hidden" : "min-h-0 flex-1 overflow-y-auto"} ${theme.messages}`}
          >
            {messages.length === 0 && (
              <div className="flex items-start gap-2.5">
                <BotAvatar avatarBorder={theme.avatarBorder} />
                <div
                  className={`min-w-0 flex-1 rounded-[1.35rem] rounded-tl-[1rem] px-3.5 py-2.5 ${CHAT_BODY_TEXT_CLASS} ${theme.introBubble}`}
                >
                  Hi! I&apos;m the Veagle Assistant. Ask me anything about our
                  services, career openings, or how to get in touch.
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse items-start" : "items-start"}`}
              >
                {msg.role === "bot" && (
                  <BotAvatar avatarBorder={theme.avatarBorder} />
                )}
                <div
                  className={`max-w-[88%] rounded-[1.35rem] px-3.5 py-2.5 sm:max-w-[84%] ${CHAT_BODY_TEXT_CLASS} ${
                    msg.role === "user"
                      ? `rounded-tr-[1rem] ${theme.userBubble}`
                      : `rounded-tl-[1rem] ${theme.botBubble}`
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-start gap-2.5">
                <BotAvatar avatarBorder={theme.avatarBorder} />
                <div
                  className={`rounded-[1.35rem] rounded-tl-[1rem] px-3.5 py-2.5 ${theme.loaderBubble}`}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 animate-bounce rounded-full ${theme.loaderDot}`}
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showForm && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <BotAvatar avatarBorder={theme.avatarBorder} />
                <SupportForm
                  onSubmit={handleFormSubmit}
                  loading={formLoading}
                  theme={theme}
                />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick questions (shown only before any message) */}
          {messages.length === 0 && (
            <div
              className={`flex-shrink-0 border-t px-3.5 pb-3.5 pt-2.5 ${theme.section} sm:px-4`}
            >
              <p
                className={`mb-2.5 ${CHAT_BODY_TEXT_CLASS} ${theme.sectionText}`}
              >
                Quick questions
              </p>
              <div className="flex flex-col gap-1.5">
                {QUICK_QUESTION_ROWS.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`flex gap-1 ${rowIndex === 0 ? "flex-nowrap" : row.length === 2 ? "flex-wrap sm:flex-nowrap" : ""}`}
                  >
                    {row.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleAsk(q)}
                        className={`${theme.quickButton} ${row.length === 2 ? "min-w-0 flex-1" : "w-fit"} ${rowIndex === 0 ? "whitespace-nowrap px-2.5 text-[11px] sm:px-3" : ""}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div
            className={`flex flex-shrink-0 items-end gap-2.5 border-t px-3.5 py-3 sm:px-4 sm:py-3.5 ${theme.inputWrap}`}
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Veagle anything..."
              className={`min-h-[3rem] max-h-24 flex-1 resize-none overflow-y-auto rounded-[1.35rem] border px-3.5 py-2.5 focus:outline-none sm:min-h-0 sm:max-h-20 ${CHAT_BODY_TEXT_CLASS} ${theme.input}`}
            />
            <button
              onClick={() => handleAsk(input)}
              disabled={!input.trim() || chatLoading}
              className={theme.sendButton}
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating action button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`fixed right-4 z-50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 sm:right-5 ${FAB_POSITION_CLASS} ${theme.fab}`}
          aria-label="Open Veagle Assistant"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquareText className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white/70 dark:ring-slate-950/70" />
          </div>
        </button>
      )}
    </>
  );
}
