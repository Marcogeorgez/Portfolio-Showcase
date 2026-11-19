import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, Play, X } from "lucide-react";
import { projectsData, type Project } from "@/data";
import { SystemFlow } from "./SystemFlow";
import { flows } from "./flow-data";

function DrawerMedia({ project }: { project: Project }) {
  const [playing, setPlaying] = useState(false);

  if (project.videoUrl && project.posterUrl) {
    return (
      <figure className="ops-drawer-media">
        {playing ? (
          <video src={project.videoUrl} poster={project.posterUrl} controls autoPlay playsInline preload="none" />
        ) : (
          <button type="button" className="ops-drawer-play" onClick={() => setPlaying(true)} aria-label={`Play the ${project.title} demo`}>
            <img
              src={project.posterUrl}
              srcSet={project.posterSmall ? `${project.posterSmall} 640w, ${project.posterUrl} 1280w` : undefined}
              sizes="(max-width: 700px) 94vw, 540px"
              alt={`${project.title} interface`}
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
            />
            <span>
              <Play className="h-3 w-3 fill-current" aria-hidden="true" /> Play demo
            </span>
          </button>
        )}
      </figure>
    );
  }

  if (project.imageUrl) {
    return (
      <figure className="ops-drawer-media">
        <img
          src={project.imageUrl}
          srcSet={project.imageSmall ? `${project.imageSmall} 800w, ${project.imageUrl} 1600w` : undefined}
          sizes="(max-width: 700px) 94vw, 540px"
          alt={`${project.title} interface`}
          width={1600}
          height={project.title === "PredictAi" ? 937 : 822}
          loading="lazy"
          decoding="async"
        />
      </figure>
    );
  }

  return null;
}

function Drawer({ project, onClose, trigger }: { project: Project; onClose: () => void; trigger: HTMLElement | null }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), video[controls]');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      trigger?.focus?.();
    };
  }, [onClose, trigger]);

  return (
    <>
      <div className="ops-drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="ops-drawer" role="dialog" aria-modal="true" aria-labelledby="ops-drawer-title">
        <div className="ops-drawer-head">
          <span className="ops-mono">Case file / {project.year}</span>
          <button ref={closeRef} type="button" className="ops-icon-btn" onClick={onClose} aria-label="Close the case file">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="ops-drawer-body">
          <p className="ops-kicker">{project.domain}</p>
          <h3 id="ops-drawer-title" className="mt-2">
            {project.title}
          </h3>
          <p className="ops-drawer-desc">{project.description}</p>

          {flows[project.id] && <SystemFlow spec={flows[project.id]} />}

          {project.highlights && project.highlights.length > 0 && (
            <ul className="ops-drawer-list">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}

          <dl className="ops-drawer-meta">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{project.metric ?? "Production"}</dd>
            </div>
            <div>
              <dt>Domain</dt>
              <dd>{project.domain}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>

          <p className="ops-drawer-tech">{project.technologies.join(" / ")}</p>

          <DrawerMedia project={project} />

          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="ops-drawer-link">
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              Open the repository
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export function Work() {
  const projects = projectsData.slice().sort((a, b) => a.order - b.order);
  const [selected, setSelected] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = (project: Project, element: HTMLElement) => {
    triggerRef.current = element;
    setSelected(project);
  };

  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="work" className="ops-section" aria-labelledby="work-heading">
      <div className="ops-wrap">
        <div className="ops-section-head">
          <div>
            <p className="ops-label">
              <span>02</span>
              <span>Production board</span>
            </p>
            <h2 id="work-heading" className="ops-h2">
              Six platforms. All shipped.
            </h2>
          </div>
          <p>Workforce, rewards, ERP, marketplaces and compliance. Open a tile to see how it works and what it had to survive.</p>
        </div>

        <div className="ops-board">
          {projects.map((project, index) => {
            const internal = project.title === "PredictAi";
            const clientBuild = project.title === "KIT";
            return (
              <button
                key={project.id}
                type="button"
                className="ops-tile"
                data-featured={index === 0}
                onClick={(event) => open(project, event.currentTarget)}
                aria-haspopup="dialog"
              >
                <span className="ops-tile-top">
                  <span className="ops-chip" data-kind={internal ? "internal" : undefined}>
                    <i aria-hidden="true" />
                    {internal ? "Graduation project" : clientBuild ? "Client build" : "In production"}
                  </span>
                  <span className="ops-tile-index">C.{String(index + 1).padStart(2, "0")}</span>
                </span>

                <span className="ops-tile-title">{project.title}</span>
                <span className="ops-tile-tagline">{project.tagline}</span>

                <span className="ops-tile-foot">
                  <span>
                    {project.domain} / <b>{project.metric ?? project.year}</b>
                  </span>
                  <span className="ops-tile-open">
                    Open case <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="ops-board-note">
          <span>Eight case files. Six platforms shipped.</span>
          <span>Media shown as captured, in full color.</span>
        </p>
      </div>

      {selected && <Drawer project={selected} onClose={close} trigger={triggerRef.current} />}
    </section>
  );
}
