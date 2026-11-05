import { ArrowDownRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { stackGroups } from "@/data";

export function SkillsSection() {
  return (
    <section id="stack" className="section-pad border-t border-line" aria-labelledby="stack-heading">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">04 / Stack</span>
            <h2 id="stack-heading" className="display-2 mt-4 max-w-[13ch] text-balance">
              Depth, not a wall of logos.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-[1.7] text-muted md:pb-2">Grouped by how I actually use it. Core is what I ship with every week; the rest is proven on client work or active working knowledge.</p>
        </div>

        <div className="mt-12 border-t border-line md:mt-16">
          {stackGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 70}>
              <div className="stack-row grid gap-4 border-b border-line py-8 md:grid-cols-[0.5fr_1.5fr] md:gap-12 md:py-10">
                <div className="flex items-baseline gap-4">
                  <span className="mono text-[11px] tracking-[0.1em] text-muted">0{index + 1}</span>
                  <div>
                    <h3 className="text-[17px] font-medium tracking-[-0.02em] text-white">{group.tier}</h3>
                    <p className="mt-1 text-[12px] leading-[1.5] text-muted">{group.note}</p>
                  </div>
                </div>

                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {group.items.map((item) => (
                    <li key={item} className="group flex items-center gap-2.5 text-[14px] text-soft">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-line-strong transition-colors duration-300 group-hover:bg-white" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Also: Git · Radzen · MudBlazor · Refit</p>
          <a href="#work" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
            See it in the work
            <ArrowDownRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
