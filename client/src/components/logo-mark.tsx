type LogoMarkProps = {
  className?: string;
};

/**
 * A small system mark: three connected nodes with an outlined core.
 * All nodes are rings, never filled dots, so the mark cannot be confused
 * with the custom cursor when it is hovered.
 */
export function LogoMark({ className = "" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M16 4.5 5.5 27.5M16 4.5l10.5 23M5.5 27.5h21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="4.5" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="5.5" cy="27.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="26.5" cy="27.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
