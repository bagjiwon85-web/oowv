import React from 'react';
import {P, blob, ink, smooth} from './ink';

/*
 * Original hand-inked style characters (drawn from scratch, not traced).
 * Office outfit: white shirt + black tie. "man" (messy layered hair) and
 * "woman" (bob with side-swept bangs). Expressions and gestures are switchable.
 * Head centre line is x = 470; the drawing spans x 150..790, y 20..580.
 */

export type Who = 'man' | 'woman';
export type Face = 'neutral' | 'smile' | 'surprise' | 'worry' | 'think' | 'happy' | 'determined';
export type Arms = 'none' | 'chin' | 'cheek' | 'present' | 'point' | 'fist';

const K = '#111';
const W = '#fff';

/** Mirror points around the head centre line. */
const mx = (pts: P[]): P[] => pts.map(([x, y]) => [940 - x, y]);

const Ink: React.FC<{p: P[]; w?: number; s?: number; e?: number; color?: string}> = ({p, w = 5, s = 0.15, e = 0.15, color = K}) => (
  <path d={ink(p, w, s, e)} fill={color} />
);
const Fill: React.FC<{p: P[]; color?: string}> = ({p, color = W}) => <path d={smooth(p, true)} fill={color} />;

// ───────────── body ─────────────

const SHIRT_L: P[] = [[446, 300], [404, 320], [352, 338], [312, 360], [290, 392], [280, 440], [274, 500], [270, 580]];
const SHIRT_R: P[] = mx(SHIRT_L);

const Body: React.FC<{who: Who}> = ({who}) => {
  const k = who === 'woman' ? 0.92 : 1;
  const sc = (pts: P[]): P[] => pts.map(([x, y]) => [470 + (x - 470) * k, y]);
  const L = sc(SHIRT_L);
  const R = sc(SHIRT_R);
  return (
    <g>
      <path d={`M${L.map((p) => p.join(' ')).join(' L')} L${[...R].reverse().map((p) => p.join(' ')).join(' L')} Z`} fill={W} />
      <Ink p={L} w={6} s={0.5} e={0.9} />
      <Ink p={R} w={6} s={0.5} e={0.9} />
      {/* arm / torso boundary + folds */}
      <Ink p={sc([[318, 430], [326, 480], [330, 540], [330, 580]])} w={4} s={0.1} e={0.6} />
      <Ink p={sc([[622, 430], [614, 480], [610, 540], [610, 580]])} w={4} s={0.1} e={0.6} />
      <Ink p={sc([[338, 396], [350, 408], [356, 426]])} w={3.4} />
      <Ink p={sc([[602, 396], [590, 408], [584, 426]])} w={3.4} />
      <Ink p={sc([[392, 470], [400, 500], [402, 530]])} w={3} />
      <Ink p={sc([[548, 470], [540, 500], [538, 530]])} w={3} />
      <Ink p={sc([[372, 360], [384, 368]])} w={2.6} />
      <Ink p={sc([[568, 360], [556, 368]])} w={2.6} />
      {/* neck */}
      <path d="M440 240 L436 330 L504 330 L500 240 Z" fill={W} />
      <Ink p={[[442, 258], [440, 290], [436, 318]]} w={4.6} s={0.3} e={0.5} />
      <Ink p={[[498, 258], [500, 290], [504, 318]]} w={4.6} s={0.3} e={0.5} />
      <Ink p={[[452, 300], [460, 306]]} w={2.4} />
      {/* tie */}
      <path d={blob([[458, 348, true], [482, 348, true], [487, 372, true], [453, 372, true]])} fill={K} />
      <path d={blob([[454, 370, true], [486, 370, true], [504, 540, true], [470, 590, true], [436, 540, true]])} fill={K} />
      {/* collar flaps */}
      {[false, true].map((m) => {
        const flap: P[] = [[438, 288], [418, 318], [414, 348], [426, 376], [466, 352]];
        const pts = m ? mx(flap) : flap;
        return (
          <g key={String(m)}>
            <path d={blob(pts.map(([x, y], i) => [x, y, i === 3 || i === 4] as [number, number, boolean]))} fill={W} />
            <Ink p={pts.slice(0, 4)} w={4.4} s={0.3} e={0.4} />
            <Ink p={[pts[3], pts[4]]} w={4} s={0.4} e={0.2} />
          </g>
        );
      })}
    </g>
  );
};

// ───────────── head ─────────────

const FACE_M: P[] = [[400, 150], [402, 192], [410, 226], [426, 254], [448, 274], [470, 281], [492, 274], [514, 254], [530, 226], [538, 192], [540, 150]];
const FACE_W: P[] = [[404, 152], [406, 194], [414, 226], [430, 252], [450, 268], [470, 274], [490, 268], [510, 252], [526, 226], [534, 194], [536, 152]];
const EAR: P[] = [[404, 176], [392, 168], [384, 182], [388, 204], [398, 220], [410, 222]];
const EAR_IN: P[] = [[394, 186], [396, 200], [402, 208]];

const Head: React.FC<{who: Who}> = ({who}) => {
  const face = who === 'woman' ? FACE_W : FACE_M;
  return (
    <g>
      {[EAR, mx(EAR)].map((e, i) => (
        <g key={i}>
          <Fill p={e} />
          <Ink p={e} w={4.2} s={0.3} e={0.3} />
          <Ink p={i === 0 ? EAR_IN : mx(EAR_IN)} w={2.6} />
        </g>
      ))}
      <path d={`${smooth(face, false)} L${face[face.length - 1][0]} 120 L${face[0][0]} 120 Z`} fill={W} />
      <Ink p={face} w={5.2} s={0.4} e={0.4} />
    </g>
  );
};

// Messy layered men's hair: outer silhouette with clumped tips, fringe falling over the forehead.
const HAIR_M: [number, number, boolean?][] = [
  [404, 204, true],
  [396, 172],
  [388, 140],
  [376, 118, true],
  [392, 106],
  [400, 84],
  [418, 66],
  [440, 54],
  [462, 38, true],
  [476, 48],
  [500, 44],
  [524, 52],
  [544, 66],
  [568, 70, true],
  [558, 88],
  [562, 112],
  [558, 140],
  [550, 166],
  [540, 202, true],
  [536, 168],
  [528, 144],
  [520, 134],
  [518, 172, true],
  [506, 140],
  [494, 128],
  [480, 126],
  [482, 168, true],
  [468, 136],
  [452, 132],
  [440, 140],
  [430, 176, true],
  [424, 148],
  [414, 144],
  [410, 160],
  [410, 186],
];

// Women's bob: back mass + side-swept bangs.
const HAIR_W_BACK: [number, number, boolean?][] = [
  [382, 300, true],
  [374, 240],
  [372, 170],
  [386, 100],
  [430, 58],
  [478, 50],
  [530, 62],
  [566, 104],
  [574, 170],
  [568, 240],
  [560, 300, true],
  [544, 292],
  [530, 300, true],
  [536, 220],
  [404, 220],
  [410, 300, true],
  [396, 292],
];
const HAIR_W_FRONT: [number, number, boolean?][] = [
  [404, 200, true],
  [398, 150],
  [410, 104],
  [450, 72],
  [500, 70],
  [540, 96],
  [548, 140],
  [540, 196, true],
  [530, 150],
  [514, 126],
  [496, 140],
  [470, 156, true],
  [478, 132],
  [452, 146],
  [430, 166],
  [416, 190],
];

const HairBack: React.FC<{who: Who}> = ({who}) => (who === 'woman' ? <path d={blob(HAIR_W_BACK)} fill={K} /> : null);

const HairFront: React.FC<{who: Who}> = ({who}) =>
  who === 'woman' ? (
    <g>
      <path d={blob(HAIR_W_FRONT)} fill={K} />
      <Ink p={[[506, 92], [488, 104], [470, 124]]} w={2.6} color={W} />
    </g>
  ) : (
    <g>
      <path d={blob(HAIR_M)} fill={K} />
      {/* strand highlights following the sweep of the hair */}
      <Ink p={[[430, 74], [452, 70], [476, 76], [496, 92]]} w={2.6} color={W} />
      <Ink p={[[466, 92], [486, 98], [504, 112]]} w={2.2} color={W} />
      <Ink p={[[520, 74], [536, 90], [544, 112]]} w={2.4} color={W} />
      <Ink p={[[404, 112], [400, 132], [402, 150]]} w={2.2} color={W} />
    </g>
  );

// ───────────── face features ─────────────

const EYE_Y = 196;
const EL = 440;
const ER = 500;

const Eyes: React.FC<{who: Who; face: Face}> = ({who, face}) => {
  const fem = who === 'woman';
  if (face === 'happy') {
    return (
      <g>
        {[EL, ER].map((c) => (
          <Ink key={c} p={[[c - 13, EYE_Y + 3], [c, EYE_Y - 7], [c + 13, EYE_Y + 3]]} w={5} s={0.3} e={0.3} />
        ))}
      </g>
    );
  }
  const wide = face === 'surprise';
  const look = face === 'think' ? 3 : 0;
  const lidY = face === 'determined' ? EYE_Y - 4 : EYE_Y - 7;
  return (
    <g>
      {[EL, ER].map((c, i) => {
        const outer = i === 0 ? -1 : 1;
        return (
          <g key={c}>
            {wide && <ellipse cx={c} cy={EYE_Y + 1} rx={11} ry={11} fill={W} stroke={K} strokeWidth={2.6} />}
            <ellipse cx={c + look} cy={EYE_Y + 2} rx={wide ? 5 : 6} ry={wide ? 5 : 7.4} fill={K} />
            <circle cx={c + look + 2} cy={EYE_Y - 1} r={1.8} fill={W} />
            {!wide && (
              <>
                {/* heavy upper lid, thicker toward the outer corner */}
                <Ink
                  p={[[c - 14, lidY + 3], [c, lidY - 2], [c + 14, lidY + 2]]}
                  w={fem ? 5.4 : 4.6}
                  s={outer < 0 ? 0.9 : 0.2}
                  e={outer < 0 ? 0.2 : 0.9}
                />
                {fem && <Ink p={[[c + 14 * outer, lidY + 2], [c + 19 * outer, lidY - 2]]} w={2.6} s={0.6} e={0.1} />}
                <Ink p={[[c - 6, EYE_Y + 12], [c + 6, EYE_Y + 12]]} w={1.8} />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
};

const BROW_SHAPE: Record<Face, [number, number]> = {
  neutral: [0, 2],
  smile: [0, 2],
  happy: [-3, -1],
  surprise: [-12, -8],
  worry: [-6, 6],
  think: [2, -4],
  determined: [6, -2],
};

const Brows: React.FC<{who: Who; face: Face}> = ({who, face}) => {
  const w = who === 'woman' ? 3.6 : 5.2;
  const [inner, outer] = BROW_SHAPE[face];
  const y = 170;
  const L: P[] = [[EL - 18, y + outer], [EL - 4, y - 3 + (inner + outer) / 2], [EL + 14, y + inner]];
  let R: P[] = mx(L).reverse();
  if (face === 'think') R = R.map(([x, yy]) => [x, yy - 6]); // one brow raised
  return (
    <g>
      <Ink p={L} w={w} s={0.6} e={0.3} />
      <Ink p={R} w={w} s={0.3} e={0.6} />
    </g>
  );
};

const Nose: React.FC = () => (
  <g>
    <Ink p={[[474, 206], [470, 222], [466, 230]]} w={2.6} s={0.1} e={0.6} />
    <Ink p={[[464, 232], [472, 234]]} w={2.6} s={0.6} e={0.2} />
  </g>
);

const Mouth: React.FC<{face: Face}> = ({face}) => {
  const y = 252;
  switch (face) {
    case 'surprise':
      return (
        <g>
          <ellipse cx={470} cy={y} rx={9} ry={11} fill={K} />
          <ellipse cx={470} cy={y + 5} rx={5} ry={3} fill="#555" />
        </g>
      );
    case 'smile':
      return <Ink p={[[458, y - 2], [470, y + 4], [482, y - 2]]} w={3.6} s={0.3} e={0.3} />;
    case 'happy':
      return (
        <g>
          <path d={smooth([[454, y - 6], [470, y - 4], [486, y - 6], [480, y + 8], [470, y + 12], [460, y + 8]])} fill={K} />
          <path d={smooth([[460, y + 4], [470, y + 1], [480, y + 4], [470, y + 10]])} fill="#666" />
        </g>
      );
    case 'worry':
      return <Ink p={[[460, y + 2], [466, y - 2], [474, y + 1], [482, y - 2]]} w={3.2} />;
    case 'think':
      return <Ink p={[[464, y], [480, y - 3]]} w={3.2} />;
    case 'determined':
      return <Ink p={[[460, y], [480, y]]} w={3.8} s={0.4} e={0.4} />;
    default:
      return <Ink p={[[462, y], [470, y + 1], [478, y]]} w={3.2} s={0.3} e={0.3} />;
  }
};

// ───────────── gestures ─────────────

/** Sleeve from a (shoulder side) to b (cuff) drawn as a white tube with inked edges. */
const Sleeve: React.FC<{a: P; b: P; w0: number; w1: number}> = ({a, b, w0, w1}) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const a1: P = [a[0] + nx * w0, a[1] + ny * w0];
  const a2: P = [a[0] - nx * w0, a[1] - ny * w0];
  const b1: P = [b[0] + nx * w1, b[1] + ny * w1];
  const b2: P = [b[0] - nx * w1, b[1] - ny * w1];
  const c1: P = [b1[0] - ux * 14, b1[1] - uy * 14];
  const c2: P = [b2[0] - ux * 14, b2[1] - uy * 14];
  return (
    <g>
      <path d={`M${a1.join(' ')} L${b1.join(' ')} L${b2.join(' ')} L${a2.join(' ')} Z`} fill={W} />
      <Ink p={[a1, b1]} w={5} s={0.6} e={0.8} />
      <Ink p={[a2, b2]} w={5} s={0.6} e={0.8} />
      <Ink p={[c1, c2]} w={3.2} />
      <Ink p={[b1, b2]} w={4.2} s={0.6} e={0.6} />
    </g>
  );
};

const Hand: React.FC<{outline: P[]; creases?: P[][]}> = ({outline, creases = []}) => (
  <g>
    <Fill p={outline} />
    <Ink p={[...outline, outline[0], outline[1]]} w={4.4} s={0.5} e={0.5} />
    {creases.map((c, i) => (
      <Ink key={i} p={c} w={2.8} />
    ))}
  </g>
);

const ArmsLayer: React.FC<{arms: Arms}> = ({arms}) => {
  switch (arms) {
    case 'present':
      // left forearm rising, open palm facing up at shoulder height
      return (
        <g>
          <Sleeve a={[316, 600]} b={[276, 438]} w0={38} w1={30} />
          <Hand
            outline={[
              [282, 462],
              [248, 454],
              [212, 446],
              [190, 442],
              [182, 432],
              [170, 428],
              [164, 420],
              [152, 414],
              [146, 406],
              [136, 400],
              [138, 392],
              [154, 392],
              [176, 396],
              [190, 392],
              [196, 372],
              [206, 356],
              [216, 352],
              [222, 360],
              [220, 380],
              [232, 396],
              [256, 402],
              [278, 410],
              [290, 426],
            ]}
            creases={[
              [[182, 432], [204, 430]],
              [[164, 420], [192, 418]],
              [[146, 406], [176, 406]],
              [[226, 418], [246, 426], [258, 440]],
            ]}
          />
        </g>
      );
    case 'point':
      // right hand raised beside the face; index finger up on the thumb side, other fingers folded
      return (
        <g>
          <Sleeve a={[648, 600]} b={[668, 414]} w0={36} w1={30} />
          <Hand
            outline={[
              [640, 410],
              [634, 380],
              [636, 352],
              [640, 330],
              [640, 282],
              [646, 270],
              [656, 272],
              [660, 284],
              [660, 330],
              [670, 334],
              [682, 336],
              [694, 344],
              [702, 360],
              [702, 386],
              [696, 410],
            ]}
            creases={[
              [[672, 336], [672, 350]],
              [[686, 340], [686, 354]],
              [[642, 382], [662, 374], [682, 368], [692, 362]],
            ]}
          />
        </g>
      );
    case 'chin':
      // loose fist under the chin, forearm rising from the bottom
      return (
        <g>
          <Sleeve a={[380, 600]} b={[440, 358]} w0={40} w1={30} />
          <Hand
            outline={[
              [418, 352],
              [416, 322],
              [426, 300],
              [440, 290],
              [446, 276],
              [458, 270],
              [466, 278],
              [464, 292],
              [478, 300],
              [484, 320],
              [478, 346],
              [462, 362],
              [436, 366],
            ]}
            creases={[
              [[428, 314], [446, 310], [466, 314]],
              [[428, 334], [448, 330], [470, 334]],
            ]}
          />
        </g>
      );
    case 'cheek':
      // open palm pressed to the cheek (surprise)
      return (
        <g>
          <Sleeve a={[290, 600]} b={[380, 334]} w0={38} w1={30} />
          <Hand
            outline={[
              [360, 332],
              [364, 290],
              [372, 250],
              [378, 212],
              [388, 204],
              [396, 214],
              [396, 240],
              [404, 206],
              [414, 200],
              [420, 212],
              [414, 252],
              [424, 230],
              [432, 230],
              [432, 248],
              [422, 290],
              [414, 330],
              [398, 348],
            ]}
            creases={[[[396, 262], [394, 290]]]}
          />
        </g>
      );
    case 'fist':
      // determined fist raised at chest height
      return (
        <g>
          <Sleeve a={[650, 600]} b={[604, 458]} w0={38} w1={30} />
          <Hand
            outline={[
              [572, 456],
              [566, 426],
              [570, 400],
              [580, 390],
              [592, 386],
              [600, 392],
              [608, 384],
              [620, 388],
              [632, 396],
              [636, 422],
              [630, 448],
              [612, 462],
              [588, 464],
            ]}
            creases={[
              [[600, 392], [598, 404]],
              [[620, 390], [618, 402]],
              [[572, 432], [596, 426], [620, 432]],
            ]}
          />
        </g>
      );
    default:
      return null;
  }
};

/** Viewbox of the drawing; the head centre line (x = 470) is the horizontal middle. */
export const PERSON_VB = {x: 150, y: 20, w: 640, h: 560};

export const Person: React.FC<{
  who?: Who;
  face?: Face;
  arms?: Arms;
  height?: number;
  flip?: boolean;
  style?: React.CSSProperties;
}> = ({who = 'man', face = 'neutral', arms = 'none', height = 560, flip, style}) => {
  const vb = PERSON_VB;
  return (
    <svg
      width={(height * vb.w) / vb.h}
      height={height}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style}}
    >
      <HairBack who={who} />
      <Body who={who} />
      <Head who={who} />
      <Brows who={who} face={face} />
      <Eyes who={who} face={face} />
      <Nose />
      <Mouth face={face} />
      <HairFront who={who} />
      <ArmsLayer arms={arms} />
    </svg>
  );
};
