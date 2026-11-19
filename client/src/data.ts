export interface Project {
  id: number;
  title: string;
  category: string;
  tagline: string;
  description: string;
  highlights?: string[];
  technologies: string[];
  imageUrl?: string | null;
  imageSmall?: string | null;
  posterUrl?: string | null;
  posterSmall?: string | null;
  videoUrl?: string | null;
  aspect?: "video" | "portrait";
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
    tagline: "A multi-tenant HR platform for enterprise teams.",
    description:
      "Nizamy is the HR and workforce platform I lead at T2 Hub. It covers authentication, role-based access, scheduling, geofenced and face attendance, self-service HR and rewards. I own the .NET backend and the Angular admin portal from the schema to production.",
    highlights: [
      "Own a .NET 10 backend and Angular 19 portal with 275 endpoints and 70 EF Core migrations.",
      "Built a group-commit insert batcher for attendance punches. Every caller waits for its own row to commit, and a bad row only fails its own request.",
      "Added 24-hour and overnight attendance sessions, missing-checkout recovery, geofenced access gates and face matching with liveness checks.",
      "Moved gamification checks off the hot path with a Redis circuit breaker and a milestone bitmask cached in the JWT, then sent signed, idempotent events to PointSystem.",
      "Built the attendance ROI dashboard on precomputed daily and monthly snapshots, plus a public savings receipt with a CSP nonce.",
      "Load-tested the platform at 60,000 requests per minute on a single pod, then fixed the hot paths that test exposed.",
    ],
    technologies: [".NET 10", "Angular 19", "SQL Server", "EF Core 10", "Redis", "Payfort", "HMAC webhooks", "Kubernetes"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    year: "2026",
    role: "Design and delivery lead",
    domain: "Workforce management",
    metric: "60k requests per minute on one pod",
    order: 0,
  },
  {
    id: 0,
    title: "Atlas",
    category: "Multi-agent AI",
    tagline: "A compliance engine that reads the job site and cites the standard.",
    description:
      "Atlas is a multi-agent system for a construction company. It reads live job-site chats and photos, checks them against thousands of pages of TCNA, ANSI and manufacturer standards, and sends managers the code violations, phase errors and installer risks that need attention.",
    highlights: [
      "Architected eight orchestrated n8n and LangChain workflows: router, query analyzer, extraction, vision inspection, compliance judge and project Q&A over OpenRouter models.",
      "Turned 2,500+ pages of TCNA, ANSI and manufacturer documentation into a Postgres rule registry of about 6,000 tagged entries with page-level citations.",
      "Built the retrieval engine: LLM query normalization with controlled vocabularies and synonym mapping, then weighted SQL scoring that returns cited PASS, FAIL or CANNOT DETERMINE verdicts.",
      "Blocked general-knowledge compliance answers, so the model cannot invent a standard. That was a liability requirement, not a nice-to-have.",
      "Sent job-site photos through a vision model that writes verification questions against the registry and returns rated findings with severity and rule citations.",
      "Connected Atlas to the company's Blazor and .NET app through a one-way webhook, background batch analysis, status polling, watermark-based incremental processing and idempotent writes.",
    ],
    technologies: ["n8n", "LangChain", "OpenRouter", "Multimodal LLMs", "PostgreSQL", "Blazor / .NET"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    year: "2025",
    role: "Architecture and delivery",
    domain: "Construction compliance",
    metric: "About 6,000 cited rules",
    order: 1,
  },
  {
    id: 7,
    title: "KIT",
    category: "Client platform, AI automation",
    tagline: "Landing pages for US contractors, researched and built from their own market.",
    description:
      "KIT is a client product for US construction and home-service contractors. A contractor submits a website, a service and a market. KIT checks that the business is real, researches what local customers care about, generates a standalone landing page, tests it in a browser and hands over the HTML. It runs on Cloudflare Pages Functions and D1, with Stripe page packs.",
    highlights: [
      "Built the edge backend on Cloudflare Pages Functions and D1: intake, business verification, job state, credit ledger, Stripe webhooks and artifact delivery.",
      "Designed the verification gate: ten weighted homepage checks and one adjudication call, with hard stops for non-contractors and a protected Dallas-Fort Worth trade list.",
      "Ran Manus research agents for voice, trust and local research. They had to cite independent sources, and the job rejected slogan-only or duplicate reports.",
      "Tested every generated page before delivery: Chromium at mobile and desktop widths, axe WCAG A and AA, all external requests blocked, dead buttons and unsupported claims flagged.",
      "Added Stripe one-time checkout with idempotent webhooks, refunds and disputes. The credit ledger is derived from entries, so one credit cannot generate two pages.",
      "Delivered each page as a single HTML file under a sandbox CSP, with provider evidence kept immutable in D1.",
    ],
    technologies: ["Astro", "Cloudflare Pages Functions", "Cloudflare D1", "Stripe", "Manus API", "JavaScript", "Playwright", "axe-core"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    year: "2026",
    role: "Backend and platform build",
    domain: "Contractor marketing",
    metric: "AI-researched pages, browser tested",
    order: 2,
  },
  {
    id: 8,
    title: "PointSystem",
    category: "Rewards service",
    tagline: "Behavior earns points. Points become real cards.",
    description:
      "PointSystem is an employee rewards platform sold to companies. People earn points for attendance, streaks, evaluations and AI task completion, then trade them for real gift cards and vouchers. The company pays from a prepaid points budget. It runs as a separate .NET service integrated with Nizamy and Availo, with an Angular admin console and a mobile API.",
    highlights: [
      "Built the points ledger: expiry-aware FIFO lots, partial refunds back to the original lots, materialized balances and a nightly expiration worker.",
      "Made awards unable to create value. Every award runs in a serializable transaction that checks and debits the tenant prepaid credit before it writes the ledger.",
      "Built streaks with freezes and catch-up: one outcome per user and day, weekly freeze grants, automatic use on absence and milestone payouts.",
      "Shipped levels, badges, leaderboards and a weekly top-three payout. The VIP tier and discount flow are built but not rolled out yet.",
      "Integrated YouGotAGift, Daleel, Qyubic and LikeCard behind provider adapters, with idempotent order references, catalog sync, low-balance alerts and signed webhooks.",
      "Built a provider-agnostic HR layer so Availo and Nizamy use the same services. A Nizamy milestone webhook can create a complete tenant.",
    ],
    technologies: [".NET 6", "ASP.NET Core", "SQL Server", "EF Core", "Angular 19", "JWT / HMAC", "Docker", "Kubernetes", "Refit", "Elastic APM"],
    imageUrl: null,
    videoUrl: null,
    link: null,
    year: "2026",
    role: "Backend and platform build",
    domain: "Employee rewards",
    metric: "Real-value rewards ledger",
    order: 3,
  },
  {
    id: 2,
    title: "Construction ERP",
    category: "ERP integration",
    tagline: "Quote to invoice, with agents doing the data entry.",
    description:
      "This is the company's job lifecycle from quote to invoice. QuickBooks connects through webhooks, AI agents draft estimates and invoices, handle data entry and upload completed jobs to Google Drive.",
    highlights: [
      "Digitized the full job lifecycle from quote to invoice.",
      "Connected QuickBooks through webhooks, so the books and the job record stay aligned.",
      "Added AI agents for estimates, invoices and data entry.",
      "Uploaded completed job files to Google Drive automatically.",
      "Kept the agents monitored and maintained in production.",
    ],
    technologies: ["Blazor WASM", ".NET", "OData", "Hangfire", "QuickBooks API", "PostgreSQL", "AI"],
    imageUrl: null,
    posterUrl: "./construction-poster.webp",
    posterSmall: "./construction-poster-640.webp",
    videoUrl: "./ConstructionApp.mp4",
    aspect: "video",
    link: null,
    year: "2025",
    role: "Full-stack build",
    domain: "Construction ERP",
    metric: "Quote to invoice",
    order: 4,
  },
  {
    id: 1,
    title: "Synchron",
    category: "Client platform",
    tagline: "One place for managers, staff and clients to run a project.",
    description:
      "Synchron replaced a fragmented delivery workflow with one platform for managers, staff and clients. Managers assign work, staff track progress and clients review deliverables. Role-based dashboards, real-time messaging and Cloudflare R2 or Dropbox storage.",
    highlights: [
      "Unified a fragmented delivery workflow into one platform for three user types.",
      "Added real-time project messaging over SignalR.",
      "Built role-based dashboards for managers, staff and clients.",
      "Connected a media pipeline to Cloudflare R2 and Dropbox.",
    ],
    technologies: ["Blazor Server", ".NET", "SignalR", "EF Core", "Cloudflare R2", "PostgreSQL"],
    imageUrl: null,
    // The supplied SynchronReel.mp4 is a wedding-editing promo, not the platform UI,
    // so it is deliberately not attached to this case file. Add the real reel here.
    videoUrl: null,
    link: null,
    year: "2025",
    role: "Full-stack build",
    domain: "Project management",
    metric: "3 role-based portals",
    order: 5,
  },
  {
    id: 4,
    title: "AI workflow automations",
    category: "AI automation",
    tagline: "Ten-plus n8n pipelines that do real weekly work.",
    description:
      "I built more than ten n8n pipelines that run every week. They turn completed job media into content, and QuickBooks agents create estimates, invoices and data entry. Whisper handles speech to text.",
    highlights: [
      "Put ten-plus n8n pipelines into production.",
      "Generated weekly content from completed job media.",
      "Added QuickBooks agents for estimates, invoices and data entry.",
      "Added speech-to-text with Whisper.",
    ],
    technologies: ["n8n", "OpenAI", "Whisper", "Google Drive", "WordPress", "QuickBooks API"],
    imageUrl: "./n8n-workflows.webp",
    imageSmall: "./n8n-workflows-800.webp",
    videoUrl: null,
    link: null,
    year: "2024 to 2026",
    role: "Automation design",
    domain: "Content and finance ops",
    metric: "10+ pipelines",
    order: 6,
  },
  {
    id: 5,
    title: "PredictAi",
    category: "Machine learning",
    tagline: "LSTM forecasting for 1,000+ NYSE companies.",
    description:
      "My graduation project. It forecasts NYSE trends with LSTM networks trained on years of history for more than 1,000 companies, with automated ingestion, a cleaning pipeline and a REST API.",
    highlights: [
      "Trained LSTM networks on years of NYSE history.",
      "Covered more than 1,000 listed companies.",
      "Built automated ingestion and a cleaning pipeline.",
      "Served predictions through a REST API and a web frontend.",
    ],
    technologies: ["Python", "Flask", "TensorFlow", "MSSQL", "JavaScript", "HTML/CSS"],
    imageUrl: "./predict-ai-app.webp",
    imageSmall: "./predict-ai-app-800.webp",
    videoUrl: null,
    link: "https://github.com/marcogeorgez/PredictAi",
    year: "2024",
    role: "ML and web build",
    domain: "Financial forecasting",
    metric: "1,000+ companies",
    order: 7,
  },
];

export const experiencesData: Experience[] = [
  {
    id: 2,
    role: "Senior Software Engineer",
    company: "T2 Hub",
    period: "Apr 2026 to Present",
    location: "Cairo, Egypt",
    stack: [".NET 10", "Angular 19", "SQL Server", "Redis", "Kubernetes", "Payfort"],
    description: [
      "Design and delivery lead for Nizamy, a multi-tenant HR and workforce platform for enterprise customers. I own the .NET 10 backend and Angular 19 admin portal across 275 endpoints and 70 EF Core migrations.",
      "Built the attendance write path: group-commit batching, 24-hour and overnight sessions, missing-checkout recovery, geofenced gates and face attendance.",
      "Built PointSystem, the separate rewards service used by Nizamy and Availo. It covers the points ledger, streaks, levels, leaderboards, VIP tiers and real-value card redemption.",
      "Load-tested Nizamy at 60,000 requests per minute on a single pod, then fixed the hot paths it exposed.",
      "Built the attendance ROI dashboard on daily and monthly snapshots, with a public savings receipt protected by a CSP nonce.",
      "Moved milestone and attendance events out of the request path with signed, idempotent webhooks and pod-safe workers.",
    ],
    order: 2,
  },
  {
    id: 1,
    role: "Software Developer",
    company: "Freelance",
    period: "Oct 2024 to Apr 2026",
    location: "Remote, international clients",
    stack: [".NET", "Blazor", "React", "Railway", "Cloudflare Pages", "D1", "Astro", "Stripe"],
    description: [
      "Delivered production web applications end to end for international clients in project management, ERP, marketplaces and contractor marketing.",
      "Built KIT, a Cloudflare Pages and D1 landing-page service for US contractors, with AI research, browser QA and Stripe checkout.",
      "Self-hosted client systems on Railway and supported them after launch.",
      "Built device drivers for thermal printers and weighing scales.",
      "Delivered ten-plus n8n pipelines for content and QuickBooks data entry.",
    ],
    order: 1,
  },
];

/** Deliberately tiered: what I use daily is not the same as what I have touched. */
export const stackGroups: StackGroup[] = [
  {
    id: 1,
    tier: "Core",
    note: "Used every day in production.",
    items: [".NET 10", "ASP.NET Core", "Blazor", "EF Core", "PostgreSQL", "SQL Server", "REST APIs", "Angular", "TypeScript", "Redis"],
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
    note: "Deployment, payments and operations.",
    items: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Stripe", "Payfort", "Cloudflare Pages", "D1", "HMAC webhooks", "Railway"],
  },
  {
    id: 5,
    tier: "Integrations",
    note: "Third-party systems I have wired in.",
    items: ["QuickBooks API", "YouGotAGift", "Daleel", "Qyubic", "Manus API", "Cloudflare R2", "AWS S3", "Dropbox", "Google Drive", "WordPress", "Google OAuth"],
  },
];

export const principlesData = [
  {
    title: "Get the rules right first",
    body: "Payments, attendance and compliance run on rules. I build the schema, guardrails and audit trail before I put AI anywhere near them.",
  },
  {
    title: "Support is part of the build",
    body: "Every client platform I shipped came with support after launch, from Railway deployments to Cloudflare edge services. I do not hand over a build and disappear.",
  },
  {
    title: "Automate the repeatable",
    body: "If a task happens every week, it becomes a pipeline. Ten-plus n8n pipelines handle content and QuickBooks work today.",
  },
];

export const nowData = [
  { label: "Role", value: "Senior Software Engineer at T2 Hub" },
  { label: "Building", value: "Nizamy and PointSystem at T2 Hub" },
  { label: "Running", value: "Atlas, KIT and ten-plus n8n pipelines" },
  { label: "Open to", value: "Senior .NET and full-stack roles" },
];

export const factsData = [
  { label: "Based in", value: "Cairo, Egypt" },
  { label: "Working", value: "Remote with international teams" },
  { label: "Reply time", value: "Within one business day" },
];

export const navLinks = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Stack", href: "#stack" },
  { name: "Play", href: "#play" },
];
