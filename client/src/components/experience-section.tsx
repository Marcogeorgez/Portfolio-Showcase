import { motion } from "framer-motion";
import { useExperiences } from "@/hooks/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Calendar } from "lucide-react";

export function ExperienceSection() {
  const { data: experiences, isLoading } = useExperiences();

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Experience</h2>
          <div className="w-20 h-1 bg-primary rounded-full mb-8" />
        </motion.div>

        <div className="space-y-12">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="space-y-12 relative">
              {/* Single continuous timeline line */}
              <div className="hidden md:block absolute left-1/2 top-1 m-0 bottom-0 w-px bg-black/10 dark:bg-white/10 -translate-x-1/2" />

              {experiences
                ?.sort((a, b) => a.order - b.order)
                .reverse()
                .map((exp, i) => (
                  <motion.div key={exp.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

                    <div className={`md:flex items-center justify-between w-full ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                      {/* Content Card */}
                      <div className="md:w-[45%] bg-card/50 border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-colors shadow-lg shadow-black/20">
                        <h3 className="text-xl font-bold text-foreground mb-1">{exp.role}</h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5 text-primary">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{exp.company}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{exp.period}</span>
                          </div>
                        </div>

                        <ul className="space-y-2 text-sm text-muted-foreground/90">
                          {exp.description.map((desc, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="leading-relaxed">{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Empty space for opposite side */}
                      <div className="hidden md:block w-[45%]" />
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
