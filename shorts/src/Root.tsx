import {Composition} from 'remotion';
import {Shorts} from './Shorts';
export const FPS = 30;
export const DURATION = 1658; // shorts_trimmed.xml sequence duration
export const Root = () => (
  <Composition id="Shorts" component={Shorts} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
