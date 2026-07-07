import { useState } from "react";
import Header from "./components/Header.jsx";
import ResearchSidebar from "./components/ResearchSidebar.jsx";
import ChatWorkspace from "./components/ChatWorkspace.jsx";
import KnowledgePanel from "./components/KnowledgePanel.jsx";
import NewResearchModal from "./components/NewResearchModal.jsx";
import { researches, milestones, messages, knowledgeUsed } from "./data/mockData.js";

export default function App() {
  const [selectedResearch, setSelectedResearch] = useState(researches[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app-shell">
      <Header research={selectedResearch} milestones={milestones} />

      <main className="workspace-grid">
        <ResearchSidebar
          researches={researches}
          selectedResearch={selectedResearch}
          onSelect={setSelectedResearch}
          onNewResearch={() => setIsModalOpen(true)}
        />

        <ChatWorkspace messages={messages} />

        <KnowledgePanel knowledge={knowledgeUsed} />
      </main>

      {isModalOpen && (
        <NewResearchModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
