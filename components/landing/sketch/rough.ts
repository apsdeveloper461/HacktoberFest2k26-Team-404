// Seeded "hand-drawn" SVG path generator for the landing page artwork.
// Server only: paths are computed once during prerender, so every visitor
// gets identical markup (no hydration drift) and none of this ships to the
// browser.
import "server-only";

export type Pt = readonly [number, number];

export type StrokeOptions = {
  /** Endpoint wobble in px (scaled up slightly for long lines). */
  roughness?: number;
  /** How much a straight line is allowed to sag. */
  bowing?: number;
  /** 2 = the line is traced twice, like a marker going over itself. */
  passes?: 1 | 2;
  /** How far a line runs past its endpoints. */
  overshoot?: number;
};

type Rand = () => number;

function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const num = (v: number) => (Math.round(v * 10) / 10).toString();
const pt = ([x, y]: Pt) => `${num(x)} ${num(y)}`;

function catmullRom(points: Pt[]): string {
  if (points.length < 2) return "";
  let d = `M${pt(points[0])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d;
}

/** A pen with its own deterministic hand. Call order matters: same seed + same calls = same drawing. */
export class Sketch {
  private rand: Rand;

  constructor(seed: number) {
    this.rand = mulberry32(seed);
  }

  private j(amount: number) {
    return (this.rand() * 2 - 1) * amount;
  }

  line(x1: number, y1: number, x2: number, y2: number, o: StrokeOptions = {}) {
    const { roughness = 1, bowing = 1, passes = 2 } = o;
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    const nx = -uy;
    const ny = ux;
    const over = o.overshoot ?? Math.min(len * 0.035, 7);
    let d = "";
    for (let pass = 0; pass < passes; pass++) {
      const r = roughness * Math.min(1 + len * 0.01, 2.6) * (pass ? 0.65 : 1);
      const back = this.rand() * over * 0.5;
      const ahead = this.rand() * over;
      const s: Pt = [x1 - ux * back + this.j(r), y1 - uy * back + this.j(r)];
      const e: Pt = [x2 + ux * ahead + this.j(r), y2 + uy * ahead + this.j(r)];
      const sign = this.rand() < 0.5 ? -1 : 1;
      const bow = bowing * len * (0.004 + this.rand() * 0.01) * sign;
      const t1 = 0.3 + this.j(0.06);
      const t2 = 0.72 + this.j(0.06);
      const c1: Pt = [
        s[0] + (e[0] - s[0]) * t1 + nx * bow + this.j(r * 0.5),
        s[1] + (e[1] - s[1]) * t1 + ny * bow + this.j(r * 0.5),
      ];
      const c2: Pt = [
        s[0] + (e[0] - s[0]) * t2 + nx * bow * 0.7 + this.j(r * 0.5),
        s[1] + (e[1] - s[1]) * t2 + ny * bow * 0.7 + this.j(r * 0.5),
      ];
      d += `M${pt(s)}C${pt(c1)} ${pt(c2)} ${pt(e)}`;
    }
    return d;
  }

  rect(x: number, y: number, w: number, h: number, o: StrokeOptions = {}) {
    const passes = o.passes ?? 2;
    let d = "";
    for (let pass = 0; pass < passes; pass++) {
      const one: StrokeOptions = {
        ...o,
        passes: 1,
        roughness: (o.roughness ?? 1) * (pass ? 0.75 : 1),
      };
      d += this.line(x, y, x + w, y, one);
      d += this.line(x + w, y, x + w, y + h, one);
      d += this.line(x + w, y + h, x, y + h, one);
      d += this.line(x, y + h, x, y, one);
    }
    return d;
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, o: StrokeOptions = {}) {
    const roughness = o.roughness ?? 1;
    const count = 12;
    const start = this.rand() * Math.PI * 2;
    const sweep = Math.PI * 2 * (1.05 + this.rand() * 0.08);
    const points: Pt[] = [];
    for (let i = 0; i <= count; i++) {
      const a = start + (sweep * i) / count;
      const k = 1 + this.j(0.045 * roughness);
      points.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return catmullRom(points);
  }

  /** A smooth hand-drawn curve through (slightly jittered) points. */
  curve(points: Pt[], o: StrokeOptions = {}) {
    const r = o.roughness ?? 1;
    return catmullRom(points.map(([x, y]) => [x + this.j(r), y + this.j(r)] as const));
  }

  arrow(points: Pt[], o: StrokeOptions & { head?: number } = {}) {
    const head = o.head ?? 11;
    const body = this.curve(points, o);
    const tip = points[points.length - 1];
    const prev = points[points.length - 2] ?? points[0];
    const angle = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
    const wing = (spread: number) => {
      const a = angle + Math.PI + spread;
      return this.line(tip[0], tip[1], tip[0] + Math.cos(a) * head, tip[1] + Math.sin(a) * head, {
        passes: 1,
        roughness: 0.5,
        overshoot: 0,
      });
    };
    return body + wing(0.48) + wing(-0.48);
  }

  polygon(points: Pt[], o: StrokeOptions = {}) {
    let d = "";
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      d += this.line(a[0], a[1], b[0], b[1], { passes: 1, ...o });
    }
    return d;
  }

  cross(x: number, y: number, w: number, h: number, o: StrokeOptions = {}) {
    return (
      this.line(x, y, x + w, y + h, { passes: 1, ...o }) +
      this.line(x + w, y, x, y + h, { passes: 1, ...o })
    );
  }

  check(x: number, y: number, size: number) {
    return this.curve(
      [
        [x, y + size * 0.55],
        [x + size * 0.35, y + size * 0.9],
        [x + size, y],
      ],
      { roughness: 0.6 },
    );
  }

  /** Wavy "handwriting" line used as placeholder copy in wireframes. */
  scribble(x: number, y: number, w: number, amp = 3) {
    const points: Pt[] = [];
    for (let i = 0, cx = x; cx <= x + w; i++, cx += 9) {
      points.push([cx, y + (i % 2 ? -1 : 1) * amp * (0.45 + this.rand() * 0.55)]);
    }
    return catmullRom(points);
  }

  /** Database cylinder. */
  cylinder(x: number, y: number, w: number, h: number) {
    const rx = w / 2;
    const ry = Math.max(6, w * 0.14);
    const cx = x + rx;
    const bottom: Pt[] = [];
    for (let i = 0; i <= 8; i++) {
      const a = (Math.PI * i) / 8;
      bottom.push([cx + Math.cos(a) * rx, y + h + Math.sin(a) * ry]);
    }
    return (
      this.ellipse(cx, y, rx, ry, { roughness: 0.6 }) +
      this.line(x, y, x, y + h, { passes: 1 }) +
      this.line(x + w, y, x + w, y + h, { passes: 1 }) +
      this.curve(bottom.reverse(), { roughness: 0.6 })
    );
  }

  /** Curly brace opening toward `dir` (1 = right, -1 = left). */
  brace(x: number, y1: number, y2: number, dir: 1 | -1 = 1) {
    const mid = (y1 + y2) / 2;
    return this.curve(
      [
        [x, y1],
        [x + dir * 7, y1 + 8],
        [x + dir * 7, mid - 8],
        [x + dir * 15, mid],
        [x + dir * 7, mid + 8],
        [x + dir * 7, y2 - 8],
        [x, y2],
      ],
      { roughness: 0.5 },
    );
  }
}

export function sketch(seed: number) {
  return new Sketch(seed);
}

/** Seeded vertical offsets for a hand-drawn horizontal rule (see Seam). */
export function wobble(seed: number, count: number, amp: number): number[] {
  const rand = mulberry32(seed);
  let drift = 0;
  return Array.from({ length: count }, () => {
    drift = drift * 0.6 + (rand() * 2 - 1) * amp;
    return Math.round(drift * 10) / 10;
  });
}
