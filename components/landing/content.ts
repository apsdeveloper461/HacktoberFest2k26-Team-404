// Landing copy and repeated content, typed in one place.
// Keep claims in line with CHALKSCRIPT_AI_FULL_FLOW.md: the first build reads
// website wireframes; everything else here is labelled as planned.

export const links = {
  /** The app route the architecture reserves for the product (ARCHITECTURE.md). */
  workspace: "/workspace",
  repo: "https://github.com/apsdeveloper461/HacktoberFest2k26-Team-404",
  license:
    "https://github.com/apsdeveloper461/HacktoberFest2k26-Team-404/blob/main/LICENSE",
} as const;

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: "demo", label: "Demo" },
  { id: "how", label: "How it works" },
  { id: "use-cases", label: "Use cases" },
  { id: "early-access", label: "Early access" },
];

export type ProcessStep = {
  id: "capture" | "interpret" | "structure" | "explore";
  title: string;
  body: string;
  note?: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "capture",
    title: "Capture",
    body: "Photograph the whiteboard, the notebook page, the back of the napkin. A PNG or JPEG is enough.",
  },
  {
    id: "interpret",
    title: "Interpret",
    body: "A multimodal vision model reads what you drew — headings, text, inputs, buttons, images, containers — and roughly where each one sits.",
    note: "Gemma 4 is the intended model.",
  },
  {
    id: "structure",
    title: "Structure",
    body: "The reading becomes validated project JSON: one element per box, with an id, a type, a position and a size. That JSON is the source of truth.",
  },
  {
    id: "explore",
    title: "Explore",
    body: "React renders the JSON as a live preview. Select an element, change its text or colour, inspect the structure.",
    note: "PNG export is in progress.",
  },
];

export type UseCaseId = "wireframe" | "er" | "architecture" | "flow";

export type UseCase = {
  id: UseCaseId;
  index: string;
  title: string;
  status: "First build" | "Planned";
  summary: string;
  produces: string[];
};

export const useCases: UseCase[] = [
  {
    id: "wireframe",
    index: "01",
    title: "Website wireframes",
    status: "First build",
    summary:
      "Boxes become inputs, toggles and buttons you can actually press. This is what the first build is focused on.",
    produces: ["text", "button", "input", "image", "container"],
  },
  {
    id: "er",
    index: "02",
    title: "Database relationships",
    status: "Planned",
    summary:
      "Entity boxes and crow's-foot scribbles become tables with keys and readable relations. Tap an entity to follow its links.",
    produces: ["entities", "fields", "keys", "relations"],
  },
  {
    id: "architecture",
    index: "03",
    title: "System architecture",
    status: "Planned",
    summary:
      "The service diagram from the design review becomes a connected system map you can trace a request through.",
    produces: ["services", "stores", "edges", "request paths"],
  },
  {
    id: "flow",
    index: "04",
    title: "User flows",
    status: "Planned",
    summary:
      "Start dots, decisions and arrows become a navigable interaction map — step through it like a user would.",
    produces: ["screens", "decisions", "transitions"],
  },
];

export type Audience = {
  index: string;
  role: string;
  scenario: string;
  glyph: "class" | "flow" | "wireframe" | "er";
};

export const audiences: Audience[] = [
  {
    index: "01",
    role: "Engineers & architects",
    scenario:
      "You sketched the settings screen during the review. Leave the room with a preview the team can click, not a blurry photo in the chat.",
    glyph: "class",
  },
  {
    index: "02",
    role: "Product builders & indie hackers",
    scenario:
      "The weekend idea lives on a notebook page. Turn the page into a clickable starting point before you open an editor.",
    glyph: "wireframe",
  },
  {
    index: "03",
    role: "Technical founders & PMs",
    scenario:
      "Show the flow you mean, not the one people imagine. Share something editable instead of describing boxes over a call.",
    glyph: "flow",
  },
  {
    index: "04",
    role: "Students",
    scenario:
      "See how a drawn box maps to a real element — a heading, an input, a button — and read the JSON that describes it.",
    glyph: "er",
  },
];

export type LedgerItem = { label: string; state: "today" | "progress" | "next" };

export const ledger: { today: LedgerItem[]; next: LedgerItem[] } = {
  today: [
    { label: "Hand-drawn website wireframes", state: "today" },
    { label: "text · button · input · image · container", state: "today" },
    { label: "Edit text and colour in the inspector", state: "today" },
    { label: "Structure view of the project JSON", state: "today" },
    { label: "PNG export", state: "progress" },
  ],
  next: [
    { label: "Architecture diagrams", state: "next" },
    { label: "ER diagrams and database schemas", state: "next" },
    { label: "User flows", state: "next" },
    { label: "Chat edits that change the JSON", state: "next" },
    { label: "draw.io export", state: "next" },
  ],
};
