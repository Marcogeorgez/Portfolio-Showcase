import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { HotfixGame } from "@/components/hotfix";
import { ThroughputGame } from "@/components/throughput";

type GameId = "hotfix" | "throughput";

const TABS: Array<{ id: GameId; name: string; kind: string; blurb: string }> = [
  { id: "hotfix", name: "Hotfix", kind: "Reflex", blurb: "Catch defects before production." },
  { id: "throughput", name: "Throughput", kind: "Systems", blurb: "Balance queues under load." },
];

export function PlaySection() {
  const [active, setActive] = useState<GameId>("hotfix");

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail === "hotfix" || detail === "throughput") setActive(detail);
    };
    window.addEventListener("select-game", onSelect);
    return () => window.removeEventListener("select-game", onSelect);
  }, []);

  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;
    else return;

    event.preventDefault();
    const next = TABS[nextIndex];
    setActive(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <section id="play" className="section-pad border-t border-line" aria-labelledby="play-heading">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">05 / Arcade</span>
            <h2 id="play-heading" className="display-2 mt-4 max-w-[15ch] text-balance">
              Two ways to break production.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-[1.7] text-muted md:pb-2">
            One tests reflex. One tests systems thinking. Pick a cabinet and see how long you last.
          </p>
        </div>

        <div role="tablist" aria-label="Arcade games" className="mt-10 grid grid-cols-2 border-y border-line">
          {TABS.map((tab, index) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="arcade-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                data-cursor-label="Play"
                className={`group flex flex-col gap-2 px-4 py-5 text-left transition-colors duration-200 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6 md:py-6 ${
                  index > 0 ? "border-l border-line" : ""
                } ${isActive ? "bg-white text-black" : "text-soft hover:text-white"}`}
              >
                <span className="flex items-baseline gap-3 md:gap-4">
                  <span className={`mono text-[11px] tracking-[0.14em] ${isActive ? "text-black/70" : "text-muted"}`}>0{index + 1}</span>
                  <span className="text-[clamp(1.2rem,2.5vw,1.75rem)] font-medium leading-none tracking-[-0.035em]">{tab.name}</span>
                </span>
                <span className="flex items-baseline justify-between gap-4 md:flex-col md:items-end md:gap-1">
                  <span className={`mono text-[11px] uppercase tracking-[0.14em] ${isActive ? "text-black/70" : "text-muted"}`}>{tab.kind}</span>
                  <span className={`hidden text-[12px] sm:block ${isActive ? "text-black/70" : "text-muted"}`}>{tab.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div id="arcade-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-10">
          {active === "hotfix" ? <HotfixGame /> : <ThroughputGame />}
        </div>
      </div>
    </section>
  );
}
