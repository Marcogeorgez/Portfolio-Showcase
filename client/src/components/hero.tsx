import { lazy, Suspense } from "react";
import { ArrowDownRight, ArrowUpRight, Download, Github, Linkedin } from "lucide-react";
import { personalInfo, statsData } from "@/data";

const HeroScene = lazy(() => import("@/components/hero-scene"));

const socials = [
  { label: "GitHub", href: personalInfo.github, icon: Github, external: true },
  { label: "LinkedIn", href: personalInfo.linkedin, icon: Linkedin, external: true },
  { label: "CV", href: personalInfo.cvUrl, icon: Download, external: false },
];

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden border-b border-line bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.45)_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.45)_55%,transparent_100%)]"
        style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "16.666% 100%" }}
      />
      <Suspense
        fallback={
          <div
            aria-hidden="true"
            className="hero-scene-mask pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,rgba(255,255,255,0.07),transparent_55%)]"
          />
        }
      >
        <HeroScene />
      </Suspense>

      <div className="wrap relative z-10 flex flex-1 flex-col justify-between pb-8 pt-24 md:pb-10 md:pt-32">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
          <div className="max-w-[46rem]">
            <div className="hero-rise flex flex-wrap items-center gap-x-3 gap-y-2" style={{ animationDelay: "40ms" }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">Available for new opportunities</span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {personalInfo.location} · Working worldwide
              </span>
            </div>

            <h1 className="display-1 hero-rise mt-7 text-balance max-md:text-[2.7rem]" style={{ animationDelay: "120ms" }}>
              I build the software businesses run on.
            </h1>

            <p className="lede hero-rise mt-6 max-w-[38rem] text-pretty max-md:text-[16px]" style={{ animationDelay: "200ms" }}>
              Full-stack engineer in <strong className="font-medium text-white">.NET and Blazor</strong>. I ship production platforms for workforce, ERP and marketplace teams, and{" "}
              <strong className="font-medium text-white">AI agent pipelines</strong> that take repetitive work off the people running them.
            </p>

            <div className="hero-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "280ms" }}>
              <a href="#work" className="btn btn-solid" data-cursor-label="Work">
                See the work
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" className="btn btn-ghost" data-cursor-label="Talk">
                Get in touch
              </a>
            </div>

            <div className="hero-rise mt-7 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ animationDelay: "360ms" }}>
              {socials.map(({ label, href, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-white sm:text-[12px]"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="link-underline">{label}</span>
                  {external && <ArrowUpRight className="h-3 w-3 opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />}
                </a>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[26rem] lg:block" aria-hidden="true">
            <div className="absolute bottom-2 right-0 flex flex-col items-end gap-2">
              <span className="mono text-[11px] uppercase tracking-[0.22em] text-muted">Fig. 01 / System topology</span>
              <span className="h-px w-28 bg-line-strong" />
              <span className="mono text-[11px] uppercase tracking-[0.22em] text-muted">10+ pipelines · 6 platforms</span>
            </div>
          </div>
        </div>

        <div className="hero-rise mt-10 md:mt-14" style={{ animationDelay: "460ms" }}>
          <dl className="grid grid-cols-3 border-t border-line">
            {statsData.map((stat, index) => (
              <div key={stat.label} className={`flex flex-col-reverse gap-2 py-5 md:flex-row md:items-end md:justify-between md:gap-6 md:py-7 ${index > 0 ? "border-l border-line pl-4 md:pl-7" : "pr-4 md:pr-7"}`}>
                <dt className="max-w-[14ch] font-mono text-[11px] uppercase leading-[1.45] tracking-[0.13em] text-muted md:max-w-[15ch] md:text-[11px]">{stat.label}</dt>
                <dd className="text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-none tracking-[-0.05em] text-white">
                  {stat.value}
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
