import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { GameCabinet, type GameId } from "@/components/game-cabinet";

const TABS: Array<{ id: GameId; name: string; kind: string }> = [
  { id: "hotfix", name: "Hotfix", kind: "Reflex" },
  { id: "throughput", name: "Throughput", kind: "Systems" },
];

export function Play() {
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
    document.getElementById(`ops-tab-${next.id}`)?.focus();
  };

  return (
    <section id="play" className="ops-section" aria-labelledby="play-heading">
      <div className="ops-wrap">
        <div className="ops-section-head">
          <div>
            <p className="ops-label">
              <span>06</span>
              <span>Sandbox</span>
            </p>
            <h2 id="play-heading" className="ops-h2">
              Break production safely.
            </h2>
          </div>
          <p>Two small games. One is about reflexes, one is about routing traffic. Both run in the browser and only load when you scroll here.</p>
        </div>

        <div className="ops-sandbox">
          <div className="ops-sandbox-head">
            <span>Sandbox / two cabinets</span>
            <span>Nothing saved. Nothing leaves the page.</span>
          </div>

          <div className="ops-tabs" role="tablist" aria-label="Sandbox games">
            {TABS.map((tab, index) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`ops-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="arcade-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className="ops-tab"
                >
                  <span className="ops-tab-index">0{index + 1}</span>
                  {tab.name}
                  <small>{tab.kind}</small>
                </button>
              );
            })}
          </div>

          <div id="arcade-panel" role="tabpanel" aria-labelledby={`ops-tab-${active}`} className="ops-sandbox-body arcade-embed">
            <GameCabinet game={active} />
          </div>

          <p className="ops-sandbox-foot">
            <span>Arrows or WASD. Space to act.</span>
            <span>Touch works too.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
