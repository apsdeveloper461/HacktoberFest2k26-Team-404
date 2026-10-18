// Server half of the seam: computes the hand-drawn wobble once.
import { wobble } from "../sketch/rough";
import { SeamLine } from "./SeamLine";

export function Seam({ seed, label, tone }: { seed: number; label: string; tone?: "ink" | "chalk" }) {
  return <SeamLine offsets={wobble(seed, 25, 7)} label={label} tone={tone} />;
}
