import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { kpis } from "./data";
import { DailyScene, IntroScene, KpiScene, OutroScene, PodiumScene } from "./scenes";
import { COLORS, FONT, fontsLoaded } from "./theme";

// 폰트 로딩이 끝날 때까지 렌더링을 기다리도록 모듈 로드 시점에 시작
void fontsLoaded;

export const MonthlyMetrics: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONT }}>
      <Series>
        <Series.Sequence name="Intro" durationInFrames={90} premountFor={fps}>
          <IntroScene />
        </Series.Sequence>
        <Series.Sequence name="Views" durationInFrames={80} premountFor={fps}>
          <KpiScene label="총 조회수" value={kpis.views} caption="한 달 동안 쌓인 시청." />
        </Series.Sequence>
        <Series.Sequence name="Watch time" durationInFrames={80} premountFor={fps}>
          <KpiScene label="시청 시간" value={kpis.watchHours} suffix="시간" caption="함께 보낸 시간." />
        </Series.Sequence>
        <Series.Sequence name="Subscribers" durationInFrames={80} premountFor={fps}>
          <KpiScene label="새 구독자" value={kpis.subscribersGained} prefix="+" caption="새로 함께하게 된 사람들." />
        </Series.Sequence>
        <Series.Sequence name="Revenue" durationInFrames={80} premountFor={fps}>
          <KpiScene label="예상 수익" value={kpis.revenueUsd} prefix="$" caption="이번 달의 수익." />
        </Series.Sequence>
        <Series.Sequence name="Daily views" durationInFrames={150} premountFor={fps}>
          <DailyScene />
        </Series.Sequence>
        <Series.Sequence name="Top 3" durationInFrames={210} premountFor={fps}>
          <PodiumScene />
        </Series.Sequence>
        <Series.Sequence name="Outro" durationInFrames={90} premountFor={fps}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
