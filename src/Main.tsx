import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {C, FONT, SceneStartProvider} from './kit';
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
    </AbsoluteFill>
  );
};
