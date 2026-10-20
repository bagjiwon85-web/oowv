import React from 'react';

/*
 * Original black-and-white line-art characters (drawn from scratch as SVG).
 * Office outfit: white shirt + black tie. Two people: "man" and "woman".
 * Poses combine an expression with an arm gesture.
 */

export type Who = 'man' | 'woman';
export type Face = 'neutral' | 'smile' | 'surprise' | 'worry' | 'think' | 'happy' | 'determined';
export type Arms = 'none' | 'chin' | 'cheek' | 'present' | 'point' | 'fist';

const K = '#111';
// Head drawn slightly larger than the body, scaled about the chin.
const HEAD_SCALE = 'translate(200 330) scale(1.13) translate(-200 -330)';
const SW = 4;

const line = {fill: 'none', stroke: K, strokeWidth: SW, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const thin = {...line, strokeWidth: 3};
const solid = {fill: K, stroke: K, strokeWidth: 2, strokeLinejoin: 'round' as const};
const white = {fill: '#fff', stroke: K, strokeWidth: SW, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

const Body: React.FC<{who: Who}> = ({who}) => {
  const w = who === 'woman' ? 0.9 : 1;
  const sx = (x: number) => 200 + (x - 200) * w;
  return (
    <g>
      {/* neck */}
      <path d="M180 296 L178 360 L222 360 L220 296 Z" fill="#fff" stroke="none" />
      <path d="M180 296 L178 356" {...line} />
      <path d="M220 296 L222 356" {...line} />
      {/* shirt */}
      <path
        d={`M${sx(26)} 600 C${sx(28)} 520 ${sx(36)} 466 ${sx(66)} 440 C${sx(94)} 418 ${sx(138)} 400 ${sx(170)} 366 L200 408 L${sx(230)} 366 C${sx(262)} 400 ${sx(306)} 418 ${sx(334)} 440 C${sx(364)} 466 ${sx(372)} 520 ${sx(374)} 600 Z`}
        {...white}
      />
      {/* fold lines */}
      <path d={`M${sx(84)} 500 C${sx(90)} 530 ${sx(90)} 566 ${sx(88)} 600`} {...thin} />
      <path d={`M${sx(316)} 500 C${sx(310)} 530 ${sx(310)} 566 ${sx(312)} 600`} {...thin} />
      <path d={`M${sx(112)} 440 C${sx(122)} 452 ${sx(126)} 466 ${sx(126)} 478`} {...thin} />
      <path d={`M${sx(288)} 440 C${sx(278)} 452 ${sx(274)} 466 ${sx(274)} 478`} {...thin} />
      {/* tie */}
      <path d="M190 402 L210 402 L214 424 L186 424 Z" {...solid} />
      <path d="M187 424 L213 424 L226 556 L200 600 L174 556 Z" {...solid} />
      {/* collar */}
      <path d="M178 348 L158 392 L198 412 Z" {...white} />
      <path d="M222 348 L242 392 L202 412 Z" {...white} />
    </g>
  );
};

const HairBack: React.FC<{who: Who}> = ({who}) =>
  who === 'woman' ? (
    <path
      d="M112 326 C92 250 96 150 140 104 C180 66 240 68 274 104 C312 146 312 250 290 326 C276 334 262 332 254 322 L262 200 L140 200 L146 322 C138 334 122 334 112 326 Z"
      {...solid}
    />
  ) : null;

const Head: React.FC<{who: Who}> = ({who}) => {
  const face =
    who === 'woman'
      ? 'M136 176 C134 244 154 298 200 312 C246 298 266 244 264 176'
      : 'M130 176 C128 250 152 302 200 316 C248 302 272 250 270 176';
  const ex = who === 'woman' ? 134 : 128;
  return (
    <g>
      <path d={`${face} L264 150 L136 150 Z`} fill="#fff" stroke="none" />
      <path d={face} {...line} />
      {/* ears */}
      <path d={`M${ex + 2} 212 C${ex - 16} 202 ${ex - 18} 246 ${ex + 4} 256`} {...white} />
      <path d={`M${400 - ex - 2} 212 C${400 - ex + 16} 202 ${400 - ex + 18} 246 ${400 - ex - 4} 256`} {...white} />
      <path d={`M${ex - 4} 222 C${ex - 8} 230 ${ex - 6} 240 ${ex + 1} 244`} {...thin} />
      <path d={`M${400 - ex + 4} 222 C${400 - ex + 8} 230 ${400 - ex + 6} 240 ${400 - ex - 1} 244`} {...thin} />
    </g>
  );
};

const HairFront: React.FC<{who: Who}> = ({who}) =>
  who === 'woman' ? (
    <g>
      {/* fringe swept to one side */}
      <path
        d="M132 214 C124 140 160 92 210 90 C258 90 284 132 270 210 C262 180 252 160 236 146 C214 166 176 176 150 170 C142 184 136 198 132 214 Z"
        {...solid}
      />
      <path d="M236 146 C226 170 214 184 200 192" fill="none" stroke={K} strokeWidth={3} strokeLinecap="round" />
    </g>
  ) : (
    <g>
      <path
        d="M124 212 C108 140 140 76 206 70 C262 66 296 108 284 196 C280 214 276 214 274 196 C272 168 262 148 250 136 C232 156 196 158 164 146 C152 166 140 184 136 206 C132 222 126 224 124 212 Z"
        {...solid}
      />
      {/* side-part strands */}
      <path d="M250 136 C258 120 268 116 280 120" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <path d="M200 152 C214 138 228 132 244 132" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M164 146 C170 156 166 170 158 178" fill="none" stroke={K} strokeWidth={5} strokeLinecap="round" />
    </g>
  );

const Eyes: React.FC<{who: Who; face: Face}> = ({who, face}) => {
  const L = 170;
  const R = 230;
  const y = 236;
  const lash = who === 'woman';
  if (face === 'happy') {
    return (
      <g>
        <path d={`M${L - 13} ${y + 2} Q${L} ${y - 12} ${L + 13} ${y + 2}`} {...line} strokeWidth={5} />
        <path d={`M${R - 13} ${y + 2} Q${R} ${y - 12} ${R + 13} ${y + 2}`} {...line} strokeWidth={5} />
      </g>
    );
  }
  const big = face === 'surprise';
  const rx = big ? 8 : 6.5;
  const ry = big ? 9 : 8.5;
  const eye = (cx: number, dir: number) => (
    <g key={cx}>
      {big ? (
        <>
          <circle cx={cx} cy={y} r={13} fill="#fff" stroke={K} strokeWidth={3} />
          <circle cx={cx} cy={y + 1} r={6} fill={K} />
        </>
      ) : (
        <>
          <path d={`M${cx - 14} ${y - 3} Q${cx} ${y - 14} ${cx + 14} ${y - 3}`} {...line} strokeWidth={lash ? 5 : 4} />
          <ellipse cx={face === 'think' ? cx + 3 * dir * 0 + 3 : cx} cy={y + 2} rx={rx} ry={ry} fill={K} />
          <circle cx={(face === 'think' ? cx + 3 : cx) + 2} cy={y - 1} r={2} fill="#fff" />
          {lash && <path d={`M${cx + 14 * dir} ${y - 4} L${cx + 19 * dir} ${y - 8}`} {...line} strokeWidth={3} />}
        </>
      )}
    </g>
  );
  return (
    <g>
      {eye(L, -1)}
      {eye(R, 1)}
      {/* lower lid hints */}
      {!big && (
        <>
          <path d={`M${L - 7} ${y + 14} Q${L} ${y + 16} ${L + 7} ${y + 14}`} {...thin} strokeWidth={2} />
          <path d={`M${R - 7} ${y + 14} Q${R} ${y + 16} ${R + 7} ${y + 14}`} {...thin} strokeWidth={2} />
        </>
      )}
    </g>
  );
};

const Brows: React.FC<{who: Who; face: Face}> = ({who, face}) => {
  const t = who === 'woman' ? 3.5 : 5.5;
  const b = {...line, strokeWidth: t};
  switch (face) {
    case 'surprise':
      return (
        <g>
          <path d="M150 200 Q168 186 186 196" {...b} />
          <path d="M214 196 Q232 186 250 200" {...b} />
        </g>
      );
    case 'worry':
      return (
        <g>
          <path d="M152 214 Q170 206 186 202" {...b} />
          <path d="M214 202 Q230 206 248 214" {...b} />
        </g>
      );
    case 'determined':
      return (
        <g>
          <path d="M152 206 Q170 208 188 216" {...b} />
          <path d="M212 216 Q230 208 248 206" {...b} />
        </g>
      );
    case 'think':
      return (
        <g>
          <path d="M152 210 Q168 204 186 208" {...b} />
          <path d="M214 204 Q232 196 250 204" {...b} />
        </g>
      );
    default:
      return (
        <g>
          <path d="M152 210 Q168 202 186 206" {...b} />
          <path d="M214 206 Q232 202 248 210" {...b} />
        </g>
      );
  }
};

const Mouth: React.FC<{face: Face}> = ({face}) => {
  switch (face) {
    case 'surprise':
      return (
        <g>
          <ellipse cx={200} cy={292} rx={14} ry={17} fill="#fff" stroke={K} strokeWidth={4} />
          <path d="M190 298 Q200 290 210 298 L208 304 Q200 308 192 304 Z" fill={K} />
        </g>
      );
    case 'smile':
      return <path d="M184 286 Q200 298 216 286" {...line} />;
    case 'happy':
      return (
        <g>
          <path d="M180 282 Q200 284 220 282 Q214 306 200 306 Q186 306 180 282 Z" fill={K} stroke={K} strokeWidth={3} strokeLinejoin="round" />
          <path d="M186 296 Q200 290 214 296 Q208 304 200 304 Q192 304 186 296 Z" fill="#fff" />
        </g>
      );
    case 'worry':
      return <path d="M186 294 Q193 288 200 292 Q207 296 214 290" {...line} />;
    case 'think':
      return <path d="M192 292 L210 289" {...line} />;
    case 'determined':
      return <path d="M186 290 L214 290" {...line} />;
    default:
      return <path d="M188 289 Q200 293 212 289" {...line} />;
  }
};

/** Simple hand shapes, drawn in local coordinates then placed by the arm. */
const ArmsLayer: React.FC<{arms: Arms; who: Who}> = ({arms}) => {
  switch (arms) {
    case 'chin':
      // fist under the chin, forearm rising diagonally from the bottom
      return (
        <g>
          <path d="M96 600 C120 520 150 440 178 384 L224 402 C200 460 172 530 150 600 Z" {...white} />
          <path d="M176 392 L222 410" {...thin} />
          <path
            d="M178 388 C168 368 170 340 184 326 C196 314 220 314 230 326 C240 340 238 366 228 384 C220 398 196 402 178 388 Z"
            {...white}
          />
          <path d="M188 328 C186 316 192 306 202 306 C210 306 214 314 212 324" {...white} />
          <path d="M184 346 C198 342 214 344 230 350" {...thin} />
          <path d="M182 366 C196 362 214 364 230 370" {...thin} />
        </g>
      );
    case 'cheek':
      // open palm against the left cheek
      return (
        <g>
          <path d="M60 600 C70 520 96 450 118 400 L156 420 C140 470 120 530 112 600 Z" {...white} />
          <path d="M112 404 L150 424" {...thin} />
          <path
            d="M118 404 C112 360 112 320 118 284 C120 268 132 266 134 282 L136 258 C138 242 152 242 152 258 L152 300 C158 296 166 302 164 314 C160 340 156 372 152 410 Z"
            {...white}
          />
          <path d="M136 282 L138 330" {...thin} />
          <path d="M152 300 L150 340" {...thin} />
        </g>
      );
    case 'present':
      // right arm out to the side, palm up
      return (
        <g>
          <path d="M330 470 C360 470 400 450 432 420 L452 446 C420 482 380 510 336 520 Z" {...white} />
          <path d="M428 424 L448 450" {...thin} />
          <path
            d="M440 424 C456 404 486 396 516 398 C524 400 522 410 512 412 L482 416 C500 418 514 424 512 434 C506 448 480 452 456 450 Z"
            {...white}
          />
          <path d="M486 430 L506 428" {...thin} />
        </g>
      );
    case 'point':
      // index finger raised next to the face
      return (
        <g>
          <path d="M330 600 C334 530 330 470 320 420 L364 410 C374 460 382 530 380 600 Z" {...white} />
          <path d="M320 426 L364 416" {...thin} />
          <path
            d="M318 420 C312 400 312 380 322 368 L326 300 C326 286 344 286 344 300 L344 362 C356 360 368 366 368 380 C372 396 368 410 362 418 Z"
            {...white}
          />
          <path d="M326 372 C334 368 344 370 352 376" {...thin} />
          <path d="M324 394 C334 390 346 392 356 398" {...thin} />
        </g>
      );
    case 'fist':
      // determined fist at chest height
      return (
        <g>
          <path d="M240 600 C250 540 266 500 280 470 L322 486 C310 520 296 560 290 600 Z" {...white} />
          <path d="M280 476 L320 492" {...thin} />
          <path d="M268 470 C262 440 272 416 296 412 C320 408 336 424 334 446 C332 470 318 486 296 488 C282 488 272 482 268 470 Z" {...white} />
          <path d="M282 424 L284 452" {...thin} />
          <path d="M298 420 L300 452" {...thin} />
          <path d="M314 424 L314 452" {...thin} />
        </g>
      );
    default:
      return null;
  }
};

export const Person: React.FC<{
  who?: Who;
  face?: Face;
  arms?: Arms;
  height?: number;
  flip?: boolean;
  style?: React.CSSProperties;
}> = ({who = 'man', face = 'neutral', arms = 'none', height = 560, flip, style}) => {
  // viewBox leaves room either side for gestures
  const vb = {x: -20, y: 50, w: 560, h: 550};
  return (
    <svg
      width={(height * vb.w) / vb.h}
      height={height}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style}}
    >
      <g transform={HEAD_SCALE}>
        <HairBack who={who} />
      </g>
      <Body who={who} />
      <g transform={HEAD_SCALE}>
        <Head who={who} />
        <HairFront who={who} />
        <Brows who={who} face={face} />
        <Eyes who={who} face={face} />
        {/* nose */}
        <path d="M202 244 C198 258 196 266 206 268" {...line} strokeWidth={3} />
        <Mouth face={face} />
      </g>
      <ArmsLayer arms={arms} who={who} />
    </svg>
  );
};
