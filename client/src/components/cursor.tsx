import { useEffect, useRef } from "react";

/**
 * Minimal pointer: a small difference-blended dot that grows slightly
 * over interactive elements. No filled circle and no label, so the
 * hovered control stays completely readable. Native cursor returns over
 * inputs and game canvases.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let visible = false;

    const onPointerMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
      }
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const nativeZone = target.closest('[data-cursor="native"], input, textarea, select');
      root.classList.toggle("cursor-native", Boolean(nativeZone));
      const interactive = target.closest("a, button, [role='button'], [role='option'], summary, [data-cursor]");
      dot.classList.toggle("is-active", Boolean(interactive) && !nativeZone);
    };

    const onPointerDown = () => dot.classList.add("is-pressed");
    const onPointerUp = () => dot.classList.remove("is-pressed");
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
    };

    dot.style.opacity = "0";

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      root.classList.remove("has-custom-cursor", "cursor-native");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
