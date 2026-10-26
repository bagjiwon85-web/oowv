import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import segments from "./segments.json";
import { SCENES } from "./Scenes";

export const FPS = 30;
export const TOTAL_FRAMES = Math.round(61.44 * FPS);
const FADE = 8;

// 문장 끝 시간(초) → 프레임 경계. 마지막 문장은 오디오 끝까지.
const ends = segments.map((s, i) => (i === segments.length - 1 ? TOTAL_FRAMES : Math.round(s.end * FPS)));

const Fade: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame();
  const opacity = first ? 1 : interpolate(f, [0, FADE], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c1226" }}>
      <Audio src={staticFile("voice.mp3")} />
      {segments.map((_, i) => {
        const start = i === 0 ? 0 : ends[i - 1];
        const from = i === 0 ? 0 : start - FADE; // 이전 장면 위로 겹쳐 크로스페이드
        const d = ends[i] - start;
        const Scene = SCENES[i];
        return (
          <Sequence key={i} name={`문장 ${i + 1}`} from={from} durationInFrames={ends[i] - from}>
            <Fade first={i === 0}>
              <Scene d={d + (i === 0 ? 0 : FADE)} />
            </Fade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
