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

const initialMilestones = [
  { key: "setup", label: "Setup", status: "completed" },
  { key: "collection", label: "Data Collection", status: "active" },
  { key: "modeling", label: "Modeling", status: "todo" },
  { key: "validation", label: "Validation", status: "todo" },
  { key: "summary", label: "Executive Summary", status: "locked" }
];

export default function App() {
  const [selectedResearch, setSelectedResearch] = useState(researches[0]);
  const [milestones, setMilestones] = useState(initialMilestones);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const [isNewResearchOpen, setIsNewResearchOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isCompanyKnowledgeOpen, setIsCompanyKnowledgeOpen] = useState(false);
  const [isMilestonePanelOpen, setIsMilestonePanelOpen] = useState(false);

  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === "completed"
  ).length;

  const progress = Math.round(
    (completedMilestones / milestones.length) * 100
  );

  const activeMilestone =
    milestones.find((milestone) => milestone.status === "active") ||
    milestones.find((milestone) => milestone.status === "todo") ||
    milestones[milestones.length - 1];

  const currentMilestoneIndex = milestones.findIndex(
    (milestone) => milestone.key === activeMilestone.key
  );

  const nextMilestone = milestones[currentMilestoneIndex + 1];

  function openCompleteMilestone(milestone = activeMilestone) {
    if (milestone.status === "locked") return;
    setSelectedMilestone(milestone);
    setIsMilestonePanelOpen(false);
    setIsCompleteOpen(true);
  }

  function handleSaveOutput() {
    const milestoneToComplete = selectedMilestone || activeMilestone;

    setMilestones((prev) => {
      const updated = prev.map((milestone) =>
        milestone.key === milestoneToComplete.key
          ? { ...milestone, status: "completed" }
          : milestone
      );

      const hasActive = updated.some(
        (milestone) => milestone.status === "active"
      );

      if (hasActive) return updated;

      const firstTodo = updated.find(
        (milestone) => milestone.status === "todo"
      );

      if (!firstTodo) return updated;

      return updated.map((milestone) =>
        milestone.key === firstTodo.key
          ? { ...milestone, status: "active" }
          : milestone
      );
    });

    setIsCompleteOpen(false);
    setIsSavedOpen(true);
  }

  return (
    <div className="app-shell">
      <Header
        research={{ ...selectedResearch, status: activeMilestone.label, progress }}
        activeMilestone={activeMilestone}
        currentMilestoneIndex={currentMilestoneIndex}
        totalMilestones={milestones.length}
        nextMilestone={nextMilestone}
        onCompanyUpload={() => setIsCompanyKnowledgeOpen(true)}
        onCompleteMilestone={() => openCompleteMilestone(activeMilestone)}
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
          onComplete={openCompleteMilestone}
        />
      )}

      {isCompleteOpen && (
        <CompleteMilestoneModal
          milestone={selectedMilestone || activeMilestone}
          research={selectedResearch}
          onClose={() => setIsCompleteOpen(false)}
          onSave={handleSaveOutput}
        />
      )}

      {isSavedOpen && (
        <SaveSuccessModal
          milestone={selectedMilestone || activeMilestone}
          research={selectedResearch}
          onClose={() => {
            setIsSavedOpen(false);
            setSelectedMilestone(null);
          }}
        />
      )}
    </div>
  );
}
