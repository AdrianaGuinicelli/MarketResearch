export default function NewResearchModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="eyebrow">New Workspace</div>
        <h2>Nuova ricerca di mercato</h2>
        <p className="modal-copy">
          Inserisci solo le informazioni essenziali. Il Navigator ti aiuterà a definire il resto.
        </p>

        <label>Titolo ricerca</label>
        <input placeholder="Es. Data Centers India" />

        <label>Esigenza iniziale</label>
        <textarea
          rows={4}
          placeholder="Es. Sto cercando di capire se il mercato dei data center in India possa essere una buona opportunità per CAREL."
        />

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>Annulla</button>
          <button className="primary-button" onClick={onClose}>Crea ricerca</button>
        </div>
      </div>
    </div>
  );
}
