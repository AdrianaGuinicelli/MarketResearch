import { useState } from "react";
import Header from "./components/Header.jsx";
import ResearchSidebar from "./components/ResearchSidebar.jsx";
import ChatWorkspace from "./components/ChatWorkspace.jsx";
import KnowledgePanel from "./components/KnowledgePanel.jsx";
import NewResearchModal from "./components/NewResearchModal.jsx";
import CompleteMilestoneModal from "./components/CompleteMilestoneModal.jsx";
import SaveSuccessModal from "./components/SaveSuccessModal.jsx";
import { researches, milestones, messages, knowledgeUsed } from "./data/mockData.js";

export default function App() {
  const [selectedResearch, setSelectedResearch] = useState(researches[0]);
  const [isNewResearchOpen, setIsNewResearchOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  function handleSaveOutput() {
    setIsCompleteOpen(false);
    setIsSavedOpen(true);
  }

  return (
    <div className="app-shell">
      <Header
        research={selectedResearch}
        milestones={milestones}
        onNewResearch={() => setIsNewResearchOpen(true)}
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

      {isNewResearchOpen && <NewResearchModal onClose={() => setIsNewResearchOpen(false)} />}
      {isCompleteOpen && <CompleteMilestoneModal onClose={() => setIsCompleteOpen(false)} onSave={handleSaveOutput} />}
      {isSavedOpen && <SaveSuccessModal onClose={() => setIsSavedOpen(false)} />}
    </div>
  );
}
