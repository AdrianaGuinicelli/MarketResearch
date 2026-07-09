import { useEffect, useRef, useState } from "react";
import { Paperclip, X, Trash2, Loader2, Eye } from "lucide-react";

export default function CompanyKnowledgeModal({ onClose }) {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [showFiles, setShowFiles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function loadFiles() {
    setLoadingFiles(true);

    try {
      const response = await fetch("/api/company-files");
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error(error);
    }

    setLoadingFiles(false);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function uploadFiles(fileList) {
    const selectedFiles = Array.from(fileList || []);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadedCount(0);

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

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

      setUploadedCount(data.uploadedCount || selectedFiles.length);
      await loadFiles();
    } catch (error) {
      console.error(error);
      alert(`Errore upload: ${error.message}`);
    }

    setUploading(false);
  }

  function handleInputChange(event) {
    uploadFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    uploadFiles(event.dataTransfer.files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  async function deleteFile(fileId) {
    if (!window.confirm("Eliminare questo documento dalla Company Knowledge?")) {
      return;
    }

    try {
      await fetch(`/api/company-files?fileId=${fileId}`, {
        method: "DELETE"
      });

      await loadFiles();
    } catch (error) {
      console.error(error);
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
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={handleInputChange}
        />

        <div
          className={`dropzone ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <Paperclip size={22} />
          <strong>
            {uploading ? "Caricamento in corso..." : "Trascina qui i file o clicca per caricare"}
          </strong>
          <span>
            Puoi caricare più documenti contemporaneamente.
          </span>
        </div>

        {uploadedCount > 0 && (
          <div className="upload-feedback">
            {uploadedCount} file caricati nella Company Knowledge.
          </div>
        )}

        <div className="company-files-toolbar">
          <button
            className="secondary-button"
            onClick={() => setShowFiles((prev) => !prev)}
          >
            <Eye size={16} />
            {showFiles ? "Nascondi elenco file" : "Vedi elenco file"}
          </button>

          {loadingFiles && <Loader2 size={18} className="spin" />}
        </div>

        {showFiles && (
          <div className="modal-doc-list">
            {files.length === 0 && (
              <div className="knowledge-item">
                Nessun documento presente nella Company Knowledge.
              </div>
            )}

            {files.map((file) => (
              <div className="modal-doc-item" key={file.fileId}>
                <div>
                  <strong>{file.name}</strong>
                  <div className="file-status">{file.status}</div>
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
        )}

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
