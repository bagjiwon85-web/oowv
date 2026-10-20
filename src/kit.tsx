import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ICONS} from './icons.generated';

/*
 * Motion rules (no jitter):
 * - Every animation is a clamped interpolate with an ease-out curve — no springs,
 *   no overshoot, no shake, no looping idle motion.
 * - Elements are always mounted; they only fade/slide in. Layout never reflows
 *   when something appears, so neighbours never jump.
 * - Count-up numbers sit in a box sized to the final value, with tabular digits.
 */

export const C = {
  bg: '#FFFFFF',
  ink: '#262A3A',
  red: '#F0462A',
  redSoft: 'rgba(240, 70, 42, 0.16)',
  gray: '#9BA1AF',
  line: '#E6E8EE',
  card: '#FFFFFF',
};

export const FONT = 'Pretendard, "WenQuanYi Zen Hei", sans-serif';

const SceneStart = createContext(0);
export const SceneStartProvider = SceneStart.Provider;

/** Absolute time in seconds (same clock as the SRT). */
export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return useContext(SceneStart) + frame / fps;
};

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 eased progress starting at `at` seconds. */
export const prog = (t: number, at: number, dur = 0.55) =>
  interpolate(t, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });

/** Fade + short slide-up reveal. */
export const Rv: React.FC<{
  at: number;
  y?: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, y = 22, dur = 0.55, style, children}) => {
  const t = useT();
  const p = prog(t, at, dur);
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style}}>{children}</div>
  );
};

/** Opacity of a "secondary" element: dim, optionally brightening at a given time. */
const useDim = (dim?: boolean | number) => {
  const t = useT();
  if (dim === undefined || dim === false) return 1;
  if (dim === true) return 0.32;
  return 0.32 + 0.68 * prog(t, dim, 0.5);
};

/**
 * Inline markup:
 *   [text]  → red keyword
 *   {text}  → red keyword + highlighter swipe (strong emphasis)
 *   |       → line break
 */
export const Mk: React.FC<{s: string; hl?: number}> = ({s, hl}) => {
  const lines = s.split('|');
  return (
    <>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {li > 0 && <br />}
          {line
            .split(/(\[[^\]]+\]|\{[^}]+\})/)
            .filter(Boolean)
            .map((seg, i) => {
              if (seg.startsWith('[')) {
                return (
                  <span key={i} style={{color: C.red}}>
                    {seg.slice(1, -1)}
                  </span>
                );
              }
              if (seg.startsWith('{')) {
                return <Marker key={i} text={seg.slice(1, -1)} at={hl} />;
              }
              return <span key={i}>{seg}</span>;
            })}
        </React.Fragment>
      ))}
    </>
  );
};

const HlAt = createContext<number>(0);

const Marker: React.FC<{text: string; at?: number}> = ({text, at}) => {
  const t = useT();
  const base = useContext(HlAt);
  const p = prog(t, at ?? base + 0.45, 0.6);
  return (
    <span style={{position: 'relative', color: C.red, whiteSpace: 'nowrap'}}>
      <span
        style={{
          position: 'absolute',
          left: '-0.08em',
          right: '-0.08em',
          bottom: '0.04em',
          height: '0.42em',
          background: C.redSoft,
          borderRadius: '0.08em',
          transformOrigin: 'left center',
          transform: `scaleX(${p})`,
        }}
      />
      <span style={{position: 'relative'}}>{text}</span>
    </span>
  );
};

/** Text with markup that reveals at `at`. */
export const Tx: React.FC<{
  s: string;
  at: number;
  size?: number;
  weight?: number;
  color?: string;
  hl?: number;
  dim?: boolean | number;
  style?: React.CSSProperties;
}> = ({s, at, size = 64, weight = 800, color = C.ink, hl, dim, style}) => {
  const o = useDim(dim);
  return (
    <HlAt.Provider value={at}>
      <Rv at={at}>
        <div
          style={{
            fontSize: size,
            fontWeight: weight,
            color,
            lineHeight: 1.35,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            opacity: o,
            ...style,
          }}
        >
          <Mk s={s} hl={hl} />
        </div>
      </Rv>
    </HlAt.Provider>
  );
};

export const Icon: React.FC<{name: string; size?: number}> = ({name, size = 170}) => {
  const body = ICONS[name];
  if (!body) throw new Error(`Unknown icon: ${name}`);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" dangerouslySetInnerHTML={{__html: body}} />
  );
};

/** Icon with soft floor shadow + label underneath. */
export const Item: React.FC<{
  icon: string;
  label?: string;
  sub?: string;
  at: number;
  size?: number;
  labelSize?: number;
  dim?: boolean | number;
  /** time at which a red X is drawn over the icon */
  x?: number;
  /** time at which a red check badge pops on */
  check?: number;
  width?: number;
}> = ({icon, label, sub, at, size = 170, labelSize = 40, dim, x, check, width}) => {
  const t = useT();
  const p = prog(t, at, 0.6);
  const o = useDim(dim);
  const xp = x === undefined ? 0 : prog(t, x, 0.45);
  const cp = check === undefined ? 0 : prog(t, check, 0.4);
  return (
    <HlAt.Provider value={at}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width,
          opacity: p * o,
          transform: `translateY(${(1 - p) * 26}px)`,
        }}
      >
        <div style={{position: 'relative', width: size, height: size}}>
          <div style={{opacity: x === undefined ? 1 : 1 - 0.55 * xp}}>
            <Icon name={icon} size={size} />
          </div>
          {x !== undefined && <Cross p={xp} size={size} />}
          {check !== undefined && (
            <div
              style={{
                position: 'absolute',
                right: -size * 0.06,
                top: -size * 0.06,
                opacity: cp,
                transform: `scale(${0.6 + 0.4 * cp})`,
              }}
            >
              <CheckBadge size={size * 0.3} />
            </div>
          )}
        </div>
        <div
          style={{
            width: size * 0.62,
            height: size * 0.07,
            marginTop: size * 0.04,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(38,42,58,0.13), rgba(38,42,58,0))',
          }}
        />
        {label && (
          <div
            style={{
              marginTop: 18,
              fontSize: labelSize,
              fontWeight: 700,
              color: C.ink,
              textAlign: 'center',
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            <Mk s={label} />
          </div>
        )}
        {sub && (
          <div
            style={{
              marginTop: 8,
              fontSize: labelSize * 0.72,
              fontWeight: 600,
              color: C.gray,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <Mk s={sub} />
          </div>
        )}
      </div>
    </HlAt.Provider>
  );
};

const Cross: React.FC<{p: number; size: number}> = ({p, size}) => {
  const len = Math.SQRT2 * size * 0.8;
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  return (
    <svg width={size} height={size} style={{position: 'absolute', left: 0, top: 0}}>
      <line
        x1={size * 0.1}
        y1={size * 0.1}
        x2={size * 0.9}
        y2={size * 0.9}
        stroke={C.red}
        strokeWidth={size * 0.045}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - a)}
      />
      <line
        x1={size * 0.9}
        y1={size * 0.1}
        x2={size * 0.1}
        y2={size * 0.9}
        stroke={C.red}
        strokeWidth={size * 0.045}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - b)}
      />
    </svg>
  );
};

export const CheckBadge: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={C.red} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Arrow that draws from left to right. */
export const Arrow: React.FC<{
  at: number;
  w?: number;
  red?: boolean;
  dashed?: boolean;
  dir?: 'right' | 'down';
  /** size of the neighbouring icons, so the arrow lines up with their centres */
  iconSize?: number;
}> = ({at, w = 150, red, dashed = !red, dir = 'right', iconSize = 170}) => {
  const t = useT();
  const p = prog(t, at, 0.6);
  const col = red ? C.red : C.gray;
  const h = 24;
  const svg = (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <defs>
        <clipPath id={`clip-${at}-${w}`}>
          <rect x={0} y={-10} width={w * p + 1} height={h + 20} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${at}-${w})`}>
        <line
          x1={2}
          y1={h / 2}
          x2={w - 4}
          y2={h / 2}
          stroke={col}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeDasharray={dashed ? '8 9' : undefined}
        />
        <path
          d={`M${w - 15} ${h / 2 - 9} L${w - 3} ${h / 2} L${w - 15} ${h / 2 + 9}`}
          fill="none"
          stroke={col}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
  return (
    <div
      style={{
        opacity: Math.min(1, p * 3),
        marginTop: dir === 'down' ? 0 : iconSize / 2 - h / 2,
        transform: dir === 'down' ? 'rotate(90deg)' : undefined,
      }}
    >
      {svg}
    </div>
  );
};

/** Rounded pill; can be struck through or rendered in red. */
export const Pill: React.FC<{
  s: string;
  at: number;
  strike?: number;
  red?: boolean;
  solid?: boolean;
  size?: number;
  dim?: boolean | number;
}> = ({s, at, strike, red, solid, size = 44, dim}) => {
  const t = useT();
  const sp = strike === undefined ? 0 : prog(t, strike, 0.5);
  const o = useDim(dim);
  const col = red ? C.red : C.ink;
  return (
    <HlAt.Provider value={at}>
      <Rv at={at}>
        <div style={{position: 'relative', display: 'inline-block', opacity: o}}>
          <div
            style={{
              fontSize: size,
              fontWeight: 800,
              color: solid ? '#fff' : col,
              background: solid ? C.red : C.card,
              border: `${Math.max(3, size * 0.07)}px solid ${col}`,
              borderRadius: 999,
              padding: `${size * 0.32}px ${size * 0.75}px`,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 22px rgba(38,42,58,0.10)',
              opacity: 1 - 0.55 * sp,
            }}
          >
            <Mk s={s} />
          </div>
          {strike !== undefined && (
            <div
              style={{
                position: 'absolute',
                left: '-4%',
                width: '108%',
                top: '50%',
                height: Math.max(4, size * 0.09),
                marginTop: -Math.max(2, size * 0.045),
                background: C.red,
                borderRadius: 4,
                transformOrigin: 'left center',
                transform: `scaleX(${sp})`,
              }}
            />
          )}
        </div>
      </Rv>
    </HlAt.Provider>
  );
};

/** Text that gets a red strike-through line drawn over it. */
export const Strike: React.FC<{s: string; at: number; strike: number; size?: number}> = ({
  s,
  at,
  strike,
  size = 52,
}) => {
  const t = useT();
  const sp = prog(t, strike, 0.5);
  return (
    <Rv at={at}>
      <div style={{position: 'relative', display: 'inline-block'}}>
        <div
          style={{
            fontSize: size,
            fontWeight: 800,
            color: C.ink,
            opacity: 1 - 0.6 * sp,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          <Mk s={s} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '-3%',
            width: '106%',
            top: '54%',
            height: size * 0.08,
            background: C.red,
            borderRadius: 4,
            transformOrigin: 'left center',
            transform: `scaleX(${sp})`,
          }}
        />
      </div>
    </Rv>
  );
};

/** Speech bubble with a tail pointing down. */
export const Bubble: React.FC<{
  s: string;
  at: number;
  size?: number;
  red?: boolean;
  tail?: 'down' | 'none';
  maxWidth?: number;
}> = ({s, at, size = 42, red, tail = 'down', maxWidth = 1300}) => {
  const col = red ? C.red : C.ink;
  return (
    <HlAt.Provider value={at}>
      <Rv at={at}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div
            style={{
              fontSize: size,
              fontWeight: 700,
              color: C.ink,
              background: '#fff',
              border: `4px solid ${col}`,
              borderRadius: size * 1.2,
              padding: `${size * 0.45}px ${size * 0.85}px`,
              letterSpacing: '-0.02em',
              lineHeight: 1.4,
              textAlign: 'center',
              maxWidth,
              boxShadow: '0 10px 26px rgba(38,42,58,0.10)',
            }}
          >
            <Mk s={s} />
          </div>
          {tail === 'down' && (
            <svg
              width={36}
              height={22}
              style={{position: 'absolute', left: '50%', marginLeft: -18, bottom: -18}}
            >
              <path d="M2 0 L18 19 L34 0" fill="#fff" stroke={col} strokeWidth={4} strokeLinejoin="round" />
              <rect x={4} y={-4} width={28} height={6} fill="#fff" />
            </svg>
          )}
        </div>
      </Rv>
    </HlAt.Provider>
  );
};

/** Count-up number in a fixed-width box (no horizontal wobble). */
export const Num: React.FC<{
  to: number;
  from?: number;
  at: number;
  dur?: number;
  size?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  dim?: boolean | number;
  fmt?: (n: number) => string;
}> = ({to, from = 0, at, dur = 1.3, size = 200, prefix = '', suffix = '', color = C.red, dim, fmt}) => {
  const t = useT();
  const p = prog(t, at, 0.5);
  const cp = interpolate(t, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const o = useDim(dim);
  const f = fmt ?? ((n: number) => Math.round(n).toLocaleString('en-US'));
  const finalStr = f(to);
  const cur = f(from + (to - from) * cp);
  const textStyle: React.CSSProperties = {
    fontSize: size,
    fontWeight: 900,
    color,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.03em',
    lineHeight: 1.05,
    whiteSpace: 'nowrap',
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        opacity: p * o,
        transform: `translateY(${(1 - p) * 26}px)`,
        ...textStyle,
      }}
    >
      {prefix && <span>{prefix}</span>}
      <span style={{position: 'relative'}}>
        <span style={{visibility: 'hidden'}}>{finalStr}</span>
        <span style={{position: 'absolute', right: 0, top: 0}}>{cur}</span>
      </span>
      {suffix && <span>{suffix}</span>}
    </div>
  );
};

/** Chapter card: big red number + title (+ optional icon above). */
export const Chapter: React.FC<{n: string; s: string; pre?: string; icon?: string; at: number}> = ({
  n,
  s,
  pre,
  icon,
  at,
}) => (
  <Col gap={34}>
    {icon && <Item icon={icon} at={at} size={170} />}
    {pre && <Tx s={pre} at={at + 0.15} size={44} weight={700} color={C.gray} />}
    <Rv at={at + 0.2}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 28}}>
        <span style={{fontSize: 120, fontWeight: 900, color: C.red, letterSpacing: '-0.03em'}}>{n}</span>
        <HlAt.Provider value={at + 0.2}>
          <span style={{fontSize: 66, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em'}}>
            <Mk s={s} />
          </span>
        </HlAt.Provider>
      </div>
    </Rv>
  </Col>
);

export const Row: React.FC<{gap?: number; align?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  gap = 60,
  align = 'flex-start',
  children,
  style,
}) => <div style={{display: 'flex', alignItems: align, justifyContent: 'center', gap, ...style}}>{children}</div>;

export const Col: React.FC<{gap?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  gap = 60,
  children,
  style,
}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap, ...style}}>{children}</div>
);

/** Standard scene frame: optional title on top, content centred. */
export const Frame: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 100}) => (
  <AbsoluteFill
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap,
      fontFamily: FONT,
      padding: 80,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Grid of small person icons revealing in a quick stagger. */
export const Crowd: React.FC<{
  n: number;
  at: number;
  cols?: number;
  size?: number;
  icons?: string[];
  stagger?: number;
  dim?: boolean | number;
}> = ({n, at, cols = 8, size = 64, icons = ['man-office-worker', 'woman-office-worker', 'man', 'woman'], stagger = 0.03, dim}) => {
  const t = useT();
  const o = useDim(dim);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(cols, n)}, ${size}px)`,
        gap: size * 0.22,
        opacity: o,
      }}
    >
      {Array.from({length: n}).map((_, i) => {
        const p = prog(t, at + i * stagger, 0.45);
        return (
          <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
            <Icon name={icons[i % icons.length]} size={size} />
          </div>
        );
      })}
    </div>
  );
};

/** Plain white card. */
export const Card: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dim?: boolean | number}> = ({
  at,
  children,
  style,
  dim,
}) => {
  const o = useDim(dim);
  return (
    <Rv at={at}>
      <div
        style={{
          background: C.card,
          borderRadius: 28,
          border: `2px solid ${C.line}`,
          boxShadow: '0 14px 40px rgba(38,42,58,0.08)',
          padding: '40px 56px',
          opacity: o,
          ...style,
        }}
      >
        {children}
      </div>
    </Rv>
  );
};
