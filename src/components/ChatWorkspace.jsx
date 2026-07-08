import { useState } from "react";
import { Paperclip, Send } from "lucide-react";

export default function ChatWorkspace({ messages }) {
  const [chatMessages, setChatMessages] = useState(messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      text: input
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage.text
        })
      });

      const data = await response.json();

      const aiMessage = {
        role: "ai",
        text: data.reply || data.error || "No response generated."
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Errore nel collegamento con il Navigator."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <section className="chat-workspace">
      <div className="chat-header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h2>Conversazione di ricerca</h2>
        </div>
        <span className="status-pill">
          {isLoading ? "Thinking..." : "AI connected"}
        </span>
      </div>

      <div className="messages-panel">
        {chatMessages.map((message, index) => (
          <div className={`message-row ${message.role}`} key={index}>
            <div className={`message-bubble ${message.role}`}>
              {message.text.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="composer">
        <button className="icon-button">
          <Paperclip size={18} />
        </button>

        <textarea
          placeholder="Scrivi al Market Research Navigator..."
          rows={1}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <button className="send-button" onClick={handleSend} disabled={isLoading}>
          <Send size={18} />
        </button>
      </div>
    </section>
  );
}
