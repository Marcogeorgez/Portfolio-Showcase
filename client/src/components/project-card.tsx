import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpotlight } from "@/components/section-header";
import type { Project } from "@/data";

function ProjectMedia({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  if (project.videoUrl) {
    return (
      <div className="aspect-video relative overflow-hidden border-b border-white/5 group/media">
        <video ref={videoRef} src={project.videoUrl} preload="metadata" loop muted playsInline controls={playing} className="w-full h-full object-cover" />
        {!playing && (
          <button
            onClick={start}
            aria-label={`Play ${project.title} demo video`}
            className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] group-hover/media:bg-background/20 transition-colors"
          >
            <span className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 group-hover/media:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-7 h-7 translate-x-0.5" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    );
  }

  if (project.imageUrl) {
    return (
      <div className="aspect-video relative overflow-hidden border-b border-white/5">
        <img
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          loading="lazy"
          width={1280}
          height={720}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video relative overflow-hidden border-b border-white/5 flex items-center justify-center bg-dot-pattern">
      <span className="font-display text-6xl font-bold text-white/10 select-none">{project.title.charAt(0)}</span>
    </div>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const spotlightRef = useSpotlight<HTMLDivElement>();

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: (index % 2) * 0.1, duration: 0.5 }} className="group">
      <Card
        ref={spotlightRef}
        className="card-spotlight overflow-hidden bg-card/80 md:backdrop-blur border-white/10 hover:border-primary/40 transition-[border-color,box-shadow] duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col py-0"
      >
        <div className="card-glow-line" />
        <ProjectMedia project={project} />

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">{project.category}</span>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {project.link.includes("github") ? <Github className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
              </a>
            )}
          </div>

          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">{project.description}</p>

          <AnimatePresence initial={false}>
            {expanded && project.highlights && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden mb-6 space-y-2 text-sm text-muted-foreground/90"
              >
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="text-primary mt-0.5" aria-hidden="true">
                      ▸
                    </span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="mt-auto space-y-5">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="bg-primary/10 text-emerald-100 border-primary/30">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {project.highlights && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {expanded ? "Hide details" : "Case details"}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                </button>
              )}
              {project.link && (
                <Button asChild variant="secondary" size="sm">
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    View Project
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
