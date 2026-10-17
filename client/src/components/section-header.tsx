import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/** Shared section header: eyebrow kicker, title, gradient rule, optional description. */
export function SectionHeader({ kicker, title, description, align = "left" }: { kicker: string; title: string; description?: string; align?: "left" | "center" }) {
  const centered = align === "center";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className={cn("mb-12 md:mb-16", centered && "text-center")}>
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{kicker}</span>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold">{title}</h2>
      <div className={cn("mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-transparent", centered && "mx-auto")} />
      {description && <p className={cn("mt-5 text-muted-foreground max-w-2xl leading-relaxed", centered && "mx-auto")}>{description}</p>}
    </motion.div>
  );
}

/** Counts up to `value` the first time it scrolls into view. */
export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || value === 0) return;
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** Rotates through phrases with a typewriter effect. Respects reduced motion by showing the first phrase. */
export function TypedHeading({ phrases, className }: { phrases: string[]; className?: string }) {
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [text, setText] = useState(phrases[0]);
  const [deleting, setDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const current = phrases[index % phrases.length];
    if (!deleting && text === current) {
      const hold = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(hold);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }
    const step = deleting ? 40 : 75;
    const timer = setTimeout(() => {
      setText((prev) => (deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)));
    }, step);
    return () => clearTimeout(timer);
  }, [text, deleting, index, phrases, prefersReduced]);

  return (
    <span className={className}>
      {text}
      <span className="border-r-2 border-primary ml-1 animate-[blink_1s_steps(1)_infinite]" aria-hidden="true" />
      <span className="sr-only">{phrases.join(", ")}</span>
    </span>
  );
}

/**
 * Wraps the pointer handlers used by spotlight/tilt cards.
 * On pointer move it sets --mouse-x/--mouse-y (percentage and pixel units) on the element.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      el.style.setProperty("--mouse-x-percent", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--mouse-y-percent", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    el.addEventListener("pointermove", handle);
    return () => el.removeEventListener("pointermove", handle);
  }, []);
  return ref;
}
