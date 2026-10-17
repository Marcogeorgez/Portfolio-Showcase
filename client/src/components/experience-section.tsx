import { useExperiences } from "@/hooks/use-portfolio";
import { SectionHeader } from "@/components/section-header";
import { Building2, Calendar, Rocket } from "lucide-react";

export function ExperienceSection() {
  const experiences = useExperiences().slice().sort((a, b) => a.order - b.order).reverse();

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader kicker="Career" title="Professional Experience" />

        <div className="relative">
          {/* Continuous vertical timeline */}
          <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-px bg-white/10 -translate-x-1/2" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <div key={exp.id} className="relative grid md:grid-cols-2 gap-6 md:gap-24">
                {/* Node on the line */}
                <div className="absolute left-4 md:left-1/2 top-6 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-background -translate-x-1/2 z-10" />

                <div className={`pl-10 md:pl-0 ${i % 2 === 0 ? "md:justify-self-end" : "md:order-2 md:col-start-2"} md:w-[calc(100%-3rem)]`}>
                  <div className="bg-card/50 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors shadow-lg shadow-black/20">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                        <Building2 className="w-4 h-4" />
                        {exp.company}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        {exp.period.includes("Present") ? <Rocket className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        {exp.period}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{exp.role}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground/90">
                      {exp.description.map((desc, idx) => (
                        <li key={idx} className="flex gap-2 text-left">
                          <span className="text-primary mt-1 shrink-0">•</span>
                          <span className="leading-relaxed">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`hidden md:block ${i % 2 === 0 ? "md:order-2" : "md:order-1"}`} />
              </div>
            ))}

            {/* Node capping the line */}
            <div className="absolute left-4 md:left-1/2 -bottom-8 w-3.5 h-3.5 rounded-full border-2 border-primary/50 -translate-x-1/2 z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
