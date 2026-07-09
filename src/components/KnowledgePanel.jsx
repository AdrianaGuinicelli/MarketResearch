import { Building2, FileText, Globe2, UserRound } from "lucide-react";

const groups = [
  ["Company Knowledge", "companyDocuments", Building2],
  ["Research Knowledge", "previousResearch", FileText],
  ["Web sources", "webSources", Globe2],
  ["User inputs", "userInputs", UserRound]
];

export default function KnowledgePanel({ knowledge }) {
  return (
    <aside className="knowledge-panel">
      <div className="panel-heading">
        <div className="eyebrow">Evidence</div>
        <h2>Knowledge Used</h2>
      </div>

      {groups.map(([label, key, Icon]) => {
        const items = knowledge[key] || [];

        return (
          <section className="knowledge-group" key={key}>
            <div className="knowledge-group-title">
              <Icon size={16} />
              <span>{label}</span>
            </div>

            {items.length === 0 ? (
              <div className="knowledge-item empty">
                No knowledge used yet
              </div>
            ) : (
              items.map((item, index) => (
                <div className="knowledge-item" key={index}>
                  {item}
                </div>
              ))
            )}
          </section>
        );
      })}
    </aside>
  );
}
