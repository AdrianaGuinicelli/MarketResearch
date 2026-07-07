import { Plus, Search } from "lucide-react";

export default function ResearchSidebar({ researches, selectedResearch, onSelect, onNewResearch }) {
  return (
    <aside className="left-sidebar">
      <button className="new-research-button" onClick={onNewResearch}>
        <Plus size={17} />
        Nuova ricerca
      </button>

      <div className="sidebar-search">
        <Search size={15} />
        <input placeholder="Cerca ricerche..." />
      </div>

      <div className="sidebar-section-title">Ricerche recenti</div>

      <div className="research-list">
        {researches.map((research) => (
          <button
            key={research.id}
            className={`research-card ${selectedResearch.id === research.id ? "selected" : ""}`}
            onClick={() => onSelect(research)}
          >
            <span className="research-card-title">{research.title}</span>
            <span className="research-card-meta">{research.status} · {research.progress}%</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
