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
import {
  researches,
  messages,
  knowledgeUsed as initialKnowledgeUsed
} from "./data/mockData.js";

const currentUser = {
  id: "user_adriana",
  name: "Adriana Guinicelli",
  managerEmail: ""
};

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
  const [knowledgeUsed, setKnowledgeUsed] = useState(initialKnowledgeUsed);

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

  const sidebarResearches = researches.map((research) =>
    research.id === selectedResearch.id ? selectedResearch : research
  );

  /*
    Nel MOC tutte le ricerche presenti appartengono all'utente corrente.

    Quando aggiungeremo login e database, questo array verrà filtrato
    realmente usando l'ID dell'utente autenticato.
  */
  const userResearches = sidebarResearches;

  const repositoryStats = {
    folders: "—",
    documents: "—",
    lastSync: "Not available"
  };

  function openCompleteMilestone(milestone = activeMilestone) {
    if (milestone.status === "locked") return;

    setSelectedMilestone(milestone);
    setIsMilestonePanelOpen(false);
    setIsCompleteOpen(true);
  }

function handleSaveOutput() {
  const milestoneToComplete = selectedMilestone || activeMilestone;

  setMilestones((previousMilestones) => {
    let updatedMilestones = previousMilestones.map((milestone) =>
      milestone.key === milestoneToComplete.key
        ? { ...milestone, status: "completed" }
        : milestone
    );

    const prerequisiteKeys = [
      "setup",
      "collection",
      "modeling",
      "validation"
    ];

    const prerequisitesCompleted = prerequisiteKeys.every((key) =>
      updatedMilestones.some(
        (milestone) =>
          milestone.key === key && milestone.status === "completed"
      )
    );

    updatedMilestones = updatedMilestones.map((milestone) => {
      if (milestone.key === "summary") {
        if (milestone.status === "completed") {
          return milestone;
        }

        return {
          ...milestone,
          status: prerequisitesCompleted ? "active" : "locked"
        };
      }

      return milestone;
    });

    const hasActiveMilestone = updatedMilestones.some(
      (milestone) => milestone.status === "active"
    );

    if (!hasActiveMilestone && !prerequisitesCompleted) {
      const firstIncomplete = updatedMilestones.find(
        (milestone) =>
          milestone.key !== "summary" &&
          milestone.status !== "completed"
      );

      if (firstIncomplete) {
        updatedMilestones = updatedMilestones.map((milestone) => {
          if (milestone.key === firstIncomplete.key) {
            return { ...milestone, status: "active" };
          }

          if (
            milestone.key !== "summary" &&
            milestone.status !== "completed"
          ) {
            return { ...milestone, status: "todo" };
          }

          return milestone;
        });
      }
    }

    const completedCount = updatedMilestones.filter(
      (milestone) => milestone.status === "completed"
    ).length;

    const updatedProgress = Math.round(
      (completedCount / updatedMilestones.length) * 100
    );

    const nextActiveMilestone =
      updatedMilestones.find(
        (milestone) => milestone.status === "active"
      ) || milestoneToComplete;

    setSelectedResearch((previousResearch) => ({
      ...previousResearch,
      status:
        updatedProgress === 100
          ? "Completed"
          : nextActiveMilestone.label,
      progress: updatedProgress
    }));

    return updatedMilestones;
  });

  setIsCompleteOpen(false);
  setIsSavedOpen(true);
}

  return (
    <div className="app-shell">
      <Header
        research={{
          ...selectedResearch,
          status: activeMilestone.label,
          progress
        }}
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
          researches={sidebarResearches}
          selectedResearch={selectedResearch}
          onSelect={setSelectedResearch}
          onNewResearch={() => setIsNewResearchOpen(true)}
        />

        <ChatWorkspace
          messages={messages}
          onKnowledgeUsedChange={setKnowledgeUsed}
        />

        <KnowledgePanel knowledge={knowledgeUsed} />
      </main>

      {isNewResearchOpen && (
        <NewResearchModal
          onClose={() => setIsNewResearchOpen(false)}
        />
      )}

      {isCompanyKnowledgeOpen && (
        <CompanyKnowledgeModal
          researches={userResearches}
          currentUser={currentUser}
          repositoryStats={repositoryStats}
          onClose={() => setIsCompanyKnowledgeOpen(false)}
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
