import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Arms, Face, Person, Who} from './Person';

const ROWS: [Who, Face, Arms][] = [
  ['man', 'neutral', 'present'],
  ['man', 'surprise', 'cheek'],
  ['man', 'determined', 'point'],
  ['woman', 'think', 'chin'],
  ['woman', 'happy', 'fist'],
  ['woman', 'determined', 'point'],
];

/** Dev-only sheet showing character poses. */
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{background: '#fff', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start'}}>
    {ROWS.map(([who, face, arms], i) => (
      <div
        key={i}
        style={{width: 640, height: 540, overflow: 'hidden', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}
      >
        <Person who={who} face={face} arms={arms} height={520} />
      </div>
    ))}
  </AbsoluteFill>
);
