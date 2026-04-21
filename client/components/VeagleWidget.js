"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageSquareText, SendHorizontal, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { askVeagleBot, submitVeagleBotSupport } from "@/lib/chatbotApi";

// ─── Quick questions shown before any conversation ───────────────────────────
const QUICK_QUESTIONS = [
  "What services do you offer?",
  "How can I get a project quote?",
  "Do you develop mobile apps?",
  "How do I apply for a job?",
  "Where are you located?",
  "How can I contact you?",
];

// ─── Layout constants ─────────────────────────────────────────────────────────
const PANEL_VIEWPORT_CLASS =
  "[--vb-top-gap:5.5rem] [--vb-bottom-gap:5rem] bottom-[calc(env(safe-area-inset-bottom)+var(--vb-bottom-gap))] max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-var(--vb-top-gap)-var(--vb-bottom-gap))] sm:[--vb-bottom-gap:6rem] sm:max-h-[min(720px,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-var(--vb-top-gap)-var(--vb-bottom-gap)))]";

const FAB_POSITION_CLASS =
  "bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:bottom-[calc(env(safe-area-inset-bottom)+1.25rem)]";

const SUPPORT_SUBJECT_MAX = 120;
const SUPPORT_MESSAGE_MAX = 500;

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const CHAT_THEME = {
  light: {
    panel:
      "border border-white/80 bg-white/95 text-slate-900 shadow-[0_28px_80px_rgba(30,112,209,0.18)] backdrop-blur-2xl",
    header: "bg-[linear-gradient(135deg,#0c447c,#1e70d1,#5cd1e5)]",
    headerSubtle: "text-white/80",
    statusText: "text-white/72",
    introBubble: "border border-blue-100 bg-white text-slate-700 shadow-sm",
    botBubble: "border border-blue-100 bg-blue-50/80 text-slate-700 shadow-sm",
    userBubble:
      "bg-[linear-gradient(135deg,#0c447c,#1e70d1)] text-white shadow-md",
    loaderBubble: "border border-blue-100 bg-white shadow-sm",
    loaderDot: "bg-blue-500",
    messages: "bg-transparent",
    section: "border-white/70 bg-white/80 backdrop-blur-xl",
    sectionText: "text-slate-500",
    quickButton:
      "rounded-full border border-blue-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 w-full justify-center text-center sm:w-auto",
    inputWrap: "border-white/70 bg-white/80 backdrop-blur-xl",
    input:
      "border border-blue-200 bg-white text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200",
    sendButton:
      "flex h-11 w-full flex-shrink-0 items-center justify-center rounded-[1.1rem] bg-blue-600 p-0 text-white transition hover:bg-blue-700 disabled:opacity-40 sm:h-10 sm:w-10 sm:rounded-2xl",
    supportCard: "border border-blue-100 bg-white text-slate-800 shadow-sm",
    supportTitle: "text-slate-900",
    supportLabel: "text-slate-500",
    supportReadonly:
      "border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed",
    supportEditable:
      "border border-blue-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200",
    supportNote: "text-slate-500",
    submitButton:
      "w-full rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white tracking-wide transition hover:bg-blue-700 disabled:opacity-50",
    successBox: "bg-emerald-50 border border-emerald-200 text-emerald-800",
    successText: "text-emerald-700",
    avatarBorder: "border-blue-100",
    fab: "h-14 w-14 rounded-[1.7rem] bg-blue-600 text-white shadow-[0_22px_54px_rgba(30,112,209,0.35)] transition hover:bg-blue-700",
    fabActive:
      "h-14 w-14 rounded-[1.7rem] bg-white border border-slate-200 text-slate-700 shadow-md transition hover:bg-slate-50",
  },
  dark: {
    panel:
      "border border-slate-700/80 bg-slate-900/95 text-slate-100 shadow-[0_28px_80px_rgba(3,10,28,0.52)] backdrop-blur-2xl",
    header: "bg-[linear-gradient(135deg,#03123a,#0f4596,#3580e0)]",
    headerSubtle: "text-white/74",
    statusText: "text-white/68",
    introBubble:
      "border border-slate-700 bg-slate-800/90 text-slate-100 shadow-sm",
    botBubble:
      "border border-slate-700 bg-slate-800/80 text-slate-100 shadow-sm",
    userBubble:
      "bg-[linear-gradient(135deg,#1f58bf,#5cd1e5)] text-slate-950 shadow-md",
    loaderBubble: "border border-slate-700 bg-slate-800/80 shadow-sm",
    loaderDot: "bg-cyan-400",
    messages: "bg-transparent",
    section: "border-slate-700/80 bg-slate-950/50 backdrop-blur-xl",
    sectionText: "text-slate-400",
    quickButton:
      "rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-200 shadow-sm transition hover:bg-slate-700 w-full justify-center text-center sm:w-auto",
    inputWrap: "border-slate-700/80 bg-slate-950/50 backdrop-blur-xl",
    input:
      "border border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-500/30",
    sendButton:
      "flex h-11 w-full flex-shrink-0 items-center justify-center rounded-[1.1rem] bg-blue-500 p-0 text-white transition hover:bg-blue-600 disabled:opacity-40 sm:h-10 sm:w-10 sm:rounded-2xl",
    supportCard:
      "border border-slate-700 bg-slate-800/80 text-slate-100 shadow-sm",
    supportTitle: "text-slate-100",
    supportLabel: "text-slate-400",
    supportReadonly:
      "border border-slate-700 bg-slate-900/60 text-slate-500 cursor-not-allowed",
    supportEditable:
      "border border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-500/30",
    supportNote: "text-slate-500",
    submitButton:
      "w-full rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold text-white tracking-wide transition hover:bg-blue-600 disabled:opacity-50",
    successBox:
      "bg-emerald-500/10 border border-emerald-500/25 text-emerald-100",
    successText: "text-emerald-200",
    avatarBorder: "border-blue-400/30",
    fab: "h-14 w-14 rounded-[1.7rem] bg-blue-500 text-white shadow-[0_24px_58px_rgba(3,10,28,0.54)] transition hover:bg-blue-600",
    fabActive:
      "h-14 w-14 rounded-[1.7rem] bg-slate-800 border border-slate-600 text-slate-200 shadow-md transition hover:bg-slate-700",
  },
};

// ─── Bot avatar ───────────────────────────────────────────────────────────────
function BotAvatar({ avatarBorder }) {
  return (
    <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center sm:h-9 sm:w-9">
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[0.9rem] border bg-white p-0.5 shadow-sm sm:rounded-[1rem] ${avatarBorder}`}
      >
        <Image
          src="/veagle-logo.webp"
          alt="Veagle Assistant"
          width={32}
          height={32}
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
      <div className={`rounded-xl p-3 text-sm ${theme.successBox}`}>
        <p className="font-semibold">Query submitted!</p>
        <p className={`mt-0.5 text-xs ${theme.successText}`}>
          Ticket #{ticketId} created. We will reply to {form.email} within 24
          hours.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-[1.25rem] p-3 text-sm sm:flex-1 sm:rounded-[1.4rem] ${theme.supportCard}`}
    >
      <p className={`mb-2 font-bold ${theme.supportTitle}`}>Contact our team</p>
      <div className="flex flex-col gap-2">
        <div>
          <label className={`mb-1 block text-[11px] ${theme.supportLabel}`}>
            Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            maxLength={120}
            placeholder="Your name"
            className={`w-full rounded-xl px-2.5 py-2 text-xs focus:outline-none ${theme.supportEditable}`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label className={`mb-1 block text-[11px] ${theme.supportLabel}`}>
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            maxLength={191}
            placeholder="your@email.com"
            className={`w-full rounded-xl px-2.5 py-2 text-xs focus:outline-none ${theme.supportEditable}`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.email}</p>
          )}
        </div>
        <div>
          <label className={`mb-1 block text-[11px] ${theme.supportLabel}`}>
            Subject
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={set("subject")}
            placeholder="Brief topic"
            maxLength={SUPPORT_SUBJECT_MAX}
            className={`w-full rounded-xl px-2.5 py-2 text-xs focus:outline-none ${theme.supportEditable}`}
          />
        </div>
        <div>
          <label className={`mb-1 block text-[11px] ${theme.supportLabel}`}>
            Message *
          </label>
          <textarea
            value={form.message}
            onChange={set("message")}
            placeholder="How can we help you?"
            rows={3}
            maxLength={SUPPORT_MESSAGE_MAX}
            className={`w-full resize-none rounded-xl px-2.5 py-2 text-xs focus:outline-none ${theme.supportEditable}`}
          />
          {fieldErrors.message && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.message}</p>
          )}
        </div>
        {error && <p className="text-xs text-rose-500">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={theme.submitButton}
        >
          {loading ? "Sending..." : "Send message"}
        </button>
        <p className={`text-center text-[11px] ${theme.supportNote}`}>
          We reply within 24 hours
        </p>
      </div>
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function VeagleWidget() {
  const { isDarkMode, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const bottomRef = useRef(null);

  const resolvedTheme = mounted && isDarkMode ? "dark" : "light";
  const theme = CHAT_THEME[resolvedTheme];

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
      if (data.showForm) setShowForm(true);
    } catch {
      addMsg(
        "bot",
        "I'm having a bit of trouble right now. Feel free to reach us at info@veaglespace.com or call +91 82379 99101!",
      );
      setShowForm(true);
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
          className={`fixed left-3 right-3 z-50 flex w-auto min-w-0 max-w-none flex-col overflow-hidden rounded-[1.75rem] border shadow-xl overscroll-contain sm:left-auto sm:right-4 sm:w-[24rem] sm:max-w-[calc(100vw-2rem)] sm:rounded-[2rem] md:w-[26rem] lg:w-[28rem] ${PANEL_VIEWPORT_CLASS} ${theme.panel}`}
        >
          {/* Header */}
          <div
            className={`relative flex flex-shrink-0 items-start gap-2.5 overflow-hidden px-3.5 py-3.5 sm:items-center sm:gap-3 sm:px-4 sm:py-4 ${theme.header}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_28%)]" />

            <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center sm:h-10 sm:w-10">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1rem] border border-white/25 bg-white p-0.5 shadow sm:rounded-[1.2rem]">
                <Image
                  src="/veagle-logo.webp"
                  alt="Veagle Assistant"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="relative min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight text-white sm:text-[15px]">
                Veagle Assistant
              </p>
              <p
                className={`pr-1 text-[10px] leading-relaxed sm:text-[11px] ${theme.headerSubtle}`}
              >
                Ask us anything about our services
              </p>
              <div className="mt-1 hidden items-center gap-1 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className={`text-[11px] ${theme.statusText}`}>
                  Always on
                </span>
              </div>
            </div>

            <button
              onClick={closeChat}
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/18 bg-white/10 text-white/75 transition hover:bg-white/20 hover:text-white sm:h-9 sm:w-9 sm:rounded-2xl"
              aria-label="Close Veagle Assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            className={`flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3 sm:gap-3 sm:p-4 ${theme.messages}`}
          >
            {messages.length === 0 && (
              <div className="flex items-start gap-2">
                <BotAvatar avatarBorder={theme.avatarBorder} />
                <div
                  className={`max-w-[88%] rounded-2xl rounded-tl-sm px-3 py-2 text-sm leading-relaxed sm:max-w-[84%] ${theme.introBubble}`}
                >
                  Hi! I&apos;m the Veagle Assistant. Ask me anything about our
                  services, career openings, or how to get in touch.
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse items-start" : "items-start"}`}
              >
                {msg.role === "bot" && (
                  <BotAvatar avatarBorder={theme.avatarBorder} />
                )}
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed sm:max-w-[84%] ${
                    msg.role === "user"
                      ? `rounded-tr-sm ${theme.userBubble}`
                      : `rounded-tl-sm ${theme.botBubble}`
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-start gap-2">
                <BotAvatar avatarBorder={theme.avatarBorder} />
                <div
                  className={`rounded-2xl rounded-tl-sm px-3 py-2 ${theme.loaderBubble}`}
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
              className={`flex-shrink-0 border-t px-3 pb-3 ${theme.section} sm:px-4`}
            >
              <p className={`mb-1.5 mt-2 text-[11px] ${theme.sectionText}`}>
                Quick questions
              </p>
              <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleAsk(q)}
                    className={theme.quickButton}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div
            className={`flex flex-shrink-0 flex-col gap-2 border-t px-3 py-3 sm:flex-row sm:items-end sm:gap-2 sm:px-3 sm:py-2.5 ${theme.inputWrap}`}
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Veagle anything..."
              className={`min-h-[48px] max-h-24 flex-1 resize-none overflow-y-auto rounded-[1.1rem] border px-3 py-2 text-sm focus:outline-none sm:min-h-0 sm:max-h-20 sm:rounded-2xl ${theme.input}`}
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
      <button
        onClick={() => (open ? closeChat() : setOpen(true))}
        className={`fixed right-4 z-50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 sm:right-5 ${FAB_POSITION_CLASS} ${open ? theme.fabActive : theme.fab}`}
        aria-label="Open Veagle Assistant"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageSquareText className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white/70 dark:ring-slate-950/70" />
          </div>
        )}
      </button>
    </>
  );
}
