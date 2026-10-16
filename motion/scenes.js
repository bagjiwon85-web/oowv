// Scene script for BPT 27 — timings follow the SRT (seconds).
const at0 = (el, d) => clamp(d);
function icon(ctx, name, x, y, s, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); drawIcon(ctx, name, s); ctx.restore(); }
function person(ctx, x, y, s, o = {}) { ctx.save(); ctx.translate(x, y); drawPerson(ctx, s, o); ctx.restore(); }
function label(ctx, text, x, y, o = {}) { drawRich(ctx, text, x, y, { size: 34, w: 600, col: '#8E8E8E', ...o }); }
const prog = (t, a, d) => clamp((t - a) / d);

// --- custom animated metaphors ---
const coinsGrow = (x, y, at) => (ctx, p, t) => {
  for (let i = 0; i < 3; i++) {
    const n = Math.round(lerp(1, 3 + i * 2, ease.out(prog(t, at + i * 0.3, 3.2))));
    for (let j = 0; j < n; j++) { ctx.save(); ctx.globalAlpha *= clamp(p * 2); ctx.translate(x + (i - 1) * 96, y - j * 22); ctx.lineWidth = 3; ctx.strokeStyle = INK; rr(ctx, -40, -11, 80, 22, 11); ctx.fillStyle = PAPER; ctx.fill(); ctx.stroke(); ctx.restore(); }
  }
};
// dashed road drawn first so it sits behind the person, bag and flag
const roadLine = () => (ctx, p) => { ctx.save(); ctx.globalAlpha *= ease.out(p); ctx.strokeStyle = PGRAY; ctx.lineWidth = 3; ctx.setLineDash([10, 12]); ln(ctx, 300, 650, 1640, 650); ctx.restore(); };
const flagDrift = (at) => (ctx, p, t) => {
  const q = ease.inout(prog(t, at + 1.0, 2.4));
  const fx = lerp(1180, 1520, q);
  ctx.save(); ctx.globalAlpha *= ease.out(p); ctx.translate(fx, 560); drawIcon(ctx, 'flag', 170); ctx.restore();
  label(ctx, '원하는 삶', fx, 690, { col: INK, size: 38, w: 700 });
  if (q > 0) {
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.lineCap = 'round'; const x1 = 800, x2 = fx - 110;
    ln(ctx, x1, 440, x2, 440); arrowHead(ctx, x2, 440, 0, 14); arrowHead(ctx, x1, 440, Math.PI, 14); ctx.restore();
    drawRich(ctx, '멀어진다', (800 + fx - 110) / 2, 395, { size: 40, col: RED, w: 800 });
  }
};
const clockShrink = (x, y, r, at) => (ctx, p, t) => {
  const q = ease.inout(prog(t, at + 1.2, 1.6));
  const hrs = lerp(10, 5, q);
  ctx.save(); popT(ctx, x, y, p, 0.7);
  ctx.fillStyle = PAPER; ctx.strokeStyle = INK; ctx.lineWidth = 5; circ(ctx, 0, 0, r); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(229,53,43,0.85)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r - 14, -Math.PI / 2, -Math.PI / 2 + hrs / 12 * Math.PI * 2); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 4; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ln(ctx, Math.cos(a) * (r - 10), Math.sin(a) * (r - 10), Math.cos(a) * (r - 2), Math.sin(a) * (r - 2)); }
  ctx.fillStyle = PAPER; circ(ctx, 0, 0, r * 0.42); ctx.fill(); ctx.stroke();
  drawRich(ctx, Math.round(hrs) + '시간', 0, 2, { size: 46, w: 800 });
  ctx.restore();
};
const glassGrow = (x, y, at) => (ctx, p, t) => {
  const q = prog(t, at, 3.0);
  const hTop = lerp(170, 300, ease.inout(q));
  const lvl = lerp(20, hTop - 70, ease.out(clamp(q * 1.1)));
  const by = y + 160, w0 = 220, w1 = 170;
  ctx.save(); ctx.globalAlpha *= ease.out(p);
  const topY = by - hTop;
  const wAt = h => lerp(w1, w0, h / 300);
  ctx.fillStyle = 'rgba(229,53,43,0.82)';
  ctx.beginPath(); ctx.moveTo(x - w1 / 2 + 4, by - 4); ctx.lineTo(x + w1 / 2 - 4, by - 4); ctx.lineTo(x + wAt(lvl) / 2 - 4, by - lvl); ctx.lineTo(x - wAt(lvl) / 2 + 4, by - lvl); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  poly(ctx, [[x - wAt(hTop) / 2, topY], [x - w1 / 2, by], [x + w1 / 2, by], [x + wAt(hTop) / 2, topY]], false); ctx.stroke();
  ctx.setLineDash([8, 10]); ctx.strokeStyle = PGRAY; ctx.lineWidth = 3; ln(ctx, x - wAt(hTop) / 2 - 30, topY, x + wAt(hTop) / 2 + 30, topY); ctx.setLineDash([]);
  ctx.strokeStyle = RED; ctx.lineWidth = 4; ln(ctx, x + 150, topY + 40, x + 150, topY - 10); arrowHead(ctx, x + 150, topY - 12, -Math.PI / 2, 12);
  ctx.restore();
};
const stairs = (at) => (ctx, p, t) => {
  ctx.save(); ctx.globalAlpha *= ease.out(p); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.fillStyle = '#F3F3F3';
  const steps = [[340, 820, 400, 120], [740, 700, 400, 240], [1140, 580, 440, 360]];
  steps.forEach(([x, y, w, h], i) => { const q = ease.out(prog(t, at + i * 0.25, 0.5)); ctx.save(); ctx.globalAlpha *= q; ctx.fillRect(x, y + (1 - q) * 30, w, 900 - y); ln(ctx, x, y + (1 - q) * 30, x + w, y + (1 - q) * 30); ctx.restore(); });
  ctx.restore();
};
const targetJump = (pts, at, every = 1.05) => (ctx, p, t) => {
  const lt = Math.max(0, t - at - 0.6); const n = pts.length;
  const i = Math.floor(lt / every) % n, f = ease.inout(clamp((lt % every) / 0.7));
  const a = pts[i], b = pts[(i + 1) % n];
  const x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f) - Math.sin(f * Math.PI) * 90;
  ctx.save(); ctx.globalAlpha *= ease.out(p); ctx.translate(x, y); drawIcon(ctx, 'target', 92); ctx.restore();
};
const seesaw = (at, tilt) => (ctx, p, t) => {
  const q = ease.inout(prog(t, tilt, 2.0));
  const ang = -0.2 * q; const cx = 960, cy = 640, L = 380;
  ctx.save(); ctx.globalAlpha *= ease.out(p);
  ctx.fillStyle = PAPER; ctx.strokeStyle = INK; ctx.lineWidth = 4; poly(ctx, [[cx, cy], [cx - 50, cy + 110], [cx + 50, cy + 110]]); ctx.fill(); ctx.stroke();
  ctx.translate(cx, cy); ctx.rotate(-ang);
  ctx.fillStyle = INK; ctx.fillRect(-L, -8, L * 2, 12);
  // left: family + heart (shrinks)
  ctx.save(); ctx.translate(-L + 110, -8); ctx.rotate(ang); const fs = lerp(1, 0.72, q);
  ctx.globalAlpha *= lerp(1, 0.55, q); ctx.translate(0, -78 * fs); drawIcon(ctx, 'family', 170 * fs);
  heartPath(ctx, 70 * fs, -70 * fs, 40 * fs); ctx.fillStyle = RED; ctx.fill(); ctx.restore();
  // right: coins pile grows
  ctx.save(); ctx.translate(L - 110, -8); ctx.rotate(ang);
  const n = Math.round(lerp(1, 6, ease.out(prog(t, tilt, 2.2))));
  for (let j = 0; j < n; j++) { rr(ctx, -50 + (j % 2) * 6, -22 - j * 22, 90, 20, 10); ctx.fillStyle = PAPER; ctx.fill(); ctx.lineWidth = 3; ctx.stroke(); }
  won(ctx, 0, -40 - n * 22, 40); ctx.restore();
  ctx.restore();
  label(ctx, '가족과의 시간', 960 - 290, 800, { col: INK, w: 700, size: 36 });
  label(ctx, '수입', 960 + 290, 800, { col: INK, w: 700, size: 36 });
};
const blankCycle = (x, y, at) => (ctx, p, t) => {
  const icons = ['airplane', 'parents', 'clock', 'house'];
  ctx.save(); ctx.globalAlpha *= ease.out(p);
  ctx.setLineDash([10, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 4; rr(ctx, x - 90, y - 90, 180, 180, 16); ctx.fillStyle = PAPER; ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  const lt = Math.max(0, t - at), per = 0.9, k = Math.floor(lt / per) % icons.length, f = (lt % per) / per;
  ctx.translate(x, y);
  const fin = clamp(f / 0.3), fout = clamp((f - 0.75) / 0.25);
  ctx.save(); ctx.globalAlpha *= ease.out(fin) * (1 - ease.in(fout)); const sc = 0.92 + 0.08 * ease.expo(fin); ctx.translate(0, (1 - ease.expo(fin)) * 10 - 8 * ease.in(fout)); ctx.scale(sc, sc); drawIcon(ctx, icons[k], 120); ctx.restore();
  ctx.restore();
};
const pipes = (at, at2) => (ctx, p, t) => {
  const px = 960, py = 680;
  const flow = (pts, t0, dashed, col) => {
    const q = ease.inout(prog(t, t0, 0.7)); if (q <= 0) return;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.globalAlpha *= 0.18; partialPoly(ctx, pts, q, false); ctx.restore();
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4; if (dashed) ctx.setLineDash([12, 10]); partialPoly(ctx, pts, q, false); ctx.restore();
    if (q >= 1 && !dashed) {
      const tot = pts.slice(1).reduce((s, b, i) => s + Math.hypot(b[0] - pts[i][0], b[1] - pts[i][1]), 0);
      for (let k = 0; k < 4; k++) {
        let d = ((t * 180 + k * tot / 4) % tot); let j = 1;
        while (j < pts.length) { const sl = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); if (d <= sl) break; d -= sl; j++; }
        if (j >= pts.length) continue; const sl = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
        const cx = lerp(pts[j - 1][0], pts[j][0], d / sl), cy = lerp(pts[j - 1][1], pts[j][1], d / sl);
        ctx.save(); ctx.translate(cx, cy); drawIcon(ctx, 'coin', 40); ctx.restore();
      }
    }
  };
  flow([[560, 490], [560, 560], [800, 560], [880, 640]], at + 0.3, false, INK);
  flow([[1360, 490], [1360, 560], [1120, 560], [1040, 640]], at2 + 0.3, true, RED);
  ctx.save(); popT(ctx, px, py, p, 0.7); drawIcon(ctx, 'piggy', 210); ctx.restore();
};
const barsRise = (x, y, at) => (ctx, p, t) => {
  ctx.save(); ctx.globalAlpha *= ease.out(p); ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ln(ctx, x - 120, y + 80, x + 130, y + 80);
  [50, 90, 150].forEach((h, i) => { const q = ease.out(prog(t, at + 0.2 + i * 0.2, 0.6)); ctx.fillStyle = i === 2 ? RED : '#DADADA'; ctx.fillRect(x - 100 + i * 75, y + 80 - h * q, 50, h * q); });
  const q = ease.inout(prog(t, at + 0.8, 0.6)); if (q > 0) { ctx.strokeStyle = RED; partialPoly(ctx, [[x - 90, y + 10], [x - 10, y - 20], [x + 80, y - 90]], q, false); if (q > 0.95) arrowHead(ctx, x + 80, y - 90, -0.66, 14); }
  ctx.restore();
};
const puzzleSlide = (at, coinAt) => (ctx, p, t) => {
  const bx = 1220, by = 520;
  ctx.save(); ctx.globalAlpha *= ease.out(p); ctx.translate(bx, by);
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.fillStyle = '#EDEDED'; rr(ctx, -170, -150, 300, 300, 10); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.translate(20, 0); ctx.scale(2.6, 2.6); puzzlePath(ctx, 30); ctx.fillStyle = PAPER; ctx.fill(); ctx.setLineDash([3, 3]); ctx.lineWidth = 1.4; ctx.strokeStyle = GRAY; ctx.stroke(); ctx.restore();
  ctx.restore();
  label(ctx, '누군가의 문제', bx - 20, by + 200, { col: INK, w: 700, size: 38 });
  const q = ease.inout(prog(t, at + 0.9, 1.3));
  const x = lerp(520, bx + 20, q), y = by + Math.sin(q * Math.PI) * -60;
  ctx.save(); ctx.globalAlpha *= ease.out(p); ctx.translate(x, y); ctx.rotate((1 - q) * -0.25); ctx.scale(2.6, 2.6); puzzlePath(ctx, 30);
  ctx.fillStyle = RED; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#A51E16'; ctx.stroke(); ctx.restore();
  if (q < 0.6) label(ctx, '내 능력', x, by + 200, { col: RED, w: 800, size: 38 });
  const c = prog(t, coinAt, 0.5);
  if (c > 0) { ctx.save(); popT(ctx, bx + 20, by - 250 + Math.sin(t * 2) * 4, c, 0.5); drawIcon(ctx, 'coin', 120); sparkle(ctx, 70, -50, 14); sparkle(ctx, -70, 30, 10); ctx.restore(); }
};
const hamster = (x, y, r, at) => (ctx, p, t) => {
  ctx.save(); popT(ctx, x, y, p, 0.7);
  ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ln(ctx, 0, 0, -90, r + 70); ln(ctx, 0, 0, 90, r + 70); ln(ctx, -130, r + 70, 130, r + 70);
  ctx.lineWidth = 6; circ(ctx, 0, 0, r); ctx.fillStyle = PAPER; ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3; circ(ctx, 0, 0, r - 26); ctx.stroke();
  const rot = (t - at) * 2.6;
  for (let i = 0; i < 18; i++) { const a = rot + i * Math.PI / 9; ln(ctx, Math.cos(a) * (r - 26), Math.sin(a) * (r - 26), Math.cos(a) * r, Math.sin(a) * r); }
  ctx.fillStyle = INK; circ(ctx, 0, 0, 9); ctx.fill();
  // runner (feet on inner rim)
  const ph = Math.sin((t - at) * 11), sc = 1.55;
  ctx.save(); ctx.translate(0, r - 28 - 62 * sc); ctx.scale(sc, sc); ctx.rotate(0.12);
  ctx.fillStyle = RED; circ(ctx, 8, -76, 19); ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = RED; ctx.lineWidth = 22; ln(ctx, 2, -48, -4, 8);
  ctx.lineWidth = 13; ln(ctx, -4, 8, -4 + ph * 26, 60); ln(ctx, -4, 8, -4 - ph * 26, 60);
  ln(ctx, 2, -40, 24 - ph * 22, -8); ln(ctx, 2, -40, -18 + ph * 22, -6);
  ctx.restore();
  ctx.fillStyle = '#7FB6E8'; const sy = ((t * 1.3) % 1); ctx.globalAlpha *= 1 - sy; ctx.beginPath(); ctx.arc(52, r - 28 - 150 + sy * 30, 8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
};
const islands = (at, gapAt) => (ctx, p, t) => {
  ctx.save(); ctx.globalAlpha *= ease.out(p);
  // sea
  ctx.strokeStyle = '#B9D3EA'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) {
    const x = 760 + i * 120 + ((t * 30 + r * 40) % 120) - 60, y = 700 + r * 50; if (x < 720 || x > 1220) continue;
    ctx.beginPath(); ctx.moveTo(x - 24, y); ctx.quadraticCurveTo(x - 12, y - 12, x, y); ctx.quadraticCurveTo(x + 12, y + 12, x + 24, y); ctx.stroke();
  }
  const isl = (cx) => { ctx.fillStyle = '#F1ECE2'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, 740, 270, 60, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); };
  isl(470); isl(1450);
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= ease.out(p);
  person(ctx, 430, 620, 190, { col: RED });
  ctx.save(); ctx.translate(560, 640); drawIcon(ctx, 'diamond', 110); ctx.restore();
  ctx.restore();
  const q2 = ease.out(prog(t, at + 0.9, 0.5));
  ctx.save(); ctx.globalAlpha *= q2; ctx.translate(1450, 640); drawIcon(ctx, 'people', 220); ctx.restore();
  label(ctx, '좋은 능력', 470, 830, { col: INK, w: 700, size: 36 });
  if (q2 > 0) label(ctx, '필요한 사람', 1450, 830, { col: INK, w: 700, size: 36 });
  const g = prog(t, gapAt, 0.6);
  if (g > 0) {
    ctx.save(); ctx.globalAlpha *= ease.out(g); ctx.setLineDash([14, 12]); ctx.strokeStyle = PGRAY; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(720, 690); ctx.quadraticCurveTo(960, 600, 1200, 690); ctx.stroke(); ctx.restore();
    drawCross(ctx, 960, 640, 34, prog(t, gapAt + 0.3, 0.45));
    if (g > 0.5) drawRich(ctx, '수입으로 연결 X', 960, 530, { size: 42, w: 800, col: RED });
  }
};
const cycle = (at, times, nodes) => (ctx, p, t) => {
  const cx = 960, cy = 540, R = 245;
  const pos = nodes.map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; return [cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R * 0.95]; });
  ctx.save(); ctx.strokeStyle = PGRAY; ctx.lineWidth = 4; ctx.lineCap = 'round';
  nodes.forEach((_, i) => {
    const q = ease.inout(prog(t, times[(i + 1) % 4 === 0 ? 3 : i + 1] - 0.3, 0.6)); if (i === 3 && t < times[3] + 0.3) return;
    if (q <= 0) return;
    const a0 = -Math.PI / 2 + i * Math.PI / 2 + 0.42, a1 = a0 + (Math.PI / 2 - 0.84) * q;
    ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.25, R * 0.95, 0, a0, a1); ctx.stroke();
    if (q > 0.9) arrowHead(ctx, cx + Math.cos(a1) * R * 1.25, cy + Math.sin(a1) * R * 0.95, a1 + Math.PI / 2 - 0.1, 14);
  });
  ctx.restore();
  if (t > times[3] + 0.8) { const a = -Math.PI / 2 + (t - times[3]) * 1.6; ctx.fillStyle = RED; circ(ctx, cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R * 0.95, 10); ctx.fill(); }
  nodes.forEach(([ic, tx], i) => {
    const q = prog(t, times[i], 0.5); if (q <= 0) return;
    const [x, y] = pos[i];
    ctx.save(); popT(ctx, x, y, q, 0.6); shadow(ctx, true); ctx.fillStyle = PAPER; rr(ctx, -145, -62, 290, 124, 4); ctx.fill(); shadow(ctx, false);
    ctx.strokeStyle = i === 1 ? RED : INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.translate(-82, 0); drawIcon(ctx, ic, 74); ctx.restore();
    drawRich(ctx, tx, -28, 0, { size: 34, w: 700, align: 'left' }); ctx.restore();
  });
  const cq = prog(t, at, 0.5); if (cq > 0) { ctx.save(); ctx.globalAlpha *= ease.out(cq); drawRich(ctx, '작게\n반복', cx, cy, { size: 46, w: 800, col: INK }); ctx.restore(); }
};
const funnel = (at, t2, t3) => (ctx, p, t) => {
  const cx = 820, top = 230, mid = 520, bot = 700;
  ctx.save(); ctx.globalAlpha *= ease.out(p);
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  poly(ctx, [[cx - 360, top], [cx + 360, top], [cx + 70, mid + 40], [cx + 70, bot], [cx - 70, bot], [cx - 70, mid + 40]]);
  ctx.fillStyle = PAPER; ctx.fill(); ctx.stroke();
  ctx.setLineDash([8, 9]); ctx.strokeStyle = PGRAY; ctx.lineWidth = 3; ln(ctx, cx - 250, 340, cx + 250, 340); ln(ctx, cx - 110, 470, cx + 110, 470); ctx.setLineDash([]);
  ctx.restore();
  // particles: people dots falling
  const lt = t - at;
  for (let i = 0; i < 26; i++) {
    const ph = ((lt * 0.33 + i / 26) % 1); const stage = t < t2 ? 0.38 : t < t3 ? 0.68 : 1.02;
    if (ph > stage) continue; const endFade = clamp((stage - ph) / 0.06);
    const yy = lerp(top - 120, bot + 40, ph);
    const half = yy < top ? 380 : yy < mid + 40 ? lerp(360, 70, (yy - top) / (mid + 40 - top)) - 30 : 40;
    const xx = cx + Math.sin(i * 12.9898) * half * 0.85;
    const a = endFade * clamp(lt * 2) * (yy < top ? clamp((yy - top + 120) / 60) : 1);
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = yy > 480 ? RED : '#4A4A4A'; circ(ctx, xx, yy - 6, 9); ctx.fill(); ctx.beginPath(); ctx.roundRect(xx - 11, yy + 5, 22, 13, [8, 8, 2, 2]); ctx.fill(); ctx.restore();
  }
  const row = (y, ic, text, ta, col) => {
    const q = prog(t, ta, 0.5); if (q <= 0) return;
    ctx.save(); ctx.globalAlpha *= ease.out(q); ctx.translate((1 - ease.out(q)) * 30, 0);
    ctx.strokeStyle = PGRAY; ctx.lineWidth = 3; ctx.setLineDash([6, 8]); ln(ctx, cx + 300, y, 1290, y); ctx.setLineDash([]);
    ctx.save(); ctx.translate(1350, y); drawIcon(ctx, ic, 76); ctx.restore();
    drawRich(ctx, text, 1410, y, { size: 40, w: 800, align: 'left', col }); ctx.restore();
  };
  row(285, 'heart', '관심 모으기', at, INK); row(420, 'helphand', '구체적 도움', t2, INK); row(640, 'gift', '상품 · 서비스', t3, RED);
  const q = prog(t, t3, 0.5); if (q > 0) { ctx.save(); popT(ctx, cx, 790, q, 0.5); drawIcon(ctx, 'gift', 110); ctx.restore(); }
};
const heartsFloat = (x, y, at) => (ctx, p, t) => {
  for (let i = 0; i < 9; i++) {
    const ph = ((t - at) * 0.45 + i / 9) % 1; if (t - at < i * 0.15) continue;
    const xx = x + Math.sin(i * 7.1 + ph * 4) * 90, yy = y - ph * 260;
    ctx.save(); ctx.globalAlpha *= (1 - ph) * ease.out(p); heartPath(ctx, xx, yy, 34 + (i % 3) * 8); ctx.fillStyle = i % 3 ? RED : '#F28B84'; ctx.fill(); ctx.restore();
  }
};
const readiness = (at, xs, lv) => (ctx, p, t) => {
  xs.forEach((x, i) => {
    const q = prog(t, at + i * 0.2, 0.5); if (q <= 0) return;
    ctx.save(); ctx.globalAlpha *= ease.out(q);
    ctx.strokeStyle = INK; ctx.lineWidth = 3; rr(ctx, x - 120, 810, 240, 26, 13); ctx.fillStyle = PAPER; ctx.fill(); ctx.stroke();
    const f = ease.out(prog(t, at + 0.3 + i * 0.2, 1.0)) * lv[i]; ctx.fillStyle = i === 1 ? RED : '#4A4A4A'; rr(ctx, x - 116, 814, 232 * f, 18, 9); ctx.fill();
    ctx.restore();
  });
};
const mapHere = (x, y, at, ulAt) => (ctx, p, t) => {
  ctx.save(); popT(ctx, x, y, p, 0.8);
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.fillStyle = PAPER;
  poly(ctx, [[-260, -150], [-90, -180], [90, -150], [260, -180], [260, 150], [90, 180], [-90, 150], [-260, 180]]); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#F3F3F3'; poly(ctx, [[-90, -180], [90, -150], [90, 180], [-90, 150]]); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = PGRAY; ctx.setLineDash([10, 10]); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-200, 110); ctx.bezierCurveTo(-120, 20, -20, 120, 40, 20); ctx.bezierCurveTo(90, -60, 160, -40, 200, -110); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.save(); ctx.translate(200, -120); drawIcon(ctx, 'flag', 70); ctx.restore();
  const b = Math.abs(Math.sin((t - at) * 3)) * 16 * clamp(t - at);
  ctx.save(); ctx.translate(-200, 70 - b); drawIcon(ctx, 'pin', 100); ctx.restore();
  ctx.fillStyle = 'rgba(229,53,43,0.18)'; ctx.beginPath(); ctx.ellipse(-200, 122, 30 - b * 0.6, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
};
const commentCard = (x, y, w, at, linkAt) => (ctx, p, t) => {
  ctx.save(); popT(ctx, x, y, p, 0.85);
  shadow(ctx, true); ctx.fillStyle = PAPER; rr(ctx, -w / 2, -95, w, 190, 14); ctx.fill(); shadow(ctx, false);
  ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#2B2B2B'; circ(ctx, -w / 2 + 70, -30, 34); ctx.fill();
  ctx.save(); ctx.translate(-w / 2 + 70, -24); ctx.scale(0.5, 0.5); drawPerson(ctx, 90, { col: PAPER }); ctx.restore();
  ctx.save(); ctx.translate(-w / 2 + 140, -48); drawIcon(ctx, 'pushpin', 34); ctx.restore();
  drawRich(ctx, '고정 댓글', -w / 2 + 170, -48, { size: 30, w: 700, align: 'left', col: '#666' });
  ctx.fillStyle = '#E2E2E2'; rr(ctx, -w / 2 + 130, -8, w * 0.55, 16, 8); ctx.fill();
  const q = prog(t, linkAt, 0.5);
  if (q > 0) {
    ctx.save(); ctx.globalAlpha *= ease.out(q); const lx = -w / 2 + 130; ctx.fillStyle = REDL; rr(ctx, lx, 26, 250, 50, 25); ctx.fill();
    ctx.strokeStyle = RED; ctx.lineWidth = 2.5; ctx.stroke(); ctx.save(); ctx.translate(lx + 38, 51); drawIcon(ctx, 'link', 34); ctx.restore();
    drawRich(ctx, '진단 링크', lx + 70, 51, { size: 28, w: 800, align: 'left', col: RED }); ctx.restore();
    const hq = ease.out(prog(t, linkAt + 0.3, 0.6)); const hb = Math.sin((t - linkAt) * 5) * 6;
    ctx.save(); ctx.globalAlpha *= hq; ctx.translate(lx + 270 + hb, 92 - hb * 0.5); ctx.rotate(-0.6); drawIcon(ctx, 'hand', 64); ctx.restore();
  }
  ctx.restore();
};

// ---------------- SCENES ----------------
// 1. 부자가 되고 싶을 때 → 돈을 더 벌 방법부터 고민
sc(0, [
  L(0, 960, 170, '부자가 되고 싶을 때'),
  Pe(0, 700, 640, 300),
  Bu(2.75, 800, 520, '어떻게 더 벌지?', { icon: 'moneybag', think: true, dir: 'r', lift: 120, size: 44 }),
]);
// 2. 월급 / 더 일하기 / 투자
sc(6.2, [
  L(6.2, 960, 220, '돈을 더 벌기 위해 우리가 하는 일'),
  Cd(6.2, 560, 520, 320, 320, 'payup', '월급 올리기'),
  Cd(7.45, 960, 520, 320, 320, 'clock', '더 많이 일하기'),
  Cd(8.65, 1360, 520, 320, 320, 'chartup', '투자처 찾기'),
]);
// 3. 수입 ↑ ≠ 부자
sc(11.0, [
  Fn(11.0, coinsGrow(560, 600, 11.0), { dur: 0.4 }),
  T(11.0, 560, 760, '수입', 46, { w: 800 }),
  Ck(11.8, 700, 380, 32),
  T(14.9, 960, 500, '≠', 150, { col: RED, w: 500, dur: 0.4 }),
  Ic(13.05, 'crown', 1360, 520, 230),
  T(13.05, 1360, 760, '부자', 46, { w: 800 }),
  Xx(14.9, 1360, 520, 70),
]);
// 4. 원하는 삶과 멀어짐
sc(16.85, [
  Fn(16.85, roadLine(), { dur: 0.5 }),
  L(16.85, 960, 200, '돈을 많이 벌어도'),
  Pe(16.85, 520, 590, 230),
  Ic(16.85, 'moneybag', 680, 600, 140),
  Fn(16.85, flagDrift(16.85), { dur: 0.5 }),
]);
// 5. 지금 일에만 집중 → 기회 놓침
sc(20.4, [
  L(20.4, 960, 180, '지금 하는 일에만 집중하면'),
  Pe(20.4, 960, 600, 250),
  Ic(20.4, 'laptop', 960, 740, 210, { nobob: true }),
  Ic(22.45, 'bulb', 560, 420, 140, { dim: 24.2, move: { at: 23.4, dx: -120, dy: -40, dur: 2.2 } }),
  Ic(22.85, 'bulb', 1380, 380, 140, { dim: 24.4, move: { at: 23.6, dx: 120, dy: -50, dur: 2.2 } }),
  Ic(23.25, 'bulb', 1420, 690, 120, { dim: 24.6, move: { at: 23.8, dx: 140, dy: 30, dur: 2.2 } }),
  T(24.2, 1480, 540, '놓친 기회', 44, { col: RED, w: 800 }),
]);
// 6. 좋은 능력 → 돈 버는 방법?
sc(25.95, [
  Ic(25.95, 'diamond', 600, 470, 240),
  T(26.3, 600, 680, '좋은 능력', 46, { w: 800 }),
  Ar(28.9, 790, 470, 1130, 470, { dash: true }),
  Ic(28.9, 'coin', 1320, 470, 200),
  T(29.4, 1430, 340, '?', 110, { col: RED, w: 800 }),
  T(29.2, 1320, 680, '돈 버는 방법', 46, { w: 800 }),
]);
// 7. 무엇을 다르게 준비할까
sc(31.4, [
  T(31.4, 960, 250, '부자가 되기 위해\n무엇을 {다르게} 준비해야 할까?', 60, { ul: 32.6, lh: 84 }),
  Pe(31.4, 960, 650, 250),
  T(32.2, 1110, 520, '?', 80, { col: RED, w: 800 }),
  T(32.5, 820, 560, '?', 60, { col: GRAY, w: 800 }),
]);
// 8. 꼭 알아야 할 세 가지
sc(35.7, [
  L(35.7, 960, 200, '부자가 되고 싶다면 꼭 알아야 할'),
  T(35.7, 960, 280, '{세 가지}', 72, { w: 800, ul: 38.4 }),
  Cd(38.15, 560, 590, 300, 280, 'target', null, { num: '01', is: 140 }),
  Cd(38.5, 960, 590, 300, 280, 'gift', null, { num: '02', is: 140 }),
  Cd(38.85, 1360, 590, 300, 280, 'exchange', null, { num: '03', is: 140, col: RED }),
]);
// 9. 놓치고 있는 것 / 무엇부터 바꿀지
sc(40.8, [
  L(40.8, 960, 180, '이 영상을 끝까지 보시면'),
  Ic(40.8, 'puzzleMissing', 600, 500, 260),
  Ic(42.4, 'magnifier', 680, 440, 150, { move: { at: 42.4, dx: 0, dy: 0 } }),
  T(42.6, 600, 720, '놓치고 있는 것', 44, { w: 800 }),
  Fn(44.75, (ctx, p, t) => {
    ctx.save(); ctx.globalAlpha *= ease.out(p); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = 'round';
    const x0 = 1080, y0 = 640; const pts = [[x0, y0]]; for (let i = 0; i < 4; i++) { pts.push([x0 + i * 100, y0 - (i + 1) * 70]); pts.push([x0 + (i + 1) * 100, y0 - (i + 1) * 70]); }
    partialPoly(ctx, pts, ease.inout(clamp(p * 1.2)), false);
    const r = prog(t, 47.4, 0.4); if (r > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 9; ln(ctx, x0, y0 - 70, x0 + 100, y0 - 70); }
    ctx.restore();
    const climb = ease.inout(prog(t, 45.4, 1.6)) * 0.0; person(ctx, 1130, 520 - climb, 120, { col: r > 0 ? RED : '#2B2B2B' });
    ctx.save(); ctx.translate(1490, 280); drawIcon(ctx, 'flag', 110); ctx.restore();
  }, { dur: 0.8 }),
  T(45.2, 1300, 720, '더 나은 삶', 44, { w: 800 }),
  T(47.6, 1060, 490, '무엇부터?', 36, { w: 800, col: RED, align: 'right' }),
]);
// 10. Chapter 1
sc(49.7, [Ch(49.7, '01', '목표를 구체적으로 정해라', 'target')]);
// 11. 왜 부자가 되고 싶으세요?  "돈이 많으면 좋잖아요"
sc(52.3, [
  Pe(52.3, 480, 680, 300),
  Bu(52.3, 600, 560, '왜 부자가 되고 싶으세요?', { dir: 'r', lift: 160, out: 57.65 }),
  Pe(54.6, 1440, 680, 300, { col: '#555' }),
  Bu(54.6, 1320, 560, '"돈이 많으면 좋잖아요"', { dir: 'l', lift: 20 }),
  Ck(56.15, 1210, 480, 32),
  Bu(57.65, 600, 560, '한 번만 {더} 생각해 볼까요?', { dir: 'r', lift: 160 }),
]);
// 12. 돈이 많아지면 무엇이 달라졌으면?
sc(60.45, [
  Ic(60.45, 'moneybag', 790, 260, 150),
  T(60.7, 1040, 260, '→  무엇이 달라질까?', 50, { w: 800, align: 'center' }),
  Cd(64.15, 560, 620, 320, 300, 'parents', '부모님 생활비', { is: 150 }),
  Cd(66.45, 960, 620, 320, 300, 'airplane', '가족 여행', { is: 150 }),
  Cd(68.55, 1360, 620, 320, 300, 'clock', '일하는 시간 ↓', { is: 140 }),
]);
// 13. 이유가 달라지면 필요한 돈도, 준비도 다르다
sc(70.65, [
  L(70.65, 960, 170, '이유가 달라지면'),
  ...[[560, 'envelope', 2], [960, 'airplane', 4], [1360, 'clock', 6]].flatMap(([x, ic, n], i) => [
    Ic(70.65 + i * 0.25, ic, x, 330, 120),
    Ar(71.3 + i * 0.25, x, 410, x, 540, { dur: 0.35 }),
    Fn(71.6 + i * 0.25, (ctx, p, t) => { const m = Math.round(lerp(0, n, ease.out(p))); for (let j = 0; j < m; j++) { ctx.save(); ctx.translate(x + (j % 2) * 6, 740 - j * 24); ctx.strokeStyle = INK; ctx.lineWidth = 3; rr(ctx, -50, -11, 100, 22, 11); ctx.fillStyle = j === m - 1 ? REDL : PAPER; ctx.fill(); ctx.stroke(); ctx.restore(); } }, { dur: 1.2 }),
  ]),
  T(72.6, 960, 860, '필요한 돈도, 준비할 일도 {다르다}', 44, { w: 800 }),
]);
// 14. 가족 여행: 언제 → 어디로 → 얼마
sc(74.8, [
  Ic(74.8, 'family', 860, 280, 170),
  Ic(75.1, 'airplane', 1070, 260, 140),
  Cd(78.4, 560, 620, 300, 280, 'calendar', '언제', { is: 130 }),
  Ar(79.0, 730, 620, 790, 620, { dur: 0.3 }),
  Cd(79.2, 960, 620, 300, 280, 'pin', '어디로', { is: 130 }),
  Ar(81.0, 1130, 620, 1190, 620, { dur: 0.3 }),
  Cd(81.1, 1360, 620, 300, 280, 'piggy', '얼마 모을지', { is: 140, col: RED }),
]);
// 15. 일하는 시간 줄이기
sc(84.25, [
  L(84.25, 960, 170, '일하는 시간을 줄이고 싶다면'),
  Fn(84.25, clockShrink(640, 520, 190, 84.25), { dur: 0.5 }),
  Ar(86.8, 880, 520, 1080, 520, { dur: 0.4 }),
  Ic(87.0, 'house', 1300, 500, 230),
  Ck(87.9, 1410, 390, 34),
  T(87.4, 1300, 720, '덜 일해도 생활할 방법', 44, { w: 800 }),
]);
// 16. 같은 "돈을 더 벌고 싶다"
sc(91.0, [
  Pe(91.0, 560, 600, 250),
  Bu(91.0, 560, 470, '"돈을 더 벌고 싶다"', { dir: 'u', lift: 10 }),
  Pe(91.4, 1360, 600, 250, { col: '#555' }),
  Bu(91.4, 1360, 470, '"돈을 더 벌고 싶다"', { dir: 'u', lift: 10 }),
  Cd(93.5, 560, 820, 330, 100, null, '저축 계획 세우기', { size: 34 }),
  Cd(93.8, 1360, 820, 330, 100, null, '수입 구조 바꾸기', { size: 34 }),
  T(93.9, 960, 820, '≠', 90, { col: RED, w: 500 }),
]);
// 17. 목표가 없으면 → 계속 부족
sc(95.65, [
  L(95.65, 960, 170, '목표가 없으면'),
  Ic(95.65, 'targetDashed', 960, 480, 240, { out: 97.2 }),
  Fn(97.2, glassGrow(960, 470, 97.4), { dur: 0.4 }),
  T(97.6, 960, 790, '벌어도 계속 {부족하다}', 50, { w: 800 }),
]);
// 18. 500만 → 1,000만 → 그 이상
sc(100.1, [
  Fn(100.1, stairs(100.1), { dur: 0.4 }),
  Pe(100.1, 540, 730, 160, { col: RED, nobob: true, move: { at: 103.55, dx: 400, dy: -120, dur: 0.9 } }),
  T(100.3, 540, 870, '월 500만', 40, { w: 800, col: RED, out: 103.55 }),
  T(104.3, 940, 750, '월 1,000만', 40, { w: 800, col: RED }),
  Pe(100.9, 940, 610, 160, { col: '#777', nobob: true, out: 103.55 }),
  T(101.1, 940, 450, '월 1,000만', 40, { w: 800, out: 103.55 }),
  Pe(103.9, 1360, 490, 160, { col: '#777', nobob: true }),
  T(104.1, 1360, 330, '그 이상…', 40, { w: 800 }),
]);
// 19. 남을 볼 때마다 목표가 바뀐다
sc(107.15, [
  L(107.15, 960, 160, '남을 볼 때마다'),
  Pe(107.15, 960, 700, 220, { col: RED }),
  ...[[460, 560], [720, 400], [1200, 400], [1460, 560]].map(([x, y], i) => Pe(107.3 + i * 0.12, x, y, 150, { col: '#A8A8A8' })),
  Fn(107.15, targetJump([[460, 430], [720, 270], [1200, 270], [1460, 430]], 107.15, 0.95)),
  T(108.2, 960, 860, '목표가 {계속 바뀐다}', 46, { w: 800 }),
]);
// 20. 가족과의 시간 vs 수입
sc(111.05, [
  L(111.05, 960, 170, '처음 원했던 것은 가족과의 시간'),
  Fn(111.05, seesaw(111.05, 114.6), { dur: 0.5 }),
  T(118.0, 960, 290, '수입 ↑   원하는 삶 {↓}', 52, { w: 800 }),
]);
// 21. "나는 돈을 벌어서 ○○하고 싶다"
sc(121.4, [
  Pe(121.4, 420, 680, 290),
  Bu(121.4, 540, 570, '"얼마를 벌고 싶다"', { dir: 'r', lift: 200, dim: 123.7, tailOut: 123.7 }),
  Bu(123.7, 540, 570, '"나는 돈을 벌어서 {○○}하고 싶다"', { dir: 'r', lift: 30, size: 44 }),
  Fn(125.45, blankCycle(1100, 760, 125.6), { dur: 0.4 }),
]);
// 22. 답이 구체적일수록 선택이 쉬워진다
sc(127.5, [
  L(127.5, 960, 170, '답이 구체적일수록'),
  Ic(127.5, 'target', 960, 500, 260),
  Fn(127.5, (ctx, p, t) => { const q = ease.out(prog(t, 127.9, 0.6)); if (q <= 0) return; const x = lerp(560, 930, q), y = lerp(380, 485, q); ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.lineCap = 'round'; ln(ctx, x - 110, y - 32, x, y); arrowHead(ctx, x, y, 0.28, 22); ctx.restore(); }),
  Cd(128.6, 500, 640, 280, 110, null, '기회 선택 {✓}', { size: 36 }),
  Ic(130.75, 'hourglass' in ICONS ? 'hourglass' : 'clock', 1390, 380, 120),
  Ic(131.0, 'coin', 1400, 600, 110),
  Ar(131.2, 1320, 400, 1110, 470, { col: RED, dur: 0.4 }),
  Ar(131.4, 1330, 590, 1110, 530, { col: RED, dur: 0.4 }),
  T(131.6, 1400, 740, '시간 · 돈 쓰는 곳', 40, { w: 800 }),
]);
// 23. 원하는 삶 ✓ → 돈은 저절로 X
sc(133.95, [
  Ic(133.95, 'flag', 600, 470, 220),
  Ck(134.6, 700, 360, 34),
  T(134.4, 600, 690, '원하는 삶 정하기', 44, { w: 800 }),
  Ar(135.6, 790, 470, 1110, 470, { dash: true }),
  Ic(135.8, 'wallet', 1320, 480, 220),
  Xx(136.6, 1320, 480, 60),
  T(136.4, 1320, 690, '돈이 저절로?', 44, { w: 800, col: RED }),
]);
// 24. 지금 하는 일 + 새로운 수입 파이프
sc(138.85, [
  L(138.85, 960, 170, '필요한 돈을 벌 방법'),
  Fn(138.85, pipes(138.85, 141.6), { dur: 0.5 }),
  Cd(138.85, 560, 330, 260, 150, 'briefcase', null, { is: 90 }),
  T(139.2, 560, 450, '지금 하는 일', 36, { w: 800 }),
  Cd(141.6, 1360, 330, 260, 150, 'question', null, { is: 90, col: RED }),
  T(141.9, 1360, 450, '새로운 수입', 36, { w: 800, col: RED }),
]);
// 25. Chapter 2
sc(145.6, [Ch(145.6, '02', '다른 사람에게 필요한 가치를 찾아라', 'gift')]);
// 26. 같은 방식으로만?
sc(148.75, [
  L(148.75, 960, 170, '돈을 더 벌고 싶을 때'),
  Pe(148.75, 560, 620, 260),
  Ic(148.75, 'briefcase', 780, 690, 140),
  Ic(150.95, 'magnifier', 860, 600, 130),
  T(151.2, 720, 830, '지금 하는 일에서만?', 40, { w: 800 }),
  Ar(153.65, 920, 560, 1240, 340, { dash: true, dur: 0.4 }),
  Ar(153.85, 930, 600, 1240, 560, { dash: true, dur: 0.4 }),
  Ar(154.05, 920, 640, 1240, 780, { dash: true, dur: 0.4 }),
  Bx(153.9, 1360, 330, 160, 110, '?', { size: 54, col: RED }),
  Bx(154.1, 1360, 560, 160, 110, '?', { size: 54, col: RED }),
  Bx(154.3, 1360, 790, 160, 110, '?', { size: 54, col: RED }),
]);
// 27. 빵집 — 손님이 더 와야
sc(156.9, [
  Ic(156.9, 'shop', 720, 520, 340),
  T(157.3, 720, 770, '빵집', 46, { w: 800 }),
  Fn(159.95, barsRise(1320, 300, 159.95), { dur: 0.4 }),
  T(160.4, 1320, 430, '매출 ↑', 40, { w: 800, col: RED }),
  ...[0, 1, 2].map(i => Pe(162.15 + i * 0.3, 1300 + i * 140, 680, 130, { col: '#666', nobob: true, move: { at: 162.3 + i * 0.3, dx: -280, dur: 1.6 } })),
  T(162.6, 1340, 820, '손님이 더 많이!', 40, { w: 800 }),
]);
// 28. 집에서 빵 / 회사 간식 → 제빵 수업, 단체 주문
sc(164.75, [
  Ic(164.75, 'shop', 960, 560, 220),
  Pe(164.75, 400, 620, 210, { acc: 'bun' }),
  Bu(164.9, 400, 500, '"집에서 빵 만들고 싶어요"', { dir: 'u', lift: 10, size: 34, shift: 70 }),
  Ic(168.05, 'building', 1520, 600, 220),
  Bu(168.2, 1520, 470, '"직원 간식을 주문할게요"', { dir: 'u', lift: 10, size: 34, shift: -70 }),
  Ar(170.7, 860, 660, 520, 780, { col: RED, dur: 0.45 }),
  Ar(170.9, 1060, 660, 1400, 780, { col: RED, dur: 0.45 }),
  Cd(171.1, 520, 830, 260, 90, null, '제빵 수업', { size: 36, col: RED }),
  Cd(171.4, 1400, 830, 260, 90, null, '단체 주문', { size: 36, col: RED }),
]);
// 29. 같은 능력, 다른 대상
sc(173.85, [
  L(173.85, 960, 170, '같은 빵 만드는 능력이라도'),
  Ic(173.85, 'bread', 960, 340, 190),
  Ar(175.8, 900, 440, 600, 560, { dur: 0.4 }), Ar(175.9, 960, 450, 960, 540, { dur: 0.4 }), Ar(176.0, 1020, 440, 1320, 560, { dur: 0.4 }),
  Cd(175.8, 560, 680, 280, 230, 'people', '가게 손님', { is: 100 }),
  Cd(176.1, 960, 680, 280, 230, 'chefhat', '제빵 수업', { is: 100 }),
  Cd(176.4, 1360, 680, 280, 230, 'boxes', '단체 주문', { is: 100 }),
  T(177.2, 960, 860, '{누구에게} 무엇을 해주느냐', 40, { w: 800 }),
]);
// 30. 직장인 엑셀 vs 가게 사장님
sc(179.3, [
  L(179.3, 960, 170, '직장인도 마찬가지'),
  Pe(179.3, 480, 640, 250, { acc: 'tie' }),
  Ic(180.8, 'sheet', 700, 700, 150),
  Bu(181.3, 480, 500, '익숙한 일 {✓}', { dir: 'u', think: true, size: 38 }),
  Pe(184.9, 1440, 640, 250, { acc: 'apron' }),
  Ic(185.2, 'receipts', 1220, 700, 150),
  Bu(185.6, 1440, 500, '"매출·비용 정리 어려워요"', { dir: 'u', size: 34, shift: -80 }),
  T(189.1, 960, 470, '⇄', 90, { col: RED, w: 600 }),
  T(189.3, 960, 860, '내게 쉬운 일 = 누군가의 {큰 고민}', 42, { w: 800 }),
]);
// 31. 능력이 문제를 해결할 때 → 가치
sc(192.4, [
  Fn(192.4, puzzleSlide(192.4, 196.05), { dur: 0.4 }),
  T(196.4, 1240, 160, '돈이 되는 {가치}', 46, { w: 800 }),
]);
// 32. 질문을 바꿔라
sc(199.05, [
  L(199.05, 960, 150, '새로운 기회를 찾으려면'),
  Pe(199.05, 420, 690, 290),
  Bu(201.2, 540, 580, '"뭘 해야 돈을 많이 벌까?"', { dir: 'r', lift: 300, size: 38, dim: 205.9, tailOut: 205.9 }),
  Bu(205.9, 540, 580, '"사람들은 어떤 일로 {불편해할까}?"', { dir: 'r', lift: 160, size: 40, tailOut: 208.0 }),
  Bu(208.0, 540, 580, '"그중 {내가 도와줄 수 있는} 건 뭘까?"', { dir: 'r', lift: 20, size: 40 }),
]);
// 33. 다른 분야 사람들의 고민
sc(210.8, [
  L(210.8, 960, 160, '다른 분야의 이야기를 들어보세요'),
  Pe(210.8, 960, 720, 230, { col: RED }),
  ...[[420, 560, 'hat'], [760, 420, 'tie'], [1160, 420, 'apron'], [1500, 560, 'old']].flatMap(([x, y, acc], i) => [
    Ar(211.0 + i * 0.15, 960, 610, x + (x < 960 ? 90 : -90), y + 10, { dash: true, col: PGRAY, dur: 0.4 }),
    Pe(211.0 + i * 0.15, x, y, 170, { acc, col: '#666' }),
    Bu(213.3 + i * 0.25, x, y - 90, ['😥', '?!', '…', '?'][i] === '😥' ? '고민…' : ['고민…', '?!', '막막…', '어떡하지?'][i], { dir: 'u', think: true, size: 30, pad: 22 }),
  ]),
]);
// 34. 내 경험 → 누군가의 도움
sc(215.8, [
  Ic(215.8, 'backpack', 600, 470, 240),
  T(216.1, 600, 680, '내게 당연한 경험', 44, { w: 800 }),
  Ar(217.3, 800, 470, 1120, 470, { col: RED }),
  Ic(217.55, 'helphand', 1320, 470, 240),
  T(217.9, 1320, 680, '누군가에겐 {필요한 도움}', 44, { w: 800 }),
]);
// 35. 아이디어 → 확인 → 돈
sc(220.35, [
  Ic(220.35, 'bulb', 360, 500, 180),
  T(220.6, 360, 690, '아이디어', 40, { w: 800 }),
  Ar(222.35, 470, 500, 1420, 500, { dash: true, dur: 0.6 }),
  Ic(222.35, 'coin', 1560, 500, 170),
  Xx(222.9, 960, 400, 46, { out: 224.05 }),
  T(223.1, 960, 330, '바로 돈이 되지는 않는다', 40, { w: 800, col: RED, out: 224.05 }),
  Cd(224.05, 790, 500, 260, 260, 'people', '필요한 사람?', { is: 120, check: 225.2 }),
  Cd(226.15, 1150, 500, 260, 260, 'wallet', '돈 낼 만큼?', { is: 120, check: 227.4 }),
  T(224.4, 960, 760, '먼저 {확인}하기', 44, { w: 800 }),
]);
// 36. 쳇바퀴 — 더 많이 일하기 ≠ 유일한 방법
sc(228.45, [
  Fn(228.45, hamster(720, 470, 250, 228.45), { dur: 0.5 }),
  T(228.8, 1340, 440, '지금 일을 더 많이', 52, { w: 800 }),
  T(231.75, 1340, 560, '≠ {유일한 방법}', 52, { w: 800, ul: 232.3 }),
]);
// 37. 이미 가진 능력 → 새로운 수입 기회
sc(234.3, [
  Ic(234.3, 'toolbox', 600, 480, 240),
  T(234.6, 600, 690, '이미 가진 능력', 44, { w: 800 }),
  Ar(236.2, 790, 480, 1110, 480, { col: RED }),
  Ic(236.5, 'door', 1320, 470, 260),
  T(236.8, 1320, 690, '새로운 수입 {기회}', 44, { w: 800 }),
]);
// 38. 생각만으로는 X → 직접 해보기
sc(239.4, [
  Pe(239.4, 480, 680, 290),
  Bu(239.4, 600, 560, '새로운 방법!', { icon: 'bulb', think: true, dir: 'r', lift: 150, size: 42 }),
  Ic(241.9, 'coin', 1420, 520, 170, { out: 244.1 }),
  Xx(242.3, 1420, 520, 60, { out: 244.1 }),
  T(242.2, 1420, 700, '생각만으로는 X', 42, { w: 800, col: RED, out: 244.1 }),
  Ic(244.3, 'flask', 1420, 500, 220),
  Ck(245.0, 1520, 400, 34),
  T(244.6, 1420, 700, '직접 해보며 {확인}', 44, { w: 800 }),
]);
// 39. 배우기 · 상품 만들기에 돈 → 시도할 돈 준비
sc(246.8, [
  L(246.8, 960, 190, '시도하는 데도 돈이 필요하다'),
  Cd(246.8, 560, 540, 300, 300, 'book', '새로 배우기', { is: 140 }),
  Ic(247.6, 'coin', 690, 400, 70),
  Cd(249.25, 960, 540, 300, 300, 'product', '상품 만들기', { is: 140 }),
  Ic(250.0, 'coin', 1090, 400, 70),
  Cd(252.6, 1360, 540, 300, 300, 'sprout', '시도할 돈 준비', { is: 140, col: RED }),
]);
// 40. 돈+아이디어 있어도 수입은 저절로 X
sc(256.65, [
  Ic(256.65, 'bulb', 420, 480, 170), Ck(257.3, 500, 390, 28),
  T(256.9, 610, 480, '+', 70, { w: 500 }),
  Ic(256.9, 'coins', 790, 490, 170), Ck(257.6, 880, 390, 28),
  Ar(259.65, 960, 480, 1220, 480, { dash: true }),
  Bx(259.8, 1420, 480, 260, 200, '수입?', { size: 46, col: RED, cross: 260.8 }),
  T(260.4, 960, 760, '저절로 수입이 되지 않는다', 44, { w: 800 }),
]);
// 41. 알리고 → 돈 버는 방법
sc(262.15, [
  Ic(262.15, 'megaphone', 500, 480, 230),
  T(262.5, 500, 690, '필요한 사람에게 {알리기}', 40, { w: 800 }),
  Ic(263.0, 'people', 980, 470, 220),
  Ar(265.05, 1130, 480, 1300, 480, { col: RED, dur: 0.35 }),
  Ic(265.05, 'coins', 1450, 470, 200),
  T(265.4, 1450, 690, '돈 버는 {방법}', 40, { w: 800 }),
]);
// 42. Chapter 3
sc(267.8, [Ch(267.8, '03', '가치를 돈으로 바꾸는 기술을 배워라', 'exchange')]);
// 43. 일을 잘하는 것 ≠ 돈을 버는 것
sc(270.75, [
  Ic(270.75, 'exclaim', 960, 300, 120),
  L(270.9, 960, 410, '알아야 할 한 가지'),
  Cd(272.9, 560, 610, 360, 300, 'medal', '일을 잘하는 것', { is: 140 }),
  T(274.5, 960, 600, '≠', 140, { col: RED, w: 500 }),
  Cd(274.6, 1360, 610, 360, 300, 'coins', '돈을 버는 것', { is: 140, col: RED }),
]);
// 44. 섬: 능력 ↔ 필요한 사람
sc(277.3, [Fn(277.3, islands(277.3, 280.85), { dur: 0.5 })]);
// 45. 내게 부족한 것은?
sc(283.1, [
  T(283.1, 960, 200, '무조건 더 일하기', 46, { w: 800, col: GRAY, strike: 283.9 }),
  T(284.95, 960, 300, '내게 {부족한 것}은?', 54, { w: 800 }),
  Cd(287.55, 560, 600, 320, 300, 'megaphone', '나를 알리는 법', { is: 140 }),
  Cd(289.95, 960, 600, 320, 300, 'presenter', '능력 설명하는 법', { is: 140 }),
  Cd(292.15, 1360, 600, 320, 300, 'searchpeople', '필요를 찾는 법', { is: 140 }),
]);
// 46. 배우기 → 작게 시도 → 반응 → 고치기
sc(295.35, [Fn(295.35, cycle(295.35, [295.35, 296.4, 297.8, 298.8], [['book', '배우기'], ['flask', '작게 시도'], ['chat', '반응 보기'], ['wrench', '고치기']]), { dur: 0.5 })]);
// 47. 콘텐츠로 보여주기
sc(300.65, [
  L(300.65, 960, 170, '알리는 방법이 부족하다면'),
  Ic(300.65, 'megaphone', 960, 480, 220, { out: 303.5 }),
  Cd(303.9, 560, 520, 300, 300, 'book', '지식 · 기술', { is: 140 }),
  Ar(305.45, 730, 520, 790, 520, { dur: 0.3 }),
  Cd(303.7, 960, 520, 300, 300, 'monitor', '{콘텐츠}', { is: 150, col: RED }),
  Ar(308.6, 1130, 520, 1190, 520, { dur: 0.3 }),
  Cd(308.8, 1360, 520, 300, 300, 'people', '문제 해결', { is: 140, check: 309.4 }),
]);
// 48. 그중 하나가 유튜브
sc(310.35, [Ic(310.35, 'play', 960, 470, 320), T(310.8, 960, 700, '그중 하나, {유튜브}', 54, { w: 800 })]);
// 49. 깔때기: 관심 → 구체적 도움 → 상품/서비스
sc(312.3, [Fn(312.3, funnel(312.3, 316.05, 318.65), { dur: 0.5 })]);
// 50. 30대 주부 1억 매출
sc(321.4, [
  Pe(321.4, 480, 640, 270, { acc: 'bun' }),
  T(321.7, 480, 830, '30대 주부', 42, { w: 800 }),
  Ic(322.6, 'play', 720, 440, 120),
  Ic(323.4, 'book', 720, 600, 100),
  ...[0, 1, 2, 3].map(i => Pe(325.85 + i * 0.18, 1060 + (i % 2) * 90, 400 + i * 120, 90, { col: '#888', nobob: true, move: { at: 325.9 + i * 0.18, dx: -150, dur: 1.0 } })),
  L(326.4, 1420, 360, '매출'),
  T(326.6, 1420, 500, '1억 원', 150, { w: 400, font: SERIF, col: RED, ul: 327.6, ulCol: RED }),
]);
// 51. 관심 ≠ 반드시 수익
sc(329.9, [
  Ic(329.9, 'exclaim', 960, 470, 170, { out: 332.0 }),
  L(329.9, 960, 640, '그런데 중요한 점', { out: 332.0 }),
  Ic(332.15, 'play', 560, 520, 220),
  Fn(332.4, heartsFloat(560, 460, 332.4)),
  T(332.6, 560, 720, '관심은 모였지만', 42, { w: 800 }),
  Ar(336.0, 760, 520, 1150, 520, { dash: true }),
  Ic(336.0, 'coins', 1360, 520, 200),
  Xx(336.6, 1360, 520, 60),
  T(336.4, 1360, 720, '반드시 {수익}은 아니다', 42, { w: 800 }),
]);
// 52. 누구에게 / 무엇을 / 어떻게 구매로
sc(338.4, [
  Cd(338.4, 560, 540, 300, 300, 'target', '누구에게?', { is: 140 }),
  Ar(340.5, 730, 540, 790, 540, { dur: 0.3 }),
  Cd(340.65, 960, 540, 300, 300, 'gift', '무엇을?', { is: 140 }),
  Ar(342.7, 1130, 540, 1190, 540, { dur: 0.3 }),
  Cd(342.85, 1360, 540, 300, 300, 'cart', '어떻게 구매로?', { is: 140, col: RED }),
]);
// 53. 막상 시작하려면 막막
sc(346.2, [
  L(346.2, 960, 160, '막상 유튜브로 사업을 시작하려면'),
  Pe(346.2, 440, 680, 280),
  Ic(346.5, 'play', 300, 470, 100),
  Bu(349.45, 560, 570, '어떤 경험을 쓰지?', { dir: 'r', lift: 190, think: true, size: 38, tailOut: 352.1, dim: 352.1 }),
  Bu(352.1, 560, 570, '어떤 콘텐츠부터?', { dir: 'r', lift: 30, think: true, size: 38 }),
  Ic(354.1, 'maze', 1400, 500, 300),
  T(354.4, 1400, 720, '{막막}', 54, { w: 800 }),
]);
// 54. 사람마다 다르다
sc(355.55, [
  L(355.55, 960, 170, '사람마다 다르다'),
  ...[[560, 'book'], [960, 'toolbox'], [1360, 'laptop']].flatMap(([x, ic], i) => [
    Pe(355.55 + i * 0.2, x, 620, 220, { col: i === 1 ? RED : '#2B2B2B' }),
    Ic(355.9 + i * 0.25, ic, x, 380, 120),
  ]),
  Fn(357.75, readiness(357.75, [560, 960, 1360], [0.35, 0.7, 0.5])),
  L(357.9, 960, 880, '준비된 정도', { size: 30 }),
]);
// 55. 무작정 영상 X → 내 위치 먼저
sc(359.8, [
  Ic(359.8, 'camera', 560, 480, 240),
  Xx(360.4, 560, 480, 70),
  T(360.2, 560, 690, '무작정 영상 만들기', 42, { w: 800, col: GRAY }),
  Fn(362.3, mapHere(1300, 470, 362.3), { dur: 0.6 }),
  T(364.8, 1300, 720, '내 상황 {먼저 확인}', 46, { w: 800, ul: 365.3 }),
]);
// 56. 고정 댓글 → 질문 답하기 → 기초 진단표
sc(366.5, [
  Fn(366.5, commentCard(960, 300, 860, 366.5, 367.2), { dur: 0.5 }),
  Cd(369.6, 640, 680, 320, 260, 'form', '질문 답하고 신청', { is: 120, check: 371.8 }),
  Ar(372.5, 820, 680, 1100, 680, { col: RED }),
  Cd(372.85, 1280, 680, 320, 260, 'report', '{기초 진단표}', { is: 130, col: RED }),
]);
// 57. 마무리 — 고정 댓글에서 내 상황부터
sc(376.45, [
  Pe(376.45, 440, 680, 280),
  Bu(376.45, 560, 570, '어디서부터 시작하지?', { icon: 'maze', think: true, dir: 'r', lift: 170, size: 38 }),
  Fn(381.45, commentCard(1300, 590, 640, 381.45, 381.8), { dur: 0.5 }),
  T(383.25, 1300, 810, '{내 상황}부터 확인해 보세요', 46, { w: 800, ul: 383.7 }),
]);
