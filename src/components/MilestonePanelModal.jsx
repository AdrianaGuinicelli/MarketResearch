import { CheckCircle2, Circle, Lock, X } from "lucide-react";

export default function MilestonePanelModal({
  milestones,
  activeMilestone,
  onClose,
  onComplete
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card wide">
        <div className="modal-header">
          <div>
            <div className="eyebrow">Research progress</div>
            <h2>Milestone della ricerca</h2>
          </div>

          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="modal-copy">
          Le milestone indicano la maturità della ricerca. Puoi completare la
          milestone attiva quando ritieni che il lavoro sia pronto per essere
          salvato o validato.
        </p>

        <div className="milestone-panel-list">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.key}
              className={`milestone-panel-item ${milestone.status}`}
            >
              <div className="milestone-panel-icon">
                {milestone.status === "completed" && <CheckCircle2 size={18} />}
                {milestone.status === "active" && <Circle size={18} />}
                {milestone.status === "todo" && <Circle size={18} />}
                {milestone.status === "locked" && <Lock size={18} />}
              </div>

              <div className="milestone-panel-content">
                <strong>
                  {index + 1}. {milestone.label}
                </strong>

                <span>
                  {milestone.status === "completed" && "Completata"}
                  {milestone.status === "active" && "Attiva"}
                  {milestone.status === "todo" && "Da completare"}
                  {milestone.status === "locked" && "Bloccata"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="output-preview">
          <div className="output-file-name">
            Milestone attiva: {activeMilestone.label}
          </div>

          <p>
            Se completi questa milestone, il Navigator ti chiederà se vuoi
            salvare l’output nella knowledge della ricerca o nella Company
            Knowledge.
          </p>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Chiudi
          </button>

          <button className="primary-button" onClick={onComplete}>
            Completa milestone attiva
          </button>
        </div>
      </div>
    </div>
  );
}
