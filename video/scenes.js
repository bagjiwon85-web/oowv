// Scene definitions. Each scene spans cues [a..b]; element timing uses `c` (absolute cue index) + `d` (delay seconds).
// Every scene uses its own composition; photos sit underneath at 30% opacity with a slow zoom.
const cx = 960;
const T = (s, x, y, size, o = {}) => ({ k: 'text', s, x, y, size, ...o });
const TL = (s, x, y, size, o = {}) => T(s, x, y, size, { align: 'left', ...o });
const ico = (name, x, y, size, o = {}) => ({ k: 'icon', name, x, y, size, ...o });
const sil = (kind, x, y, h, o = {}) => ({ k: 'sil', kind, x, y, h, ...o });
const photo = (src, o = {}) => ({ k: 'photo', src, ...o });
const ln = (x, y, dx, dy, o = {}) => ({ k: 'line', x, y, dx, dy, ...o });
const arrow = (x, y, dx, dy, o = {}) => ln(x, y, dx, dy, { arrow: true, lw: 4, ...o });
const panel = (x, y, w, h, o = {}) => ({ k: 'panel', x, y, w, h, ...o });
const rect = (x, y, w, h, o = {}) => ({ k: 'rect', x, y, w, h, ...o });
const chip = (s, x, y, o = {}) => ({ k: 'chip', s, x, y, ...o });
const bubble = (s, x, y, o = {}) => ({ k: 'bubble', s, x, y, ...o });
const strike = (x, y, w, o = {}) => ({ k: 'strike', x, y, w, ...o });
const uline = (x, y, w, o = {}) => ({ k: 'underline', x, y, w, ...o });
const num = (s, x, y, size, o = {}) => ({ k: 'num', s, x, y, size, ...o });
const ring = (x, y, r, o = {}) => ({ k: 'ring', x, y, r, ...o });
const cust = (x, y, draw, o = {}) => ({ k: 'custom', x, y, draw, ...o });
const tag = (s, x, y, o = {}) => TL(s, x, y, 26, { color: RED, ls: 6, weight: 700, ...o }); // small letter-spaced label

// Chapter title: huge outlined number on the left, title on the right
function chapter(n, kicker, title, c) {
  return { c: [c, c], els: [
    num(n, 560, 470, 560, { c, outline: 3, color: WHITE, anim: 'slide' }),
    panel(1120, 470, 6, 260, { c, d: 0.2, color: RED, anim: 'wipeUp' }),
    tag(kicker, 1170, 380, { c, d: 0.3 }),
    TL(title, 1170, 490, 66, { c, d: 0.45, lh: 1.25 }),
  ] };
}

const SCENE_DEFS = [
  // editorial title over money photo
  { c: [0, 0], els: [
    photo('money'),
    tag('WEALTH', 200, 330, { c: 0 }),
    TL('우리는 보통', 200, 420, 64, { c: 0, d: 0.1, weight: 300 }),
    TL('{부자}가 되고 싶을 때', 200, 530, 120, { c: 0, d: 0.3 }),
    uline(470, 640, 540, { c: 0, d: 0.8 }),
  ] },
  // giant outline word filled by red
  { c: [1, 1], els: [
    T('어떻게 하면 돈을', cx, 230, 56, { c: 1, weight: 300 }),
    T('더 많이', cx, 450, 260, { c: 1, d: 0.1, outline: 4, anim: 'grow' }),
    T('{더 많이}', cx, 450, 260, { c: 1, d: 0.6, anim: 'wipe', cw: 1100, ch: 300, wdur: 1.2 }),
    T('벌 수 있을지 고민합니다', cx, 680, 56, { c: 1, d: 0.9 }),
  ] },
  // three silhouettes on a floor line, tags on stems
  { c: [2, 3], els: [
    ln(260, 760, 1400, 0, { c: 2, color: LINE, draw: 0.9 }),
    sil('suit', 560, 760, 380, { c: 2 }), ln(560, 340, 0, -70, { c: 2, d: 0.3 }), chip('월급 높이기', 560, 230, { c: 2, d: 0.4 }),
    sil('man', 960, 760, 380, { c: 2, d: 1.1 }), ln(960, 340, 0, -70, { c: 2, d: 1.3 }), chip('일 더 많이 하기', 960, 230, { c: 2, d: 1.4 }),
    sil('woman', 1360, 760, 380, { c: 3, color: RED }), ln(1360, 340, 0, -70, { c: 3, d: 0.2 }), chip('좋은 투자처 찾기', 1360, 230, { c: 3, d: 0.3, hl: true }),
  ] },
  // split: huge red word left, supporting copy right
  { c: [4, 4], els: [
    T('{중요}', 600, 470, 300, { c: 4, anim: 'slide' }),
    panel(960, 470, 3, 420, { c: 4, d: 0.2, color: LINE, anim: 'wipeUp' }),
    TL('물론,', 1060, 380, 48, { c: 4, d: 0.3, color: GREY }),
    TL('돈을 많이 버는 것도', 1060, 470, 64, { c: 4, d: 0.45 }),
    TL('중요합니다', 1060, 560, 64, { c: 4, d: 0.6 }),
  ] },
  // typographic equation with a rising line behind
  { c: [5, 6], els: [
    cust(0, 0, k => { ctx.strokeStyle = '#2A2A2A'; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= 60; i++) { const x = 200 + i * 25.3, y = 700 - Math.pow(i / 60, 1.6) * 420 * easeOut(k / 1.6); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }, { c: 5 }),
    T('수입 ↑', 520, 470, 140, { c: 5, d: 0.1 }),
    T('=', cx, 470, 160, { c: 6, color: GREY, out: 0.6 }),
    T('{≠}', cx, 470, 160, { c: 6, d: 0.5, anim: 'pop' }),
    T('부자', 1400, 470, 140, { c: 6, d: 0.2 }),
  ] },
  // timeline: income walks right while "the life you want" drifts further
  { c: [7, 7], els: [
    photo('family_beach', { fy: 0.55 }),
    ln(200, 520, 1520, 0, { c: 7, color: '#666', draw: 0.8 }),
    cust(0, 0, k => { const x = 300 + 500 * easeInOut((k - 0.4) / 2.2); ctx.fillStyle = WHITE; circle(x, 520, 16); ctx.fill(); drawRich('수입', x, 590, 44); }, { c: 7 }),
    cust(0, 0, k => { const x = 1000 + 560 * easeInOut((k - 0.4) / 2.4); ctx.fillStyle = RED; circle(x, 520, 16); ctx.fill(); drawRich('원하는 삶', x, 590, 44);
      const xi = 300 + 500 * easeInOut((k - 0.4) / 2.2); ctx.strokeStyle = RED; ctx.lineWidth = 3; line(xi + 30, 450, x - 30, 450); line(xi + 30, 438, xi + 30, 462); line(x - 30, 438, x - 30, 462); }, { c: 7, d: 0.2 }),
    T('정작 원하는 삶과는 {멀어질 수 있다}', cx, 330, 62, { c: 7, d: 1.2 }),
  ] },
  // spotlight on a worker
  { c: [8, 8], els: [
    photo('overtime', { fx: 0.6 }),
    cust(cx, 0, k => { const r = lerp(700, 330, easeInOut(k / 1.4)); const g = ctx.createRadialGradient(0, 560, r * 0.6, 0, 560, r);
      g.addColorStop(0, 'rgba(255,255,255,0.10)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(-960, 0, 1920, 1080); }, { c: 8 }),
    sil('suit', cx, 820, 520, { c: 8, d: 0.1 }),
    TL('지금 하는 일에만', 180, 470, 60, { c: 8, d: 0.3 }),
    T('{집중}', 1550, 470, 130, { c: 8, d: 0.5 }),
  ] },
  // grid of "opportunity" dots switching off
  { c: [9, 9], els: [
    cust(0, 0, k => { for (let r = 0; r < 4; r++) for (let q = 0; q < 12; q++) {
      const i = r * 12 + q, off = k > 0.6 + ((i * 37) % 48) / 22; ctx.fillStyle = off ? '#2A2A2A' : (i % 7 === 3 ? RED : WHITE);
      circle(410 + q * 100, 200 + r * 90, 14); ctx.fill(); } }, { c: 9 }),
    TL('새로운 수입을 만들', 410, 640, 56, { c: 9, d: 0.4 }),
    TL('기회를 {놓칠 수도}', 410, 740, 80, { c: 9, d: 0.6 }),
  ] },
  // two-column table: what I have / what I don't know
  { c: [10, 11], els: [
    TL('가진 것', 300, 250, 34, { c: 10, color: GREY }), ln(300, 290, 580, 0, { c: 10, color: WHITE, lw: 2 }),
    ico('star', 340, 400, 80, { c: 10, d: 0.3 }), TL('좋은 능력', 410, 400, 64, { c: 10, d: 0.4 }),
    TL('모르는 것', 1040, 250, 34, { c: 11, color: GREY }), ln(1040, 290, 580, 0, { c: 11, color: RED, lw: 2 }),
    ico('question', 1080, 400, 90, { c: 11, d: 0.3 }), TL('돈 버는 방법', 1150, 400, 64, { c: 11, d: 0.4 }),
    TL('능력이 있어도 돈 버는 건 {별개의 문제}', 300, 640, 52, { c: 11, d: 1.0 }),
  ] },
  // giant red question mark cropped on the right
  { c: [12, 12], els: [
    T('?', 1580, 520, 900, { c: 12, color: RED, anim: 'grow' }),
    TL('부자가 되기 위해', 200, 300, 54, { c: 12, d: 0.2, color: GREY }),
    TL('우리는 무엇을', 200, 410, 90, { c: 12, d: 0.4 }),
    TL('{다르게}', 200, 530, 120, { c: 12, d: 0.6 }),
    TL('준비해야 할까요?', 200, 660, 90, { c: 12, d: 0.8 }),
  ] },
  // three tall numbered columns
  { c: [13, 14], els: [
    T('부자가 되고 싶다면 {반드시} 알아야 할', cx, 190, 54, { c: 13 }),
    ...[0, 1, 2].map(i => rect(560 + i * 400, 540, 320, 460, { c: 14, d: i * 0.2, color: i === 2 ? RED : '#555', lw: 3, anim: 'wipeUp', ch: 460, cw: 320 })),
    ...[0, 1, 2].map(i => num(`0${i + 1}`, 560 + i * 400, 500, 170, { c: 14, d: 0.3 + i * 0.2, color: i === 2 ? RED : WHITE })),
    ...['목표', '가치', '기술'].map((s, i) => T(s, 560 + i * 400, 680, 48, { c: 14, d: 0.5 + i * 0.2, color: GREY })),
  ] },
  // video player scrubbing to the end + checklist
  { c: [15, 18], els: [
    rect(560, 470, 760, 430, { c: 15, color: '#666', lw: 2, fill: '#0C0C0C' }),
    ico('play', 560, 440, 130, { c: 15, d: 0.2, accent: '#333' }),
    { k: 'hbar', x: 560, y: 650, w: 680, h: 8, c: 15, d: 0.2, fdur: 1.3 },
    ...['지금 내가 놓치고 있는 것', '경제적으로 더 나은 삶', '무엇부터 바꿔야 할지'].flatMap((s, i) => [
      rect(1060, 330 + i * 140, 44, 44, { c: 16 + i, color: WHITE, lw: 3 }),
      ico('check', 1062, 328 + i * 140, 52, { c: 16 + i, d: 0.4 }),
      TL(s, 1110, 330 + i * 140, 46, { c: 16 + i, d: 0.1 }),
    ]),
  ] },
  chapter('01', 'POINT ONE', '목표를\n구체적으로 정해라', 19),
  // city photo, "왜" huge
  { c: [20, 20], els: [
    photo('city_night', { fy: 0.6 }),
    T('{왜}', 470, 470, 380, { c: 20, anim: 'grow' }),
    TL('여러분은', 820, 380, 54, { c: 20, d: 0.2, color: GREY }),
    TL('부자가', 820, 480, 96, { c: 20, d: 0.35 }),
    TL('되고 싶으신가요?', 820, 590, 96, { c: 20, d: 0.5 }),
  ] },
  // person + speech bubble, then a stamp
  { c: [21, 22], els: [
    sil('woman', 620, 820, 520, { c: 21 }),
    bubble('돈이 많으면\n좋잖아요', 1020, 300, { c: 21, d: 0.25, size: 52 }),
    cust(1420, 620, () => { ctx.rotate(-0.12); ctx.strokeStyle = RED; ctx.lineWidth = 6; rrect(-220, -70, 440, 140, 10); ctx.stroke(); drawRich('{맞는 말입니다}', 0, 4, 64); }, { c: 22, anim: 'pop' }),
  ] },
  // "one more time" with a drawn circle
  { c: [23, 23], els: [
    ring(cx, 420, 270, { c: 23, d: 0.2, lw: 5, draw: 1.0, color: RED }),
    T('한 번만 더', cx, 420, 100, { c: 23 }),
    T('생각해 보세요', cx, 790, 56, { c: 23, d: 0.5, weight: 300 }),
  ] },
  // before / after split screen
  { c: [24, 24], els: [
    panel(480, 470, 960, 780, { c: 24, color: '#111' }),
    tag('NOW', 200, 200, { c: 24, d: 0.1, color: GREY }), T('지금', 480, 260, 70, { c: 24, d: 0.2, color: GREY }),
    sil('man', 480, 780, 380, { c: 24, d: 0.2, color: '#555' }),
    tag('AFTER', 1160, 200, { c: 24, d: 0.6 }), T('돈이 많아지면', 1440, 260, 70, { c: 24, d: 0.7 }),
    sil('man', 1440, 780, 380, { c: 24, d: 0.8 }),
    T('{?}', 1600, 430, 160, { c: 24, d: 1.2 }),
    T('무엇이 달라졌으면 좋겠나요?', 1440, 840, 44, { c: 24, d: 1.4 }),
  ] },
  // photo + numbered editorial list
  { c: [25, 27], els: [
    photo('family_packing', { fx: 0.6 }),
    ...['부모님께 생활비를 드리고 싶다', '가족과 여행을 가고 싶다', '일하는 시간을 줄이고 싶다'].flatMap((s, i) => [
      num(`0${i + 1}`, 260, 300 + i * 190, 90, { c: 25 + i, color: i === 2 ? RED : WHITE, anim: 'slide' }),
      TL(s, 380, 300 + i * 190, 62, { c: 25 + i, d: 0.15, anim: 'slide' }),
      ln(200, 385 + i * 190, 1400, 0, { c: 25 + i, d: 0.1, color: '#333', lw: 2 }),
    ]),
  ] },
  // bar chart with axes
  { c: [28, 28], els: [
    ln(560, 760, 900, 0, { c: 28, color: WHITE, lw: 2 }), ln(560, 760, 0, -540, { c: 28, color: WHITE, lw: 2 }),
    TL('필요한 돈', 590, 220, 34, { c: 28, color: GREY }),
    ...[[700, 180, 'gift', WHITE], [960, 330, 'plane', RED], [1220, 460, 'clock', WHITE]].flatMap(([x, h, ic, col], i) => [
      cust(x, 760, k => { ctx.fillStyle = col; const hh = h * easeOut(k / 0.9); ctx.fillRect(-60, -hh, 120, hh); }, { c: 28, d: 0.3 + i * 0.2 }),
      ico(ic, x, 830, 70, { c: 28, d: 0.3 + i * 0.2 }),
    ]),
    TL('이유가 달라지면\n필요한 돈도,\n준비할 일도\n{달라진다}', 1500, 470, 48, { c: 28, d: 1.2, lh: 1.35 }),
  ] },
  // planning board: family, calendar, map route, savings bar
  { c: [29, 31], els: [
    sil('man', 300, 560, 260, { c: 29 }), sil('woman', 380, 560, 240, { c: 29, d: 0.1 }), sil('child', 450, 560, 260, { c: 29, d: 0.2, color: RED }),
    TL('가족 여행', 230, 640, 48, { c: 29, d: 0.3 }),
    cust(760, 210, k => { ctx.strokeStyle = '#666'; ctx.lineWidth = 2; for (let r = 0; r <= 5; r++) line(0, r * 64, 448, r * 64); for (let q = 0; q <= 7; q++) line(q * 64, 0, q * 64, 320);
      if (k > 0.5) { ctx.strokeStyle = RED; ctx.lineWidth = 5; circle(4 * 64 + 32, 2 * 64 + 32, 26 * easeBack((k - 0.5) / 0.5)); ctx.stroke(); }
      drawRich('언제', 224, -40, 40); }, { c: 30 }),
    cust(1300, 210, k => { ctx.strokeStyle = '#444'; ctx.lineWidth = 2; ctx.strokeRect(0, 0, 400, 320);
      ctx.setLineDash([10, 10]); ctx.strokeStyle = WHITE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, 280);
      const e = easeInOut(k / 1.4); ctx.bezierCurveTo(140, 280 - 160 * e, 220, 40 + 200 * (1 - e), 40 + 300 * e, 80 + 200 * (1 - e)); ctx.stroke(); ctx.setLineDash([]);
      drawRich('어디로', 200, -40, 40); if (k > 1.3) { ctx.save(); ctx.translate(340, 70); ctx.scale(0.6, 0.6); ICONS.pin(WHITE, RED); ctx.restore(); } }, { c: 30, d: 0.5 }),
    TL('얼마를 모아야 할까', 760, 720, 44, { c: 31 }),
    { k: 'hbar', x: 1230, y: 800, w: 940, h: 22, v: 0.68, c: 31, d: 0.2, fdur: 1.8 },
  ] },
  // analog clock with shrinking work arc
  { c: [32, 33], els: [
    cust(600, 470, k => { ctx.strokeStyle = WHITE; ctx.lineWidth = 4; circle(0, 0, 250); ctx.stroke();
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.lineWidth = i % 3 ? 3 : 6; line(Math.cos(a) * 220, Math.sin(a) * 220, Math.cos(a) * 240, Math.sin(a) * 240); }
      const f = lerp(0.75, 0.42, easeInOut((k - 0.6) / 1.6)); ctx.fillStyle = 'rgba(232,51,42,0.85)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 200, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = WHITE; ctx.lineWidth = 8; const ha = -Math.PI / 2 + Math.PI * 2 * f; line(0, 0, Math.cos(ha) * 150, Math.sin(ha) * 150); ctx.fillStyle = WHITE; circle(0, 0, 10); ctx.fill(); }, { c: 32, anim: 'grow' }),
    TL('일하는 시간 {↓}', 1000, 360, 72, { c: 32, d: 0.4 }),
    TL('내가 덜 일해도', 1000, 520, 56, { c: 33, color: GREY }),
    TL('생활할 수 있는 방법', 1000, 610, 72, { c: 33, d: 0.2 }),
    uline(1330, 670, 660, { c: 33, d: 0.7, h: 6 }),
  ] },
  // tree diagram: same words, different actions
  { c: [34, 35], els: [
    T('“돈을 더 벌고 싶다”', cx, 190, 64, { c: 34 }),
    ln(cx, 250, 0, 60, { c: 35, color: WHITE }), ln(460, 310, 1000, 0, { c: 35, d: 0.2, color: WHITE }),
    ...[[460, 'man', '여행 자금 모으기'], [cx, 'elder', '부모님 생활비 마련'], [1460, 'woman', '생활비 구조 만들기']].flatMap(([x, k2, s], i) => [
      ln(x, 310, 0, 50, { c: 35, d: 0.4, color: WHITE }),
      sil(k2, x, 640, 250, { c: 35, d: 0.5 + i * 0.15, color: i === 1 ? RED : WHITE }),
      T(s, x, 720, 40, { c: 35, d: 0.6 + i * 0.15 }),
    ]),
  ] },
  // gauge that never reaches "enough"
  { c: [36, 37], els: [
    TL('목표가 없으면', 200, 300, 72, { c: 36 }),
    TL('돈을 벌고도 계속', 200, 440, 56, { c: 37, color: GREY }),
    TL('{부족하다}고 느낀다', 200, 540, 72, { c: 37, d: 0.2 }),
    cust(1360, 640, k => { ctx.lineWidth = 34; ctx.lineCap = 'butt';
      ctx.strokeStyle = '#2A2A2A'; ctx.beginPath(); ctx.arc(0, 0, 300, Math.PI, Math.PI * 1.8); ctx.stroke();
      ctx.strokeStyle = RED; ctx.beginPath(); ctx.arc(0, 0, 300, Math.PI * 1.8, Math.PI * 2); ctx.stroke();
      drawRich('충분', 255, -150, 36);
      const a = Math.PI + Math.PI * (0.55 + 0.2 * Math.sin(k * 2.2)) * easeOut(k / 1);
      ctx.strokeStyle = WHITE; ctx.lineWidth = 8; ctx.lineCap = 'round'; line(0, 0, Math.cos(a) * 250, Math.sin(a) * 250); ctx.fillStyle = WHITE; circle(0, 0, 16); ctx.fill(); }, { c: 36, d: 0.3, anim: 'grow' }),
  ] },
  // staircase of silhouettes looking up
  { c: [38, 39], els: [
    cust(0, 0, k => { ctx.fillStyle = '#1A1A1A'; for (let i = 0; i < 3; i++) { const h = (i + 1) * 170 * easeOut((k - i * 0.15) / 0.7); ctx.fillRect(380 + i * 400, 840 - h, 390, h); } }, { c: 38 }),
    sil('man', 575, 670, 260, { c: 38, d: 0.3 }), T('월 500만 원', 575, 760, 44, { c: 38, d: 0.3 }),
    sil('man', 975, 500, 260, { c: 38, d: 1.0 }), T('월 1,000만 원', 975, 590, 44, { c: 38, d: 1.0 }),
    sil('suit', 1375, 330, 260, { c: 39, d: 0.6, color: RED }), T('{그 이상}', 1375, 420, 44, { c: 39, d: 0.6 }),
    arrow(640, 330, 230, -60, { c: 38, d: 1.6, color: GREY, dash: [8, 10] }), arrow(1040, 170, 230, -40, { c: 39, d: 1.2, color: GREY, dash: [8, 10] }),
  ] },
  // the target hops between other people
  { c: [40, 40], els: [
    ...[300, 620, 940, 1260, 1580].map((x, i) => sil(i % 2 ? 'woman' : 'man', x, 780, 300, { c: 40, d: i * 0.08, color: '#4A4A4A' })),
    cust(0, 0, k => { const pts = [300, 940, 1580, 620, 1260]; const t = Math.max(0, k - 0.5) * 1.1, i = Math.floor(t) % 5, f = easeInOut(t - Math.floor(t));
      const x = lerp(pts[i], pts[(i + 1) % 5], f), y = 380 - Math.sin(f * Math.PI) * 100; ctx.save(); ctx.translate(x, y); ctx.scale(1.1, 1.1); ICONS.target(WHITE, RED); ctx.restore(); }, { c: 40, d: 0.3 }),
    T('남을 볼 때마다 {목표가 바뀐다}', cx, 200, 64, { c: 40, d: 0.6 }),
  ] },
  // crossing line chart over a photo
  { c: [41, 42], els: [
    photo('father_kids'),
    ln(300, 760, 1100, 0, { c: 41, color: WHITE, lw: 2 }), ln(300, 760, 0, -520, { c: 41, color: WHITE, lw: 2 }),
    cust(0, 0, k => { const e = easeInOut((k - 0.3) / 2.8);
      ctx.lineWidth = 6; ctx.strokeStyle = WHITE; ctx.beginPath(); ctx.moveTo(320, 640); ctx.lineTo(320 + 1060 * e, 640 - 380 * e); ctx.stroke();
      ctx.strokeStyle = RED; ctx.beginPath(); ctx.moveTo(320, 300); ctx.lineTo(320 + 1060 * e, 300 + 380 * e); ctx.stroke();
      if (e > 0.05) { drawRich('수입', 320 + 1060 * e + 20, 640 - 380 * e, 40, { align: 'left' }); drawRich('{가족과 함께할 시간}', 320 + 1060 * e + 20, 300 + 380 * e, 40, { align: 'left' }); } }, { c: 41, d: 0.4 }),
    TL('돈을 더 벌수록', 300, 180, 48, { c: 42, color: GREY }),
  ] },
  // road that bends away from the first goal
  { c: [43, 43], els: [
    ico('flag', 300, 640, 150, { c: 43 }), TL('처음 원했던 삶', 220, 760, 44, { c: 43, d: 0.1 }),
    cust(0, 0, k => { const e = easeInOut((k - 0.2) / 2.2); ctx.strokeStyle = WHITE; ctx.lineWidth = 5; ctx.setLineDash([2, 14]); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(380, 640); for (let i = 1; i <= 40 * e; i++) { const t = i / 40; ctx.lineTo(380 + 1300 * t, 640 - 420 * t * t); } ctx.stroke(); ctx.setLineDash([]);
      const t = Math.max(0.02, e); ctx.save(); ctx.translate(380 + 1300 * t, 640 - 420 * t * t); ctx.scale(0.7, 0.7); ICONS.coin(WHITE, RED); ctx.restore(); }, { c: 43, d: 0.3 }),
    TL('수입은 늘어도', 200, 230, 52, { c: 43, d: 1.2, color: GREY }),
    TL('처음 원했던 삶에서는 {멀어진다}', 200, 330, 80, { c: 43, d: 1.4 }),
  ] },
  // notebook: fill in the blank
  { c: [44, 46], els: [
    cust(0, 0, () => { ctx.strokeStyle = '#1E1E1E'; ctx.lineWidth = 2; for (let y = 180; y < 860; y += 70) line(160, y, 1760, y); ctx.strokeStyle = 'rgba(232,51,42,0.4)'; line(260, 140, 260, 880); }, { c: 44 }),
    TL('“얼마를 벌고 싶다”', 320, 250, 54, { c: 44, color: GREY }), TL('{+}', 860, 250, 60, { c: 44, d: 0.4 }),
    TL('이 문장도 완성해 보세요', 320, 390, 54, { c: 45 }),
    TL('나는 돈을 벌어서', 320, 600, 84, { c: 46, type: true, cps: 18 }),
    cust(1060, 600, k => { const w = 300; ctx.fillStyle = RED; ctx.fillRect(0, 44, w * easeOut(k / 0.5), 8);
      if (Math.floor(k * 2.4) % 2 === 0) ctx.fillRect(16, -40, 5, 80); drawRich('○○', w / 2, 0, 80, { color: '#666' }); }, { c: 46, d: 0.5 }),
    TL('하고 싶다', 1400, 600, 84, { c: 46, d: 0.8 }),
  ] },
  // focus pull on a target, two decisions get easier
  { c: [47, 48], els: [
    cust(560, 470, k => { ctx.filter = `blur(${(1 - easeInOut((k - 0.2) / 1.8)) * 18}px)`; ctx.scale(3.6, 3.6); ICONS.target(WHITE, RED); ctx.filter = 'none'; }, { c: 47 }),
    TL('답이 {구체적}일수록', 1000, 260, 64, { c: 47, d: 0.3 }),
    ...['어떤 기회를 선택할지', '시간과 돈을 어디에 쓸지'].flatMap((s, i) => [
      ico('check', 1040, 450 + i * 130, 56, { c: 48, d: i * 0.4 }), TL(s, 1100, 450 + i * 130, 52, { c: 48, d: 0.1 + i * 0.4 })]),
    TL('정하기 {쉬워진다}', 1000, 740, 56, { c: 48, d: 1.2, color: GREY }),
  ] },
  // strikethrough on "저절로"
  { c: [49, 49], els: [
    T('원하는 삶을 정했다고 해서', cx, 270, 56, { c: 49, color: GREY }),
    T('돈이 {저절로}', cx, 460, 150, { c: 49, d: 1.2 }),
    T('생기지는 않는다', cx, 640, 90, { c: 49, d: 1.6 }),
    strike(1090, 460, 360, { c: 49, d: 2.4, lw: 12, color: WHITE }),
  ] },
  // magnifier sweeping a row of question tiles
  { c: [50, 50], els: [
    ...[0, 1, 2, 3, 4].map(i => rect(440 + i * 260, 420, 200, 200, { c: 50, d: i * 0.08, color: '#444', lw: 2 })),
    ...[0, 1, 2, 3, 4].map(i => T(i === 3 ? '{₩}' : '?', 440 + i * 260, 420, 90, { c: 50, d: i * 0.08, color: '#555' })),
    cust(0, 0, k => { const x = 440 + 780 * easeInOut((k - 0.2) / 1.4); ctx.save(); ctx.translate(x + 30, 400); ctx.scale(2.6, 2.6); ICONS.magnifier(WHITE, RED); ctx.restore(); }, { c: 50, d: 0.2 }),
    T('결국 필요한 돈을 {벌 방법}도 찾아야 한다', cx, 720, 58, { c: 50, d: 0.9 }),
  ] },
  // circle + dashed circle (current job + new income)
  { c: [51, 51], els: [
    ring(720, 470, 260, { c: 51, color: WHITE, lw: 4 }), T('지금 하는 일', 720, 470, 56, { c: 51, d: 0.2 }),
    cust(0, 0, k => { const x = lerp(1500, 1180, easeInOut(k / 1.4)); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([16, 12]); circle(x, 470, 260); ctx.stroke(); ctx.setLineDash([]);
      drawRich('새로운 수입{?}', x + 40, 470, 56); }, { c: 51, d: 0.7 }),
    T('또 다른 방법은 없을까요?', cx, 820, 50, { c: 51, d: 1.6, color: GREY }),
  ] },
  chapter('02', 'POINT TWO', '다른 사람에게\n필요한 가치를 찾아라', 52),
  // worker at the edge, copy on the left
  { c: [53, 54], els: [
    photo('late_work', { fx: 0.45 }),
    sil('suit', 1420, 820, 520, { c: 53 }),
    TL('돈을 더 벌고 싶을 때', 200, 380, 60, { c: 53, d: 0.2 }),
    TL('우리는 {지금 하는 일}에서', 200, 500, 72, { c: 54 }),
    TL('답을 찾으려 합니다', 200, 600, 72, { c: 54, d: 0.2 }),
  ] },
  // one grey road vs branching red paths
  { c: [55, 55], els: [
    cust(0, 0, k => { ctx.lineCap = 'round'; ctx.strokeStyle = '#555'; ctx.lineWidth = 10; line(240, 520, 240 + 1440 * easeInOut(k / 1), 520);
      const e = easeInOut((k - 1.0) / 1.2); ctx.strokeStyle = RED; ctx.lineWidth = 6;
      for (const dy of [-300, -150, 150, 300]) { ctx.beginPath(); ctx.moveTo(600, 520); ctx.bezierCurveTo(800, 520, 900, 520 + dy * e, 600 + 1080 * e, 520 + dy * e); ctx.stroke(); } }, { c: 55 }),
    sil('man', 240, 520, 180, { c: 55, d: 0.1 }),
    T('꼭 {같은 방식}으로만 벌어야 할까요?', cx, 160, 60, { c: 55, d: 0.5 }),
  ] },
  // photo case-study lower third
  { c: [56, 56], els: [
    photo('bakery_seller', { fx: 0.6 }),
    panel(140, 720, 8, 150, { c: 56, anim: 'wipeUp' }),
    tag('CASE · 빵집', 180, 680, { c: 56, d: 0.1 }),
    TL('빵집을 운영하는 사람', 180, 760, 84, { c: 56, d: 0.25, anim: 'slide' }),
    sil('chef', 1600, 860, 420, { c: 56, d: 0.5 }),
  ] },
  // storefront with customers walking in
  { c: [57, 58], els: [
    photo('bakery_products'),
    cust(560, 620, () => { ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(-280, -260); ctx.lineTo(280, -260); ctx.lineTo(320, -170); ctx.lineTo(-320, -170); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = WHITE; ctx.lineWidth = 5; ctx.strokeRect(-260, -170, 520, 330); ctx.strokeRect(-60, -10, 120, 170); ctx.strokeRect(-220, -130, 130, 100); ctx.strokeRect(90, -130, 130, 100); }, { c: 57, anim: 'rise' }),
    cust(560, 220, k => { ctx.strokeStyle = WHITE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-120, 40); const e = easeOut(k / 1.2); ctx.lineTo(-120 + 80 * e, 40 - 30 * e); ctx.lineTo(-120 + 160 * e, 40 - 10 * e); ctx.lineTo(-120 + 240 * e, 40 - 70 * e); ctx.stroke(); drawRich('매출 {↑}', 170, 0, 40, { align: 'left' }); }, { c: 57, d: 0.3 }),
    ...[0, 1, 2, 3].map(i => sil(i % 2 ? 'woman' : 'man', 1500 + i * 120, 780, 240, { c: 58, d: i * 0.15, move: { dx: -560, dur: 1.8, delay: 0.1 } })),
    TL('손님이 {더 많이} 와야 한다', 1050, 300, 54, { c: 58, d: 0.4 }),
  ] },
  // neighbourhood node map
  { c: [59, 60], els: [
    photo('dough', { fy: 0.4 }),
    ln(cx, 470, -440, 0, { c: 59, d: 0.3, color: WHITE, dash: [10, 10] }), ln(cx, 470, 440, 0, { c: 60, color: WHITE, dash: [10, 10] }),
    cust(cx, 470, () => { ctx.fillStyle = RED; circle(0, 0, 110); ctx.fill(); ctx.save(); ctx.scale(1.2, 1.2); ICONS.shop(WHITE, WHITE); ctx.restore(); }, { c: 59, anim: 'pop' }),
    cust(400, 470, () => { ctx.fillStyle = '#000'; ctx.strokeStyle = WHITE; ctx.lineWidth = 3; circle(0, 0, 120); ctx.fill(); ctx.stroke(); ctx.translate(0, 80); silhouette('woman', 150, WHITE); }, { c: 59, d: 0.5, anim: 'pop' }),
    T('집에서 빵을\n만들고 싶은 사람', 400, 700, 40, { c: 59, d: 0.6 }),
    cust(1520, 470, () => { ctx.fillStyle = '#000'; ctx.strokeStyle = WHITE; ctx.lineWidth = 3; circle(0, 0, 120); ctx.fill(); ctx.stroke(); ctx.translate(-36, 72); silhouette('suit', 125, WHITE); ctx.translate(72, 0); silhouette('woman', 120, WHITE); }, { c: 60, d: 0.2, anim: 'pop' }),
    T('직원 간식을\n주문하려는 회사', 1520, 700, 40, { c: 60, d: 0.3 }),
  ] },
  // two new offers as headline blocks
  { c: [61, 61], els: [
    photo('cooking_class'),
    T('그렇다면', cx, 230, 50, { c: 61, color: GREY }),
    panel(560, 480, 640, 220, { c: 61, d: 0.3, color: RED }),
    T('제빵 수업', 560, 480, 90, { c: 61, d: 0.6 }),
    rect(1360, 480, 640, 220, { c: 61, d: 0.8, color: WHITE, lw: 4 }),
    T('단체 주문', 1360, 480, 90, { c: 61, d: 1.0 }),
  ] },
  // radial: one skill, many products
  { c: [62, 63], els: [
    cust(1100, 480, () => { ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.setLineDash([6, 10]); circle(0, 0, 300); ctx.stroke(); ctx.setLineDash([]); }, { c: 62 }),
    cust(1100, 480, () => { ctx.fillStyle = WHITE; circle(0, 0, 130); ctx.fill(); drawRich('빵 만드는\n능력', 0, 0, 40, { color: '#111' }); }, { c: 62, anim: 'pop' }),
    ...[[-90, '매장 판매'], [30, '제빵 수업'], [150, '단체 주문']].map(([deg, s], i) => {
      const a = deg * Math.PI / 180, x = 1100 + Math.cos(a) * 300, y = 480 + Math.sin(a) * 300;
      return cust(x, y, () => { ctx.fillStyle = i ? RED : '#2A2A2A'; circle(0, 0, 95); ctx.fill(); drawRich(s, 0, 0, 34); }, { c: 63, d: i * 0.3, anim: 'pop' });
    }),
    TL('누구에게\n무엇을 해주느냐에 따라\n{돈 버는 방법}이 달라진다', 160, 480, 46, { c: 63, d: 1.2, lh: 1.45 }),
  ] },
  // big cropped silhouette at the right edge
  { c: [64, 64], els: [
    sil('suit', 1500, 1180, 1100, { c: 64, color: '#1E1E1E', anim: 'slide' }),
    TL('직장인도', 220, 420, 80, { c: 64, d: 0.2 }),
    TL('{마찬가지}입니다', 220, 540, 110, { c: 64, d: 0.4 }),
  ] },
  // spreadsheet cells filling
  { c: [65, 65], els: [
    photo('spreadsheet'),
    cust(240, 260, k => { for (let r = 0; r < 7; r++) for (let q = 0; q < 6; q++) { const i = r * 6 + q, on = k > 0.2 + i * 0.05;
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5; ctx.strokeRect(q * 110, r * 60, 110, 60);
      if (on) { ctx.fillStyle = r === 0 ? RED : (q === 5 ? '#BBB' : '#777'); ctx.fillRect(q * 110 + 14, r * 60 + 24, r === 0 ? 82 : 40 + ((i * 29) % 44), 12); } } }, { c: 65 }),
    TL('회사에서', 1080, 360, 48, { c: 65, d: 0.4, color: GREY }),
    TL('엑셀로 자료 정리', 1080, 450, 72, { c: 65, d: 0.5 }),
    TL('= 내게 {익숙한 일}', 1080, 560, 72, { c: 65, d: 1.2 }),
  ] },
  // shop owner with a heavy thought bubble
  { c: [66, 66], els: [
    photo('bills', { fx: 0.4 }),
    sil('chef', 480, 840, 480, { c: 66 }),
    cust(1100, 360, () => { ctx.fillStyle = WHITE; for (const [x, y, r] of [[-360, 200, 14], [-320, 150, 22]]) { circle(x, y, r); ctx.fill(); }
      rrect(-260, -170, 620, 300, 150); ctx.fill(); drawRich('매출? 비용?', 50, -30, 64, { color: '#111' }); drawRich('{어떻게 정리하지…}', 50, 60, 40); }, { c: 66, d: 0.4, anim: 'pop' }),
    TL('작은 가게 사장님에게는 {큰 고민}', 820, 760, 54, { c: 66, d: 1.2 }),
  ] },
  // balance scale: easy vs hard
  { c: [67, 67], els: [
    cust(cx, 0, k => { const tilt = 0.22 * easeInOut((k - 0.8) / 1.2);
      ctx.fillStyle = WHITE; ctx.fillRect(-6, 260, 12, 520); ctx.fillRect(-120, 770, 240, 14);
      ctx.save(); ctx.translate(0, 260); ctx.rotate(tilt); ctx.fillRect(-520, -6, 1040, 12);
      for (const [sx, col, s1] of [[-480, WHITE, '내가 쉽게 하는 일'], [480, RED, '누군가 어려워하는 일']]) {
        ctx.save(); ctx.translate(sx, 0); ctx.rotate(-tilt); ctx.strokeStyle = '#777'; ctx.lineWidth = 2; line(0, 0, -110, 220); line(0, 0, 110, 220);
        ctx.fillStyle = col; ctx.fillRect(-150, 220, 300, 14); drawRich(s1, 0, 290, 38); ctx.restore(); }
      ctx.restore(); }, { c: 67 }),
    T('같은 일, {다른 무게}', cx, 160, 60, { c: 67, d: 0.4 }),
  ] },
  // puzzle pieces join → value
  { c: [68, 69], els: [
    cust(0, 0, k => { const e = easeInOut((k - 0.3) / 1.6), gap = lerp(260, 0, e);
      const piece = (x, col, flip) => { ctx.save(); ctx.translate(x, 430); if (flip) ctx.scale(-1, 1); ctx.fillStyle = col; ctx.beginPath();
        ctx.moveTo(-260, -150); ctx.lineTo(0, -150); ctx.lineTo(0, -40); ctx.arc(30, 0, 40, -Math.PI * 0.7, Math.PI * 0.7); ctx.lineTo(0, 150); ctx.lineTo(-260, 150); ctx.closePath(); ctx.fill(); ctx.restore(); };
      piece(cx - gap, WHITE, false); piece(cx + gap, RED, true);
      drawRich('내 능력', cx - gap - 130, 430, 46, { color: '#111' }); drawRich('누군가의 문제', cx + gap + 130, 430, 40); }, { c: 68 }),
    T('= 돈을 벌 수 있는 {가치}', cx, 720, 72, { c: 69, d: 0.2 }),
  ] },
  // sticky notes of questions
  { c: [70, 72], els: [
    TL('새로운 기회를 찾으려면', 200, 200, 56, { c: 70 }),
    cust(560, 520, () => { ctx.rotate(-0.04); ctx.fillStyle = '#E6E6E6'; ctx.fillRect(-330, -170, 660, 340); drawRich('“뭘 해야\n돈을 많이 벌까?”', 0, 0, 58, { color: '#111' }); }, { c: 71, anim: 'drop' }),
    cust(1360, 520, () => { ctx.rotate(0.05); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([14, 10]); ctx.strokeRect(-330, -170, 660, 340); ctx.setLineDash([]); drawRich('{+} 이런 질문도', 0, 0, 58); }, { c: 72, anim: 'drop' }),
  ] },
  // big red quotes, left aligned
  { c: [73, 74], els: [
    T('“', 230, 330, 300, { c: 73, color: RED }),
    TL('사람들은 어떤 일로', 340, 330, 64, { c: 73, d: 0.15, color: GREY }),
    TL('{불편}해할까?', 340, 430, 96, { c: 73, d: 0.3 }),
    ln(340, 520, 1300, 0, { c: 74, color: '#333', lw: 2 }),
    TL('그중에서 내가', 340, 610, 64, { c: 74, d: 0.1, color: GREY }),
    TL('{도와줄 수 있는} 건 뭘까?', 340, 710, 96, { c: 74, d: 0.25 }),
  ] },
  // conversations: bubbles over silhouettes (photo)
  { c: [75, 76], els: [
    photo('cafe_talk'),
    ...[[420, 'man'], [760, 'woman'], [1160, 'suit'], [1500, 'woman']].map(([x, k2], i) => sil(k2, x, 840, 330, { c: 75 + (i > 1 ? 1 : 0), d: (i % 2) * 0.2, color: i > 1 ? WHITE : '#BBBBBB' })),
    bubble('우리 분야에서는요…', 560, 360, { c: 75, d: 0.3, size: 38, fill: '#DDD' }),
    bubble('이게 늘 고민이에요', 1300, 360, { c: 76, d: 0.3, size: 38, fill: RED, tcolor: WHITE, tail: 'right' }),
    T('다른 분야의 이야기와 {고민}을 살펴보세요', cx, 170, 52, { c: 75, d: 0.6 }),
  ] },
  // passing an orb from me to someone else
  { c: [77, 78], els: [
    sil('man', 480, 780, 400, { c: 77 }), T('나', 480, 840, 40, { c: 77, color: GREY }),
    sil('woman', 1440, 780, 400, { c: 78, flip: true }), T('다른 사람', 1440, 840, 40, { c: 78, color: GREY }),
    cust(0, 0, k => { const e = easeInOut((k - 1.4) / 1.4), x = lerp(620, 1300, e), y = 480 - Math.sin(e * Math.PI) * 120; ctx.fillStyle = e > 0.5 ? RED : WHITE; circle(x, y, 34); ctx.fill(); }, { c: 77, d: 0.2 }),
    T('당연한 경험', 620, 380, 44, { c: 77, d: 0.3 }), T('{필요한 도움}', 1300, 380, 44, { c: 78, d: 0.8 }),
  ] },
  // glowing bulb, blocked path
  { c: [79, 80], els: [
    cust(560, 470, () => { const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 300); g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; circle(0, 0, 300); ctx.fill(); ctx.scale(3, 3); ICONS.bulb(WHITE, RED); }, { c: 79, anim: 'pop' }),
    T('아이디어가 떠올랐다고', 560, 780, 46, { c: 79, d: 0.3 }),
    arrow(820, 470, 360, 0, { c: 80, color: '#666', dash: [12, 12] }),
    panel(1240, 470, 10, 220, { c: 80, d: 0.5, color: RED, anim: 'wipeUp' }),
    TL('바로 돈이 되는 건', 1300, 430, 52, { c: 80, d: 0.6 }), TL('{아닙니다}', 1300, 520, 80, { c: 80, d: 0.7 }),
  ] },
  // crowd of figures: who actually needs it?
  { c: [81, 82], els: [
    cust(0, 0, k => { for (let r = 0; r < 5; r++) for (let q = 0; q < 10; q++) { const i = r * 10 + q, hit = [3, 11, 17, 24, 28, 36, 42, 47].includes(i);
      ctx.save(); ctx.translate(230 + q * 72, 300 + r * 110); silhouette('man', 80, hit && k > 0.8 + (i % 5) * 0.1 ? RED : '#3A3A3A'); ctx.restore(); } }, { c: 81 }),
    TL('필요로 하는 사람이\n실제로 있는가?', 1060, 330, 54, { c: 81, d: 0.4, lh: 1.35 }),
    TL('돈을 낼 만큼\n도움이 되는가?', 1060, 600, 54, { c: 82, lh: 1.35 }),
    ico('check', 1740, 330, 70, { c: 81, d: 1.2 }), ico('check', 1740, 600, 70, { c: 82, d: 1.0 }),
  ] },
  // "the only way" stamped out
  { c: [83, 84], els: [
    T('지금 하는 일을', cx, 240, 56, { c: 83, color: GREY }),
    T('더 많이 하는 것', cx, 380, 120, { c: 83, d: 0.2 }),
    cust(cx, 610, () => { ctx.rotate(-0.06); ctx.strokeStyle = WHITE; ctx.lineWidth = 4; rrect(-260, -60, 520, 120, 8); ctx.stroke(); drawRich('유일한 방법', 0, 2, 60); }, { c: 83, d: 0.8, anim: 'pop' }),
    cust(cx, 610, k => { const e = easeInOut(k / 0.4); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = 'round'; line(-300, -80, -300 + 600 * e, -80 + 160 * e); }, { c: 84, d: 0.5 }),
    T('{은 아니다}', cx + 450, 610, 60, { c: 84, d: 0.9 }),
  ] },
  // hexagon skill cluster feeding new streams
  { c: [85, 86], els: [
    cust(520, 500, k => { const hex = (x, y, r, col) => { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
      const cells = [[0, 0], [1, 0], [0.5, 0.87], [-0.5, 0.87], [-1, 0], [-0.5, -0.87], [0.5, -0.87]];
      cells.forEach(([q, r], i) => { if (k > i * 0.12) hex(q * 120, r * 120, 64, i === 0 ? RED : '#2E2E2E'); }); drawRich('내 능력', 0, 0, 30); }, { c: 85 }),
    TL('내가 이미 가지고 있는 능력으로도', 200, 160, 52, { c: 85, d: 0.4 }),
    ...[-170, 0, 170].map((dy, i) => arrow(720, 500, 520, dy, { c: 86, d: i * 0.2, color: RED, lw: 5 })),
    ...[-170, 0, 170].map((dy, i) => ico('coin', 1320, 500 + dy, 110, { c: 86, d: 0.5 + i * 0.2 })),
    TL('새로운 수입의\n{기회}', 1440, 500, 60, { c: 86, d: 1.1, lh: 1.3 }),
  ] },
  // thought bubble from a head, blocked by "only thinking"
  { c: [87, 88], els: [
    sil('man', 420, 840, 480, { c: 87 }),
    cust(0, 0, () => { ctx.fillStyle = '#E6E6E6'; for (const [x, y, r] of [[520, 360, 14], [580, 300, 22]]) { circle(x, y, r); ctx.fill(); } rrect(620, 120, 520, 260, 130); ctx.fill();
      ctx.save(); ctx.translate(880, 250); ctx.scale(1.6, 1.6); ICONS.bulb('#111', RED); ctx.restore(); }, { c: 87, d: 0.3, anim: 'pop' }),
    TL('새로운 방법을 발견해도', 1220, 260, 46, { c: 87, d: 0.6, color: GREY }),
    TL('생각만으로는', 1220, 520, 66, { c: 88 }),
    TL('{돈을 벌 수 없다}', 1220, 620, 72, { c: 88, d: 0.3 }),
  ] },
  // flowchart: try → verify, with a loop
  { c: [89, 89], els: [
    cust(0, 0, k => { const node = (x, s, col, t) => { if (k < t) return; ctx.save(); ctx.globalAlpha *= easeOut((k - t) / 0.4); ctx.fillStyle = col; rrect(x - 230, 380, 460, 180, 90); ctx.fill(); drawRich(s, x, 470, 58); ctx.restore(); };
      node(600, '직접 해보기', '#222', 0); node(1320, '가능성 확인', RED, 0.9);
      const e = easeInOut((k - 0.4) / 0.5); ctx.strokeStyle = WHITE; ctx.lineWidth = 4; if (e > 0) { line(840, 470, 840 + 240 * e, 470); ctx.fillStyle = WHITE; arrowHead(840 + 240 * e, 470, 0, 18); }
      const l = easeInOut((k - 1.3) / 0.8); if (l > 0) { ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(1320, 580); ctx.bezierCurveTo(1320, 760, 600, 760, 600, 580 + 180 * (1 - l)); ctx.stroke(); ctx.setLineDash([]); drawRich('반복', cx, 740, 36, { color: GREY }); } }, { c: 89 }),
  ] },
  // receipt of costs over a study photo
  { c: [90, 91], els: [
    photo('studying', { fx: 0.55 }),
    cust(cx, 470, () => { ctx.fillStyle = '#F2F2F2'; ctx.beginPath(); ctx.moveTo(-300, -300); ctx.lineTo(300, -300); ctx.lineTo(300, 300);
      for (let i = 0; i <= 12; i++) ctx.lineTo(300 - i * 50, 300 + (i % 2 ? -14 : 0)); ctx.closePath(); ctx.fill();
      drawRich('시도 비용', 0, -230, 46, { color: '#111' }); ctx.strokeStyle = '#999'; ctx.lineWidth = 2; ctx.setLineDash([4, 6]); line(-240, -180, 240, -180); ctx.setLineDash([]); }, { c: 90, anim: 'rise' }),
    TL('새로운 것을 배우기', 690, 400, 40, { c: 90, d: 0.4, color: '#111' }), T('₩ ···', 1210, 400, 40, { c: 90, d: 0.5, color: '#111', align: 'right' }),
    TL('상품 만들어 보기', 690, 490, 40, { c: 91, color: '#111' }), T('₩ ···', 1210, 490, 40, { c: 91, d: 0.1, color: '#111', align: 'right' }),
    TL('{돈이 필요하다}', 690, 640, 52, { c: 91, d: 0.8 }),
  ] },
  // jar filling with savings
  { c: [92, 93], els: [
    cust(600, 470, k => { ctx.strokeStyle = WHITE; ctx.lineWidth = 5; rrect(-170, -250, 340, 480, 40); ctx.stroke(); ctx.fillStyle = WHITE; ctx.fillRect(-120, -280, 240, 30);
      const lvl = 420 * easeInOut((k - 1.4) / 2.4); ctx.save(); rrect(-160, -240, 320, 460, 32); ctx.clip(); ctx.fillStyle = RED;
      ctx.beginPath(); ctx.moveTo(-170, 220 - lvl); for (let x = -170; x <= 170; x += 10) ctx.lineTo(x, 220 - lvl + Math.sin(x / 30 + k * 4) * 6); ctx.lineTo(170, 240); ctx.lineTo(-170, 240); ctx.fill(); ctx.restore(); }, { c: 92 }),
    TL('앞서 말씀드린 것처럼', 1000, 340, 46, { c: 92, d: 0.3, color: GREY }),
    TL('기회를 시도할 수 있는', 1000, 460, 64, { c: 93 }),
    TL('{돈을 준비}해 두기', 1000, 560, 80, { c: 93, d: 0.2 }),
  ] },
  // formula hitting a wall
  { c: [94, 95], els: [
    T('돈', 360, 450, 120, { c: 94 }), T('{+}', 520, 450, 90, { c: 94, d: 0.2 }), T('아이디어', 760, 450, 120, { c: 94, d: 0.3 }),
    ico('check', 520, 630, 60, { c: 94, d: 0.9 }), TL('준비 완료', 570, 630, 40, { c: 94, d: 0.9, color: GREY }),
    arrow(1000, 450, 280, 0, { c: 95, color: WHITE, lw: 5 }),
    panel(1320, 450, 18, 300, { c: 95, d: 0.4, color: RED, anim: 'drop' }),
    T('수입', 1560, 450, 110, { c: 95, d: 0.3, color: '#555' }),
    T('저절로 되지는 않는다', 1300, 700, 52, { c: 95, d: 0.9 }),
  ] },
  // person with megaphone, waves to a crowd, coins come back
  { c: [96, 97], els: [
    sil('mega', 360, 820, 460, { c: 96 }),
    cust(560, 500, k => { ctx.strokeStyle = RED; ctx.lineWidth = 5; for (let i = 0; i < 4; i++) { const r = ((k * 140 + i * 90) % 360) + 40; ctx.save(); ctx.globalAlpha *= 1 - r / 400; ctx.beginPath(); ctx.arc(0, 0, r, -0.5, 0.5); ctx.stroke(); ctx.restore(); } }, { c: 96, d: 0.3 }),
    ...[0, 1, 2, 3, 4, 5].map(i => sil(i % 2 ? 'woman' : 'man', 1150 + (i % 3) * 200, 560 + Math.floor(i / 3) * 260, 220, { c: 96, d: 0.6 + i * 0.08 })),
    TL('필요한 사람에게 {알리고}', 700, 170, 54, { c: 96, d: 0.4 }),
    ico('coin', 1300, 330, 90, { c: 97, move: { dx: -700, dy: 60, dur: 1.4, delay: 0.2 }, out: 1.8 }),
    TL('실제로 돈을 벌 {방법}까지', 700, 860, 54, { c: 97, d: 0.5 }),
  ] },
  chapter('03', 'POINT THREE', '가치를 돈으로 바꾸는\n기술을 배워라', 98),
  // viewfinder corners around the key line
  { c: [99, 99], els: [
    cust(cx, 470, k => { const e = easeOut(k / 0.6), w = lerp(900, 760, e), h = lerp(420, 340, e); ctx.strokeStyle = RED; ctx.lineWidth = 6;
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.beginPath(); ctx.moveTo(sx * w / 2, sy * (h / 2 - 60)); ctx.lineTo(sx * w / 2, sy * h / 2); ctx.lineTo(sx * (w / 2 - 60), sy * h / 2); ctx.stroke(); } }, { c: 99 }),
    T('여기서 한 가지', cx, 400, 64, { c: 99, d: 0.2, color: GREY }),
    T('{알아야 할 점}', cx, 520, 100, { c: 99, d: 0.4 }),
  ] },
  // side-by-side contrast with a vertical divider
  { c: [100, 101], els: [
    T('일을 잘하는 것', 520, 470, 80, { c: 100 }),
    panel(cx, 470, 4, 500, { c: 101, color: RED, anim: 'wipeUp' }),
    cust(cx, 470, () => { ctx.fillStyle = '#000'; circle(0, 0, 80); ctx.fill(); drawRich('{≠}', 0, 0, 120); }, { c: 101, d: 0.3, anim: 'pop' }),
    T('그 능력으로\n돈을 버는 것', 1400, 470, 80, { c: 101, d: 0.4 }),
  ] },
  // broken bridge between skill and people
  { c: [102, 103], els: [
    cust(0, 0, () => { ctx.fillStyle = '#1C1C1C'; ctx.fillRect(160, 720, 520, 120); ctx.fillRect(1240, 720, 520, 120); }, { c: 102 }),
    sil('man', 420, 720, 300, { c: 102 }), ico('star', 420, 350, 80, { c: 102, d: 0.2 }),
    ...[0, 1, 2].map(i => sil(i === 1 ? 'woman' : 'man', 1360 + i * 150, 720, 260, { c: 102, d: 0.5 + i * 0.1, color: '#555' })),
    cust(0, 0, k => { const e = easeOut(k / 0.8); ctx.fillStyle = '#555'; ctx.fillRect(680, 712, 220 * e, 12); ctx.fillRect(1240 - 220 * e, 712, 220 * e, 12); }, { c: 102, d: 0.8 }),
    T('{?}', cx, 650, 120, { c: 102, d: 1.3 }),
    T('필요한 사람을 찾지 못하면\n실제 수입으로 {이어지기 어렵다}', cx, 220, 52, { c: 103 }),
  ] },
  // scan line over a silhouette
  { c: [104, 105], els: [
    TL('무조건 {더 일하기}보다', 200, 260, 60, { c: 104 }),
    strike(510, 260, 340, { c: 104, d: 0.9, color: WHITE, lw: 6 }),
    sil('man', 1360, 840, 600, { c: 105, color: '#2C2C2C' }),
    cust(1360, 0, k => { const y = 240 + 600 * ((k * 0.6) % 1); ctx.fillStyle = RED; ctx.fillRect(-260, y, 520, 4); ctx.fillStyle = 'rgba(232,51,42,0.12)'; ctx.fillRect(-260, y - 60, 520, 60); }, { c: 105, d: 0.2 }),
    TL('내게 {부족한 것}이', 200, 520, 72, { c: 105, d: 0.3 }),
    TL('무엇인지 살펴보세요', 200, 620, 72, { c: 105, d: 0.5 }),
  ] },
  // diagnostic radio list, each highlighted in turn
  { c: [106, 108], els: [
    tag('SELF CHECK', 300, 190, { c: 106 }),
    ...['사람들에게 나를 알리는 방법', '내 능력을 설명하는 방법', '사람들이 무엇을 필요로 하는지 알아보는 방법'].flatMap((s, i) => [
      cust(330, 320 + i * 170, k => { ctx.strokeStyle = WHITE; ctx.lineWidth = 3; circle(0, 0, 26); ctx.stroke(); ctx.fillStyle = RED; circle(0, 0, 14 * easeBack(k / 0.4)); ctx.fill(); }, { c: 106 + i, d: 0.2 }),
      TL(s, 390, 320 + i * 170, 56, { c: 106 + i, dimAt: i < 2 ? (CUES_RAW[107 + i].start - CUES_RAW[106 + i].start) : undefined, dimTo: 0.35 }),
      ln(300, 400 + i * 170, 1320, 0, { c: 106 + i, color: '#2A2A2A', lw: 2 }),
    ]),
  ] },
  // learning cycle
  { c: [109, 110], els: [
    cust(cx, 470, k => { ctx.strokeStyle = '#2C2C2C'; ctx.lineWidth = 4; circle(0, 0, 250); ctx.stroke();
      const e = easeInOut(k / 4.2); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 250, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * e); ctx.stroke();
      const a = -Math.PI / 2 + Math.PI * 2 * e; ctx.fillStyle = RED; circle(Math.cos(a) * 250, Math.sin(a) * 250, 14); ctx.fill(); }, { c: 109 }),
    T('배우기', cx, 160, 50, { c: 109 }), T('작게 시도', 1330, 470, 50, { c: 109, d: 1.0 }),
    T('반응 살피기', cx, 780, 50, { c: 110 }), T('{고쳐 나가기}', 590, 470, 50, { c: 110, d: 1.0 }),
  ] },
  // level meter low → content
  { c: [111, 112], els: [
    cust(420, 760, () => { for (let i = 0; i < 10; i++) { ctx.fillStyle = i < 2 ? RED : '#262626'; ctx.fillRect(i * 52, -40 - i * 30, 38, 40 + i * 30); } }, { c: 111, anim: 'rise' }),
    TL('내 능력을 알리는 방법이', 420, 280, 46, { c: 111, d: 0.3, color: GREY }), TL('{부족}하다면', 420, 370, 72, { c: 111, d: 0.4 }),
    arrow(1020, 560, 160, 0, { c: 112, color: WHITE }),
    cust(1480, 540, () => { ctx.strokeStyle = WHITE; ctx.lineWidth = 4; rrect(-240, -150, 480, 300, 14); ctx.stroke(); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(-30, -50); ctx.lineTo(50, 0); ctx.lineTo(-30, 50); ctx.fill(); }, { c: 112, d: 0.2, anim: 'pop' }),
    T('{콘텐츠}를 활용한다', 1480, 780, 52, { c: 112, d: 0.5 }),
  ] },
  // screen frame containing problem → solution
  { c: [113, 114], els: [
    rect(cx, 470, 1240, 640, { c: 114, color: RED, lw: 4, r: 18 }),
    tag('● REC', 400, 200, { c: 114, d: 0.3 }),
    cust(620, 470, () => { ctx.scale(1.8, 1.8); ICONS.lock(WHITE, RED); }, { c: 113, anim: 'pop' }), T('문제', 620, 640, 44, { c: 113, d: 0.1, color: GREY }),
    arrow(760, 470, 380, 0, { c: 113, d: 0.6, color: WHITE }), T('내 지식과 기술', cx, 410, 40, { c: 113, d: 0.8 }),
    cust(1300, 470, () => { ctx.scale(1.8, 1.8); ICONS.unlock(WHITE, RED); }, { c: 113, d: 1.4, anim: 'pop' }), T('{해결}', 1300, 640, 44, { c: 113, d: 1.5 }),
  ] },
  // big play logo and wordmark
  { c: [115, 115], els: [
    cust(620, 470, () => { ctx.fillStyle = RED; rrect(-230, -160, 460, 320, 80); ctx.fill(); ctx.fillStyle = WHITE; ctx.beginPath(); ctx.moveTo(-60, -90); ctx.lineTo(100, 0); ctx.lineTo(-60, 90); ctx.fill(); }, { c: 115, anim: 'pop' }),
    TL('그중 하나가 바로', 940, 390, 50, { c: 115, d: 0.3, color: GREY }),
    TL('유튜브', 940, 510, 150, { c: 115, d: 0.5 }),
  ] },
  // audience dots converging to the screen (photo)
  { c: [116, 116], els: [
    photo('creator_setup'),
    cust(0, 0, k => { for (let i = 0; i < 60; i++) { const a = i * 2.4, r0 = 700 + (i % 7) * 40, e = easeInOut((k - 0.3 - (i % 10) * 0.05) / 1.6), r = lerp(r0, 190, e);
      ctx.fillStyle = i % 6 === 0 ? RED : WHITE; circle(cx + Math.cos(a) * r, 470 + Math.sin(a) * r * 0.55, 8); ctx.fill(); } }, { c: 116 }),
    cust(cx, 470, () => { ctx.fillStyle = '#000'; ctx.strokeStyle = WHITE; ctx.lineWidth = 4; rrect(-160, -100, 320, 200, 12); ctx.fill(); ctx.stroke(); drawRich('지식 · 경험', 0, 0, 40); }, { c: 116, anim: 'pop' }),
    T('필요한 사람들의 {관심}을 모은다', cx, 820, 52, { c: 116, d: 1.2 }),
  ] },
  // layered funnel
  { c: [117, 118], els: [
    ...[[1000, '관심을 가진 사람'], [760, '구체적인 도움을 원하는 사람'], [520, '상품 · 서비스']].map(([w, s], i) =>
      cust(820, 280 + i * 190, () => { ctx.fillStyle = i === 2 ? RED : (i ? '#3A3A3A' : '#222'); ctx.beginPath(); ctx.moveTo(-w / 2, -80); ctx.lineTo(w / 2, -80); ctx.lineTo(w / 2 - 120, 80); ctx.lineTo(-w / 2 + 120, 80); ctx.closePath(); ctx.fill(); drawRich(s, 0, 0, i === 1 ? 38 : 44); },
        { c: i < 2 ? 117 : 118, d: i === 1 ? 0.6 : 0, anim: 'drop' })),
    TL('관련 상품이나\n서비스를\n{제공}할 수 있다', 1440, 560, 50, { c: 118, d: 0.6, lh: 1.35 }),
  ] },
  // real case: counter to 100M won
  { c: [119, 120], els: [
    photo('creator_woman', { fx: 0.3 }),
    tag('REAL CASE', 200, 260, { c: 119 }),
    TL('30대 주부', 200, 350, 80, { c: 119, d: 0.2 }),
    TL('자신의 지식과 경험을\n콘텐츠로 알리고', 200, 500, 46, { c: 119, d: 0.5, color: '#CCC', lh: 1.4 }),
    { k: 'counter', x: 1720, y: 470, to: 100, align: 'right', fmt: v => v >= 99.5 ? '{1억} 원' : `{${(Math.round(v) * 100).toLocaleString()}만} 원`, size: 170, c: 120, d: 0.8, cdur: 1.6 },
    T('매출', 1720, 620, 48, { c: 120, d: 1.0, color: GREY, align: 'right' }),
  ] },
  // red side band "POINT"
  { c: [121, 121], noTag: true, els: [
    panel(180, 540, 360, 1080, { c: 121, color: RED }),
    cust(180, 540, () => { ctx.rotate(-Math.PI / 2); drawRich('POINT', 0, 0, 110, { ls: 12 }); }, { c: 121, d: 0.3 }),
    TL('그런데 여기서', 520, 400, 60, { c: 121, d: 0.3, color: GREY }),
    TL('{중요한 점}이 있습니다', 520, 520, 96, { c: 121, d: 0.5 }),
  ] },
  // stats rising, but revenue stays grey
  { c: [122, 123], els: [
    ...[['조회수', 128000, 'eye'], ['좋아요', 9400, 'heart'], ['구독자', 21000, 'person']].flatMap(([s, n, ic], i) => [
      ico(ic, 300, 280 + i * 160, 70, { c: 122, d: i * 0.2 }), TL(s, 380, 280 + i * 160, 40, { c: 122, d: i * 0.2, color: GREY }),
      { k: 'counter', x: 880, y: 280 + i * 160, to: n, align: 'right', size: 64, fmt: v => Math.round(v).toLocaleString(), c: 122, d: 0.2 + i * 0.2, cdur: 2.2 }]),
    arrow(1000, 440, 260, 0, { c: 123, color: '#555', dash: [12, 12] }),
    T('수익', 1480, 440, 110, { c: 123, d: 0.3, color: '#444' }), T('{?}', 1640, 360, 90, { c: 123, d: 0.6 }),
    T('관심이 {반드시} 수익으로 이어지진 않는다', cx, 800, 50, { c: 123, d: 0.9 }),
  ] },
  // chevron flow of three decisions
  { c: [124, 126], els: [
    ...['누구를 대상으로', '어떤 상품·서비스를', '어떻게 구매로 연결할지'].map((s, i) =>
      cust(420 + i * 540, 470, () => { ctx.fillStyle = i === 2 ? RED : (i ? '#333' : '#222'); ctx.beginPath(); ctx.moveTo(-270, -150); ctx.lineTo(220, -150); ctx.lineTo(290, 0); ctx.lineTo(220, 150); ctx.lineTo(-270, 150); ctx.lineTo(-200, 0); ctx.closePath(); ctx.fill();
        drawRich(`0${i + 1}`, 10, -60, 40, { color: i === 2 ? WHITE : RED }); drawRich(s, 10, 30, i === 2 ? 36 : 40); }, { c: 124 + i, anim: 'slide' })),
    T('까지 생각해야 한다', cx, 760, 50, { c: 126, d: 1.0, color: GREY }),
  ] },
  // overwhelmed (photo + outline word + scattered questions)
  { c: [127, 130], els: [
    photo('confused', { fx: 0.6 }),
    TL('유튜브로 사업을 시작하려고 하면', 200, 200, 50, { c: 127 }),
    T('어떤 경험을 활용하지?', 560, 400, 46, { c: 128, color: '#DDD' }),
    T('어떤 콘텐츠부터?', 1380, 520, 46, { c: 129, color: '#DDD' }),
    ...[[300, 560, 90], [1600, 320, 120], [980, 300, 70], [1200, 720, 80]].map(([x, y, s], i) => T('?', x, y, s, { c: 128 + (i % 2), d: 0.3, color: RED, anim: 'pop' })),
    T('막막', cx, 640, 220, { c: 130, outline: 4, anim: 'grow' }),
  ] },
  // three people, three different levels
  { c: [131, 132], els: [
    ...[[560, 'woman', 0.35], [cx, 'man', 0.8], [1360, 'elder', 0.55]].flatMap(([x, k2, v], i) => [
      cust(x, 760, k => { const h = 460 * v * easeOut((k - 0.3) / 1); ctx.fillStyle = i === 1 ? 'rgba(232,51,42,0.85)' : '#262626'; ctx.fillRect(-120, -h, 240, h); }, { c: 131, d: i * 0.2 }),
      sil(k2, x, 760, 300, { c: 131, d: i * 0.2 }),
    ]),
    ln(360, 760, 1200, 0, { c: 131, color: WHITE, lw: 2 }),
    T('사람마다 가진 지식과 경험, 준비된 것이 {다르다}', cx, 160, 52, { c: 132 }),
  ] },
  // wrong turn vs right turn signposts
  { c: [133, 135], els: [
    cust(0, 0, () => { ctx.fillStyle = WHITE; ctx.fillRect(954, 260, 12, 600); }, { c: 133 }),
    cust(760, 360, () => { ctx.fillStyle = '#333'; ctx.beginPath(); ctx.moveTo(190, -60); ctx.lineTo(-170, -60); ctx.lineTo(-230, 0); ctx.lineTo(-170, 60); ctx.lineTo(190, 60); ctx.closePath(); ctx.fill(); drawRich('무작정 영상 만들기', -10, 2, 40, { color: '#999' }); }, { c: 133, d: 0.2, anim: 'slide' }),
    strike(750, 360, 380, { c: 133, d: 1.0, lw: 8 }),
    cust(1160, 520, () => { ctx.fillStyle = WHITE; ctx.beginPath(); ctx.moveTo(-190, -60); ctx.lineTo(170, -60); ctx.lineTo(230, 0); ctx.lineTo(170, 60); ctx.lineTo(-190, 60); ctx.closePath(); ctx.fill(); drawRich('무엇부터 준비할지', 10, 2, 40, { color: '#111' }); }, { c: 134 }),
    cust(1160, 680, () => { ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(-190, -60); ctx.lineTo(170, -60); ctx.lineTo(230, 0); ctx.lineTo(170, 60); ctx.lineTo(-190, 60); ctx.closePath(); ctx.fill(); drawRich('먼저 확인하기', 10, 2, 44); }, { c: 135 }),
  ] },
  // pinned comment UI over a phone photo
  { c: [136, 136], els: [
    photo('phone'),
    cust(cx, 470, () => { ctx.fillStyle = '#121212'; ctx.strokeStyle = '#333'; ctx.lineWidth = 2; rrect(-520, -190, 1040, 380, 22); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.translate(-440, -112); ctx.scale(0.45, 0.45); ICONS.pushpin(WHITE, RED); ctx.restore(); drawRich('고정 댓글', -400, -112, 34, { align: 'left', color: GREY });
      ctx.fillStyle = '#444'; circle(-440, 20, 40); ctx.fill(); ctx.fillStyle = '#666'; ctx.fillRect(-370, -20, 300, 22);
      ctx.fillStyle = RED; rrect(-370, 30, 520, 70, 35); ctx.fill(); drawRich('진단 링크 바로가기  →', -110, 66, 34); }, { c: 136, anim: 'rise' }),
    cust(1060, 540, k => { const e = easeInOut((k - 0.4) / 0.9); ctx.translate(lerp(260, 0, e), lerp(160, 0, e)); ctx.fillStyle = WHITE; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 52); ctx.lineTo(14, 40); ctx.lineTo(26, 64); ctx.lineTo(34, 60); ctx.lineTo(22, 36); ctx.lineTo(40, 36); ctx.closePath(); ctx.fill();
      if (k > 1.4 && k < 2.0) { ctx.strokeStyle = WHITE; ctx.lineWidth = 3; ctx.globalAlpha *= clamp(1 - (k - 1.4) * 1.7); circle(0, 0, 30 + (k - 1.4) * 60); ctx.stroke(); } }, { c: 136, d: 0.6 }),
  ] },
  // form being completed
  { c: [137, 137], els: [
    cust(cx, 470, () => { ctx.fillStyle = '#0E0E0E'; ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 2; rrect(-420, -330, 840, 660, 20); ctx.fill(); ctx.stroke(); drawRich('질문에 답하기', -360, -260, 40, { align: 'left' }); }, { c: 137, anim: 'rise' }),
    ...[0, 1, 2].map(i =>
      cust(620, 330 + i * 110, k => { ctx.strokeStyle = WHITE; ctx.lineWidth = 3; ctx.strokeRect(-22, -22, 44, 44); ctx.fillStyle = '#333'; ctx.fillRect(50, -8, 560, 16);
        const e = easeInOut((k - 0.4 - i * 0.4) / 0.3); if (e > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 10 * e); ctx.lineTo(-4 + 22 * e, 10 - 26 * e); ctx.stroke(); } }, { c: 137, d: 0.2 })),
    cust(cx, 700, k => { const done = k > 1.6; ctx.fillStyle = done ? RED : '#333'; rrect(-200, -44, 400, 88, 44); ctx.fill(); drawRich(done ? '신청 완료 ✓' : '신청하기', 0, 2, 40); }, { c: 137, d: 0.3 }),
  ] },
  // diagnosis report sheet
  { c: [138, 138], els: [
    cust(700, 480, k => { ctx.fillStyle = '#F2F2F2'; ctx.fillRect(-260, -340, 520, 680); ctx.fillStyle = RED; ctx.fillRect(-260, -340, 520, 90); drawRich('기초 진단표', 0, -295, 44);
      const vals = [0.7, 0.4, 0.85, 0.55]; vals.forEach((v, i) => { ctx.fillStyle = '#CCC'; ctx.fillRect(-200, -170 + i * 110, 400, 26); ctx.fillStyle = i === 1 ? RED : '#222'; ctx.fillRect(-200, -170 + i * 110, 400 * v * easeOut((k - 0.4 - i * 0.15) / 0.8), 26); });
      ctx.fillStyle = '#999'; for (let i = 0; i < 4; i++) ctx.fillRect(-200, -200 + i * 110, 140, 10); }, { c: 138, anim: 'rise' }),
    TL('여러분의 응답을 바탕으로 한', 1080, 400, 46, { c: 138, d: 0.4, color: GREY }),
    TL('{기초 진단표}', 1080, 510, 96, { c: 138, d: 0.6 }),
    TL('를 받아볼 수 있습니다', 1080, 610, 46, { c: 138, d: 0.8 }),
  ] },
  // person at a crossroads of question marks
  { c: [139, 140], els: [
    TL('유튜브로', 200, 320, 64, { c: 139 }),
    TL('{수익}을 만들고 싶은데', 200, 430, 80, { c: 139, d: 0.2 }),
    sil('man', 1400, 820, 520, { c: 140 }),
    ...[[1240, 260], [1400, 200], [1560, 260]].map(([x, y], i) => T(i === 1 ? '{?}' : '?', x, y, 90, { c: 140, d: 0.3 + i * 0.15, anim: 'pop', color: '#777' })),
    TL('무엇부터 시작해야 할지\n막막하셨다면', 200, 640, 52, { c: 140, d: 0.4, color: GREY, lh: 1.35 }),
  ] },
  // final call to action
  { c: [141, 142], last: true, els: [
    tag('지금 고정 댓글 링크에서', 200, 320, { c: 141, color: GREY, ls: 2, weight: 500, size: 40 }),
    TL('내 상황부터', 200, 450, 130, { c: 142 }),
    TL('{확인}해 보세요', 200, 610, 130, { c: 142, d: 0.2 }),
    uline(540, 710, 680, { c: 142, d: 0.6, h: 10 }),
    cust(1560, 470, () => { ctx.strokeStyle = '#333'; ctx.lineWidth = 3; rrect(-150, -280, 300, 560, 40); ctx.stroke();
      ctx.save(); ctx.translate(-80, -170); ctx.scale(0.45, 0.45); ICONS.pushpin(WHITE, RED); ctx.restore();
      ctx.fillStyle = '#444'; ctx.fillRect(-40, -180, 160, 14); ctx.fillStyle = RED; rrect(-110, -110, 220, 56, 28); ctx.fill(); drawRich('링크', 0, -82, 30);
      for (let i = 0; i < 4; i++) { ctx.fillStyle = '#2A2A2A'; ctx.fillRect(-110, -10 + i * 60, 220, 14); } }, { c: 141, d: 0.2, anim: 'rise' }),
  ] },
];

// Resolve cue-relative timing into scene-relative seconds. IN_DELAY lets the previous scene fade most of the way first.
const IN_DELAY = 0.28;
const CUES = CUES_RAW.map(c => ({ ...c, sub: c.text.replace(/^\*/, '').replace('만들찌', '만들지').replace(' — ', ' - ') }));
const CHAPTERS = [
  { n: '01', title: '목표를 구체적으로 정해라', from: CUES[20].start, to: CUES[51].end },
  { n: '02', title: '다른 사람에게 필요한 가치를 찾아라', from: CUES[53].start, to: CUES[97].end },
  { n: '03', title: '가치를 돈으로 바꾸는 기술을 배워라', from: CUES[99].start, to: CUES[135].end },
];
const SCENES = SCENE_DEFS.map(sd => {
  const start = CUES[sd.c[0]].start, end = CUES[sd.c[1]].end;
  const els = sd.els.map(e => {
    const at = e.k === 'photo' ? 0 : CUES[e.c ?? sd.c[0]].start - start + (e.d || 0) + IN_DELAY;
    const o = { ...e, at };
    for (const key of ['out', 'dimAt', 'toAt']) if (e[key] !== undefined) o[key] = at + e[key];
    return o;
  });
  return { start, end, els, last: sd.last, noTag: sd.noTag };
});
// sanity: every cue covered by exactly one scene
(function check() {
  const covered = new Array(CUES.length).fill(0);
  SCENE_DEFS.forEach(sd => { for (let i = sd.c[0]; i <= sd.c[1]; i++) covered[i]++; });
  const bad = covered.map((v, i) => [v, i]).filter(([v]) => v !== 1);
  if (bad.length) throw new Error('cue coverage: ' + JSON.stringify(bad));
})();
