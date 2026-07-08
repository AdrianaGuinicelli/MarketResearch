import { useState } from "react";
import Header from "./components/Header.jsx";
import ResearchSidebar from "./components/ResearchSidebar.jsx";
import ChatWorkspace from "./components/ChatWorkspace.jsx";
import KnowledgePanel from "./components/KnowledgePanel.jsx";
import NewResearchModal from "./components/NewResearchModal.jsx";
import CompleteMilestoneModal from "./components/CompleteMilestoneModal.jsx";
import SaveSuccessModal from "./components/SaveSuccessModal.jsx";
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
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
  const [isNewResearchOpen, setIsNewResearchOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  const progress = Math.round(((currentMilestoneIndex + 1) / milestoneFlow.length) * 100);

  const milestones = milestoneFlow.map((milestone, index) => {
    if (index < currentMilestoneIndex) {
      return { ...milestone, status: "completed" };
    }

    if (index === currentMilestoneIndex) {
      return { ...milestone, status: "active" };
    }

    if (milestone.key === "summary" && currentMilestoneIndex < 4) {
      return { ...milestone, status: "locked" };
    }

    return { ...milestone, status: "todo" };
  });

  const activeMilestone = milestones[currentMilestoneIndex];

  function handleSaveOutput() {
    setIsCompleteOpen(false);
    setIsSavedOpen(true);

    if (currentMilestoneIndex < milestoneFlow.length - 1) {
      setCurrentMilestoneIndex((prev) => prev + 1);
    }
  }

  return (
    <div className="app-shell">
      <Header
        research={{
          ...selectedResearch,
          status: activeMilestone.label,
          progress
        }}
        milestones={milestones}
        activeMilestone={activeMilestone}
        onCompanyUpload={() => {
          window.dispatchEvent(new CustomEvent("open-company-upload"));
        }}
        onCompleteMilestone={() => setIsCompleteOpen(true)}
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
