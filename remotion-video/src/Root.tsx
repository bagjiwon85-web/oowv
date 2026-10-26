import { Composition } from "remotion";
import { FPS, MyComposition, TOTAL_FRAMES } from "./Composition";
import { SIZE } from "./kit";

export const RemotionRoot: React.FC = () => {
  return <Composition id="MoneyFlow" component={MyComposition} width={SIZE} height={SIZE} fps={FPS} durationInFrames={TOTAL_FRAMES} />;
};
