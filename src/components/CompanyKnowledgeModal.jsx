import { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";

export default function CompanyKnowledgeModal({ onClose }) {
  const fileInputRef = useRef(null);
  const [docs, setDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("scope", "company");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setDocs((prev) => [
        ...prev,
        {
          name: data.file.name,
          status: "Indexed"
        }
      ]);
    } catch (error) {
      setDocs((prev) => [
        ...prev,
        {
          name: `Errore upload: ${error.message}`,
          status: "Error"
        }
      ]);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card wide">
        <div className="modal-header">
          <div>
            <div className="eyebrow">Company Knowledge</div>
            <h2>Knowledge aziendale</h2>
          </div>

          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="modal-copy">
          Carica qui i documenti che devono essere disponibili per tutte le ricerche future.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleUpload}
        />

        <div className="knowledge-upload-box">
          <div>
            <strong>Upload documento aziendale</strong>
            <p>
              Il file verrà aggiunto alla Company Knowledge e potrà essere usato dal Navigator in ogni ricerca.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip size={16} />
            {isUploading ? "Caricamento..." : "Carica file"}
          </button>
        </div>

        <div className="modal-section-title">Documenti caricati in questa sessione</div>

        <div className="modal-doc-list">
          {docs.length === 0 && (
            <div className="knowledge-item">
              Nessun documento caricato da questo pannello.
            </div>
          )}

          {docs.map((doc, index) => (
            <div className="modal-doc-item" key={index}>
              <span>{doc.name}</span>
              <span className="doc-status">{doc.status}</span>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
