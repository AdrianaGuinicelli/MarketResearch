import { Building2, FileText, Globe2, UserRound } from "lucide-react";

const groups = [
  ["Company Knowledge", "companyDocuments", Building2],
  ["Research Knowledge", "previousResearch", FileText],
  ["Web sources", "webSources", Globe2],
  ["User inputs", "userInputs", UserRound]
];

export default function KnowledgePanel({ knowledge }) {
  const totalItems = groups.reduce(
    (total, [, key]) => total + (knowledge[key]?.length || 0),
    0
  );

  return (
    <aside className="knowledge-panel">
      <div className="panel-heading">
        <div className="eyebrow">Evidence</div>
        <h2>Knowledge Used</h2>
      </div>

      {totalItems === 0 && (
        <div className="knowledge-empty">
          No knowledge used yet.
        </div>
      )}

      {totalItems > 0 &&
        groups.map(([label, key, Icon]) => {
          const items = knowledge[key] || [];

          if (items.length === 0) return null;

          return (
            <section className="knowledge-group" key={key}>
              <div className="knowledge-group-title">
                <Icon size={16} />
                <span>{label}</span>
              </div>

              {items.map((item, index) => (
                <div className="knowledge-item" key={index}>
                  {item}
                </div>
              ))}
            </section>
          );
        })}
    </aside>
  );
}
