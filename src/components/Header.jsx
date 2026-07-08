import { Lock, Paperclip, CheckCircle2, Circle } from "lucide-react";

export default function Header({
  research,
  milestones,
  activeMilestone,
  onCompanyUpload,
  onCompleteMilestone
}) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-block">
          <img src="/carel-logo.png" alt="CAREL" className="carel-logo" />
          <div>
            <div className="eyebrow">AI Workspace</div>
            <h1>Market Research Navigator</h1>
          </div>
        </div>

        <div className="header-actions">
          <button className="ghost-button">Dashboard</button>

          <button className="ghost-button" onClick={onCompleteMilestone}>
            Completa milestone
          </button>

          <button className="primary-button" onClick={onCompanyUpload}>
            <Paperclip size={16} />
            Company Knowledge
          </button>
        </div>
      </div>

      <div className="research-line">
        <div>
          <div className="research-name">{research.title}</div>
          <div className="research-meta">
            Current milestone: {activeMilestone.label} · Owner: Adriana Guinicelli
          </div>
        </div>

        <div className="progress-number">{research.progress}%</div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${research.progress}%` }}
        />
      </div>

      <div className="milestones">
        {milestones.map((item) => (
          <div className={`milestone ${item.status}`} key={item.key}>
            {item.status === "completed" && <CheckCircle2 size={15} />}
            {item.status === "active" && <span className="dot" />}
            {item.status === "todo" && <Circle size={14} />}
            {item.status === "locked" && <Lock size={14} />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
