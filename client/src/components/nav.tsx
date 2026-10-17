import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks, personalInfo } from "@/data";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useScrollSpy(["about", "skills", "experience", "projects"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass-panel py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
              <span className="font-display font-bold text-primary text-sm">MG</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Marco<span className="text-primary">.</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-current={active === link.href.slice(1) ? "page" : undefined}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  active === link.href.slice(1) ? "text-foreground bg-white/5" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              className="ml-2 flex items-center gap-2 px-3 py-2 rounded-full text-sm text-muted-foreground glass-panel hover:text-foreground hover:border-primary/30 transition-colors"
              aria-label="Open command palette"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Ctrl K</kbd>
            </button>
            <Button asChild variant="outline" className="ml-2 rounded-full px-5 border-primary/30 hover:border-primary hover:bg-primary/5 hidden sm:inline-flex">
              <a href={personalInfo.cvUrl}>
                <Download className="w-4 h-4 mr-2" /> CV
              </a>
            </Button>
          </nav>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" aria-label={mobileOpen ? "Close menu" : "Open menu"} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-white/5 py-4 px-4 flex flex-col gap-2"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-medium block px-4 py-2 rounded-lg transition-colors ${
                  active === link.href.slice(1) ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href={personalInfo.cvUrl}
              className="flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Download className="w-4 h-4" /> Download CV
            </a>
            <div className="px-4 pt-2">
              <Button asChild className="w-full rounded-xl">
                <a href={`mailto:${personalInfo.email}`}>Get in Touch</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
