import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Copy, Download, Github, Linkedin, Mail, Search } from "lucide-react";
import { navLinks, personalInfo } from "@/data";
import "./palette.css";

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
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const actions: Action[] = [
    ...[...navLinks, { name: "Contact", href: "#contact" }].map((link) => ({
      id: `nav-${link.href.slice(1)}`,
      label: link.name,
      hint: "Section",
      keywords: [link.name, link.href, "jump", "go"],
      run: () => scrollToId(link.href.slice(1)),
    })),
    {
      id: "action-hotfix",
      label: "Play Hotfix",
      hint: "Game",
      keywords: ["game", "play", "hotfix", "bugs", "reflex"],
      run: () => {
        scrollToId("arcade-panel");
        window.setTimeout(() => window.dispatchEvent(new CustomEvent("select-game", { detail: "hotfix" })), 550);
      },
    },
    {
      id: "action-throughput",
      label: "Play Throughput",
      hint: "Game",
      keywords: ["game", "play", "throughput", "systems", "load", "queues"],
      run: () => {
        scrollToId("arcade-panel");
        window.setTimeout(() => window.dispatchEvent(new CustomEvent("select-game", { detail: "throughput" })), 550);
      },
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

  const normalized = query.trim().toLowerCase();
  const filtered = normalized ? actions.filter((action) => `${action.label} ${action.hint} ${action.keywords.join(" ")}`.toLowerCase().includes(normalized)) : actions;
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
    document.getElementById(`palette-item-${safeActive}`)?.scrollIntoView({ block: "nearest" });
  }, [open, safeActive]);

  const close = () => setOpen(false);

  const runAction = (action: Action) => {
    close();
    action.run();
  };

  const onPanelKeyDown = (event: React.KeyboardEvent) => {
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
    <div className="cmdk-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="cmdk-panel" role="dialog" aria-modal="true" aria-label="Quick index" onKeyDown={onPanelKeyDown}>
        <div className="cmdk-input-row">
          <Search className="h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
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
          />
          <kbd className="cmdk-kbd">Esc</kbd>
        </div>

        {filtered.length === 0 ? (
          <p className="cmdk-empty">Nothing matches “{query}”. Try “work”, “email” or “CV”.</p>
        ) : (
          <ul id="palette-list" role="listbox" aria-label="Commands" className="cmdk-list">
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
                  className="cmdk-item"
                >
                  <span className="cmdk-item-label">
                    {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" /> : <span className="cmdk-index">{String(index + 1).padStart(2, "0")}</span>}
                    <span>{action.label}</span>
                  </span>
                  <span className="cmdk-hint">{action.hint}</span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="cmdk-foot">
          <span>↑↓ move</span>
          <span>↵ select</span>
          <span className="inline-flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
