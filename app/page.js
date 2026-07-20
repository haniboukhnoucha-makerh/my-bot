import { useState, useRef, useEffect } from "react";
import { Send, Feather } from "lucide-react";

export default function CorrespondenceBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) throw new Error("The request did not go through.");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "..." }]);
    } catch (err) {
      setError("Something went wrong sending that message. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF7F0",
        display: "flex",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'Courier New', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .cb-root { font-family: 'IBM Plex Mono', monospace; }
        .cb-display { font-family: 'Playfair Display', serif; }
        .cb-scroll::-webkit-scrollbar { width: 8px; }
        .cb-scroll::-webkit-scrollbar-thumb { background: #D8D0C0; border-radius: 4px; }
        .cb-input:focus { outline: 2px solid #1F6F6F; outline-offset: 2px; }
        .cb-send:focus-visible { outline: 2px solid #1F6F6F; outline-offset: 2px; }
        @keyframes blink { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.85; } }
        .cb-dot { animation: blink 1.2s infinite; }
        .cb-dot:nth-child(2) { animation-delay: 0.2s; }
        .cb-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div
        className="cb-root"
        style={{
          width: "100%",
          maxWidth: 640,
          background: "#FFFDF8",
          border: "1px solid #E4DCC8",
          boxShadow: "0 1px 0 #E4DCC8, 0 20px 40px -24px rgba(27,42,74,0.25)",
          display: "flex",
          flexDirection: "column",
          height: "min(760px, calc(100vh - 64px))",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 28px",
            borderBottom: "1px solid #E4DCC8",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Feather size={20} color="#1F6F6F" strokeWidth={1.75} />
          <div>
            <div
              className="cb-display"
              style={{ fontSize: 20, color: "#1B2A4A", fontWeight: 700, lineHeight: 1.2 }}
            >
              Correspondence
            </div>
            <div style={{ fontSize: 11, color: "#8A8272", letterSpacing: "0.04em" }}>
              a running exchange, written line by line
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="cb-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "#A9A08D", fontSize: 13.5, lineHeight: 1.7, paddingTop: 8 }}>
              Nothing written yet. Say something below to begin the correspondence.
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "82%",
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: m.role === "user" ? "#1F6F6F" : "#B5541E",
                  marginBottom: 5,
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                {m.role === "user" ? "You wrote" : "Claude replies"}
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  color: "#2A2A25",
                  whiteSpace: "pre-wrap",
                  borderLeft: m.role === "assistant" ? "2px solid #B5541E" : "none",
                  borderRight: m.role === "user" ? "2px solid #1F6F6F" : "none",
                  paddingLeft: m.role === "assistant" ? 12 : 0,
                  paddingRight: m.role === "user" ? 12 : 0,
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ alignSelf: "flex-start", maxWidth: "82%" }}>
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#B5541E",
                  marginBottom: 5,
                }}
              >
                Claude replies
              </div>
              <div style={{ display: "flex", gap: 4, paddingLeft: 12, borderLeft: "2px solid #B5541E" }}>
                <span className="cb-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#B5541E" }} />
                <span className="cb-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#B5541E" }} />
                <span className="cb-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#B5541E" }} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ fontSize: 13, color: "#A13D2A", background: "#FBEDE7", padding: "10px 14px", border: "1px solid #EAC7B8" }}>
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ borderTop: "1px solid #E4DCC8", padding: "16px 20px", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            className="cb-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your line..."
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              border: "1px solid #E4DCC8",
              background: "#FFFDF8",
              padding: "10px 12px",
              fontSize: 14,
              fontFamily: "'IBM Plex Mono', monospace",
              color: "#2A2A25",
              maxHeight: 120,
            }}
          />
          <button
            className="cb-send"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: loading || !input.trim() ? "#E4DCC8" : "#1B2A4A",
              border: "none",
              cursor: loading || !input.trim() ? "default" : "pointer",
              transition: "background 0.15s ease",
            }}
          >
            <Send size={16} color="#FFFDF8" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

