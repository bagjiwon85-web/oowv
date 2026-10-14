import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG = "#000000";
const KEY = "#FF4D1F";
const TEXT = "#F5F5F7";
const MUTED = "#86868B";
const FONT =
  "Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'WenQuanYi Zen Hei', sans-serif";

const fadeUp = (frame: number, start: number, duration = 20) => ({
  opacity: interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  transform: `translateY(${interpolate(frame, [start, start + duration], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  })}px)`,
});

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineWidth = spring({ frame: frame - 25, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...fadeUp(frame, 0), fontSize: 120, fontWeight: 800, color: TEXT, letterSpacing: -4 }}>
        Motion Graphics
      </div>
      <div style={{ width: 360 * lineWidth, height: 6, background: KEY, borderRadius: 3, margin: "28px 0" }} />
      <div style={{ ...fadeUp(frame, 15), fontSize: 44, fontWeight: 500, color: MUTED }}>
        Remotion으로 만든 첫 번째 영상
      </div>
    </AbsoluteFill>
  );
};

const Counter: React.FC<{ target: number }> = ({ target }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const value = Math.round(target * progress);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...fadeUp(frame, 0), fontSize: 44, fontWeight: 600, color: MUTED }}>구독자</div>
      <div
        style={{
          ...fadeUp(frame, 5),
          fontSize: 240,
          fontWeight: 800,
          color: TEXT,
          letterSpacing: -8,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value.toLocaleString("en-US")}
      </div>
      <div style={{ ...fadeUp(frame, 60), fontSize: 48, fontWeight: 700, color: KEY }}>달성 🎉</div>
    </AbsoluteFill>
  );
};

const DATA = [
  { label: "1주차", value: 3200 },
  { label: "2주차", value: 5400 },
  { label: "3주차", value: 4800 },
  { label: "4주차", value: 8900 },
];

const BarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...DATA.map((d) => d.value));
  const MAX_HEIGHT = 520;

  return (
    <AbsoluteFill style={{ padding: "120px 200px", justifyContent: "flex-end" }}>
      <div style={{ ...fadeUp(frame, 0), position: "absolute", top: 110, left: 200, fontSize: 64, fontWeight: 800, color: TEXT }}>
        주간 조회수
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 80, height: MAX_HEIGHT + 120 }}>
        {DATA.map((d, i) => {
          const grow = spring({ frame: frame - 10 - i * 8, fps, config: { damping: 200 } });
          const isMax = d.value === max;
          return (
            <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: isMax ? KEY : TEXT,
                  opacity: grow,
                  marginBottom: 16,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(d.value * grow).toLocaleString("en-US")}
              </div>
              <div
                style={{
                  width: "100%",
                  height: (d.value / max) * MAX_HEIGHT * grow,
                  background: isMax ? KEY : "#2C2C2E",
                  borderRadius: 20,
                }}
              />
              <div style={{ fontSize: 34, color: MUTED, marginTop: 20 }}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Sample: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT }}>
      <Sequence durationInFrames={75}>
        <Title />
      </Sequence>
      <Sequence from={75} durationInFrames={105}>
        <Counter target={20000} />
      </Sequence>
      <Sequence from={180}>
        <BarChart />
      </Sequence>
    </AbsoluteFill>
  );
};
