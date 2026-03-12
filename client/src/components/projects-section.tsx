import { motion } from "framer-motion";
import { useProjects } from "@/hooks/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Image as ImageIcon, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="projects" className="py-24 bg-white/2 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Work</h2>
            <div className="w-20 h-1 bg-primary rounded-full mb-4" />
            <p className="text-muted-foreground max-w-2xl">A selection of my recent projects. Showcasing full-stack applications, API developments, and AI workflow integrations.</p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-100 w-full rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects
              ?.sort((a, b) => a.order - b.order)
              .map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group">
                  <Card className="overflow-hidden bg-card/80 md:backdrop-blur border-white/10 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col py-0">
                    {/* Media Placeholder Area */}
                    <div className="aspect-video bg-background/50 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                      {project.videoUrl ? (
                        <video src={project.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-500">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">{i % 2 === 0 ? <PlayCircle className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}</div>
                          <span className="text-sm font-medium tracking-wider uppercase">Media Placeholder</span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 flex-1">{project.description}</p>

                      <div className="mt-auto space-y-6">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="bg-primary/5 text-primary-foreground/80 border-primary/20">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        {project.link && (
                          <Button asChild variant="secondary" className="w-full sm:w-auto hover-elevate">
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              View Live Project <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
