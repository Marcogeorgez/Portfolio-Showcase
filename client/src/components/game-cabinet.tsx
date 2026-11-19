import { lazy, Suspense, useEffect, useRef, useState } from "react";

const HotfixGame = lazy(() => import("./hotfix").then((module) => ({ default: module.HotfixGame })));
const ThroughputGame = lazy(() => import("./throughput").then((module) => ({ default: module.ThroughputGame })));

export type GameId = "hotfix" | "throughput";
export type GameTheme = "light" | "dark";

/**
 * Mounts a canvas game only once the arcade panel is near the viewport.
 * Keeps both game engines out of the initial mobile payload.
 */
export function GameCabinet({ game, theme = "dark" }: { game: GameId; theme?: GameTheme }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setMounted(true);
        observer.disconnect();
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {mounted ? (
        <Suspense fallback={<Placeholder />}>
          {game === "hotfix" ? <HotfixGame theme={theme} /> : <ThroughputGame theme={theme} />}
        </Suspense>
      ) : (
        <Placeholder />
      )}
    </div>
  );
}

function Placeholder() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16" aria-hidden="true">
      <div className="order-2 lg:order-1">
        <p className="max-w-[40ch] text-[16px] leading-[1.75] text-soft">
          Bugs fall toward the production line. Squash them before they land. Armored bugs take two hits, splitters break apart, and critical bugs cost two lives.
        </p>

        <dl className="mt-8 border-t border-line">
          {[
            ["Controls", "Click / tap, or arrows + space"],
            ["Patch", "Fill the meter, then press E or deploy"],
            ["Waves", "Every 20 squashes; boss every third wave"],
            ["Best", "0 points, saved in this browser"],
          ].map(([term, detail]) => (
            <div key={term} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
              <dt className="eyebrow">{term}</dt>
              <dd className="text-[14px] text-soft">{detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 font-mono text-[11px] uppercase leading-[1.8] tracking-[0.14em] text-muted">No sound. No tracking. Just a canvas and your reflexes.</p>
      </div>

      <div className="game-shell order-1 lg:order-2">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Loading cabinet…</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Standby</span>
        </div>
        <div className="game-canvas" />
        <div className="border-t border-line px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Score · Combo · Lives · Wave · Best</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Start</span>
          </div>
          <div className="mt-3 h-1 w-full bg-line" />
        </div>
      </div>
    </div>
  );
}

