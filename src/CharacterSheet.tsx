import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Person, Face, Arms, Who} from './Person';

const ROWS: [Who, Face, Arms][] = [
  ['man', 'neutral', 'none'],
  ['man', 'surprise', 'cheek'],
  ['man', 'think', 'chin'],
  ['man', 'smile', 'present'],
  ['man', 'determined', 'point'],
  ['woman', 'neutral', 'none'],
  ['woman', 'think', 'chin'],
  ['woman', 'worry', 'none'],
  ['woman', 'happy', 'fist'],
  ['woman', 'surprise', 'present'],
];
void [
  ['woman', 'think', 'chin'],
  ['woman', 'worry', 'none'],
  ['woman', 'happy', 'fist'],
  ['woman', 'surprise', 'present'],
];

/** Dev-only sheet showing every character pose. */
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#fff', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start'}}>
    {ROWS.map(([who, face, arms], i) => (
      <div key={i} style={{width: 640, height: 540, overflow: 'hidden', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd'}}>
        <Person who={who} face={face} arms={arms} height={470} />
      </div>
    ))}
  </AbsoluteFill>
);
