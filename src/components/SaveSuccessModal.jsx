export default function SaveSuccessModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="eyebrow">Output saved</div>
        <h2>Output salvato</h2>

        <p className="modal-copy">
          Il file è stato salvato nella cartella della ricerca e la milestone
          Setup è stata marcata come completata nella demo.
        </p>

        <div className="folder-preview">
          <div>📁 2026_07_07_Industrial_Heat_Pumps</div>
          <div>📄 2026_07_07_Industrial_Heat_Pumps_Setup.md</div>
        </div>

        <div className="modal-actions">
          <button className="primary-button" onClick={onClose}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
