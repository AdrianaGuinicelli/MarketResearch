import { useState } from "react";
import {
  X,
  MessageSquare,
  Paperclip,
  FileOutput,
  Activity,
  ShieldCheck,
  Download
} from "lucide-react";

const tabs = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "files", label: "Files", icon: Paperclip },
  { key: "outputs", label: "Outputs", icon: FileOutput },
  { key: "activity", label: "Activity", icon: Activity }
];

export default function ResearchWorkspaceModal({
  research,
  milestones = [],
  messages = [],
  files = [],
  outputs = [],
  activity = [],
  onClose
}) {
  const [activeTab, setActiveTab] = useState("chat");

  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === "completed"
  ).length;

  return (
    <div className="modal-overlay">
      <div className="modal-card research-workspace-modal">
        <div className="modal-header">
          <div>
            <div className="eyebrow">Personal Research Workspace</div>
            <h2>{research?.title || "Research workspace"}</h2>

            <div className="workspace-privacy-label">
              <ShieldCheck size={15} />
              <span>Private workspace · visible only to the owner</span>
            </div>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Chiudi Research Workspace"
          >
            <X size={18} />
          </button>
        </div>

        <div className="research-workspace-summary">
          <div>
            <span>Owner</span>
            <strong>{research?.owner || "Current user"}</strong>
          </div>

          <div>
            <span>Progress</span>
            <strong>{research?.progress || 0}%</strong>
          </div>

          <div>
            <span>Milestones</span>
            <strong>
              {completedMilestones}/{milestones.length}
            </strong>
          </div>

          <div>
            <span>Approval</span>
            <strong>{research?.approvalStatus || "Not submitted"}</strong>
          </div>
        </div>

        <div className="research-workspace-tabs">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              type="button"
              key={key}
              className={`research-workspace-tab ${
                activeTab === key ? "active" : ""
              }`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="research-workspace-content">
          {activeTab === "chat" && (
            <section>
              <div className="workspace-section-heading">
                <div>
                  <h3>Conversation history</h3>
                  <p>
                    Conversazione relativa esclusivamente a questa ricerca.
                  </p>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="workspace-empty-state">
                  No conversation available yet.
                </div>
              ) : (
                <div className="workspace-chat-list">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`workspace-chat-item ${message.role}`}
                    >
                      <strong>
                        {message.role === "user" ? "User" : "Navigator"}
                      </strong>
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "files" && (
            <section>
              <div className="workspace-section-heading">
                <div>
                  <h3>Research files</h3>
                  <p>
                    Allegati e documenti privati della ricerca corrente.
                  </p>
                </div>

                <button type="button" className="secondary-button" disabled>
                  <Paperclip size={16} />
                  Add files
                </button>
              </div>

              {files.length === 0 ? (
                <div className="workspace-empty-state">
                  No research files uploaded yet.
                </div>
              ) : (
                <div className="workspace-file-list">
                  {files.map((file) => (
                    <div className="workspace-file-item" key={file.id}>
                      <div>
                        <strong>{file.name}</strong>
                        <span>{file.status || "Available"}</span>
                      </div>

                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Scarica ${file.name}`}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "outputs" && (
            <section>
              <div className="workspace-section-heading">
                <div>
                  <h3>Generated outputs</h3>
                  <p>
                    Output delle milestone ed Executive Summary della ricerca.
                  </p>
                </div>
              </div>

              {outputs.length === 0 ? (
                <div className="workspace-empty-state">
                  No generated outputs yet.
                </div>
              ) : (
                <div className="workspace-file-list">
                  {outputs.map((output) => (
                    <div className="workspace-file-item" key={output.id}>
                      <div>
                        <strong>{output.name}</strong>
                        <span>{output.type || "Research output"}</span>
                      </div>

                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Scarica ${output.name}`}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "activity" && (
            <section>
              <div className="workspace-section-heading">
                <div>
                  <h3>Research activity</h3>
                  <p>
                    Cronologia delle azioni effettuate in questa ricerca.
                  </p>
                </div>
              </div>

              {activity.length === 0 ? (
                <div className="workspace-empty-state">
                  No activity recorded yet.
                </div>
              ) : (
                <div className="workspace-activity-list">
                  {activity.map((item) => (
                    <div className="workspace-activity-item" key={item.id}>
                      <Activity size={15} />
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
