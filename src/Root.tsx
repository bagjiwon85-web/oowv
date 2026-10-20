import React from 'react';
import {Composition} from 'remotion';
import {Main, DURATION_SEC} from './Main';
import {CharacterSheet} from './CharacterSheet';

export const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Main"
    component={Main}
    durationInFrames={Math.ceil(DURATION_SEC * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
  <Composition id="Characters" component={CharacterSheet} durationInFrames={1} fps={FPS} width={1920} height={1080} />
  </>
);
