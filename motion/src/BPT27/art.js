// Flat illustration library (faceless flat avatars + two-tone flat icons).
const K = {
  red: '#EE4036', redD: '#C92E26', redL: '#FF8A80', redBg: '#FDE6E4',
  navy: '#2C3446', navy2: '#454E66', ink: '#1F2430',
  gray: '#C7CCD6', grayD: '#9AA1B0', grayL: '#EEF0F4',
  yel: '#FFC845', yelD: '#F2A51C', yelL: '#FFE4A0',
  blue: '#6FA8F5', blueD: '#4A82D8', blueL: '#DCEBFB',
  green: '#8BCB6A', greenD: '#5FA34A', greenL: '#DDF1D2',
  purple: '#8E86F0', purpleD: '#6E64D6', pink: '#FF9AA8', pinkD: '#F07386',
  skin: '#FFD3BC', skinD: '#F2B597', hair: '#3A2B2B', hairB: '#7A4630',
  wood: '#C98A55', woodD: '#A76C3C', kraft: '#E3AE73', kraftD: '#C98F52', white: '#FFFFFF',
};
let _uid = 0;
const uid = () => 'u' + (++_uid);
const svg = (w, h, vb, inner) => `<svg width="${w}" height="${h}" viewBox="${vb}" style="display:block;overflow:visible">${inner}</svg>`;

// ---------------- people ----------------
const OUTFITS = {
  main: { top: 'hoodie', c: '#2C3446', d: '#20273A' },
  red: { top: 'hoodie', c: K.red, d: K.redD },
  purple: { top: 'shirt', c: K.purple, d: K.purpleD },
  yellow: { top: 'hoodie', c: K.yel, d: K.yelD },
  jacket: { top: 'jacket', c: '#5D5470', d: '#4A4259', inner: K.blue },
  suit: { top: 'suit', c: K.navy, d: K.ink },
  chef: { top: 'chef', c: '#FFFFFF', d: '#E3E7EE' },
  apron: { top: 'apron', c: K.green, d: K.greenD },
  gray: { top: 'tee', c: '#B9BFCB', d: '#A2A9B7' },
  pinkTop: { top: 'tee', c: K.pink, d: K.pinkD },
  blue: { top: 'shirt', c: K.blue, d: K.blueD },
};
function personInner(o = {}) {
  const of = OUTFITS[o.outfit || 'main'];
  const hairC = o.hairColor || (o.hair === 'beard' ? K.hairB : K.hair);
  const id = uid();
  const body = 'M14 230 C14 172 46 148 100 148 C154 148 186 172 186 230 Z';
  let s = '';
  // long hair behind
  if (o.hair === 'long') s += `<path d="M58 90 C54 140 56 170 70 176 L130 176 C144 170 146 140 142 90 Z" fill="${hairC}"/>`;
  s += `<clipPath id="${id}"><path d="${body}"/></clipPath>`;
  s += `<path d="${body}" fill="${of.c}"/><rect x="128" y="140" width="80" height="100" fill="${of.d}" clip-path="url(#${id})" opacity="0.55"/>`;
  // neck
  s += `<path d="M82 112 L118 112 L118 150 Q100 168 82 150 Z" fill="${K.skinD}"/>`;
  // garment details
  if (of.top === 'hoodie') s += `<path d="M60 154 Q100 196 140 154 Q124 146 100 146 Q76 146 60 154Z" fill="${of.d}"/><path d="M88 172 L86 200 M112 172 L114 200" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/>`;
  if (of.top === 'shirt') s += `<path d="M80 146 L100 172 L120 146 Z" fill="${K.skinD}"/><path d="M78 144 L100 172 L86 186 L66 154Z M122 144 L100 172 L114 186 L134 154Z" fill="#fff" opacity=".92"/><circle cx="100" cy="196" r="3.5" fill="${of.d}"/><circle cx="100" cy="214" r="3.5" fill="${of.d}"/>`;
  if (of.top === 'jacket') s += `<path d="M76 148 L100 150 L124 148 L118 230 L82 230Z" fill="${of.inner}"/><path d="M76 148 L96 230 L60 230 L52 166Z M124 148 L104 230 L140 230 L148 166Z" fill="${of.d}" opacity=".6"/>`;
  if (of.top === 'suit') s += `<path d="M78 148 L100 204 L122 148Z" fill="#fff"/><path d="M95 158 L105 158 L109 196 L100 208 L91 196Z" fill="${K.red}"/><path d="M93 150 L107 150 L104 160 L96 160Z" fill="${K.redD}"/><path d="M78 148 L100 204 L82 214 L64 160Z M122 148 L100 204 L118 214 L136 160Z" fill="#3B4560"/>`;
  if (of.top === 'chef') s += `<path d="M84 148 L100 166 L116 148Z" fill="${K.skinD}"/><circle cx="88" cy="190" r="4" fill="${K.grayD}"/><circle cx="112" cy="190" r="4" fill="${K.grayD}"/><circle cx="88" cy="212" r="4" fill="${K.grayD}"/><circle cx="112" cy="212" r="4" fill="${K.grayD}"/><path d="M14 230 C14 172 46 148 100 148 C154 148 186 172 186 230 Z" fill="none" stroke="#DDE2EA" stroke-width="3"/>`;
  if (of.top === 'apron') s += `<path d="M84 148 L100 166 L116 148Z" fill="${K.skinD}"/><path d="M72 176 L128 176 L134 230 L66 230Z" fill="#fff"/><path d="M72 176 L80 152 M128 176 L120 152" stroke="#fff" stroke-width="6"/><rect x="88" y="196" width="24" height="14" rx="3" fill="${K.red}"/>`;
  if (of.top === 'tee') s += `<path d="M80 148 Q100 168 120 148" fill="${K.skinD}"/>`;
  // head
  s += `<circle cx="61" cy="92" r="9" fill="${K.skinD}"/><circle cx="139" cy="92" r="9" fill="${K.skinD}"/>`;
  s += `<ellipse cx="100" cy="86" rx="38" ry="43" fill="${K.skin}"/>`;
  s += `<path d="M100 43 C121 43 138 60 138 86 C138 108 126 124 110 128 C122 116 128 100 126 82 C124 62 114 50 100 43Z" fill="${K.skinD}" opacity=".35"/>`;
  // hair
  const h = o.hair || 'short';
  if (h === 'short' || h === 'beard') s += `<path d="M61 92 C55 50 78 36 104 38 C132 40 147 60 139 96 C135 80 130 70 118 64 C104 72 82 72 67 74 C63 80 62 86 61 92Z" fill="${hairC}"/>`;
  if (h === 'quiff') s += `<path d="M61 94 C54 54 70 30 100 30 C126 26 150 44 139 94 C136 78 132 70 126 64 C112 72 86 66 72 70 C66 78 63 86 61 94Z" fill="${hairC}"/><path d="M78 40 C92 22 120 22 132 42 C118 34 96 34 78 40Z" fill="#fff" opacity=".12"/>`;
  if (h === 'bun') s += `<circle cx="100" cy="34" r="18" fill="${hairC}"/><path d="M61 96 C54 54 76 40 100 40 C124 40 146 54 139 96 C134 78 124 64 100 60 C80 62 68 76 61 96Z" fill="${hairC}"/>`;
  if (h === 'long') s += `<path d="M60 100 C52 54 76 38 100 38 C126 38 148 54 140 100 C134 80 126 66 108 60 C94 72 78 76 66 78 C62 84 61 92 60 100Z" fill="${hairC}"/>`;
  if (h === 'beard') s += `<path d="M62 92 C64 126 84 134 100 134 C116 134 136 126 138 92 C134 108 124 116 100 116 C76 116 66 108 62 92Z" fill="${hairC}"/><path d="M84 106 C92 100 108 100 116 106 C108 104 92 104 84 106Z" fill="${hairC}"/>`;
  if (h === 'chef') s += `<path d="M64 74 C50 54 62 26 84 32 C88 12 116 12 120 32 C142 26 152 56 136 74 Z" fill="#fff" stroke="#DDE2EA" stroke-width="3"/><rect x="64" y="62" width="72" height="16" rx="6" fill="#F2F4F8" stroke="#DDE2EA" stroke-width="3"/><path d="M61 92 C60 84 62 80 66 78 L134 78 C138 82 140 86 139 94 C136 86 128 84 100 84 C76 84 66 86 61 92Z" fill="${hairC}"/>`;
  return s;
}
function personSVG(o = {}) { return svg(200, 230, '0 0 200 230', personInner(o)); }
// circular badge avatar
function badgeSVG(o = {}, bg = K.red, size = 200) {
  const id = uid();
  return svg(size, size, '0 0 200 200', `<clipPath id="${id}"><circle cx="100" cy="100" r="100"/></clipPath><circle cx="100" cy="100" r="100" fill="${bg}"/>
    <g clip-path="url(#${id})"><g transform="translate(10 10) scale(0.9)">${personInner(o)}</g></g>`);
}

// ---------------- icons (200x200 viewBox) ----------------
const ICON = {};
const sh = (cx = 100, cy = 186, rx = 64) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="9" fill="#000" opacity=".07"/>`;
ICON.clock = () => sh() + `<circle cx="100" cy="96" r="82" fill="${K.red}"/><circle cx="100" cy="96" r="82" fill="${K.redD}" opacity=".0"/><circle cx="100" cy="96" r="66" fill="${K.blueL}"/>
  <path d="M100 30 A66 66 0 0 1 166 96 L150 96 A50 50 0 0 0 100 46Z" fill="#fff" opacity=".5"/>
  ${[0, 1, 2, 3].map(k => { const a = k * Math.PI / 2; return `<line x1="${100 + 52 * Math.cos(a)}" y1="${96 + 52 * Math.sin(a)}" x2="${100 + 60 * Math.cos(a)}" y2="${96 + 60 * Math.sin(a)}" stroke="${K.navy}" stroke-width="7" stroke-linecap="round"/>`; }).join('')}
  <line x1="100" y1="96" x2="72" y2="68" stroke="${K.navy}" stroke-width="9" stroke-linecap="round"/><line x1="100" y1="96" x2="128" y2="110" stroke="${K.navy}" stroke-width="7" stroke-linecap="round"/><line x1="100" y1="96" x2="112" y2="138" stroke="${K.blue}" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="96" r="8" fill="${K.red}"/>`;
const coinEl = (cx, cy, rx = 60, ry = 18, th = 16) => `<path d="M${cx - rx} ${cy} L${cx - rx} ${cy + th} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + th} L${cx + rx} ${cy} Z" fill="${K.yelD}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${K.yel}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx * .68}" ry="${ry * .62}" fill="none" stroke="${K.yelD}" stroke-width="3.5"/>`;
ICON.coins = (n = 5) => { let s = sh(100, 186, 70); for (let k = 0; k < n; k++) s += coinEl(100, 168 - k * 18); return s; };
ICON.coin = () => `<circle cx="100" cy="104" r="78" fill="${K.yelD}"/><circle cx="100" cy="96" r="78" fill="${K.yel}"/><circle cx="100" cy="96" r="58" fill="none" stroke="${K.yelD}" stroke-width="6"/>
  <text x="100" y="124" text-anchor="middle" font-size="84" font-weight="800" fill="${K.yelD}" font-family="P">₩</text>`;
ICON.moneybag = () => sh(100, 188, 60) + `<path d="M72 60 C46 86 30 120 36 150 C42 178 70 186 100 186 C130 186 158 178 164 150 C170 120 154 86 128 60 Z" fill="${K.kraft}"/>
  <path d="M128 60 C154 86 170 120 164 150 C160 170 146 180 126 184 C146 160 150 110 120 60Z" fill="${K.kraftD}" opacity=".6"/>
  <path d="M70 30 L130 30 L118 60 L82 60 Z" fill="${K.kraft}"/><rect x="72" y="54" width="56" height="12" rx="6" fill="${K.red}"/>
  <text x="100" y="152" text-anchor="middle" font-size="64" font-weight="800" fill="${K.red}" font-family="P">₩</text>`;
ICON.cash = () => sh(100, 178, 76) + `<rect x="22" y="58" width="156" height="92" rx="10" fill="${K.greenD}" transform="rotate(-8 100 104)"/><rect x="22" y="62" width="156" height="92" rx="10" fill="${K.green}"/>
  <rect x="34" y="74" width="132" height="68" rx="6" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><circle cx="100" cy="108" r="22" fill="${K.greenL}"/><text x="100" y="120" text-anchor="middle" font-size="32" font-weight="800" fill="${K.greenD}" font-family="P">₩</text>`;
ICON.cashUp = () => ICON.cash() + `<circle cx="160" cy="54" r="30" fill="${K.red}"/><path d="M160 70 L160 40 M148 52 L160 40 L172 52" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
ICON.chart = () => sh(100, 182, 76) + `<rect x="26" y="34" width="148" height="140" rx="14" fill="#fff" stroke="${K.grayL}" stroke-width="4"/>
  <rect x="46" y="122" width="22" height="36" rx="4" fill="${K.gray}"/><rect x="78" y="100" width="22" height="58" rx="4" fill="${K.blue}"/><rect x="110" y="82" width="22" height="76" rx="4" fill="${K.blueD}"/><rect x="142" y="58" width="0" height="0"/>
  <path d="M44 106 L80 80 L106 92 L148 52" stroke="${K.red}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M128 50 L150 50 L150 72" stroke="${K.red}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
ICON.crown = () => sh(100, 176, 70) + `<path d="M30 70 L66 104 L100 50 L134 104 L170 70 L156 152 L44 152 Z" fill="${K.yel}"/><path d="M100 50 L134 104 L170 70 L156 152 L100 152Z" fill="${K.yelD}" opacity=".45"/>
  <rect x="44" y="146" width="112" height="20" rx="6" fill="${K.yelD}"/><circle cx="30" cy="68" r="10" fill="${K.red}"/><circle cx="170" cy="68" r="10" fill="${K.red}"/><circle cx="100" cy="46" r="11" fill="${K.red}"/><circle cx="100" cy="122" r="12" fill="${K.blue}"/>`;
ICON.diamond = () => sh(100, 184, 54) + `<path d="M50 50 L150 50 L182 88 L100 172 L18 88 Z" fill="${K.blue}"/><path d="M50 50 L72 88 L100 50Z M100 50 L128 88 L150 50Z" fill="${K.blueL}"/><path d="M18 88 L72 88 L100 172Z" fill="#9CC4FA"/><path d="M128 88 L182 88 L100 172Z" fill="${K.blueD}"/><path d="M72 88 L128 88 L100 172Z" fill="${K.blue}"/><path d="M150 50 L182 88 L128 88Z" fill="#9CC4FA"/>
  <path d="M164 22 L168 34 L180 38 L168 42 L164 54 L160 42 L148 38 L160 34Z" fill="${K.red}"/>`;
ICON.flag = () => sh(84, 186, 46) + `<rect x="54" y="26" width="10" height="160" rx="5" fill="${K.navy}"/><path d="M64 34 L164 34 L144 70 L164 106 L64 106 Z" fill="${K.red}"/><path d="M64 34 L100 34 L100 106 L64 106Z" fill="${K.redD}" opacity=".35"/><circle cx="59" cy="24" r="9" fill="${K.yel}"/>`;
ICON.target = () => sh(100, 188, 66) + `<circle cx="100" cy="100" r="82" fill="${K.red}"/><circle cx="100" cy="100" r="62" fill="#fff"/><circle cx="100" cy="100" r="42" fill="${K.red}"/><circle cx="100" cy="100" r="22" fill="#fff"/><circle cx="100" cy="100" r="9" fill="${K.red}"/>
  <path d="M100 100 L170 30" stroke="${K.navy}" stroke-width="8" stroke-linecap="round"/><path d="M160 20 L182 18 L180 40 L170 30Z" fill="${K.navy}"/><path d="M168 18 L186 6 M182 30 L194 14" stroke="${K.navy}" stroke-width="6" stroke-linecap="round"/>`;
ICON.gift = () => sh(100, 186, 70) + `<rect x="36" y="88" width="128" height="94" rx="6" fill="${K.red}"/><rect x="100" y="88" width="64" height="94" fill="${K.redD}" opacity=".35"/><rect x="26" y="64" width="148" height="34" rx="6" fill="${K.redD}"/>
  <rect x="88" y="64" width="24" height="118" fill="${K.yel}"/><path d="M100 64 C80 30 52 38 60 56 C66 66 86 66 100 64Z M100 64 C120 30 148 38 140 56 C134 66 114 66 100 64Z" fill="${K.yel}" stroke="${K.yelD}" stroke-width="4"/>`;
ICON.magnifier = () => `<path d="M128 128 L176 176" stroke="${K.navy}" stroke-width="22" stroke-linecap="round"/><circle cx="86" cy="86" r="60" fill="${K.blueL}" stroke="${K.navy2}" stroke-width="14"/><path d="M52 78 C56 58 72 46 90 44" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>`;
ICON.magnifierQ = () => ICON.magnifier() + `<text x="86" y="110" text-anchor="middle" font-size="68" font-weight="800" fill="${K.red}" font-family="P">?</text>`;
ICON.stairs = () => sh(110, 186, 80) + `<rect x="20" y="140" width="56" height="40" fill="${K.gray}"/><rect x="76" y="104" width="56" height="76" fill="${K.grayD}"/><rect x="132" y="66" width="56" height="114" fill="#848C9C"/>
  <rect x="20" y="136" width="56" height="8" fill="${K.grayL}"/><rect x="76" y="100" width="56" height="8" fill="${K.grayL}"/><rect x="132" y="62" width="56" height="8" fill="${K.grayL}"/>
  <rect x="156" y="12" width="6" height="52" fill="${K.navy}"/><path d="M162 14 L194 24 L162 36Z" fill="${K.red}"/>`;
ICON.plane = () => `<path d="M24 120 C40 108 140 70 168 62 C184 58 192 70 180 80 C160 96 64 136 40 140 C30 142 18 128 24 120Z" fill="#fff" stroke="${K.grayL}" stroke-width="3"/>
  <path d="M96 98 L64 46 L84 44 L132 84Z" fill="${K.blue}"/><path d="M96 122 L94 168 L112 164 L128 112Z" fill="${K.blueD}"/><path d="M36 124 L18 96 L32 94 L52 116Z" fill="${K.red}"/>
  <circle cx="120" cy="92" r="5" fill="${K.blue}"/><circle cx="138" cy="85" r="5" fill="${K.blue}"/><circle cx="156" cy="78" r="5" fill="${K.blue}"/><path d="M168 66 C176 64 184 68 180 74 C176 78 170 76 168 66Z" fill="${K.navy2}"/>`;
ICON.calendar = () => sh(100, 186, 70) + `<rect x="28" y="40" width="144" height="140" rx="16" fill="#fff" stroke="${K.grayL}" stroke-width="4"/><path d="M28 56 Q28 40 44 40 L156 40 Q172 40 172 56 L172 80 L28 80Z" fill="${K.red}"/>
  <rect x="60" y="24" width="12" height="32" rx="6" fill="${K.navy}"/><rect x="128" y="24" width="12" height="32" rx="6" fill="${K.navy}"/>
  ${[0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<rect x="${46 + c * 30}" y="${96 + r * 26}" width="18" height="14" rx="3" fill="${r === 1 && c === 2 ? K.red : K.gray}"/>`).join('')).join('')}`;
ICON.pin = () => `<ellipse cx="100" cy="182" rx="40" ry="10" fill="#000" opacity=".1"/><path d="M100 182 C70 140 40 112 40 78 C40 44 68 18 100 18 C132 18 160 44 160 78 C160 112 130 140 100 182Z" fill="${K.red}"/><path d="M100 18 C132 18 160 44 160 78 C160 112 130 140 100 182 C112 150 136 114 132 76 C130 48 118 30 100 18Z" fill="${K.redD}" opacity=".4"/><circle cx="100" cy="78" r="26" fill="#fff"/>`;
ICON.piggy = () => sh(100, 188, 70) + `<ellipse cx="100" cy="116" rx="72" ry="56" fill="${K.pink}"/><path d="M60 62 L52 34 L84 54Z" fill="${K.pinkD}"/><rect x="48" y="150" width="18" height="34" rx="8" fill="${K.pinkD}"/><rect x="132" y="150" width="18" height="34" rx="8" fill="${K.pinkD}"/>
  <ellipse cx="172" cy="116" rx="16" ry="20" fill="${K.pinkD}"/><circle cx="168" cy="110" r="3.5" fill="${K.navy}"/><circle cx="168" cy="122" r="3.5" fill="${K.navy}"/><circle cx="136" cy="94" r="6" fill="${K.navy}"/>
  <rect x="80" y="64" width="40" height="8" rx="4" fill="${K.pinkD}"/><path d="M28 112 C14 110 14 96 24 96" stroke="${K.pinkD}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="100" cy="34" r="22" fill="${K.yel}"/><circle cx="100" cy="34" r="14" fill="none" stroke="${K.yelD}" stroke-width="4"/>`;
ICON.house = () => sh(100, 186, 74) + `<rect x="44" y="96" width="112" height="86" fill="#FFF3E2"/><rect x="100" y="96" width="56" height="86" fill="#F7E2C6"/><path d="M20 104 L100 32 L180 104 L164 116 L100 58 L36 116Z" fill="${K.red}"/><path d="M100 32 L180 104 L164 116 L100 58Z" fill="${K.redD}" opacity=".4"/>
  <rect x="82" y="128" width="36" height="54" rx="4" fill="${K.navy}"/><rect x="56" y="118" width="20" height="20" rx="3" fill="${K.blueL}"/><rect x="128" y="118" width="20" height="20" rx="3" fill="${K.blueL}"/>`;
ICON.store = () => sh(100, 190, 82) + `<rect x="30" y="80" width="140" height="104" fill="#FFF3E2"/><rect x="100" y="80" width="70" height="104" fill="#F7E2C6"/>
  ${[0, 1, 2, 3, 4].map(k => `<path d="M${18 + k * 33} 48 L${51 + k * 33} 48 L${51 + k * 33} 82 Q${34.5 + k * 33} 100 ${18 + k * 33} 82Z" fill="${k % 2 ? '#fff' : K.red}"/>`).join('')}
  <rect x="14" y="36" width="172" height="14" rx="6" fill="${K.redD}"/><rect x="42" y="112" width="58" height="44" rx="4" fill="${K.blueL}"/><path d="M52 140 C56 124 86 124 90 140Z" fill="${K.kraft}"/><rect x="116" y="112" width="40" height="72" rx="4" fill="${K.navy}"/>`;
ICON.bread = () => sh(100, 172, 74) + `<path d="M24 120 C20 80 52 56 100 56 C148 56 180 80 176 120 C174 150 160 160 100 160 C40 160 26 150 24 120Z" fill="${K.kraftD}"/><path d="M30 112 C28 82 58 64 100 64 C142 64 172 82 170 112 C150 104 50 104 30 112Z" fill="${K.kraft}"/>
  <path d="M64 84 L76 104 M96 78 L106 100 M128 82 L136 102" stroke="#F6D2A6" stroke-width="7" stroke-linecap="round"/>`;
ICON.building = () => sh(100, 190, 70) + `<rect x="46" y="22" width="108" height="164" rx="6" fill="${K.blueD}"/><rect x="100" y="22" width="54" height="164" fill="#3D6FC0"/>
  ${[0, 1, 2, 3, 4].map(r => [0, 1, 2].map(c => `<rect x="${60 + c * 30}" y="${38 + r * 26}" width="20" height="14" rx="2" fill="${(r + c) % 4 === 1 ? K.yelL : K.blueL}"/>`).join('')).join('')}<rect x="86" y="160" width="28" height="26" fill="${K.navy}"/>`;
ICON.chefhat = () => sh(100, 184, 56) + `<path d="M52 110 C24 106 20 62 50 56 C54 26 92 18 104 42 C120 22 162 30 156 64 C184 72 176 112 148 110 L146 170 L54 170Z" fill="#fff" stroke="#E3E7EE" stroke-width="5"/><rect x="54" y="144" width="92" height="30" rx="6" fill="${K.grayL}"/><path d="M84 112 L84 140 M116 112 L116 140" stroke="#E3E7EE" stroke-width="5" stroke-linecap="round"/>`;
ICON.sheet = () => sh(100, 186, 66) + `<rect x="36" y="26" width="128" height="156" rx="12" fill="#fff" stroke="${K.grayL}" stroke-width="4"/><path d="M36 38 Q36 26 48 26 L152 26 Q164 26 164 38 L164 56 L36 56Z" fill="${K.greenD}"/>
  ${[0, 1, 2, 3, 4].map(r => [0, 1, 2].map(c => `<rect x="${50 + c * 36}" y="${68 + r * 22}" width="28" height="14" rx="2" fill="${r === 2 && c === 1 ? K.red : K.greenL}"/>`).join('')).join('')}`;
ICON.receipt = () => sh(100, 188, 56) + `<path d="M46 20 L154 20 L154 176 L140 166 L127 176 L113 166 L100 176 L87 166 L73 176 L60 166 L46 176Z" fill="#fff" stroke="${K.grayL}" stroke-width="4"/>
  <rect x="62" y="44" width="76" height="10" rx="5" fill="${K.gray}"/><rect x="62" y="68" width="56" height="8" rx="4" fill="${K.grayL}"/><rect x="62" y="86" width="66" height="8" rx="4" fill="${K.grayL}"/><rect x="62" y="104" width="50" height="8" rx="4" fill="${K.grayL}"/>
  <rect x="62" y="130" width="76" height="14" rx="4" fill="${K.red}"/><circle cx="150" cy="40" r="22" fill="${K.red}"/><text x="150" y="52" text-anchor="middle" font-size="34" font-weight="800" fill="#fff" font-family="P">₩</text>`;
const PUZ = 'M40 60 L80 60 C76 44 84 34 98 34 C112 34 120 44 116 60 L156 60 L156 98 C172 94 182 102 182 116 C182 130 172 138 156 134 L156 172 L40 172Z';
ICON.puzzle = (c = K.red) => `<path d="${PUZ}" fill="${c}"/><path d="M98 60 L156 60 L156 98 C172 94 182 102 182 116 C182 130 172 138 156 134 L156 172 L98 172Z" fill="#000" opacity=".1"/>`;
ICON.puzzleSlot = () => `<rect x="10" y="10" width="200" height="190" rx="18" fill="${K.grayL}"/><path d="${PUZ}" fill="#fff" stroke="${K.grayD}" stroke-width="4" stroke-dasharray="10 9" transform="translate(10 6)"/>`;
ICON.bulb = (on = true) => `${on ? `<circle cx="100" cy="82" r="76" fill="${K.yelL}" opacity=".55"/>` : ''}<path d="M100 22 C66 22 44 48 44 78 C44 102 58 116 70 128 L70 146 L130 146 L130 128 C142 116 156 102 156 78 C156 48 134 22 100 22Z" fill="${on ? K.yel : K.gray}"/>
  <path d="M100 22 C134 22 156 48 156 78 C156 102 142 116 130 128 L130 146 L112 146 C112 120 146 100 136 64 C130 40 116 28 100 22Z" fill="${on ? K.yelD : K.grayD}" opacity=".45"/><path d="M84 146 L84 110 L100 122 L116 110 L116 146" stroke="#fff" stroke-width="5" fill="none" opacity=".8"/>
  <rect x="70" y="146" width="60" height="16" rx="5" fill="${K.navy2}"/><rect x="74" y="162" width="52" height="14" rx="5" fill="${K.navy}"/><rect x="86" y="176" width="28" height="10" rx="5" fill="${K.navy}"/>`;
ICON.bulbOff = () => ICON.bulb(false);
ICON.briefcase = () => sh(100, 184, 76) + `<path d="M74 56 L74 40 Q74 30 84 30 L116 30 Q126 30 126 40 L126 56" stroke="${K.woodD}" stroke-width="10" fill="none"/><rect x="24" y="54" width="152" height="122" rx="14" fill="${K.wood}"/><path d="M24 68 Q24 54 38 54 L162 54 Q176 54 176 68 L176 106 L24 106Z" fill="${K.woodD}"/><rect x="88" y="96" width="24" height="22" rx="4" fill="${K.yel}"/>`;
ICON.backpack = () => sh(100, 188, 62) + `<path d="M76 40 Q76 20 100 20 Q124 20 124 40" stroke="${K.navy}" stroke-width="10" fill="none"/><rect x="40" y="38" width="120" height="146" rx="34" fill="${K.red}"/><rect x="100" y="38" width="60" height="146" rx="0" fill="${K.redD}" opacity=".3"/>
  <rect x="58" y="112" width="84" height="60" rx="14" fill="${K.redD}"/><rect x="58" y="112" width="84" height="16" rx="8" fill="${K.navy}"/><rect x="92" y="82" width="16" height="18" rx="4" fill="${K.yel}"/>`;
ICON.heartHands = () => `<path d="M100 120 C60 90 50 64 66 48 C80 34 96 42 100 56 C104 42 120 34 134 48 C150 64 140 90 100 120Z" fill="${K.red}"/><path d="M74 54 C80 46 88 48 90 54" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M14 128 C40 116 56 136 76 144 C90 150 100 150 112 146 L112 160 C90 172 64 170 40 160 L14 160Z" fill="${K.skin}"/><path d="M186 128 C160 116 144 136 124 144 C110 150 100 150 88 146 L88 160 C110 172 136 170 160 160 L186 160Z" fill="${K.skinD}"/>`;
ICON.toolbox = () => sh(100, 186, 76) + `<path d="M60 70 L60 52 Q60 44 68 44 L132 44 Q140 44 140 52 L140 70" stroke="${K.navy2}" stroke-width="10" fill="none"/><path d="M68 40 L54 6 M120 56 L150 14" stroke="${K.grayD}" stroke-width="10" stroke-linecap="round"/><circle cx="152" cy="12" r="12" fill="none" stroke="${K.grayD}" stroke-width="8"/>
  <rect x="22" y="70" width="156" height="108" rx="12" fill="${K.red}"/><rect x="22" y="70" width="156" height="34" rx="12" fill="${K.redD}"/><rect x="86" y="96" width="28" height="18" rx="4" fill="${K.yel}"/>`;
ICON.door = () => sh(100, 188, 70) + `<path d="M116 24 L184 24 L184 182 L116 182" fill="${K.yelL}"/><path d="M116 24 L184 24 L184 182" fill="none"/><rect x="40" y="20" width="88" height="164" rx="4" fill="${K.navy}"/><path d="M128 24 L180 40 L180 172 L128 180Z" fill="${K.red}"/><circle cx="168" cy="108" r="6" fill="${K.yel}"/>
  <path d="M46 26 L122 26 L122 178 L46 178Z" fill="${K.yel}" opacity=".9"/><path d="M60 178 L122 26 L122 178Z" fill="#fff" opacity=".35"/>`;
ICON.flask = () => sh(100, 186, 60) + `<path d="M76 20 L124 20 M84 22 L84 78 L36 160 Q28 180 50 180 L150 180 Q172 180 164 160 L116 78 L116 22" fill="${K.blueL}" stroke="${K.navy2}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M60 124 L140 124 L160 162 Q164 172 152 172 L48 172 Q36 172 40 162Z" fill="${K.red}"/><circle cx="84" cy="146" r="8" fill="#fff" opacity=".7"/><circle cx="112" cy="156" r="5" fill="#fff" opacity=".7"/><circle cx="104" cy="104" r="6" fill="${K.red}" opacity=".6"/><circle cx="92" cy="84" r="4" fill="${K.red}" opacity=".5"/>`;
ICON.book = () => sh(100, 180, 80) + `<path d="M100 52 C80 38 50 36 22 42 L22 160 C50 154 80 156 100 170Z" fill="#fff" stroke="${K.navy}" stroke-width="7" stroke-linejoin="round"/><path d="M100 52 C120 38 150 36 178 42 L178 160 C150 154 120 156 100 170Z" fill="${K.grayL}" stroke="${K.navy}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M40 72 L84 72 M40 92 L84 92 M40 112 L76 112" stroke="${K.gray}" stroke-width="6" stroke-linecap="round"/><path d="M116 72 L160 72 M116 92 L160 92" stroke="${K.gray}" stroke-width="6" stroke-linecap="round"/><path d="M140 40 L140 84 L150 76 L160 84 L160 40" fill="${K.red}"/>`;
ICON.box = () => sh(100, 186, 72) + `<path d="M100 22 L174 56 L100 90 L26 56Z" fill="#F0C68F"/><path d="M26 56 L100 90 L100 182 L26 148Z" fill="${K.kraft}"/><path d="M174 56 L100 90 L100 182 L174 148Z" fill="${K.kraftD}"/><path d="M62 39 L136 73 L136 104 L120 96 L120 81 L46 47Z" fill="#fff" opacity=".55"/>`;
ICON.seedling = () => sh(100, 188, 54) + `<path d="M100 118 L100 70" stroke="${K.greenD}" stroke-width="8" stroke-linecap="round"/><path d="M100 82 C70 84 52 66 50 40 C78 40 98 56 100 82Z" fill="${K.green}"/><path d="M100 72 C126 72 148 54 150 24 C120 24 100 44 100 72Z" fill="${K.greenD}"/>
  <path d="M50 116 L150 116 L138 182 L62 182Z" fill="${K.red}"/><rect x="44" y="108" width="112" height="20" rx="6" fill="${K.redD}"/><circle cx="100" cy="152" r="18" fill="${K.yel}"/><text x="100" y="161" text-anchor="middle" font-size="24" font-weight="800" fill="${K.yelD}" font-family="P">₩</text>`;
ICON.megaphone = () => sh(96, 184, 60) + `<path d="M40 80 L120 40 L120 160 L40 120Z" fill="${K.red}"/><path d="M80 60 L120 40 L120 160 L80 140Z" fill="${K.redD}" opacity=".35"/><rect x="22" y="76" width="26" height="48" rx="8" fill="${K.navy}"/><path d="M52 122 L62 168 L82 164 L76 128Z" fill="${K.navy2}"/>
  <path d="M146 72 C158 86 158 114 146 128" stroke="${K.red}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M166 56 C188 82 188 118 166 144" stroke="${K.red}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".55"/>`;
ICON.present = () => sh(100, 188, 60) + `<rect x="22" y="28" width="156" height="108" rx="8" fill="#fff" stroke="${K.navy}" stroke-width="7"/><rect x="14" y="20" width="172" height="14" rx="6" fill="${K.navy}"/><path d="M100 136 L100 166 M100 150 L70 184 M100 150 L130 184" stroke="${K.navy}" stroke-width="7" stroke-linecap="round"/>
  <rect x="42" y="96" width="18" height="26" rx="3" fill="${K.gray}"/><rect x="68" y="80" width="18" height="42" rx="3" fill="${K.blue}"/><rect x="94" y="62" width="18" height="60" rx="3" fill="${K.red}"/><circle cx="144" cy="80" r="22" fill="${K.yel}"/><path d="M144 80 L144 58 A22 22 0 0 1 164 90Z" fill="${K.yelD}"/>`;
ICON.userSearch = () => `<g transform="translate(-6 0) scale(.86)">${personInner({ outfit: 'gray', hair: 'short' })}</g>` + `<g transform="translate(96 92) scale(.5)">${ICON.magnifier()}</g>`;
ICON.laptop = () => sh(100, 178, 86) + `<rect x="36" y="40" width="128" height="94" rx="10" fill="${K.navy}"/><rect x="46" y="50" width="108" height="74" rx="4" fill="${K.blueL}"/><rect x="58" y="96" width="14" height="20" fill="${K.gray}"/><rect x="80" y="82" width="14" height="34" fill="${K.blue}"/><rect x="102" y="66" width="14" height="50" fill="${K.red}"/>
  <path d="M18 140 L182 140 L172 160 L28 160Z" fill="${K.gray}"/><rect x="84" y="140" width="32" height="6" rx="3" fill="${K.grayD}"/>`;
ICON.wallet = () => sh(100, 186, 76) + `<rect x="34" y="34" width="112" height="60" rx="6" fill="${K.green}" transform="rotate(-12 90 64)"/><rect x="22" y="62" width="156" height="114" rx="16" fill="${K.wood}"/><rect x="22" y="62" width="156" height="30" rx="14" fill="${K.woodD}"/>
  <rect x="122" y="108" width="62" height="40" rx="10" fill="${K.woodD}"/><circle cx="144" cy="128" r="8" fill="${K.yel}"/>`;
ICON.youtube = () => `<rect x="14" y="44" width="172" height="120" rx="34" fill="${K.red}"/><path d="M14 112 L186 112 L186 130 Q186 164 152 164 L48 164 Q14 164 14 130Z" fill="${K.redD}" opacity=".3"/><path d="M84 76 L134 104 L84 132Z" fill="#fff"/>`;
ICON.video = () => sh(100, 172, 76) + `<rect x="16" y="54" width="122" height="96" rx="16" fill="${K.red}"/><path d="M138 86 L184 60 L184 144 L138 118Z" fill="${K.redD}"/><circle cx="50" cy="82" r="10" fill="#fff" opacity=".8"/>`;
ICON.videoOff = () => ICON.video().replace(new RegExp(K.red, 'g'), K.grayD).replace(new RegExp(K.redD, 'g'), '#848C9C') + `<path d="M26 26 L176 176" stroke="${K.red}" stroke-width="16" stroke-linecap="round"/>`;
ICON.cart = () => sh(100, 188, 72) + `<path d="M14 36 L40 36 L62 136 L160 136" stroke="${K.navy}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 58 L178 58 L162 118 L58 118Z" fill="${K.redBg}"/>
  <rect x="64" y="38" width="36" height="44" rx="6" fill="${K.red}"/><rect x="104" y="28" width="40" height="54" rx="6" fill="${K.yel}"/><path d="M46 82 L170 82 L162 118 L58 118Z" fill="${K.red}"/><circle cx="74" cy="166" r="14" fill="${K.navy}"/><circle cx="148" cy="166" r="14" fill="${K.navy}"/>`;
ICON.map = () => sh(100, 186, 80) + `<path d="M20 44 L74 26 L126 44 L180 26 L180 160 L126 178 L74 160 L20 178Z" fill="${K.greenL}"/><path d="M74 26 L126 44 L126 178 L74 160Z" fill="#C9E6B9"/>
  <path d="M44 150 C60 120 90 140 110 110 C124 90 140 96 150 76" stroke="${K.red}" stroke-width="6" stroke-dasharray="10 9" fill="none" stroke-linecap="round"/><g transform="translate(126 18) scale(.36)">${ICON.pin()}</g><circle cx="44" cy="150" r="9" fill="${K.navy}"/>`;
ICON.clipboard = () => sh(100, 188, 66) + `<rect x="34" y="28" width="132" height="156" rx="14" fill="${K.wood}"/><rect x="48" y="44" width="104" height="128" rx="6" fill="#fff"/><rect x="72" y="18" width="56" height="26" rx="8" fill="${K.navy}"/>
  ${[0, 1, 2].map(r => `<rect x="62" y="${66 + r * 34}" width="18" height="18" rx="4" fill="${K.red}"/><path d="M66 ${75 + r * 34} L70 ${79 + r * 34} L77 ${70 + r * 34}" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="90" y="${70 + r * 34}" width="48" height="10" rx="5" fill="${K.gray}"/>`).join('')}`;
ICON.report = () => sh(100, 188, 60) + `<path d="M42 18 L130 18 L162 50 L162 182 L42 182Z" fill="#fff" stroke="${K.grayL}" stroke-width="4"/><path d="M130 18 L130 50 L162 50Z" fill="${K.gray}"/><rect x="58" y="40" width="54" height="10" rx="5" fill="${K.navy}"/>
  <rect x="62" y="122" width="18" height="40" rx="3" fill="${K.gray}"/><rect x="90" y="100" width="18" height="62" rx="3" fill="${K.blue}"/><rect x="118" y="74" width="18" height="88" rx="3" fill="${K.red}"/><rect x="58" y="64" width="44" height="8" rx="4" fill="${K.grayL}"/>`;
ICON.alert = () => `<circle cx="100" cy="100" r="84" fill="${K.red}"/><circle cx="100" cy="100" r="84" fill="none" stroke="${K.redBg}" stroke-width="0"/><rect x="88" y="44" width="24" height="76" rx="12" fill="#fff"/><circle cx="100" cy="146" r="13" fill="#fff"/>`;
ICON.medal = () => sh(100, 190, 50) + `<path d="M62 14 L94 14 L118 86 L86 86Z" fill="${K.red}"/><path d="M138 14 L106 14 L82 86 L114 86Z" fill="${K.blue}"/><circle cx="100" cy="128" r="54" fill="${K.yelD}"/><circle cx="100" cy="124" r="54" fill="${K.yel}"/><circle cx="100" cy="124" r="38" fill="none" stroke="${K.yelD}" stroke-width="6"/>
  <path d="M100 100 L107 116 L124 117 L111 128 L115 145 L100 136 L85 145 L89 128 L76 117 L93 116Z" fill="${K.yelD}"/>`;
ICON.maze = () => sh(100, 188, 70) + `<rect x="24" y="24" width="152" height="152" rx="16" fill="#fff" stroke="${K.navy}" stroke-width="9"/><path d="M58 24 L58 92 L104 92 M140 58 L104 58 L104 92 M58 128 L58 176 M58 128 L140 128 L140 92 M104 128 L104 160" stroke="${K.navy}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="160" r="9" fill="${K.red}"/><circle cx="168" cy="168" r="26" fill="${K.red}"/><text x="168" y="180" text-anchor="middle" font-size="36" font-weight="800" fill="#fff" font-family="P">?</text>`;
ICON.heart = (c = K.red) => `<path d="M100 172 C40 128 18 96 22 66 C26 38 50 24 72 26 C86 28 96 36 100 48 C104 36 114 28 128 26 C150 24 174 38 178 66 C182 96 160 128 100 172Z" fill="${c}"/><path d="M48 62 C52 48 62 42 72 42" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>`;
ICON.check = () => `<circle cx="100" cy="100" r="80" fill="${K.red}"/><path d="M62 102 L90 128 L140 74" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
ICON.xmark = () => `<circle cx="100" cy="100" r="80" fill="${K.red}"/><path d="M68 68 L132 132 M132 68 L68 132" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round"/>`;
ICON.question = () => `<circle cx="100" cy="100" r="80" fill="${K.red}"/><text x="100" y="134" text-anchor="middle" font-size="104" font-weight="800" fill="#fff" font-family="P">?</text>`;
ICON.refreshCoin = () => `<path d="M40 86 A64 64 0 0 1 152 58" stroke="${K.red}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M160 114 A64 64 0 0 1 48 142" stroke="${K.red}" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M136 46 L160 50 L156 74" stroke="${K.red}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M64 154 L40 150 L44 126" stroke="${K.red}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <g transform="translate(46 34) scale(.36)">${ICON.diamond()}</g><g transform="translate(96 76) scale(.36)">${ICON.coin()}</g>`;
ICON.chat = () => `<path d="M30 40 L170 40 Q186 40 186 56 L186 128 Q186 144 170 144 L86 144 L52 172 L56 144 L30 144 Q14 144 14 128 L14 56 Q14 40 30 40Z" fill="${K.blueL}"/><circle cx="64" cy="92" r="11" fill="${K.blueD}"/><circle cx="100" cy="92" r="11" fill="${K.blueD}"/><circle cx="136" cy="92" r="11" fill="${K.red}"/>`;
ICON.hand = () => `<path d="M60 190 L60 130 C60 120 48 100 46 88 C44 76 58 72 66 84 L78 104 L78 34 C78 22 96 22 96 34 L96 90 L96 76 C96 66 112 66 112 76 L112 92 L112 82 C112 72 128 72 128 82 L128 96 L128 90 C128 80 144 80 144 90 L144 140 C144 160 132 172 132 190Z" fill="${K.skin}" stroke="${K.navy}" stroke-width="6" stroke-linejoin="round"/>`;
ICON.users = () => `<g transform="translate(0 24) scale(.5)">${badgeSVG({ outfit: 'purple', hair: 'quiff' }, K.yel).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>
  <g transform="translate(100 24) scale(.5)">${badgeSVG({ outfit: 'jacket', hair: 'long' }, K.green).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>
  <g transform="translate(40 66) scale(.6)">${badgeSVG({ outfit: 'red', hair: 'short' }, K.redBg).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`;
ICON.family = () => `<g transform="translate(-6 18) scale(.62)">${personInner({ outfit: 'blue', hair: 'short' })}</g><g transform="translate(78 24) scale(.6)">${personInner({ outfit: 'pinkTop', hair: 'long' })}</g><g transform="translate(52 92) scale(.42)">${personInner({ outfit: 'red', hair: 'short' })}</g>`;
ICON.parents = () => `<g transform="translate(-4 16) scale(.62)">${personInner({ outfit: 'jacket', hair: 'short', hairColor: '#B9B4B0' })}</g><g transform="translate(76 22) scale(.6)">${personInner({ outfit: 'yellow', hair: 'bun', hairColor: '#C9C3BE' })}</g><circle cx="162" cy="44" r="26" fill="${K.red}"/><text x="162" y="56" text-anchor="middle" font-size="34" font-weight="800" fill="#fff" font-family="P">₩</text>`;
ICON.pointer = () => `<path d="M40 20 L40 170 L78 134 L104 188 L130 176 L104 122 L156 122Z" fill="#fff" stroke="${K.navy}" stroke-width="10" stroke-linejoin="round"/>`;

function iconSVG(name, size = 200, arg) {
  const f = ICON[name];
  if (!f) throw new Error('art ' + name);
  return svg(size, size, '0 0 200 200', f(arg));
}

export { K, OUTFITS, svg, personInner, personSVG, badgeSVG, ICON, iconSVG };
