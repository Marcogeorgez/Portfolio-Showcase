import { useMemo, useState } from "react";
import { ArrowUpRight, Github, Play } from "lucide-react";
import { projectsData, type Project } from "@/data";

function initials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function ProjectMedia({ project, index }: { project: Project; index: number }) {
  const [playing, setPlaying] = useState(false);

  if (project.videoUrl) {
    return (
      <div className="relative mt-6 overflow-hidden border border-line bg-panel">
        {playing ? (
          <video src={project.videoUrl} className="media-mono aspect-video w-full object-cover" controls autoPlay muted loop playsInline preload="metadata" />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group relative block w-full" aria-label={`Play the ${project.title} demo reel`}>
            <div className="aspect-video w-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.09),transparent_62%)]" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-white/80 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 h-4 w-4 fill-white text-white" aria-hidden="true" />
              </span>
            </div>
            <span className="absolute bottom-3 left-3 bg-black/75 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white">Demo reel / {project.year}</span>
          </button>
        )}
      </div>
    );
  }

  if (project.imageUrl) {
    return (
      <div className="relative mt-6 overflow-hidden border border-line bg-panel">
        <img src={project.imageUrl} alt={`${project.title} interface`} loading="lazy" decoding="async" className="media-mono aspect-video w-full object-cover" />
        <span className="absolute bottom-3 left-3 bg-black/75 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white">Interface / {project.year}</span>
      </div>
    );
  }

  return (
    <div className="relative mt-6 aspect-video overflow-hidden border border-line bg-panel">
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Case / {String(index + 1).padStart(2, "0")}</span>
        <span className="font-display text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-none tracking-[-0.06em] text-white/85">{initials(project.title)}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{project.domain}</span>
      </div>
    </div>
  );
}

function ProjectRow({ project, index, open, onToggle }: { project: Project; index: number; open: boolean; onToggle: () => void }) {
  const triggerId = `work-trigger-${project.id}`;
  const panelId = `work-panel-${project.id}`;

  return (
    <article className="work-row border-t border-line" data-open={open}>
      <h3>
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          data-cursor-label={open ? "Close" : "Open"}
          className="grid w-full grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-x-4 gap-y-2 py-6 text-left md:grid-cols-[3rem_minmax(0,1.6fr)_minmax(0,0.95fr)_minmax(0,1.15fr)_2rem] md:gap-6 md:py-8"
        >
          <span className="mono self-start pt-1.5 text-[11px] tracking-[0.12em] text-muted md:self-center md:pt-0">{String(index + 1).padStart(2, "0")}</span>

          <span className="work-title block text-[clamp(1.55rem,3.1vw,2.65rem)] font-medium leading-[1.04] tracking-[-0.04em] text-white">
            {project.title}
            <span className="mt-2 block font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-muted md:hidden">{project.category}</span>
          </span>

          <span className="hidden text-[14px] text-soft md:block">{project.category}</span>
          <span className="hidden truncate font-mono text-[11px] uppercase tracking-[0.08em] text-muted md:block">{project.technologies.slice(0, 3).join(" · ")}</span>

          <span className="work-arrow grid h-8 w-8 place-items-center justify-self-end rounded-full border border-line text-white" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M8 3v10M3 8h10" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>

      <div id={panelId} className="work-body" data-open={open} role="region" aria-labelledby={triggerId} aria-hidden={!open} inert={!open}>
        <div>
          <div className="grid gap-10 pb-12 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] md:gap-16 md:pb-16">
            <div>
              <p className="max-w-[62ch] text-[16px] leading-[1.75] text-soft md:text-base">{project.description}</p>

              {project.highlights && project.highlights.length > 0 && (
                <ul className="mt-8">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <li key={highlight} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-t border-line py-3.5 text-[14.5px] leading-[1.6] text-soft md:text-[15px]">
                      <span className="mono pt-0.5 text-[11px] tracking-[0.1em] text-muted">{String(highlightIndex + 1).padStart(2, "0")}</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside>
              <dl className="grid grid-cols-2 gap-x-5 gap-y-5 border-t border-line pt-5">
                <div>
                  <dt className="eyebrow">Year</dt>
                  <dd className="mt-2 text-[15px] text-white">{project.year}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Role</dt>
                  <dd className="mt-2 text-[15px] text-white">{project.role}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Domain</dt>
                  <dd className="mt-2 text-[15px] text-white">{project.domain}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Scope</dt>
                  <dd className="mt-2 text-[15px] text-white">{project.metric ?? "Production"}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.technologies.map((technology) => (
                  <span key={technology} className="tag">
                    {technology}
                  </span>
                ))}
              </div>

              <ProjectMedia project={project} index={index} />

              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-70">
                  {project.link.includes("github") ? <Github className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  View repository
                </a>
              )}
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const projects = useMemo(() => projectsData.slice().sort((a, b) => a.order - b.order), []);
  const [openId, setOpenId] = useState<number | null>(projects[0]?.id ?? null);

  return (
    <section id="work" className="section-pad" aria-labelledby="work-heading">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">01 / Selected work</span>
            <h2 id="work-heading" className="display-2 mt-4 max-w-[15ch] text-balance">
              Platforms and pipelines, shipped.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-[1.7] text-muted md:pb-2">
            Six client platforms and ten-plus automations in production. Open a row for the architecture, constraints and what the build actually does.
          </p>
        </div>

        <div className="mt-12 border-b border-line md:mt-16">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} open={openId === project.id} onToggle={() => setOpenId((current) => (current === project.id ? null : project.id))} />
          ))}
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">One row open at a time. All seven builds are production work, except PredictAi, the graduation project.</p>
      </div>
    </section>
  );
}
