import { ArrowUpRight } from "lucide-react";
import { factsData, nowData, principlesData, personalInfo } from "@/data";

export function About() {
  return (
    <section id="about" className="ops-section" aria-labelledby="about-heading">
      <div className="ops-wrap">
        <div className="ops-section-head">
          <div>
            <p className="ops-label">
              <span>03</span>
              <span>Operator</span>
            </p>
            <h2 id="about-heading" className="ops-h2">
              The whole system, not a ticket.
            </h2>
          </div>
          <p>I take the data model, the API, the admin portal, the integrations and the deployment.</p>
        </div>

        <div className="ops-about">
          <div>
            <p className="ops-statement">I design and ship the whole thing, then stay for the part where it has to keep working.</p>

            <div className="ops-about-copy ops-body">
              <p>
                My day job is <strong>Nizamy</strong>, a multi-tenant HR and workforce platform at T2 Hub. I own the .NET backend and the Angular admin portal:
                scheduling, attendance, ROI analytics and the reward integrations behind <strong>PointSystem</strong>.
              </p>
              <p>
                Before that, I spent 18 months freelancing. I built and supported four client platforms across project management, ERP, marketplaces and contractor marketing.
                Most ran on Railway, and I handled the infrastructure after launch.
              </p>
              <p>
                I build AI where it has to be correct. <strong>Atlas</strong> answers compliance questions from a 6,000-rule registry with page citations and refuses when the
                registry has no basis. <strong>KIT</strong> checks the business before it writes a page. Ten-plus n8n pipelines handle the repetitive work around them.
              </p>
            </div>

            <div className="ops-rules">
              {principlesData.map((principle, index) => (
                <div key={principle.title} className="ops-rule">
                  <span className="ops-rule-id">R.{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="ops-panel">
              <div className="ops-panel-head">
                <span>Operator / now</span>
                <b>● active</b>
              </div>
              <div className="ops-panel-body">
                <dl className="ops-facts">
                  {nowData.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                  {factsData.slice(0, 2).map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="ops-panel-note">Right now I am learning more about Kubernetes and Stripe integrations.</p>
              </div>
            </div>

            <div className="ops-panel mt-4">
              <div className="ops-panel-head">
                <span>Files</span>
              </div>
              <div className="ops-panel-body">
                <a href={personalInfo.cvUrl} className="flex min-h-11 items-center justify-between text-[0.8rem] text-[var(--chalk)] hover:text-[var(--signal)]">
                  Print CV
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-11 items-center justify-between text-[0.8rem] text-[var(--chalk)] hover:text-[var(--signal)]">
                  GitHub
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <p className="ops-panel-note">Cairo, GMT+2. I reply within one business day.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
