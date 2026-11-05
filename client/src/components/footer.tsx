import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import { navLinks, personalInfo } from "@/data";

function CairoTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted" suppressHydrationWarning>
      Cairo {time || "--:--"}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap py-14 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <a href="#top" className="group inline-flex items-center gap-4" aria-label="Marco George, back to top">
              <LogoMark className="h-8 w-8 shrink-0 text-white" />
              <span className="display-2 tracking-[-0.05em] text-white">Marco George</span>
              <ArrowUp className="h-5 w-5 text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-white" aria-hidden="true" />
            </a>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.7] text-muted">Full-stack engineer working in .NET and Blazor, with AI pipelines that take repetitive work off teams.</p>
            <p className="mt-5 font-mono text-[11px] uppercase leading-[1.7] tracking-[0.14em] text-muted">
              {personalInfo.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="eyebrow">Sitemap</p>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[14px] text-muted transition-colors hover:text-white">
                      {link.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#contact" className="text-[14px] text-muted transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-white">
                    <Github className="h-3.5 w-3.5" aria-hidden="true" /> GitHub
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-white">
                    <Linkedin className="h-3.5 w-3.5" aria-hidden="true" /> LinkedIn
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href={`mailto:${personalInfo.email}`} className="group inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-white">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
                  </a>
                </li>
                <li>
                  <a href={personalInfo.cvUrl} className="group inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-white">
                    <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download CV
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase leading-[1.7] tracking-[0.12em] text-muted">© {new Date().getFullYear()} Marco George. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <CairoTime />
            <a href="#top" className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-white">
              Back to top
              <ArrowUp className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
