// Deterministic motion engine. render(t) sets the whole frame for time t (seconds).
const C = { ink: '#1F2430', navy: K.navy, gray: '#A3AAB8', red: K.red, lred: K.redL };
const STAGE = document.getElementById('stage');
const SUB = document.getElementById('sub');
const EXIT = 0.32;

// ---------- timing ----------
function L(i) { return LINES[i].voiced[0][0]; }
function W(i, sub) {
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
const clamp = x => Math.max(0, Math.min(1, x));
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeInOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeBack = p => { const c1 = 1.25, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const lerp = (a, b, p) => a + (b - a) * p;

// ---------- element factory ----------
const ALL = [];
function mk(html, x, y, o = {}) {
  const d = document.createElement('div');
  d.className = 'el';
  d.innerHTML = html;
  d.style.left = x + 'px'; d.style.top = y + 'px';
  d.style.display = 'none';
  d.style.zIndex = o.z || 0;
  STAGE.appendChild(d);
  return { d, x, y, t0: o.t, t1: o.out, upd: o.upd, anim: o.anim || 'up', dur: o.dur, delay: o.delay || 0 };
}
// art icon
function I(name, x, y, size = 200, o = {}) { return mk(iconSVG(name, size, o.arg), x, y, Object.assign({ anim: 'pop' }, o)); }
// standing person (bust)
function P(x, y, h = 330, o = {}) { return mk(svg(h * 200 / 230, h, '0 0 200 230', personInner(o)), x, y, Object.assign({ anim: 'up' }, o)); }
// circular avatar
function Bd(x, y, size = 150, o = {}) { return mk(badgeSVG(o, o.bg || K.yel, size), x, y, Object.assign({ anim: 'pop' }, o)); }
// text. <em> = red emphasis
function T(html, x, y, size = 64, o = {}) {
  const st = `font-size:${size}px;font-weight:${o.w || 800};color:${o.color || C.ink};line-height:1.32;text-align:center;white-space:nowrap;letter-spacing:-0.025em`;
  return mk(`<div class="tx" style="${st}">${html}</div>`, x, y, Object.assign({ anim: 'up' }, o));
}
// headline at the top of the content area
function H(html, o = {}) { return T(html, o.x || 960, o.y || 300, o.size || 60, o); }
// label under / beside an illustration
function Lb(html, x, y, o = {}) { return T(html, x, y, o.size || 40, Object.assign({ w: 700, color: '#3A4152' }, o)); }
// red pill tag
function Tag(html, x, y, o = {}) {
  const red = o.red !== false;
  return mk(`<div style="font-size:${o.size || 36}px;font-weight:800;color:${red ? '#fff' : C.ink};background:${red ? C.red : '#fff'};border:${red ? 0 : 3}px solid ${C.ink};padding:10px 28px 12px;border-radius:999px;white-space:nowrap;letter-spacing:-0.02em;box-shadow:0 8px 20px rgba(238,64,54,${red ? .25 : 0})">${html}</div>`, x, y, Object.assign({ anim: 'pop' }, o));
}
function G(svgStr, x, y, o = {}) { return mk(svgStr, x, y, Object.assign({ anim: 'fade' }, o)); }

// speech / thought bubble
function B(html, x, y, o = {}) {
  const size = o.size || 40;
  const tail = o.tail || 'bl';
  const tx = tail === 'bl' ? '22%' : tail === 'br' ? '78%' : '50%';
  const flip = tail === 'br' ? 'scale(-1,1)' : '';
  const tailSvg = o.think
    ? `<svg width="60" height="60" style="position:absolute;left:${tx};top:100%;transform:translate(-50%,8px) ${flip};overflow:visible"><circle cx="16" cy="12" r="11" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/><circle cx="2" cy="38" r="7" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/></svg>`
    : `<svg width="44" height="40" viewBox="0 0 44 40" style="position:absolute;left:${tx};top:100%;transform:translate(-50%,-4px) ${flip};overflow:visible"><path d="M4 0 L10 34 L36 0" fill="#fff" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><rect x="5" y="-6" width="30" height="8" fill="#fff"/></svg>`;
  const html2 = `<div style="position:relative;background:#fff;border:3.5px solid ${C.ink};border-radius:999px;padding:${size * .5}px ${size * .85}px;font-size:${size}px;font-weight:700;color:${C.ink};white-space:nowrap;letter-spacing:-0.02em;line-height:1.2;display:flex;align-items:center;gap:${size * .35}px;box-shadow:0 10px 24px rgba(31,36,48,.08)">${html}${tailSvg}</div>`;
  return mk(html2, x, y, Object.assign({ anim: 'pop' }, o));
}
// arrow, drawn from start to end
function A(x1, y1, x2, y2, o = {}) {
  const col = o.color || '#8A91A0', sw = o.sw || 5;
  const pad = 30, minx = Math.min(x1, x2) - pad, miny = Math.min(y1, y2) - pad;
  const w = Math.abs(x2 - x1) + pad * 2, h = Math.abs(y2 - y1) + pad * 2;
  const ax = x1 - minx, ay = y1 - miny, bx = x2 - minx, by = y2 - miny;
  const dash = o.dash ? `stroke-dasharray="${o.dash}"` : '';
  const html = `<svg width="${w}" height="${h}" style="display:block;overflow:visible"><line class="ln" x1="${ax}" y1="${ay}" x2="${ax}" y2="${ay}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" ${dash}/>
    <polyline class="hd" points="" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/><polyline class="hd2" points="" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const it = mk(html, minx + w / 2, miny + h / 2, Object.assign({ anim: 'fade' }, o));
  const ln = it.d.querySelector('.ln'), hd = it.d.querySelector('.hd'), hd2 = it.d.querySelector('.hd2');
  const ang = Math.atan2(by - ay, bx - ax), hl = o.head || 18;
  const headAt = (px, py, a) => `${px - hl * Math.cos(a - .5)},${py - hl * Math.sin(a - .5)} ${px},${py} ${px - hl * Math.cos(a + .5)},${py - hl * Math.sin(a + .5)}`;
  if (o.both) hd2.setAttribute('points', headAt(ax, ay, ang + Math.PI));
  const prev = it.upd;
  it.upd = (t, me) => {
    const p = easeInOut(clamp((t - me.t0) / (o.drawDur || 0.55)));
    const cx = lerp(ax, bx, p), cy = lerp(ay, by, p);
    ln.setAttribute('x2', cx); ln.setAttribute('y2', cy);
    if (!o.nohead) hd.setAttribute('points', p > 0.05 ? headAt(cx, cy, ang) : '');
    hd2.style.opacity = p > .05 ? 1 : 0;
    if (prev) prev(t, me);
  };
  return it;
}

// ---------- scenes ----------
const SCENES = [];
function S(t, ...items) { SCENES.push({ t, items }); }
// each item disappears right before the next one appears
function seqOut(...items) { for (let k = 0; k < items.length - 1; k++) items[k].t1 = items[k + 1].t0; return items; }

function finalize(END) {
  SCENES.sort((a, b) => a.t - b.t);
  SCENES.forEach((sc, k) => {
    const end = k + 1 < SCENES.length ? SCENES[k + 1].t : END;
    sc.items.flat().forEach(it => {
      if (it.t0 == null) it.t0 = sc.t;
      it.t0 += it.delay;
      if (it.t1 == null) it.t1 = end;
      ALL.push(it);
    });
  });
}

function render(t) {
  for (const it of ALL) {
    if (t < it.t0 || t >= it.t1) { if (it.vis) { it.d.style.display = 'none'; it.vis = false; } continue; }
    if (!it.vis) { it.d.style.display = 'block'; it.vis = true; }
    const dur = it.dur || (it.anim === 'pop' ? 0.55 : 0.6);
    const raw = clamp((t - it.t0) / dur);
    const p = easeOut(raw);
    const q = easeInOut(clamp((it.t1 - t) / EXIT));
    let tf = 'translate(-50%,-50%)';
    let op = p;
    switch (it.anim) {
      case 'pop': tf += ` scale(${(0.82 + 0.18 * easeBack(raw)).toFixed(4)})`; op = easeOut(clamp(raw * 1.6)); break;
      case 'up': tf += ` translateY(${(34 * (1 - p)).toFixed(2)}px)`; break;
      case 'down': tf += ` translateY(${(-30 * (1 - p)).toFixed(2)}px)`; break;
      case 'left': tf += ` translateX(${(-60 * (1 - p)).toFixed(2)}px)`; break;
      case 'right': tf += ` translateX(${(60 * (1 - p)).toFixed(2)}px)`; break;
      case 'zoom': tf += ` scale(${(1.06 - 0.06 * p).toFixed(4)})`; break;
      case 'fade': tf += ` scale(${(0.97 + 0.03 * p).toFixed(4)})`; break;
      case 'none': op = 1; break;
    }
    it.d.style.opacity = (op * q).toFixed(4);
    it.d.style.transform = tf;
    if (it.upd) it.upd(t, it);
  }
  let cur = null;
  for (const ln of LINES) if (t >= ln.start && t < ln.end) cur = ln;
  if (cur !== SUB._cur) { SUB._cur = cur; SUB.style.display = cur ? 'block' : 'none'; if (cur) SUB.firstChild.innerHTML = cur.html; }
}
