import { Lock } from "lucide-react";

export default function Header({ research, milestones }) {
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
          <button className="primary-button">+ Nuova ricerca</button>
        </div>
      </div>

      <div className="research-line">
        <div>
          <div className="research-name">{research.title}</div>
          <div className="research-meta">Owner: Adriana Guinicelli · {research.date}</div>
        </div>
        <div className="progress-number">{research.progress}%</div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${research.progress}%` }} />
      </div>

      <div className="milestones">
        {milestones.map((item) => (
          <div className={`milestone ${item.status}`} key={item.key}>
            {item.status === "locked" ? <Lock size={14} /> : <span className="dot" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
