import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {captions} from './captions';

// 내레이션 mp3를 shorts/public/narration.mp3 로 넣고 true 로 바꾸면 오디오가 포함됩니다.
const HAS_NARRATION = false;

const FONT = '"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif';
const sec = (s: number) => Math.round(s * 30);

type Scene = {from: number; to: number; bg: [string, string]; accent: string; tag: string; title: string; emoji: string[]};
const scenes: Scene[] = [
  {from: 0, to: 2.467, bg: ['#0f172a', '#1e1b4b'], accent: '#facc15', tag: 'MONEY FLOW', title: '돈을 쓰는\n세 가지 이유', emoji: ['💊', '⚡', '✨']},
  {from: 2.467, to: 15.333, bg: ['#3b0a14', '#7f1d1d'], accent: '#fb7185', tag: '01', title: '고통을\n없애기 위해', emoji: ['😮‍💨', '💸', '⚖️']},
  {from: 15.333, to: 29.167, bg: ['#0c2a4d', '#0e7490'], accent: '#67e8f9', tag: '02', title: '귀찮음을\n해소해 주는 것', emoji: ['🚀', '📦', '📱']},
  {from: 29.167, to: 40.133, bg: ['#3b0764', '#be185d'], accent: '#f9a8d4', tag: '03', title: '그 순간의\n감정과 이야깃거리', emoji: ['✈️', '🎉', '📸']},
  {from: 40.133, to: 45.8, bg: ['#052e16', '#166534'], accent: '#86efac', tag: 'SUMMARY', title: '돈은 이 세 군데로만\n흐릅니다', emoji: ['💊', '⚡', '✨']},
  {from: 45.8, to: 55.267, bg: ['#111827', '#312e81'], accent: '#facc15', tag: 'QUESTION', title: '나는 셋 중\n무엇을 줄 수 있을까?', emoji: ['🤔', '👇', '🔗']},
];

const SceneView = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = sec(s.to) - sec(s.from);
  const pop = spring({frame: f, fps, config: {damping: 14}});
  const fade = interpolate(f, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp'});
  const drift = interpolate(f, [0, dur], [0, 120]);
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${s.bg[0]}, ${s.bg[1]})`, opacity: fade, fontFamily: FONT, color: 'white'}}>
      {/* 배경 원 */}
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: s.accent, opacity: 0.12, top: -200 + drift, right: -300}} />
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: s.accent, opacity: 0.09, bottom: 100 - drift, left: -250}} />
      {/* 태그 + 제목 */}
      <div style={{position: 'absolute', top: 230, left: 80, right: 80, transform: `translateY(${(1 - pop) * 60}px)`, opacity: pop}}>
        <div style={{display: 'inline-block', padding: '14px 36px', borderRadius: 999, background: s.accent, color: '#111', fontSize: 52, fontWeight: 900, letterSpacing: 4}}>{s.tag}</div>
        <div style={{marginTop: 50, fontSize: 112, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'pre-line', textShadow: '0 6px 30px rgba(0,0,0,.4)'}}>{s.title}</div>
      </div>
      {/* 이모지 */}
      <div style={{position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 50}}>
        {s.emoji.map((e, i) => {
          const p = spring({frame: f - 8 - i * 6, fps, config: {damping: 10}});
          const bob = Math.sin((f + i * 10) / 9) * 14;
          return <div key={i} style={{fontSize: 210, transform: `scale(${p}) translateY(${bob}px)`}}>{e}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Caption = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const c = captions.find((x) => t >= x.start && t < x.end);
  if (!c) return null;
  const local = (t - c.start) * 30;
  const pop = interpolate(local, [0, 4], [0.85, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 300, fontFamily: FONT}}>
      <div style={{transform: `scale(${pop})`, padding: '22px 46px', borderRadius: 28, background: 'rgba(0,0,0,.62)', color: '#fff', fontSize: 84, fontWeight: 900, textAlign: 'center', maxWidth: 960, lineHeight: 1.25, WebkitTextStroke: '2px rgba(0,0,0,.6)'}}>
        {c.text}
      </div>
    </AbsoluteFill>
  );
};

export const Shorts = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {scenes.map((s, i) => (
      <Sequence key={i} from={sec(s.from)} durationInFrames={sec(s.to) - sec(s.from) + (i === scenes.length - 1 ? 0 : 1)}>
        <SceneView s={s} />
      </Sequence>
    ))}
    <Caption />
    {HAS_NARRATION && <Audio src={staticFile('narration.mp3')} />}
  </AbsoluteFill>
);
