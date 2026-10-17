import { marqueeSkills } from "@/data";

/** Infinite horizontal strip of core technologies. Duplicated once so the CSS animation loops seamlessly. */
export function TechMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/5 py-5 bg-white/[0.02]" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 [--marquee-duration:38s]" style={{ width: "max-content" }}>
        {[0, 1].map((half) => (
          <div key={half} className="flex gap-10">
            {marqueeSkills.map((skill) => (
              <span key={skill} className="flex items-center gap-10 text-sm font-medium text-muted-foreground whitespace-nowrap">
                {skill}
                <span className="text-primary/60" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
