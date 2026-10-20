import { Composition } from "remotion";
import { Showcase, SHOWCASE_DURATION } from "./Showcase/Showcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        durationInFrames={SHOWCASE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
