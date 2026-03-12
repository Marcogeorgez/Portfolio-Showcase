import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-4 md:py-12 border-t border-primary/10 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-display font-bold text-2xl tracking-tight text-foreground mb-2">
              Marco<span className="text-primary">.</span>
            </span>
            <p className="text-sm text-muted-foreground text-center md:text-left">Full-Stack Engineer & AI Automation Specialist</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <a href="mailto:marco2two@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              marco2two@gmail.com
            </a>
            <a href="tel:+201270668980" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              +20 127 066 8980
            </a>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Cairo, Egypt
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-4">
            <a
              href="https://github.com/marcogeorgez"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/marcogeorgez"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:marco2two@gmail.com"
              className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-6 text-sm text-muted-foreground text-center">© {new Date().getFullYear()} Marco George. All rights reserved.</div>
      </div>
    </footer>
  );
}
