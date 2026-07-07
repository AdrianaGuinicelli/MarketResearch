# Market Research Navigator

MOC React/Vite per un workspace AI CAREL dedicato alle ricerche di mercato.

## Avvio locale

```bash
npm install
npm run dev
```

Poi apri l'URL mostrato dal terminale.

## Struttura

```text
market-research-navigator/
├── public/
│   └── carel-logo.png
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ResearchSidebar.jsx
│   │   ├── ChatWorkspace.jsx
│   │   ├── KnowledgePanel.jsx
│   │   └── NewResearchModal.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── README.md
```

## Nota

Questa versione è un MOC frontend statico: simula interfaccia, workflow, chat e knowledge used. L'integrazione con GPT/API, SharePoint e salvataggio file arriverà nello step successivo.
