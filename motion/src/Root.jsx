import { Composition } from 'remotion';
import { BPT27, BPT27_DURATION } from './BPT27/Video';

export const RemotionRoot = () => (
  <Composition id="BPT27" component={BPT27} durationInFrames={BPT27_DURATION} fps={30} width={1920} height={1080} />
);
