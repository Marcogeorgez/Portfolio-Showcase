import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download, Menu, Search, X } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import { navLinks, personalInfo } from "@/data";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const SECTION_IDS = ["work", "about", "experience", "stack", "play", "contact"];

function openPalette() {
  window.dispatchEvent(new Event("open-command-palette"));
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const active = useScrollSpy(SECTION_IDS);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)) setShortcut("⌘K");
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;
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

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`border-b bg-black/80 backdrop-blur-xl transition-colors duration-300 ${scrolled ? "border-line" : "border-transparent"}`}>
        <div className="wrap flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <a href="#top" className="flex items-center gap-3">
            <LogoMark className="h-7 w-7 shrink-0 text-white" />
            <span className="flex flex-col leading-none">
              <span className="text-[16px] font-medium tracking-[-0.02em]">Marco George</span>
              <span className="mt-1 hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted sm:block">.NET / AI systems</span>
            </span>
            <span className="sr-only">, back to top</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <a key={link.name} href={link.href} aria-current={isActive ? "true" : undefined} className={`relative py-2 text-[14.5px] transition-colors duration-200 ${isActive ? "text-white" : "text-muted hover:text-white"}`}>
                  {link.name}
                  <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-white transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open quick navigation"
              className="hidden h-9 items-center gap-2 rounded-full border border-line px-3 text-[14px] text-muted transition-colors duration-200 hover:border-line-strong hover:text-white md:flex"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="ml-1 hidden rounded border border-line px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-muted xl:inline">{shortcut}</kbd>
            </button>

            <a href={personalInfo.cvUrl} className="hidden h-9 items-center gap-1.5 rounded-full px-2.5 text-[14px] text-muted transition-colors duration-200 hover:text-white md:inline-flex" data-cursor-label="CV">
              CV
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <a href="#contact" className="btn btn-solid h-9 px-4 text-[14px]" data-cursor-label="Hire">
              Get in touch
            </a>

            <button
              ref={menuButtonRef}
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-white transition-colors hover:border-line-strong lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div ref={panelRef} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" className="fixed inset-0 top-16 z-40 overflow-y-auto border-t border-line bg-black md:top-[72px] lg:hidden">
          <div className="wrap flex min-h-[calc(100svh-4rem)] flex-col justify-between py-10 md:min-h-[calc(100svh-4.5rem)]">
            <nav aria-label="Mobile" className="flex flex-col">
              {navLinks.map((link, index) => (
                <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)} className="group flex items-center justify-between border-b border-line py-5">
                  <span className="display-3 text-white">{link.name}</span>
                  <span className="mono text-[11px] tracking-[0.18em] text-muted">0{index + 1}</span>
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.setTimeout(openPalette, 0);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-left text-[15px] text-muted"
              >
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" aria-hidden="true" /> Quick navigation
                </span>
                <kbd className="font-mono text-[11px]">{shortcut}</kbd>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a href={personalInfo.cvUrl} className="btn btn-ghost w-full" onClick={() => setMenuOpen(false)}>
                  Download CV
                </a>
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
                  GitHub <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {personalInfo.location} · {personalInfo.timezone} · {personalInfo.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
