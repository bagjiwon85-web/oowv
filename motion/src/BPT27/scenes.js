import { K, ICON, iconSVG, badgeSVG } from './art';
import { C, L, W, clamp, easeOut, easeInOut, lerp, mk, I, P, Bd, T, H, Lb, Tag, G, B, A, S, seqOut } from './engine';

// Scene list. Coordinates are centres on a 1920x1080 canvas.
// The top band (y < 240) stays empty for the section bar (left) and logo (right).
const CX = 960;
const pre = 0.12; // visuals start just before the matching word
const at = (i, s) => (s ? W(i, s) : L(i)) - pre;
const X3 = [600, 960, 1320], X2 = [700, 1220];
const HY = 290;           // headline row
const em = s => `<em>${s}</em>`;

// icon + label underneath (label follows the icon a moment later)
function LI(name, x, y, size, label, t, o = {}) {
  const ic = I(name, x, y, size, Object.assign({ t }, o.icon || {}));
  const lb = Lb(label, x, y + size / 2 + (o.gap || 42), Object.assign({ t: t + 0.18 }, o.label || {}));
  return [ic, lb];
}
const box = (w, h, inner, vb) => `<svg width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" style="display:block;overflow:visible">${inner}</svg>`;

// ---- custom drawings (flat) ----
function donut(frac = 1, label = '10시간') {
  const r = 110, c = 2 * Math.PI * r;
  return box(300, 300, `<circle cx="150" cy="150" r="${r}" fill="none" stroke="${K.grayL}" stroke-width="56"/>
    <circle class="arc" cx="150" cy="150" r="${r}" fill="none" stroke="${K.red}" stroke-width="56" stroke-dasharray="${c * frac} ${c}" transform="rotate(-90 150 150)"/>
    <circle cx="150" cy="150" r="78" fill="#fff"/><text class="lbl" x="150" y="168" text-anchor="middle" font-size="50" font-weight="800" fill="${C.ink}">${label}</text>`);
}
function bucket() {
  return box(260, 300, `<ellipse cx="130" cy="286" rx="96" ry="10" fill="#000" opacity=".07"/>
    <path d="M28 40 L232 40 L208 262 Q204 280 184 280 L76 280 Q56 280 52 262 Z" fill="${K.blueL}"/><path d="M130 40 L232 40 L208 262 Q204 280 184 280 L130 280Z" fill="#C6DCF5"/>
    <path d="M44 196 L216 196 L208 262 Q204 274 186 274 L74 274 Q58 274 52 262 Z" fill="${K.red}"/><path d="M44 196 L216 196" stroke="${K.redD}" stroke-width="6"/>
    <rect x="18" y="28" width="224" height="22" rx="10" fill="${K.navy2}"/><path d="M40 40 C40 -10 220 -10 220 40" stroke="${K.navy2}" stroke-width="7" fill="none"/>`);
}
function drops() {
  const d = (x, y, s) => `<path d="M${x} ${y} q${-10 * s} ${15 * s} 0 ${22 * s} q${10 * s} ${-7 * s} 0 ${-22 * s}Z" fill="${K.red}"/>`;
  return box(120, 90, d(26, 0, 1.4) + d(70, 34, 1.1) + d(98, 6, 1));
}
function steps() {
  return box(960, 300, `<rect x="0" y="216" width="320" height="84" fill="${K.grayL}"/><rect x="320" y="128" width="320" height="172" fill="#E1E4EB"/><rect x="640" y="40" width="320" height="260" fill="#D3D7E0"/>
    <rect x="0" y="210" width="320" height="12" fill="${K.gray}"/><rect x="320" y="122" width="320" height="12" fill="${K.grayD}"/><rect x="640" y="34" width="320" height="12" fill="#848C9C"/>`);
}
function seesawBeam() { return box(780, 30, `<rect x="0" y="6" width="780" height="18" rx="9" fill="${K.navy}"/>`); }
function seesawBase() { return box(140, 120, `<path d="M70 4 L132 110 L8 110 Z" fill="${K.red}"/><path d="M70 4 L132 110 L70 110Z" fill="${K.redD}" opacity=".4"/><ellipse cx="70" cy="114" rx="80" ry="8" fill="#000" opacity=".07"/>`); }
function funnel() {
  return box(520, 420, `<path d="M10 30 L510 30 L320 240 L320 400 L200 400 L200 240 Z" fill="${K.blueL}"/><path d="M260 30 L510 30 L320 240 L320 400 L260 400Z" fill="#C6DCF5"/>
    <rect x="0" y="16" width="520" height="28" rx="12" fill="${K.blueD}"/>`);
}
function wheel() {
  let spokes = '';
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; spokes += `<line x1="200" y1="200" x2="${200 + 168 * Math.cos(a)}" y2="${200 + 168 * Math.sin(a)}" stroke="${K.grayL}" stroke-width="4"/>`; }
  return box(400, 470, `<path d="M200 200 L110 452 M200 200 L290 452" stroke="${K.navy2}" stroke-width="12" stroke-linecap="round"/><rect x="70" y="446" width="260" height="16" rx="8" fill="${K.navy}"/>
    <circle cx="200" cy="200" r="184" fill="#fff" stroke="${K.navy}" stroke-width="12"/><circle cx="200" cy="200" r="168" fill="none" stroke="${K.gray}" stroke-width="4" stroke-dasharray="6 10"/>${spokes}<circle cx="200" cy="200" r="16" fill="${K.navy}"/>`);
}
function runner() { // flat running figure
  return box(200, 240, `<circle cx="112" cy="40" r="24" fill="${K.skin}"/><path d="M90 30 C92 12 132 10 134 30 C122 22 104 24 90 30Z" fill="${K.hair}"/>
    <path d="M100 70 L80 140" stroke="${K.red}" stroke-width="30" stroke-linecap="round"/><path d="M96 82 L130 112 L156 100" stroke="${K.red}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M94 84 L62 104 L50 132" stroke="${K.redD}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M80 140 L118 170 L110 220" stroke="${K.navy}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 140 L56 186 L22 194" stroke="${K.navy2}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
}
function island(w = 440, c = '#F4E7D7') {
  return box(w, 90, `<path d="M0 30 Q${w / 2} -24 ${w} 30 Q${w / 2} 96 0 30 Z" fill="${c}"/><path d="M0 30 Q${w / 2} 96 ${w} 30 Q${w / 2} 60 0 30Z" fill="#E2CFB6"/>`);
}
function waves() {
  let s = '';
  for (let r = 0; r < 3; r++) s += `<path d="M${10 + r * 16} ${20 + r * 30} q16 -14 32 0 t32 0 t32 0 t32 0 t32 0" fill="none" stroke="${K.blue}" stroke-width="7" stroke-linecap="round" opacity="${1 - r * .25}"/>`;
  return box(240, 100, s);
}
function bars() {
  return box(300, 260, `<rect x="20" y="170" width="56" height="80" rx="8" fill="${K.gray}"/><rect x="110" y="110" width="56" height="140" rx="8" fill="${K.grayD}"/><rect x="200" y="40" width="56" height="210" rx="8" fill="${K.red}"/><rect x="0" y="250" width="300" height="8" rx="4" fill="${K.navy}"/>`);
}
function progress(frac, col) {
  return box(240, 30, `<rect x="0" y="0" width="240" height="30" rx="15" fill="${K.grayL}"/><rect x="0" y="0" width="${240 * frac}" height="30" rx="15" fill="${col}"/>`);
}
function commentCard(hi) {
  return `<div style="width:660px;background:#fff;border-radius:26px;padding:30px 34px;display:flex;gap:24px;align-items:flex-start;box-shadow:0 18px 44px rgba(31,36,48,.14);border:2px solid #EEF0F4">
    <div style="flex:none">${badgeSVG({ outfit: 'red', hair: 'short' }, K.redBg, 76)}</div>
    <div style="flex:1">
      <div style="font-size:30px;font-weight:800;color:${C.ink};display:flex;align-items:center;gap:12px"><span style="background:${K.navy};color:#fff;font-size:22px;padding:5px 12px;border-radius:8px">PIN</span> 고정 댓글</div>
      <div style="height:14px;background:#E6E8EE;border-radius:7px;margin:18px 0 10px;width:92%"></div>
      <div style="height:14px;background:#E6E8EE;border-radius:7px;margin-bottom:20px;width:68%"></div>
      <div style="display:inline-flex;align-items:center;gap:10px;font-size:30px;font-weight:800;color:${hi ? '#fff' : K.red};border:3px solid ${K.red};border-radius:999px;padding:8px 26px;background:${hi ? K.red : '#fff'}">진단 링크 →</div>
    </div></div>`;
}
const chapter = (num, icon, title, t) => [
  T(num, CX, 560, 520, { color: '#FDECEB', w: 800, anim: 'fade', t: t - 0.05, z: -1 }),
  I(icon, CX, 420, 210, { t }),
  T(`<span style="color:${K.red};font-size:120px;font-weight:800;margin-right:30px;vertical-align:-8px">${num}</span>${title}`, CX, 650, 80, { t: t + 0.25 }),
];

export function buildScenes() {
  // ===== Intro =====
  S(at(0),
    H(`우리가 ${em('부자')}가 되고 싶을 때`, { t: at(0) }),
    P(800, 650, 380, { hair: 'short', outfit: 'main' }),
    B(`${iconSVG('moneybag', 56)}어떻게 ${em('더')} 벌지?`, 1140, 450, { t: at(1, '어떻게'), think: true, tail: 'bl' }));
  S(at(2),
    H(`돈을 더 벌기 위해 ${em('우리가 하는 일')}`),
    LI('cashUp', X3[0], 590, 210, '월급 올리기', at(2, '월급')),
    LI('clock', X3[1], 590, 200, '더 많이 일하기', at(2, '일을')),
    LI('chart', X3[2], 590, 210, `${em('투자처')} 찾기`, at(3, '좋은')));
  S(at(4),
    I('coins', 820, 600, 260, { arg: 6 }),
    I('check', 930, 470, 90, { t: at(4, '중요') }),
    T(`돈을 많이 버는 것도<br>${em('중요')}합니다`, 1260, 600, 64, { anim: 'right', t: at(4, '버는') }));
  S(at(5),
    LI('coins', X2[0], 570, 240, '수입', at(5), { icon: { arg: 6 } }),
    LI('crown', X2[1], 570, 240, '부자', at(5, '늘어')),
    T('≠', CX, 560, 140, { color: K.red, anim: 'pop', t: at(6, '부자') }),
    I('xmark', X2[1] + 100, 470, 80, { t: at(6, '아닙') }));
  S(at(7),
    H(`돈을 많이 벌어도`),
    P(560, 660, 300, { hair: 'short', outfit: 'main' }), I('moneybag', 700, 730, 130, { t: at(7, '벌어도') }),
    A(800, 600, 1200, 600, { both: true, color: K.red, t: at(7, '원하는') }),
    Lb(em('멀어진다'), 1000, 545, { t: at(7, '멀어') }),
    LI('flag', 1340, 600, 200, '원하는 삶', at(7, '원하는')));
  S(at(8),
    H(`지금 하는 일에만 ${em('집중')}하면`),
    P(880, 660, 330, { hair: 'quiff', outfit: 'blue' }), I('laptop', 1080, 740, 180, { t: at(8, '집중') }),
    I('bulbOff', 600, 480, 130, { t: at(9, '새로운') }), I('bulbOff', 1330, 470, 130, { t: at(9, '기회') }),
    I('bulbOff', 1380, 700, 110, { t: at(9, '놓칠') }),
    Tag('놓친 기회', 1340, 600, { t: at(9, '놓칠') + .2 }));
  S(at(10),
    LI('diamond', 640, 580, 230, '좋은 능력', at(10)),
    A(800, 580, 1110, 580, { dash: '12 14', t: at(11, '능력으로') }),
    LI('coin', 1280, 580, 200, `${em('돈 버는 방법')}`, at(11, '돈을')),
    I('question', 1390, 460, 90, { t: at(11, '모를') }));
  S(at(12),
    T(`부자가 되기 위해<br>무엇을 ${em('다르게')} 준비해야 할까?`, CX, 520, 84),
    Bd(800, 760, 130, { outfit: 'main', hair: 'short', bg: K.grayL, t: at(12, '우리는') }),
    I('question', 900, 700, 60, { t: at(12, '무엇을') }),
    Bd(1120, 760, 130, { outfit: 'purple', hair: 'long', bg: K.yelL, t: at(12, '우리는') + .15 }),
    I('question', 1220, 700, 60, { t: at(12, '다르게') }));
  S(at(13),
    T('부자가 되고 싶다면 꼭 알아야 할', CX, 500, 60, { w: 700, color: '#5A6172' }),
    T(em('세 가지'), CX, 630, 140, { t: at(13, '싶다면'), anim: 'pop' }));
  S(at(14, '세 가지'),
    ...[['target', '목표'], ['gift', '가치'], ['refreshCoin', '기술']].flatMap(([ic, lb], k) => [
      T(`0${k + 1}`, X3[k], 400, 50, { color: K.red, t: at(14, '세 가지') + k * .25 }),
      ...LI(ic, X3[k], 580, 210, lb, at(14, '세 가지') + k * .25)]));
  S(at(16),
    H(`이 영상을 ${em('끝까지')} 보시면`),
    LI('magnifierQ', 640, 600, 220, `${em('놓치고')} 있는 것`, at(16, '무엇을')),
    A(800, 600, 1080, 600, { dash: '12 14', t: at(18) }),
    Tag('무엇부터?', 940, 520, { t: at(18) + .2 }),
    LI('stairs', 1260, 600, 230, `${em('더 나은')} 삶`, at(17, '더 나은')));

  // ===== 01 =====
  S(at(19), ...chapter('01', 'target', '목표를 구체적으로 정해라', at(19)));
  {
    const b1 = B(`${em('왜')} 부자가 되고 싶으세요?`, 840, 400, { t: at(20), tail: 'bl' });
    const b2 = B('“돈이 많으면 좋잖아요”', 1100, 400, { t: at(21), tail: 'br' });
    const b3 = B(`${em('한 번만 더')} 생각해 볼까요?`, 840, 400, { t: at(23), tail: 'bl' });
    const chk = I('check', 1350, 330, 76, { t: at(22) });
    seqOut(b1, b2, b3); chk.t1 = b3.t0;
    S(at(20), P(660, 690, 330, { hair: 'short', outfit: 'main' }), P(1260, 690, 330, { hair: 'beard', outfit: 'yellow', anim: 'right' }), b1, b2, b3, chk);
  }
  {
    const tq = at(25);
    const q = T(`돈이 많아지면 ${em('무엇이')} 달라질까?`, CX, 560, 84, {
      t: at(24), fx: t => { const p = easeInOut(clamp((t - tq) / 0.7)); return { y: lerp(560, HY, p), scale: lerp(1, 60 / 84, p) }; } });
    S(at(24), q, I('moneybag', CX, 760, 150, { t: at(24, '무엇이'), out: tq }),
      LI('parents', X3[0], 590, 210, '부모님 생활비', at(25)),
      LI('plane', X3[1], 590, 210, '가족 여행', at(26)),
      LI('clock', X3[2], 590, 200, `일하는 시간 ${em('↓')}`, at(27)));
  }
  S(at(28),
    H(`이유가 달라지면 ${em('필요한 돈도')} 다르다`),
    I('parents', X3[0], 450, 140), I('plane', X3[1], 450, 140, { delay: .1 }), I('clock', X3[2], 450, 130, { delay: .2 }),
    A(X3[0], 540, X3[0], 610, { t: at(28, '필요한') }), A(X3[1], 540, X3[1], 610, { t: at(28, '필요한') + .1 }), A(X3[2], 540, X3[2], 610, { t: at(28, '필요한') + .2 }),
    I('coins', X3[0], 740, 160, { arg: 2, t: at(28, '필요한') + .2, anim: 'up' }), I('coins', X3[1], 740, 160, { arg: 4, t: at(28, '필요한') + .35, anim: 'up' }), I('coins', X3[2], 740, 160, { arg: 6, t: at(28, '필요한') + .5, anim: 'up' }));
  S(at(29),
    H(`예를 들어 ${em('가족 여행')}을 가고 싶다면`),
    LI('calendar', X3[0], 590, 190, '언제', at(30, '언제')),
    A(720, 590, 830, 590, { t: at(30, '어디로') }),
    LI('pin', X3[1], 590, 190, '어디로', at(30, '어디로')),
    A(1080, 590, 1190, 590, { t: at(31, '얼마') }),
    LI('piggy', X3[2], 590, 200, em('얼마 모을지'), at(31, '얼마')));
  {
    const t1 = at(33, '덜');
    const d = G(donut(), 720, 590, { t: at(32), anim: 'pop', htmlAt: t => {
      const p = easeInOut(clamp((t - t1) / 0.9));
      return donut(1 - .5 * p, p < .5 ? '10시간' : '5시간'); } });
    S(at(32), H(`반대로 ${em('일하는 시간')}을 줄이고 싶다면`), d,
      A(890, 590, 1060, 590, { t: t1 + .4 }),
      LI('house', 1220, 590, 210, `${em('덜 일해도')} 생활할 방법`, t1 + .5),
      I('check', 1320, 480, 70, { t: at(33, '고민') }));
  }
  {
    const b = B('“돈을 더 벌고 싶다”', CX, 380, { tail: 'b', t: at(34, '돈을') });
    b.t1 = at(35, '다른');
    S(at(34), P(700, 640, 300, { hair: 'short', outfit: 'main' }), P(1220, 640, 300, { hair: 'bun', outfit: 'purple' }), b,
      Tag('저축 계획 세우기', 700, 840, { red: false, t: at(35, '다른') }),
      T('≠', CX, 830, 100, { color: K.red, anim: 'pop', t: at(35, '다른') + .15 }),
      Tag('수입 구조 바꾸기', 1220, 840, { t: at(35, '다른') + .3 }));
  }
  S(at(36),
    H(`${em('목표')}가 없으면`),
    G(bucket(), 820, 610, { anim: 'pop' }), G(drops(), 830, 800, { t: at(37, '부족'), anim: 'down' }),
    T(`벌어도<br>계속 ${em('부족')}`, 1180, 610, 72, { t: at(37, '계속'), anim: 'right' }));
  S(at(38),
    G(steps(), CX, 700),
    P(640, 670, 190, { outfit: 'red', hair: 'short' }), Lb(em('월 500만'), 640, 545, { t: at(38, '오백') + .2 }),
    P(960, 582, 190, { outfit: 'gray', hair: 'quiff', t: at(38, '천만') }), Lb('월 1,000만', 960, 457, { t: at(38, '천만') + .2 }),
    P(1280, 494, 190, { outfit: 'gray', hair: 'bun', t: at(39, '그보다') }), Lb('그 이상…', 1280, 369, { t: at(39, '그보다') + .2 }));
  S(at(40),
    T(`목표가 ${em('계속 바뀐다')}`, CX, 830, 64, { t: at(40, '목표') }),
    P(CX, 620, 260, { outfit: 'red', hair: 'short' }),
    Bd(600, 560, 140, { outfit: 'purple', hair: 'quiff', bg: K.grayL, t: at(40, '남을') }),
    Bd(760, 380, 140, { outfit: 'jacket', hair: 'long', bg: K.grayL, t: at(40, '남을') + .12 }),
    Bd(1160, 380, 140, { outfit: 'suit', hair: 'short', bg: K.grayL, t: at(40, '남을') + .24 }),
    Bd(1320, 560, 140, { outfit: 'yellow', hair: 'beard', bg: K.grayL, t: at(40, '남을') + .36 }),
    I('target', 1250, 320, 70, { t: at(40, '목표') }));
  { // seesaw
    const tilt = t => { const a = clamp((t - at(42, '줄어')) / 1.0), b = clamp((t - at(43, '멀어')) / 1.0); return 6 * easeInOut(a) + 4 * easeInOut(b) - 4; };
    const cx = CX, cy = 640;
    const onBeam = (dx, dy) => t => { const g = tilt(t) * Math.PI / 180; return { x: cx + dx * Math.cos(g) - dy * Math.sin(g), y: cy + dx * Math.sin(g) + dy * Math.cos(g) }; };
    const h1 = H(`처음 원했던 것은 ${em('가족과의 시간')}`, { t: at(41) });
    const h2 = H(`수입 ${em('↑')}  원하는 삶 ${em('↓')}`, { t: at(43, '수입') });
    h1.t1 = h2.t0;
    const s1 = I('coins', cx, cy, 150, { arg: 2, fx: onBeam(290, -66), t: at(41, '돈을') });
    s1.t1 = at(42, '더 벌수록') + .25;
    S(at(41), h1, h2,
      G(seesawBeam(), cx, cy, { z: 1, fx: t => ({ rot: tilt(t) }) }), G(seesawBase(), cx, cy + 70),
      I('family', cx, cy, 190, { fx: onBeam(-280, -98) }),
      I('heart', cx, cy, 60, { fx: onBeam(-190, -190), t: at(41, '시간을') }),
      s1, I('coins', cx, cy, 170, { arg: 6, fx: onBeam(290, -86), t: at(42, '더 벌수록') }),
      Lb('가족과의 시간', cx, cy, { fx: onBeam(-280, 70), t: at(41) + .3 }),
      Lb('수입', cx, cy, { fx: onBeam(290, 70), t: at(41, '돈을') + .3 }));
  }
  {
    const b1 = B(`“${em('얼마를')} 벌고 싶다”`, 1100, 460, { t: at(44, '얼마'), tail: 'bl' });
    const b2 = B(`“나는 돈을 벌어서 ${em('○○하고 싶다')}”`, 1170, 460, { t: at(45, '문장'), tail: 'bl' });
    seqOut(b1, b2);
    S(at(44), H(`이 문장도 ${em('완성')}해 보세요`, { t: at(45) }), P(760, 680, 330, { hair: 'short', outfit: 'main' }), b1, b2);
  }
  S(at(47),
    H(`답이 ${em('구체적')}일수록`),
    I('target', CX, 610, 250),
    LI('clock', 560, 560, 150, '시간', at(48, '시간')), A(660, 580, 820, 610, { color: K.red, t: at(48, '시간') + .1 }),
    LI('coin', 1360, 560, 150, '돈', at(48, '돈을')), A(1260, 580, 1100, 610, { color: K.red, t: at(48, '돈을') + .1 }),
    Tag('기회 선택 ✓', CX, 820, { t: at(47, '기회') }));
  S(at(49),
    LI('flag', 680, 590, 220, '원하는 삶 정하기', at(49)), I('check', 780, 470, 70, { t: at(49, '정했다고') }),
    A(840, 590, 1090, 590, { dash: '12 14', t: at(49, '실현') }),
    LI('wallet', 1260, 590, 220, em('돈이 저절로?'), at(49, '실현')),
    I('question', 1380, 470, 80, { t: at(49, '저절로') }));
  S(at(50),
    H(`필요한 돈을 ${em('벌 방법')}`),
    LI('briefcase', 640, 520, 170, '지금 하는 일', at(50)),
    A(720, 640, 860, 730, { t: at(50, '필요한') }),
    I('piggy', CX, 760, 160, { t: at(50, '필요한') + .2 }),
    LI('question', 1280, 520, 150, em('새로운 수입'), at(51, '새로운')),
    A(1200, 640, 1060, 730, { dash: '10 12', color: K.red, t: at(51, '새로운') + .2 }));

  // ===== 02 =====
  S(at(52), ...chapter('02', 'gift', '다른 사람에게 필요한 가치를 찾아라', at(52)));
  S(at(53),
    H(`돈을 더 벌고 싶을 때`),
    P(640, 650, 320, { hair: 'short', outfit: 'main' }),
    I('briefcase', 860, 720, 150, { t: at(54) }), I('magnifier', 960, 630, 120, { t: at(54, '답을') }),
    Lb(`${em('지금 하는 일')}에서만?`, 860, 850, { t: at(54, '답을') + .2 }),
    A(1060, 610, 1220, 460, { dash: '10 12', t: at(55, '같은') }), A(1060, 630, 1220, 630, { dash: '10 12', t: at(55, '같은') + .12 }), A(1060, 650, 1220, 800, { dash: '10 12', t: at(55, '같은') + .24 }),
    I('question', 1300, 450, 90, { t: at(55, '같은') + .3 }), I('question', 1300, 630, 90, { t: at(55, '같은') + .42 }), I('question', 1300, 810, 90, { t: at(55, '같은') + .54 }));
  S(at(56),
    LI('store', 680, 560, 280, '빵집', at(56)),
    G(bars(), 1200, 470, { t: at(57, '매출'), anim: 'up' }), Lb(`매출 ${em('↑')}`, 1200, 640, { t: at(57, '매출') + .2 }),
    Bd(1060, 780, 110, { outfit: 'purple', hair: 'quiff', bg: K.grayL, t: at(58, '손님') }), Bd(1200, 780, 110, { outfit: 'pinkTop', hair: 'long', bg: K.grayL, t: at(58, '손님') + .12 }), Bd(1340, 780, 110, { outfit: 'jacket', hair: 'short', bg: K.grayL, t: at(58, '손님') + .24 }),
    Tag('손님이 더 많이!', 1200, 880, { t: at(58, '많이') }));
  {
    const b1 = B('“집에서 빵 만들고 싶어요”', 520, 340, { t: at(59, '집에서'), tail: 'b', size: 34 });
    const b2 = B('“직원 간식을 주문할게요”', 1400, 340, { t: at(60), tail: 'b', size: 34 });
    seqOut(b1, b2); b2.t1 = at(61, '제빵');
    S(at(59), P(520, 580, 240, { outfit: 'yellow', hair: 'bun' }), I('store', CX, 560, 210, { t: at(59) }), I('building', 1400, 560, 200, { t: at(60) }), b1, b2,
      A(870, 680, 720, 760, { color: K.red, t: at(61, '제빵') }), I('chefhat', 620, 780, 110, { t: at(61, '제빵') }), Tag('제빵 수업', 620, 880, { t: at(61, '제빵') + .15 }),
      A(1050, 680, 1200, 760, { color: K.red, t: at(61, '단체') }), I('box', 1300, 780, 110, { t: at(61, '단체') }), Tag('단체 주문', 1300, 880, { t: at(61, '단체') + .15 }));
  }
  S(at(62),
    H(`같은 ${em('빵 만드는 능력')}이라도`),
    I('bread', CX, 450, 170),
    A(880, 530, 680, 610, { t: at(63, '누구') }), A(CX, 545, CX, 610, { t: at(63, '누구') }), A(1040, 530, 1240, 610, { t: at(63, '누구') }),
    ...LI('users', 640, 710, 150, '가게 손님', at(63, '누구') + .1),
    ...LI('chefhat', CX, 710, 150, '제빵 수업', at(63, '누구') + .25),
    ...LI('box', 1280, 710, 150, '단체 주문', at(63, '누구') + .4),
    T(`${em('누구에게 무엇을')} 해주느냐`, CX, 880, 46, { t: at(63, '해주') }));
  {
    const b1 = B(`익숙한 일 ${iconSVG('check', 44)}`, 640, 360, { t: at(65, '익숙'), tail: 'b' });
    const b2 = B(`“매출·비용 정리 ${em('어려워요')}”`, 1280, 360, { t: at(66, '매출'), tail: 'b' });
    seqOut(b1, b2);
    S(at(64), H(`${em('직장인')}도 마찬가지`, { t: at(64), out: at(65, '익숙') }),
      P(640, 660, 300, { outfit: 'suit', hair: 'short' }), I('sheet', 820, 760, 140, { t: at(65, '엑셀') }),
      P(1280, 660, 300, { outfit: 'apron', hair: 'beard', t: at(66) }), I('receipt', 1100, 760, 140, { t: at(66, '매출') }), b1, b2);
  }
  S(at(67),
    T(`내게 ${em('쉬운')} 일`, 660, 560, 76), T('=', CX, 560, 90, { color: K.red, anim: 'pop', t: at(67, '누군가') }), T(`누군가의 ${em('큰 고민')}`, 1290, 560, 76, { t: at(67, '누군가') }),
    Bd(660, 730, 140, { outfit: 'suit', hair: 'short', bg: K.blueL, t: at(67) + .2 }), Bd(1290, 730, 140, { outfit: 'apron', hair: 'beard', bg: K.redBg, t: at(67, '어려워') }));
  {
    const t0 = at(68, '해결'), mv = t => easeInOut(clamp((t - t0) / 1.0));
    S(at(68),
      G(box(220, 210, ICON.puzzleSlot()), 1220, 590, { anim: 'pop', t: at(68, '누군가') }),
      Lb('누군가의 문제', 1220, 760, { t: at(68, '누군가') + .2, out: t0 + .8 }),
      I('puzzle', 700, 590, 190, { fx: t => ({ x: lerp(700, 1220, mv(t)) }) }),
      Lb(em('내 능력'), 700, 760, { out: t0 }),
      I('coin', 1220, 360, 110, { t: at(69, '가치') }),
      T(`돈이 되는 ${em('가치')}`, 1220, 780, 52, { t: at(69, '가치') + .1 }));
  }
  {
    const b1 = B('“뭘 해야 돈을 많이 벌까?”', 1110, 440, { t: at(71), tail: 'bl' });
    const b2 = B(`“사람들은 어떤 일로 ${em('불편해')}할까?”`, 1150, 440, { t: at(73), tail: 'bl' });
    const b3 = B(`“그중 ${em('내가 도와줄 수 있는')} 건 뭘까?”`, 1170, 440, { t: at(74), tail: 'bl' });
    seqOut(b1, b2, b3);
    S(at(70), H(`${em('새로운 기회')}를 찾으려면`), P(700, 680, 320, { hair: 'short', outfit: 'main' }), b1, b2, b3);
  }
  S(at(75),
    H(`${em('다른 분야')}의 이야기를 들어보세요`),
    P(CX, 740, 230, { outfit: 'red', hair: 'short' }),
    Bd(600, 600, 140, { outfit: 'chef', hair: 'chef', bg: K.yelL, t: at(75, '다른') }), Bd(790, 460, 140, { outfit: 'suit', hair: 'short', bg: K.blueL, t: at(75, '다른') + .12 }),
    Bd(1130, 460, 140, { outfit: 'apron', hair: 'beard', bg: K.greenL, t: at(75, '다른') + .24 }), Bd(1320, 600, 140, { outfit: 'yellow', hair: 'bun', bg: K.redBg, t: at(75, '다른') + .36 }),
    I('question', 660, 530, 54, { t: at(76, '고민') }), I('question', 850, 390, 54, { t: at(76, '고민') + .1 }), I('question', 1190, 390, 54, { t: at(76, '고민') + .2 }), I('question', 1380, 530, 54, { t: at(76, '고민') + .3 }));
  S(at(77),
    LI('backpack', 680, 580, 230, `내게 ${em('당연한')} 경험`, at(77)),
    A(850, 580, 1060, 580, { color: K.red, t: at(78) }),
    LI('heartHands', 1240, 580, 250, `누군가에겐 ${em('필요한 도움')}`, at(78, '필요한')));
  {
    const xm = I('xmark', 960, 470, 90, { t: at(80, '아닙') });
    const tx = Lb(em('바로 돈이 되지는 않는다'), 960, 380, { t: at(80, '바로') });
    const dl = A(640, 590, 1260, 590, { dash: '12 14', t: at(80), drawDur: .8 });
    xm.t1 = tx.t1 = dl.t1 = at(81);
    S(at(79), LI('bulb', 520, 590, 190, '아이디어', at(79)), dl, I('coin', 1400, 590, 150, { t: at(80) }), xm, tx,
      A(630, 590, 720, 590, { t: at(81) }), LI('users', 830, 590, 170, '필요한 사람?', at(81)),
      A(940, 590, 1010, 590, { t: at(82) }), LI('wallet', 1120, 590, 160, '돈 낼 만큼?', at(82)),
      A(1220, 590, 1300, 590, { t: at(82, '도움') }),
      T(`먼저 ${em('확인')}하기`, CX, 400, 56, { t: at(82, '확인') }));
  }
  S(at(83),
    G(wheel(), 700, 600, { anim: 'pop' }), G(runner(), 700, 560, { t: at(83) + .2 }),
    T('지금 일을 더 많이', 1260, 520, 60, { anim: 'right', t: at(83, '지금') }),
    T(`≠ ${em('유일한 방법')}`, 1260, 630, 72, { anim: 'right', t: at(84, '유일한') }));
  S(at(85),
    LI('toolbox', 680, 580, 230, `${em('이미')} 가진 능력`, at(85)),
    A(850, 580, 1060, 580, { color: K.red, t: at(86) }),
    LI('door', 1240, 580, 230, `새로운 수입 ${em('기회')}`, at(86, '기회')));
  {
    const b = B(`${iconSVG('bulb', 54)}새로운 방법!`, 940, 430, { think: true, tail: 'bl', t: at(87, '새로운') });
    b.t1 = at(89);
    S(at(87), P(720, 680, 320, { hair: 'quiff', outfit: 'main' }), b,
      T(`${em('생각만으로는')} ✕`, 1240, 600, 60, { t: at(88), out: at(89), anim: 'right' }),
      LI('flask', 1220, 580, 220, `${em('직접')} 해보기`, at(89)));
  }
  S(at(90),
    H(`시도하는 데도 ${em('돈이 필요하다')}`),
    LI('book', X3[0], 590, 200, '새로 배우기', at(90)),
    LI('box', X3[1], 590, 200, '상품 만들기', at(91, '상품')),
    LI('seedling', X3[2], 590, 210, em('시도할 돈 준비'), at(93, '돈을')));
  S(at(94),
    I('bulb', 640, 560, 170), I('check', 710, 470, 60, { t: at(94, '아이디어') }), T('+', 800, 560, 90, { t: at(94, '아이디어') }),
    I('coins', 960, 560, 170, { arg: 4, t: at(94, '돈과') }), I('check', 1030, 470, 60, { t: at(94, '준비') }),
    A(1080, 560, 1190, 560, { t: at(95, '저절로') }), I('coin', 1300, 560, 150, { t: at(95, '저절로') }), I('xmark', 1370, 490, 70, { t: at(95, '아닙') }),
    T(`${em('저절로')} 수입이 되지 않는다`, CX, 780, 56, { t: at(95, '저절로') }));
  S(at(96),
    LI('megaphone', 600, 580, 210, `필요한 사람에게 ${em('알리기')}`, at(96)),
    I('users', 960, 580, 190, { t: at(96, '필요한') }),
    A(1080, 580, 1180, 580, { color: K.red, t: at(97) }),
    LI('coins', 1320, 580, 190, `돈 버는 ${em('방법')}`, at(97, '돈을'), { icon: { arg: 5 } }));

  // ===== 03 =====
  S(at(98), ...chapter('03', 'refreshCoin', '가치를 돈으로 바꾸는 기술을 배워라', at(98)));
  S(at(99), I('alert', CX, 520, 190), T(`알아야 할 ${em('한 가지')}`, CX, 720, 72, { t: at(99, '알아야') }));
  S(at(100),
    LI('medal', 660, 590, 220, '일을 잘하는 것', at(100)),
    T('≠', CX, 580, 140, { color: K.red, anim: 'pop', t: at(101, '다르다') }),
    LI('coins', 1260, 590, 220, em('돈을 버는 것'), at(101, '돈을'), { icon: { arg: 6 } }));
  S(at(102),
    G(island(), 620, 690, { anim: 'up' }), P(570, 560, 200, { outfit: 'red', hair: 'short' }), I('diamond', 700, 610, 90),
    Lb('좋은 능력', 620, 780),
    G(waves(), CX, 690, { t: at(102, '찾지') }),
    G(island(), 1300, 690, { anim: 'up', t: at(102, '필요한') }), I('users', 1300, 580, 190, { t: at(102, '필요한') }),
    Lb(em('필요한 사람'), 1300, 780, { t: at(102, '필요한') + .2 }),
    T(`수입으로 ${em('이어지기 어렵다')}`, CX, 400, 56, { t: at(103) }));
  {
    const ts = at(104, '보다');
    S(at(104), mk('', CX, 560, { anim: 'up', htmlAt: t => { const p = easeInOut(clamp((t - ts) / .45));
      return `<div style="position:relative;font-size:84px;font-weight:800;color:#5A6172;white-space:nowrap;letter-spacing:-0.025em"><span style="opacity:${1 - .45 * p}">무조건 더 일하기</span><div style="position:absolute;left:-12px;top:52%;height:9px;border-radius:5px;background:${K.red};width:calc(${p * 100}% + ${24 * p}px)"></div></div>`; } }));
  }
  {
    const t2 = at(106);
    S(at(105, '부족한'),
      T(`내게 ${em('부족한 것')}은?`, CX, 560, 100, { fx: t => { const p = easeInOut(clamp((t - t2) / .7)); return { y: lerp(560, HY, p), scale: lerp(1, .62, p) }; } }),
      LI('megaphone', X3[0], 600, 200, '나를 알리는 법', at(106)),
      LI('present', X3[1], 600, 200, '능력 설명하는 법', at(107)),
      LI('userSearch', X3[2], 600, 200, '필요를 찾는 법', at(108, '필요로')));
  }
  S(at(109),
    T(`작게<br>${em('반복')}`, CX, 610, 64, { t: at(109, '작게') }),
    G(box(460, 460, `<circle cx="230" cy="230" r="200" fill="none" stroke="${K.grayL}" stroke-width="14" stroke-dasharray="30 22"/>`), CX, 610, { anim: 'fade' }),
    LI('book', 720, 470, 140, '배우기', at(109, '배워')),
    LI('flask', 1200, 470, 140, em('작게 시도'), at(109, '작게')),
    LI('chat', CX, 790, 130, '반응 보기', at(110, '반응'), { gap: 30 }));
  S(at(111),
    H(`${em('알리는 방법')}이 부족하다면`),
    I('megaphone', CX, 600, 260, { out: at(112) }),
    LI('video', CX, 600, 220, em('콘텐츠'), at(112, '콘텐츠')),
    LI('book', 600, 600, 190, '지식·기술', at(113)), A(720, 600, 820, 600, { t: at(113) + .1 }),
    A(1100, 600, 1200, 600, { t: at(113, '문제') }), LI('users', 1320, 600, 200, '문제 해결', at(113, '문제')),
    I('check', 1420, 490, 70, { t: at(114, '보여') }));
  S(at(115), I('youtube', CX, 520, 280), T(`그중 하나, ${em('유튜브')}`, CX, 760, 72, { t: at(115, '유튜브') }));
  S(at(116),
    G(funnel(), 760, 600, { anim: 'pop' }),
    G(box(520, 120, [[60, 60], [140, 30], [210, 70], [290, 40], [360, 80], [440, 50]].map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="16" fill="${['#8E86F0', '#FFC845', '#6FA8F5', '#8BCB6A', '#FF9AA8', '#8E86F0'][k]}"/>`).join('')), 760, 330, { t: at(116, '공유'), anim: 'down' }),
    G(box(140, 250, [[70, 30], [56, 90], [84, 150], [70, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="${K.red}"/>`).join('')), 760, 670, { t: at(117, '구체'), anim: 'down' }),
    I('heart', 1150, 420, 80, { t: at(116, '관심') }), Lb('관심 모으기', 1320, 420, { t: at(116, '관심') + .1, anim: 'right' }),
    I('heartHands', 1150, 580, 90, { t: at(117, '구체') }), Lb('구체적 도움', 1320, 580, { t: at(117, '구체') + .1, anim: 'right' }),
    I('gift', 1150, 740, 90, { t: at(118, '상품') }), Lb(em('상품·서비스'), 1330, 740, { t: at(118, '상품') + .1, anim: 'right' }));
  {
    const t1 = at(120, '1억');
    S(at(119), P(720, 650, 330, { outfit: 'yellow', hair: 'bun' }), Lb(em('30대 주부'), 720, 860, { t: at(119) + .2 }),
      I('youtube', 980, 470, 140, { t: at(119, '콘텐츠') }), I('book', 990, 640, 120, { t: at(119, '지식') }),
      Bd(1200, 470, 110, { outfit: 'purple', hair: 'quiff', bg: K.grayL, t: at(120, '필요한') }), Bd(1340, 560, 110, { outfit: 'jacket', hair: 'long', bg: K.grayL, t: at(120, '필요한') + .12 }),
      Bd(1200, 660, 110, { outfit: 'blue', hair: 'short', bg: K.grayL, t: at(120, '필요한') + .24 }), Bd(1340, 750, 110, { outfit: 'pinkTop', hair: 'bun', bg: K.grayL, t: at(120, '필요한') + .36 }));
    S(t1, T('매출', CX, 420, 56, { color: '#5A6172' }),
      mk('', CX, 590, { anim: 'pop', htmlAt: t => { const p = easeOut(clamp((t - t1) / 1.1)); const v = Math.round(p * 10000);
      return `<div style="font-size:180px;font-weight:800;color:${K.red};white-space:nowrap;letter-spacing:-0.03em;font-variant-numeric:tabular-nums">${v >= 10000 ? '1억 원' : v.toLocaleString() + '만 원'}</div>`; } }),
      I('coins', 1450, 640, 150, { arg: 5, t: t1 + .6 }), I('coins', 470, 660, 120, { arg: 3, t: t1 + .7 }));
  }
  S(at(121), I('alert', CX, 520, 190), T(`그런데 ${em('중요한 점')}`, CX, 720, 72, { t: at(121, '중요') }));
  S(at(122),
    I('youtube', 640, 610, 230),
    ...[[580, 470, 60, .0], [660, 420, 70, .15], [730, 480, 50, .3]].map(([x, y, s, d]) => I('heart', x, y, s, { t: at(122, '관심') + d })),
    Lb('관심은 모였지만', 640, 770, { t: at(122, '관심') + .2 }),
    A(800, 610, 1080, 610, { dash: '12 14', t: at(123) }),
    I('coins', 1250, 610, 200, { arg: 5, t: at(123) }), I('xmark', 1330, 510, 80, { t: at(123, '아니') }),
    Lb(`반드시 ${em('수익')}은 아니다`, 1250, 770, { t: at(123, '수익') }));
  S(at(124),
    H(`${em('수익')}으로 연결하려면`),
    LI('target', X3[0], 600, 200, '누구에게?', at(124)),
    A(720, 600, 830, 600, { t: at(125) }),
    LI('gift', X3[1], 600, 200, '무엇을?', at(125)),
    A(1080, 600, 1190, 600, { t: at(126) }),
    LI('cart', X3[2], 600, 210, em('어떻게 구매로?'), at(126, '구매')));
  {
    const b1 = B('어떤 경험을 쓰지?', 1080, 460, { think: true, tail: 'bl', t: at(128) });
    const b2 = B(`${em('어떤 콘텐츠')}부터?`, 1080, 460, { think: true, tail: 'bl', t: at(129) });
    seqOut(b1, b2); b2.t1 = at(130);
    S(at(127), H(`막상 ${em('유튜브')}로 시작하려면`), P(780, 680, 330, { hair: 'short', outfit: 'main' }), I('youtube', 580, 480, 110, { t: at(127, '유튜브') }), b1, b2,
      LI('maze', 1200, 600, 220, em('막막'), at(130)));
  }
  S(at(131),
    H(`사람마다 ${em('다르다')}`),
    P(640, 610, 230, { outfit: 'blue', hair: 'short' }), P(CX, 610, 230, { outfit: 'red', hair: 'long', delay: .12 }), P(1280, 610, 230, { outfit: 'purple', hair: 'quiff', delay: .24 }),
    I('book', 760, 470, 90, { t: at(131, '지식') }), I('toolbox', 1080, 470, 90, { t: at(131, '지식') + .12 }), I('laptop', 1400, 470, 90, { t: at(131, '경험') }),
    ...[[640, .3, K.navy2], [CX, .6, K.red], [1280, .15, K.navy2]].map(([x, f, c], k) => G(progress(f, c), x, 770, { t: at(132) + k * .12, anim: 'left', htmlAt: t => progress(f * easeOut(clamp((t - at(132) - k * .12) / .8)), c) })),
    Lb(`현재 ${em('준비된 정도')}`, CX, 840, { t: at(132, '준비') }));
  S(at(133),
    LI('videoOff', 660, 580, 220, '무작정 영상 만들기', at(133)),
    A(830, 580, 1060, 580, { color: K.red, t: at(134) }),
    LI('map', 1240, 580, 230, `${em('지금 내 상황')} 확인`, at(134, '내 상황')),
    I('check', 1350, 460, 70, { t: at(135) }));
  S(at(136), H(`${em('고정 댓글')} 링크`), mk(commentCard(false), CX, 600, { anim: 'up' }),
    I('pointer', 900, 700, 80, { t: at(136, '링크') + .3, anim: 'left' }));
  S(at(137),
    LI('clipboard', 680, 580, 220, '질문 답하고 신청', at(137)), I('check', 780, 460, 70, { t: at(137, '완료') }),
    A(840, 580, 1060, 580, { color: K.red, t: at(138) }),
    LI('report', 1240, 580, 230, em('기초 진단표'), at(138, '진단표')));
  S(at(139),
    I('youtube', 700, 580, 220), A(860, 580, 1060, 580, { t: at(139, '수익') }), I('coins', 1230, 580, 210, { arg: 5, t: at(139, '수익') }),
    T(`유튜브로 ${em('수익')}을 만들고 싶다면`, CX, 800, 56, { t: at(139) + .2 }));
  {
    const b = B(`${iconSVG('maze', 50)}어디서부터 시작하지?`, 900, 440, { think: true, tail: 'bl', t: at(140) });
    b.t1 = at(141);
    S(at(140), P(620, 680, 320, { hair: 'short', outfit: 'main' }), b,
      mk(commentCard(false), 1110, 600, { t: at(141, '고정'), anim: 'right' }),
      mk(commentCard(true), 1110, 600, { t: at(142), anim: 'fade' }),
      I('pointer', 1000, 720, 80, { t: at(142) - .2, anim: 'left' }),
      T(`${em('내 상황')}부터 확인해 보세요`, 1110, 360, 56, { t: at(142) }));
  }
}
