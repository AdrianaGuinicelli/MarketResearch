export default function CompleteMilestoneModal({ onClose, onSave }) {
  const fileName = "2026_07_07_Industrial_Heat_Pumps_Setup.md";

  return (
    <div className="modal-overlay">
      <div className="modal-card wide">
        <div className="eyebrow">Milestone review</div>
        <h2>Setup pronta per revisione</h2>

        <p className="modal-copy">
          Il Navigator ha preparato una bozza dell'output di fase. Puoi
          salvarla nella cartella della ricerca o continuare a lavorarci.
        </p>

        <div className="output-preview">
          <div className="output-file-name">{fileName}</div>

          <h3>Industrial Heat Pumps - Setup</h3>

          <p>
            Obiettivo preliminare: capire se il mercato delle pompe di calore
            industriali merita un approfondimento strategico per CAREL.
          </p>

          <p>
            Prossimo passo suggerito: chiarire se l'opportunità nasce da trend
            di mercato, richieste cliente o sviluppo prodotto interno.
          </p>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Continua nella chat
          </button>
          <button className="primary-button" onClick={onSave}>
            Salva output
          </button>
        </div>
      </div>
    </div>
  );
}
