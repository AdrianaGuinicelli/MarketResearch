import { useMemo, useState } from "react";
import {
  X,
  ShieldCheck,
  Folder,
  FileText,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function CompanyKnowledgeModal({
  onClose,
  researches = [],
  currentUser = {
    name: "Current user",
    managerEmail: ""
  },
  repositoryStats = {
    folders: "—",
    documents: "—",
    lastSync: "Not available"
  }
}) {
  const [selectedResearchId, setSelectedResearchId] = useState("");
  const [managerEmail, setManagerEmail] = useState(
    currentUser.managerEmail || ""
  );
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [error, setError] = useState("");

  const selectedResearch = useMemo(
    () =>
      researches.find(
        (research) => String(research.id) === String(selectedResearchId)
      ),
    [researches, selectedResearchId]
  );

  const isResearchComplete =
    selectedResearch && Number(selectedResearch.progress) === 100;

  const canSubmit =
    selectedResearch &&
    isResearchComplete &&
    managerEmail.trim() &&
    !isSubmitting;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    setIsSubmitting(true);
    setError("");
    setSubmissionResult(null);

    try {
      const response = await fetch("/api/approval-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          researchId: selectedResearch.id,
          researchTitle: selectedResearch.title,
          researchOwner: currentUser.name,
          researchProgress: selectedResearch.progress,
          managerEmail: managerEmail.trim(),
          note: note.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossibile inviare la richiesta di approvazione."
        );
      }

      setSubmissionResult(data.approvalRequest);
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card wide">
        <div className="modal-header">
          <div>
            <div className="eyebrow">Enterprise Knowledge</div>
            <h2>Company Knowledge Repository</h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Chiudi"
          >
            <X size={18} />
          </button>
        </div>

        <p className="modal-copy">
          La Company Knowledge è riservata. Gli utenti non possono vedere,
          scaricare o consultare direttamente i documenti indicizzati. Il
          Navigator può usarli per generare risposte e insight, applicando le
          regole di riservatezza aziendale.
        </p>

        <div className="repository-status-card">
          <div className="repository-status-icon">
            <ShieldCheck size={28} />
          </div>

          <div>
            <strong>Repository protetto</strong>
            <p>
              Accessibile solo all’AI, agli amministratori e ai manager
              autorizzati.
            </p>
          </div>
        </div>

        <div className="repository-stats-grid">
          <div className="repository-stat">
            <Folder size={20} />
            <span>Folders</span>
            <strong>{repositoryStats.folders}</strong>
          </div>

          <div className="repository-stat">
            <FileText size={20} />
            <span>Documents</span>
            <strong>{repositoryStats.documents}</strong>
          </div>

          <div className="repository-stat">
            <Clock size={20} />
            <span>Last sync</span>
            <strong>{repositoryStats.lastSync}</strong>
          </div>
        </div>

        <form className="approval-form" onSubmit={handleSubmit}>
          <div className="approval-form-heading">
            <div>
              <div className="output-file-name">Approval workflow</div>
              <h3>Invia una ricerca al manager</h3>
            </div>
          </div>

          <label htmlFor="approval-research">
            Ricerca da sottoporre
          </label>

          <select
            id="approval-research"
            value={selectedResearchId}
            onChange={(event) => {
              setSelectedResearchId(event.target.value);
              setSubmissionResult(null);
              setError("");
            }}
          >
            <option value="">Seleziona una tua ricerca</option>

            {researches.map((research) => (
              <option key={research.id} value={research.id}>
                {research.title} — {research.progress || 0}%
              </option>
            ))}
          </select>

          {selectedResearch && (
            <div
              className={`approval-research-status ${
                isResearchComplete ? "complete" : "incomplete"
              }`}
            >
              {isResearchComplete ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}

              <div>
                <strong>{selectedResearch.title}</strong>

                <span>
                  {isResearchComplete
                    ? "Ricerca completata e pronta per essere sottoposta."
                    : `Ricerca completata al ${
                        selectedResearch.progress || 0
                      }%. Deve arrivare al 100% prima dell’invio.`}
                </span>
              </div>
            </div>
          )}

          <label htmlFor="manager-email">
            Email del manager
          </label>

          <input
            id="manager-email"
            type="email"
            value={managerEmail}
            onChange={(event) => setManagerEmail(event.target.value)}
            placeholder="nome.cognome@azienda.com"
          />

          <label htmlFor="approval-note">
            Nota per il manager
          </label>

          <textarea
            id="approval-note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Contesto, raccomandazioni o aspetti da verificare..."
          />

          {error && (
            <div className="approval-message error">
              {error}
            </div>
          )}

          {submissionResult && (
            <div className="approval-message success">
              <CheckCircle2 size={18} />

              <div>
                <strong>Richiesta inviata</strong>
                <span>
                  Stato: Pending approval · Manager:{" "}
                  {submissionResult.managerEmail}
                </span>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Chiudi
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={!canSubmit}
            >
              <Send size={16} />
              {isSubmitting
                ? "Invio in corso..."
                : "Submit for approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
