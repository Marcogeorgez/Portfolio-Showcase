import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowUpRight, Copy, Download, Github, Linkedin, Mail, Search } from "lucide-react";
import { navLinks, personalInfo } from "@/data";

type Action = {
  id: string;
  label: string;
  hint: string;
  keywords: string[];
  icon?: typeof Mail;
  run: () => void;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

function showToast(message: string) {
  window.dispatchEvent(new CustomEvent("show-toast", { detail: message }));
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const actions = useMemo<Action[]>(() => {
    const navigation: Action[] = navLinks.map((link) => ({
      id: `nav-${link.href.slice(1)}`,
      label: link.name,
      hint: "Section",
      keywords: [link.name, link.href, "jump", "go"],
      run: () => scrollToId(link.href.slice(1)),
    }));

    navigation.push({
      id: "nav-contact",
      label: "Contact",
      hint: "Section",
      keywords: ["contact", "email", "hire", "talk"],
      run: () => scrollToId("contact"),
    });

    const playGame = (game: "hotfix" | "throughput", startEvent: string) => {
      scrollToId("arcade-panel");
      const scrollDelay = prefersReducedMotion() ? 80 : 700;
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("select-game", { detail: game }));
        window.setTimeout(() => window.dispatchEvent(new Event(startEvent)), 160);
      }, scrollDelay);
    };

    return [
      ...navigation,
      {
        id: "action-hotfix",
        label: "Play Hotfix",
        hint: "Game",
        keywords: ["game", "play", "hotfix", "bugs", "reflex", "break"],
        run: () => playGame("hotfix", "start-hotfix"),
      },
      {
        id: "action-throughput",
        label: "Play Throughput",
        hint: "Game",
        keywords: ["game", "play", "throughput", "systems", "load", "balance", "servers", "queues"],
        run: () => playGame("throughput", "start-throughput"),
      },
      {
        id: "action-copy",
        label: "Copy email address",
        hint: "Action",
        keywords: ["copy", "email", "clipboard", "mail"],
        icon: Copy,
        run: () => {
          if (!navigator.clipboard) {
            window.location.href = `mailto:${personalInfo.email}`;
            return;
          }
          void navigator.clipboard
            .writeText(personalInfo.email)
            .then(() => showToast("Email copied"))
            .catch(() => {
              window.location.href = `mailto:${personalInfo.email}`;
            });
        },
      },
      {
        id: "action-cv",
        label: "Download CV",
        hint: "Action",
        keywords: ["cv", "resume", "download", "pdf"],
        icon: Download,
        run: () => window.location.assign(personalInfo.cvUrl),
      },
      {
        id: "link-github",
        label: "Open GitHub",
        hint: "Link",
        keywords: ["github", "code", "repository", "source"],
        icon: Github,
        run: () => window.open(personalInfo.github, "_blank", "noopener"),
      },
      {
        id: "link-linkedin",
        label: "Open LinkedIn",
        hint: "Link",
        keywords: ["linkedin", "profile", "work", "hire"],
        icon: Linkedin,
        run: () => window.open(personalInfo.linkedin, "_blank", "noopener"),
      },
      {
        id: "link-email",
        label: "Send an email",
        hint: "Link",
        keywords: ["email", "mail", "contact", "write"],
        icon: Mail,
        run: () => window.location.assign(`mailto:${personalInfo.email}`),
      },
    ];
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return actions;
    return actions.filter((action) => `${action.label} ${action.hint} ${action.keywords.join(" ")}`.toLowerCase().includes(normalized));
  }, [actions, query]);

  const safeActive = Math.min(active, Math.max(filtered.length - 1, 0));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setQuery("");
    setActive(0);

    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const item = document.getElementById(`palette-item-${safeActive}`);
    item?.scrollIntoView({ block: "nearest" });
  }, [open, safeActive]);

  const close = () => setOpen(false);

  const runAction = (action: Action) => {
    close();
    action.run();
  };

  const onPanelKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (filtered.length === 0 ? 0 : (Math.min(current, filtered.length - 1) + 1) % filtered.length));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (filtered.length === 0 ? 0 : (Math.min(current, filtered.length - 1) - 1 + filtered.length) % filtered.length));
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActive(Math.max(filtered.length - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const action = filtered[safeActive];
      if (action) runAction(action);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]" role="presentation">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={close} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Quick navigation"
        onKeyDown={onPanelKeyDown}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-[#0a0a0a] shadow-[0_30px_120px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={filtered.length > 0 ? `palette-item-${safeActive}` : undefined}
            placeholder="Jump to a section or action"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-[16px] text-white placeholder:text-muted"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted sm:inline">Esc</kbd>
        </div>

        <div className="px-2 py-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-10 text-center text-[15px] text-muted">No commands found. Try &ldquo;work&rdquo;, &ldquo;email&rdquo; or &ldquo;CV&rdquo;.</p>
          ) : (
            <ul id="palette-list" role="listbox" aria-label="Commands" className="max-h-[52vh] overflow-y-auto">
              {filtered.map((action, index) => {
                const isActive = index === safeActive;
                const Icon = action.icon;
                return (
                  <li
                    key={action.id}
                    id={`palette-item-${index}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => runAction(action)}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 ${isActive ? "bg-white text-black" : "text-soft"}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      {Icon ? (
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-black" : "text-muted"}`} aria-hidden="true" />
                      ) : (
                        <span className={`mono w-3.5 shrink-0 text-[11px] ${isActive ? "text-black" : "text-muted"}`}>{String(index + 1).padStart(2, "0")}</span>
                      )}
                      <span className="truncate text-[14.5px]">{action.label}</span>
                    </span>
                    <span className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] ${isActive ? "text-black/75" : "text-muted"}`}>{action.hint}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <span>↑↓ Navigate</span>
            <span className="hidden sm:inline">↵ Select</span>
            <span className="hidden sm:inline">Esc Close</span>
          </div>
          <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
