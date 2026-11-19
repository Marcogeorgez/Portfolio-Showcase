import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { navLinks, personalInfo } from "@/data";

const CAIRO_TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false });

function CairoTime() {
  const [time, setTime] = useState(() => CAIRO_TIME.format(new Date()));
  useEffect(() => {
    const update = () => setTime(CAIRO_TIME.format(new Date()));
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <span>{time}</span>;
}

export function Footer() {
  return (
    <footer className="ops-footer">
      <div className="ops-wrap">
        <div className="ops-footer-top">
          <span className="ops-footer-name">Marco George</span>
          <nav className="ops-footer-links" aria-label="Footer">
            {[...navLinks, { name: "Contact", href: "#contact" }].map((link) => (
              <a key={link.name} href={link.href}>
                {link.name}
              </a>
            ))}
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </nav>
        </div>

        <div className="ops-footer-base">
          <span>© {new Date().getFullYear()} Marco George. Cairo, EG</span>
          <span className="flex items-center gap-4">
            <span>
              CAI <CairoTime />, GMT+2
            </span>
            <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
            <a href="#top" className="inline-flex items-center gap-1">
              Top <ArrowUp className="h-2.5 w-2.5" aria-hidden="true" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
