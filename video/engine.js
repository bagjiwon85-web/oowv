// Motion-graphics engine: deterministic render(t) onto a 1920x1080 canvas.
const W = 1920, H = 1080;
const RED = '#E8332A', WHITE = '#FFFFFF', GREY = '#8A8A8A', DIM = '#3A3A3A', CARD = '#141414', LINE = '#4A4A4A';
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const FONT = '"NEXON"';
const PHOTO_ALPHA = 0.3;

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
function silhouette(kind, h, col, acc = RED) {
  ctx.save(); const s = h / 100; ctx.scale(s, s); ctx.fillStyle = col;
  const limb = (x, y, w, hh) => { rrect(x, y, w, hh, w / 2); ctx.fill(); };
  const torso = (w = 26) => { rrect(-w / 2, -76, w, 38, 7); ctx.fill(); };
  const head = (r = 9.5) => { circle(0, -88, r); ctx.fill(); };
  if (kind === 'woman') {
    ctx.beginPath(); ctx.arc(0, -88, 10.5, Math.PI, 0); ctx.lineTo(11, -76); ctx.lineTo(-11, -76); ctx.closePath(); ctx.fill(); head(9);
    rrect(-11, -76, 22, 30, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-11, -50); ctx.lineTo(11, -50); ctx.lineTo(17, -24); ctx.lineTo(-17, -24); ctx.closePath(); ctx.fill();
    limb(-17, -74, 5.5, 30); limb(11.5, -74, 5.5, 30); limb(-9, -28, 6.5, 28); limb(2.5, -28, 6.5, 28);
  } else if (kind === 'child') {
    ctx.scale(0.62, 0.62); head(11); torso(24); limb(-18, -74, 6, 30); limb(12, -74, 6, 30); limb(-11, -42, 10, 42); limb(1, -42, 10, 42);
  } else if (kind === 'elder') {
    ctx.save(); ctx.rotate(0.06); head(9.5); torso(25); limb(-18, -73, 6, 32); limb(12, -73, 6, 32); limb(-11.5, -42, 10, 42); limb(1.5, -42, 10, 42); ctx.restore();
    ctx.fillRect(18, -44, 3, 44);
  } else {
    head(); torso(); limb(-20, -73, 6.5, 33); limb(13.5, -73, 6.5, 33); limb(-12, -42, 10.5, 42); limb(1.5, -42, 10.5, 42);
    if (kind === 'suit') { ctx.fillStyle = acc; ctx.beginPath(); ctx.moveTo(0, -75); ctx.lineTo(-3, -70); ctx.lineTo(0, -54); ctx.lineTo(3, -70); ctx.closePath(); ctx.fill();
      ctx.fillStyle = col; rrect(20, -48, 18, 14, 2); ctx.fill(); ctx.fillRect(25, -51, 8, 3); }
    if (kind === 'chef') { ctx.fillStyle = acc; rrect(-11, -66, 22, 34, 3); ctx.fill(); ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(-5, -101, 6, 0, 7); ctx.arc(5, -101, 6, 0, 7); ctx.fill(); ctx.fillRect(-8, -100, 16, 6); }
    if (kind === 'mega') { ctx.fillStyle = acc; ctx.beginPath(); ctx.moveTo(18, -70); ctx.lineTo(40, -82); ctx.lineTo(40, -56); ctx.lineTo(18, -64); ctx.closePath(); ctx.fill(); }
  }
  ctx.restore();
}

// ---------- element drawing ----------
// Every element: {k: kind, at: start seconds (scene-relative), ...}.
function drawElement(e, lt, T, sc) {
  if (lt < e.at) return;
  const dur = e.dur || 0.6;
  const p = clamp((lt - e.at) / dur);
  let alpha = e.k === 'photo' ? 1 : easeOut(p);
  if (e.out !== undefined) alpha *= 1 - easeOut((lt - e.out) / 0.4);
  if (e.dimAt !== undefined) alpha *= lerp(1, e.dimTo ?? 0.25, easeOut((lt - e.dimAt) / 0.4));
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  let x = e.x || 0, y = e.y || 0;
  if (e.move) { const mp = easeInOut((lt - e.at - (e.move.delay || 0)) / (e.move.dur || 1.5)); x += (e.move.dx || 0) * mp; y += (e.move.dy || 0) * mp; }
  const anim = e.anim || DEFAULT_ANIM[e.k] || 'none';
  if (anim === 'rise') y += (1 - easeOut(p)) * 30;
  if (anim === 'slide') x += (1 - easeOut(p)) * -60;
  if (anim === 'drop') y += (1 - easeOut(p)) * -40;
  if (e.k !== 'photo') ctx.translate(x, y);
  if (e.rot) ctx.rotate(e.rot);
  if (anim === 'pop') { const s = lerp(0.8, 1, easeBack(p)); ctx.scale(s, s); }
  if (anim === 'grow') { const s = lerp(0.94, 1, easeOut(p)); ctx.scale(s, s); }
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
    const z = lerp(e.z0 ?? 1.0, e.z1 ?? 1.12, clamp(lt / (sc.end - sc.start + 0.3)));
    const s = Math.max(W / img.width, H / img.height) * z;
    const fx = e.fx ?? 0.5, fy = e.fy ?? 0.5;
    ctx.globalAlpha *= PHOTO_ALPHA * easeOut(lt / 0.8);
    ctx.drawImage(img, W * fx - img.width * s * fx, H * fy - img.height * s * fy, img.width * s, img.height * s);
  },
  text(e, lt) {
    const chars = e.type ? (lt - e.at) * (e.cps || 14) : undefined;
    drawRich(e.s, 0, 0, e.size || 64, { weight: e.weight || 700, align: e.align, color: e.color, ls: e.ls, outline: e.outline, lh: e.lh, chars });
  },
  icon(e) { const s = (e.size || 160) / 100; ctx.scale(s, s); ICONS[e.name](e.color || WHITE, e.accent || RED); },
  sil(e) { if (e.flip) ctx.scale(-1, 1); silhouette(e.kind || 'man', e.h || 300, e.color || WHITE, e.accent || RED); },
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
    if (T < sc.start - 0.01 || T > sc.end + 0.3) continue;
    const lt = T - sc.start;
    const fadeOut = sc.last ? clamp((sc.end + 0.3 - T) / 0.8) : clamp((sc.end + 0.3 - T) / 0.3);
    ctx.save(); ctx.globalAlpha = fadeOut;
    for (const e of sc.els) drawElement(e, lt, T, sc);
    ctx.restore();
  }
  if (!SCENES.some(sc => sc.noTag && T >= sc.start && T <= sc.end + 0.3)) drawChapterTag(T);
  const cue = CUES.find(c => T >= c.start && T < c.end);
  if (cue) drawSubtitle(cue.sub);
}
