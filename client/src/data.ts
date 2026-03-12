export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string | null;
  videoUrl?: string | null;
  link?: string | null;
  order: number;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string[];
  order: number;
}

export interface Skill {
  id: number;
  category: string;
  items: string[];
  order: number;
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Synchron for LuminaryVisuals",
    description:
      "Replaced the client's fragmented workflow with a unified platform where managers assign work, staff track progress, and clients review deliverables. Role-based dashboards, real-time project messaging, and Cloudflare R2 / Dropbox integrations.",
    technologies: ["Blazor Server", ".NET", "SignalR", "EF Core", "Cloudflare R2", "PostgreSQL"],
    imageUrl: null,
    videoUrl: "./SynchronReel.mp4",
    link: null,
    order: 1,
  },
  {
    id: 2,
    title: "Construction ERP for FlooringBySammer",
    description: "Digitized the company's entire job lifecycle. QuickBooks integration via webhooks; AI agents generate estimates and invoices and handle Google Drive uploads.",
    technologies: ["Blazor WASM", ".NET", "OData", "Hangfire", "QuickBooks API", "PostgreSQL", "AI"],
    imageUrl: null,
    videoUrl: "./ConstructionApp.mp4",
    link: null,
    order: 3,
  },
  {
    id: 3,
    title: "Tyaar",
    description: "Built a construction-parts marketplace connecting businesses with suppliers. Order lifecycle tracking through IBAN payment verification and delivery confirmation.",
    technologies: ["Blazor WASM", ".NET Core", "EF Core", "OData", "AWS S3", "PostgreSQL", "Google OAuth", ".NET MAUI"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    order: 2,
  },
  {
    id: 4,
    title: "AI Workflow Automations",
    description: "Delivered 10+ N8N AI agent pipelines auto-generating weekly content from completed job media. QuickBooks AI agents to handle estimate creation, invoicing, and data entry.",
    technologies: ["N8N", "OpenAI", "Whisper", "Google Drive", "WordPress", "QuickBooks API"],
    imageUrl: "./N8N_1.png",
    videoUrl: null,
    link: null,
    order: 4,
  },
  {
    id: 5,
    title: "AI Stock Price Prediction Web App",
    description: "Graduation project: forecasts NYSE stock trends via LSTM neural networks on years of historical data for 1000+ companies, automated data ingestion, cleaning pipeline, and RESTful API.",
    technologies: ["Python", "Flask", "TensorFlow", "MSSQL", "JavaScript", "HTML/CSS"],
    imageUrl: "./predictAi.webp",
    videoUrl: null,
    link: "https://github.com/marcogeorgez/PredictAi",
    order: 5,
  },
];

export const experiencesData: Experience[] = [
  {
    id: 1,
    role: "Software Developer (Contractor)",
    company: "Freelance",
    period: "Sep. 2024 - Present",
    description: [
      "Designed and delivered production web applications end-to-end for international clients spanning project management, ERP, and marketplace domains - from requirements to deployment and maintenance.",
      "Self-hosted all client systems on Railway, managed infrastructure and post-launch support independently.",
    ],
    order: 1,
  },
];

export const skillsData: Skill[] = [
  {
    id: 1,
    category: "Backend",
    items: [".NET Core", "ASP.NET", "EF Core", "OData", "SignalR", "Hangfire", "Refit", "REST APIs"],
    order: 1,
  },
  {
    id: 2,
    category: "Frontend",
    items: ["Blazor", "React", "Tailwind CSS", "JavaScript", "HTML5/CSS3", "Radzen", "MudBlazor"],
    order: 2,
  },
  {
    id: 3,
    category: "Mobile & Databases",
    items: [".NET MAUI (Android / iOS)", "PostgreSQL", "Microsoft SQL Server"],
    order: 3,
  },
  {
    id: 4,
    category: "Cloud, AI & Tools",
    items: ["Railway", "Cloudflare R2", "AWS S3", "N8N", "OpenAI API", "Whisper", "Git", "Docker"],
    order: 4,
  },
];
