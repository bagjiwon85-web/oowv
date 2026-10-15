// Motion-graphic engine: deterministic canvas renderer, render(t) draws one frame.
const W = 1920, H = 1080;
const INK = '#222222', RED = '#E5352B', GRAY = '#9A9A9A', LG = '#E4E4E4', PAPER = '#FFFFFF',
  PGRAY = '#C4C4C4', REDL = '#FDECEA';
const SANS = 'Pretendard', SERIF = '"DM Serif Display", Pretendard';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = {
  out: t => 1 - Math.pow(1 - t, 3),
  back: t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  inout: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  expo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
  soft: t => { const c1 = 0.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  in: t => t * t * t,
};
const lerp = (a, b, q) => a + (b - a) * q;

// ---------- text ----------
function font(size, weight = 700, fam = SANS) { return `${weight} ${size}px ${fam}`; }
// "{...}" marks red segments
function parseRich(line) {
  const segs = []; let red = false, buf = '';
  for (const ch of line) {
    if (ch === '{' || ch === '}') { if (buf) segs.push([buf, red]); buf = ''; red = ch === '{'; }
    else buf += ch;
  }
  if (buf) segs.push([buf, red]);
  return segs;
}
function richWidth(ctx, line) { return parseRich(line).reduce((s, [t]) => s + ctx.measureText(t).width, 0); }
// draws multi-line rich text centered vertically on y. returns {w,h,redSpans:[[x1,x2,y]], lines:[[x1,x2,y]]}
function drawRich(ctx, str, x, y, o = {}) {
  const size = o.size || 56, weight = o.w || 700, col = o.col || INK, fam = o.font || SANS;
  const lh = o.lh || size * 1.35, align = o.align || 'center';
  ctx.font = font(size, weight, fam); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const lines = String(str).split('\n');
  const res = { w: 0, h: lines.length * lh, redSpans: [], lines: [] };
  lines.forEach((ln, i) => {
    const ly = y + (i - (lines.length - 1) / 2) * lh;
    const wd = richWidth(ctx, ln); res.w = Math.max(res.w, wd);
    let cx = align === 'center' ? x - wd / 2 : align === 'right' ? x - wd : x;
    res.lines.push([cx, cx + wd, ly]);
    for (const [t, red] of parseRich(ln)) {
      const tw = ctx.measureText(t).width;
      ctx.fillStyle = red ? (o.redCol || RED) : col; ctx.fillText(t, cx, ly + size * 0.04);
      if (red) res.redSpans.push([cx, cx + tw, ly]);
      cx += tw;
    }
  });
  return res;
}
function measureRich(ctx, str, size, weight = 700, fam = SANS) {
  ctx.font = font(size, weight, fam);
  const lines = String(str).split('\n');
  return { w: Math.max(...lines.map(l => richWidth(ctx, l))), n: lines.length };
}

// ---------- primitives ----------
function partialPoly(ctx, pts, q, closed) {
  const P = closed ? [...pts, pts[0]] : pts;
  let total = 0; const segs = [];
  for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); segs.push(d); total += d; }
  let left = total * q;
  ctx.beginPath(); ctx.moveTo(...P[0]);
  for (let i = 1; i < P.length && left > 0; i++) {
    const d = segs[i - 1];
    if (left >= d) { ctx.lineTo(...P[i]); left -= d; }
    else { const r = left / d; ctx.lineTo(lerp(P[i - 1][0], P[i][0], r), lerp(P[i - 1][1], P[i][1], r)); left = 0; }
  }
  ctx.stroke();
}
function underline(ctx, x1, x2, y, q, col = RED, lw = 5) {
  if (q <= 0) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
  const xe = lerp(x1, x2, q);
  ctx.beginPath(); ctx.moveTo(x1, y + 2);
  ctx.quadraticCurveTo((x1 + xe) / 2, y - 3, xe, y + (q < 1 ? 0 : 1));
  ctx.stroke(); ctx.restore();
}
function arrowHead(ctx, x, y, ang, sz) {
  ctx.beginPath();
  ctx.moveTo(x - Math.cos(ang - 0.45) * sz, y - Math.sin(ang - 0.45) * sz);
  ctx.lineTo(x, y);
  ctx.lineTo(x - Math.cos(ang + 0.45) * sz, y - Math.sin(ang + 0.45) * sz);
  ctx.stroke();
}
function shadow(ctx, on) {
  if (on) { ctx.shadowColor = 'rgba(0,0,0,0.07)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6; }
  else { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }
}
function sparkle(ctx, x, y, r, col = RED) {
  ctx.save(); ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill(); ctx.restore();
}
function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 0.9, y - s * 0.25, x - s * 0.45, y - s * 0.95, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.45, y - s * 0.95, x + s * 0.9, y - s * 0.25, x, y + s * 0.35);
  ctx.closePath();
}

// ---------- person ----------
function drawPerson(ctx, s, o = {}) {
  const k = s / 100; ctx.save(); ctx.scale(k, k);
  const col = o.col || '#2B2B2B';
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(0, -28, 17, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-32, 50); ctx.lineTo(-32, 16); ctx.quadraticCurveTo(-32, -4, -12, -4);
  ctx.lineTo(12, -4); ctx.quadraticCurveTo(32, -4, 32, 16); ctx.lineTo(32, 50); ctx.closePath(); ctx.fill();
  const acc = o.acc;
  if (acc === 'tie') {
    ctx.fillStyle = o.tie || RED; ctx.beginPath(); ctx.moveTo(-4, -4); ctx.lineTo(4, -4); ctx.lineTo(2, 2);
    ctx.lineTo(6, 26); ctx.lineTo(0, 33); ctx.lineTo(-6, 26); ctx.lineTo(-2, 2); ctx.closePath(); ctx.fill();
  } else if (acc === 'apron') {
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.roundRect(-17, 10, 34, 40, [6, 6, 0, 0]); ctx.fill();
    ctx.fillStyle = RED; ctx.fillRect(-10, 24, 20, 4);
  } else if (acc === 'bun') {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -49, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.roundRect(-14, 12, 28, 38, [5, 5, 0, 0]); ctx.fill();
  } else if (acc === 'hat') {
    ctx.fillStyle = PAPER; ctx.strokeStyle = col; ctx.lineWidth = 3;
    [[-10, -52, 10], [0, -56, 12], [10, -52, 10]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    [[-10, -52, 8.5], [0, -56, 10.5], [10, -52, 8.5]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
    ctx.beginPath(); ctx.rect(-13, -50, 26, 10); ctx.fill(); ctx.stroke();
  } else if (acc === 'old') {
    ctx.strokeStyle = PAPER; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(-7, -27, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(7, -27, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, -27); ctx.lineTo(2, -27); ctx.stroke();
  } else if (acc === 'sweat') {
    ctx.fillStyle = '#7FB6E8'; ctx.beginPath(); ctx.moveTo(22, -46); ctx.quadraticCurveTo(29, -36, 22, -33);
    ctx.quadraticCurveTo(15, -36, 22, -46); ctx.fill();
  }
  ctx.restore();
}

// ---------- icons (unit space -50..50) ----------
const ICONS = {};
function I_(name, fn) { ICONS[name] = fn; }
function S(ctx, fill) { if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.stroke(); }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function circ(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
function poly(ctx, pts, close = true) { ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); if (close) ctx.closePath(); }
function ln(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function won(ctx, x, y, sz, col = RED) { ctx.fillStyle = col; ctx.font = font(sz, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('₩', x, y + sz * 0.05); }
function withRed(ctx, f) { const s = ctx.strokeStyle; ctx.strokeStyle = RED; f(); ctx.strokeStyle = s; }

I_('moneybag', c => {
  c.beginPath(); c.moveTo(-12, -24); c.bezierCurveTo(-46, -4, -50, 42, 0, 42); c.bezierCurveTo(50, 42, 46, -4, 12, -24); c.closePath(); S(c, PAPER);
  poly(c, [[-12, -24], [-20, -40], [20, -40], [12, -24]]); S(c, PAPER);
  withRed(c, () => ln(c, -14, -25, 14, -25));
  won(c, 0, 14, 36);
});
I_('coin', c => { circ(c, 0, 0, 40); S(c, PAPER); const l = c.lineWidth; c.lineWidth = l * 0.6; circ(c, 0, 0, 31); c.stroke(); c.lineWidth = l; won(c, 0, 1, 38); });
I_('coins', c => {
  for (let i = 0; i < 4; i++) { rr(c, -40 + (i % 2) * 4, 30 - i * 15, 64, 15, 7.5); S(c, PAPER); }
  circ(c, 24, -8, 22); S(c, PAPER); won(c, 24, -7, 24);
});
I_('payup', c => {
  rr(c, -46, -22, 82, 50, 6); S(c, PAPER); circ(c, -5, 3, 13); c.stroke(); won(c, -5, 4, 16);
  withRed(c, () => { const l = c.lineWidth; c.lineWidth = l * 1.4; ln(c, 36, 0, 36, -42); arrowHead(c, 36, -44, -Math.PI / 2, 14); c.lineWidth = l; });
});
I_('clock', c => {
  circ(c, 0, 0, 42); S(c, PAPER);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ln(c, Math.cos(a) * 34, Math.sin(a) * 34, Math.cos(a) * 38, Math.sin(a) * 38); }
  ln(c, 0, 0, 0, -26); ln(c, 0, 0, 18, 8); circ(c, 0, 0, 4); c.fillStyle = RED; c.fill();
});
I_('chartup', c => {
  poly(c, [[-42, -42], [-42, 40], [44, 40]], false); c.stroke();
  c.fillStyle = LG; [[-30, 20, 14], [-10, 6, 14], [10, -6, 14]].forEach(([x, y, w]) => { c.fillRect(x, y, w, 40 - y); });
  withRed(c, () => { const l = c.lineWidth; c.lineWidth = l * 1.4; poly(c, [[-34, 18], [-12, -2], [6, 8], [36, -30]], false); c.stroke(); arrowHead(c, 38, -32, -0.9, 14); c.lineWidth = l; });
});
I_('crown', c => {
  poly(c, [[-40, 22], [-44, -20], [-20, 2], [0, -30], [20, 2], [44, -20], [40, 22]]); S(c, REDL);
  rr(c, -40, 22, 80, 13, 3); S(c, PAPER);
  c.fillStyle = RED;[[-44, -22], [0, -32], [44, -22]].forEach(([x, y]) => { circ(c, x, y, 5); c.fill(); });
});
I_('house', c => {
  rr(c, -32, -6, 64, 46, 3); S(c, PAPER);
  withRed(c, () => { const l = c.lineWidth; c.lineWidth = l * 1.3; poly(c, [[-44, 0], [0, -38], [44, 0]], false); c.stroke(); c.lineWidth = l; });
  rr(c, -9, 14, 18, 26, 2); S(c, LG);
});
I_('flag', c => {
  poly(c, [[-22, -42], [38, -26], [-22, -10]]); c.fillStyle = RED; c.fill(); c.stroke();
  ln(c, -22, 44, -22, -44); c.beginPath(); c.ellipse(-22, 44, 16, 4, 0, 0, Math.PI * 2); S(c, PAPER);
});
I_('laptop', c => {
  rr(c, -36, -34, 72, 48, 4); S(c, PAPER);
  c.fillStyle = LG; c.fillRect(-26, -2, 10, 8); c.fillRect(-12, -10, 10, 16); c.fillStyle = RED; c.fillRect(2, -20, 10, 26);
  poly(c, [[-46, 18], [46, 18], [40, 28], [-40, 28]]); S(c, PAPER);
});
I_('bulb', c => {
  c.beginPath(); c.arc(0, -12, 28, Math.PI * 0.78, Math.PI * 2.22); c.lineTo(10, 14); c.lineTo(-10, 14); c.closePath(); S(c, PAPER);
  rr(c, -12, 16, 24, 8, 2); S(c, PAPER); rr(c, -9, 26, 18, 7, 3); S(c, PAPER);
  withRed(c, () => {
    poly(c, [[-8, 10], [-6, -10], [0, -4], [6, -10], [8, 10]], false); c.stroke();
    for (const a of [-2.6, -2.0, -1.57, -1.14, -0.54]) ln(c, Math.cos(a) * 36, -12 + Math.sin(a) * 36, Math.cos(a) * 46, -12 + Math.sin(a) * 46);
  });
});
I_('diamond', c => {
  poly(c, [[-42, -12], [-24, -32], [24, -32], [42, -12], [0, 38]]); S(c, '#F4F4F4');
  ln(c, -42, -12, 42, -12); poly(c, [[-24, -32], [-12, -12], [0, 38], [12, -12], [24, -32]], false); c.stroke();
  poly(c, [[-12, -12], [0, -32], [12, -12]], false); c.stroke();
  sparkle(c, 40, -40, 10); sparkle(c, -44, 20, 7);
});
I_('lock', c => {
  c.beginPath(); c.arc(0, -10, 20, Math.PI, 0); c.stroke();
  rr(c, -30, -10, 60, 46, 6); S(c, PAPER); circ(c, 0, 8, 6); c.fillStyle = RED; c.fill(); c.fillRect(-2.5, 8, 5, 14);
});
I_('target', c => {
  circ(c, 0, 0, 42); S(c, PAPER); circ(c, 0, 0, 28); S(c, PAPER); circ(c, 0, 0, 13); S(c, RED);
});
I_('targetDashed', c => {
  c.setLineDash([6, 7]); c.strokeStyle = PGRAY; circ(c, 0, 0, 42); c.stroke(); circ(c, 0, 0, 28); c.stroke(); circ(c, 0, 0, 13); c.stroke(); c.setLineDash([]);
  c.fillStyle = GRAY; c.font = font(30, 800); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, 2);
});
I_('gift', c => {
  rr(c, -38, -8, 76, 46, 3); S(c, PAPER); rr(c, -44, -24, 88, 16, 3); S(c, PAPER);
  c.fillStyle = RED; c.fillRect(-7, -24, 14, 62); rr(c, -7, -24, 14, 62, 0); c.stroke();
  withRed(c, () => { c.beginPath(); c.ellipse(-14, -34, 13, 8, -0.4, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.ellipse(14, -34, 13, 8, 0.4, 0, Math.PI * 2); c.stroke(); });
});
I_('heart', c => { heartPath(c, 0, 6, 70); S(c, RED); });
I_('exchange', c => {
  withRed(c, () => {
    const l = c.lineWidth; c.lineWidth = l * 1.3;
    c.beginPath(); c.arc(0, 0, 42, Math.PI * 1.1, Math.PI * 1.85); c.stroke(); arrowHead(c, Math.cos(Math.PI * 1.85) * 42, Math.sin(Math.PI * 1.85) * 42, Math.PI * 1.85 + Math.PI / 2, 13);
    c.beginPath(); c.arc(0, 0, 42, Math.PI * 0.1, Math.PI * 0.85); c.stroke(); arrowHead(c, Math.cos(Math.PI * 0.85) * 42, Math.sin(Math.PI * 0.85) * 42, Math.PI * 0.85 + Math.PI / 2, 13);
    c.lineWidth = l;
  });
  c.save(); c.translate(-14, 2); c.scale(0.32, 0.32); c.lineWidth *= 3; ICONS.diamond(c); c.restore();
  circ(c, 18, 2, 14); S(c, PAPER); won(c, 18, 3, 16);
});
function puzzlePath(c, s = 30) {
  const k = s * 0.3;
  c.beginPath(); c.moveTo(-s, -s); c.lineTo(-k, -s); c.arc(0, -s, k, Math.PI, 0, false); c.lineTo(s, -s); c.lineTo(s, -k);
  c.arc(s, 0, k, -Math.PI / 2, Math.PI / 2, false); c.lineTo(s, s); c.lineTo(-s, s); c.closePath();
}
I_('puzzleMissing', c => {
  rr(c, -46, -46, 92, 92, 4); S(c, PAPER);
  ln(c, 0, -46, 0, 46); ln(c, -46, 0, 46, 0);
  c.fillStyle = '#F2F2F2'; c.fillRect(-44, -44, 42, 42); c.fillRect(2, 2, 42, 42); c.fillRect(-44, 2, 42, 42);
  c.fillStyle = PAPER; c.fillRect(2, -44, 42, 42);
  c.setLineDash([5, 6]); c.strokeStyle = RED; rr(c, 6, -40, 34, 34, 3); c.stroke(); c.setLineDash([]);
  c.fillStyle = RED; c.font = font(26, 800); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 23, -22);
});
I_('magnifier', c => {
  circ(c, -8, -8, 28); S(c, 'rgba(255,255,255,0.75)');
  const l = c.lineWidth; c.lineWidth = l * 2.2; c.lineCap = 'round'; ln(c, 13, 13, 38, 38); c.lineWidth = l;
});
I_('airplane', c => {
  c.save(); c.rotate(-0.35);
  poly(c, [[48, 0], [38, -7], [8, -7], [-12, -40], [-24, -40], [-10, -7], [-30, -7], [-40, -22], [-48, -22], [-42, 0], [-48, 22], [-40, 22], [-30, 7], [-10, 7], [-24, 40], [-12, 40], [8, 7], [38, 7]]);
  S(c, PAPER); c.fillStyle = RED; circ(c, 30, 0, 3); c.fill(); c.restore();
});
I_('calendar', c => {
  rr(c, -40, -32, 80, 72, 6); S(c, PAPER);
  c.fillStyle = RED; c.beginPath(); c.roundRect(-40, -32, 80, 18, [6, 6, 0, 0]); c.fill(); c.stroke();
  ln(c, -20, -42, -20, -26); ln(c, 20, -42, 20, -26);
  c.fillStyle = PGRAY; for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) { circ(c, -24 + q * 16, -2 + r * 14, 3.5); c.fill(); }
  withRed(c, () => { circ(c, 8, 12, 8); c.stroke(); });
});
I_('pin', c => {
  c.beginPath(); c.moveTo(0, 46); c.bezierCurveTo(-10, 26, -32, 8, -32, -12); c.arc(0, -12, 32, Math.PI, 0, false);
  c.bezierCurveTo(32, 8, 10, 26, 0, 46); c.closePath(); c.fillStyle = RED; c.fill(); c.strokeStyle = '#B9241C'; c.stroke();
  circ(c, 0, -12, 12); c.fillStyle = PAPER; c.fill();
});
I_('piggy', c => {
  c.beginPath(); c.ellipse(0, 6, 40, 30, 0, 0, Math.PI * 2); S(c, PAPER);
  poly(c, [[-18, -18], [-8, -34], [0, -22]]); S(c, PAPER);
  c.beginPath(); c.ellipse(41, 4, 7, 10, 0, 0, Math.PI * 2); S(c, PAPER);
  rr(c, -26, 28, 10, 14, 3); S(c, PAPER); rr(c, 14, 28, 10, 14, 3); S(c, PAPER);
  c.beginPath(); c.ellipse(0, 6, 38.5, 28.5, 0, 0, Math.PI * 2); c.fillStyle = PAPER; c.fill();
  circ(c, 22, -6, 3); c.fillStyle = INK; c.fill();
  withRed(c, () => { const l = c.lineWidth; c.lineWidth = l * 1.3; ln(c, -10, -22, 10, -22); c.lineWidth = l; });
  c.beginPath(); c.arc(-46, 0, 6, 0.5, 4.5); c.stroke();
});
I_('envelope', c => {
  rr(c, -44, -28, 88, 58, 4); S(c, PAPER); poly(c, [[-44, -28], [0, 6], [44, -28]], false); c.stroke();
  circ(c, 0, 6, 11); c.fillStyle = RED; c.fill(); won(c, 0, 7, 13, PAPER);
});
I_('wallet', c => {
  rr(c, -36, -40, 52, 30, 4); S(c, '#F2F2F2');
  rr(c, -44, -24, 88, 60, 8); S(c, PAPER); rr(c, 12, -4, 38, 22, 6); S(c, PAPER); circ(c, 22, 7, 4); c.fillStyle = RED; c.fill();
});
I_('briefcase', c => {
  rr(c, -14, -38, 28, 16, 5); c.stroke(); rr(c, -44, -24, 88, 62, 6); S(c, PAPER); ln(c, -44, -2, 44, -2);
  c.fillStyle = RED; c.fillRect(-7, -8, 14, 12);
});
I_('shop', c => {
  rr(c, -42, -12, 84, 56, 2); S(c, PAPER);
  for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? PAPER : RED; c.fillRect(-48 + i * 16, -34, 16, 22); }
  rr(c, -48, -34, 96, 22, 2); c.stroke();
  for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(-40 + i * 16, -12, 8, 0, Math.PI); c.fillStyle = i % 2 ? PAPER : RED; c.fill(); c.stroke(); }
  rr(c, 12, 10, 20, 34, 2); S(c, LG); rr(c, -32, 8, 34, 20, 2); S(c, PAPER);
  c.save(); c.translate(-15, 18); c.scale(0.22, 0.22); c.lineWidth *= 4; ICONS.bread(c); c.restore();
  ln(c, -50, 44, 50, 44);
});
I_('bread', c => {
  c.beginPath(); c.moveTo(-44, 26); c.lineTo(-44, 2); c.bezierCurveTo(-44, -36, 44, -36, 44, 2); c.lineTo(44, 26); c.closePath(); S(c, '#FFF7EC');
  withRed(c, () => { ln(c, -22, -6, -12, -18); ln(c, -4, -6, 6, -18); ln(c, 14, -6, 24, -18); });
});
I_('chefhat', c => {
  const puffs = [[-20, -12, 20], [0, -24, 24], [20, -12, 20]];
  puffs.forEach(([x, y, r]) => { circ(c, x, y, r); c.stroke(); });
  puffs.forEach(([x, y, r]) => { circ(c, x, y, r - c.lineWidth / 2); c.fillStyle = PAPER; c.fill(); });
  rr(c, -26, 0, 52, 30, 3); S(c, PAPER); withRed(c, () => ln(c, -26, 12, 26, 12));
});
I_('boxes', c => {
  [[-44, 2, 42, 40], [2, 2, 42, 40], [-21, -38, 42, 40]].forEach(([x, y, w, h]) => {
    rr(c, x, y, w, h, 2); S(c, PAPER); c.fillStyle = RED; c.fillRect(x + w / 2 - 4, y, 8, 12);
  });
});
I_('building', c => {
  rr(c, -30, -46, 60, 92, 3); S(c, PAPER);
  c.fillStyle = LG; for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) c.fillRect(-20 + q * 15, -36 + r * 17, 10, 10);
  c.fillStyle = RED; c.fillRect(-8, 30, 16, 16);
});
I_('sheet', c => {
  rr(c, -42, -34, 84, 68, 4); S(c, PAPER);
  c.fillStyle = LG; c.fillRect(-41, -33, 82, 14);
  const l = c.lineWidth; c.lineWidth = l * 0.6;
  ln(c, -16, -34, -16, 34); ln(c, 12, -34, 12, 34); for (const y of [-19, -2, 15]) ln(c, -42, y, 42, y);
  c.lineWidth = l; c.fillStyle = RED; c.fillRect(-14, -1, 25, 15);
});
I_('receipts', c => {
  [[-0.3, -10], [0.18, 8], [-0.05, 0]].forEach(([a, dx], i) => {
    c.save(); c.translate(dx, 0); c.rotate(a); rr(c, -26, -38, 52, 76, 3); S(c, PAPER);
    const l = c.lineWidth; c.lineWidth = l * 0.6; for (let j = 0; j < 4; j++) ln(c, -16, -24 + j * 12, 16 - (j % 2) * 10, -24 + j * 12); c.lineWidth = l;
    if (i === 2) won(c, 8, 24, 20); c.restore();
  });
});
I_('backpack', c => {
  c.beginPath(); c.arc(0, -28, 12, Math.PI, 0); c.stroke();
  rr(c, -32, -28, 64, 72, 16); S(c, PAPER); c.beginPath(); c.roundRect(-32, -28, 64, 28, [16, 16, 6, 6]); S(c, PAPER);
  rr(c, -20, 14, 40, 20, 5); S(c, REDL); withRed(c, () => ln(c, -10, 24, 10, 24));
  c.fillStyle = RED; circ(c, 0, -2, 4); c.fill();
});
I_('helphand', c => {
  heartPath(c, 0, -10, 44); c.fillStyle = RED; c.fill();
  const l = c.lineWidth; c.lineWidth = l * 1.2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-46, 4); c.quadraticCurveTo(-40, 34, 0, 36); c.quadraticCurveTo(40, 34, 46, 4); c.stroke();
  ln(c, -46, 4, -36, -6); ln(c, 46, 4, 36, -6); ln(c, -30, 40, -34, 48); ln(c, 30, 40, 34, 48); c.lineWidth = l;
});
I_('people', c => {
  c.save(); c.translate(-26, -6); drawPerson(c, 62, { col: '#9C9C9C' }); c.restore();
  c.save(); c.translate(26, -6); drawPerson(c, 62, { col: '#9C9C9C' }); c.restore();
  c.save(); c.translate(0, 10); drawPerson(c, 70, {}); c.restore();
});
I_('family', c => {
  c.save(); c.translate(-24, 0); drawPerson(c, 76, {}); c.restore();
  c.save(); c.translate(24, 0); drawPerson(c, 76, { acc: 'bun' }); c.restore();
  c.save(); c.translate(0, 16); drawPerson(c, 46, { col: RED }); c.restore();
});
I_('parents', c => {
  c.save(); c.translate(-22, 4); drawPerson(c, 72, { acc: 'old', col: '#555' }); c.restore();
  c.save(); c.translate(22, 4); drawPerson(c, 72, { acc: 'old', col: '#555' }); c.restore();
  c.save(); c.translate(30, -34); c.scale(0.34, 0.34); c.lineWidth *= 3; ICONS.envelope(c); c.restore();
});
I_('toolbox', c => {
  withRed(c, () => { const l = c.lineWidth; c.lineWidth = l * 1.6; c.lineCap = 'round'; ln(c, 12, -6, 30, -36); c.lineWidth = l; c.beginPath(); c.arc(32, -40, 8, 2.6, 7.2); c.stroke(); });
  ln(c, -14, -6, -24, -32); circ(c, -25, -36, 5); c.stroke();
  rr(c, -14, -28, 28, 14, 5); c.stroke();
  rr(c, -44, -12, 88, 50, 6); S(c, PAPER); ln(c, -44, 4, 44, 4); c.fillStyle = RED; c.fillRect(-7, 0, 14, 10);
});
I_('door', c => {
  rr(c, -30, -46, 60, 92, 2); S(c, REDL);
  withRed(c, () => { for (const [a, b] of [[[34, -30], [48, -36]], [[34, 0], [50, 0]], [[34, 30], [48, 36]]]) ln(c, a[0], a[1], b[0], b[1]); });
  poly(c, [[-30, -46], [-6, -38], [-6, 54], [-30, 46]]); S(c, PAPER); circ(c, -11, 6, 3); c.fillStyle = INK; c.fill();
});
I_('flask', c => {
  poly(c, [[-10, -40], [-10, -14], [-38, 38], [38, 38], [10, -14], [10, -40]]); S(c, PAPER);
  poly(c, [[-24.6, 12], [24.6, 12], [37, 36], [-37, 36]]); c.fillStyle = RED; c.fill();
  poly(c, [[-10, -40], [-10, -14], [-38, 38], [38, 38], [10, -14], [10, -40]]); c.stroke();
  ln(c, -16, -40, 16, -40); c.fillStyle = PAPER; circ(c, -6, 24, 4); c.fill(); circ(c, 8, 20, 3); c.fill();
  c.strokeStyle = RED; circ(c, 4, -22, 4); c.stroke(); circ(c, -4, -32, 3); c.stroke();
});
I_('book', c => {
  c.beginPath(); c.moveTo(0, -26); c.quadraticCurveTo(-20, -36, -46, -30); c.lineTo(-46, 30); c.quadraticCurveTo(-20, 24, 0, 34); c.closePath(); S(c, PAPER);
  c.beginPath(); c.moveTo(0, -26); c.quadraticCurveTo(20, -36, 46, -30); c.lineTo(46, 30); c.quadraticCurveTo(20, 24, 0, 34); c.closePath(); S(c, PAPER);
  const l = c.lineWidth; c.lineWidth = l * 0.6; for (let i = 0; i < 3; i++) { ln(c, -36, -16 + i * 13, -10, -14 + i * 13); ln(c, 10, -14 + i * 13, 36, -16 + i * 13); } c.lineWidth = l;
  c.fillStyle = RED; poly(c, [[24, -32], [34, -32], [34, -14], [29, -19], [24, -14]]); c.fill();
});
I_('product', c => {
  poly(c, [[-36, -12], [-12, -32], [40, -32], [16, -12]]); S(c, PAPER);
  poly(c, [[16, -12], [40, -32], [40, 22], [16, 42]]); S(c, LG);
  rr(c, -36, -12, 52, 54, 0); S(c, PAPER);
  withRed(c, () => { const l = c.lineWidth; c.lineWidth = l * 1.6; ln(c, -24, -22, 28, -22); c.lineWidth = l; });
  rr(c, -28, 10, 22, 14, 2); c.stroke();
});
I_('sprout', c => {
  for (let i = 0; i < 3; i++) { rr(c, -30 + (i % 2) * 3, 32 - i * 12, 58, 12, 6); S(c, PAPER); }
  ln(c, 0, 8, 0, -22);
  c.beginPath(); c.ellipse(-14, -26, 15, 8, 0.5, 0, Math.PI * 2); S(c, RED);
  c.beginPath(); c.ellipse(14, -34, 15, 8, -0.5, 0, Math.PI * 2); S(c, RED);
});
I_('megaphone', c => {
  poly(c, [[-26, -12], [22, -36], [22, 36], [-26, 12]]); S(c, PAPER);
  rr(c, -42, -14, 16, 28, 4); S(c, INK); ln(c, -14, 10, -8, 34);
  withRed(c, () => { c.beginPath(); c.arc(22, 0, 16, -0.7, 0.7); c.stroke(); c.beginPath(); c.arc(22, 0, 28, -0.7, 0.7); c.stroke(); });
});
I_('monitor', c => {
  rr(c, -46, -36, 92, 62, 6); S(c, PAPER); ln(c, 0, 26, 0, 38); ln(c, -18, 40, 18, 40);
  poly(c, [[-10, -18], [16, -5], [-10, 8]]); c.fillStyle = RED; c.fill();
});
I_('play', c => {
  rr(c, -46, -32, 92, 64, 18); c.fillStyle = RED; c.fill();
  poly(c, [[-11, -15], [18, 0], [-11, 15]]); c.fillStyle = PAPER; c.fill();
});
I_('cart', c => {
  poly(c, [[-48, -32], [-36, -32], [-24, 16], [34, 16], [44, -18], [-31, -18]], false); c.stroke();
  c.fillStyle = REDL; c.fillRect(-20, -12, 18, 22); c.fillStyle = RED; c.fillRect(2, -6, 18, 16);
  circ(c, -16, 30, 6); S(c, PAPER); circ(c, 26, 30, 6); S(c, PAPER);
});
I_('maze', c => {
  rr(c, -46, -46, 92, 92, 4); S(c, PAPER);
  [[-46, -23, 10, -23], [23, -46, 23, 0], [-23, -23, -23, 23], [-23, 0, 0, 0], [0, 0, 0, 23], [0, 23, 46, 23], [-46, 23, -23, 23], [23, 23, 23, 46]].forEach(a => ln(c, ...a));
  c.fillStyle = RED; circ(c, -34, -34, 6); c.fill();
  c.fillStyle = RED; c.font = font(26, 800); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 34, 34);
});
I_('camera', c => {
  circ(c, -30, -34, 11); S(c, PAPER); circ(c, -6, -34, 11); S(c, PAPER);
  rr(c, -46, -22, 62, 46, 8); S(c, PAPER); poly(c, [[16, -8], [44, -22], [44, 22], [16, 8]]); S(c, PAPER);
  circ(c, -32, -8, 5); c.fillStyle = RED; c.fill();
});
I_('form', c => {
  rr(c, -36, -40, 72, 86, 6); S(c, PAPER); rr(c, -14, -48, 28, 14, 4); S(c, INK);
  for (let i = 0; i < 3; i++) {
    const y = -18 + i * 22; rr(c, -24, y - 7, 14, 14, 2); c.stroke();
    if (i < 2) withRed(c, () => poly(c, [[-22, y], [-17, y + 5], [-8, y - 7]], false) || c.stroke());
    const l = c.lineWidth; c.lineWidth = l * 0.6; ln(c, -2, y, 24, y); c.lineWidth = l;
  }
});
I_('report', c => {
  poly(c, [[-34, -44], [18, -44], [34, -28], [34, 44], [-34, 44]]); S(c, PAPER); poly(c, [[18, -44], [18, -28], [34, -28]], false); c.stroke();
  const l = c.lineWidth; c.lineWidth = l * 0.6; ln(c, -22, -30, 6, -30); ln(c, -22, -18, 16, -18); c.lineWidth = l;
  c.fillStyle = LG; c.fillRect(-22, 10, 10, 24); c.fillRect(-6, -2, 10, 36); c.fillStyle = RED; c.fillRect(10, -10, 10, 44);
});
I_('medal', c => {
  c.fillStyle = RED; poly(c, [[-22, -46], [-8, -46], [6, -12], [-8, -12]]); c.fill(); poly(c, [[22, -46], [8, -46], [-6, -12], [8, -12]]); c.fill();
  circ(c, 0, 14, 28); S(c, PAPER); circ(c, 0, 14, 19); c.stroke(); sparkle(c, 0, 14, 11);
});
I_('presenter', c => {
  rr(c, -46, -40, 66, 48, 3); S(c, PAPER);
  withRed(c, () => { poly(c, [[-36, -2], [-22, -16], [-10, -10], [8, -30]], false); c.stroke(); });
  ln(c, -13, 8, -20, 30); c.save(); c.translate(30, 8); drawPerson(c, 70, {}); c.restore();
});
I_('searchpeople', c => {
  c.save(); c.translate(-8, -10); drawPerson(c, 40, { col: '#666' }); c.restore();
  ICONS.magnifier(c);
});
I_('wrench', c => {
  c.save(); c.rotate(-0.8);
  rr(c, -8, -6, 60, 12, 6); S(c, PAPER);
  c.beginPath(); c.arc(-18, 0, 20, 0.6, 2 * Math.PI - 0.6); c.closePath(); S(c, PAPER);
  c.restore();
});
I_('chat', c => {
  rr(c, -46, -36, 60, 40, 12); S(c, PAPER); poly(c, [[-34, 4], [-38, 18], [-22, 4]]); S(c, PAPER);
  rr(c, -10, -6, 56, 38, 12); S(c, REDL); heartPath(c, 18, 14, 22); c.fillStyle = RED; c.fill();
});
I_('exclaim', c => { circ(c, 0, 0, 42); c.fillStyle = RED; c.fill(); c.fillStyle = PAPER; c.font = font(56, 800); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('!', 0, 3); });
I_('question', c => { circ(c, 0, 0, 42); S(c, PAPER); c.fillStyle = RED; c.font = font(52, 800); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, 3); });
I_('box', c => { rr(c, -40, -30, 80, 66, 4); S(c, PAPER); poly(c, [[-40, -30], [-28, -46], [28, -46], [40, -30]]); S(c, '#F2F2F2'); });
I_('link', c => {
  const l = c.lineWidth; c.lineWidth = l * 1.5; c.strokeStyle = RED;
  c.save(); c.rotate(-0.7); rr(c, -38, -12, 40, 24, 12); c.stroke(); rr(c, -2, -12, 40, 24, 12); c.stroke(); c.restore(); c.lineWidth = l;
});
I_('pushpin', c => {
  c.save(); c.rotate(0.6);
  rr(c, -14, -44, 28, 10, 3); S(c, RED); poly(c, [[-9, -34], [9, -34], [12, -4], [-12, -4]]); S(c, RED);
  rr(c, -22, -6, 44, 8, 3); S(c, RED); ln(c, 0, 2, 0, 40); c.restore();
});
I_('hand', c => { // pointing hand
  rr(c, -36, -6, 54, 40, 12); S(c, PAPER); rr(c, -6, -30, 14, 40, 7); S(c, PAPER); rr(c, -36, -6, 54, 40, 12); c.fillStyle = PAPER; c.fill(); c.stroke();
  rr(c, -6, -46, 14, 44, 7); S(c, PAPER);
});
I_('seesaw', c => { });

function drawIcon(ctx, name, s, o = {}) {
  const f = ICONS[name]; if (!f) { console.warn('no icon', name); return; }
  const k = s / 100; ctx.save(); ctx.scale(k, k);
  ctx.lineWidth = clamp(s * 0.026, 2.4, 6) / k; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = o.ink || INK; f(ctx); ctx.restore();
}

// ---------- elements ----------
const KIND = {};
function popT(ctx, x, y, p, from = 0.82) {
  const q = clamp(p), e = ease.expo(q), f = Math.max(from, 0.9);
  const s = f + (1 - f) * ease.soft(q);
  ctx.translate(x, y + (1 - e) * 14); ctx.scale(s, s); ctx.globalAlpha *= ease.out(clamp(q * 1.4));
}
function bob() { return 0; }

KIND.txt = (ctx, el, p, t, x, y) => {
  ctx.globalAlpha *= ease.out(clamp(p * 1.3)); y += (1 - ease.expo(p)) * 16;
  const r = drawRich(ctx, el.text, x, y, el);
  if (el.ul != null) {
    const q = ease.out(clamp((t - el.ul) / 0.45));
    const spans = el.ulAll || !r.redSpans.length ? r.lines : r.redSpans;
    spans.forEach(([a, b, ly]) => underline(ctx, a - 6, b + 6, ly + (el.size || 56) * 0.62, q, el.ulCol || RED, el.ulW || 5));
  }
  if (el.strike != null) {
    const q = ease.out(clamp((t - el.strike) / 0.4));
    r.lines.forEach(([a, b, ly]) => { if (q > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.lineCap = 'round'; ln(ctx, a - 8, ly, lerp(a - 8, b + 8, q), ly); } });
  }
};
KIND.icon = (ctx, el, p, t, x, y) => {
  popT(ctx, x, y + (el.nobob ? 0 : bob(el, t)), p, el.from ?? 0.7);
  if (el.rot) ctx.rotate(el.rot);
  drawIcon(ctx, el.name, el.s, el);
};
KIND.person = (ctx, el, p, t, x, y) => {
  popT(ctx, x, y + (el.nobob ? 0 : bob(el, t, 2)), p, 0.75); drawPerson(ctx, el.s, el);
};
KIND.box = (ctx, el, p, t, x, y) => {
  const w = el.w, h = el.h, x0 = x - w / 2, y0 = y - h / 2;
  const q = ease.out(clamp(p * 1.7));
  ctx.save(); ctx.globalAlpha *= ease.out(q); shadow(ctx, true); ctx.fillStyle = el.fill || PAPER; ctx.fillRect(x0, y0, w, h); ctx.restore();
  ctx.strokeStyle = el.col || INK; ctx.lineWidth = el.lw || 3; ctx.lineCap = 'square'; ctx.lineJoin = 'miter';
  if (q >= 1) { ctx.strokeRect(x0, y0, w, h); }
  else if (q > 0) {
    partialPoly(ctx, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h]], q, false);
    partialPoly(ctx, [[x0, y0], [x0, y0 + h], [x0 + w, y0 + h]], q, false);
  }
  const pc = clamp((p - 0.22) / 0.6);
  if (pc > 0) {
    ctx.save(); ctx.globalAlpha *= ease.out(pc);
    const iy = el.icon ? (el.text ? y - h * 0.12 : y) : y;
    if (el.icon) { ctx.save(); ctx.translate(x, iy + (1 - ease.expo(pc)) * 10); const sc = 0.94 + 0.06 * ease.soft(pc); ctx.scale(sc, sc); drawIcon(ctx, el.icon, el.is || Math.min(w, h) * 0.46); ctx.restore(); }
    if (el.text) drawRich(ctx, el.text, x, el.icon ? y + h * 0.32 : y, { size: el.size || 36, w: el.w8 || 700, col: el.tcol || (el.col === RED ? RED : INK) });
    if (el.num) drawRich(ctx, el.num, x, y0 + 4, { size: 44, w: 400, font: SERIF, col: el.col === RED ? RED : INK });
    ctx.restore();
  }
  if (el.check != null) drawCheck(ctx, x0 + w - 6, y0 + 6, 30, clamp((t - el.check) / 0.35));
  if (el.cross != null) drawCross(ctx, x0 + w - 6, y0 + 6, 26, clamp((t - el.cross) / 0.35));
};
function drawCheck(ctx, x, y, s, q) {
  if (q <= 0) return; ctx.save();
  const sc = 0.7 + 0.3 * ease.soft(clamp(q * 1.6)); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y);
  ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.globalAlpha *= ease.out(clamp(q * 2)); ctx.fill();
  ctx.strokeStyle = PAPER; ctx.lineWidth = s * 0.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  partialPoly(ctx, [[x - s * 0.45, y + s * 0.02], [x - s * 0.1, y + s * 0.36], [x + s * 0.48, y - s * 0.32]], ease.out(q), false); ctx.restore();
}
function drawCross(ctx, x, y, s, q) {
  if (q <= 0) return; ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = Math.max(5, s * 0.22); ctx.lineCap = 'round';
  const a = clamp(q * 2), b = clamp(q * 2 - 1);
  ln(ctx, x - s, y - s, lerp(x - s, x + s, ease.out(a)), lerp(y - s, y + s, ease.out(a)));
  if (b > 0) ln(ctx, x + s, y - s, lerp(x + s, x - s, ease.out(b)), lerp(y - s, y + s, ease.out(b)));
  ctx.restore();
}
KIND.check = (ctx, el, p, t, x, y) => drawCheck(ctx, x, y, el.s || 30, p);
KIND.cross = (ctx, el, p, t, x, y) => drawCross(ctx, x, y, el.s || 40, p);
KIND.arrow = (ctx, el, p, t) => {
  const q = ease.inout(clamp(p * 1.1)); if (q <= 0) return;
  const { x1, y1, x2, y2 } = el; const xe = lerp(x1, x2, q), ye = lerp(y1, y2, q);
  ctx.strokeStyle = el.col || INK; ctx.lineWidth = el.lw || 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (el.dash) ctx.setLineDash([12, 12]);
  if (el.curve) { const mx = (x1 + xe) / 2, my = (y1 + ye) / 2 - el.curve * q; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, xe, ye); ctx.stroke(); ctx.setLineDash([]); arrowHead(ctx, xe, ye, Math.atan2(ye - my, xe - mx), 16); }
  else { ln(ctx, x1, y1, xe, ye); ctx.setLineDash([]); arrowHead(ctx, xe, ye, Math.atan2(y2 - y1, x2 - x1), 16); }
};
KIND.ul = (ctx, el, p) => underline(ctx, el.x1, el.x2, el.y, ease.out(p), el.col || RED, el.lw || 5);
KIND.bubble = (ctx, el, p, t, x, y) => {
  const size = el.size || 40, pad = el.pad || 30, lh = size * 1.32;
  const m = el.text ? measureRich(ctx, el.text, size, 700) : { w: 0, n: 0 };
  const is = el.icon ? (el.is || size * 1.9) : 0;
  const w = (el.icon ? is + (el.text ? 18 : 0) : 0) + m.w + pad * 2;
  const h = Math.max(is, m.n * lh) + pad * 1.4;
  const dir = el.dir || 'r', lift = el.lift || 0;
  let bx, by;
  if (dir === 'r') { bx = x + (lift > 60 ? 0 : 46); by = y - lift - h / 2; }
  else if (dir === 'l') { bx = x - (lift > 60 ? 0 : 46) - w; by = y - lift - h / 2; }
  else { bx = x - w / 2 + (el.shift || 0); by = y - 30 - h - lift; }
  const s = 0.8 + 0.2 * ease.soft(clamp(p));
  ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); ctx.globalAlpha *= ease.out(clamp(p * 1.5));
  const r = el.think ? Math.min(h / 2, 46) : 22;
  ctx.lineWidth = 3; ctx.strokeStyle = el.col || INK; ctx.lineJoin = 'round';
  const cy = by + h / 2;
  let tail;
  const low = lift > 60;
  if (dir === 'r') tail = low ? [[bx + 26, by + h - 4], [x, y], [bx + 62, by + h - 4]] : [[bx + 4, cy - 15], [x, y], [bx + 4, cy + 15]];
  else if (dir === 'l') tail = low ? [[bx + w - 62, by + h - 4], [x, y], [bx + w - 26, by + h - 4]] : [[bx + w - 4, cy - 15], [x, y], [bx + w - 4, cy + 15]];
  else tail = [[x - 16 + (el.shift ? Math.sign(el.shift) * 0 : 0), by + h - 4], [x, y], [x + 16, by + h - 4]];
  ctx.save(); shadow(ctx, true); ctx.fillStyle = el.fill || PAPER; rr(ctx, bx, by, w, h, r); ctx.fill(); ctx.restore();
  if (el.think) {
    const [a, , b] = tail; const bxm = (a[0] + b[0]) / 2, bym = (a[1] + b[1]) / 2;
    const ta = el.tailOut != null ? 1 - clamp((t - el.tailOut) / 0.3) : 1;
    ctx.save(); ctx.globalAlpha *= ta; [[0.35, 13], [0.72, 8]].forEach(([f, rad]) => { circ(ctx, lerp(bxm, x, f), lerp(bym, y, f), rad); ctx.fillStyle = PAPER; ctx.fill(); ctx.stroke(); }); ctx.restore();
    rr(ctx, bx, by, w, h, r); ctx.stroke(); rr(ctx, bx, by, w, h, r); ctx.fillStyle = el.fill || PAPER; ctx.fill(); ctx.stroke();
  } else {
    const ta = el.tailOut != null ? 1 - clamp((t - el.tailOut) / 0.3) : 1;
    ctx.save(); ctx.globalAlpha *= ta; poly(ctx, tail); ctx.stroke(); ctx.restore(); rr(ctx, bx, by, w, h, r); ctx.stroke();
    ctx.fillStyle = el.fill || PAPER; if (ta > 0) { ctx.save(); ctx.globalAlpha *= ta; poly(ctx, tail); ctx.fill(); ctx.restore(); } rr(ctx, bx, by, w, h, r); ctx.fill();
  }
  let cx = bx + pad;
  if (el.icon) { ctx.save(); ctx.translate(cx + is / 2, cy); drawIcon(ctx, el.icon, is); ctx.restore(); cx += is + 18; }
  if (el.text) drawRich(ctx, el.text, el.icon ? cx : bx + w / 2, cy, { size, w: 700, align: el.icon ? 'left' : 'center', lh, col: el.tcol || INK });
};
KIND.fn = (ctx, el, p, t) => el.draw(ctx, p, t, el);
KIND.chapter = (ctx, el, p, t) => {
  const y = 610;
  ctx.save(); ctx.globalAlpha *= 1; popT(ctx, 960, 360 + bob(el, t), p, 0.6); drawIcon(ctx, el.icon, 190); ctx.restore();
  const q = clamp((t - el.at - 0.25) / 0.5);
  ctx.textAlign = 'left'; ctx.font = font(170, 400, SERIF); const nw = ctx.measureText(el.n).width;
  ctx.font = font(70, 800); const tw = ctx.measureText(el.title).width;
  const tot = nw + 44 + tw, x0 = 960 - tot / 2;
  ctx.save(); ctx.globalAlpha *= ease.out(q);
  ctx.fillStyle = RED; ctx.font = font(170, 400, SERIF); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.fillText(el.n, x0, y + 50 + (1 - ease.out(q)) * 20);
  ctx.restore();
  const q2 = clamp((t - el.at - 0.45) / 0.5);
  ctx.save(); ctx.globalAlpha *= ease.out(q2); ctx.fillStyle = INK; ctx.font = font(70, 800); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.fillText(el.title, x0 + nw + 44, y + 40 + (1 - ease.out(q2)) * 20); ctx.restore();
  const q3 = ease.inout(clamp((t - el.at - 0.7) / 0.7));
  if (q3 > 0) { ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 - 30, y + 92); ctx.quadraticCurveTo(960, y + 86, lerp(x0 - 30, x0 + tot + 30, q3), y + 92 - 4 * q3); ctx.stroke(); }
};

function drawEl(ctx, el, t) {
  if (t < el.at) return;
  const p = clamp((t - el.at) / (el.dur || 0.5));
  let a = 1;
  if (el.dim != null && t > el.dim) a *= 1 - 0.7 * ease.inout(clamp((t - el.dim) / 0.5));
  let oy = 0;
  if (el.out != null) { if (t > el.out + 0.4) return; if (t > el.out) { const o = ease.inout(clamp((t - el.out) / 0.4)); a *= 1 - o; oy = -10 * o; } }
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, oy);
  let x = el.x, y = el.y;
  if (el.move) for (const m of [].concat(el.move)) { const q = ease.inout(clamp((t - m.at) / (m.dur || 0.8))); x += (m.dx || 0) * q; y += (m.dy || 0) * q; }
  KIND[el.k](ctx, el, p, t, x, y);
  ctx.restore();
}

// ---------- background & captions ----------
let BGC = null;
function bgCanvas() {
  if (BGC) return BGC;
  BGC = document.createElement('canvas'); BGC.width = W; BGC.height = H;
  const c = BGC.getContext('2d'); c.fillStyle = '#FAFAFA'; c.fillRect(0, 0, W, H);
  c.strokeStyle = '#EFEFEF'; c.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) { c.beginPath(); c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, H); c.stroke(); }
  for (let y = 12; y <= H; y += 48) { c.beginPath(); c.moveTo(0, y + 0.5); c.lineTo(W, y + 0.5); c.stroke(); }
  const g = c.createRadialGradient(960, 520, 300, 960, 540, 1250); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.035)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  return BGC;
}
// Caption style from "TTS 회색바 자막" (.prtextstyle): NEXON Lv2 Gothic Regular 50, white text, #181818 bar
function drawCaption(ctx, t) {
  const c = (window.CAPS || []).find(c => t >= c.s && t < c.e); if (!c) return;
  const size = 50; ctx.font = `400 ${size}px "NEXON Lv2 Gothic", Pretendard`; const tw = ctx.measureText(c.text).width;
  const padX = 30, h = 88, w = tw + padX * 2, x = 960 - w / 2, y = 948;
  ctx.fillStyle = '#181818'; rr(ctx, x, y, w, h, 10); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c.text, 960, y + h / 2 + 2);
}

// ---------- scenes ----------
const SCENES = [];
function sc(start, els) { SCENES.push({ start, els: els.flat().filter(Boolean) }); }
const XFADE = 0.3, ENTER = 0.2;
function finalizeScenes(total) {
  SCENES.sort((a, b) => a.start - b.start);
  SCENES.forEach((s, i) => {
    s.end = i + 1 < SCENES.length ? SCENES[i + 1].start : total;
    const lead = i === 0 ? 0 : ENTER;
    const groups = {};
    for (const el of s.els) {
      if (el.k === 'fn' && el.noShift) continue;
      const key = el.at.toFixed(2); const n = groups[key] = (groups[key] || 0) + 1;
      const shift = Math.max(0, s.start + lead - el.at);
      el.at += shift + (n - 1) * 0.12;
    }
  });
}
function drawScene(ctx, s, t, exitQ = 0) {
  ctx.save(); ctx.globalAlpha = 1 - ease.inout(exitQ);
  if (exitQ > 0) { const z = 1 - 0.015 * ease.inout(exitQ); ctx.translate(960, 500 - 12 * ease.inout(exitQ)); ctx.scale(z, z); ctx.translate(-960, -500); }
  for (const el of s.els) drawEl(ctx, el, t);
  ctx.restore();
}
function render(t) {
  const cv = document.getElementById('c'), ctx = cv.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.setLineDash([]);
  ctx.drawImage(bgCanvas(), 0, 0);
  const i = SCENES.findIndex(s => t >= s.start && t < s.end);
  const idx = i < 0 ? SCENES.length - 1 : i;
  const prev = SCENES[idx - 1];
  if (prev && t < prev.end + XFADE) drawScene(ctx, prev, t, (t - prev.end) / XFADE);
  drawScene(ctx, SCENES[idx], t, 0);
  drawCaption(ctx, t);
}

// ---------- element constructors ----------
const T = (at, x, y, text, size = 56, o = {}) => ({ k: 'txt', at, x, y, text, size, ...o });
const L = (at, x, y, text, o = {}) => ({ k: 'txt', at, x, y, text, size: 34, w: 600, col: '#8E8E8E', ...o });
const Ic = (at, name, x, y, s, o = {}) => ({ k: 'icon', at, name, x, y, s, ...o });
const Pe = (at, x, y, s, o = {}) => ({ k: 'person', at, x, y, s, dur: 0.45, ...o });
const Bu = (at, x, y, text, o = {}) => ({ k: 'bubble', at, x, y, text, dur: 0.45, ...o });
const Bx = (at, x, y, w, h, text, o = {}) => ({ k: 'box', at, x, y, w, h, text, dur: 0.7, ...o });
const Cd = (at, x, y, w, h, icon, text, o = {}) => ({ k: 'box', at, x, y, w, h, icon, text, dur: 0.8, ...o });
const Ar = (at, x1, y1, x2, y2, o = {}) => ({ k: 'arrow', at, x1, y1, x2, y2, dur: 0.5, ...o });
const Ul = (at, x1, x2, y, o = {}) => ({ k: 'ul', at, x1, x2, y, ...o });
const Ck = (at, x, y, s = 30, o = {}) => ({ k: 'check', at, x, y, s, dur: 0.4, ...o });
const Xx = (at, x, y, s = 40, o = {}) => ({ k: 'cross', at, x, y, s, dur: 0.45, ...o });
const Fn = (at, draw, o = {}) => ({ k: 'fn', at, draw, ...o });
const Ch = (at, n, title, icon) => ({ k: 'chapter', at, n, title, icon, dur: 0.6, x: 960 });
