export type FlowNode = {
  id: string;
  label: string;
  sub?: string;
  hot?: boolean;
  detail: string;
};

export type FlowStage = {
  id: string;
  label: string;
  nodes: FlowNode[];
};

export type FlowSpec = {
  title: string;
  aria: string;
  stages: FlowStage[];
  note: string;
};

/**
 * A vertical request path per case file. Each stage is a row of components, so
 * the map stays readable inside the case drawer and on a phone without tiny
 * SVG labels or horizontal scrolling.
 */
export const flows: Record<number, FlowSpec> = {
  6: {
    title: "Nizamy / request path",
    aria: "Nizamy data flow: the Angular portal, employee app and Availo reach a tenant-aware .NET gateway with authentication and role checks, then scheduling, attendance, ROI and PointSystem services, backed by SQL Server, Redis, ROI snapshots and reward providers.",
    stages: [
      {
        id: "clients",
        label: "Clients",
        nodes: [
          {
            id: "portal",
            label: "Angular portal",
            sub: "admin and HR",
            hot: true,
            detail: "The admin portal HR teams use for scheduling, attendance, ROI and rewards. I own it from route structure to production releases.",
          },
          {
            id: "employee-app",
            label: "Employee app",
            sub: "check-in and wallet",
            detail: "Check-in, check-out, self-service and the rewards wallet all call the same tenant-scoped API.",
          },
          {
            id: "availo",
            label: "Availo",
            sub: "second HR platform",
            detail: "Availo sits on the same rewards network. Its staff earn and redeem through the same account as Nizamy users.",
          },
        ],
      },
      {
        id: "edge",
        label: "Edge",
        nodes: [
          {
            id: "gateway",
            label: ".NET gateway",
            sub: "tenant routing",
            hot: true,
            detail: "Every request enters here. The gateway resolves the tenant from the token, applies authentication and sends the request to a domain service.",
          },
          {
            id: "auth",
            label: "Auth and RBAC",
            sub: "scoped roles",
            detail: "Tenant-scoped authentication and role-based access across scheduling, attendance, self-service and rewards.",
          },
          {
            id: "webhooks",
            label: "Signed webhooks",
            sub: "HMAC and retries",
            detail: "Milestone and attendance-session events leave with an HMAC signature, retry handling and a duplicate-safe event key.",
          },
          {
            id: "workers",
            label: "Hosted workers",
            sub: "safe across pods",
            detail: "Thirteen background workers handle milestone dispatch, ROI snapshots, webhook retries and reward events. They are safe to run on more than one pod.",
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        nodes: [
          {
            id: "scheduling",
            label: "Scheduling",
            sub: "shifts and rotations",
            detail: "Shift and rotation planning with tenant-owned rules and constraints.",
          },
          {
            id: "attendance",
            label: "Attendance",
            sub: "sessions and face match",
            hot: true,
            detail: "Group-commit batching, 24-hour and overnight sessions, missing-checkout recovery, geofenced gates and face matching with liveness checks.",
          },
          {
            id: "roi",
            label: "ROI analytics",
            sub: "daily and monthly",
            detail: "Dashboards read precomputed daily and monthly snapshots, so they do not aggregate years of attendance on every request.",
          },
          {
            id: "points",
            label: "PointSystem",
            sub: "points and rewards",
            hot: true,
            detail: "A separate rewards service for points, streaks, levels, leaderboards, VIP tiers and real-value card redemption.",
          },
        ],
      },
      {
        id: "data",
        label: "State",
        nodes: [
          {
            id: "sql",
            label: "SQL Server",
            sub: "core OLTP",
            hot: true,
            detail: "The primary store for tenants, people, schedules and attendance. The indexes are shaped around the punch path.",
          },
          {
            id: "redis",
            label: "Redis",
            sub: "cache and sessions",
            detail: "Cache and short-lived state in front of the hot read paths. A circuit breaker keeps a Redis outage from serializing traffic.",
          },
          {
            id: "snapshots",
            label: "ROI snapshots",
            sub: "daily and monthly",
            detail: "Metric tables that keep the ROI dashboard fast without a separate warehouse.",
          },
          {
            id: "providers",
            label: "Reward providers",
            sub: "cards and vouchers",
            detail: "PointSystem turns points into gift cards and vouchers through YouGotAGift, Daleel, Qyubic and LikeCard.",
          },
        ],
      },
    ],
    note: "Start at the clients on top. Each row below is the next hop for the request. Select a component to read its role.",
  },

  0: {
    title: "Atlas / verdict path",
    aria: "Atlas data flow: job-site chat, photos and project context enter a router agent, split into vision inspection and query analysis, run against a PostgreSQL rule registry, and leave as cited PASS, FAIL or CANNOT DETERMINE verdicts in the client application.",
    stages: [
      {
        id: "inputs",
        label: "Inputs",
        nodes: [
          { id: "chat", label: "Job-site chat", sub: "live messages", hot: true, detail: "Live job-site chat arrives from the construction company's existing Blazor and .NET application." },
          { id: "photos", label: "Site photos", sub: "install evidence", detail: "Photos show the work as it was installed. The vision path turns them into checks against the registry." },
          { id: "context", label: "Project context", sub: "trade and phase", detail: "Job metadata narrows the search to the trade, phase and installation method under review." },
        ],
      },
      {
        id: "agents",
        label: "Agents",
        nodes: [
          { id: "router", label: "Router agent", sub: "intent and dispatch", hot: true, detail: "The router decides whether an observation needs extraction, visual inspection or a direct standards query." },
          { id: "vision", label: "Vision inspector", sub: "photo checks", detail: "A vision model writes verification questions against the registry and returns rated findings with severity." },
          { id: "query", label: "Query analyzer", sub: "controlled vocabulary", detail: "LLM query normalization with controlled vocabularies and synonym mapping, so job-site language matches the wording of a standard." },
        ],
      },
      {
        id: "retrieval",
        label: "Retrieval",
        nodes: [
          { id: "registry", label: "Rule registry", sub: "about 6,000 entries", hot: true, detail: "Roughly 6,000 tagged entries in PostgreSQL, each traceable to a page in the source standard." },
          { id: "weighted", label: "Weighted SQL", sub: "scored matches", detail: "Normalized queries feed weighted SQL scoring over tagged entries and return candidate clauses with page-level citations." },
          { id: "judge", label: "Compliance judge", sub: "PASS, FAIL or unknown", hot: true, detail: "The judge weighs the retrieved clauses and returns PASS, FAIL or CANNOT DETERMINE. General-knowledge answers are blocked." },
        ],
      },
      {
        id: "output",
        label: "Output",
        nodes: [
          { id: "verdict", label: "Cited verdict", sub: "clause and evidence", hot: true, detail: "Each verdict carries the clause, the evidence and the reason, so a manager can check the answer instead of trusting it." },
          { id: "app", label: "Blazor and .NET", sub: "manager review", detail: "Results return to the application managers already use through a one-way webhook and background processing." },
          { id: "pg", label: "PostgreSQL", sub: "registry and findings", detail: "Stores the rule registry, findings and processing watermarks." },
        ],
      },
    ],
    note: "The judge can refuse. CANNOT DETERMINE is a valid verdict when the registry has no citable basis.",
  },

  7: {
    title: "KIT / generation path",
    aria: "KIT data flow: a US contractor pays through Stripe, Cloudflare Pages Functions verify the business, an adjudicator gates the job, Manus research agents study the local market, a page is generated and tested in Chromium, and the standalone HTML is delivered.",
    stages: [
      {
        id: "customer",
        label: "Customer",
        nodes: [
          { id: "contractor", label: "Contractor", sub: "United States", hot: true, detail: "A US construction or home-service contractor who needs a landing page without hiring a designer or learning a page builder." },
          { id: "checkout", label: "Stripe checkout", sub: "5, 7 or 10 pages", hot: true, detail: "One-time page packs at $499, $599 and $699, plus one free page per verified business. No subscription and no sales call." },
        ],
      },
      {
        id: "edge",
        label: "Edge",
        nodes: [
          { id: "functions", label: "Pages Functions", sub: "edge API", hot: true, detail: "Astro serves the marketing site as static files. Pages Functions handle intake, verification, checkout, generation control and delivery." },
          { id: "verify", label: "Homepage check", sub: "10 weighted signals", detail: "A hardened single-page crawler scores homepage evidence, structured data, name, service, market, contractor signals, phone, address, domain age and MX records." },
          { id: "adjudicate", label: "Adjudicator", sub: "stops bad jobs", hot: true, detail: "One model call turns each review into pass or reject. Missing config, a timeout, bad JSON or low confidence all stop the job." },
        ],
      },
      {
        id: "generation",
        label: "Generation",
        nodes: [
          { id: "research", label: "Manus research", sub: "voice, trust, local", hot: true, detail: "Three research streams plus a main thread, each required to cover customer problems, fears, objections and buying motives with independent citations." },
          { id: "generate", label: "Page generation", sub: "one HTML file", hot: true, detail: "The accepted research bundle drives a single responsive page with inlined CSS, JavaScript and data URIs, plus a map from finding to visible copy." },
          { id: "qa", label: "Browser QA", sub: "Chromium and axe", hot: true, detail: "Chromium at 390 and 1440 pixels, axe WCAG A and AA checks, all external requests blocked, every button clicked and sensitive claims checked against an allowlist." },
        ],
      },
      {
        id: "delivery",
        label: "Delivery",
        nodes: [
          { id: "html", label: "Standalone HTML", sub: "sandboxed download", hot: true, detail: "The finished page is a download, not a hosted site. The contractor keeps the file." },
          { id: "d1", label: "D1", sub: "jobs and evidence", detail: "One D1 database holds the job state machine, immutable research evidence, verification attempts, orders, the credit ledger and artifacts." },
          { id: "admin", label: "Admin portal", sub: "OTP and audit", detail: "A separate OTP-authenticated admin area handles customers, jobs, credits, settings and an append-only audit log." },
        ],
      },
    ],
    note: "The contractor keeps the file. KIT keeps the verification, generation and billing pipeline.",
  },

  8: {
    title: "PointSystem / redemption path",
    aria: "PointSystem data flow: Availo, Nizamy and the mobile app call a .NET points API with SSO and webhook intake, then an award engine, streak engine and redemption flow over a SQL Server ledger, prepaid tenant credit and third-party reward providers.",
    stages: [
      {
        id: "clients",
        label: "Clients",
        nodes: [
          { id: "availo", label: "Availo", sub: "HR platform", hot: true, detail: "The original HR platform tenant. Identity, departments, shifts, attendance and notifications come through provider adapters." },
          { id: "nizamy", label: "Nizamy", sub: "HR platform", hot: true, detail: "Nizamy uses the same services. A milestone webhook can award points and create a complete new tenant." },
          { id: "mobile", label: "Mobile app", sub: "employee wallet", detail: "Employees check balances, streaks, the leaderboard and the reward catalog, then redeem from their phone." },
        ],
      },
      {
        id: "api",
        label: "API",
        nodes: [
          { id: "points-api", label: "Points API", sub: "252 endpoints", hot: true, detail: "The .NET API behind the Angular console, the mobile app and machine-to-machine callers." },
          { id: "sso", label: "SSO and JWT", sub: "tenant and roles", detail: "JWT claims carry the tenant, department, points role and permissions. Webhooks use HMAC with a five-minute replay window." },
          { id: "hook", label: "Webhook gateway", sub: "event intake", detail: "Signed provider and HR events are de-duplicated by external event ID before they can award points." },
        ],
      },
      {
        id: "engines",
        label: "Engines",
        nodes: [
          { id: "award", label: "Award engine", sub: "credit checked", hot: true, detail: "Every award runs in a serializable transaction, debits the tenant's prepaid credit and writes a ledger lot with an expiry date." },
          { id: "streak", label: "Streak engine", sub: "freezes and milestones", hot: true, detail: "Daily outcomes are unique per user and day. Freezes are granted weekly, used automatically on absence and milestone payouts are keyed to the date." },
          { id: "redeem", label: "Redemption", sub: "approve and fulfil", hot: true, detail: "Points are deducted first, an account manager approves, the provider is called once and the code goes out by email and push. A rejection refunds the original lots." },
          { id: "adapters", label: "Provider adapters", sub: "catalog and orders", hot: true, detail: "YouGotAGift, Daleel, Qyubic and LikeCard sit behind adapters with catalog sync, idempotent order references and balance alerts." },
        ],
      },
      {
        id: "stores",
        label: "State",
        nodes: [
          { id: "ledger", label: "SQL Server ledger", sub: "lots and balances", hot: true, detail: "Every earn, redemption, refund and expiry is recorded. Balances are materialized per user and window, and redemption uses earliest-expiry lots first." },
          { id: "credit", label: "Prepaid credit", sub: "tenant budget", detail: "Each tenant funds a points budget. Awards draw it down, and an exhausted budget refuses the award and rolls the transaction back." },
          { id: "gift", label: "Gift cards", sub: "YouGotAGift, Daleel", detail: "Real-value gift cards and e-vouchers fulfil approved redemptions." },
          { id: "coupons", label: "Coupons", sub: "Qyubic, LikeCard", detail: "Discount coupons and merchant cards are synced by workers and signed webhooks." },
        ],
      },
    ],
    note: "Points are prepaid by the tenant. An award that would exceed the tenant credit is refused, never created.",
  },

  2: {
    title: "Construction ERP / job path",
    aria: "Construction ERP data flow: field and office users work in a Blazor WebAssembly client over a .NET API with OData and Hangfire, AI agents draft estimates and invoices, QuickBooks syncs through webhooks and completed job files upload to Google Drive.",
    stages: [
      {
        id: "inputs",
        label: "Inputs",
        nodes: [
          { id: "users", label: "Field and office", sub: "estimators and crews", hot: true, detail: "Estimators and field crews work in the same system from the first site visit to the final invoice." },
          { id: "qb", label: "QuickBooks", sub: "webhook sync", hot: true, detail: "Estimates, invoices and payments sync through webhooks, so nobody re-enters the same data twice." },
          { id: "drive-in", label: "Google Drive", sub: "job files", detail: "Completed job files upload to Google Drive as part of close-out." },
        ],
      },
      {
        id: "app",
        label: "Application",
        nodes: [
          { id: "wasm", label: "Blazor WASM", sub: "job-site UI", hot: true, detail: "The client is Blazor WebAssembly, so the interface stays responsive on a job-site connection." },
          { id: "api", label: ".NET API", sub: "OData and commands", hot: true, detail: "The API exposes OData query surfaces and command endpoints, with the job lifecycle modelled explicitly." },
          { id: "jobs", label: "Hangfire", sub: "scheduled work", detail: "Recurring and delayed work runs through Hangfire: reminders, sync retries and document generation." },
        ],
      },
      {
        id: "automation",
        label: "Automation",
        nodes: [
          { id: "agents", label: "AI agents", sub: "estimates and entry", hot: true, detail: "AI agents draft estimates and invoices, handle data entry and keep the job record current." },
          { id: "sync", label: "Sync worker", sub: "retry and reconcile", detail: "Failed QuickBooks calls are retried and reconciled after an outage instead of being lost." },
        ],
      },
      {
        id: "state",
        label: "State",
        nodes: [
          { id: "pg", label: "PostgreSQL", sub: "jobs and line items", detail: "The operational store for jobs, estimates, invoices and line items." },
          { id: "invoice", label: "Estimate to invoice", sub: "one lifecycle", hot: true, detail: "The whole job lifecycle is digitized, with the same identifiers carried from quote to invoice." },
        ],
      },
    ],
    note: "Agents do the data entry. Webhooks keep QuickBooks and the job record in agreement.",
  },

  1: {
    title: "Synchron / delivery path",
    aria: "Synchron data flow: managers, staff and clients use role-based dashboards on Blazor Server, with SignalR messaging, a media pipeline on Cloudflare R2 and Dropbox, and PostgreSQL storage.",
    stages: [
      {
        id: "people",
        label: "People",
        nodes: [
          { id: "managers", label: "Managers", sub: "assign and approve", hot: true, detail: "Managers assign work, review progress and approve deliverables." },
          { id: "staff", label: "Staff", sub: "track and submit", detail: "Staff track assigned work and submit deliverables against the project record." },
          { id: "clients", label: "Clients", sub: "review and sign off", detail: "Clients review deliverables without seeing internal staff views." },
        ],
      },
      {
        id: "app",
        label: "Application",
        nodes: [
          { id: "server", label: "Blazor Server", sub: "role dashboards", hot: true, detail: "One Blazor Server application projects the same data into three role-based dashboards." },
          { id: "signalr", label: "SignalR", sub: "live messaging", hot: true, detail: "Project messaging is real time over SignalR, so updates appear without a refresh." },
          { id: "media", label: "Media pipeline", sub: "upload and deliver", detail: "Deliverable media is uploaded, stored and served through a pipeline that hides the storage provider." },
        ],
      },
      {
        id: "state",
        label: "State",
        nodes: [
          { id: "pg", label: "PostgreSQL", sub: "projects and threads", detail: "Projects, users, messages and deliverable records live in PostgreSQL." },
          { id: "r2", label: "Cloudflare R2", sub: "object storage", detail: "R2 stores deliverable objects and serves them without egress surprises." },
          { id: "dropbox", label: "Dropbox", sub: "client folders", detail: "Dropbox integration keeps client-owned folders in sync where the client already works." },
        ],
      },
    ],
    note: "One project record, three audiences, each with its own permissions and view.",
  },

  4: {
    title: "Automation / weekly path",
    aria: "Automation data flow: schedules and completed job media trigger n8n pipelines that use Whisper and OpenAI to produce weekly content, then write to WordPress, Google Drive and QuickBooks.",
    stages: [
      {
        id: "triggers",
        label: "Triggers",
        nodes: [
          { id: "schedule", label: "Schedule", sub: "weekly run", detail: "Pipelines start on a weekly schedule or a business event such as a completed job." },
          { id: "media", label: "Job media", sub: "photos and clips", hot: true, detail: "Completed job photos and clips are the raw material for the weekly content pipeline." },
          { id: "speech", label: "Whisper", sub: "speech to text", detail: "Whisper transcribes spoken input when the source arrives as audio." },
        ],
      },
      {
        id: "automation",
        label: "Automation",
        nodes: [
          { id: "n8n", label: "n8n", sub: "10+ pipelines", hot: true, detail: "n8n coordinates the steps, retries and hand-offs across more than ten production pipelines." },
          { id: "openai", label: "OpenAI", sub: "copy and extraction", hot: true, detail: "Language models draft copy and pull structured data out of unstructured job material." },
          { id: "validation", label: "Validation", sub: "schema and retry", detail: "Outputs are checked against a schema before they reach another system, with retries on failure." },
        ],
      },
      {
        id: "outputs",
        label: "Outputs",
        nodes: [
          { id: "wordpress", label: "WordPress", sub: "weekly content", hot: true, detail: "Approved content publishes to WordPress on the weekly cadence." },
          { id: "qb", label: "QuickBooks", sub: "estimates and invoices", hot: true, detail: "Agents create estimates and invoices and handle data entry in QuickBooks." },
          { id: "drive", label: "Google Drive", sub: "job archive", detail: "Completed job media and documents are archived to Google Drive." },
        ],
      },
    ],
    note: "Ten pipelines in production. Each one can be re-run without creating duplicates.",
  },

  5: {
    title: "PredictAi / forecast path",
    aria: "PredictAi data flow: years of NYSE history pass through ingestion and cleaning into feature preparation and an LSTM model trained with TensorFlow, then a Flask API serves forecasts to a web client, with results stored in SQL Server.",
    stages: [
      {
        id: "data",
        label: "Data",
        nodes: [
          { id: "history", label: "NYSE history", sub: "1,000+ companies", hot: true, detail: "Years of historical prices for more than 1,000 listed companies." },
          { id: "ingest", label: "Ingestion", sub: "scheduled pulls", detail: "Automated ingestion keeps the dataset current without manual exports." },
          { id: "clean", label: "Cleaning", sub: "gaps and outliers", detail: "A cleaning pipeline normalizes gaps and outliers before training." },
        ],
      },
      {
        id: "model",
        label: "Model",
        nodes: [
          { id: "features", label: "Feature prep", sub: "windows and scaling", detail: "Time windows and scaling turn raw series into model-ready sequences." },
          { id: "lstm", label: "LSTM", sub: "TensorFlow", hot: true, detail: "LSTM networks trained on years of history to forecast trend direction." },
        ],
      },
      {
        id: "serving",
        label: "Serving",
        nodes: [
          { id: "flask", label: "Flask API", sub: "REST predictions", hot: true, detail: "A Flask API serves predictions to the web frontend." },
          { id: "web", label: "Web client", sub: "charts", hot: true, detail: "A JavaScript client presents forecasts and historical context." },
        ],
      },
      {
        id: "store",
        label: "State",
        nodes: [{ id: "mssql", label: "MSSQL", sub: "history and results", detail: "Historical prices and prediction results are stored in Microsoft SQL Server." }],
      },
    ],
    note: "A graduation project that treated forecasting as a data pipeline problem, not a model demo.",
  },
};
