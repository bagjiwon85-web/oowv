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

const LETTERS = "OOWV".split("");

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 40%, #2a1b5e 0%, #0b0820 70%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Particles color="#b9a6ff" />
      <div style={{ display: "flex", gap: 24 }}>
        {LETTERS.map((letter, i) => (
          <Interactive.Div
            key={i}
            name={`Letter ${letter}${i}`}
            style={{
              fontFamily: displayFont,
              fontSize: 280,
              color: "white",
              textShadow: "0 0 60px rgba(185, 166, 255, 0.6)",
              opacity: interpolate(frame, [i * 4, i * 4 + 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(
                frame,
                [i * 4, i * 4 + 0.8 * fps],
                ["0px 120px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.spring({ damping: 14 }),
                },
              ),
            }}
          >
            {letter}
          </Interactive.Div>
        ))}
      </div>
      <Interactive.Div
        name="Subtitle"
        style={{
          position: "absolute",
          bottom: 260,
          fontFamily: bodyFont,
          fontWeight: 400,
          fontSize: 44,
          letterSpacing: 12,
          color: "#d8cfff",
          opacity: interpolate(frame, [1 * fps, 1.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        모션그래픽 스튜디오
      </Interactive.Div>
    </AbsoluteFill>
  );
};
