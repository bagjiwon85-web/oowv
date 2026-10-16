import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { useEffect, useMemo, useState } from 'react';
import LINES from './lines.json';
import { FPS, finalize, initEngine, itemState, subtitleAt } from './engine';
import { buildScenes } from './scenes';

const END = 385.3;
export const BPT27_DURATION = Math.round(END * FPS);

const WEIGHTS = [[400, 'Regular'], [500, 'Medium'], [600, 'SemiBold'], [700, 'Bold'], [800, 'ExtraBold']];
const CSS = `
.el{position:absolute;}
.el em{font-style:normal;color:#EE4036}
svg text{font-family:P}
.sub em{font-style:normal;color:#FF6A5F;font-weight:800}
`;

function useFonts() {
  const [handle] = useState(() => delayRender('Pretendard'));
  useEffect(() => {
    Promise.all(WEIGHTS.map(([w, n]) => loadFont({ family: 'P', url: staticFile(`fonts/Pretendard-${n}.otf`), weight: String(w) })))
      .then(() => continueRender(handle));
  }, [handle]);
}

const Item = ({ st }) => (
  <div className="el" style={{ left: st.x, top: st.y, zIndex: st.z, opacity: st.opacity, transform: st.transform, transformOrigin: st.origin, filter: st.filter }}>
    {st.burst < 1 && (
      <div style={{ position: 'absolute', inset: -8, borderRadius: 999, border: '5px solid #EE4036', transform: `scale(${1 + 0.45 * st.burst})`, opacity: 0.5 * (1 - st.burst) }} />
    )}
    <div dangerouslySetInnerHTML={{ __html: st.html }} />
  </div>
);

// One scene: its items. The frame itself never moves.
const Scene = ({ sc, t }) => {
  const states = sc.items.map(it => [it.id, itemState(it, t)]).filter(([, s]) => s);
  return (
    <AbsoluteFill>
      {states.map(([id, st]) => <Item key={id} st={st} />)}
    </AbsoluteFill>
  );
};

const Subtitle = ({ t }) => {
  const ln = subtitleAt(t);
  if (!ln) return null;
  const a = Math.min(1, (t - ln.start) / 0.12);
  return (
    <div style={{ position: 'absolute', left: '50%', top: 992, transform: 'translate(-50%,-50%)', opacity: 0.4 + 0.6 * a, zIndex: 100 }}>
      <span className="sub" style={{ display: 'block', background: 'rgba(24,27,36,.92)', color: '#fff', fontSize: 44, fontWeight: 600, padding: '14px 34px 16px', borderRadius: 14, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}
        dangerouslySetInnerHTML={{ __html: ln.html }} />
    </div>
  );
};

export const BPT27 = () => {
  useFonts();
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scenes = useMemo(() => { initEngine(LINES); buildScenes(); return finalize(END); }, []);
  return (
    <AbsoluteFill style={{ background: '#fff', fontFamily: 'P, sans-serif', overflow: 'hidden' }}>
      <style>{CSS}</style>
      <Audio src={staticFile('BPT27_audio.m4a')} />
      {scenes.map((sc, k) => {
        const from = Math.round(sc.t * FPS);
        const dur = Math.max(1, Math.round(sc.end * FPS) - from);
        return (
          <Sequence key={k} from={from} durationInFrames={dur} name={`장면 ${k + 1}`} layout="none">
            <Scene sc={sc} t={t} />
          </Sequence>
        );
      })}
      <Subtitle t={t} />
    </AbsoluteFill>
  );
};
