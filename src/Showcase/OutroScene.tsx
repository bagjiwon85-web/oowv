import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, displayFont } from "./fonts";
import { Particles } from "./Particles";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #ff6a88 0%, #ff99ac 50%, #fcb69f 100%)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <Particles color="#ffffff" />
      <Interactive.Div
        name="Outro Title"
        style={{
          fontFamily: displayFont,
          fontSize: 136,
          color: "white",
          scale: interpolate(frame, [0, 0.8 * fps], [0.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        Made with Remotion
      </Interactive.Div>
      <Interactive.Div
        name="Outro Caption"
        style={{
          fontFamily: bodyFont,
          fontSize: 48,
          color: "rgba(255,255,255,0.9)",
          opacity: interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        ffmpeg · Python 없이 만든 영상
      </Interactive.Div>
    </AbsoluteFill>
  );
};
