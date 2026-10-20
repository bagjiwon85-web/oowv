import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {C, CHAPTER_STARTS, FONT, Rail, SceneStartProvider} from './kit';
import {SCENES} from './scenes';

export const DURATION_SEC = 606.3;

const weights: [string, number][] = [
  ['Medium', 500],
  ['Bold', 700],
  ['ExtraBold', 800],
  ['Black', 900],
];
for (const [name, weight] of weights) {
  loadFont({family: 'Pretendard', url: staticFile(`fonts/Pretendard-${name}.woff2`), weight: String(weight)});
}

const FADE = 0.28;

/** Chapter title cards hide the rail; it fades out/in around them. */
const CHAPTER_CARD_SEC = [3.75, 2.25, 3.8, 3.45];
const RAIL_FROM = 134.35;

const railOpacity = (t: number) => {
  const fade = (a: number, b: number) =>
    interpolate(t, [a - 0.3, a, b, b + 0.3], [1, 0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let o = interpolate(t, [RAIL_FROM, RAIL_FROM + 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  CHAPTER_STARTS.slice(1).forEach((c, i) => {
    o = Math.min(o, fade(c, c + CHAPTER_CARD_SEC[i]));
  });
  return o;
};

const RailLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{opacity: railOpacity(frame / fps)}}>
      <SceneStartProvider value={0}>
        <Rail />
      </SceneStartProvider>
    </AbsoluteFill>
  );
};

/** Fades a scene out over its last FADE seconds (opacity only — no movement). */
const SceneShell: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const o = interpolate(t, [dur - FADE, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const Main: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <Audio src={staticFile('audio.mp3')} />
      {SCENES.map((sc, i) => {
        const end = i + 1 < SCENES.length ? SCENES[i + 1].start : DURATION_SEC;
        const from = Math.round(sc.start * fps);
        const dur = Math.round(end * fps) - from;
        const Body = sc.Body;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`${i + 1}. ${sc.name}`}>
            <SceneStartProvider value={from / fps}>
              <SceneShell dur={dur / fps}>
                <Body />
              </SceneShell>
            </SceneStartProvider>
          </Sequence>
        );
      })}
      <RailLayer />
    </AbsoluteFill>
  );
};
