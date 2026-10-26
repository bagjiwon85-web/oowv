import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import segments from "./segments.json";
import { MAP } from "./drawing";
import { SceneCanvas } from "./SceneCanvas";

export const FPS = 30;
export const TOTAL_FRAMES = Math.round(61.44 * FPS);

// 문장 끝 시간(초) → 프레임 경계. 마지막 문장은 오디오 끝까지.
const ends = segments.map((s, i) =>
  i === segments.length - 1 ? TOTAL_FRAMES : Math.round(s.end * FPS),
);

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f1226" }}>
      <Audio src={staticFile("voice.mp3")} />
      {segments.map((_, i) => {
        const from = i === 0 ? 0 : ends[i - 1];
        const durationInFrames = ends[i] - from;
        return (
          <Sequence key={i} name={`문장 ${i + 1}`} from={from} durationInFrames={durationInFrames}>
            <SceneCanvas
              sceneIndex={MAP[i] ?? i}
              startSec={from / FPS}
              durationSec={durationInFrames / FPS}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
