import { Paperclip, Send } from "lucide-react";

export default function ChatWorkspace({ messages }) {
  return (
    <section className="chat-workspace">
      <div className="chat-header">
        <div>
          <div className="eyebrow">Workspace</div>
          <h2>Conversazione di ricerca</h2>
        </div>
        <span className="status-pill">MOC frontend</span>
      </div>

      <div className="messages-panel">
        {messages.map((message, index) => (
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
        <button className="icon-button"><Paperclip size={18} /></button>
        <textarea placeholder="Scrivi al Market Research Navigator..." rows={1} />
        <button className="send-button"><Send size={18} /></button>
      </div>
    </section>
  );
}
