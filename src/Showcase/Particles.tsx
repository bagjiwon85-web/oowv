import { noise2D } from "@remotion/noise";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const COUNT = 60;

// noise2D로 각 점이 자연스럽게 떠다니도록 한다
export const Particles: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      {new Array(COUNT).fill(true).map((_, i) => {
        const baseX = (noise2D("x", i, 0) * 0.5 + 0.5) * width;
        const baseY = (noise2D("y", i, 0) * 0.5 + 0.5) * height;
        const dx = noise2D("dx", i, frame * 0.01) * 80;
        const dy = noise2D("dy", i, frame * 0.01) * 80;
        const size = 3 + (noise2D("s", i, 0) * 0.5 + 0.5) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX + dx,
              top: baseY + dy,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: 0.25 + (noise2D("o", i, frame * 0.02) * 0.5 + 0.5) * 0.5,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
