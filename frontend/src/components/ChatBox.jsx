import React, { useEffect, useRef, useState } from "react";
import {
  MdAutoAwesome,
  MdClose,
  MdSend,
  MdRefresh,
  MdContentCopy,
  MdDeleteOutline,
  MdChatBubbleOutline,
  MdSmartToy,
  MdPerson,
  MdCheck,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { aiAssistantApi } from "../services/mockApi";

const SUGGESTIONS = {
  student: [
    "What is my current attendance percentage?",
    "Explain my composite score & risk rating",
    "Do I have any pending fee balance?",
    "Which assignments are due this week?",
    "Create a 7-day exam revision plan",
  ],
  faculty: [
    "Generate a 5-question concept quiz",
    "Suggest a structured 50-minute lesson plan",
    "Summarize attendance trends across my classes",
    "Explain the 30-day attendance correction rule",
  ],
  admin: [
    "Generate institutional intelligence report",
    "Show at-risk student count & recovery steps",
    "Summarize pending attendance correction approvals",
    "Review fee collection and outstanding dues",
  ],
  parent: [
    "What is my child's current attendance rate?",
    "Explain the early warning risk criteria",
    "How can I request a teacher meeting?",
  ],
};

const ChatBox = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "m_welcome",
      from: "assistant",
      text: `Hello ${user?.fullName?.split(" ")[0] || "there"}! I am **E-Zen AI**, your academic copilot. I am connected to your live institutional data — ask me about attendance records, composite scores, syllabus, fees, or study schedules.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);

  const role = user?.role || "student";
  const promptList = SUGGESTIONS[role] || SUGGESTIONS.student;

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, open, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      from: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiAssistantApi.chat({
        message: query,
        user,
        history: messages.slice(-6),
      });

      const botMsg = {
        id: `bot_${Date.now()}`,
        from: "assistant",
        text: res.reply || "I have analyzed your request based on your institutional context.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          from: "assistant",
          text: "⚠️ Sorry, I could not complete the request at this moment. Please retry.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `m_fresh_${Date.now()}`,
        from: "assistant",
        text: "Conversation cleared. How can I assist you with your academic work today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Basic safe markdown parser for bold, bullet points, headers
  const formatMarkdown = (content) => {
    return content.split("\n").map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="font-bold text-sm text-[#00E5FF] mt-2 mb-1">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="font-bold text-base text-white mt-2 mb-1">{line.replace("## ", "")}</h3>;
      }
      // Bullets
      if (line.startsWith("- ")) {
        const item = line.replace("- ", "");
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-xs my-0.5 leading-relaxed">
            {renderInlineMarkdown(item)}
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={idx} className="text-xs text-slate-200 my-1 leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>
        );
      }
      return (
        <p key={idx} className="text-xs text-slate-200 my-1 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Expanded Chat Drawer */}
      {open && (
        <div className="mb-3 w-[92vw] sm:w-[420px] h-[540px] card-surface flex flex-col overflow-hidden border border-white/20 shadow-card animate-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0D0819] via-[#130D24] to-[#1D1435] border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] shadow-glow">
                <div className="w-full h-full bg-[#0D0819] rounded-[7px] flex items-center justify-center text-[#00E5FF]">
                  <MdAutoAwesome size={16} />
                </div>
              </div>
              <div>
                <p className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                  E-Zen Assistant
                  <span className="badge-cyan text-[9px] px-1.5 py-0.2">AI COPILOT</span>
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  Context: {user?.institutionType || "College"} {user?.role || "Student"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                onClick={handleClear}
                title="Clear Conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
              >
                <MdDeleteOutline size={18} />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
              >
                <MdClose size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#06030C]/60">
            {messages.map((m) => {
              const isBot = m.from === "assistant";
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
                >
                  {isBot && (
                    <div className="w-6 h-6 rounded-md bg-[#8E4585]/30 border border-[#8E4585]/50 flex items-center justify-center text-[#C476BB] shrink-0 mt-1">
                      <MdSmartToy size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm relative group ${
                      isBot
                        ? "bg-[#130D24] text-slate-200 border border-white/10 rounded-tl-sm"
                        : "bg-[#00E5FF] text-[#06030C] font-medium rounded-tr-sm"
                    }`}
                  >
                    <div>{isBot ? formatMarkdown(m.text) : m.text}</div>
                    <div
                      className={`flex items-center justify-between text-[10px] mt-1.5 opacity-70 ${
                        isBot ? "text-slate-400" : "text-[#06030C]"
                      }`}
                    >
                      <span>{m.time}</span>
                      {isBot && (
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          title="Copy reply"
                          className="opacity-0 group-hover:opacity-100 transition ml-2 hover:text-[#00E5FF]"
                        >
                          {copiedId === m.id ? <MdCheck size={12} className="text-emerald-400" /> : <MdContentCopy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-6 h-6 rounded-md bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shrink-0 mt-1">
                      <MdPerson size={14} />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400 py-2">
                <div className="w-6 h-6 rounded-md bg-[#8E4585]/30 flex items-center justify-center text-[#C476BB] animate-spin">
                  <MdAutoAwesome size={14} />
                </div>
                <span>E-Zen AI is analyzing authorized institutional data...</span>
              </div>
            )}
          </div>

          {/* Prompt Suggestions */}
          <div className="px-3 py-2 border-t border-white/10 bg-[#0B0716]/90 overflow-x-auto flex gap-1.5 scrollbar-none">
            {promptList.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 hover:border-[#00E5FF]/40 hover:text-[#00E5FF] whitespace-nowrap transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-2.5 border-t border-white/10 bg-[#0D0819] flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask attendance, scores, study plans, syllabus..."
              disabled={loading}
              className="input-field !py-2 text-xs flex-1"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="btn-primary !p-2 rounded-xl shrink-0"
              aria-label="Send query"
            >
              <MdSend size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00E5FF] via-[#8E4585] to-[#00E5FF] shadow-glow flex items-center justify-center text-[#06030C] hover:scale-105 active:scale-95 transition-all group"
        aria-label="Open E-Zen AI Assistant"
      >
        {open ? (
          <MdClose size={26} className="text-white" />
        ) : (
          <div className="relative">
            <MdAutoAwesome size={26} className="text-[#06030C]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white shadow-glow" />
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatBox;
