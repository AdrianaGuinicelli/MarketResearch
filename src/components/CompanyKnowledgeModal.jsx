import { X, ShieldCheck, Folder, FileText, Clock, Send } from "lucide-react";

export default function CompanyKnowledgeModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card wide">
        <div className="modal-header">
          <div>
            <div className="eyebrow">Enterprise Knowledge</div>
            <h2>Company Knowledge Repository</h2>
          </div>

          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="modal-copy">
          La Company Knowledge è riservata. Gli utenti non possono vedere,
          scaricare o consultare direttamente i documenti indicizzati.
          Il Navigator può usarli solo per generare risposte e insight.
        </p>

        <div className="repository-status-card">
          <div className="repository-status-icon">
            <ShieldCheck size={28} />
          </div>

          <div>
            <strong>Repository protetto</strong>
            <p>
              Accessibile solo all’AI, agli amministratori e ai manager autorizzati.
            </p>
          </div>
        </div>

        <div className="repository-stats-grid">
          <div className="repository-stat">
            <Folder size={20} />
            <span>Folders</span>
            <strong>—</strong>
          </div>

          <div className="repository-stat">
            <FileText size={20} />
            <span>Documents</span>
            <strong>—</strong>
          </div>

          <div className="repository-stat">
            <Clock size={20} />
            <span>Last sync</span>
            <strong>Not available</strong>
          </div>
        </div>

        <div className="output-preview">
          <div className="output-file-name">Approval workflow</div>

          <p>
            Alla fine di una ricerca, l’utente potrà inviare gli output al proprio
            manager per approvazione. Solo dopo l’approvazione i documenti potranno
            entrare nella Company Knowledge.
          </p>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Chiudi
          </button>

          <button className="primary-button" disabled>
            <Send size={16} />
            Submit research for approval
          </button>
        </div>
      </div>
    </div>
  );
}
