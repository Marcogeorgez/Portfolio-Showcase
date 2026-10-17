import { useTestimonials } from "@/hooks/use-portfolio";
import { SectionHeader } from "@/components/section-header";
import { Quote } from "lucide-react";

/** Renders only when real quotes exist in data.ts (testimonialsData). */
export function TestimonialsSection() {
  const testimonials = useTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader kicker="Testimonials" title="What clients say" align="center" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice().sort((a, b) => a.order - b.order).map((t) => (
            <figure key={t.id} className="bg-card/50 border border-white/10 rounded-2xl p-7 hover:border-primary/30 transition-colors">
              <Quote className="w-6 h-6 text-primary mb-4" aria-hidden="true" />
              <blockquote className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-display font-bold text-primary text-sm">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
