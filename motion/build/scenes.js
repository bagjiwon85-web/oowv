// Scene list. Coordinates are centres on a 1920x1080 canvas.
// Top band (y < 230) is kept empty for the section bar and logo.
const CX = 960, CY = 560;
const pre = 0.12; // visuals start just before the matching word
const at = (i, s) => (s ? W(i, s) : L(i)) - pre;

// ---- custom drawings ----
const svgBox = (w, h, inner, vb) => `<svg width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" style="display:block;overflow:visible">${inner}</svg>`;
const ln = (x1, y1, x2, y2, c = C.ink, w = 5, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

function donut(frac, label) {
  const r = 120, c = 2 * Math.PI * r;
  return svgBox(300, 300, `<circle cx="150" cy="150" r="${r}" fill="none" stroke="#EDEDED" stroke-width="44"/>
    <circle cx="150" cy="150" r="${r}" fill="none" stroke="${C.red}" stroke-width="44" stroke-dasharray="${c * frac} ${c}" transform="rotate(-90 150 150)"/>
    <text x="150" y="168" text-anchor="middle" font-size="52" font-weight="800" fill="${C.ink}">${label}</text>`);
}
function bucket() {
  return svgBox(260, 330, `<path d="M30 40 L230 40 L205 250 Q200 270 180 270 L80 270 Q60 270 55 250 Z" fill="#fff" stroke="${C.ink}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M45 200 L215 200 L208 250 Q204 262 186 262 L74 262 Q58 262 54 250 Z" fill="${C.red}"/>`);
}
function drops() {
  const d = (x, y, s) => `<path d="M${x} ${y} q${-9 * s} ${14 * s} 0 ${20 * s} q${9 * s} ${-6 * s} 0 ${-20 * s}Z" fill="${C.red}"/>`;
  return svgBox(120, 90, d(30, 0, 1.4) + d(70, 30, 1.1) + d(95, 4, 1));
}
function steps() {
  return svgBox(900, 330, `<path d="M0 300 L300 300 L300 200 L600 200 L600 100 L900 100" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="0" y="300" width="300" height="30" fill="#F2F2F2"/><rect x="300" y="200" width="300" height="130" fill="#F2F2F2"/><rect x="600" y="100" width="300" height="230" fill="#F2F2F2"/>`);
}
function seesawBeam() {
  return svgBox(760, 30, `<rect x="0" y="6" width="760" height="14" rx="7" fill="${C.ink}"/>`);
}
function seesawBase() {
  return svgBox(130, 110, `<path d="M65 6 L120 100 L10 100 Z" fill="#fff" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>`);
}
function funnel(redLevel) {
  return svgBox(520, 400, `<path d="M10 20 L510 20 L320 230 L320 380 L200 380 L200 230 Z" fill="#fff" stroke="${C.ink}" stroke-width="7" stroke-linejoin="round"/>`);
}
function dots(pts, col, r = 13) { return pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`).join(''); }
function wheel() {
  let spokes = '';
  for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12; spokes += ln(200 + 170 * Math.cos(a), 200 + 170 * Math.sin(a), 200 + 182 * Math.cos(a), 200 + 182 * Math.sin(a), C.ink, 4); }
  return svgBox(400, 470, `<circle cx="200" cy="200" r="182" fill="#fff" stroke="${C.ink}" stroke-width="7"/><circle cx="200" cy="200" r="170" fill="none" stroke="${C.ink}" stroke-width="3"/>${spokes}
    ${ln(200, 200, 120, 450)}${ln(200, 200, 280, 450)}${ln(80, 455, 320, 455, C.ink, 7)}<circle cx="200" cy="200" r="10" fill="${C.ink}"/>`);
}
function island(w = 460) {
  return svgBox(w, 80, `<path d="M0 20 Q${w / 2} -30 ${w} 20 L${w} 24 Q${w / 2} 80 0 24 Z" fill="#F3EDE6" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`);
}
function waves() {
  let s = '';
  for (let r = 0; r < 3; r++) s += `<path d="M${10 + r * 14} ${20 + r * 28} q15 -12 30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#9CC3E6" stroke-width="5" stroke-linecap="round"/>`;
  return svgBox(220, 100, s);
}
function bars(levels, hiLast) {
  let s = '';
  levels.forEach((h, k) => { const x = 20 + k * 70; s += `<rect x="${x}" y="${260 - h}" width="50" height="${h}" fill="${k === levels.length - 1 && hiLast ? C.red : '#D9D9D9'}"/>`; });
  return svgBox(300, 280, s + ln(0, 262, 300, 262, C.ink, 6));
}
function progress(frac, col) {
  return svgBox(220, 26, `<rect x="2" y="2" width="216" height="22" rx="11" fill="#fff" stroke="${C.ink}" stroke-width="4"/><rect x="6" y="6" width="${208 * frac}" height="14" rx="7" fill="${col}"/>`);
}
function commentCard(hi) {
  return `<div style="width:640px;background:#fff;border:3.5px solid ${C.ink};border-radius:22px;padding:26px 30px;display:flex;gap:22px;align-items:flex-start">
    <div style="width:64px;height:64px;border-radius:50%;background:${C.ink};flex:none;display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <div style="width:24px;height:24px;border-radius:50%;background:#fff;margin-bottom:6px;position:relative;top:-6px"></div></div>
    <div style="flex:1">
      <div style="font-size:28px;font-weight:700;color:${C.ink};display:flex;align-items:center;gap:8px">${svgIcon('pin', 30, C.ink, 2)} 고정 댓글</div>
      <div style="height:14px;background:#E6E6E6;border-radius:7px;margin:16px 0 10px;width:92%"></div>
      <div style="height:14px;background:#E6E6E6;border-radius:7px;margin-bottom:18px;width:70%"></div>
      <div style="display:inline-flex;align-items:center;gap:8px;font-size:28px;font-weight:700;color:${C.red};border:3px solid ${C.red};border-radius:999px;padding:6px 20px;background:${hi ? '#FDECEB' : '#fff'}">${svgIcon('link', 28, C.red, 2.2)} 진단 링크</div>
    </div></div>`;
}

function buildScenes() {
  // ===== Intro =====
  { // 0-1
    const b = B(`${coinSVG(26)}어떻게 더 벌지?`, 1110, 360, { t: at(1, '어떻게'), think: true, tail: 'bl' });
    S(at(0), P(800, 610, 360), b);
  }
  S(at(2), // 2-3
    I('cash-banknote', 600, 560, 220, { t: at(2, '월급') }),
    I('clock-hour-4', 960, 560, 200, { t: at(2, '일을') }),
    I('chart-line', 1320, 560, 210, { t: at(3, '좋은') }));
  S(at(4), Stack(960, 580, 7, { w: 170 }), Mark('circle-check', 1080, 400, 80, { t: at(4, '중요') }));
  S(at(5), // 5-6
    Stack(660, 590, 7, { w: 170 }),
    I('crown', 1260, 570, 230, { t: at(5, '늘어') }),
    T('≠', 960, 570, 130, { color: C.red, t: at(6, '부자') }));
  S(at(7), // 7
    P(560, 610, 320), I('moneybag', 700, 700, 120, { color: C.ink }),
    A(800, 520, 1220, 520, { both: true, color: C.red, t: at(7, '원하는') }),
    I('flag', 1360, 600, 210, { color: C.red, t: at(7, '원하는') }));
  S(at(8), // 8-9
    P(880, 600, 340), I('device-laptop', 1080, 700, 180),
    I('bulb', 600, 400, 130, { color: C.gray, t: at(9, '새로운') }),
    I('bulb', 1320, 400, 130, { color: C.gray, t: at(9, '기회') }),
    I('bulb', 1360, 680, 110, { color: C.gray, t: at(9, '놓칠') }));
  S(at(10), // 10-11
    I('diamond', 660, 560, 230, { color: C.ink }),
    A(830, 560, 1120, 560, { dash: '10 14', t: at(11, '돈을') }),
    Coin(1270, 560, 95, { t: at(11, '돈을') }),
    T('?', 1400, 430, 110, { color: C.red, t: at(11, '모를') }));
  S(at(12), T('부자가 되기 위해<br>무엇을 <span style="color:' + C.red + '">다르게</span> 준비해야 할까?', CX, CY, 84));
  S(at(13), T('부자가 되고 싶다면', CX, 500, 64, { w: 600, color: '#555' }), T('꼭 알아야 할 <span style="color:' + C.red + '">세 가지</span>', CX, 610, 96, { t: at(13, '싶다면') }));
  S(at(14, '세 가지'), // 14-15
    T('01', 600, 360, 52, { color: C.red, w: 800 }), I('target-arrow', 600, 560, 220),
    T('02', 960, 360, 52, { color: C.red, w: 800, t: at(14, '세 가지') + 0.25 }), I('gift', 960, 560, 220, { t: at(14, '세 가지') + 0.25 }),
    T('03', 1320, 360, 52, { color: C.red, w: 800, t: at(14, '세 가지') + 0.5 }), I('refresh', 1320, 560, 220, { color: C.red, t: at(14, '세 가지') + 0.5 }));
  S(at(16), // 16-18
    I('zoom-question', 680, 580, 230),
    A(850, 580, 1060, 580, { dash: '10 14', t: at(18) }),
    I('stairs-up', 1250, 580, 240, { t: at(17, '더 나은') }),
    I('flag', 1330, 400, 110, { color: C.red, t: at(17, '삶을') }));

  // ===== 01 =====
  S(at(19), T(`<span style="font-size:150px;color:${C.red};font-weight:800;margin-right:36px;vertical-align:-10px">01</span>목표를 구체적으로 정해라`, CX, CY, 84));
  { // 20-23
    const b1 = B('왜 부자가 되고 싶으세요?', 880, 330, { t: at(20), tail: 'bl' });
    const b2 = B('“돈이 많으면 좋잖아요”', 1080, 330, { t: at(21), tail: 'br' });
    const b3 = B(`한 번만 <span style="color:${C.red}">더</span> 생각해 볼까요?`, 880, 330, { t: at(23), tail: 'bl' });
    const chk = Mark('circle-check', 1330, 260, 70, { t: at(22) });
    seqOut(b1, b2, b3); chk.t1 = b3.t0;
    S(at(20), P(680, 640, 330), P(1240, 640, 330, { color: '#5E5E5E' }), b1, b2, b3, chk);
  }
  S(at(24), T('돈이 많아지면<br><span style="color:' + C.red + '">무엇이</span> 달라질까?', CX, CY, 92));
  S(at(25), // 25-27
    I('users', 600, 560, 220),
    I('plane', 960, 560, 220, { t: at(26) }),
    I('clock-hour-4', 1320, 560, 210, { t: at(27) }),
    I('arrow-down', 1440, 650, 90, { color: C.red, sw: 2.2, t: at(27, '줄이고') }));
  S(at(28), // 28
    I('users', 640, 390, 150), I('plane', 960, 390, 150), I('clock-hour-4', 1280, 390, 150),
    A(640, 490, 640, 590, { t: at(28, '필요한') }), A(960, 490, 960, 590, { t: at(28, '필요한') }), A(1280, 490, 1280, 590, { t: at(28, '필요한') }),
    Stack(640, 690, 2, { w: 140, t: at(28, '필요한') + .1 }), Stack(960, 670, 4, { w: 140, t: at(28, '필요한') + .25 }), Stack(1280, 650, 6, { w: 140, color: C.red, t: at(28, '필요한') + .4 }));
  S(at(29), // 29-31
    I('users', 880, 370, 150), I('plane', 1060, 370, 150),
    I('calendar', 640, 660, 180, { t: at(30, '언제') }),
    A(760, 660, 840, 660, { t: at(30, '어디로') }),
    I('map-pin', 960, 660, 180, { color: C.red, t: at(30, '어디로') }),
    A(1080, 660, 1160, 660, { t: at(31, '얼마') }),
    I('pig-money', 1280, 660, 190, { t: at(31, '얼마') }));
  {
    const d1 = G(donut(0.999, '10시간'), 960, 570, { t: at(32) });
    const d2 = G(donut(0.5, '5시간'), 740, 570, { t: at(33) });
    d1.t1 = d2.t0;
    S(at(32), d1, d2,
      A(930, 570, 1080, 570, { t: at(33, '생활') }),
      I('home', 1210, 570, 200, { t: at(33, '생활') }),
      Mark('circle-check', 1300, 470, 64, { t: at(33, '고민') }));
  }
  { // 34-35
    const b = B('“돈을 더 벌고 싶다”', CX, 340, { tail: 'b', t: at(34, '돈을') });
    S(at(34), P(700, 660, 320), P(1220, 660, 320, { color: '#5E5E5E' }), b,
      I('pig-money', 700, 380, 150, { t: at(35, '다른') }),
      T('≠', 960, 420, 110, { color: C.red, t: at(35, '다른') + .15 }),
      I('trending-up', 1220, 380, 150, { color: C.red, t: at(35, '다른') + .3 }));
    b.t1 = at(35, '다른');
  }
  S(at(36), G(bucket(), CX, 540), G(drops(), CX + 20, 790, { t: at(37, '부족') }));
  S(at(38), // 38-39
    G(steps(), CX, 640),
    P(660, 560, 170, { color: C.red }),
    P(960, 460, 170, { color: '#6B6B6B', t: at(38, '천만') }),
    P(1260, 360, 170, { color: '#6B6B6B', t: at(39, '그보다') }));
  S(at(40), // 40
    P(960, 690, 270, { color: C.red }),
    P(620, 560, 160, { color: C.gray, t: at(40, '남을') }), P(800, 400, 160, { color: C.gray, t: at(40, '남을') + .12 }),
    P(1120, 400, 160, { color: C.gray, t: at(40, '남을') + .24 }), P(1300, 560, 160, { color: C.gray, t: at(40, '남을') + .36 }),
    I('target', 1120, 280, 80, { color: C.red, t: at(40, '목표') }));
  { // 41-43 seesaw
    const tilt = t => { const a = clamp((t - at(42, '줄어')) / 1.0), b = clamp((t - at(43, '멀어')) / 1.0); return 6 * easeInOut(a) + 4 * easeInOut(b) - 4; };
    const R = 380, cx = CX, cy = 560;
    const onBeam = (dx, dy) => (t, it) => { const ang = tilt(t) * Math.PI / 180; const x = cx + dx * Math.cos(ang) - dy * Math.sin(ang), y = cy + dx * Math.sin(ang) + dy * Math.cos(ang); it.d.style.left = x + 'px'; it.d.style.top = y + 'px'; };
    const beam = G(seesawBeam(), cx, cy, { z: 1, upd: (t, it) => { it.d.style.transform += ` rotate(${tilt(t)}deg)`; } });
    S(at(41), beam, G(seesawBase(), cx, cy + 62),
      I('users', cx, cy, 170, { upd: onBeam(-280, -90) }),
      I('heart', cx, cy, 60, { color: C.red, filled: true, upd: onBeam(-200, -170), t: at(41, '시간을') }),
      Stack(cx, cy, 3, { w: 140, upd: (t, it) => onBeam(280, -48)(t, it), t: at(41, '돈을'), out: at(42, '더 벌수록') + .3 }),
      Stack(cx, cy, 6, { w: 140, upd: (t, it) => onBeam(280, -80)(t, it), t: at(42, '더 벌수록') }),
      I('arrow-down', cx, cy, 90, { color: C.red, sw: 2.4, upd: onBeam(-470, -90), t: at(43, '처음') }),
      I('arrow-up', cx, cy, 90, { color: C.red, sw: 2.4, upd: onBeam(450, -110), t: at(43, '수입') }));
  }
  { // 44-46
    const b1 = B('“얼마를 벌고 싶다”', 1080, 420, { t: at(44, '얼마'), tail: 'bl' });
    const b2 = B(`“나는 돈을 벌어서 <span style="color:${C.red}">○○</span>하고 싶다”`, 1140, 420, { t: at(45, '문장'), tail: 'bl' });
    seqOut(b1, b2);
    S(at(44), P(760, 650, 330), b1, b2);
  }
  S(at(47), // 47-48
    I('target-arrow', CX, 560, 240, { color: C.red }),
    I('clock-hour-4', 560, 420, 150, { t: at(48, '시간') }), A(660, 450, 810, 510, { color: C.red, t: at(48, '시간') }),
    Coin(1360, 420, 70, { t: at(48, '돈을') }), A(1260, 450, 1110, 510, { color: C.red, t: at(48, '돈을') }));
  S(at(49), // 49
    I('flag', 700, 560, 230, { color: C.red }), Mark('circle-check', 790, 430, 64, { t: at(49, '정했다고') }),
    A(870, 570, 1080, 570, { dash: '10 14', t: at(49, '실현') }),
    I('wallet', 1240, 570, 220, { t: at(49, '실현') }),
    T('?', 1380, 430, 110, { color: C.red, t: at(49, '저절로') }));
  S(at(50), // 50-51
    I('briefcase', 700, 560, 220),
    I('pig-money', 960, 700, 150, { t: at(50, '필요한') }),
    A(800, 640, 870, 690, { t: at(50, '필요한') }),
    I('circle-plus', 1240, 460, 200, { color: C.red, t: at(51, '새로운') }),
    A(1180, 560, 1060, 670, { dash: '8 12', color: C.red, t: at(51, '새로운') }));

  // ===== 02 =====
  S(at(52), T(`<span style="font-size:150px;color:${C.red};font-weight:800;margin-right:36px;vertical-align:-10px">02</span>다른 사람에게 필요한 가치를 찾아라`, CX, CY, 84));
  S(at(53), // 53-55
    P(700, 620, 330),
    I('briefcase', 900, 700, 150, { t: at(54) }),
    I('search', 990, 610, 110, { t: at(54, '답을') }),
    A(1080, 600, 1260, 420, { dash: '8 12', t: at(55, '같은') }),
    A(1080, 610, 1260, 610, { dash: '8 12', t: at(55, '같은') + .15 }),
    A(1080, 620, 1260, 800, { dash: '8 12', t: at(55, '같은') + .3 }),
    T('?', 1320, 410, 90, { color: C.red, t: at(55, '같은') }),
    T('?', 1320, 600, 90, { color: C.red, t: at(55, '같은') + .15 }),
    T('?', 1320, 790, 90, { color: C.red, t: at(55, '같은') + .3 }));
  S(at(56), // 56-58
    I('building-store', 720, 560, 280),
    G(bars([60, 110, 180], true), 1240, 430, { t: at(57, '매출') }),
    P(1080, 740, 140, { color: C.gray, t: at(58, '손님') }), P(1240, 740, 140, { color: C.gray, t: at(58, '손님') + .15 }), P(1400, 740, 140, { color: C.gray, t: at(58, '손님') + .3 }));
  { // 59-61
    const b1 = B('“집에서 빵 만들고 싶어요”', 500, 330, { t: at(59, '집에서'), tail: 'b', size: 36 });
    const b2 = B('“직원 간식을 주문할게요”', 1420, 330, { t: at(60), tail: 'b', size: 36 });
    seqOut(b1, b2); b2.t1 = at(61, '제빵');
    S(at(59), P(500, 560, 230, { v: 'bun' }), I('building-store', CX, 560, 200, { t: at(59) }), I('building', 1420, 560, 200, { t: at(60) }), b1, b2,
      A(880, 660, 720, 760, { color: C.red, t: at(61, '제빵') }), I('chef-hat', 640, 790, 130, { color: C.red, t: at(61, '제빵') }),
      A(1040, 660, 1200, 760, { color: C.red, t: at(61, '단체') }), I('packages', 1280, 790, 130, { color: C.red, t: at(61, '단체') }));
  }
  S(at(62), // 62-63
    I('bread', CX, 380, 190),
    A(900, 470, 680, 600, { t: at(63, '누구') }), A(CX, 480, CX, 590, { t: at(63, '누구') }), A(1020, 470, 1240, 600, { t: at(63, '누구') }),
    I('users', 640, 700, 160, { t: at(63, '누구') }), I('chef-hat', CX, 700, 160, { t: at(63, '누구') + .15 }), I('packages', 1280, 700, 160, { t: at(63, '누구') + .3 }));
  { // 64-66
    const b1 = B(`익숙한 일 ${svgIcon('check', 40, C.red, 3)}`, 640, 320, { t: at(65, '익숙'), tail: 'b' });
    const b2 = B('“매출·비용 정리 어려워요”', 1280, 320, { t: at(66, '매출'), tail: 'b' });
    seqOut(b1, b2);
    S(at(64), P(640, 610, 320, { v: 'tie' }), I('table', 820, 700, 140, { color: C.ink, t: at(65, '엑셀') }),
      P(1280, 610, 320, { v: 'apron' }, ), I('receipt', 1100, 700, 140, { t: at(66, '매출') }), b1, b2);
  }
  S(at(67), T(`내게 쉬운 일 = 누군가의 <span style="color:${C.red}">큰 고민</span>`, CX, CY, 88));
  { // 68-69 puzzle
    const t0 = at(68, '해결'), mv = t => easeInOut(clamp((t - t0) / 1.0));
    S(at(68),
      I('puzzle', 1200, 600, 260, { color: C.gray, sw: 1, }),
      I('puzzle', 700, 600, 230, { color: C.red, filled: true, upd: (t, it) => { it.d.style.left = (700 + 500 * mv(t)) + 'px'; } }),
      Coin(1200, 330, 70, { t: at(69, '가치') }));
  }
  { // 70-74
    const b1 = B('“뭘 해야 돈을 많이 벌까?”', 1140, 380, { t: at(71), tail: 'bl' });
    const b2 = B(`“사람들은 어떤 일로 <span style="color:${C.red}">불편해</span>할까?”`, 1160, 380, { t: at(73), tail: 'bl' });
    const b3 = B(`“그중 <span style="color:${C.red}">내가 도와줄 수 있는</span> 건 뭘까?”`, 1180, 380, { t: at(74), tail: 'bl' });
    seqOut(b1, b2, b3);
    S(at(70), P(720, 650, 330), b1, b2, b3);
  }
  S(at(75), // 75-76
    P(CX, 720, 250, { color: C.red }),
    P(600, 520, 170, { color: '#6B6B6B', v: 'chef', t: at(75, '다른') }), P(840, 400, 170, { color: '#6B6B6B', v: 'tie', t: at(75, '다른') + .12 }),
    P(1080, 400, 170, { color: '#6B6B6B', v: 'apron', t: at(75, '다른') + .24 }), P(1320, 520, 170, { color: '#6B6B6B', v: 'bun', t: at(75, '다른') + .36 }),
    T('?', 600, 390, 64, { color: C.red, t: at(76, '고민') }), T('?', 840, 270, 64, { color: C.red, t: at(76, '고민') + .1 }),
    T('?', 1080, 270, 64, { color: C.red, t: at(76, '고민') + .2 }), T('?', 1320, 390, 64, { color: C.red, t: at(76, '고민') + .3 }));
  S(at(77), I('backpack', 700, 560, 230), A(860, 560, 1060, 560, { color: C.red, t: at(78) }), I('heart-handshake', 1230, 560, 240, { color: C.red, t: at(78, '필요한') }));
  { // 79-82
    const x = T('×', CX, 470, 120, { color: C.red, t: at(80, '아닙') });
    const dl = A(640, 560, 1270, 560, { dash: '10 14', t: at(80) });
    x.t1 = dl.t1 = at(81);
    S(at(79), I('bulb', 520, 560, 190), dl, Coin(1400, 560, 85, { t: at(80) }), x,
      A(630, 560, 720, 560, { t: at(81) }), I('users', 830, 560, 170, { t: at(81) }),
      A(940, 560, 1000, 560, { t: at(82) }), I('wallet', 1100, 560, 170, { t: at(82) }),
      A(1200, 560, 1280, 560, { t: at(82, '도움') }),
      Mark('circle-check', 1180, 460, 60, { t: at(82, '확인') }));
  }
  S(at(83), // 83-84
    G(wheel(), 760, 580), I('run', 760, 540, 200, { color: C.red, sw: 1.6 }),
    I('arrows-split-2', 1230, 560, 230, { color: C.red, t: at(84, '유일한') }));
  S(at(85), I('tools', 700, 560, 220), A(860, 560, 1060, 560, { color: C.red, t: at(86) }), I('door-exit', 1230, 560, 230, { color: C.red, t: at(86, '기회') }));
  { // 87-89
    const b = B(`${svgIcon('bulb', 48, C.red, 2)}새로운 방법!`, 900, 350, { think: true, tail: 'bl', t: at(87, '새로운') });
    b.t1 = at(89);
    S(at(87), P(700, 650, 330), b,
      I('flask', 1160, 600, 230, { color: C.red, t: at(89) }));
  }
  S(at(90), // 90-93
    I('book', 600, 560, 200), I('box', 960, 560, 200, { t: at(91, '상품') }),
    I('seedling', 1320, 560, 210, { color: C.red, t: at(93, '돈을') }));
  S(at(94), // 94-95
    I('bulb', 640, 560, 180), T('+', 800, 560, 90, { t: at(94, '아이디어') }), Stack(960, 580, 4, { w: 130, t: at(94, '돈과') }),
    A(1080, 560, 1200, 560, { t: at(95, '저절로') }), Coin(1320, 560, 80, { color: C.gray, t: at(95, '저절로') }),
    T('×', 1320, 560, 170, { color: C.red, t: at(95, '아닙') }));
  S(at(96), // 96-97
    I('speakerphone', 600, 560, 210), I('users', 960, 560, 200, { t: at(96, '필요한') }),
    A(1090, 560, 1190, 560, { color: C.red, t: at(97) }), Coin(1320, 560, 80, { t: at(97, '돈을') }));

  // ===== 03 =====
  S(at(98), T(`<span style="font-size:150px;color:${C.red};font-weight:800;margin-right:36px;vertical-align:-10px">03</span>가치를 돈으로 바꾸는 기술을 배워라`, CX, CY, 84));
  S(at(99), I('alert-circle', CX, CY, 230, { color: C.red, filled: true }));
  S(at(100), I('award', 680, 560, 230), T('≠', CX, 560, 130, { color: C.red, t: at(101, '다르다') }), Stack(1240, 580, 6, { w: 160, t: at(101, '돈을') }));
  S(at(102), // 102-103
    G(island(), 620, 640), P(560, 520, 200, { color: C.red }), I('diamond', 690, 560, 90, { color: C.ink }),
    G(waves(), CX, 640, { t: at(102, '찾지') }),
    G(island(), 1300, 640, { t: at(102, '필요한') }), I('users', 1300, 540, 170, { color: '#555', t: at(102, '필요한') }));
  S(at(104), T('무조건 더 일하기', CX, CY, 84, { color: C.gray, upd: (t, it) => { const p = clamp((t - at(104, '보다')) / .6); it.d.firstChild.style.textDecoration = p > 0 ? 'line-through' : 'none'; it.d.firstChild.style.textDecorationColor = C.red; it.d.firstChild.style.opacity = 1 - .5 * p; } }));
  S(at(105, '부족한'), T(`내게 <span style="color:${C.red}">부족한 것</span>은?`, CX, CY, 100));
  S(at(106), I('speakerphone', 600, 560, 210), I('presentation-analytics', 960, 560, 210, { t: at(107) }), I('user-search', 1320, 560, 210, { t: at(108) }));
  S(at(109), // 109-110 small loop
    I('refresh', CX, 580, 380, { color: '#EEEEEE', sw: 1.2 }),
    I('book', CX, 330, 150, { t: at(109, '배워') }),
    I('flask', 1220, 700, 150, { color: C.red, t: at(109, '작게') }),
    I('message-circle', 700, 700, 150, { t: at(110, '반응') }));
  S(at(111), I('speakerphone', CX, CY, 260));
  S(at(112), // 112-114
    I('video', CX, 560, 220, { color: C.red }),
    I('book', 600, 560, 190, { t: at(113) }), A(730, 560, 820, 560, { t: at(113) }),
    A(1100, 560, 1190, 560, { t: at(113, '문제') }), I('users', 1320, 560, 200, { t: at(113, '문제') }),
    Mark('circle-check', 1420, 450, 64, { t: at(114, '보여') }));
  S(at(115), I('brand-youtube', CX, CY, 300, { color: C.red, filled: true }));
  S(at(116), // 116-118 funnel
    G(funnel(), CX, 560),
    G(svgBox(520, 120, dots([[60, 60], [140, 30], [210, 70], [290, 40], [360, 80], [440, 50]], C.gray)), CX, 300, { t: at(116, '공유') }),
    G(svgBox(140, 260, dots([[70, 30], [56, 90], [84, 150], [70, 210]], C.red)), CX, 600, { t: at(117, '구체') }),
    I('gift', CX, 790, 120, { color: C.red, t: at(118, '상품') }));
  {
    const t1 = at(120, '1억');
    S(at(119), P(760, 620, 330, { v: 'bun' }), I('brand-youtube', 1000, 470, 130, { color: C.red, filled: true, t: at(119, '콘텐츠') }), I('book', 1010, 640, 110, { t: at(119, '지식') }),
      P(1200, 470, 120, { color: C.gray, t: at(120, '필요한') }), P(1340, 560, 120, { color: C.gray, t: at(120, '필요한') + .12 }), P(1200, 660, 120, { color: C.gray, t: at(120, '필요한') + .24 }), P(1340, 750, 120, { color: C.gray, t: at(120, '필요한') + .36 }));
    S(t1, T(`매출 <span style="color:${C.red};font-size:150px">1억 원</span>`, CX, CY, 80));
  }
  S(at(121), I('alert-circle', CX, CY, 230, { color: C.red, filled: true }));
  S(at(122), // 122-123
    I('brand-youtube', 660, 600, 240, { color: C.red, filled: true }),
    I('heart', 600, 400, 60, { color: C.lred, filled: true, t: at(122, '관심') }), I('heart', 690, 350, 50, { color: C.red, filled: true, t: at(122, '관심') + .15 }), I('heart', 760, 420, 44, { color: C.lred, filled: true, t: at(122, '관심') + .3 }),
    A(840, 600, 1100, 600, { dash: '10 14', t: at(123) }),
    Stack(1250, 620, 4, { w: 150, color: C.gray, t: at(123) }), T('×', 1250, 600, 200, { color: C.red, t: at(123, '아니') }));
  S(at(124), I('target', 600, 560, 200), A(730, 560, 820, 560, { t: at(125) }), I('gift', 960, 560, 200, { t: at(125) }),
    A(1090, 560, 1180, 560, { t: at(126) }), I('shopping-cart', 1320, 560, 210, { color: C.red, t: at(126, '구매') }));
  { // 127-130
    const b1 = B('어떤 경험을 쓰지?', 1040, 380, { think: true, tail: 'bl', t: at(128) });
    const b2 = B('어떤 콘텐츠부터?', 1040, 380, { think: true, tail: 'bl', t: at(129) });
    seqOut(b1, b2); b2.t1 = at(130);
    S(at(127), P(760, 650, 330), I('brand-youtube', 560, 430, 110, { color: C.red, filled: true }), b1, b2,
      I('route-x', 1180, 580, 220, { color: C.red, t: at(130) }));
  }
  S(at(131), // 131-132
    P(640, 600, 230), P(CX, 600, 230, { color: C.red, t: at(131) + .12 }), P(1280, 600, 230, { t: at(131) + .24 }),
    I('book', 640, 390, 100, { t: at(131, '지식') }), I('tools', CX, 390, 100, { color: C.red, t: at(131, '지식') + .12 }), I('device-laptop', 1280, 390, 100, { t: at(131, '경험') }),
    G(progress(.25, C.ink), 640, 780, { t: at(132) }), G(progress(.5, C.red), CX, 780, { t: at(132) + .12 }), G(progress(.1, C.ink), 1280, 780, { t: at(132) + .24 }));
  S(at(133), // 133-135
    I('video-off', 700, 560, 230, { color: C.red }),
    I('map', 1220, 560, 240, { t: at(134) }), I('map-pin', 1170, 520, 90, { color: C.red, filled: true, t: at(134, '무엇부터') }),
    Mark('circle-check', 1330, 420, 70, { t: at(135) }));
  S(at(136), mk(commentCard(false), CX, 560, {}));
  S(at(137), // 137-138
    I('clipboard-list', 720, 560, 220), Mark('circle-check', 820, 430, 64, { t: at(137, '완료') }),
    A(870, 560, 1060, 560, { color: C.red, t: at(138) }), I('file-analytics', 1220, 560, 230, { color: C.red, t: at(138, '진단표') }));
  S(at(139), I('brand-youtube', 720, 560, 220, { color: C.red, filled: true }), A(880, 560, 1060, 560), Stack(1220, 580, 5, { w: 160, t: at(139, '수익') }));
  { // 140-142
    const b = B(`${svgIcon('route-x', 44, C.ink, 2)}어디서부터 시작하지?`, 900, 380, { think: true, tail: 'bl', t: at(140) });
    b.t1 = at(141);
    S(at(140), P(620, 650, 330), b,
      mk(commentCard(false), 1100, 560, { t: at(141, '고정') }),
      mk(commentCard(true), 1100, 560, { t: at(142) }),
      I('pointer', 1000, 690, 80, { t: at(142), filled: false }));
  }
}
