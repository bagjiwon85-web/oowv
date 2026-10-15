// Scene definitions. Each scene spans cues [a..b]; element timing uses `c` (absolute cue index) + `d` (delay seconds).
const cx = 960;
const txt = (s, x, y, size, o = {}) => ({ k: 'text', s, x, y, size, ...o });
const ico = (name, x, y, size, o = {}) => ({ k: 'icon', name, x, y, size, ...o });
const chr = (x, y, h, o = {}) => ({ k: 'char', x, y, h, ...o });
const card = (x, y, o = {}) => ({ k: 'card', x, y, ...o });
const chip = (s, x, y, o = {}) => ({ k: 'chip', s, x, y, ...o });
const ln = (x, y, dx, dy, o = {}) => ({ k: 'line', x, y, dx, dy, ...o });
const arrow = (x, y, dx, dy, o = {}) => ln(x, y, dx, dy, { arrow: true, color: o.color || GREY, lw: 5, ...o });
const strike = (x, y, w, o = {}) => ({ k: 'strike', x, y, w, anim: 'none', ...o });
const uline = (x, y, w, o = {}) => ({ k: 'underline', x, y, w, anim: 'none', ...o });
const num = (s, x, y, size, o = {}) => ({ k: 'num', s, x, y, size, ...o });
const neq = (x, y, o = {}) => txt('{≠}', x, y, 140, { anim: 'pop', ...o });

// Chapter title card
function chapter(n, title, c) {
  return { c: [c, c], els: [
    num(n, cx, 360, 260, { c, d: 0 }),
    uline(cx, 520, 160, { c, d: 0.35 }),
    txt(title, cx, 620, 78, { c, d: 0.5 }),
  ] };
}

const SCENE_DEFS = [
  // ---------------- intro ----------------
  { c: [0, 0], els: [
    chr(620, 830, 600, { c: 0 }),
    ico('coins', 1240, 330, 230, { c: 0, d: 0.3 }),
    txt('{부자}가 되고 싶을 때', 1240, 580, 80, { c: 0, d: 0.5 }),
  ] },
  { c: [1, 1], els: [
    ico('bill', 760, 400, 260, { c: 1 }),
    ico('bill', 1160, 400, 260, { c: 1, d: 0.25 }),
    arrow(960, 470, 0, -160, { c: 1, d: 0.5, color: RED }),
    txt('어떻게 하면 돈을 {더 많이} 벌 수 있을까?', cx, 690, 66, { c: 1, d: 0.7 }),
  ] },
  { c: [2, 3], els: [
    card(520, 430, { w: 400, h: 400, icon: 'wallet', label: '월급 {↑}', c: 2 }),
    card(960, 430, { w: 400, h: 400, icon: 'clock', label: '일하는 시간 {↑}', c: 2, d: 1.1 }),
    card(1400, 430, { w: 400, h: 400, icon: 'chartUp', label: '좋은 투자처', hl: true, c: 3 }),
  ] },
  { c: [4, 4], els: [
    ico('coins', cx, 360, 280, { c: 4 }),
    txt('돈을 많이 버는 것', cx, 600, 72, { c: 4, d: 0.3 }),
    chip('중요', cx, 730, { hl: true, c: 4, d: 0.7 }),
  ] },
  { c: [5, 6], els: [
    card(560, 430, { w: 420, h: 420, icon: 'chartUp', label: '수입 증가', c: 5 }),
    neq(cx, 430, { c: 6 }),
    card(1360, 430, { w: 420, h: 420, icon: 'coins', label: '부자', c: 6, d: 0.2, hl: true }),
  ] },
  { c: [7, 7], els: [
    ico('coins', 640, 400, 220, { c: 7 }),
    txt('수입', 640, 580, 52, { c: 7 }),
    ln(760, 400, 360, 0, { c: 7, d: 0.4, dash: [14, 14], color: '#555', draw: 1.6 }),
    ico('heart', 1180, 400, 200, { c: 7, d: 0.3, move: { dx: 260, dur: 2.2, delay: 0.5 } }),
    txt('원하는 삶', 1180, 580, 52, { c: 7, d: 0.3, move: { dx: 260, dur: 2.2, delay: 0.5 } }),
    txt('점점 {멀어진다}', cx, 760, 60, { c: 7, d: 1.6 }),
  ] },
  { c: [8, 8], els: [
    { k: 'ring', x: cx, y: 400, r: 190, c: 8, anim: 'none' },
    ico('briefcase', cx, 400, 220, { c: 8, d: 0.15 }),
    txt('지금 하는 일에만 {집중}', cx, 700, 66, { c: 8, d: 0.4 }),
  ] },
  { c: [9, 9], els: [
    ico('briefcase', cx, 400, 180, { c: 9 }),
    ico('bulb', 560, 330, 140, { c: 9, d: 0.2, dimAt: 1.3 }),
    ico('bulb', 1360, 330, 140, { c: 9, d: 0.35, dimAt: 1.4 }),
    ico('bulb', 640, 560, 120, { c: 9, d: 0.5, dimAt: 1.5 }),
    ico('bulb', 1280, 560, 120, { c: 9, d: 0.65, dimAt: 1.6 }),
    txt('새로운 수입의 기회를 {놓친다}', cx, 760, 64, { c: 9, d: 1.0 }),
  ] },
  { c: [10, 11], els: [
    ico('star', 520, 400, 220, { c: 10 }),
    txt('좋은 능력', 520, 590, 56, { c: 10, d: 0.2 }),
    ln(680, 400, 560, 0, { c: 11, dash: [14, 14], color: '#555', draw: 1 }),
    ico('question', cx, 380, 150, { c: 11, d: 0.4 }),
    ico('coin', 1400, 400, 200, { c: 11, d: 0.6, color: GREY, accent: '#5A5A5A' }),
    txt('돈 버는 방법', 1400, 590, 56, { c: 11, d: 0.6, color: GREY }),
  ] },
  { c: [12, 12], els: [
    chr(cx, 720, 520, { c: 12 }),
    ico('question', 1260, 260, 140, { c: 12, d: 0.4 }),
    ico('question', 660, 330, 100, { c: 12, d: 0.6 }),
    txt('부자가 되기 위해 무엇을 {다르게} 준비해야 할까?', cx, 820, 60, { c: 12, d: 0.8 }),
  ] },
  { c: [13, 14], els: [
    chr(560, 800, 560, { c: 13 }),
    txt('부자가 되고 싶다면', 1260, 230, 60, { c: 13, d: 0.2 }),
    txt('반드시 알아야 할', 1260, 320, 52, { c: 14, color: GREY }),
    num('3', 1180, 520, 280, { c: 14, d: 0.2, anim: 'pop' }),
    txt('가지', 1360, 560, 80, { c: 14, d: 0.4 }),
    chip('01', 1080, 740, { c: 14, d: 0.6 }), chip('02', 1260, 740, { c: 14, d: 0.75 }), chip('03', 1440, 740, { c: 14, d: 0.9, hl: true }),
  ] },
  { c: [15, 18], els: [
    ico('play', 440, 200, 100, { c: 15 }),
    { k: 'hbar', x: 1010, y: 200, w: 900, h: 18, c: 15, d: 0.1, fdur: 1.3 },
    card(500, 520, { w: 420, h: 380, icon: 'magnifier', label: '놓치고 있는 것', c: 16 }),
    card(cx, 520, { w: 420, h: 380, icon: 'house', label: '더 나은 삶', c: 17 }),
    card(1420, 520, { w: 420, h: 380, icon: 'loop', label: '바꿔야 할 것', hl: true, c: 18 }),
  ] },
  // ---------------- 01 ----------------
  chapter('01', '목표를 구체적으로 정해라', 19),
  { c: [20, 20], els: [
    chr(1380, 820, 580, { c: 20 }),
    txt('여러분은', 680, 330, 64, { c: 20, d: 0.2, color: GREY }),
    txt('{왜} 부자가', 680, 450, 100, { c: 20, d: 0.4 }),
    txt('되고 싶으신가요?', 680, 570, 100, { c: 20, d: 0.6 }),
  ] },
  { c: [21, 22], els: [
    ico('person', 620, 480, 260, { c: 21 }),
    ico('chat', 1040, 300, 380, { c: 21, d: 0.2, accent: '#1E1E1E' }),
    txt('돈이 많으면\n좋잖아요', 1040, 290, 52, { c: 21, d: 0.35 }),
    ico('check', 1400, 560, 180, { c: 22 }),
    txt('맞는 말입니다', 1400, 720, 56, { c: 22, d: 0.15 }),
  ] },
  { c: [23, 23], els: [
    chr(760, 800, 560, { c: 23, tilt: -0.05 }),
    { k: 'dots', x: 1040, y: 300, c: 23, d: 0.3, anim: 'none' },
    txt('한 번만 {더}', 1340, 420, 84, { c: 23, d: 0.4 }),
    txt('생각해 보세요', 1340, 530, 84, { c: 23, d: 0.6 }),
  ] },
  { c: [24, 24], els: [
    card(600, 420, { w: 480, h: 420, icon: 'person', label: '지금', c: 24, color: GREY }),
    arrow(880, 420, 160, 0, { c: 24, d: 0.4, color: RED }),
    card(1320, 420, { w: 480, h: 420, icon: 'question', label: '돈이 많아지면', hl: true, c: 24, d: 0.6 }),
    txt('무엇이 {달라졌으면} 좋겠나요?', cx, 770, 60, { c: 24, d: 1.0 }),
  ] },
  { c: [25, 27], els: [
    card(500, 450, { w: 420, h: 440, icon: 'gift', label: '부모님\n생활비', isz: 130, c: 25 }),
    card(cx, 450, { w: 420, h: 440, icon: 'plane', label: '가족 여행', isz: 130, c: 26 }),
    card(1420, 450, { w: 420, h: 440, icon: 'clock', label: '일하는 시간\n줄이기', isz: 130, c: 27, hl: true }),
  ] },
  { c: [28, 28], els: [
    txt('이유가 다르면', cx, 160, 56, { c: 28, color: GREY }),
    ico('gift', 620, 290, 110, { c: 28, d: 0.2 }), ico('plane', cx, 290, 110, { c: 28, d: 0.3 }), ico('clock', 1300, 290, 110, { c: 28, d: 0.4 }),
    { k: 'bar', x: 620, y: 720, v: 160, w: 140, c: 28, d: 0.7, anim: 'none' },
    { k: 'bar', x: cx, y: 720, v: 260, w: 140, c: 28, d: 0.8, color: RED, anim: 'none' },
    { k: 'bar', x: 1300, y: 720, v: 340, w: 140, c: 28, d: 0.9, anim: 'none' },
    txt('필요한 돈도, 준비할 일도 {다르다}', cx, 800, 56, { c: 28, d: 1.4 }),
  ] },
  { c: [29, 31], els: [
    ico('family', 560, 330, 230, { c: 29 }),
    ico('plane', 860, 260, 150, { c: 29, d: 0.3, move: { dx: 120, dy: -40, dur: 2 } }),
    txt('가족 여행', 600, 530, 56, { c: 29, d: 0.4 }),
    card(1180, 330, { w: 300, h: 300, icon: 'calendar', label: '언제', c: 30 }),
    card(1520, 330, { w: 300, h: 300, icon: 'pin', label: '어디로', c: 30, d: 0.5 }),
    txt('모아야 할 돈', 700, 700, 48, { c: 31 }),
    { k: 'hbar', x: 1220, y: 700, w: 680, h: 30, c: 31, d: 0.1, v: 0.72, fdur: 1.6 },
  ] },
  { c: [32, 33], els: [
    { k: 'pie', x: 640, y: 400, r: 190, v: 0.75, to: 0.42, toAt: 0.4, label: '일하는 시간', c: 32 },
    arrow(900, 400, 140, 0, { c: 33, color: RED }),
    ico('house', 1300, 340, 220, { c: 33, d: 0.3 }),
    txt('덜 일해도\n생활할 수 있는 방법', 1300, 600, 54, { c: 33, d: 0.5 }),
  ] },
  { c: [34, 35], els: [
    chip('“돈을 더 벌고 싶다”', cx, 190, { size: 50, c: 34 }),
    ln(cx, 250, -440, 180, { c: 35, color: '#555' }), ln(cx, 250, 0, 180, { c: 35, color: '#555' }), ln(cx, 250, 440, 180, { c: 35, color: '#555' }),
    card(520, 600, { w: 380, h: 320, icon: 'piggy', label: '여행 자금 모으기', lsize: 36, c: 35, d: 0.4 }),
    card(cx, 600, { w: 380, h: 320, icon: 'house', label: '생활비 구조 만들기', lsize: 36, c: 35, d: 0.55 }),
    card(1400, 600, { w: 380, h: 320, icon: 'gift', label: '부모님께 드리기', lsize: 36, c: 35, d: 0.7 }),
  ] },
  { c: [36, 37], els: [
    ico('target', 600, 400, 240, { c: 36, color: GREY, accent: GREY }),
    ico('cross', 600, 400, 200, { c: 36, d: 0.3 }),
    txt('목표가 없으면', 600, 620, 56, { c: 36, d: 0.2 }),
    { k: 'rect', x: 1300, y: 400, w: 200, h: 380, r: 24, color: '#444', lw: 4, c: 37, anim: 'none' },
    { k: 'custom', x: 1300, y: 400, c: 37, anim: 'none', draw: lt => {
      const lvl = 0.55 + 0.25 * Math.sin(lt * 2.4);
      ctx.fillStyle = RED; const h = 340 * lvl; rrect(-80, 170 - h, 160, h, 14); ctx.fill();
    } },
    txt('계속 {부족}하다', 1300, 660, 56, { c: 37, d: 0.4 }),
  ] },
  { c: [38, 39], els: [
    { k: 'stairs', x: 480, y: 760, n: 3, sw: 340, sh: 150, c: 38, anim: 'none' },
    ico('person', 650, 520, 130, { c: 38, d: 0.3 }), txt('500만 원', 650, 680, 48, { c: 38, d: 0.3 }),
    ico('person', 990, 370, 130, { c: 38, d: 1.0 }), txt('1,000만 원', 990, 530, 48, { c: 38, d: 1.0 }),
    ico('person', 1330, 220, 130, { c: 39, d: 0.6, color: RED }), txt('{그 이상}', 1330, 380, 48, { c: 39, d: 0.6 }),
    ico('eye', 820, 280, 80, { c: 38, d: 1.5 }), ico('eye', 1160, 130, 80, { c: 39, d: 1.2 }),
  ] },
  { c: [40, 40], els: [
    ico('person', 560, 340, 140, { c: 40, color: GREY }), ico('person', 960, 220, 140, { c: 40, d: 0.1, color: GREY }), ico('person', 1360, 340, 140, { c: 40, d: 0.2, color: GREY }),
    { k: 'custom', x: cx, y: 470, c: 40, d: 0.3, anim: 'none', draw: lt => {
      const k = (lt - 0.3) * 0.9, ph = Math.floor(k) % 3, f = easeInOut(k - Math.floor(k));
      const pts = [[-400, -40], [0, -170], [400, -40]]; const a = pts[ph], b = pts[(ph + 1) % 3];
      ctx.translate(lerp(a[0], b[0], f) * 0.6, lerp(a[1], b[1], f) * 0.6 + 60); ctx.scale(1.3, 1.3); ICONS.target(WHITE, RED);
    } },
    txt('남을 볼 때마다 {목표가 바뀐다}', cx, 760, 64, { c: 40, d: 0.6 }),
  ] },
  { c: [41, 42], els: [
    ico('family', 400, 400, 230, { c: 41 }),
    { k: 'bar', x: 900, y: 640, v: 160, to: 420, toAt: 2.9, w: 170, label: '수입', c: 41, d: 0.5, anim: 'none' },
    { k: 'bar', x: 1250, y: 640, v: 380, to: 110, toAt: 2.9, w: 170, label: '가족과의 시간', color: RED, c: 41, d: 0.7, anim: 'none' },
    arrow(1480, 280, 0, 260, { c: 42, d: 0.4, color: RED }),
  ] },
  { c: [43, 43], els: [
    ico('flag', 460, 420, 200, { c: 43 }),
    txt('처음 원했던 삶', 460, 600, 48, { c: 43, d: 0.1 }),
    ln(560, 500, 900, -260, { c: 43, d: 0.3, dash: [12, 14], color: '#555', draw: 2.2 }),
    ico('coin', 640, 470, 120, { c: 43, d: 0.3, move: { dx: 760, dy: -220, dur: 2.4, delay: 0.1 } }),
    txt('수입 {↑}  삶과는 {멀어짐}', cx, 780, 60, { c: 43, d: 1.4 }),
  ] },
  { c: [44, 46], els: [
    chip('“얼마를 벌고 싶다”', 760, 220, { size: 46, c: 44 }),
    txt('{+}', 1110, 220, 90, { c: 44, d: 0.5 }),
    chr(1500, 520, 380, { c: 45 }),
    txt('이 문장도 완성해 보세요', 760, 340, 48, { c: 45, d: 0.2, color: GREY }),
    { k: 'rect', x: cx, y: 620, w: 1300, h: 200, r: 26, color: RED, lw: 4, fill: '#0E0E0E', c: 46, anim: 'pop' },
    { k: 'custom', x: cx, y: 620, c: 46, d: 0.1, draw: lt => {
      const a = '나는 돈을 벌어서 ', b = ' 하고 싶다', bw = 180;
      const wa = richWidth(a, 70, 700), wb = richWidth(b, 70, 700), x0 = -(wa + bw + wb) / 2;
      drawRich(a, x0, 0, 70, { align: 'left' }); drawRich(b, x0 + wa + bw, 0, 70, { align: 'left' });
      ctx.save(); ctx.globalAlpha *= 0.6 + 0.4 * Math.abs(Math.sin(lt * 2.5)); ctx.fillStyle = RED; rrect(x0 + wa, -48, bw, 96, 12); ctx.fill(); ctx.restore();
      drawRich('○○', x0 + wa + bw / 2, 2, 64);
    } },
  ] },
  { c: [47, 48], els: [
    { k: 'custom', x: cx, y: 380, c: 47, anim: 'none', draw: lt => {
      const f = easeInOut((lt - 0.2) / 2); ctx.filter = `blur(${(1 - f) * 14}px)`; ctx.scale(2.6, 2.6); ICONS.target(WHITE, RED); ctx.filter = 'none';
    } },
    txt('답이 {구체적}일수록', cx, 140, 56, { c: 47, d: 0.2 }),
    ico('clock', 460, 380, 150, { c: 48 }), arrow(560, 380, 200, 0, { c: 48, d: 0.3 }),
    ico('coin', 1460, 380, 150, { c: 48, d: 0.2 }), arrow(1360, 380, -200, 0, { c: 48, d: 0.4 }),
    txt('기회 선택 · 시간과 돈 쓰기가 {쉬워진다}', cx, 700, 58, { c: 48, d: 0.8 }),
  ] },
  { c: [49, 49], els: [
    card(600, 400, { w: 420, h: 400, icon: 'heart', label: '원하는 삶', c: 49 }),
    arrow(840, 400, 220, 0, { c: 49, d: 1.0 }),
    ico('coins', 1320, 380, 220, { c: 49, d: 1.4, color: GREY, accent: '#555' }),
    ico('cross', 1320, 380, 220, { c: 49, d: 2.6 }),
    txt('돈이 {저절로} 생기지는 않는다', cx, 760, 64, { c: 49, d: 2.8 }),
  ] },
  { c: [50, 50], els: [
    ico('coin', 900, 390, 220, { c: 50 }),
    ico('magnifier', 1040, 330, 260, { c: 50, d: 0.3, move: { dx: -60, dy: 30, dur: 1.4, delay: 0.3 } }),
    txt('필요한 돈을 {벌 방법}도 찾아야 한다', cx, 720, 64, { c: 50, d: 0.6 }),
  ] },
  { c: [51, 51], els: [
    chr(1680, 800, 420, { c: 51 }),
    card(560, 400, { w: 400, h: 380, icon: 'briefcase', label: '지금 하는 일', c: 51 }),
    txt('{+}', 900, 400, 110, { c: 51, d: 0.5 }),
    { k: 'rect', x: 1200, y: 400, w: 380, h: 360, r: 22, color: RED, lw: 3, dash: [16, 12], c: 51, d: 0.8 },
    ico('question', 1200, 360, 130, { c: 51, d: 1.0 }),
    txt('새로운 수입', 1200, 520, 46, { c: 51, d: 1.0 }),
    txt('또 다른 방법은 없을까?', 860, 760, 58, { c: 51, d: 1.6 }),
  ] },
  // ---------------- 02 ----------------
  chapter('02', '다른 사람에게 필요한 가치를 찾아라', 52),
  { c: [53, 54], els: [
    ico('coins', 560, 400, 220, { c: 53 }),
    txt('돈을 더 벌고 싶을 때', 560, 600, 50, { c: 53, d: 0.2 }),
    arrow(720, 400, 360, 0, { c: 54 }),
    ico('briefcase', 1300, 400, 220, { c: 54, d: 0.3 }),
    ico('magnifier', 1400, 300, 120, { c: 54, d: 0.6 }),
    txt('지금 하는 일에서 답을 찾는다', 1300, 600, 50, { c: 54, d: 0.5 }),
  ] },
  { c: [55, 55], els: [
    ico('person', 400, 420, 150, { c: 55 }),
    arrow(500, 420, 380, 0, { c: 55, d: 0.2, color: GREY }),
    ico('coin', 980, 420, 110, { c: 55, d: 0.5, color: GREY, accent: '#666' }),
    arrow(500, 420, 380, -230, { c: 55, d: 1.0, color: RED }),
    arrow(500, 420, 380, 230, { c: 55, d: 1.2, color: RED }),
    ico('coin', 980, 190, 110, { c: 55, d: 1.4 }), ico('coin', 980, 650, 110, { c: 55, d: 1.6 }),
    txt('꼭 {같은 방식}으로만\n벌어야 할까?', 1430, 420, 64, { c: 55, d: 0.8 }),
  ] },
  { c: [56, 56], els: [
    ico('shop', 800, 400, 300, { c: 56 }),
    ico('bread', 1160, 460, 170, { c: 56, d: 0.3 }),
    ico('person', 1160, 260, 110, { c: 56, d: 0.5 }),
    txt('빵집을 운영하는 사람', cx, 720, 64, { c: 56, d: 0.6 }),
  ] },
  { c: [57, 58], els: [
    ico('shop', 600, 400, 280, { c: 57 }),
    ico('chartUp', 600, 160, 120, { c: 57, d: 0.3 }),
    txt('매출을 높이려면', 600, 620, 52, { c: 57, d: 0.3 }),
    ico('person', 1500, 420, 110, { c: 58, move: { dx: -620, dur: 1.8 } }),
    ico('person', 1650, 420, 110, { c: 58, d: 0.2, move: { dx: -620, dur: 1.8 } }),
    ico('person', 1800, 420, 110, { c: 58, d: 0.4, move: { dx: -620, dur: 1.8 } }),
    txt('손님이 {더 많이}', 1260, 620, 52, { c: 58, d: 0.6 }),
  ] },
  { c: [59, 60], els: [
    ico('shop', cx, 380, 240, { c: 59 }),
    ln(800, 400, -220, 0, { c: 59, d: 0.2, dash: [12, 12], color: '#555' }),
    card(420, 400, { w: 360, h: 380, icon: 'house', label: '집에서 빵을\n만들고 싶은 사람', lsize: 34, c: 59, d: 0.4 }),
    ln(1120, 400, 220, 0, { c: 60, dash: [12, 12], color: '#555' }),
    card(1500, 400, { w: 360, h: 380, icon: 'building', label: '직원 간식을\n주문하려는 회사', lsize: 34, c: 60, d: 0.2 }),
  ] },
  { c: [61, 61], els: [
    ico('shop', cx, 300, 200, { c: 61 }),
    arrow(860, 420, -200, 140, { c: 61, d: 0.3, color: RED }), arrow(1060, 420, 200, 140, { c: 61, d: 0.5, color: RED }),
    card(560, 640, { w: 400, h: 260, icon: 'cap', label: '제빵 수업', c: 61, d: 0.6, hl: true }),
    card(1360, 640, { w: 400, h: 260, icon: 'box', label: '단체 주문', c: 61, d: 0.8, hl: true }),
  ] },
  { c: [62, 63], els: [
    ico('bread', cx, 220, 180, { c: 62 }), txt('빵 만드는 능력', cx, 350, 50, { c: 62, d: 0.2 }),
    ln(cx, 400, -480, 140, { c: 63, color: '#555' }), ln(cx, 400, 0, 140, { c: 63, color: '#555' }), ln(cx, 400, 480, 140, { c: 63, color: '#555' }),
    card(480, 650, { w: 340, h: 220, icon: 'shop', label: '매장 판매', isz: 80, lsize: 36, c: 63, d: 0.3 }),
    card(cx, 650, { w: 340, h: 220, icon: 'cap', label: '제빵 수업', isz: 80, lsize: 36, c: 63, d: 0.45 }),
    card(1440, 650, { w: 340, h: 220, icon: 'box', label: '단체 주문', isz: 80, lsize: 36, c: 63, d: 0.6 }),
    txt('누구에게 무엇을 해주느냐', cx, 860 - 30, 0, { c: 63 }),
  ] },
  { c: [64, 64], els: [
    ico('worker', cx, 360, 280, { c: 64 }),
    ico('briefcase', 1180, 470, 120, { c: 64, d: 0.2 }),
    txt('직장인도 {마찬가지}', cx, 700, 72, { c: 64, d: 0.3 }),
  ] },
  { c: [65, 65], els: [
    ico('grid', 760, 400, 300, { c: 65 }),
    ico('check', 1180, 340, 130, { c: 65, d: 0.6 }),
    txt('엑셀 자료 정리', 1240, 470, 56, { c: 65, d: 0.4 }),
    txt('{익숙한} 일', 1240, 560, 56, { c: 65, d: 0.7 }),
  ] },
  { c: [66, 66], els: [
    ico('shop', 600, 380, 240, { c: 66 }),
    txt('작은 가게 사장님', 600, 580, 50, { c: 66, d: 0.2 }),
    ico('doc', 1220, 360, 200, { c: 66, d: 0.6 }),
    ico('question', 1360, 260, 110, { c: 66, d: 1.0 }),
    txt('매출 · 비용 정리 = {큰 고민}', 1260, 580, 50, { c: 66, d: 1.2 }),
  ] },
  { c: [67, 67], els: [
    card(600, 420, { w: 480, h: 420, icon: 'person', label: '나 → {쉬운 일}', c: 67 }),
    card(1320, 420, { w: 480, h: 420, icon: 'person', label: '누군가 → {어려운 일}', c: 67, d: 0.8, color: GREY }),
    ico('exclaim', 1500, 280, 110, { c: 67, d: 1.4 }),
  ] },
  { c: [68, 69], els: [
    ico('key', 560, 360, 200, { c: 68 }), txt('내 능력', 560, 520, 50, { c: 68, d: 0.2 }),
    arrow(720, 360, 300, 0, { c: 68, d: 0.5 }),
    { k: 'custom', x: 1240, y: 360, c: 68, d: 0.6, anim: 'pop', draw: lt => { ctx.scale(2, 2); (lt > 2.2 ? ICONS.unlock : ICONS.lock)(WHITE, RED); } },
    txt('누군가의 문제', 1240, 520, 50, { c: 68, d: 0.7 }),
    ico('coin', 700, 720, 140, { c: 69 }),
    txt('= 돈을 벌 수 있는 {가치}', 800, 720, 66, { c: 69, d: 0.2, align: 'left' }),
  ] },
  { c: [70, 72], els: [
    chr(400, 820, 480, { c: 70 }),
    txt('새로운 기회를 찾으려면', 1140, 200, 56, { c: 70, d: 0.2 }),
    card(1140, 420, { w: 980, h: 170, label: '“뭘 해야 돈을 많이 벌까?”', lsize: 50, c: 71, dimAt: 2.6 }),
    txt('{+} 이런 질문도', 1140, 640, 56, { c: 72 }),
  ] },
  { c: [73, 74], els: [
    card(cx, 330, { w: 1240, h: 190, label: '“사람들은 어떤 일로 {불편해할까}?”', lsize: 56, c: 73 }),
    card(cx, 600, { w: 1240, h: 190, label: '“그중에서 내가 {도와줄 수 있는} 건 뭘까?”', lsize: 56, c: 74, hl: true }),
  ] },
  { c: [75, 76], els: [
    ico('chat', 520, 330, 150, { c: 75 }), ico('chat', 820, 250, 120, { c: 75, d: 0.3, accent: '#DDD' }), ico('chat', 1120, 330, 150, { c: 75, d: 0.6 }),
    txt('다른 분야의 이야기', 820, 520, 50, { c: 75, d: 0.5 }),
    ico('person', 1260, 640, 110, { c: 76 }), ico('person', 1480, 640, 110, { c: 76, d: 0.2 }), ico('person', 1700, 640, 110, { c: 76, d: 0.4 }),
    ico('question', 1260, 520, 70, { c: 76, d: 0.6 }), ico('question', 1480, 520, 70, { c: 76, d: 0.7 }), ico('question', 1700, 520, 70, { c: 76, d: 0.8 }),
    txt('다른 일을 하는 사람들의 {고민}', 760, 700, 50, { c: 76, d: 0.6 }),
  ] },
  { c: [77, 78], els: [
    card(600, 420, { w: 460, h: 400, icon: 'star', label: '내게는 {당연한} 경험', lsize: 38, c: 77 }),
    arrow(860, 420, 200, 0, { c: 78, color: RED }),
    card(1320, 420, { w: 460, h: 400, icon: 'heart', label: '누군가에겐 {필요한} 도움', lsize: 38, c: 78, d: 0.3, hl: true }),
  ] },
  { c: [79, 80], els: [
    ico('bulb', 640, 380, 260, { c: 79 }), txt('아이디어', 640, 580, 52, { c: 79, d: 0.2 }),
    arrow(820, 380, 300, 0, { c: 80, dash: [12, 12] }),
    ico('coin', 1280, 380, 220, { c: 80, d: 0.3, color: GREY, accent: '#555' }),
    ico('cross', 1280, 380, 200, { c: 80, d: 0.7 }),
    txt('{바로} 돈이 되지는 않는다', 1280, 580, 52, { c: 80, d: 0.6 }),
  ] },
  { c: [81, 82], els: [
    ico('doc', 520, 420, 280, { c: 81 }),
    { k: 'rect', x: 860, y: 340, w: 64, h: 64, r: 10, color: '#666', c: 81, d: 0.2 },
    txt('필요로 하는 사람이 실제로 있는가', 920, 340, 50, { c: 81, d: 0.3, align: 'left' }),
    ico('check', 860, 336, 70, { c: 81, d: 1.1 }),
    { k: 'rect', x: 860, y: 520, w: 64, h: 64, r: 10, color: '#666', c: 82 },
    txt('돈을 낼 만큼 도움이 되는가', 920, 520, 50, { c: 82, d: 0.1, align: 'left' }),
    ico('check', 860, 516, 70, { c: 82, d: 1.0 }),
  ] },
  { c: [83, 84], els: [
    card(cx, 300, { w: 760, h: 170, icon: null, label: '지금 하는 일을 {더 많이} 하기', lsize: 52, c: 83 }),
    chip('유일한 방법', cx, 470, { size: 44, c: 83, d: 0.6 }),
    strike(cx, 470, 360, { c: 84, d: 0.6 }),
    ico('check', 640, 680, 80, { c: 84, d: 1.0 }), ico('check', cx, 680, 80, { c: 84, d: 1.15 }), ico('check', 1280, 680, 80, { c: 84, d: 1.3 }),
  ] },
  { c: [85, 86], els: [
    ico('star', 560, 400, 230, { c: 85 }), txt('이미 가진 능력', 560, 590, 52, { c: 85, d: 0.2 }),
    arrow(720, 400, 360, -150, { c: 86, color: RED }), arrow(720, 400, 380, 0, { c: 86, d: 0.2, color: RED }), arrow(720, 400, 360, 150, { c: 86, d: 0.4, color: RED }),
    ico('coin', 1180, 250, 110, { c: 86, d: 0.5 }), ico('coin', 1210, 400, 110, { c: 86, d: 0.65 }), ico('coin', 1180, 550, 110, { c: 86, d: 0.8 }),
    txt('새로운 수입의 {기회}', 1380, 720, 52, { c: 86, d: 1.0 }),
  ] },
  { c: [87, 88], els: [
    ico('bulb', 640, 400, 240, { c: 87 }), txt('새로운 방법 발견', 640, 600, 50, { c: 87, d: 0.2 }),
    { k: 'dots', x: 960, y: 400, c: 88, anim: 'none' },
    ico('coin', 1280, 400, 200, { c: 88, d: 0.3, color: GREY, accent: '#555' }), ico('cross', 1280, 400, 190, { c: 88, d: 0.7 }),
    txt('생각만으로는 {벌 수 없다}', 1280, 600, 50, { c: 88, d: 0.6 }),
  ] },
  { c: [89, 89], els: [
    chip('직접 해보기', 640, 420, { size: 56, c: 89 }),
    arrow(860, 420, 200, 0, { c: 89, d: 0.5, color: RED }),
    chip('가능성 확인', 1280, 420, { size: 56, c: 89, d: 0.8, hl: true }),
  ] },
  { c: [90, 91], els: [
    card(560, 400, { w: 380, h: 380, icon: 'book', label: '새로운 배움', c: 90 }),
    card(cx, 400, { w: 380, h: 380, icon: 'box', label: '상품 만들기', c: 91 }),
    arrow(1170, 400, 120, 0, { c: 91, d: 0.6, color: RED }),
    ico('coins', 1460, 400, 220, { c: 91, d: 0.9 }),
    txt('{비용}이 필요하다', 1460, 600, 48, { c: 91, d: 1.0 }),
  ] },
  { c: [92, 93], els: [
    ico('piggy', 700, 400, 300, { c: 92 }),
    ico('coin', 700, 120, 90, { c: 93, move: { dy: 150, dur: 0.7 }, out: 0.9 }),
    ico('coin', 700, 120, 90, { c: 93, d: 0.8, move: { dy: 150, dur: 0.7 }, out: 1.7 + (93 - 92) * 0 }),
    txt('기회를 {시도할} 수 있는 돈', 1300, 380, 56, { c: 93, d: 0.2 }),
    { k: 'hbar', x: 1300, y: 480, w: 560, h: 26, c: 93, d: 0.4, v: 0.8 },
  ] },
  { c: [94, 95], els: [
    ico('coins', 440, 360, 180, { c: 94 }), txt('{+}', 620, 360, 80, { c: 94, d: 0.2 }), ico('bulb', 780, 360, 180, { c: 94, d: 0.3 }),
    ico('check', 620, 560, 90, { c: 94, d: 0.8 }),
    arrow(920, 360, 260, 0, { c: 95, dash: [12, 12] }),
    chip('수입', 1400, 360, { size: 56, c: 95, d: 0.3 }),
    txt('{저절로} 되지는 않는다', 1400, 560, 52, { c: 95, d: 0.6 }),
  ] },
  { c: [96, 97], els: [
    ico('megaphone', 560, 380, 260, { c: 96 }),
    ico('person', 1100, 300, 110, { c: 96, d: 0.4 }), ico('person', 1260, 380, 110, { c: 96, d: 0.55 }), ico('person', 1420, 300, 110, { c: 96, d: 0.7 }),
    txt('필요한 사람에게 {알리기}', 760, 620, 52, { c: 96, d: 0.6 }),
    ico('coin', 1260, 560, 110, { c: 97, move: { dx: -540, dur: 1.4, delay: 0.3 } }),
    txt('실제로 돈을 버는 {방법}', 1260, 720, 52, { c: 97, d: 0.6 }),
  ] },
  // ---------------- 03 ----------------
  chapter('03', '가치를 돈으로 바꾸는 기술을 배워라', 98),
  { c: [99, 99], els: [
    chr(800, 800, 560, { c: 99 }),
    ico('exclaim', 1100, 280, 160, { c: 99, d: 0.3 }),
    txt('알아야 할 {한 가지}', 1400, 480, 64, { c: 99, d: 0.5 }),
  ] },
  { c: [100, 101], els: [
    card(560, 420, { w: 480, h: 400, icon: 'briefcase', label: '일을 잘하는 것', c: 100 }),
    neq(cx, 420, { c: 101 }),
    card(1360, 420, { w: 480, h: 400, icon: 'coins', label: '그 능력으로 돈을 버는 것', lsize: 34, c: 101, d: 0.3, hl: true }),
  ] },
  { c: [102, 103], els: [
    ico('star', 480, 400, 220, { c: 102 }), txt('좋은 능력', 480, 590, 50, { c: 102, d: 0.2 }),
    ln(620, 400, 200, 0, { c: 102, d: 0.6, dash: [12, 12], color: '#666' }),
    ln(1100, 400, 200, 0, { c: 102, d: 0.8, dash: [12, 12], color: '#666' }),
    ico('question', 960, 390, 110, { c: 102, d: 1.0 }),
    ico('person', 1440, 400, 160, { c: 102, d: 1.2, color: GREY }),
    txt('필요한 사람', 1440, 590, 50, { c: 102, d: 1.2, color: GREY }),
    txt('실제 수입으로 {이어지기 어렵다}', cx, 760, 58, { c: 103 }),
  ] },
  { c: [104, 105], els: [
    chip('무조건 더 일하기', 560, 400, { size: 52, c: 104 }),
    strike(560, 400, 460, { c: 104, d: 0.8 }),
    ico('person', 1320, 420, 220, { c: 105 }),
    ico('magnifier', 1420, 360, 200, { c: 105, d: 0.3 }),
    txt('내게 {부족한 것}은?', 1320, 680, 56, { c: 105, d: 0.5 }),
  ] },
  { c: [106, 108], els: [
    card(500, 450, { w: 420, h: 420, icon: 'megaphone', label: '나를 알리는 방법', lsize: 36, c: 106 }),
    card(cx, 450, { w: 420, h: 420, icon: 'chat', label: '능력을 설명하는 방법', lsize: 36, c: 107 }),
    card(1420, 450, { w: 420, h: 420, icon: 'magnifier', label: '필요를 알아보는 방법', lsize: 36, c: 108, hl: true }),
  ] },
  { c: [109, 110], els: [
    { k: 'custom', x: cx, y: 420, c: 109, anim: 'none', draw: lt => {
      ctx.strokeStyle = '#2C2C2C'; ctx.lineWidth = 4; circle(0, 0, 230); ctx.stroke();
      const k = easeInOut(lt / 3.6); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 230, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); ctx.stroke();
    } },
    chip('배우기', cx, 190, { size: 42, c: 109 }),
    chip('작게 시도', 1190, 420, { size: 42, c: 109, d: 1.0 }),
    chip('반응 살피기', cx, 650, { size: 42, c: 110 }),
    chip('고쳐 나가기', 730, 420, { size: 42, c: 110, d: 1.0, hl: true }),
  ] },
  { c: [111, 112], els: [
    ico('megaphone', 600, 380, 240, { c: 111 }),
    { k: 'hbar', x: 600, y: 580, w: 320, h: 22, v: 0.2, c: 111, d: 0.4 },
    txt('알리는 방법 {부족}', 600, 660, 50, { c: 111, d: 0.6 }),
    arrow(820, 400, 200, 0, { c: 112, color: RED }),
    ico('screen', 1300, 380, 260, { c: 112, d: 0.2 }),
    txt('콘텐츠 활용', 1300, 600, 56, { c: 112, d: 0.4 }),
  ] },
  { c: [113, 114], els: [
    ico('book', 520, 360, 170, { c: 113 }), ico('gear', 760, 360, 150, { c: 113, d: 0.3 }),
    arrow(880, 360, 160, 0, { c: 113, d: 0.8 }),
    { k: 'custom', x: 1200, y: 360, c: 113, d: 0.9, anim: 'pop', draw: lt => { ctx.scale(1.6, 1.6); (lt > 2.3 ? ICONS.unlock : ICONS.lock)(WHITE, RED); } },
    txt('사람들의 문제 해결', 1200, 520, 46, { c: 113, d: 1.2 }),
    { k: 'rect', x: 860, y: 400, w: 1080, h: 420, r: 26, color: RED, lw: 4, c: 114, anim: 'pop' },
    chip('콘텐츠로 보여주기', 860, 640, { size: 44, hl: true, c: 114, d: 0.3 }),
  ] },
  { c: [115, 115], els: [
    ico('play', cx, 360, 340, { c: 115 }),
    txt('{유튜브}', cx, 640, 100, { c: 115, d: 0.4 }),
  ] },
  { c: [116, 116], els: [
    ico('screen', cx, 400, 240, { c: 116 }),
    ...[[-1, -1], [1, -1], [-1, 1], [1, 1], [-1.3, 0], [1.3, 0]].map(([sx, sy], i) =>
      ico('person', cx + sx * 640, 400 + sy * 240, 90, { c: 116, d: 0.6 + i * 0.12, move: { dx: -sx * 320, dy: -sy * 110, dur: 1.6, delay: 0.3 } })),
    txt('지식과 경험을 공유해 {관심}을 모은다', cx, 780, 54, { c: 116, d: 1.0 }),
  ] },
  { c: [117, 118], els: [
    ico('funnel', 600, 400, 300, { c: 117 }),
    txt('더 구체적인 도움을 원하는 사람', 600, 640, 44, { c: 117, d: 0.3 }),
    arrow(800, 400, 260, 0, { c: 118, color: RED }),
    card(1340, 400, { w: 420, h: 380, icon: 'box', label: '상품 · 서비스', c: 118, d: 0.3, hl: true }),
  ] },
  { c: [119, 120], els: [
    card(520, 380, { w: 400, h: 420, icon: 'person', label: '30대 주부', c: 119 }),
    arrow(760, 380, 140, 0, { c: 119, d: 0.9 }),
    ico('screen', 1080, 360, 200, { c: 119, d: 1.2 }),
    txt('지식 · 경험 → 콘텐츠', 1080, 540, 42, { c: 119, d: 1.4 }),
    { k: 'counter', x: 1500, y: 380, to: 100, fmt: v => v >= 100 ? '{1억} 원' : `{${(v * 100).toLocaleString()}만}`, size: 110, c: 120, d: 0.9, cdur: 1.4, anim: 'pop' },
    txt('매출', 1500, 520, 50, { c: 120, d: 1.1, color: GREY }),
  ] },
  { c: [121, 121], els: [
    chr(800, 800, 560, { c: 121 }),
    ico('key', 1240, 360, 200, { c: 121, d: 0.3 }),
    txt('{중요한} 점', 1240, 520, 72, { c: 121, d: 0.5 }),
  ] },
  { c: [122, 123], els: [
    ico('screen', 560, 380, 260, { c: 122 }),
    ico('heart', 760, 220, 70, { c: 122, d: 0.8, move: { dy: -60, dur: 1.4 } }),
    ico('eye', 400, 220, 70, { c: 122, d: 1.2, move: { dy: -60, dur: 1.4 } }),
    txt('관심을 모았다', 560, 600, 50, { c: 122, d: 0.6 }),
    arrow(780, 380, 340, 0, { c: 123, dash: [12, 12] }),
    ico('coin', 1340, 380, 200, { c: 123, d: 0.3, color: GREY, accent: '#555' }), ico('question', 1460, 260, 100, { c: 123, d: 0.6 }),
    txt('수익으로 {반드시} 이어지진 않는다', 1340, 600, 46, { c: 123, d: 0.7 }),
  ] },
  { c: [124, 126], els: [
    card(500, 400, { w: 420, h: 400, icon: 'target', label: '누구를 대상으로', lsize: 38, c: 124 }),
    card(cx, 400, { w: 420, h: 400, icon: 'box', label: '어떤 상품 · 서비스', lsize: 38, c: 125 }),
    card(1420, 400, { w: 420, h: 400, icon: 'cart', label: '어떻게 구매로 연결', lsize: 38, c: 126, hl: true }),
    arrow(730, 680, 460, 0, { c: 125, color: '#555' }), arrow(1190, 680, 460, 0, { c: 126, color: '#555' }),
  ] },
  { c: [127, 130], els: [
    chr(cx, 800, 560, { c: 127 }),
    ico('play', 560, 260, 140, { c: 127, d: 0.3 }),
    txt('유튜브로 사업 시작', 560, 380, 42, { c: 127, d: 0.4 }),
    ico('question', 1320, 230, 120, { c: 128 }), txt('어떤 경험을?', 1420, 360, 42, { c: 128, d: 0.1 }),
    ico('question', 1440, 520, 100, { c: 129 }), txt('어떤 콘텐츠부터?', 1520, 640, 42, { c: 129, d: 0.1 }),
    txt('{막막}', 560, 600, 110, { c: 130 }),
  ] },
  { c: [131, 132], els: [
    ...[0, 1, 2].map(i => ico('person', 560 + i * 400, 300, 170, { c: 131, d: i * 0.2 })),
    ...[[0.35, 0], [0.75, 1], [0.55, 2]].map(([v, i]) => ({ k: 'hbar', x: 560 + i * 400, y: 470, w: 260, h: 22, v, c: 131, d: 0.6 + i * 0.15 })),
    txt('지식 · 경험', 360, 470, 0, { c: 131 }),
    txt('사람마다 준비된 것이 {다르다}', cx, 680, 60, { c: 132 }),
  ] },
  { c: [133, 135], els: [
    card(520, 400, { w: 400, h: 380, icon: 'screen', label: '무작정 영상 만들기', lsize: 34, c: 133, color: GREY }),
    ico('cross', 520, 360, 160, { c: 133, d: 0.8 }),
    card(cx, 400, { w: 400, h: 380, icon: 'doc', label: '무엇부터 준비할지', lsize: 34, c: 134 }),
    card(1400, 400, { w: 400, h: 380, icon: 'magnifier', label: '먼저 확인', c: 135, hl: true }),
  ] },
  // ---------------- CTA ----------------
  { c: [136, 136], els: [
    { k: 'rect', x: cx, y: 400, w: 1100, h: 300, r: 24, color: '#333', lw: 3, fill: '#101010', c: 136 },
    ico('pushpin', 520, 330, 90, { c: 136, d: 0.3 }),
    txt('고정 댓글', 690, 320, 46, { c: 136, d: 0.3 }),
    { k: 'rect', x: 1000, y: 460, w: 760, h: 100, r: 50, color: RED, lw: 3, c: 136, d: 0.7 },
    ico('link', 700, 460, 70, { c: 136, d: 0.9 }),
    txt('링크', 1040, 460, 48, { c: 136, d: 1.0 }),
  ] },
  { c: [137, 137], els: [
    { k: 'rect', x: cx, y: 410, w: 760, h: 560, r: 24, color: '#333', lw: 3, fill: '#101010', c: 137 },
    ...[0, 1, 2].map(i => ({ k: 'rect', x: 700, y: 230 + i * 110, w: 56, h: 56, r: 10, color: '#666', c: 137, d: 0.2 })),
    ...[0, 1, 2].map(i => ({ k: 'hbar', x: 1010, y: 230 + i * 110, w: 440, h: 16, v: 1, color: '#444', fill: false, c: 137, d: 0.2 })),
    ...[0, 1, 2].map(i => ico('check', 700, 226 + i * 110, 60, { c: 137, d: 0.6 + i * 0.35 })),
    chip('신청 완료', cx, 600, { size: 46, hl: true, c: 137, d: 1.8 }),
  ] },
  { c: [138, 138], els: [
    ico('report', 700, 400, 340, { c: 138 }),
    txt('{기초} 진단표', 1240, 360, 80, { c: 138, d: 0.4 }),
    txt('내 응답을 바탕으로', 1240, 470, 48, { c: 138, d: 0.6, color: GREY }),
  ] },
  { c: [139, 140], els: [
    ico('play', 640, 380, 200, { c: 139 }), txt('{+}', 820, 380, 80, { c: 139, d: 0.3 }), ico('coins', 1000, 380, 200, { c: 139, d: 0.4 }),
    txt('유튜브로 수익 만들기', 820, 600, 52, { c: 139, d: 0.6 }),
    chr(1480, 800, 480, { c: 140 }),
    ico('question', 1700, 300, 110, { c: 140, d: 0.4 }),
  ] },
  { c: [141, 142], last: true, els: [
    chr(560, 820, 600, { c: 141 }),
    ico('pushpin', 1060, 300, 90, { c: 141, d: 0.2 }),
    txt('고정 댓글 링크', 1360, 300, 64, { c: 141, d: 0.3 }),
    txt('내 상황부터', 1300, 460, 90, { c: 142 }),
    txt('{확인}해 보세요', 1300, 580, 90, { c: 142, d: 0.2 }),
    uline(1300, 660, 560, { c: 142, d: 0.6 }),
  ] },
];

// Resolve cue-relative timing into scene-relative seconds.
const CUES = CUES_RAW.map(c => ({ ...c, sub: c.text.replace(/^\*/, '').replace('만들찌', '만들지') }));
const CHAPTERS = [
  { n: '01', title: '목표를 구체적으로 정해라', from: CUES[20].start, to: CUES[51].end },
  { n: '02', title: '다른 사람에게 필요한 가치를 찾아라', from: CUES[53].start, to: CUES[97].end },
  { n: '03', title: '가치를 돈으로 바꾸는 기술을 배워라', from: CUES[99].start, to: CUES[135].end },
];
const SCENES = SCENE_DEFS.map(sd => {
  const start = CUES[sd.c[0]].start, end = CUES[sd.c[1]].end;
  const els = sd.els.filter(e => !(e.k === 'text' && !e.size)).map(e => {
    const at = CUES[e.c ?? sd.c[0]].start - start + (e.d || 0) + 0.05;
    const o = { ...e, at };
    for (const key of ['out', 'dimAt', 'toAt']) if (e[key] !== undefined) o[key] = at + e[key];
    return o;
  });
  return { start, end, els, last: sd.last };
});
// sanity: every cue covered by exactly one scene
(function check() {
  const covered = new Array(CUES.length).fill(0);
  SCENE_DEFS.forEach(sd => { for (let i = sd.c[0]; i <= sd.c[1]; i++) covered[i]++; });
  const bad = covered.map((v, i) => [v, i]).filter(([v]) => v !== 1);
  if (bad.length) throw new Error('cue coverage: ' + JSON.stringify(bad));
})();
