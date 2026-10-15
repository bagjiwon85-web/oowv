// Motion-graphics engine: deterministic render(t) onto a 1920x1080 canvas.
const W = 1920, H = 1080;
const RED = '#E8332A', WHITE = '#FFFFFF', GREY = '#8A8A8A', DIM = '#3A3A3A', CARD = '#141414', LINE = '#4A4A4A';
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const FONT = '"NEXON"';
const PHOTO_ALPHA = 0.3;
const OUT_LEAD = 0.25, OUT_TAIL = 0.6;
const MOTION_SLOW = 1.4; // >1 slows every entrance, draw-on, counter and loop // outgoing scene starts fading OUT_LEAD before its end and is gone OUT_TAIL after

// ---------- easing ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeInOut = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const easeBack = x => { x = clamp(x); const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const lerp = (a, b, k) => a + (b - a) * k;

// ---------- text ----------
// "{...}" segments are drawn in red.
function parseRich(s) {
  const out = []; let red = false, buf = '';
  for (const ch of s) {
    if (ch === '{' || ch === '}') { if (buf) out.push({ s: buf, red }); buf = ''; red = ch === '{'; }
    else buf += ch;
  }
  if (buf) out.push({ s: buf, red });
  return out;
}
function setFont(size, weight = 700, ls = 0) { ctx.font = `${weight} ${size}px ${FONT}`; ctx.letterSpacing = ls + 'px'; }
function richWidth(s, size, weight = 700, ls = 0) { setFont(size, weight, ls); return parseRich(s).reduce((w, p) => w + ctx.measureText(p.s).width, 0); }
// o: weight, align, color, lh, ls (letter spacing), outline (stroke width), chars (typewriter: visible char count)
function drawRich(s, x, y, size, o = {}) {
  const weight = o.weight || 700, align = o.align || 'center', ls = o.ls || 0;
  const lines = s.split('\n');
  const lh = size * (o.lh || 1.3);
  let budget = o.chars ?? Infinity;
  lines.forEach((line, i) => {
    const w = richWidth(line, size, weight, ls);
    let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    const cy = y + (i - (lines.length - 1) / 2) * lh;
    setFont(size, weight, ls);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    for (const p of parseRich(line)) {
      const chars = [...p.s];
      const vis = budget >= chars.length ? p.s : chars.slice(0, Math.max(0, Math.floor(budget))).join('');
      budget -= chars.length;
      const col = p.red ? RED : (o.color || WHITE);
      if (o.outline) { ctx.strokeStyle = col; ctx.lineWidth = o.outline; ctx.lineJoin = 'round'; ctx.strokeText(vis, cx, cy); }
      else { ctx.fillStyle = col; ctx.fillText(vis, cx, cy); }
      cx += ctx.measureText(p.s).width;
    }
  });
  ctx.letterSpacing = '0px';
}

// ---------- primitives ----------
function rrect(x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
function arrowHead(x, y, ang, s) {
  ctx.beginPath(); ctx.moveTo(x, y);
  ctx.lineTo(x - s * Math.cos(ang - 0.5), y - s * Math.sin(ang - 0.5));
  ctx.lineTo(x - s * Math.cos(ang + 0.5), y - s * Math.sin(ang + 0.5));
  ctx.closePath(); ctx.fill();
}

// ---------- person silhouettes (feet at origin, height h) ----------
// Each figure is drawn once at high resolution into an offscreen canvas (opaque, so the mirrored halves
// overlap without seams) and then scaled down; fades apply to the finished image.
const MIRROR = new DOMMatrix([-1, 0, 0, 1, 0, 0]);
const SIL_HALF = {
  man: new Path2D('M-0.5 -80.5 C2.6 -80.5 3.4 -79.6 3.6 -78.2 C6.5 -77 11.8 -76.8 15 -74.6 C17.6 -72.8 18.2 -69.8 18.3 -66.5 C18.6 -60 19.3 -54 19.6 -48.5 C19.8 -45.6 18.8 -43.6 17.4 -43.6 C16 -43.6 15.6 -45 15.6 -47 C15.4 -53 15 -58.5 14.4 -62.5 L13.3 -61.5 C12.9 -55 12.4 -49 12.1 -43.5 C11.9 -30 11.2 -16 10.4 -4 C10.3 -1.4 9.4 -0.2 7.4 0 L3.4 0 C3 -12 2.6 -26 2.2 -36.5 C2 -38.6 1 -39.4 -0.5 -39.4 Z'),
  manNoArm: new Path2D('M-0.5 -80.5 C2.6 -80.5 3.4 -79.6 3.6 -78.2 C6.5 -77 11.8 -76.8 15 -74.6 C16.6 -73.4 14.6 -67 13.3 -61.5 C12.9 -55 12.4 -49 12.1 -43.5 C11.9 -30 11.2 -16 10.4 -4 C10.3 -1.4 9.4 -0.2 7.4 0 L3.4 0 C3 -12 2.6 -26 2.2 -36.5 C2 -38.6 1 -39.4 -0.5 -39.4 Z'),
  woman: new Path2D('M-0.5 -80 C2.4 -80 3.1 -79.2 3.3 -78 C6 -77 10.4 -76.8 13 -74.8 C15.2 -73.2 15.8 -70.4 15.9 -67 C16.2 -61 16.9 -55 17.2 -50 C17.4 -47.2 16.4 -45.4 15.1 -45.4 C13.8 -45.4 13.4 -46.8 13.4 -48.6 C13.2 -54 12.8 -59 12.2 -62.6 L11.2 -61.8 C10.6 -57.5 9.6 -53.6 9.4 -50.6 C11.6 -43 14.4 -33 15.6 -23.6 C12 -22.6 9 -22.4 7.6 -22.4 C7.3 -15 7 -8 6.6 -3.4 C6.5 -1 5.6 0 3.9 0 L2.3 0 C2.1 -8 1.9 -16 1.8 -22.4 L-0.5 -22.4 Z'),
};
const SIL_HAIR = new Path2D('M0 -99.4 C6.4 -99.4 9.6 -95 9.4 -88.6 L9.6 -80.6 C8 -79.2 6.2 -79.4 5 -81 L-5 -81 C-6.2 -79.4 -8 -79.2 -9.6 -80.6 L-9.4 -88.6 C-9.6 -95 -6.4 -99.4 0 -99.4 Z');
const SIL_CACHE = {};
const SIL_RES = 11; // px per unit in the cached image
function silImage(kind, col, acc) {
  const key = kind + col + acc; if (SIL_CACHE[key]) return SIL_CACHE[key];
  const cv = document.createElement('canvas'); cv.width = 80 * SIL_RES; cv.height = 120 * SIL_RES;
  const c = cv.getContext('2d'); c.translate(40 * SIL_RES, 114 * SIL_RES); c.scale(SIL_RES, SIL_RES);
  c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
  const both = (p, pm = p) => { c.fill(p); c.save(); c.setTransform(c.getTransform().multiply(MIRROR)); c.fill(pm); c.restore(); };
  const ell = (x, y, rx, ry) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); };
  if (kind === 'child') { c.save(); c.scale(0.7, 0.6); both(SIL_HALF.man); c.restore(); ell(0, -59, 6.6, 7.4); }
  else if (kind === 'woman') { both(SIL_HALF.woman); c.fill(SIL_HAIR); ell(0, -89, 7.2, 8.8); }
  else if (kind === 'mega') {
    c.fill(SIL_HALF.manNoArm); c.save(); c.setTransform(c.getTransform().multiply(MIRROR)); c.fill(SIL_HALF.man); c.restore(); ell(0, -89.3, 7.6, 9.2);
    c.lineWidth = 5; c.beginPath(); c.moveTo(13.5, -71); c.quadraticCurveTo(21, -68, 19.5, -83); c.stroke();
    c.fillStyle = acc; c.beginPath(); c.moveTo(8, -88.5); c.lineTo(29, -97); c.lineTo(29, -77); c.lineTo(8, -84.5); c.closePath(); c.fill();
  } else {
    if (kind === 'elder') { c.translate(-2, 0); c.rotate(0.05); }
    both(SIL_HALF.man); ell(0, -89.3, 7.6, 9.2);
    if (kind === 'suit') {
      c.fillStyle = acc; c.beginPath(); c.moveTo(0, -78.6); c.lineTo(-2.2, -75); c.lineTo(0, -59); c.lineTo(2.2, -75); c.closePath(); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(11.4, -42.4, 15, 11, 1.6); c.fill(); c.lineWidth = 1.6; c.beginPath(); c.arc(17.4, -43, 2.6, Math.PI, 0); c.stroke();
    }
    if (kind === 'chef') {
      c.fillStyle = acc; c.beginPath(); c.moveTo(-8.6, -66); c.lineTo(8.6, -66); c.lineTo(10.6, -30); c.quadraticCurveTo(0, -27.4, -10.6, -30); c.closePath(); c.fill();
      c.fillStyle = col; ell(-4.4, -100.6, 5.6, 5); ell(4.4, -100.6, 5.6, 5); ell(0, -103, 5.4, 4.8); c.fillRect(-6.8, -100, 13.6, 4.6);
    }
    if (kind === 'elder') { c.lineWidth = 2.2; c.beginPath(); c.moveTo(17.4, -44.5); c.quadraticCurveTo(21, -46.5, 21, -42.5); c.lineTo(22, 0); c.stroke(); }
  }
  return (SIL_CACHE[key] = cv);
}
function silhouette(kind, h, col, acc = RED, T = 0, phase = 0) {
  ctx.save(); const s = h / 100;
  // soft contact shadow so figures sit on the ground
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 24 * s);
  g.addColorStop(0, 'rgba(255,255,255,0.09)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save(); ctx.scale(1, 0.14); ctx.fillStyle = g; circle(0, 0, 24 * s); ctx.fill(); ctx.restore();
  ctx.scale(s, s);
  ctx.scale(1, 1 + 0.006 * Math.sin(T * 1.7 + phase)); // subtle idle breathing, anchored at the feet
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(silImage(kind, col, acc), -40, -114, 80, 120);
  ctx.restore();
}

// ---------- element drawing ----------
// Every element: {k: kind, at: start seconds (scene-relative), ...}.
function drawElement(e, rt, T, sc) {
  if (rt < e.at) return;
  // animation clock runs slower than real time (MOTION_SLOW); start times stay locked to the narration
  const lt = e.k === 'photo' ? rt : e.at + (rt - e.at) / MOTION_SLOW;
  const dur = e.dur || 0.8;
  const p = clamp((lt - e.at) / dur);
  let alpha = e.k === 'photo' ? 1 : easeOut(p);
  if (e.out !== undefined) alpha *= 1 - easeInOut((rt - e.out) / 0.6);
  if (e.dimAt !== undefined) alpha *= lerp(1, e.dimTo ?? 0.25, easeInOut((rt - e.dimAt) / 0.6));
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  let x = e.x || 0, y = e.y || 0;
  if (e.move) { const mp = easeInOut((lt - e.at - (e.move.delay || 0)) / (e.move.dur || 1.5)); x += (e.move.dx || 0) * mp; y += (e.move.dy || 0) * mp; }
  const anim = e.anim || DEFAULT_ANIM[e.k] || 'none';
  if (anim === 'rise') y += (1 - easeOut(p)) * 20;
  if (anim === 'slide') x += (1 - easeOut(p)) * -40;
  if (anim === 'drop') y += (1 - easeOut(p)) * -26;
  if (e.k !== 'photo') ctx.translate(x, y);
  if (e.rot) ctx.rotate(e.rot);
  if (anim === 'pop') { const s = lerp(0.9, 1, easeOut(p)); ctx.scale(s, s); }
  if (anim === 'grow') { const s = lerp(0.96, 1, easeOut(p)); ctx.scale(s, s); }
  if (anim === 'wipe' || anim === 'wipeUp' || anim === 'wipeL') {
    const k = easeInOut((lt - e.at) / (e.wdur || 0.7)), bw = e.cw || e.w || 2000, bh = e.ch || e.h || 400;
    const ox = e.cx || 0, oy = e.cy || 0;
    ctx.beginPath();
    if (anim === 'wipe') ctx.rect(ox - bw / 2 - 10, oy - bh / 2 - 10, (bw + 20) * k, bh + 20);
    else if (anim === 'wipeL') ctx.rect(ox + bw / 2 + 10 - (bw + 20) * k, oy - bh / 2 - 10, (bw + 20) * k, bh + 20);
    else ctx.rect(ox - bw / 2 - 10, oy + bh / 2 + 10 - (bh + 20) * k, bw + 20, (bh + 20) * k);
    ctx.clip();
  }
  KINDS[e.k](e, lt, p, sc);
  ctx.restore();
}
const DEFAULT_ANIM = { text: 'rise', icon: 'pop', sil: 'rise', bubble: 'pop', chip: 'rise', panel: 'wipe', num: 'rise', counter: 'rise', rect: 'grow' };

const KINDS = {
  photo(e, lt, p, sc) { // full-bleed photo at 30% opacity, slow zoom-in across the scene
    const img = IMGS[e.src]; if (!img) return;
    const z = lerp(e.z0 ?? 1.0, e.z1 ?? 1.08, clamp(lt / (sc.end - sc.start + 0.3)));
    const s = Math.max(W / img.width, H / img.height) * z;
    const fx = e.fx ?? 0.5, fy = e.fy ?? 0.5;
    ctx.globalAlpha *= PHOTO_ALPHA * easeInOut(lt / 1.6);
    ctx.drawImage(img, W * fx - img.width * s * fx, H * fy - img.height * s * fy, img.width * s, img.height * s);
  },
  text(e, lt) {
    const chars = e.type ? (lt - e.at) * (e.cps || 14) : undefined;
    drawRich(e.s, 0, 0, e.size || 64, { weight: e.weight || 700, align: e.align, color: e.color, ls: e.ls, outline: e.outline, lh: e.lh, chars });
  },
  icon(e) { const s = (e.size || 160) / 100; ctx.scale(s, s); ICONS[e.name](e.color || WHITE, e.accent || RED); },
  sil(e, lt) { if (e.flip) ctx.scale(-1, 1);
    if (e.move) { const m = clamp((lt - e.at - (e.move.delay || 0)) / (e.move.dur || 1.5)); if (m > 0 && m < 1) ctx.translate(0, -Math.abs(Math.sin(m * Math.PI * 7)) * (e.h || 300) * 0.012); }
    silhouette(e.kind || 'man', e.h || 300, e.color || WHITE, e.accent || RED, lt, (e.x || 0) * 0.01); },
  panel(e) { ctx.fillStyle = e.color || RED; ctx.fillRect(-e.w / 2, -e.h / 2, e.w, e.h); },
  rect(e) { ctx.strokeStyle = e.color || LINE; ctx.lineWidth = e.lw ?? 2; if (e.dash) ctx.setLineDash(e.dash); rrect(-e.w / 2, -e.h / 2, e.w, e.h, e.r ?? 0);
    if (e.fill) { ctx.fillStyle = e.fill; ctx.fill(); } if (e.lw !== 0) ctx.stroke(); ctx.setLineDash([]); },
  chip(e) {
    const size = e.size || 36, w = richWidth(e.s, size, 700) + size * 1.2, h = size * 1.8;
    rrect(-w / 2, -h / 2, w, h, e.r ?? 6);
    if (e.hl || e.fill) { ctx.fillStyle = e.fill || RED; ctx.fill(); } else { ctx.lineWidth = 2; ctx.strokeStyle = e.stroke || WHITE; ctx.stroke(); }
    drawRich(e.s, 0, 2, size, { weight: 700, color: e.tcolor });
  },
  bubble(e) { // speech bubble: white fill, dark text
    const size = e.size || 44, lines = e.s.split('\n');
    const w = Math.max(...lines.map(l => richWidth(l, size))) + size * 1.6, h = lines.length * size * 1.35 + size * 0.9;
    ctx.fillStyle = e.fill || WHITE; rrect(-w / 2, -h / 2, w, h, 18); ctx.fill();
    const tx = e.tail === 'right' ? w / 2 - 60 : -w / 2 + 60, dir = e.tail === 'right' ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(tx - 18, h / 2 - 2); ctx.lineTo(tx + dir * 26, h / 2 + 36); ctx.lineTo(tx + 18, h / 2 - 2); ctx.fill();
    drawRich(e.s, 0, 2, size, { weight: 700, color: e.tcolor || '#111' });
  },
  num(e) { drawRich(e.s, 0, 0, e.size || 300, { weight: e.weight || 700, color: e.color || RED, outline: e.outline, align: e.align, ls: e.ls }); },
  line(e, lt) { // drawn line from (0,0) to (dx,dy)
    const k = easeInOut((lt - e.at) / (e.draw || 0.6));
    ctx.strokeStyle = e.color || LINE; ctx.lineWidth = e.lw || 3; ctx.lineCap = 'round';
    if (e.dash) ctx.setLineDash(e.dash);
    line(0, 0, e.dx * k, e.dy * k); ctx.setLineDash([]);
    if (e.arrow && k > 0.05) { ctx.fillStyle = e.color || LINE; arrowHead(e.dx * k, e.dy * k, Math.atan2(e.dy, e.dx), 18); }
  },
  hbar(e, lt) {
    const w = e.w || 800, h = e.h || 26;
    let v = e.v ?? 1; if (e.to !== undefined) v = lerp(e.v, e.to, easeInOut((lt - (e.toAt ?? e.at)) / (e.toDur || 1.6)));
    const g = e.instant ? 1 : easeInOut((lt - e.at - 0.2) / (e.fdur || 1.4));
    ctx.fillStyle = e.bg || '#262626'; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = e.color || RED; ctx.fillRect(-w / 2, -h / 2, w * v * g, h);
  },
  strike(e, lt) { const k = easeInOut((lt - e.at) / 0.45); ctx.strokeStyle = e.color || RED; ctx.lineWidth = e.lw || 8; ctx.lineCap = 'round'; line(-e.w / 2, 0, -e.w / 2 + e.w * k, 0); },
  underline(e, lt) { const k = easeInOut((lt - e.at) / 0.6); ctx.fillStyle = e.color || RED; ctx.fillRect(-e.w / 2, -(e.h || 8) / 2, e.w * k, e.h || 8); },
  ring(e, lt) { const k = easeInOut((lt - e.at) / (e.draw || 0.8)); ctx.strokeStyle = e.color || RED; ctx.lineWidth = e.lw || 6; ctx.lineCap = 'round';
    if (e.dash) ctx.setLineDash(e.dash); ctx.beginPath(); const a0 = e.a0 ?? -Math.PI / 2; ctx.arc(0, 0, e.r, a0, a0 + Math.PI * 2 * k * (e.frac ?? 1)); ctx.stroke(); ctx.setLineDash([]); },
  counter(e, lt) { const k = easeOut((lt - e.at) / (e.cdur || 1.6)); drawRich(e.fmt(e.to * k), 0, 0, e.size || 150, { weight: 700, color: e.color, align: e.align }); },
  custom(e, lt, p) { e.draw(lt - e.at, p, lt); },
};

// ---------- subtitles ("TTS 회색바 자막": NEXON Lv2 Gothic Regular 50, white on a grey bar) ----------
function wrapSub(s) {
  setFont(50, 400);
  if (ctx.measureText(s).width <= 1600) return [s];
  const words = s.split(' '); let best = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
    const d = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
    if (!best || d < best.d) best = { d, l: [a, b] };
  }
  return best.l;
}
function drawSubtitle(text) {
  const lines = wrapSub(text);
  setFont(50, 400);
  const lh = 66, padX = 34, padY = 16;
  const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + padX * 2;
  const h = lines.length * lh + padY * 2;
  const by = 1030 - h;
  ctx.fillStyle = 'rgba(52,52,52,0.88)'; rrect(W / 2 - w / 2, by, w, h, 10); ctx.fill();
  ctx.fillStyle = WHITE; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, W / 2, by + padY + lh * i + lh / 2 + 2));
}

// ---------- chapter tag (top-left) ----------
function drawChapterTag(T) {
  const ch = CHAPTERS.filter(c => T >= c.from).pop();
  if (!ch || T > ch.to) return;
  const a = clamp((T - ch.from) / 0.6) * clamp((ch.to - T) / 0.4);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = RED; ctx.fillRect(80, 66, 6, 40);
  setFont(26, 700); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = RED; ctx.fillText(ch.n, 104, 87);
  ctx.fillStyle = GREY; setFont(26, 500); ctx.fillText(ch.title, 104 + ctx.measureText(ch.n).width + 14, 87);
  ctx.restore();
}

// ---------- main render ----------
function render(T) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  for (const sc of SCENES) {
    // scenes overlap at cuts: the outgoing scene eases out (fade + slight lift) while the next one eases in
    if (T < sc.start - 0.01 || T > sc.end + OUT_TAIL) continue;
    const lt = T - sc.start;
    const k = sc.last ? clamp((sc.end + OUT_TAIL - T) / 1.0) : clamp((sc.end + OUT_TAIL - T) / (OUT_TAIL + OUT_LEAD));
    const fadeOut = easeInOut(k);
    ctx.save(); ctx.globalAlpha = fadeOut;
    if (!sc.last) { ctx.translate(W / 2, H / 2 - (1 - fadeOut) * 10); const z = 1 - (1 - fadeOut) * 0.012; ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); }
    for (const e of sc.els) drawElement(e, lt, T, sc);
    ctx.restore();
  }
  if (!SCENES.some(sc => sc.noTag && T >= sc.start && T <= sc.end + OUT_TAIL)) drawChapterTag(T);
  const cue = CUES.find(c => T >= c.start && T < c.end);
  if (cue) drawSubtitle(cue.sub);
}
