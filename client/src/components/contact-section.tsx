import { useState } from "react";
import { Check, Copy, Download, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/section-header";
import { personalInfo } from "@/data";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context); fall back to a normal mailto link.
      window.location.href = `mailto:${personalInfo.email}`;
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-white/5 relative">
      <div className="glow-orb bg-primary/25 w-[500px] h-[500px] bottom-0 right-0" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader kicker="Contact" title="Let's build something together" description="Have a project, a role, or an idea that needs a dependable engineer? My inbox is always open." align="center" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl glass-panel p-8 md:p-12 text-center overflow-hidden"
        >
          <p className="font-display text-2xl md:text-4xl font-bold mb-2">
            Say <span className="text-gradient-primary">hello</span>.
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Tell me what you're working on. I usually reply within a day.</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 h-14 text-base font-medium text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Mail className="w-5 h-5" /> {personalInfo.email}
            </a>
            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 h-14 text-base text-foreground hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 transition-all"
              aria-live="polite"
            >
              {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied!" : "Copy email"}
            </button>
            <a
              href={personalInfo.cvUrl}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 h-14 text-base text-foreground hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-5 h-5" /> CV
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <a href={`tel:${personalInfo.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> {personalInfo.phone}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {personalInfo.location}
            </span>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Github className="w-4 h-4" /> github/marcogeorgez
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Linkedin className="w-4 h-4" /> linkedin/marcogeorgez
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
