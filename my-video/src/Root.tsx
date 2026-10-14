import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { MonthlyMetrics } from "./metrics/MonthlyMetrics";
import { Sample } from "./Sample";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="Sample"
        component={Sample}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MonthlyMetrics"
        component={MonthlyMetrics}
        durationInFrames={860}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
