import { Paperclip } from "lucide-react";

export default function Header({
  research,
  activeMilestone,
  currentMilestoneIndex,
  totalMilestones,
  nextMilestone,
  onCompanyUpload,
  onOpenMilestones
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

          <button className="primary-button" onClick={onCompanyUpload}>
            <Paperclip size={16} />
            Company Knowledge
          </button>
        </div>
      </div>

      <div className="research-line">
        <div>
          <div className="research-name">{research.title}</div>

          <button className="milestone-summary" onClick={onOpenMilestones}>
            Current milestone: <strong>{activeMilestone.label}</strong>
            {" · "}
            {currentMilestoneIndex + 1}/{totalMilestones}
            {nextMilestone ? ` · Next: ${nextMilestone.label}` : " · Final milestone"}
          </button>
        </div>

        <div className="progress-number">{research.progress}%</div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${research.progress}%` }} />
      </div>
    </header>
  );
}
