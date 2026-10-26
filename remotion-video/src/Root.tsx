import { Composition } from "remotion";
import { FPS, MyComposition, TOTAL_FRAMES } from "./Composition";
import { H, W } from "./drawing";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MoneyFlow"
      component={MyComposition}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={TOTAL_FRAMES}
    />
  );
};
