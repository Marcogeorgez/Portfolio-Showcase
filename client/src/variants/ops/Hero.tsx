import { ArrowDownRight, ArrowUpRight, Github, Linkedin } from "lucide-react";
import { personalInfo, statsData } from "@/data";

function SystemMap() {
  return (
    <div className="ops-map">
      <div className="ops-map-head">
        <span>System map / production</span>
        <b>
          <i className="inline-block h-1 w-1 bg-[var(--signal)]" aria-hidden="true" /> live
        </b>
      </div>

      <svg viewBox="0 0 480 272" role="img" aria-label="System map: client applications connect to .NET APIs and core services, backed by PostgreSQL, n8n automation and language models.">
        <defs>
          <marker id="ops-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="#2d3945" />
          </marker>
          <marker id="ops-arrow-hot" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="#ffb020" />
          </marker>
        </defs>

        <g className="ops-map-node">
          <rect x="14" y="24" width="128" height="44" />
          <text x="24" y="42">CLIENTS</text>
          <text className="label" x="24" y="56">Blazor, Angular</text>
        </g>

        <g className="ops-map-node" data-hot="true">
          <rect x="14" y="122" width="128" height="44" />
          <text x="24" y="140">API LAYER</text>
          <text className="label" x="24" y="154">.NET, REST</text>
        </g>

        <g className="ops-map-node" data-hot="true">
          <rect x="182" y="88" width="118" height="56" />
          <text x="192" y="106">CORE</text>
          <text className="label" x="192" y="120">Nizamy / Atlas</text>
          <text className="node-sub" x="192" y="133">multi-tenant, rewards</text>
        </g>

        <g className="ops-map-node">
          <rect x="340" y="24" width="126" height="44" />
          <text x="350" y="42">DATA</text>
          <text className="label" x="350" y="56">PostgreSQL, SQL</text>
        </g>

        <g className="ops-map-node" data-hot="true">
          <rect x="340" y="88" width="126" height="44" />
          <text x="350" y="106">AUTOMATION</text>
          <text className="label" x="350" y="120">n8n, agents</text>
        </g>

        <g className="ops-map-node">
          <rect x="340" y="196" width="126" height="44" />
          <text x="350" y="214">MODELS</text>
          <text className="label" x="350" y="228">vision, LLM</text>
        </g>

        <path className="ops-map-link" data-hot="true" d="M78 68 V122" markerEnd="url(#ops-arrow-hot)" />
        <path className="ops-map-link" data-hot="true" d="M142 144 H182 V132" markerEnd="url(#ops-arrow-hot)" />
        <path className="ops-map-link" d="M300 108 H340 V62" markerEnd="url(#ops-arrow)" />
        <path className="ops-map-link" data-hot="true" d="M300 118 H340" markerEnd="url(#ops-arrow-hot)" />
        <path className="ops-map-link" d="M403 132 V196" markerEnd="url(#ops-arrow)" />
        <path className="ops-map-link" d="M340 222 H300 V144" markerEnd="url(#ops-arrow)" />
      </svg>

      <div className="ops-map-foot">
        <span>6 platforms</span>
        <span>10+ pipelines</span>
        <span>2.5k standards indexed</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="ops-hero">
      <div className="ops-wrap">
        <div className="ops-hero-grid">
          <div>
            <p className="ops-kicker">Senior software engineer at T2 Hub</p>
            <h1 className="ops-display">
              Everything here runs in <em>production</em>.
            </h1>
            <p className="ops-lede ops-hero-lede">
              Multi-tenant .NET platforms, ERP systems and AI agents that cite the clause they came from. I build the schema, the API, the interface and the deployment. Then I
              keep it running.
            </p>

            <div className="ops-hero-actions">
              <a href="#work" className="ops-btn">
                Open the production board
                <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <a href="#contact" className="ops-btn ops-btn-quiet">
                Talk to me
              </a>
            </div>

            <div className="ops-hero-facts">
              <span>{personalInfo.location}, GMT+2</span>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                GitHub <ArrowUpRight className="h-2.5 w-2.5" aria-hidden="true" />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                LinkedIn <ArrowUpRight className="h-2.5 w-2.5" aria-hidden="true" />
              </a>
              <a href={personalInfo.cvUrl}>CV</a>
            </div>
          </div>

          <SystemMap />
        </div>

        <div className="ops-tape">
          <div>
            <span>01 / Platforms</span>
            <p>Workforce, rewards, ERP and compliance.</p>
          </div>
          <div>
            <span>02 / AI</span>
            <p>Agents that cite the clause, not a guess</p>
          </div>
          <div>
            <span>03 / Deploy</span>
            <p>Railway, Cloudflare R2 and Docker.</p>
          </div>
          <div>
            <span>04 / Next</span>
            <p>Senior .NET and full-stack roles.</p>
          </div>
        </div>

        <dl className="ops-instruments">
          {statsData.map((stat) => (
            <div key={stat.label} className="ops-instrument">
              <dt className="ops-instrument-label">{stat.label}</dt>
              <dd className="ops-instrument-value">
                {stat.value}
                {stat.suffix}
              </dd>
            </div>
          ))}
          <div className="ops-instrument">
            <dt className="ops-instrument-label">Standards indexed with citations</dt>
            <dd className="ops-instrument-value">
              2.5k
              <small>pages</small>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
