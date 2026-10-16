// Scene description layer + per-frame motion maths (pure: everything is a function of time).
// Scenes create items; Video.jsx renders them with Remotion every frame.
import { spring } from 'remotion';
import { K, svg, personInner, badgeSVG, iconSVG } from './art';

export const FPS = 30;
export const C = { ink: '#1F2430', navy: K.navy, gray: '#A3AAB8', red: K.red, lred: K.redL };
let LINES = [];
export const SCENES = [];

export function initEngine(lines) { LINES = lines; SCENES.length = 0; }

// ---------- timing ----------
export function L(i) { return LINES[i].voiced[0][0]; }
export function W(i, sub) {
  const ln = LINES[i], txt = ln.plain;
  const idx = txt.indexOf(sub);
  if (idx < 0) throw new Error('W miss ' + i + ' ' + sub);
  const wt = c => /[\s,.."?!·()]/.test(c) ? 0.25 : 1;
  let before = 0, total = 0;
  for (let k = 0; k < txt.length; k++) { total += wt(txt[k]); if (k < idx) before += wt(txt[k]); }
  const v = ln.voiced, dur = v.reduce((s, [a, b]) => s + b - a, 0);
  let need = dur * before / total;
  for (const [a, b] of v) { if (need <= b - a) return a + need; need -= b - a; }
  return v[v.length - 1][1];
}

// ---------- easing ----------
export const clamp = x => Math.max(0, Math.min(1, x));
export const easeOut = p => 1 - Math.pow(1 - p, 3);
export const easeInOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
export const lerp = (a, b, p) => a + (b - a) * p;
// physical spring (Remotion) driven by absolute time in seconds
export function spr(t, t0, cfg = {}) {
  const f = Math.round((t - t0) * FPS);
  if (f < 0) return 0;
  return spring({ frame: f, fps: FPS, config: Object.assign({ damping: 16, stiffness: 120, mass: 0.9 }, cfg) });
}

// ---------- items ----------
let seq = 0;
export function mk(html, x, y, o = {}) {
  return {
    id: ++seq, html, x, y, t0: o.t, t1: o.out, anim: o.anim || 'up', delay: o.delay || 0, z: o.z || 0,
    fx: o.fx, htmlAt: o.htmlAt, float: o.float || 0, burst: o.burst || false, words: o.words || false,
  };
}
const BURST_ICONS = new Set(['check', 'xmark', 'question', 'alert']);
export function I(name, x, y, size = 200, o = {}) {
  return mk(iconSVG(name, size, o.arg), x, y, Object.assign({ anim: 'pop', float: size >= 170 ? 3 : 0, burst: BURST_ICONS.has(name) }, o));
}
const groundShadow = w => `<div style="position:absolute;left:50%;bottom:-6px;width:${w}px;height:18px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(31,36,48,.14),rgba(31,36,48,0))"></div>`;
export function P(x, y, h = 330, o = {}) {
  const w = h * 200 / 230;
  return mk(`<div style="position:relative">${groundShadow(w * .8)}${svg(w, h, '0 0 200 230', personInner(o))}</div>`, x, y, Object.assign({ anim: 'up', float: 2 }, o));
}
export function Bd(x, y, size = 150, o = {}) {
  return mk(`<div style="border-radius:50%;box-shadow:0 10px 24px rgba(31,36,48,.12)">${badgeSVG(o, o.bg || K.yel, size)}</div>`, x, y, Object.assign({ anim: 'pop' }, o));
}
// text; <em> = red emphasis; words animate in one after another
export function T(html, x, y, size = 64, o = {}) {
  const st = `font-size:${size}px;font-weight:${o.w || 800};color:${o.color || C.ink};line-height:1.32;text-align:center;white-space:nowrap;letter-spacing:-0.025em`;
  return mk(`<div class="tx" style="${st}">${html}</div>`, x, y, Object.assign({ anim: 'words' }, o));
}
export function H(html, o = {}) { return T(html, o.x || 960, o.y || 290, o.size || 60, o); }
export function Lb(html, x, y, o = {}) { return T(html, x, y, o.size || 40, Object.assign({ w: 700, color: '#3A4152', anim: 'up' }, o)); }
export function Tag(html, x, y, o = {}) {
  const red = o.red !== false;
  return mk(`<div style="font-size:${o.size || 36}px;font-weight:800;color:${red ? '#fff' : C.ink};background:${red ? `linear-gradient(180deg,#F5544A,${K.red})` : '#fff'};border:${red ? 0 : 3}px solid ${C.ink};padding:10px 28px 12px;border-radius:999px;white-space:nowrap;letter-spacing:-0.02em;box-shadow:0 10px 24px rgba(238,64,54,${red ? .28 : 0})">${html}</div>`, x, y, Object.assign({ anim: 'pop', burst: red }, o));
}
export function G(svgStr, x, y, o = {}) { return mk(svgStr, x, y, Object.assign({ anim: 'fade' }, o)); }

export function B(html, x, y, o = {}) {
  const size = o.size || 40;
  const tail = o.tail || 'bl';
  const tx = tail === 'bl' ? '22%' : tail === 'br' ? '78%' : '50%';
  const flip = tail === 'br' ? 'scale(-1,1)' : '';
  const tailSvg = o.think
    ? `<svg width="60" height="60" style="position:absolute;left:${tx};top:100%;transform:translate(-50%,8px) ${flip};overflow:visible"><circle cx="16" cy="12" r="11" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/><circle cx="2" cy="38" r="7" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/></svg>`
    : `<svg width="44" height="40" viewBox="0 0 44 40" style="position:absolute;left:${tx};top:100%;transform:translate(-50%,-4px) ${flip};overflow:visible"><path d="M4 0 L10 34 L36 0" fill="#fff" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><rect x="5" y="-6" width="30" height="8" fill="#fff"/></svg>`;
  const html2 = `<div style="position:relative;background:#fff;border:3.5px solid ${C.ink};border-radius:999px;padding:${size * .5}px ${size * .85}px;font-size:${size}px;font-weight:700;color:${C.ink};white-space:nowrap;letter-spacing:-0.02em;line-height:1.2;display:flex;align-items:center;gap:${size * .35}px;box-shadow:0 14px 30px rgba(31,36,48,.10)">${html}${tailSvg}</div>`;
  const ox = tail === 'bl' ? '22% 100%' : tail === 'br' ? '78% 100%' : '50% 100%';
  return Object.assign(mk(html2, x, y, Object.assign({ anim: 'pop' }, o)), { origin: ox });
}
// arrow that draws itself from start to end
export function A(x1, y1, x2, y2, o = {}) {
  const col = o.color || '#8A91A0', sw = o.sw || 5;
  const pad = 30, minx = Math.min(x1, x2) - pad, miny = Math.min(y1, y2) - pad;
  const w = Math.abs(x2 - x1) + pad * 2, h = Math.abs(y2 - y1) + pad * 2;
  const ax = x1 - minx, ay = y1 - miny, bx = x2 - minx, by = y2 - miny;
  const dash = o.dash ? `stroke-dasharray="${o.dash}"` : '';
  const ang = Math.atan2(by - ay, bx - ax), hl = o.head || 18;
  const headAt = (px, py, a) => `${px - hl * Math.cos(a - .5)},${py - hl * Math.sin(a - .5)} ${px},${py} ${px - hl * Math.cos(a + .5)},${py - hl * Math.sin(a + .5)}`;
  const it = mk('', minx + w / 2, miny + h / 2, Object.assign({ anim: 'fade' }, o));
  it.htmlAt = t => {
    const p = spr(t, it.t0, { damping: 22, stiffness: 90 });
    const cx = lerp(ax, bx, p), cy = lerp(ay, by, p);
    const head = !o.nohead && p > .05 ? `<polyline points="${headAt(cx, cy, ang)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` : '';
    const head2 = o.both && p > .05 ? `<polyline points="${headAt(ax, ay, ang + Math.PI)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` : '';
    return `<svg width="${w}" height="${h}" style="display:block;overflow:visible"><line x1="${ax}" y1="${ay}" x2="${cx}" y2="${cy}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" ${dash}/>${head}${head2}</svg>`;
  };
  return it;
}

// ---------- scenes ----------
export function S(t, ...items) { SCENES.push({ t, items: items.flat() }); }
export function seqOut(...items) { for (let k = 0; k < items.length - 1; k++) items[k].t1 = items[k + 1].t0; return items; }

export function finalize(END) {
  SCENES.sort((a, b) => a.t - b.t);
  SCENES.forEach((sc, k) => {
    sc.end = k + 1 < SCENES.length ? SCENES[k + 1].t : END;
    sc.items.forEach(it => {
      if (it.t0 == null) it.t0 = sc.t;
      it.t0 += it.delay; it.delay = 0;
      if (it.t1 == null) it.t1 = sc.end;
    });
  });
  return SCENES;
}

// ---------- per-frame state ----------
const EXIT = 0.35;
// wrap each word of an html string in a span so words can stagger in
function wordSpans(html, t, t0) {
  let k = 0;
  return html.split(/(<[^>]+>)/).map(part => {
    if (part.startsWith('<')) return part;
    return part.split(/(\s+)/).map(w => {
      if (!w.trim()) return w;
      const s = spr(t, t0 + 0.07 * k++, { damping: 15, stiffness: 140 });
      return `<span style="display:inline-block;opacity:${clamp(s * 1.4).toFixed(3)};transform:translateY(${((1 - s) * 34).toFixed(1)}px)">${w}</span>`;
    }).join('');
  }).join('');
}

export function itemState(it, t) {
  if (t < it.t0 || t >= it.t1) return null;
  const s = spr(t, it.t0);
  const q = easeInOut(clamp((it.t1 - t) / EXIT)); // exit fade
  let op = 1, tx = 0, ty = 0, sc = 1;
  switch (it.anim) {
    case 'pop': { const sp = spr(t, it.t0, { damping: 11, stiffness: 150, mass: .8 }); sc = .55 + .45 * sp; op = clamp(s * 2); break; }
    case 'up': ty = (1 - s) * 40; op = clamp(s * 1.5); break;
    case 'down': ty = -(1 - s) * 36; op = clamp(s * 1.5); break;
    case 'left': tx = -(1 - s) * 70; op = clamp(s * 1.5); break;
    case 'right': tx = (1 - s) * 70; op = clamp(s * 1.5); break;
    case 'fade': sc = .96 + .04 * s; op = clamp(s * 1.3); break;
    case 'words': op = 1; break;
  }
  sc *= .97 + .03 * q; // settle slightly smaller while leaving
  let x = it.x, y = it.y, rot = 0;
  if (it.float) ty += Math.sin((t - it.t0) * 1.9 + it.x * .01) * it.float;
  if (it.fx) {
    const f = it.fx(t) || {};
    if (f.x != null) x = f.x; if (f.y != null) y = f.y;
    if (f.dx) tx += f.dx; if (f.dy) ty += f.dy; if (f.rot) rot = f.rot; if (f.scale) sc *= f.scale;
  }
  let html = it.htmlAt ? it.htmlAt(t) : it.html;
  if (it.anim === 'words') {
    const inner = html.match(/^(<div[^>]*>)([\s\S]*)(<\/div>)$/);
    if (inner) html = inner[1] + wordSpans(inner[2], t, it.t0) + inner[3];
  }
  const blur = (1 - q) * 6;
  return {
    html, x, y, z: it.z, origin: it.origin || '50% 50%',
    opacity: op * q,
    transform: `translate(-50%,-50%) translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${sc.toFixed(4)})`,
    filter: blur > .2 ? `blur(${blur.toFixed(2)}px)` : 'none',
    burst: it.burst ? clamp((t - it.t0) / 0.6) : 1,
  };
}

export function subtitleAt(t) {
  for (const ln of LINES) if (t >= ln.start && t < ln.end) return ln;
  return null;
}
