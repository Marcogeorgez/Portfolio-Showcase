import { useEffect, useRef, useState } from "react";
import { Switch, Route } from "wouter";
import { CommandPalette } from "@/components/command-palette";
import { Cursor } from "@/components/cursor";
import Home from "@/pages/home";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />;
}

function Toast() {
  const [message, setMessage] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail) return;
      setMessage(detail);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setMessage(""), 2200);
    };
    window.addEventListener("show-toast", onToast);
    return () => {
      window.removeEventListener("show-toast", onToast);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 ${
        message ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {message || "\u00a0"}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/Portfolio-Showcase" component={Home} />
      {/* Fallback: catch-all points at the single-page portfolio */}
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <div className="grain-overlay" aria-hidden="true" />
      <Cursor />
      <CommandPalette />
      <Router />
      <Toast />
    </>
  );
}

export default App;
