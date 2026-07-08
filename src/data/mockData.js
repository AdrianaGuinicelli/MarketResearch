export const researches = [
  {
    id: 1,
    title: "Industrial Heat Pumps",
    date: "2026-07-07",
    status: "Setup",
    progress: 20
  },
  {
    id: 2,
    title: "Food Retail Shops USA",
    date: "2026-07-06",
    status: "Data Collection",
    progress: 40
  },
  {
    id: 3,
    title: "Data Centers India",
    date: "2026-07-05",
    status: "Setup",
    progress: 20
  },
  {
    id: 4,
    title: "Scroll Chillers Europe",
    date: "2026-07-01",
    status: "Validation",
    progress: 80
  }
];

export const milestones = [
  { key: "setup", label: "Setup", status: "active" },
  { key: "collection", label: "Data Collection", status: "todo" },
  { key: "modeling", label: "Modeling", status: "todo" },
  { key: "validation", label: "Validation", status: "todo" },
  { key: "summary", label: "Executive Summary", status: "locked" }
];

export const messages = [
  {
    role: "ai",
    text: "Welcome to Market Research Navigator.\n\nTell me in simple words what you need to understand."
  },
  {
    role: "user",
    text: "Sto valutando se abbia senso per CAREL approfondire il mercato delle pompe di calore industriali."
  },
  {
    role: "ai",
    text: "Interessante. Prima di tutto vorrei capire come nasce questa esigenza: è una richiesta di un cliente, un'intuizione interna o un trend di mercato che avete osservato?"
  }
];

export const knowledgeUsed = {
  companyDocuments: [
    "Market Research Scoping Sheet",
    "E089 DC Scroll Chiller Value Proposition"
  ],
  previousResearch: [
    "No previous research used"
  ],
  webSources: [
    "No web sources used"
  ],
  userInputs: [
    "Initial business need"
  ]
};

