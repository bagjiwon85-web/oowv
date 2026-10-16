// Minimal deterministic motion engine. render(t) sets the state for time t (seconds).
const C = { ink: '#222222', gray: '#A9A9A9', gray2: '#D2D2D2', red: '#E8322B', lred: '#F5B3AE' };
const STAGE = document.getElementById('stage');
const SUB = document.getElementById('sub');
const ENTER = 0.6, EXIT = 0.32;

// ---------- timing helpers ----------
function L(i) { return LINES[i].voiced[0][0]; }
function W(i, sub) {
  const ln = LINES[i], txt = ln.text;
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
const clamp = x => Math.max(0, Math.min(1, x));
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeInOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

// ---------- element factories ----------
const ITEMS = [];
function mk(html, x, y, o = {}) {
  const d = document.createElement('div');
  d.className = 'el';
  d.innerHTML = html;
  d.style.left = x + 'px'; d.style.top = y + 'px';
  d.style.display = 'none';
  STAGE.appendChild(d);
  const it = { d, x, y, t0: o.t, t1: o.out, upd: o.upd, z: o.z || 0 };
  d.style.zIndex = it.z;
  return it;
}
function svgIcon(name, size, color, sw, filled) {
  const src = ICONS[(filled ? 'F:' : 'O:') + name];
  if (!src) throw new Error('icon ' + name);
  return src.replace(/width="24"/, `width="${size}"`).replace(/height="24"/, `height="${size}"`)
    .replace(/stroke-width="2"/, `stroke-width="${sw}"`).replace(/<svg /, `<svg style="color:${color};display:block" `);
}
// icon
function I(name, x, y, size = 200, o = {}) {
  const sw = o.sw || (size >= 150 ? 1.25 : 1.5);
  return mk(svgIcon(name, size, o.color || C.ink, sw, o.filled), x, y, o);
}
// text (html allowed; <em> = red)
function T(html, x, y, size = 64, o = {}) {
  const st = `font-size:${size}px;font-weight:${o.w || 700};color:${o.color || C.ink};line-height:1.35;text-align:center;white-space:nowrap;letter-spacing:-0.02em`;
  return mk(`<div style="${st}">${html}</div>`, x, y, o);
}
// raw svg
function G(svg, x, y, o = {}) { return mk(svg, x, y, o); }

// person silhouette (natural bust). h = total height
function personSVG(color = C.ink, v = '') {
  let extra = '';
  if (v === 'tie') extra = `<path d="M86 120 L100 140 L114 120 Z" fill="#fff"/><path d="M96 136 L104 136 L110 200 L100 214 L90 200 Z" fill="${C.red}"/>`;
  if (v === 'chef') extra = `<path d="M62 30 C52 8 74 -6 86 4 C92 -8 110 -8 116 4 C128 -6 150 8 138 30 L132 38 L68 38 Z" fill="#fff" stroke="${color}" stroke-width="5" stroke-linejoin="round"/>`;
  if (v === 'apron') extra = `<path d="M76 150 L124 150 L130 276 L70 276 Z" fill="#fff"/><rect x="88" y="190" width="24" height="10" rx="3" fill="${C.red}"/>`;
  const bun = v === 'bun' ? `<circle cx="100" cy="8" r="20" fill="${color}"/>` : '';
  return `<svg width="200" height="300" viewBox="0 -10 200 300" style="display:block;overflow:visible">${bun}
    <ellipse cx="100" cy="60" rx="38" ry="44" fill="${color}"/>
    <rect x="83" y="92" width="34" height="34" rx="12" fill="${color}"/>
    <path d="M100 118 C80 118 66 120 54 124 C30 131 20 146 16 168 L7 258 Q5 276 22 276 L178 276 Q195 276 193 258 L184 168 C180 146 170 131 146 124 C134 120 120 118 100 118 Z" fill="${color}"/>
    <path d="M50 178 Q48 228 47 278 M150 178 Q152 228 153 278" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${extra}</svg>`;
}
function P(x, y, h = 330, o = {}) {
  const s = h / 300;
  return mk(`<div style="transform:scale(${s});transform-origin:center">${personSVG(o.color || C.ink, o.v || '')}</div>`, x, y, o);
}
// speech / thought bubble. tail: 'bl' | 'br' | 'b'
function B(html, x, y, o = {}) {
  const size = o.size || 42;
  const tail = o.tail || 'bl';
  const tx = tail === 'bl' ? '22%' : tail === 'br' ? '78%' : '50%';
  const flip = tail === 'br' ? 'scale(-1,1)' : '';
  const tailSvg = o.think
    ? `<svg width="60" height="60" style="position:absolute;left:${tx};top:100%;transform:translate(-50%,6px) ${flip};overflow:visible"><circle cx="16" cy="12" r="11" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/><circle cx="2" cy="38" r="7" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/></svg>`
    : `<svg width="44" height="40" viewBox="0 0 44 40" style="position:absolute;left:${tx};top:100%;transform:translate(-50%,-4px) ${flip};overflow:visible"><path d="M4 0 L10 36 L36 0" fill="#fff" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><rect x="5" y="-6" width="30" height="8" fill="#fff"/></svg>`;
  const html2 = `<div style="position:relative;background:#fff;border:3.5px solid ${C.ink};border-radius:999px;padding:${size * .5}px ${size * .9}px;font-size:${size}px;font-weight:700;color:${C.ink};white-space:nowrap;letter-spacing:-0.02em;line-height:1.2;display:flex;align-items:center;gap:${size * .35}px">${html}${tailSvg}</div>`;
  return mk(html2, x, y, o);
}
// arrow
function A(x1, y1, x2, y2, o = {}) {
  const col = o.color || C.ink, sw = o.sw || 4;
  const minx = Math.min(x1, x2) - 30, miny = Math.min(y1, y2) - 30;
  const w = Math.abs(x2 - x1) + 60, h = Math.abs(y2 - y1) + 60;
  const ang = Math.atan2(y2 - y1, x2 - x1), hl = o.head || 18;
  const hx1 = x2 - hl * Math.cos(ang - 0.5), hy1 = y2 - hl * Math.sin(ang - 0.5);
  const hx2 = x2 - hl * Math.cos(ang + 0.5), hy2 = y2 - hl * Math.sin(ang + 0.5);
  const dash = o.dash ? `stroke-dasharray="${o.dash}"` : '';
  const head2 = o.both ? (() => { const a2 = ang + Math.PI; return `<polyline points="${x1 - hl * Math.cos(a2 - .5) - minx},${y1 - hl * Math.sin(a2 - .5) - miny} ${x1 - minx},${y1 - miny} ${x1 - hl * Math.cos(a2 + .5) - minx},${y1 - hl * Math.sin(a2 + .5) - miny}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`; })() : '';
  const svg = `<svg width="${w}" height="${h}" style="display:block;overflow:visible"><line x1="${x1 - minx}" y1="${y1 - miny}" x2="${x2 - minx}" y2="${y2 - miny}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" ${dash}/>
    ${o.nohead ? '' : `<polyline points="${hx1 - minx},${hy1 - miny} ${x2 - minx},${y2 - miny} ${hx2 - minx},${hy2 - miny}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`}${head2}</svg>`;
  return mk(svg, minx + w / 2, miny + h / 2, o);
}
// won coin
function coinSVG(r = 70, col = C.red) {
  return `<svg width="${r * 2 + 8}" height="${r * 2 + 8}" viewBox="${-r - 4} ${-r - 4} ${r * 2 + 8} ${r * 2 + 8}" style="display:block">
  <circle r="${r}" fill="#fff" stroke="${col}" stroke-width="${r * .07}"/><circle r="${r * .78}" fill="none" stroke="${col}" stroke-width="${r * .035}"/>
  <text y="${r * .3}" text-anchor="middle" font-size="${r * .9}" font-weight="800" fill="${col}">₩</text></svg>`;
}
function Coin(x, y, r = 70, o = {}) { return mk(coinSVG(r, o.color || C.red), x, y, o); }
// stack of coins
function stackSVG(n = 5, col = C.ink, w = 120) {
  const h = 22, H = n * h + 12;
  let s = '';
  for (let i = 0; i < n; i++) { const yy = H - 6 - (i + 1) * h; s += `<rect x="4" y="${yy}" width="${w - 8}" height="${h - 2}" rx="${h / 2}" fill="#fff" stroke="${col}" stroke-width="4"/>`; }
  return `<svg width="${w}" height="${H}" style="display:block">${s}</svg>`;
}
function Stack(x, y, n, o = {}) { return mk(stackSVG(n, o.color || C.ink, o.w || 120), x, y, o); }
function Mark(name, x, y, size = 64, o = {}) { // filled red badge icon (check / x)
  return I(name, x, y, size, Object.assign({ color: C.red, sw: 2.6 }, o));
}

// ---------- scenes ----------
const SCENES = [];
function S(t, ...items) { SCENES.push({ t, items }); }
// sequential bubbles: each one disappears before the next one appears
function seqOut(...items) { for (let k = 0; k < items.length - 1; k++) items[k].t1 = items[k + 1].t0; return items; }

function finalize(END) {
  SCENES.sort((a, b) => a.t - b.t);
  SCENES.forEach((sc, k) => {
    const end = k + 1 < SCENES.length ? SCENES[k + 1].t : END;
    sc.items.flat().forEach(it => {
      if (it.t0 == null) it.t0 = sc.t;
      if (it.t1 == null) it.t1 = end;
      ALL.push(it);
    });
  });
}
const ALL = [];

function render(t) {
  for (const it of ALL) {
    if (t < it.t0 || t >= it.t1) { if (it.vis) { it.d.style.display = 'none'; it.vis = false; } continue; }
    if (!it.vis) { it.d.style.display = 'block'; it.vis = true; }
    const p = easeOut(clamp((t - it.t0) / ENTER));
    const q = easeInOut(clamp((it.t1 - t) / EXIT));
    const sc = 0.94 + 0.06 * p;
    it.d.style.opacity = (p * q).toFixed(4);
    it.d.style.transform = `translate(-50%,-50%) scale(${sc.toFixed(4)})`;
    if (it.upd) it.upd(t, it);
  }
  // subtitles
  let cur = null;
  for (const ln of LINES) if (t >= ln.start && t < ln.end) cur = ln;
  if (cur !== SUB._cur) { SUB._cur = cur; SUB.style.display = cur ? 'block' : 'none'; if (cur) SUB.firstChild.textContent = cur.text; }
}
