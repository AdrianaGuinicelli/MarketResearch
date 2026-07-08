import { useEffect, useRef, useState } from "react";
import { Paperclip, X, Trash2, Loader2 } from "lucide-react";

export default function CompanyKnowledgeModal({ onClose }) {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function loadFiles() {
    setLoading(true);

    try {
      const response = await fetch("/api/company-files");
      const data = await response.json();

      setFiles(data.files || []);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function uploadFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("scope", "company");

    try {
      await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      await loadFiles();
    } catch (e) {
      console.error(e);
    }

    setUploading(false);
    event.target.value = "";
  }

  async function deleteFile(fileId) {
    if (!window.confirm("Eliminare questo documento dalla Company Knowledge?"))
      return;

    try {
      await fetch(`/api/company-files?fileId=${fileId}`, {
        method: "DELETE"
      });

      await loadFiles();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card wide">

        <div className="modal-header">

          <div>
            <div className="eyebrow">
              Company Knowledge
            </div>

            <h2>Knowledge aziendale</h2>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>

        </div>

        <p className="modal-copy">
          Tutti i documenti caricati qui saranno disponibili automaticamente
          in ogni futura ricerca.
        </p>

        <input
          ref={inputRef}
          type="file"
          hidden
          onChange={uploadFile}
        />

        <button
          className="primary-button"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
        >
          <Paperclip size={16} />

          {uploading
            ? "Caricamento..."
            : "Carica documento"}
        </button>

        <div
          style={{
            marginTop: 28
          }}
        >

          <strong>Documenti indicizzati</strong>

          <div
            style={{
              marginTop: 15
            }}
          >

            {loading && (
              <Loader2
                size={20}
                className="spin"
              />
            )}

            {!loading && files.length === 0 && (
              <div className="knowledge-item">
                Nessun documento presente.
              </div>
            )}

            {!loading &&
              files.map((file) => (

                <div
                  key={file.fileId}
                  className="knowledge-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontWeight: 700
                      }}
                    >
                      {file.name}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#777"
                      }}
                    >
                      {file.status}
                    </div>

                  </div>

                  <button
                    className="icon-button"
                    onClick={() => deleteFile(file.fileId)}
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              ))}

          </div>

        </div>

        <div className="modal-actions">

          <button
            className="secondary-button"
            onClick={onClose}
          >
            Chiudi
          </button>

        </div>

      </div>
    </div>
  );
}
