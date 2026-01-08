import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Assuming these exist in your project.
import { uploadPdf, sendMessage } from "./api";

// --- Icons (Inline SVGs) ---
const Icons = {
  Attachment: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Send: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Robot: () => (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7V5.73C9.4 5.39 9 4.74 9 4a2 2 0 012-2z" />
    </svg>
  ),
  User: () => (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  DocuMind: () => (
    <svg
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      <path
        d="M9 12a3 3 0 106 0 3 3 0 00-6 0z"
        strokeOpacity="0.5"
        strokeDasharray="2 2"
      />
    </svg>
  ),
  Close: () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const TypingIndicator = () => (
  <div style={styles.typingContainer}>
    <span style={styles.typingDot}></span>
    <span style={{ ...styles.typingDot, animationDelay: "0.2s" }}></span>
    <span style={{ ...styles.typingDot, animationDelay: "0.4s" }}></span>
  </div>
);

const MessageItem = ({ role, text, mode }) => {
  const isUser = role === "user";
  const isSystem = role === "system";

  if (isSystem) {
    return (
      <div style={styles.systemMessage}>
        <span style={{ marginRight: "6px" }}>⚡</span> {text}
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.messageRow,
        backgroundColor: isUser ? "transparent" : "rgba(255,255,255,0.03)",
      }}
    >
      <div style={styles.messageContent}>
        <div
          style={{
            ...styles.avatar,
            backgroundColor: isUser ? "#8b5cf6" : "#10a37f",
            boxShadow: isUser
              ? "0 0 10px rgba(139, 92, 246, 0.3)"
              : "0 0 10px rgba(16, 163, 127, 0.2)",
          }}
        >
          {isUser ? <Icons.User /> : <Icons.Robot />}
        </div>

        <div style={styles.textBubble}>
          <div className="markdown-content" style={styles.messageText}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    style={{ color: "#3b82f6", textDecoration: "underline" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
          <div style={styles.modeTag}>
            {mode === "pdf" ? "📄 Document Context" : "🌐 General Intelligence"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [pdfId, setPdfId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setFileName(file.name);

      const res = await uploadPdf(file);
      setPdfId(res.pdfId);

      setMessages((prev) => [
        ...prev,
        { role: "system", text: `analyzing ${file.name}... Context loaded.` },
      ]);
    } catch (err) {
      setError("Failed to upload. Please try again.");
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Clear PDF Context ---
  const clearPdfContext = () => {
    setPdfId(null);
    setFileName(null);
    setMessages((prev) => [
      ...prev,
      { role: "system", text: "Switched to General Intelligence mode." },
    ]);
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: currentInput }]);
    setLoading(true);

    try {
      const res = await sendMessage(currentInput, pdfId, sessionId);
console.log(sessionId)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.answer,
          mode: res.mode || (pdfId ? "pdf" : "general"),
        },
      ]);
    } catch (err) {
      setError("Connection interrupted. Try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, pdfId, sessionId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Global CSS for Markdown Tables */}
      <style>{`
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; background-color: #131314; }
        * { box-sizing: border-box; }
        .markdown-content { line-height: 1.6; }
        .markdown-content p { margin: 0 0 10px 0; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content table { width: 100%; border-collapse: collapse; margin: 15px 0; background-color: #1e1e1e; border-radius: 8px; overflow: hidden; font-size: 14px; }
        .markdown-content th, .markdown-content td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #2e2e30; }
        .markdown-content th { background-color: #2a2b32; color: #fff; font-weight: 600; border-bottom: 2px solid #3e3e40; }
        .markdown-content tr:last-child td { border-bottom: none; }
        .markdown-content tr:hover { background-color: rgba(255,255,255,0.02); }
        .markdown-content ul, .markdown-content ol { padding-left: 20px; margin: 10px 0; }
      `}</style>

      {/* Toast Notification */}
      {error && <div style={styles.toast}>{error}</div>}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTitle}>
          <div style={styles.logoBox}>DM</div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              DocuMind AI
            </h3>
            <p style={{ margin: 0, fontSize: "11px", color: "#8e8ea0" }}>
              {pdfId ? `Linked: ${fileName}` : "General Intelligence Mode"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* Show "Remove PDF" button only if PDF is loaded */}
          {pdfId && (
            <button
              onClick={clearPdfContext}
              style={styles.iconButton}
              title="Remove PDF & Switch to General Chat"
            >
              <Icons.Close />
            </button>
          )}

          <label style={styles.uploadButton}>
            <Icons.Attachment />
            <span>{pdfId ? "Change File" : "Add Context"}</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              style={{ display: "none" }}
              disabled={loading}
            />
          </label>
        </div>
      </header>

      {/* Chat Area */}
      <div style={styles.chatWrapper}>
        <div style={styles.messagesContainer}>
          {messages.length === 0 && !loading && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Icons.DocuMind />
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "10px",
                  color: "#ececf1",
                }}
              >
                How can DocuMind help?
              </h2>
              <p style={{ lineHeight: "1.6", color: "#9ca3af" }}>
                Ask me general questions, or upload a document <br />
                to analyze contracts, papers, and reports.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <MessageItem key={i} {...m} />
          ))}

          {loading && (
            <div
              style={{
                ...styles.messageRow,
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={styles.messageContent}>
                <div style={{ ...styles.avatar, backgroundColor: "#10a37f" }}>
                  <Icons.Robot />
                </div>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={styles.inputContainer}>
        <div style={styles.inputBoxWrapper}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              pdfId
                ? `Ask about ${fileName}...`
                : "Ask anything, or upload a file for context..."
            }
            style={styles.input}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            style={{
              ...styles.sendButton,
              backgroundColor: input.trim() && !loading ? "#10a37f" : "#40414f",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              color: input.trim() && !loading ? "white" : "#8e8ea0",
            }}
            disabled={!input.trim() || loading}
          >
            <Icons.Send />
          </button>
        </div>
        <p style={styles.footerText}>
          DocuMind AI may make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}

// --- Styles (Dark Mode) ---
const styles = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#131314",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#ececf1",
    position: "absolute",
    top: 0,
    left: 0,
  },
  toast: {
    position: "absolute",
    top: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    border: "1px solid #991b1b",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 24px",
    borderBottom: "1px solid #2e2e30",
    backgroundColor: "rgba(19, 19, 20, 0.95)",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoBox: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #3b82f6 0%, #10a37f 100%)",
    color: "white",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
    letterSpacing: "-1px",
    boxShadow: "0 4px 10px rgba(16, 163, 127, 0.2)",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "#2a2b32",
    color: "#ececf1",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #40414f",
  },
  // New style for the detach button
  iconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    backgroundColor: "#2a2b32",
    color: "#ef4444", // Red color for remove action
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #40414f",
  },
  chatWrapper: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    scrollBehavior: "smooth",
    width: "100%",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingBottom: "20px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    marginTop: "15vh",
    textAlign: "center",
  },
  emptyIcon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#1f2023",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    color: "#ececf1",
    border: "1px solid #2e2e30",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
  messageRow: {
    display: "flex",
    justifyContent: "center",
    padding: "24px 0",
    width: "100%",
    borderBottom: "1px solid transparent",
  },
  messageContent: {
    display: "flex",
    gap: "24px",
    width: "100%",
    maxWidth: "800px",
    padding: "0 24px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    flexShrink: 0,
  },
  textBubble: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    overflow: "hidden",
  },
  messageText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#ececf1",
  },
  systemMessage: {
    textAlign: "center",
    padding: "12px 20px",
    margin: "15px auto",
    fontSize: "12px",
    color: "#9ca3af",
    backgroundColor: "#1e1e1e",
    borderRadius: "20px",
    border: "1px solid #2e2e30",
    width: "fit-content",
    display: "flex",
    alignItems: "center",
  },
  modeTag: {
    fontSize: "10px",
    color: "#6b6c7b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "4px",
    fontWeight: "600",
  },
  inputContainer: {
    padding: "24px",
    backgroundImage:
      "linear-gradient(180deg, rgba(19,19,20,0) 0%, #131314 30%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  inputBoxWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "800px",
    border: "1px solid #40414f",
    borderRadius: "12px",
    padding: "8px 10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    backgroundColor: "#202123",
    transition: "border-color 0.2s",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "10px 12px",
    fontSize: "15px",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    color: "white",
    maxHeight: "200px",
  },
  sendButton: {
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    width: "36px",
    height: "36px",
  },
  footerText: {
    fontSize: "11px",
    color: "#6b6c7b",
    marginTop: "12px",
    textAlign: "center",
  },
  typingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "10px 0",
  },
  typingDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#8e8ea0",
    borderRadius: "50%",
    animation: "bounce 1.4s infinite ease-in-out both",
  },
};

// Add global styles for animations and scrollbars
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #40414f; borderRadius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #565869; }
`;
document.head.appendChild(styleSheet);
