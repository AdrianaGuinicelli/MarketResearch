import { useState } from "react";
import Header from "./components/Header.jsx";
import ResearchSidebar from "./components/ResearchSidebar.jsx";
import ChatWorkspace from "./components/ChatWorkspace.jsx";
import KnowledgePanel from "./components/KnowledgePanel.jsx";
import NewResearchModal from "./components/NewResearchModal.jsx";
import CompleteMilestoneModal from "./components/CompleteMilestoneModal.jsx";
import SaveSuccessModal from "./components/SaveSuccessModal.jsx";
import CompanyKnowledgeModal from "./components/CompanyKnowledgeModal.jsx";
import MilestonePanelModal from "./components/MilestonePanelModal.jsx";
import { researches, messages, knowledgeUsed } from "./data/mockData.js";

const milestoneFlow = [
  { key: "setup", label: "Setup" },
  { key: "collection", label: "Data Collection" },
  { key: "modeling", label: "Modeling" },
  { key: "validation", label: "Validation" },
  { key: "summary", label: "Executive Summary" }
];

export default function App() {
  const [selectedResearch, setSelectedResearch] = useState(researches[0]);
 const [milestones, setMilestones] = useState([
  {
    key: "setup",
    label: "Setup",
    status: "completed"
  },
  {
    key: "collection",
    label: "Data Collection",
    status: "active"
  },
  {
    key: "modeling",
    label: "Modeling",
    status: "todo"
  },
  {
    key: "validation",
    label: "Validation",
    status: "todo"
  },
  {
    key: "summary",
    label: "Executive Summary",
    status: "locked"
  }
]);
  const [isNewResearchOpen, setIsNewResearchOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isCompanyKnowledgeOpen, setIsCompanyKnowledgeOpen] = useState(false);
  const [isMilestonePanelOpen, setIsMilestonePanelOpen] = useState(false);

const completedMilestones =
  milestones.filter(m => m.status === "completed").length;

const progress = Math.round(
  (completedMilestones / milestones.length) * 100
);

const activeMilestone =
  milestones.find(m => m.status === "active") ??
  milestones.find(m => m.status === "todo") ??
  milestones[milestones.length - 1];

const currentMilestoneIndex =
  milestones.findIndex(m => m.key === activeMilestone.key);

const nextMilestone =
  milestones[currentMilestoneIndex + 1];

  const activeMilestone = milestones[currentMilestoneIndex];

function handleCompleteMilestone(key) {

  setMilestones(prev => {

    const updated = prev.map(m => {

      if (m.key === key)
        return {
          ...m,
          status: "completed"
        };

      return m;

    });

    const firstTodo = updated.find(
      m => m.status === "todo"
    );

    return updated.map(m => {

      if (
        m.status === "active" &&
        m.key !== key
      )
        return {
          ...m,
          status: "completed"
        };

      if (
        firstTodo &&
        m.key === firstTodo.key
      )
        return {
          ...m,
          status: "active"
        };

      return m;

    });

  });

  setIsCompleteOpen(false);
  setIsSavedOpen(true);

}

function handleCompleteFromPanel(selectedKey) {

  setIsMilestonePanelOpen(false);

  setIsCompleteOpen(true);

}

  return (
    <div className="app-shell">
      <Header
        research={{ ...selectedResearch, status: activeMilestone.label, progress }}
        milestones={milestones}
        activeMilestone={activeMilestone}
        currentMilestoneIndex={currentMilestoneIndex}
        totalMilestones={milestoneFlow.length}
        nextMilestone={milestoneFlow[currentMilestoneIndex + 1]}
        onCompanyUpload={() => setIsCompanyKnowledgeOpen(true)}
        onCompleteMilestone={() => setIsCompleteOpen(true)}
        onOpenMilestones={() => setIsMilestonePanelOpen(true)}
      />

      <main className="workspace-grid">
        <ResearchSidebar
          researches={researches}
          selectedResearch={selectedResearch}
          onSelect={setSelectedResearch}
          onNewResearch={() => setIsNewResearchOpen(true)}
        />

        <ChatWorkspace messages={messages} />

        <KnowledgePanel knowledge={knowledgeUsed} />
      </main>

      {isNewResearchOpen && (
        <NewResearchModal onClose={() => setIsNewResearchOpen(false)} />
      )}

      {isCompanyKnowledgeOpen && (
        <CompanyKnowledgeModal
          onClose={() => setIsCompanyKnowledgeOpen(false)}
          onUpload={() => {
            setIsCompanyKnowledgeOpen(false);
            window.dispatchEvent(new CustomEvent("open-company-upload"));
          }}
        />
      )}

      {isMilestonePanelOpen && (
        <MilestonePanelModal
          milestones={milestones}
          activeMilestone={activeMilestone}
          onClose={() => setIsMilestonePanelOpen(false)}
          onComplete={handleCompleteFromPanel}
        />
      )}

      {isCompleteOpen && (
        <CompleteMilestoneModal
          milestone={activeMilestone}
          research={selectedResearch}
          onClose={() => setIsCompleteOpen(false)}
          onSave={handleSaveOutput}
        />
      )}

      {isSavedOpen && (
        <SaveSuccessModal
          milestone={milestoneFlow[Math.max(currentMilestoneIndex - 1, 0)]}
          research={selectedResearch}
          onClose={() => setIsSavedOpen(false)}
        />
      )}
    </div>
  );
}
