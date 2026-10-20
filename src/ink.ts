/*
 * Tiny geometry helpers for a hand-inked look:
 * - `ink()` turns a centre-line into a filled, tapered brush stroke.
 * - `smooth()` turns control points into a smooth closed/open path.
 * - `blob()` builds a closed shape where some points are sharp tips (for hair).
 */

export type P = [number, number];

/** Catmull-Rom sampling through the given points. */
export const sample = (pts: P[], closed = false, seg = 10): P[] => {
  const n = pts.length;
  if (n < 2) return pts;
  const get = (i: number): P => {
    if (closed) return pts[(i + n) % n];
    return pts[Math.max(0, Math.min(n - 1, i))];
  };
  const out: P[] = [];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    for (let s = 0; s < seg; s++) {
      const t = s / seg;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
};

const fmt = (p: P) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

export const smooth = (pts: P[], closed = true): string => {
  const s = sample(pts, closed);
  return `M${s.map(fmt).join(' L')}${closed ? ' Z' : ''}`;
};

/**
 * Tapered brush stroke along a centre-line.
 * `w` is the max width; `start`/`end` are the width ratios at the ends (0 = sharp).
 */
export const ink = (pts: P[], w = 5, start = 0.15, end = 0.15): string => {
  const s = sample(pts, false, 12);
  const n = s.length;
  const left: P[] = [];
  const right: P[] = [];
  for (let i = 0; i < n; i++) {
    const a = s[Math.max(0, i - 1)];
    const b = s[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const t = i / (n - 1);
    // ease in from `start`, full in the middle, ease out to `end`
    const k = t < 0.5 ? start + (1 - start) * Math.sin(Math.PI * t) : end + (1 - end) * Math.sin(Math.PI * t);
    const hw = (w * Math.max(0.12, k)) / 2;
    left.push([s[i][0] - dy * hw, s[i][1] + dx * hw]);
    right.push([s[i][0] + dy * hw, s[i][1] - dx * hw]);
  }
  return `M${left.map(fmt).join(' L')} L${right.reverse().map(fmt).join(' L')} Z`;
};

/**
 * Closed shape through points; points flagged `true` are sharp corners
 * (hair tips), the rest are smoothed with midpoint quadratics.
 */
export const blob = (pts: [number, number, boolean?][]): string => {
  const n = pts.length;
  const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const P_ = (i: number): P => [pts[(i + n) % n][0], pts[(i + n) % n][1]];
  const sharp = (i: number) => Boolean(pts[(i + n) % n][2]);
  let d = '';
  for (let i = 0; i < n; i++) {
    const cur = P_(i);
    const startPt = sharp(i) ? cur : mid(P_(i - 1), cur);
    if (i === 0) d += `M${fmt(startPt)}`;
    const next = P_(i + 1);
    if (sharp(i)) {
      // straight to the next anchor (or to its midpoint if it is smooth)
      d += ` L${fmt(sharp(i + 1) ? next : mid(cur, next))}`;
    } else {
      d += ` Q${fmt(cur)} ${fmt(sharp(i + 1) ? next : mid(cur, next))}`;
    }
  }
  return d + ' Z';
};
