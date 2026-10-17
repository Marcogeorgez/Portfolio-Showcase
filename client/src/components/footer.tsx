import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { navLinks, personalInfo } from "@/data";

export function Footer() {
  return (
    <footer className="py-12 md:py-16 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
          <div className="text-center md:text-left">
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              Marco<span className="text-primary">.</span>
            </span>
            <p className="text-sm text-muted-foreground mt-1">Full-Stack Engineer & AI Automation Specialist</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {link.name}
              </a>
            ))}
            <a href={personalInfo.cvUrl} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Download CV
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {[
              { icon: Github, href: personalInfo.github, label: "GitHub" },
              { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
              { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:-translate-y-0.5 transition-all"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
            <a
              href="#top"
              aria-label="Back to top"
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:-translate-y-0.5 transition-all"
            >
              <ArrowUp className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Marco George. All rights reserved.</span>
          <span>
            Built with <span className="text-foreground/80">React</span>, <span className="text-foreground/80">Tailwind CSS</span> and stubborn attention to detail.
          </span>
        </div>
      </div>
    </footer>
  );
}
