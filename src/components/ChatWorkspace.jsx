import { useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";

function extractKnowledgeUsed(text) {
  const knowledge = {
    companyDocuments: [],
    previousResearch: [],
    webSources: [],
    userInputs: []
  };

  const sectionStart = text.indexOf("Knowledge Used:");
  if (sectionStart === -1) return knowledge;

  const section = text.slice(sectionStart);

  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  lines.forEach((line) => {
    if (line.startsWith("- Company Knowledge:")) {
      const value = line.replace("- Company Knowledge:", "").trim();
      if (value && value !== "None") knowledge.companyDocuments.push(value);
    }

    if (line.startsWith("- Research Knowledge:")) {
      const value = line.replace("- Research Knowledge:", "").trim();
      if (value && value !== "None") knowledge.previousResearch.push(value);
    }

    if (line.startsWith("- Web sources:")) {
      const value = line.replace("- Web sources:", "").trim();
      if (value && value !== "None") knowledge.webSources.push(value);
    }

    if (line.startsWith("- User inputs and attachments:")) {
      const value = line.replace("- User inputs and attachments:", "").trim();
      if (value && value !== "None") knowledge.userInputs.push(value);
    }
  });

  return knowledge;
}

export default function ChatWorkspace({ messages, onKnowledgeUsedChange }) {
  const [chatMessages, setChatMessages] = useState(messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

      const reply = data.reply || data.error || "No response generated.";

      const aiMessage = {
        role: "ai",
        text: reply
      };

      setChatMessages((prev) => [...prev, aiMessage]);

      if (onKnowledgeUsedChange) {
        onKnowledgeUsedChange(extractKnowledgeUsed(reply));
      }
    } catch {
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

  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("scope", "research");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const fileName = data.files?.[0]?.name || data.file?.name || file.name;

      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Documento caricato nella knowledge della ricerca: ${fileName}`
        }
      ]);

      if (onKnowledgeUsedChange) {
        onKnowledgeUsedChange((prev) => ({
          ...prev,
          userInputs: [
            ...(prev?.userInputs || []),
            `Uploaded attachment: ${fileName}`
          ]
        }));
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Errore durante il caricamento del documento: ${error.message}`
        }
      ]);
    } finally {
      setIsUploading(false);
      event.target.value = "";
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
          {isUploading ? "Uploading..." : isLoading ? "Thinking..." : "AI connected"}
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
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        <button
          className="icon-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isLoading}
          title="Carica documento nella Research Knowledge"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          placeholder="Scrivi al Market Research Navigator..."
          rows={1}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isUploading}
        />

        <button
          className="send-button"
          onClick={handleSend}
          disabled={isLoading || isUploading}
        >
          <Send size={18} />
        </button>
      </div>
    </section>
  );
}
