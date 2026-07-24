import React, { useEffect, useRef, useState } from "react";
import { MdChatBubbleOutline, MdClose, MdSend } from "react-icons/md";

const FAQ = [
  { match: /attendance/i, reply: "Your attendance is weighted at 30% of your composite score. You can view a full day-by-day breakdown under the Attendance tab." },
  { match: /marks|grade|score/i, reply: "Internal assessment marks make up 40% of your composite score. Faculty upload marks per course under the Marks module." },
  { match: /assignment|submission/i, reply: "Assignment submission timeliness contributes 30% to your composite score. Late or missing submissions lower this component." },
  { match: /risk|warning|at-risk/i, reply: "A composite score below 65 triggers an At-Risk warning, notifying the student, parent, faculty and admin by email and in-app alert." },
  { match: /password|login|forgot/i, reply: "Use 'Forgot password' on the login page - a reset link is emailed to your registered address and expires after 30 minutes." },
  { match: /parent/i, reply: "Parents get read-only access to their linked student's attendance, marks, assignments and warning alerts." },
  { match: /contact|support|help desk/i, reply: "For anything I can't answer, please reach the academic office at support@university.edu." },
];

const DEFAULT_REPLY = "I can help with attendance, marks, assignments, warnings, or your account. Could you rephrase your question?";

const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm the SPMS help assistant. Ask me about attendance, marks, assignments or warnings." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const matched = FAQ.find((f) => f.match.test(text));
    setMessages((m) => [
      ...m,
      { from: "user", text },
      { from: "bot", text: matched ? matched.reply : DEFAULT_REPLY },
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] card-surface flex flex-col overflow-hidden animate-in">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-navy-950">
            <p className="font-display font-semibold text-sm">SPMS Help Assistant</p>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><MdClose size={18} /></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                m.from === "bot"
                  ? "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200 rounded-bl-sm"
                  : "bg-cyan-500 text-navy-950 ml-auto rounded-br-sm"
              }`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2.5 border-t border-slate-200 dark:border-white/5 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your question..."
              className="input-field !py-2 flex-1"
            />
            <button onClick={send} className="btn-primary !p-2.5" aria-label="Send">
              <MdSend size={16} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 shadow-glow flex items-center justify-center text-navy-950 hover:scale-105 active:scale-95 transition"
        aria-label="Toggle help chat"
      >
        {open ? <MdClose size={24} /> : <MdChatBubbleOutline size={24} />}
      </button>
    </div>
  );
};

export default ChatBox;
