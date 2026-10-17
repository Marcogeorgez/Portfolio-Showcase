export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  highlights?: string[];
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

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  order: number;
}

export const personalInfo = {
  name: "Marco George",
  firstName: "Marco",
  role: "Full-Stack Engineer",
  specialty: ".NET & Blazor",
  email: "marco2two@gmail.com",
  phone: "+20 127 066 8980",
  location: "Cairo, Egypt",
  github: "https://github.com/marcogeorgez",
  linkedin: "https://linkedin.com/in/marcogeorgez",
  availability: "Available for new opportunities",
  cvUrl: "./cv.html",
};

export const heroPhrases = ["Full-Stack Engineer", ".NET & Blazor Specialist", "AI Workflow Automator", "Systems Builder"];

export const statsData = [
  { value: 2, suffix: "+", label: "Years shipping production software" },
  { value: 6, suffix: "", label: "Featured projects delivered" },
  { value: 10, suffix: "+", label: "AI agent pipelines in production" },
  { value: 3, suffix: "", label: "Client platforms built end-to-end" },
];

export const projectsData: Project[] = [
  {
    id: 0,
    title: "Atlas - AI Compliance & Project Intelligence",
    category: "Multi-Agent AI",
    description:
      "Multi-agent AI system for a construction company that reads live job-site chats and photos, checks them against thousands of pages of TCNA / ANSI / manufacturer standards, and auto-escalates code violations, phase errors, and installer risks to managers.",
    highlights: [
      "Architected a production multi-agent AI platform: 8 orchestrated n8n / LangChain workflows with specialized agent roles (router, query analyzer, extraction, vision inspection, compliance judge, project-intelligence Q&A) over OpenRouter LLMs",
      "LLM knowledge-extraction pipeline converted 2,500+ pages of TCNA Handbook, ANSI standards, and manufacturer documentation into a structured Postgres rule registry (~6,000 tagged entries with page-level citations), enabling cited, verifiable answers instead of model recall",
      "Domain-specific retrieval engine: LLM query normalizer with controlled vocabularies and synonym mapping feeding a weighted SQL scoring system; every compliance answer is grounded in [rule_id, source, page] citations with PASS / FAIL / CANNOT-DETERMINE verdicts",
      "Liability-aware by design: general-knowledge compliance answers are hard-blocked, so the AI can never invent a standard",
      "Computer-vision site inspection: job-site photos routed through a vision model that formulates verification questions against the standards registry and returns rated findings with severity and rule citations, batched and cost-capped for production reliability",
      "Async job-processing integration with the company's Blazor / .NET construction app: one-way webhook contract, background batch analysis, status-polling API, watermark-based incremental processing, and idempotent writes with dedupe keys, with zero direct database coupling",
      "Concern & alert system: automatic detection of code violations, phase-sequence errors, and recurring installer issues (90-day history comparison), escalating high / critical findings to managers via Slack, email, and in-app notifications",
      "Natural-language project-intelligence layer: intent classification to SQL routing to synthesis with confidence scoring, answering questions like \"how is this installer performing?\" and \"which past projects are similar to this one?\"",
      "Hardened against LLM failure modes: structured-output salvage and fallback routing, terminal-state guards preventing automated jobs from overwriting human decisions, media dedupe, and role-based permissions on AI state changes",
    ],
    technologies: ["n8n", "LangChain", "OpenRouter", "Multimodal LLMs", "PostgreSQL", "REST Webhooks", "Blazor / .NET"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    order: 0,
  },
  {
    id: 1,
    title: "Synchron for LuminaryVisuals",
    category: "Client Platform",
    description:
      "Replaced the client's fragmented workflow with a unified platform where managers assign work, staff track progress, and clients review deliverables. Role-based dashboards, real-time project messaging, and Cloudflare R2 / Dropbox integrations.",
    highlights: [
      "Unified a fragmented delivery workflow into one platform for managers, staff, and clients",
      "Real-time project messaging powered by SignalR",
      "Role-based dashboards for three distinct user types",
      "Media pipeline backed by Cloudflare R2 and Dropbox integrations",
    ],
    technologies: ["Blazor Server", ".NET", "SignalR", "EF Core", "Cloudflare R2", "PostgreSQL"],
    imageUrl: null,
    videoUrl: "./SynchronReel.mp4",
    link: null,
    order: 1,
  },
  {
    id: 2,
    title: "Construction ERP for FlooringBySammer",
    category: "ERP Integration",
    description: "Digitized the company's entire job lifecycle, now driven by an expanding fleet of integrated AI agents. QuickBooks integration via webhooks; agents generate estimates and invoices and handle data entry and Google Drive uploads.",
    highlights: [
      "Digitized the full job lifecycle from quote to invoice",
      "Real-time QuickBooks sync via webhooks",
      "AI agents that draft estimates, invoices, and data entry",
      "Automated Google Drive uploads from completed jobs",
      "Expanding agent fleet woven across the workflow, monitored and maintained in production",
    ],
    technologies: ["Blazor WASM", ".NET", "OData", "Hangfire", "QuickBooks API", "PostgreSQL", "AI"],
    imageUrl: null,
    videoUrl: "./ConstructionApp.mp4",
    link: null,
    order: 3,
  },
  {
    id: 3,
    title: "Tyaar",
    category: "Marketplace",
    description: "Built a construction-parts marketplace connecting businesses with suppliers. Order lifecycle tracking through IBAN payment verification and delivery confirmation.",
    highlights: [
      "Two-sided marketplace connecting businesses with parts suppliers",
      "Payment verification via IBAN transfer confirmation",
      "Order lifecycle tracking from order to delivery confirmation",
      "Companion mobile app built with .NET MAUI",
    ],
    technologies: ["Blazor WASM", ".NET Core", "EF Core", "OData", "AWS S3", "PostgreSQL", "Google OAuth", ".NET MAUI"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    order: 2,
  },
  {
    id: 4,
    title: "AI Workflow Automations",
    category: "AI Automation",
    description: "Delivered 10+ N8N AI agent pipelines auto-generating weekly content from completed job media. QuickBooks AI agents to handle estimate creation, invoicing, and data entry.",
    highlights: [
      "10+ production N8N pipelines handling real business workflows",
      "Weekly content auto-generated from completed job media",
      "QuickBooks agents for estimates, invoicing, and data entry",
      "Speech-to-text integration with Whisper",
    ],
    technologies: ["N8N", "OpenAI", "Whisper", "Google Drive", "WordPress", "QuickBooks API"],
    imageUrl: "./N8N_1.png",
    videoUrl: null,
    link: null,
    order: 4,
  },
  {
    id: 5,
    title: "AI Stock Price Prediction Web App",
    category: "Machine Learning",
    description: "Graduation project: forecasts NYSE stock trends via LSTM neural networks on years of historical data for 1000+ companies, automated data ingestion, cleaning pipeline, and RESTful API.",
    highlights: [
      "LSTM neural networks trained on years of NYSE historical data",
      "Covers 1000+ listed companies",
      "Automated ingestion and cleaning pipeline",
      "RESTful API serving predictions to the web frontend",
    ],
    technologies: ["Python", "Flask", "TensorFlow", "MSSQL", "JavaScript", "HTML/CSS"],
    imageUrl: "./predictAi.webp",
    videoUrl: null,
    link: "https://github.com/marcogeorgez/PredictAi",
    order: 5,
  },
];

export const experiencesData: Experience[] = [
  {
    id: 2,
    role: "Senior Software Engineer",
    company: "T2 · T2 Hub",
    period: "Apr. 2026 - Present",
    description: [
      "Designed and delivered Nizamy, a multi-tenant HR and workforce management platform serving enterprise customers, covering authentication, role-based access control, scheduling, attendance, and self-service HR.",
      "Own the .NET backend and Angular administration portal end to end, delivering features from data model and APIs through to production.",
      "Built an attendance ROI analytics suite, including a dedicated reporting data warehouse, SQL aggregation at scale, localized PDF and CSV exports, and interactive dashboards.",
      "Integrated regional voucher and rewards providers (Daleel, Qyubic, YouGotAGift) and external AI-HR services, implementing HMAC-secured webhooks and per-client service authentication.",
      "Engineered a gamification and rewards system with experience points, levels, streaks, leaderboards, and a tiered VIP program with dynamic pricing.",
    ],
    order: 2,
  },
  {
    id: 1,
    role: "Software Developer",
    company: "Freelance",
    period: "Sep. 2024 - Apr. 2026",
    description: [
      "Designed and delivered production web applications end-to-end for international clients spanning project management, ERP, and marketplace domains - from requirements to deployment and maintenance.",
      "Self-hosted all client systems on Railway, managed infrastructure and post-launch support independently.",
      "Built and integrated custom device drivers for thermal printers and weighing scales into client systems.",
      "Delivered 10+ N8N AI agent pipelines for content generation and QuickBooks data entry.",
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
    items: ["Blazor", "React", "Angular", "Tailwind CSS", "JavaScript", "HTML5/CSS3", "Radzen", "MudBlazor"],
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
    items: ["Railway", "Cloudflare R2", "AWS S3", "N8N", "OpenAI API", "Whisper", "LangChain", "OpenRouter", "Git", "Docker"],
    order: 4,
  },
];

export const marqueeSkills = [".NET Core", "Blazor", "ASP.NET", "React", "Angular", "Tailwind CSS", "SignalR", "EF Core", "N8N", "OpenAI API", "PostgreSQL", ".NET MAUI", "LangChain", "Docker", "OData", "Hangfire"];

// Add real client quotes here (name, role, quote). This section stays hidden while the list is empty.
export const testimonialsData: Testimonial[] = [];

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
];
