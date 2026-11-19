import { useEffect, useRef, useState } from "react";
import OpsSite from "@/variants/ops";
import { CommandPalette } from "@/components/command-palette";

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className="read-progress" style={{ transform: "scaleX(0)" }} aria-hidden="true" />;
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
      timerRef.current = window.setTimeout(() => setMessage(""), 2000);
    };
    window.addEventListener("show-toast", onToast);
    return () => {
      window.removeEventListener("show-toast", onToast);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="toast" role="status" aria-live="polite" data-visible={Boolean(message)}>
      {message || "\u00a0"}
    </div>
  );
}

function App() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let attempts = 0;
    let frame = 0;
    const scroll = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
      if (attempts++ < 40) frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    // Web fonts change the height above the target; settle the deep link once they land.
    document.fonts?.ready.then(() => scroll());
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <CommandPalette />
      <OpsSite />
      <Toast />
    </>
  );
}

export default App;
