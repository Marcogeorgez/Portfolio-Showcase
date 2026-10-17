import { useProjects } from "@/hooks/use-portfolio";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";

export function ProjectsSection() {
  const projects = useProjects().slice().sort((a, b) => a.order - b.order);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          kicker="Selected Work"
          title="Featured Projects"
          description="Full-stack platforms, ERP integrations, and AI workflow automations delivered for international clients. Click a case for the details behind each build."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
