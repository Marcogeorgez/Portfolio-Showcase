type BrandMarkProps = {
  className?: string;
};

/**
 * The brand mark: an M drawn as a continuous path with one node at the end.
 * Replaces the old three-node triangle. Works at 20px and at 120px.
 */
export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M5 26V7l11 13L27 7v19" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="miter" strokeLinecap="square" />
      <circle cx="27" cy="26" r="2.4" fill="currentColor" />
    </svg>
  );
}
