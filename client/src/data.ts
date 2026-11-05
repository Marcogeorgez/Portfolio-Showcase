export interface Project {
  id: number;
  title: string;
  category: string;
  tagline: string;
  description: string;
  highlights?: string[];
  technologies: string[];
  imageUrl?: string | null;
  videoUrl?: string | null;
  link?: string | null;
  year: string;
  role: string;
  domain: string;
  metric?: string;
  order: number;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  location?: string;
  stack?: string[];
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

export interface StackGroup {
  id: number;
  tier: string;
  note: string;
  items: string[];
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
  timezone: "GMT+2",
  github: "https://github.com/marcogeorgez",
  linkedin: "https://www.linkedin.com/in/marcogeorgez",
  availability: "Available for new opportunities",
  cvUrl: "./cv.html",
};

export const heroPhrases = ["Full-Stack Engineer", ".NET & Blazor Specialist", "AI Workflow Automator", "Systems Builder"];

/** The three numbers a recruiter should see before scrolling. */
export const statsData: Stat[] = [
  { value: 10, suffix: "+", label: "AI agent pipelines in production" },
  { value: 6, suffix: "", label: "Client platforms built end to end" },
  { value: 2, suffix: "+", label: "Years shipping production software" },
];

export const projectsData: Project[] = [
  {
    id: 6,
    title: "Nizamy",
    category: "Enterprise HR platform",
    tagline: "A multi-tenant workforce platform for enterprise customers.",
    description:
      "Design and delivery lead for Nizamy at T2 Hub: a multi-tenant HR and workforce-management platform covering authentication, role-based access control, scheduling, attendance and self-service HR. I own the .NET backend and the Angular administration portal end to end.",
    highlights: [
      "Own the .NET backend and Angular admin portal from data model and APIs through production releases.",
      "Shipped an attendance ROI analytics suite: a dedicated reporting warehouse, SQL aggregation at scale, interactive dashboards and localized PDF / CSV exports.",
      "Integrated regional voucher and rewards providers (Daleel, Qyubic, YouGotAGift) and external AI-HR services over HMAC-secured webhooks with per-client authentication.",
      "Engineered a gamification layer with experience points, levels, streaks, leaderboards and a tiered VIP program with dynamic pricing.",
      "Built multi-tenant authentication and role-based access control for enterprise customers across scheduling, attendance and self-service HR.",
    ],
    technologies: [".NET", "Angular", "PostgreSQL", "SQL Server", "EF Core", "HMAC webhooks"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    year: "2026",
    role: "Design & delivery lead",
    domain: "Workforce management",
    metric: "Multi-tenant, enterprise",
    order: 0,
  },
  {
    id: 0,
    title: "Atlas",
    category: "Multi-agent AI",
    tagline: "A compliance engine that reads the job site and cites the standard.",
    description:
      "A multi-agent AI system for a construction company. It reads live job-site chats and photos, checks them against thousands of pages of TCNA, ANSI and manufacturer standards, and escalates code violations, phase errors and installer risks to managers automatically.",
    highlights: [
      "Architected 8 orchestrated n8n / LangChain workflows with specialized agent roles: router, query analyzer, extraction, vision inspection, compliance judge and project-intelligence Q&A over OpenRouter LLMs.",
      "Converted 2,500+ pages of TCNA Handbook, ANSI standards and manufacturer documentation into a structured Postgres rule registry of ~6,000 tagged entries with page-level citations.",
      "Built a domain retrieval engine: LLM query normalization with controlled vocabularies and synonym mapping feeding weighted SQL scoring, returning cited PASS / FAIL / CANNOT-DETERMINE verdicts.",
      "Hard-blocked general-knowledge compliance answers so the model can never invent a standard; liability-critical by design.",
      "Routed job-site photos through a vision model that formulates verification questions against the registry and returns rated findings with severity and rule citations.",
      "Integrated asynchronously with the company's Blazor / .NET app through a one-way webhook contract, background batch analysis, status polling, watermark-based incremental processing and idempotent writes.",
    ],
    technologies: ["n8n", "LangChain", "OpenRouter", "Multimodal LLMs", "PostgreSQL", "Blazor / .NET"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    year: "2025",
    role: "Architecture & delivery",
    domain: "Construction compliance",
    metric: "~6,000 cited rules",
    order: 1,
  },
  {
    id: 1,
    title: "Synchron",
    category: "Client platform",
    tagline: "One delivery platform for managers, staff and clients.",
    description:
      "Replaced a fragmented workflow with a single platform where managers assign work, staff track progress and clients review deliverables. Role-based dashboards, real-time project messaging and Cloudflare R2 / Dropbox integrations.",
    highlights: [
      "Unified a fragmented delivery workflow into one platform for three distinct user types.",
      "Real-time project messaging powered by SignalR.",
      "Role-based dashboards for managers, staff and clients.",
      "Media pipeline backed by Cloudflare R2 and Dropbox integrations.",
    ],
    technologies: ["Blazor Server", ".NET", "SignalR", "EF Core", "Cloudflare R2", "PostgreSQL"],
    imageUrl: null,
    videoUrl: "./SynchronReel.mp4",
    link: null,
    year: "2025",
    role: "Full-stack build",
    domain: "Project management",
    metric: "3 role-based portals",
    order: 2,
  },
  {
    id: 2,
    title: "Construction ERP",
    category: "ERP integration",
    tagline: "Quote-to-invoice, with an agent fleet doing the data entry.",
    description:
      "Digitized the company's entire job lifecycle, now driven by an expanding fleet of integrated AI agents. QuickBooks is connected through webhooks; agents generate estimates and invoices, handle data entry and upload completed jobs to Google Drive.",
    highlights: [
      "Digitized the full job lifecycle from quote to invoice.",
      "Real-time QuickBooks sync through webhooks.",
      "AI agents draft estimates, invoices and data entry.",
      "Automated Google Drive uploads from completed jobs.",
      "Agent fleet monitored and maintained in production.",
    ],
    technologies: ["Blazor WASM", ".NET", "OData", "Hangfire", "QuickBooks API", "PostgreSQL", "AI"],
    imageUrl: null,
    videoUrl: "./ConstructionApp.mp4",
    link: null,
    year: "2025",
    role: "Full-stack build",
    domain: "Construction ERP",
    metric: "Quote to invoice",
    order: 3,
  },
  {
    id: 3,
    title: "Tyaar",
    category: "Marketplace",
    tagline: "A two-sided marketplace with IBAN-verified orders.",
    description:
      "A construction-parts marketplace connecting businesses with suppliers. Orders are tracked through their full lifecycle, from IBAN payment verification to delivery confirmation, with a .NET MAUI companion app.",
    highlights: [
      "Two-sided marketplace connecting businesses with parts suppliers.",
      "Payment verification through IBAN transfer confirmation.",
      "Order lifecycle tracking from order to delivery confirmation.",
      "Companion mobile app built with .NET MAUI.",
    ],
    technologies: ["Blazor WASM", ".NET Core", "EF Core", "OData", "AWS S3", "PostgreSQL", "Google OAuth", ".NET MAUI"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    year: "2024",
    role: "Full-stack build",
    domain: "Marketplace",
    metric: "Web + mobile",
    order: 4,
  },
  {
    id: 4,
    title: "AI workflow automations",
    category: "AI automation",
    tagline: "Ten-plus n8n pipelines doing real weekly work.",
    description:
      "Delivered 10+ n8n AI agent pipelines that auto-generate weekly content from completed job media. QuickBooks agents handle estimate creation, invoicing and data entry, with Whisper for speech-to-text.",
    highlights: [
      "10+ production n8n pipelines handling real business workflows.",
      "Weekly content auto-generated from completed job media.",
      "QuickBooks agents for estimates, invoicing and data entry.",
      "Speech-to-text integration with Whisper.",
    ],
    technologies: ["n8n", "OpenAI", "Whisper", "Google Drive", "WordPress", "QuickBooks API"],
    imageUrl: "./N8N_1.png",
    videoUrl: null,
    link: null,
    year: "2024 - 2026",
    role: "Automation design",
    domain: "Content & finance ops",
    metric: "10+ pipelines",
    order: 5,
  },
  {
    id: 5,
    title: "PredictAi",
    category: "Machine learning",
    tagline: "LSTM forecasting across 1,000+ NYSE companies.",
    description:
      "Graduation project: forecasts NYSE stock trends with LSTM neural networks trained on years of historical data for more than 1,000 companies, with automated ingestion, a cleaning pipeline and a RESTful API.",
    highlights: [
      "LSTM neural networks trained on years of NYSE historical data.",
      "Covers 1,000+ listed companies.",
      "Automated ingestion and cleaning pipeline.",
      "RESTful API serving predictions to the web frontend.",
    ],
    technologies: ["Python", "Flask", "TensorFlow", "MSSQL", "JavaScript", "HTML/CSS"],
    imageUrl: "./predictAi.webp",
    videoUrl: null,
    link: "https://github.com/marcogeorgez/PredictAi",
    year: "2024",
    role: "ML & web build",
    domain: "Financial forecasting",
    metric: "1,000+ companies",
    order: 6,
  },
];

export const experiencesData: Experience[] = [
  {
    id: 2,
    role: "Senior Software Engineer",
    company: "T2 Hub",
    period: "Apr 2026 - Present",
    location: "Cairo, Egypt",
    stack: [".NET", "Angular", "PostgreSQL", "SQL Server", "HMAC"],
    description: [
      "Design and delivery lead for Nizamy, a multi-tenant HR and workforce-management platform serving enterprise customers: authentication, role-based access control, scheduling, attendance and self-service HR.",
      "Own the .NET backend and the Angular administration portal end to end, from data model and APIs through to production releases.",
      "Built an attendance ROI analytics suite: dedicated reporting data warehouse, SQL aggregation at scale, localized PDF and CSV exports, and interactive dashboards.",
      "Integrated regional voucher and rewards providers (Daleel, Qyubic, YouGotAGift) and external AI-HR services over HMAC-secured webhooks and per-client service authentication.",
      "Engineered a gamification and rewards system with experience points, levels, streaks, leaderboards and a tiered VIP program with dynamic pricing.",
    ],
    order: 2,
  },
  {
    id: 1,
    role: "Software Developer",
    company: "Freelance",
    period: "Sep 2024 - Apr 2026",
    location: "Remote, international clients",
    stack: [".NET", "Blazor", "React", "Railway", "n8n"],
    description: [
      "Designed and delivered production web applications end to end for international clients across project management, ERP and marketplace domains, from requirements to deployment and maintenance.",
      "Self-hosted every client system on Railway, managing infrastructure and post-launch support independently.",
      "Built and integrated custom device drivers for thermal printers and weighing scales.",
      "Delivered 10+ n8n AI agent pipelines for content generation and QuickBooks data entry.",
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

/** Deliberately tiered: what I use daily is not the same as what I have touched. */
export const stackGroups: StackGroup[] = [
  {
    id: 1,
    tier: "Core",
    note: "Daily. Shipped to production.",
    items: [".NET Core", "ASP.NET", "Blazor", "EF Core", "PostgreSQL", "REST APIs", "Angular", "TypeScript"],
  },
  {
    id: 2,
    tier: "Systems",
    note: "Used on client platforms.",
    items: ["SignalR", "OData", "Hangfire", "SQL Server", "React", "Tailwind CSS", ".NET MAUI", "Refit"],
  },
  {
    id: 3,
    tier: "Applied AI",
    note: "Running in production pipelines.",
    items: ["n8n", "LangChain", "OpenRouter", "OpenAI API", "Whisper", "Multimodal LLMs", "RAG / retrieval"],
  },
  {
    id: 4,
    tier: "Platform",
    note: "Deployment, payments and ops exposure.",
    items: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Stripe", "Payfort", "HMAC webhooks", "Railway"],
  },
  {
    id: 5,
    tier: "Integrations",
    note: "Third-party systems wired in.",
    items: ["QuickBooks API", "Cloudflare R2", "AWS S3", "Dropbox", "Google Drive", "WordPress", "Google OAuth"],
  },
];

export const principlesData = [
  {
    title: "Correctness before cleverness",
    body: "Payments, attendance and compliance run on rules. I design the schema, guardrails and audit trail before adding AI to the loop.",
  },
  {
    title: "Ship, then stay",
    body: "Every freelance platform was self-hosted on Railway and supported after launch. I do not hand over a build and disappear.",
  },
  {
    title: "Automate the repeatable",
    body: "If a task happens every week, it becomes a pipeline. Ten-plus n8n agents currently handle content and QuickBooks work.",
  },
];

export const nowData = [
  { label: "Role", value: "Senior Software Engineer at T2 Hub" },
  { label: "Building", value: "Nizamy, a multi-tenant HR platform" },
  { label: "Running", value: "10+ n8n pipelines in production" },
  { label: "Open to", value: "Senior .NET / full-stack roles" },
];

export const factsData = [
  { label: "Based in", value: "Cairo, Egypt" },
  { label: "Working", value: "Remote with international teams" },
  { label: "Reply time", value: "Within one business day" },
];

export const marqueeSkills = [".NET Core", "Blazor", "ASP.NET", "React", "Angular", "Tailwind CSS", "SignalR", "EF Core", "N8N", "OpenAI API", "PostgreSQL", ".NET MAUI", "LangChain", "Docker", "OData", "Hangfire"];

// Add real client quotes here (name, role, quote). This section stays hidden while the list is empty.
export const testimonialsData: Testimonial[] = [];

export const navLinks = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Stack", href: "#stack" },
  { name: "Play", href: "#play" },
];
