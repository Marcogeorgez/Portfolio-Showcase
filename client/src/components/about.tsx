import { Reveal } from "@/components/reveal";
import { nowData, principlesData } from "@/data";

export function About() {
  return (
    <section id="about" className="section-pad border-t border-line" aria-labelledby="about-heading">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.35fr] lg:gap-20">
          <Reveal>
            <span className="eyebrow">02 / About</span>
            <h2 id="about-heading" className="display-2 mt-4 max-w-[11ch] text-balance">
              The whole system, not just the screen.
            </h2>

            <div className="mt-10 border border-line bg-panel/60 p-5">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Now</span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  <span className="h-1 w-1 rounded-full bg-white" aria-hidden="true" />
                  Live
                </span>
              </div>
              <dl className="mt-5 space-y-3.5">
                {nowData.map((item) => (
                  <div key={item.label} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
                    <dt className="font-mono text-[11px] uppercase leading-[1.6] tracking-[0.12em] text-muted">{item.label}</dt>
                    <dd className="text-[14px] leading-[1.5] text-soft">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:pt-2">
            <p className="max-w-[34ch] font-display text-[clamp(1.5rem,2.6vw,2.15rem)] font-medium leading-[1.25] tracking-[-0.03em] text-white">
              I design and ship the whole thing: data model, APIs, admin portal, integrations and deployment. Then I stay for the support.
            </p>

            <div className="mt-8 grid max-w-[62ch] gap-5 text-[16px] leading-[1.75] text-muted">
              <p>
                My day job is <span className="text-soft">Nizamy</span>, a multi-tenant HR and workforce platform at T2 Hub. I own the .NET backend and the Angular administration portal, including scheduling, attendance,
                a reporting warehouse and the voucher integrations behind the rewards program.
              </p>
              <p>
                Before that, two years freelance: six client platforms across project management, ERP and marketplaces. I self-hosted every one on Railway and handled infrastructure and post-launch support myself.
              </p>
              <p>
                I build AI where it has to be correct. Atlas answers compliance questions from a <span className="text-soft">~6,000-rule registry with page citations</span>, and blocks general-knowledge answers so the model cannot
                invent a standard. Ten-plus n8n pipelines handle the repetitive work around it.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              <span className="tag">Correctness-critical systems</span>
              <span className="tag">End-to-end ownership</span>
              <span className="tag">Production, not demos</span>
            </div>

            <p className="mt-5 max-w-[46ch] font-mono text-[11px] uppercase leading-[1.8] tracking-[0.14em] text-muted">
              Currently going deeper on Kubernetes, Stripe and Payfort integration patterns.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid border-t border-line md:mt-24 md:grid-cols-3">
          {principlesData.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 90} className={`h-full ${index > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
              <div className="h-full px-0 py-7 md:px-7 md:py-8">
                <span className="mono text-[11px] tracking-[0.14em] text-muted">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-medium tracking-[-0.02em] text-white">{principle.title}</h3>
                <p className="mt-3 max-w-[34ch] text-[14.5px] leading-[1.7] text-muted">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
