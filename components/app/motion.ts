// Motion tokens for the product app. Quiet and fast: state changes, not decoration.
// CSS mirrors the curve as --ease-snap (app/globals.css).
export const ease = {
  snap: [0.16, 1, 0.3, 1],
} as const;

/** Seconds. Hover/feedback → fast, most state changes → base, panels → slow. */
export const dur = {
  fast: 0.12,
  base: 0.18,
  slow: 0.24,
} as const;

export const snap = { duration: dur.base, ease: ease.snap };
