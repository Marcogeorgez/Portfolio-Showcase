import { Reveal } from "@/components/reveal";
import { experiencesData } from "@/data";

export function ExperienceSection() {
  const experiences = experiencesData.slice().sort((a, b) => b.order - a.order);

  return (
    <section id="experience" className="section-pad border-t border-line" aria-labelledby="experience-heading">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">03 / Experience</span>
            <h2 id="experience-heading" className="display-2 mt-4 max-w-[14ch] text-balance">
              Two roles. Continuous ownership.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-[1.7] text-muted md:pb-2">From schema and API design through production releases and the support that follows. The detail maps directly to the CV.</p>
        </div>

        <div className="mt-12 border-t border-line md:mt-16">
          {experiences.map((experience, index) => (
            <Reveal key={experience.id} delay={index * 100}>
              <article className="grid gap-8 border-b border-line py-10 md:grid-cols-[0.72fr_1.28fr] md:gap-16 md:py-14">
                <div>
                  <span className="mono text-[11px] uppercase tracking-[0.14em] text-muted">{experience.period}</span>
                  <h3 className="mt-4 text-[clamp(1.35rem,2.2vw,1.8rem)] font-medium leading-tight tracking-[-0.03em] text-white">{experience.role}</h3>
                  <p className="mt-2 text-[15px] text-soft">{experience.company}</p>
                  {experience.location && <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{experience.location}</p>}

                  {experience.stack && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {experience.stack.map((item) => (
                        <span key={item} className="tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <ul>
                  {experience.description.map((item, itemIndex) => (
                    <li key={item} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-t border-line py-3.5 first:border-t-0 first:pt-0 md:grid-cols-[2rem_minmax(0,1fr)]">
                      <span className="mono pt-0.5 text-[11px] tracking-[0.1em] text-muted">{String(itemIndex + 1).padStart(2, "0")}</span>
                      <span className="text-[14.5px] leading-[1.7] text-soft md:text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
