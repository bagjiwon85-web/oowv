import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CountUp } from "./CountUp";
import { channel, dailyViews, TopVideo, topVideos } from "./data";
import { COLORS, fadeOut, formatNumber, progress, reveal } from "./theme";

const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", ...style }}>
    {children}
  </AbsoluteFill>
);

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <Center style={{ opacity: fadeOut(frame, durationInFrames) }}>
      <div style={{ ...reveal(frame, 0), fontSize: 36, fontWeight: 600, color: COLORS.muted, marginBottom: 28 }}>
        {channel.name}
      </div>
      <div style={{ ...reveal(frame, 8), fontSize: 150, fontWeight: 800, color: COLORS.text, letterSpacing: -6, lineHeight: 1.05 }}>
        {channel.period},
      </div>
      <div style={{ ...reveal(frame, 26), fontSize: 150, fontWeight: 800, color: COLORS.key, letterSpacing: -6, lineHeight: 1.05 }}>
        숫자로 돌아보기.
      </div>
    </Center>
  );
};

// 지표 하나를 화면 가득 보여주는 장면
export const KpiScene: React.FC<{
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  caption: string;
}> = ({ label, value, prefix, suffix, caption }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // 숫자가 올라가는 동안 아주 천천히 다가오는 카메라
  const scale = 0.94 + 0.06 * progress(frame, 0, durationInFrames);

  return (
    <Center style={{ opacity: fadeOut(frame, durationInFrames) }}>
      <div style={{ transform: `scale(${scale})` }}>
        <div style={{ ...reveal(frame, 0), fontSize: 44, fontWeight: 600, color: COLORS.muted, marginBottom: 12 }}>
          {label}
        </div>
        <div style={{ ...reveal(frame, 4, 20, 20), fontSize: 260, fontWeight: 800, color: COLORS.text, letterSpacing: -10, lineHeight: 1 }}>
          <CountUp value={value} start={4} duration={50} prefix={prefix} suffix={suffix} />
        </div>
        <div style={{ ...reveal(frame, 46), fontSize: 40, fontWeight: 600, color: COLORS.key, marginTop: 36 }}>
          {caption}
        </div>
      </div>
    </Center>
  );
};

export const DailyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const max = Math.max(...dailyViews);
  const peakIndex = dailyViews.indexOf(max);
  const CHART_HEIGHT = 520;

  return (
    <AbsoluteFill style={{ padding: "110px 160px 120px", opacity: fadeOut(frame, durationInFrames) }}>
      <div style={{ ...reveal(frame, 0), fontSize: 40, fontWeight: 600, color: COLORS.muted }}>일별 조회수</div>
      <div style={{ ...reveal(frame, 6), fontSize: 84, fontWeight: 800, color: COLORS.text, letterSpacing: -3, marginTop: 8 }}>
        최고 기록은 <span style={{ color: COLORS.key }}>{peakIndex + 1}일</span>.
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 14 }}>
        {dailyViews.map((v, i) => {
          const grow = progress(frame, 14 + i * 1.6, 30);
          const isPeak = i === peakIndex;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              {isPeak ? (
                <div style={{ fontSize: 34, fontWeight: 700, color: COLORS.key, opacity: progress(frame, 70, 20), whiteSpace: "nowrap" }}>
                  {formatNumber(v)}
                </div>
              ) : null}
              <div
                style={{
                  width: "100%",
                  height: (v / max) * CHART_HEIGHT * grow,
                  background: isPeak ? COLORS.key : COLORS.surfaceHigh,
                  borderRadius: 8,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 28, color: COLORS.muted, opacity: progress(frame, 20, 20) }}>
        <span>1일</span>
        <span>15일</span>
        <span>{dailyViews.length}일</span>
      </div>
    </AbsoluteFill>
  );
};

const PODIUM = {
  // 화면 배치 순서: 2위, 1위, 3위
  order: [1, 0, 2],
  heights: [340, 240, 170],
  // 3위부터 차례로 올라옴
  delays: [44, 24, 4],
};

const PodiumColumn: React.FC<{ video: TopVideo; rank: number }> = ({ video, rank }) => {
  const frame = useCurrentFrame();
  const delay = PODIUM.delays[rank];
  const rise = progress(frame, delay, 34);
  const card = progress(frame, delay + 18, 26);
  const isFirst = rank === 0;
  const width = isFirst ? 520 : 440;

  return (
    <div style={{ width, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ opacity: card, transform: `translateY(${(1 - card) * 40}px)`, width: "100%", marginBottom: 28 }}>
        <Img
          src={staticFile(video.thumbnail)}
          style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 24, display: "block" }}
        />
        <div style={{ fontSize: isFirst ? 34 : 30, fontWeight: 700, color: COLORS.text, marginTop: 20, textAlign: "center", lineHeight: 1.3 }}>
          {video.title}
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, color: COLORS.muted, marginTop: 6, textAlign: "center" }}>
          조회수 <CountUp value={video.views} start={delay + 22} duration={40} />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: PODIUM.heights[rank] * rise,
          background: isFirst ? COLORS.key : COLORS.surfaceHigh,
          borderRadius: "24px 24px 0 0",
          display: "flex",
          justifyContent: "center",
          paddingTop: 24,
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: 96, fontWeight: 800, color: isFirst ? COLORS.bg : COLORS.text, letterSpacing: -3, opacity: rise }}>
          {rank + 1}
        </span>
      </div>
    </div>
  );
};

export const PodiumScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ opacity: fadeOut(frame, durationInFrames) }}>
      <div style={{ ...reveal(frame, 0), position: "absolute", top: 90, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.muted }}>이번 달 가장 많이 본 영상</div>
        <div style={{ fontSize: 96, fontWeight: 800, color: COLORS.text, letterSpacing: -4, marginTop: 4 }}>TOP 3</div>
      </div>
      <div style={{ position: "absolute", bottom: 0, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 40 }}>
        {PODIUM.order.map((rank) => (
          <PodiumColumn key={rank} video={topVideos[rank]} rank={rank} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <Center style={{ opacity: fadeOut(frame, durationInFrames, 20) }}>
      <div style={{ ...reveal(frame, 0), fontSize: 120, fontWeight: 800, color: COLORS.text, letterSpacing: -5 }}>
        함께해 주셔서 감사합니다.
      </div>
      <div style={{ ...reveal(frame, 14), fontSize: 40, fontWeight: 600, color: COLORS.key, marginTop: 28 }}>
        {channel.name}
      </div>
    </Center>
  );
};
