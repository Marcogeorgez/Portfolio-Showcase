import { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { navLinks, personalInfo } from "@/data";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const SECTION_IDS = navLinks.map((link) => link.href.slice(1));

const CAIRO_TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false });

function CairoClock() {
  const [time, setTime] = useState(() => CAIRO_TIME.format(new Date()));
  useEffect(() => {
    const update = () => setTime(CAIRO_TIME.format(new Date()));
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <span>CAI {time}</span>;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="ops-header">
        <div className="ops-wrap ops-header-inner">
          <a href="#top" className="ops-brand">
            <span className="ops-brand-mark" aria-hidden="true">
              <BrandMark className="h-4 w-4" />
            </span>
            <span className="ops-brand-text">
              <span className="ops-brand-name">Marco George</span>
              <span className="ops-brand-sub">Production systems</span>
            </span>
          </a>

          <nav className="ops-nav" aria-label="Sections">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              return (
                <a key={link.name} href={link.href} aria-current={active === id ? "true" : undefined}>
                  {link.name}
                </a>
              );
            })}
            <a href="#contact" aria-current={active === "contact" ? "true" : undefined}>
              Contact
            </a>
          </nav>

          <div className="ops-header-right">
            <span className="ops-clock">
              <CairoClock />, GMT+2
            </span>
            <span className="ops-status">
              <i aria-hidden="true" /> Open to work
            </span>
            <button type="button" className="ops-icon-btn" onClick={() => window.dispatchEvent(new Event("open-command-palette"))} aria-label="Open the command index">
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <a href="#contact" className="ops-btn ops-header-cta">
              Dispatch
            </a>
            <button
              ref={buttonRef}
              type="button"
              className="ops-icon-btn ops-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="ops-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div ref={panelRef} id="ops-menu" className="ops-menu" role="dialog" aria-modal="true" aria-label="Site menu" tabIndex={-1}>
          <nav aria-label="Sections">
            {[...navLinks, { name: "Contact", href: "#contact" }].map((link, index) => (
              <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.name}
                <span>{String(index + 2).padStart(2, "0")}</span>
              </a>
            ))}
          </nav>
          <div className="ops-menu-foot">
            <a href={personalInfo.cvUrl} className="ops-btn ops-btn-quiet flex-1">
              Download CV
            </a>
            <a href={`mailto:${personalInfo.email}`} className="ops-btn flex-1">
              Email
            </a>
          </div>
        </div>
      )}
    </>
  );
}
