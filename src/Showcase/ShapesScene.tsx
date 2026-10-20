import { Trail } from "@remotion/motion-blur";
import { Star, Triangle } from "@remotion/shapes";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont } from "./fonts";

const Orbit: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 90], [0, Math.PI * 2], {
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          translate: `${Math.cos(angle) * 420}px ${Math.sin(angle) * 220}px`,
          rotate: `${angle}rad`,
        }}
      >
        <Star points={5} innerRadius={50} outerRadius={110} fill="#ffcf5c" />
      </div>
    </AbsoluteFill>
  );
};

export const ShapesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0e1a2b" }}>
      {/* Trail은 이전 프레임을 겹쳐 그려 모션 블러를 만든다 */}
      <Trail layers={8} lagInFrames={0.6} trailOpacity={0.9}>
        <Orbit />
      </Trail>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Interactive.Div
          name="Triangle"
          style={{
            rotate: interpolate(frame, [0, 3 * fps], ["0deg", "180deg"], {
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [0, 0.8 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <Triangle length={260} direction="up" fill="#5ce1e6" cornerRadius={24} />
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 140 }}
      >
        <Interactive.Div
          name="Caption"
          style={{
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 64,
            color: "white",
            opacity: interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          도형 · 모션 블러 · 라이트 릭
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
