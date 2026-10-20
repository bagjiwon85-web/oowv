import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { LightLeakOverlay } from "./LightLeakOverlay";
import { OutroScene } from "./OutroScene";
import { ShapesScene } from "./ShapesScene";
import { TitleScene } from "./TitleScene";

const TITLE = 90;
const SHAPES = 90;
const OUTRO = 75;
const SLIDE = 20;

export const SHOWCASE_DURATION = TITLE + SHAPES + OUTRO - SLIDE;

// 효과 패키지 데모: 라이트 릭 오버레이, 슬라이드 전환, 노이즈 파티클, 모션 블러, 구글 폰트
export const Showcase: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TITLE}>
        <TitleScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={30}>
        <LightLeakOverlay seed={3} hueShift={0} />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence durationInFrames={SHAPES}>
        <ShapesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: SLIDE })}
      />
      <TransitionSeries.Sequence durationInFrames={OUTRO}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
