import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { H, W, drawSegment } from "./drawing";

type Props = { sceneIndex: number; startSec: number; durationSec: number };

export const SceneCanvas: React.FC<Props> = ({ sceneIndex, startSec, durationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const lt = frame / fps;

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    drawSegment(ctx, sceneIndex, startSec + lt, lt, durationSec);
  }, [sceneIndex, startSec, lt, durationSec]);

  return (
    <AbsoluteFill>
      <canvas ref={ref} width={W} height={H} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
