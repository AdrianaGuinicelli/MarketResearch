import { X } from "lucide-react";

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
          Puoi dichiarare completata una milestone quando ritieni che quella parte della ricerca sia sufficientemente matura. Non è obbligatorio seguire un ordine rigido.
        </p>

        <div className="milestone-panel-list">
          {milestones.map((milestone, index) => {
            const isLocked = milestone.status === "locked";
            const isCompleted = milestone.status === "completed";
            const isActive = milestone.key === activeMilestone.key;

            return (
              <div key={milestone.key} className={`milestone-panel-item ${milestone.status}`}>
                <div className="milestone-panel-content">
                  <strong>{index + 1}. {milestone.label}</strong>

                  <span>
                    {isCompleted && "Completed"}
                    {!isCompleted && isActive && "Active"}
                    {!isCompleted && !isActive && !isLocked && "Available"}
                    {isLocked && "Locked"}
                  </span>
                </div>

                <div className="milestone-panel-action">
                  {isCompleted && <span className="doc-status">Completed</span>}

                  {!isCompleted && !isLocked && (
                    <button className="secondary-button compact" onClick={() => onComplete(milestone)}>
                      Completa
                    </button>
                  )}

                  {isLocked && <span className="locked-label">Locked</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="output-preview">
          <div className="output-file-name">
            Milestone attiva: {activeMilestone.label}
          </div>

          <p>
            Quando completi una milestone, il Navigator ti chiederà se vuoi salvare l’output nella knowledge della ricerca o nella Company Knowledge.
          </p>
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
