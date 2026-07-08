import { Paperclip, X } from "lucide-react";

const companyDocs = [
  "Market Research Scoping Sheet",
  "E089 DC Scroll Chiller Value Proposition",
  "Brochure KaizenHub.pdf"
];

export default function CompanyKnowledgeModal({ onClose, onUpload }) {
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

        <div className="knowledge-upload-box">
          <div>
            <strong>Upload documento aziendale</strong>
            <p>
              Il file verrà aggiunto alla Company Knowledge e potrà essere usato dal Navigator in ogni ricerca.
            </p>
          </div>

          <button className="primary-button" onClick={onUpload}>
            <Paperclip size={16} />
            Carica file
          </button>
        </div>

        <div className="modal-section-title">Documenti indicizzati</div>

        <div className="modal-doc-list">
          {companyDocs.map((doc) => (
            <div className="modal-doc-item" key={doc}>
              <span>{doc}</span>
              <span className="doc-status">Indexed</span>
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
