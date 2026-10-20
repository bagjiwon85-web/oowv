import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  Arrow,
  Bubble,
  C,
  Cap,
  Card,
  Chapter,
  Char,
  Col,
  FONT,
  Icon,
  Item,
  Num,
  Pill,
  Row,
  Rv,
  Stage,
  Strike,
  Tx,
  prog,
  useT,
} from './kit';

/*
 * All times are absolute seconds on the narration clock (same as the SRT).
 * Markup: [bold]  {bold + underline}  | line break
 * Layout: caption on top (Cap), content in a Stage, characters anchored to the bottom (Char).
 */

export type Scene = {start: number; name: string; Body: React.FC};
const scenes: Scene[] = [];
const S = (start: number, name: string, Body: React.FC) => scenes.push({start, name, Body});

/*
 * Layout grid (x is relative to the frame centre):
 * - solo:  character at x=0, side blocks at x=±SIDE_X, y=SIDE_Y (head level)
 * - left:  character at x=CHAR_LEFT, content Stage from x=STAGE_LEFT to the right edge
 * - duo:   characters at x=±DUO_X, their lines at y=DUO_Y above the heads
 */
const SIDE_X = 520;
const SIDE_Y = 600;
const CHAR_LEFT = -480;
const STAGE_LEFT = 760;
// right-hand content is centred on the character's head height
const STAGE_TOP = 260;
const STAGE_BOTTOM = 140;
const DUO_X = 440;
const DUO_Y = 330;
/** centre of the right-hand content area in left-mode scenes */
const STAGE_CX = (STAGE_LEFT + 1920) / 2 - 960;

const Sc: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: C.ink}}>{children}</AbsoluteFill>
);

/** Small icon floating next to a character's head. */
const Float: React.FC<{icon: string; at: number; x: number; y: number; size?: number}> = ({icon, at, x, y, size = 150}) => (
  <div style={{position: 'absolute', left: 960 + x - size / 2, top: y - size / 2}}>
    <Rv at={at}>
      <Icon name={icon} size={size} />
    </Rv>
  </div>
);

/** Thought bubble with an icon inside, next to a character's head. */
const ThinkIcon: React.FC<{icon: string; at: number; x: number; y: number}> = ({icon, at, x, y}) => (
  <div style={{position: 'absolute', left: 960 + x - 75, top: y - 75}}>
    <Rv at={at}>
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          border: `4px solid ${C.ink}`,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={86} stroke={1.8} />
      </div>
    </Rv>
  </div>
);

/** Absolutely placed block centred on (x, y) in frame coordinates (x relative to centre). */
const At: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 960 + x,
      top: y,
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

// ───────────────────────── Intro ─────────────────────────

S(0, '같은 조건 다른 결과', () => (
  <Sc>
    <Cap s="비슷한 조건으로 [유튜브를 시작]했지만" at={0.1} />
    <Char who="man" at={0.3} x={-DUO_X} h={600} poses={[[2.4, 'happy', 'fist']]} />
    <Char who="woman" at={0.5} x={DUO_X} h={600} poses={[[7.7, 'worry']]} />
    <At x={-DUO_X} y={DUO_Y}>
      <Bubble s="월급 걱정 {없는 삶}" at={2.5} size={40} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Bubble s="허탈하게 [채널을 접는다]" at={7.8} size={40} />
    </At>
    <At x={0} y={640}>
      <Tx s="vs" at={5.6} size={56} weight={300} color={C.gray} />
    </At>
  </Sc>
));

S(10.85, '왜 갈릴까', () => (
  <Sc>
    <Cap s="같은 조건에서 출발한 두 사람" at={10.95} />
    <Char who="woman" at={11.0} x={0} face="think" arms="chin" />
    <ThinkIcon icon="question-mark" at={11.6} x={300} y={420} />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Tx s="결과가 [왜]|이렇게 갈릴까요?" at={11.8} size={58} />
    </At>
  </Sc>
));

S(14.3, '수익의 한 가지 원리', () => (
  <Sc>
    <Cap s="유튜브 수익의 {한 가지 원리}" at={14.4} hl={15.2} />
    <Char who="man" at={14.6} x={0} face="smile" arms="present" />
    <Float icon="key" at={15.0} x={330} y={500} size={130} />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Col gap={26}>
        <Pill s="아느냐" at={17.6} solid size={50} />
        <Pill s="모르냐" at={18.4} size={50} />
      </Col>
    </At>
  </Sc>
));

S(19.2, '허영 지표', () => (
  <Sc>
    <Cap s="혹시 들어 보셨나요?" at={19.3} />
    <Stage top={180} bottom={480}>
      <Tx s="{허영 지표}" at={19.6} size={130} weight={400} hl={20.3} />
    </Stage>
    <Char who="man" at={19.8} x={-400} h={520} face="surprise" arms="cheek" />
    <At x={400} y={800}>
      <Row gap={26} align="center">
        <Icon name="book" size={110} />
        <Tx s="에릭 리스|『[린 스타트업]』" at={22.2} size={44} style={{textAlign: 'left'}} />
      </Row>
    </At>
  </Sc>
));

S(24.9, '숫자의 착각', () => (
  <Sc>
    <Cap s="숫자가 커지면 [잘되고 있다고] 착각한다" at={25.0} />
    <Char who="man" at={25.1} x={-DUO_X} face="smile" poses={[[28.3, 'happy']]} />
    <Float icon="trending-up" at={25.4} x={-80} y={450} size={170} />
    <At x={STAGE_CX} y={SIDE_Y}>
      <Bubble s="“일이 잘되고 있어!”" at={28.4} size={46} />
      <div style={{height: 30}} />
      <Tx s="…사실은 {착각}" at={29.4} size={50} hl={29.8} />
    </At>
  </Sc>
));

S(30.6, '허영 지표 정의', () => (
  <Sc>
    <Cap s="겉으로는 화려하지만, [실제 돈과는 상관없는] 숫자" at={30.7} />
    <Stage top={220} bottom={300}>
      <Row gap={70} align="center">
        <Item icon="sparkles" at={30.8} label="화려한 숫자" />
        <Tx s="≠" at={32.2} size={110} weight={300} style={{marginTop: -40}} />
        <Item icon="cash-banknote" at={32.4} label="실제 돈" dim={true} />
      </Row>
    </Stage>
    <At x={0} y={880}>
      <Pill s="그게 바로 ‘허영 지표’" at={34.6} solid size={50} />
    </At>
  </Sc>
));

// ───────────────────────── Cafe story ─────────────────────────

S(36.4, '두 카페 사장님', () => (
  <Sc>
    <Cap s="예를 들어, 두 [카페 사장님]" at={36.5} />
    <Char who="man" at={36.7} x={-DUO_X} h={600} face="smile" />
    <Char who="woman" at={37.0} x={DUO_X} h={600} face="smile" />
    <Float icon="coffee" at={36.9} x={-150} y={430} size={120} />
    <Float icon="coffee" at={37.2} x={150} y={430} size={120} />
    <At x={-DUO_X} y={DUO_Y}>
      <Tx s="[A] 사장님" at={37.0} size={46} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Tx s="[B] 사장님" at={37.3} size={46} />
    </At>
  </Sc>
));

S(39.6, 'A 사장님 인스타그램', () => (
  <Sc>
    <Cap s="A 사장님은 [예쁜 사진]을 찍어 올립니다" at={39.7} />
    <Char who="man" at={39.8} x={CHAR_LEFT} face="smile" arms="point" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={50}>
        <Item icon="camera" at={40.2} label="예쁜 사진" size={140} />
        <Item icon="cake" at={43.4} label="유행 디저트" size={140} />
        <Item icon="plant" at={44.6} label="감성 인테리어" size={140} />
      </Row>
    </Stage>
  </Sc>
));

S(46.9, '팔로워 1만', () => (
  <Sc>
    <Cap s="팔로워는 어느새 [1만 명], 좋아요는 [수백 개]" at={47.0} />
    <Char who="man" at={47.1} x={CHAR_LEFT} face="smile" poses={[[51.6, 'happy', 'fist']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={30}>
      <Row gap={80} align="flex-end">
        <Col gap={10}>
          <Tx s="팔로워" at={47.1} size={40} color={C.gray} />
          <Num to={10000} at={47.2} dur={1.4} size={120} suffix="명" />
        </Col>
        <Col gap={10}>
          <Tx s="좋아요" at={48.6} size={40} color={C.gray} />
          <Num to={300} at={48.7} dur={1.2} size={120} suffix="+" />
        </Col>
      </Row>
    </Stage>
    <At x={STAGE_CX} y={850}>
      <Bubble s="“곧 [대박] 나겠다!”" at={51.7} size={46} />
    </At>
  </Sc>
));

S(55.85, '저녁 매출 정산', () => {
  const t = useT();
  return (
    <Sc>
      <Cap s="그런데 그날 저녁 [매출을 정산]해 보면" at={55.95} />
      <Char who="man" at={56.0} x={CHAR_LEFT} face="neutral" poses={[[58.7, 'worry']]} />
      <Float icon="receipt" at={56.3} x={-110} y={430} size={130} />
      <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={40}>
        <Row gap={14}>
          {Array.from({length: 10}).map((_, i) => {
            const p = prog(t, 58.8 + i * 0.06, 0.4);
            return (
              <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
                <Icon name="user" size={64} stroke={1.8} />
              </div>
            );
          })}
        </Row>
        <Tx s="손님은 어제와 똑같이|{열 명 남짓}" at={59.2} size={54} hl={60.0} />
      </Stage>
    </Sc>
  );
});

S(61.55, 'B 사장님', () => (
  <Sc>
    <Cap s="반면 길 건너 [B 사장님]은" at={61.65} />
    <Char who="woman" at={61.8} x={CHAR_LEFT} face="neutral" poses={[[64.3, 'think', 'chin'], [65.8, 'smile', 'point']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={46}>
        <Item icon="building-store" at={62.0} label="B 카페" size={140} />
        <Arrow at={64.3} w={110} iconSize={140} />
        <Item icon="users-group" at={64.5} label="가게 앞 [직장인들]" size={140} />
        <Arrow at={65.6} w={110} iconSize={140} />
        <Item icon="writing" at={65.8} label="이런 글을 올립니다" size={140} />
      </Row>
    </Stage>
  </Sc>
));

S(67.05, 'B 사장님의 글', () => (
  <Sc>
    <Cap s="B 사장님이 올린 글" at={67.15} />
    <Char who="woman" at={67.2} x={CHAR_LEFT} h={560} face="smile" arms="present" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={36}>
      <Card at={67.2} style={{width: 820, padding: '34px 48px'}}>
        <Row gap={24} align="center" style={{justifyContent: 'flex-start'}}>
          <Icon name="sunrise" size={64} stroke={1.8} />
          <Tx s="“오늘 아침 8시까지 오시면 아메리카노 {천 원 할인}”" at={67.4} size={40} hl={68.6} style={{textAlign: 'left'}} />
        </Row>
      </Card>
      <Card at={70.55} style={{width: 820, padding: '34px 48px'}}>
        <Row gap={24} align="center" style={{justifyContent: 'flex-start'}}>
          <Icon name="clock" size={64} stroke={1.8} />
          <Tx s="“점심시간 10분 안에 받아 가는 {세트 메뉴}”" at={70.8} size={40} hl={71.9} style={{textAlign: 'left'}} />
        </Row>
      </Card>
    </Stage>
  </Sc>
));

S(73.75, '팔로워 300', () => (
  <Sc>
    <Cap s="팔로워는 [고작 300명]인데" at={73.85} />
    <Char who="woman" at={73.9} x={CHAR_LEFT} face="smile" poses={[[76.1, 'happy']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={50}>
      <Num to={300} at={74.0} dur={1.0} size={130} suffix="명" color={C.gray} />
      <Row gap={50}>
        <Item icon="sunrise" at={76.1} label="매일 아침" size={130} />
        <Arrow at={76.6} red w={130} iconSize={130} />
        <Item icon="door" at={77.0} label="{같은 얼굴들}" size={130} check={78.0} />
      </Row>
    </Stage>
  </Sc>
));

S(78.75, '두 카페의 차이', () => (
  <Sc>
    <Cap s="두 카페는 [무엇이] 달랐을까요?" at={78.85} />
    <Char who="man" at={78.9} x={-DUO_X} h={560} face="think" arms="chin" poses={[[82.4, 'worry', 'none']]} />
    <Char who="woman" at={79.1} x={DUO_X} h={560} face="think" arms="chin" poses={[[84.2, 'happy', 'fist']]} />
    <At x={-DUO_X} y={DUO_Y}>
      <Row gap={20} align="center">
        <Icon name="heart" size={80} stroke={1.8} color={C.gray} />
        <Tx s="좋아요를 모았고" at={82.5} size={46} color={C.gray} />
      </Row>
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Row gap={20} align="center">
        <Icon name="users" size={80} stroke={1.8} />
        <Tx s="{손님}을 모았다" at={84.3} size={50} hl={85.0} />
      </Row>
    </At>
  </Sc>
));

// ───────────────────────── YouTube vanity metrics ─────────────────────────

S(86.65, '유튜브도 마찬가지', () => (
  <Sc>
    <Cap s="유튜브도 [마찬가지]입니다" at={86.75} />
    <Char who="man" at={86.8} x={CHAR_LEFT} face="neutral" arms="point" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={50}>
        <Item icon="eye" at={88.3} label="조회수" size={140} />
        <Item icon="users" at={89.3} label="구독자" size={140} />
        <Arrow at={90.9} red w={120} iconSize={140} />
        <Item icon="sparkles" at={91.2} label="가장 쉬운 {허영 지표}" size={140} />
      </Row>
    </Stage>
  </Sc>
));

S(93.7, '조회수는 오르는데', () => (
  <Sc>
    <Cap s="조회수는 매일 오르는데 [통장 잔고는 그대로]" at={93.8} />
    <Char who="man" at={93.9} x={CHAR_LEFT} face="smile" poses={[[96.0, 'worry']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={60}>
        <Item icon="trending-up" at={94.0} label="조회수" size={150} />
        <Arrow at={95.6} w={140} iconSize={150} />
        <Item icon="building-bank" at={96.0} label="통장 잔고 {그대로}" size={150} />
      </Row>
    </Stage>
  </Sc>
));

S(98.5, '돈 버는 유튜버의 순서', () => (
  <Sc>
    <Cap s="그래서 [돈 버는 유튜버]는" at={98.6} />
    <Char who="woman" at={98.7} x={CHAR_LEFT} face="determined" arms="point" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={60}>
      <Strike s="조회수부터 쫓기" at={99.0} strike={100.7} size={46} />
      <Row gap={50}>
        <Item icon="coins" at={102.1} label="① 벌고 싶은 돈 [먼저]" size={140} />
        <Arrow at={104.1} red w={120} iconSize={140} />
        <Item icon="calculator" at={104.3} label="② 필요한 조회수를" sub="{거꾸로} 계산" size={140} />
      </Row>
    </Stage>
  </Sc>
));

S(108.6, '여러분이라면', () => (
  <Sc>
    <Cap s="지금 유튜브를 [하고 있거나] 시작을 [고민 중]이라면" at={108.7} />
    <Char who="man" at={108.8} x={CHAR_LEFT} h={560} face="neutral" />
    <Char who="woman" at={111.6} x={DUO_X} h={560} face="think" arms="chin" />
    <At x={0} y={330}>
      <Tx s="돈 버는 채널의 방법을|{쉽게} 알려드립니다" at={113.4} size={56} hl={115.6} />
    </At>
  </Sc>
));

S(117.55, '영상이 끝난 후', () => (
  <Sc>
    <Cap s="영상이 끝난 후" at={117.65} />
    <Char who="man" at={117.8} x={0} face="neutral" poses={[[121.0, 'happy', 'present']]} />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Rv at={119.1}>
        <Icon name="cloud" size={140} color={C.gray} />
      </Rv>
      <Tx s="막연한 꿈" at={119.2} size={46} color={C.gray} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Rv at={121.3}>
        <Icon name="beach" size={140} />
      </Rv>
      <Tx s="월급 걱정 없는 삶에|{더 가까이}" at={121.3} size={46} hl={122.4} />
    </At>
  </Sc>
));

S(124.3, '많은 분들의 생각', () => (
  <Sc>
    <Cap s="많은 분들이 처음엔 [이렇게] 생각합니다" at={124.4} />
    <Char who="man" at={124.5} x={0} face="think" arms="chin" />
    <At x={0} y={330}>
      <Bubble s="“일단 [조회수부터] 올리면|돈은 따라오는 거 아닌가?”" at={126.9} size={46} />
    </At>
  </Sc>
));

S(130.15, '순서가 정반대', () => (
  <Sc>
    <Cap s="하지만 돈 버는 채널들은 순서가 {정반대}" at={130.25} hl={133.0} />
    <Char who="man" at={130.3} x={CHAR_LEFT} face="think" poses={[[132.9, 'surprise', 'cheek']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={50} align="center">
        <Pill s="조회수 → 돈" at={130.6} strike={132.9} size={48} />
        <Arrow at={133.2} red w={110} iconSize={48} />
        <Pill s="돈 → 조회수" at={133.5} solid size={48} />
      </Row>
    </Stage>
  </Sc>
));

S(134.35, '네 가지', () => {
  const t = useT();
  return (
    <Sc>
      <Cap s="꼭 알아야 할 {네 가지}" at={134.45} hl={136.7} />
      <Char who="woman" at={134.5} x={0} face="smile" arms="point" />
      <At x={-SIDE_X} y={SIDE_Y}>
        <Col gap={22}>
          {[1, 2].map((n, i) => {
            const p = prog(t, 136.7 + i * 0.3, 0.5);
            return <Circle key={n} n={n} p={p} />;
          })}
        </Col>
      </At>
      <At x={SIDE_X} y={SIDE_Y}>
        <Col gap={22}>
          {[3, 4].map((n, i) => {
            const p = prog(t, 137.3 + i * 0.3, 0.5);
            return <Circle key={n} n={n} p={p} />;
          })}
        </Col>
      </At>
    </Sc>
  );
});

const Circle: React.FC<{n: number; p: number}> = ({n, p}) => (
  <div
    style={{
      width: 120,
      height: 120,
      borderRadius: '50%',
      border: `4px solid ${C.ink}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 58,
      fontWeight: 700,
      opacity: p,
      transform: `translateY(${(1 - p) * 20}px)`,
    }}
  >
    {n}
  </div>
);

S(139.6, '첫 번째', () => (
  <Sc>
    <Cap s="첫 번째는 [영상을 보여주는 방식]이" at={139.7} />
    <Char who="man" at={139.8} x={CHAR_LEFT} face="neutral" arms="present" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={60}>
        <Item icon="device-tv" at={140.0} label="보여주는 방식" size={150} />
        <Arrow at={142.9} w={140} iconSize={150} />
        <Item icon="refresh" at={143.2} label="어떻게 {바뀌었나}" size={150} />
      </Row>
    </Stage>
  </Sc>
));

// ───────────────────────── Chapter 1 ─────────────────────────

S(145.05, '챕터 1', () => (
  <Sc>
    <Stage top={0} bottom={0}>
      <Chapter n="01" pre="이제는 ‘아는 사람’이 아니라" s="‘{주제}’가 사람을 모은다" icon="magnet" at={145.15} />
    </Stage>
  </Sc>
));

S(148.8, '예전에는', () => (
  <Sc>
    <Cap s="[예전]에는" at={148.9} />
    <Char who="man" at={149.0} x={CHAR_LEFT} face="neutral" arms="point" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={60}>
      <Row gap={40} align="center">
        <Icon name="camera" size={110} />
        <Tx s="인스타그램 → [팔로우한 친구] 사진만" at={151.1} size={46} />
      </Row>
      <Row gap={40} align="center">
        <Icon name="player-play" size={110} />
        <Tx s="유튜브 → [구독한 채널] 영상만" at={154.2} size={46} />
      </Row>
    </Stage>
  </Sc>
));

S(156.55, '아는 사람끼리', () => (
  <Sc>
    <Cap s="싸이월드 일촌, 초창기 페이스북처럼" at={156.65} />
    <Char who="man" at={156.7} x={-DUO_X} h={560} face="smile" />
    <Char who="woman" at={156.9} x={DUO_X} h={560} face="smile" />
    <Float icon="heart-handshake" at={159.2} x={0} y={600} size={170} />
    <At x={0} y={330}>
      <Tx s="아는 사람끼리 [연결]|친구가 많을수록 {유리}" at={159.3} size={52} hl={163.0} />
    </At>
  </Sc>
));

S(166.1, '틱톡', () => (
  <Sc>
    <Cap s="2018년, [틱톡]이 판을 뒤집습니다" at={166.2} />
    <Char who="woman" at={166.3} x={CHAR_LEFT} face="surprise" arms="cheek" poses={[[170.8, 'think', 'none'], [173.2, 'happy', 'none']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={40}>
        <Item icon="user" at={170.8} label="팔로워가 없어도" size={130} x={171.6} />
        <Arrow at={171.8} w={100} iconSize={130} />
        <Item icon="mood-happy" at={172.1} label="재밌으면" size={130} />
        <Arrow at={173.0} red w={100} iconSize={130} />
        <Item icon="world" at={173.3} label="{모르는 사람}에게도" size={130} />
      </Row>
    </Stage>
  </Sc>
));

S(175.9, '릴스와 쇼츠', () => (
  <Sc>
    <Cap s="이후 인스타에는 [릴스], 유튜브에는 [쇼츠]" at={176.0} />
    <Char who="man" at={176.1} x={0} face="smile" />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Icon name="device-mobile" size={150} />
      <div style={{height: 24}} />
      <Pill s="릴스" at={176.6} size={44} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Icon name="player-play" size={150} />
      <div style={{height: 24}} />
      <Pill s="쇼츠" at={177.8} size={44} />
    </At>
  </Sc>
));

S(179.3, '피드 대부분', () => {
  const t = useT();
  const subscribed = [false, false, true, false, false, false];
  return (
    <Sc>
      <Cap s="지금 뜨는 영상 대부분은 {구독하지 않은} 채널" at={179.4} hl={183.3} />
      <Char who="man" at={179.5} x={CHAR_LEFT} h={560} face="neutral" poses={[[183.0, 'surprise']]} />
      <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', gap: 30}}>
          {subscribed.map((sub, i) => {
            const p = prog(t, 180.0 + i * 0.25, 0.5);
            const tag = prog(t, 182.9 + i * 0.12, 0.4);
            return (
              <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
                <div
                  style={{
                    height: 170,
                    borderRadius: 16,
                    border: `3px solid ${C.ink}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Icon name="player-play" size={60} stroke={1.8} />
                  <div
                    style={{
                      position: 'absolute',
                      right: 12,
                      bottom: 12,
                      fontSize: 24,
                      fontWeight: 700,
                      padding: '5px 14px',
                      borderRadius: 999,
                      color: sub ? C.ink : '#fff',
                      background: sub ? '#fff' : C.ink,
                      border: `2px solid ${C.ink}`,
                      opacity: tag,
                    }}
                  >
                    {sub ? '구독' : '구독 안 함'}
                  </div>
                </div>
                <div style={{height: 12, width: '80%', marginTop: 14, borderRadius: 6, background: C.line}} />
                <div style={{height: 12, width: '50%', marginTop: 8, borderRadius: 6, background: C.line}} />
              </div>
            );
          })}
        </div>
      </Stage>
    </Sc>
  );
});

S(185.45, '알고리즘 추천', () => (
  <Sc>
    <Cap s="유튜브가 [좋아할 만한 영상]을 알아서 골라 줍니다" at={185.55} />
    <Char who="woman" at={185.6} x={0} face="smile" arms="present" />
    <ThinkIcon icon="robot" at={186.0} x={-360} y={480} />
    <Float icon="gift" at={187.0} x={430} y={560} size={140} />
    <At x={0} y={300}>
      <Pill s="‘알고리즘 추천’" at={190.3} solid size={50} />
    </At>
  </Sc>
));

S(192.7, '중요한 이유', () => (
  <Sc>
    <Cap s="이게 [중요한] 이유" at={192.8} />
    <Char who="man" at={192.9} x={-DUO_X} h={560} face="neutral" dim={197.0} />
    <Char who="woman" at={197.5} x={DUO_X} h={560} face="smile" arms="point" />
    <At x={-DUO_X} y={DUO_Y}>
      <Tx s="예전" at={194.7} size={40} color={C.gray} />
      <Tx s="아는 사람이 [많아야]" at={194.8} size={48} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Tx s="지금" at={197.6} size={40} color={C.gray} />
      <Tx s="{무엇을} 이야기하느냐" at={197.7} size={48} hl={198.6} />
    </At>
  </Sc>
));

S(200.75, '주제가 전부', () => (
  <Sc>
    <Cap s="지인에게 구독을 부탁하던 시대는 지났습니다" at={200.85} />
    <Char who="man" at={200.9} x={0} face="determined" arms="fist" />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Strike s="지인 구독 부탁" at={201.2} strike={202.6} size={46} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Tx s="어떤 [주제]를|잡느냐가 {전부}" at={204.2} size={56} hl={205.2} />
    </At>
  </Sc>
));

S(206.15, '어떤 주제가 돈이 될까', () => (
  <Sc>
    <Cap s="그렇다면 [어떤 주제]가 돈이 될까요?" at={206.25} />
    <Char who="woman" at={206.3} x={0} face="think" arms="chin" poses={[[208.5, 'surprise', 'none']]} />
    <ThinkIcon icon="coins" at={206.6} x={-330} y={430} />
    <At x={SIDE_X} y={SIDE_Y}>
      <Icon name="bolt" size={140} />
      <Tx s="답은 {영향력}에" at={208.6} size={50} hl={209.4} />
    </At>
  </Sc>
));

// ───────────────────────── Chapter 2 ─────────────────────────

S(210.85, '챕터 2', () => (
  <Sc>
    <Stage top={0} bottom={0}>
      <Chapter n="02" s="돈은 ‘{기준을 정하는 사람}’에게 모인다" icon="ruler-2" at={210.95} />
    </Stage>
  </Sc>
));

S(213.1, '힘은 어디서', () => (
  <Sc>
    <Cap s="방송이든 유튜브든, [힘은 조회수에서 나오지 않습니다]" at={213.2} />
    <Char who="man" at={213.3} x={CHAR_LEFT} face="neutral" arms="point" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={60}>
        <Item icon="eye" at={213.5} label="조회수" x={215.0} size={140} />
        <Arrow at={216.6} red w={130} iconSize={140} />
        <Item icon="user-check" at={216.9} label="“이 분야는 {저 사람 말}”" sub="사람들의 믿음" size={140} />
      </Row>
    </Stage>
  </Sc>
));

S(220.6, '영화 평론가', () => (
  <Sc>
    <Cap s="평론가가 “[볼 만하다]”고 하면 관객이 몰리듯" at={220.7} />
    <Char who="woman" at={220.8} x={CHAR_LEFT} face="smile" arms="point" />
    <At x={CHAR_LEFT} y={DUO_Y}>
      <Bubble s="“볼 만하다”" at={221.2} size={44} />
    </At>
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={50}>
      <Row gap={50}>
        <Item icon="movie" at={221.0} label="영화" size={130} />
        <Arrow at={222.6} w={110} iconSize={130} />
        <Item icon="ticket" at={222.9} label="관객이 [몰린다]" size={130} />
      </Row>
      <Tx s="기준을 정하는 사람에게|{돈이 모입니다}" at={225.2} size={50} />
    </Stage>
  </Sc>
));

S(228.6, '주제를 좁혀야', () => (
  <Sc>
    <Cap s="큰 분야의 기준은 [큰 채널]이 이미 쥐고 있습니다" at={228.7} />
    <Char who="man" at={228.8} x={0} face="worry" poses={[[232.9, 'determined', 'point']]} />
    <Float icon="crown" at={229.2} x={-440} y={520} size={160} />
    <At x={SIDE_X} y={SIDE_Y}>
      <Icon name="filter" size={140} />
      <div style={{height: 16}} />
      <Tx s="그래서 주제를 {좁혀야}" at={233.0} size={50} hl={233.8} />
    </At>
  </Sc>
));

S(234.45, '좁히기', () => {
  const t = useT();
  const steps = [
    {s: '요리', at: 234.6, w: 760},
    {s: '다이어트 요리', at: 237.4, w: 620},
    {s: '도시락', at: 239.7, w: 480},
    {s: '직장인 도시락', at: 241.4, w: 360},
  ];
  return (
    <Sc>
      <Cap s="주제를 [좁혀] 보세요" at={234.55} />
      <Char who="woman" at={234.6} x={CHAR_LEFT} face="smile" arms="present" />
      <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
        <Col gap={20}>
          {steps.map((st, i) => {
            const p = prog(t, st.at, 0.55);
            const next = steps[i + 1];
            const active = next ? 1 - prog(t, next.at, 0.5) : 1;
            const last = i === steps.length - 1;
            return (
              <div
                key={st.s}
                style={{
                  width: st.w,
                  height: 92,
                  borderRadius: 46,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 44,
                  fontWeight: last ? 800 : 500,
                  opacity: p * (0.3 + 0.7 * active),
                  transform: `translateY(${(1 - p) * 20}px)`,
                  background: last ? C.ink : '#fff',
                  color: last ? '#fff' : C.ink,
                  border: `3px solid ${C.ink}`,
                }}
              >
                {st.s}
              </div>
            );
          })}
        </Col>
      </Stage>
    </Sc>
  );
});

S(244.6, '한 번 더', () => (
  <Sc>
    <Cap s="여기서 [한 번 더] 좁히면" at={244.7} />
    <Char who="woman" at={244.8} x={CHAR_LEFT} face="determined" arms="point" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={60}>
      <Pill s="직장인 도시락" at={244.9} size={48} />
      <Row gap={80}>
        <Item icon="currency-won" at={245.9} label="예산 [1주일 3만 원]" size={130} />
        <Item icon="user" at={247.8} label="혼자 사는 [30대 직장인]" size={130} />
      </Row>
    </Stage>
  </Sc>
));

S(251.35, '경쟁자도 없다', () => (
  <Sc>
    <Cap s="“이렇게 좁히면 볼 사람이 없잖아요?”" at={251.45} />
    <Char who="man" at={251.5} x={-DUO_X} h={580} face="worry" />
    <Char who="woman" at={253.2} x={DUO_X} h={580} face="smile" arms="point" poses={[[254.6, 'happy', 'fist']]} />
    <At x={-DUO_X} y={DUO_Y}>
      <Bubble s="볼 사람이 없잖아요?" at={251.6} size={42} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Tx s="맞습니다." at={253.3} size={44} color={C.gray} />
      <Tx s="그런데 {경쟁자도 없습니다}" at={254.6} size={50} hl={255.4} />
    </At>
  </Sc>
));

S(256.8, '유명 유튜버 vs 경험자', () => (
  <Sc>
    <Cap s="유명 다이어트 유튜버 vs [혼자 매일 도시락 싸 본 사람]" at={256.9} />
    <Char who="man" at={257.0} x={-DUO_X} h={560} face="smile" arms="present" />
    <Char who="woman" at={263.7} x={DUO_X} h={560} face="worry" poses={[[267.0, 'determined', 'point']]} />
    <At x={-DUO_X} y={DUO_Y}>
      <Bubble s="“닭가슴살과 채소|위주로 싸면 됩니다”" at={259.4} size={40} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Bubble s="“사흘 만에 [질려서] 포기해요”|“재료도 [남아서] 버리게 되고요”" at={267.0} size={40} red />
    </At>
  </Sc>
));

S(271.45, '틈', () => (
  <Sc>
    <Cap s="큰 채널은 [모두를 위한] 이야기를 하다 보니" at={271.55} />
    <Char who="man" at={271.6} x={CHAR_LEFT} face="neutral" poses={[[274.9, 'think', 'chin'], [278.0, 'smile', 'point']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={28}>
        <Item icon="speakerphone" at={271.8} label="모두를 위한 이야기" size={120} labelSize={36} />
        <Arrow at={274.7} w={80} iconSize={120} />
        <Item icon="alert-triangle" at={274.9} label="상황엔 [안 맞는] 말" size={120} labelSize={36} />
        <Arrow at={277.8} red w={80} iconSize={120} />
        <Item icon="puzzle" at={278.0} label="그 {틈}의 이야기" size={120} labelSize={36} />
      </Row>
    </Stage>
  </Sc>
));

S(281.9, '과정 3단계', () => {
  const t = useT();
  const steps = [
    {n: '01', s: '이미 있는 이야기에 [내 경험과 생각]을 더한다', at: 283.6},
    {n: '02', s: '큰 채널과 [다른 의견]을 말한다', at: 287.6},
    {n: '03', s: '작은 분야의 대표가 되어 {기준을 정한다}', at: 290.6},
  ];
  return (
    <Sc>
      <Cap s="과정은 [이렇습니다]" at={282.0} />
      <Char who="woman" at={282.1} x={CHAR_LEFT} face="smile" arms="point" poses={[[290.6, 'determined', 'fist']]} />
      <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
        <Col gap={40} style={{alignItems: 'flex-start'}}>
          {steps.map((st, i) => {
            const next = steps[i + 1];
            const active = next ? 1 - prog(t, next.at, 0.5) : 1;
            return (
              <div key={st.n} style={{opacity: 0.3 + 0.7 * active}}>
                <Rv at={st.at}>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: 26, fontSize: 48}}>
                    <span style={{fontWeight: 800}}>{st.n}</span>
                    <Tx s={st.s} at={st.at} size={48} hl={st.at + 0.6} style={{textAlign: 'left'}} />
                  </div>
                </Rv>
              </div>
            );
          })}
        </Col>
      </Stage>
    </Sc>
  );
});

S(297.0, '내세울 게 없어도', () => (
  <Sc>
    <Cap s="내세울 게 없다고 [걱정하실 필요 없습니다]" at={297.1} />
    <Char who="man" at={297.2} x={CHAR_LEFT} face="worry" poses={[[304.1, 'smile', 'present']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={60}>
      <Row gap={60}>
        <Item icon="school" at={299.8} label="평범한 학력" size={130} />
        <Item icon="home" at={300.9} label="넉넉지 않은 집안" size={130} />
        <Item icon="coin" at={302.0} label="적은 돈" size={130} />
      </Row>
      <Tx s="이것 자체가 {하나의 주제}" at={304.1} size={54} />
    </Stage>
  </Sc>
));

S(306.7, '특별하지 않은 사람', () => (
  <Sc>
    <Cap s="큰 채널이 “이렇게 하면 됩니다”라고 할 때" at={306.8} />
    <Char who="man" at={306.9} x={-DUO_X} h={560} face="smile" arms="present" dim={309.5} />
    <Char who="woman" at={309.5} x={DUO_X} h={560} face="determined" arms="point" />
    <At x={-DUO_X} y={DUO_Y}>
      <Bubble s="“이렇게 하면 됩니다”" at={307.0} size={40} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Bubble s="“그건 [특별한 사람]의 얘기잖아요”|“저 같은 사람은 [이렇게] 해야 해요”" at={309.6} size={38} red />
    </At>
  </Sc>
));

S(315.15, '팬', () => {
  const t = useT();
  return (
    <Sc>
      <Cap s="나와 같은 처지의 사람들이 [내 편]이 됩니다" at={315.25} />
      <Char who="woman" at={315.3} x={0} face="happy" arms="fist" />
      <At x={-SIDE_X} y={SIDE_Y}>
        <Row gap={10}>
          {Array.from({length: 4}).map((_, i) => {
            const p = prog(t, 315.6 + i * 0.08, 0.45);
            return (
              <div key={i} style={{opacity: p}}>
                <Icon name="user" size={80} stroke={1.8} />
              </div>
            );
          })}
        </Row>
      </At>
      <At x={SIDE_X} y={SIDE_Y}>
        <Row gap={20} align="center">
          <Icon name="heart" size={100} stroke={1.8} />
          <Tx s="그게 바로 {팬}" at={318.1} size={64} hl={318.5} />
        </Row>
      </At>
    </Sc>
  );
});

S(319.45, '경험이 없어도', () => (
  <Sc>
    <Cap s="“아직 그 분야 [경험이 없는데요?]”" at={319.55} />
    <Char who="man" at={319.6} x={CHAR_LEFT} face="worry" poses={[[322.9, 'smile', 'point']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={60}>
        <Item icon="books" at={322.9} label="배우고 시도하는 과정" size={140} />
        <Arrow at={323.6} red w={130} iconSize={140} />
        <Item icon="video" at={324.0} label="{그 자체가 콘텐츠}" size={140} />
      </Row>
    </Stage>
  </Sc>
));

S(325.85, '막 시작한 사람', () => (
  <Sc>
    <Cap s="같은 출발선의 사람들에게 [더 와닿기도] 합니다" at={325.95} />
    <Char who="man" at={326.0} x={-DUO_X} h={560} face="smile" dim={true} />
    <Char who="woman" at={328.2} x={DUO_X} h={560} face="happy" arms="fist" />
    <At x={-DUO_X} y={DUO_Y}>
      <Row gap={16} align="center">
        <Icon name="trophy" size={80} stroke={1.6} color={C.gray} />
        <Tx s="이미 성공한 사람" at={326.2} size={44} color={C.gray} />
      </Row>
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Row gap={16} align="center">
        <Icon name="seedling" size={80} stroke={1.6} />
        <Tx s="{지금 막 시작한} 사람" at={328.3} size={48} hl={329.0} />
      </Row>
    </At>
  </Sc>
));

S(333.25, '지갑을 여는 순간', () => (
  <Sc>
    <Cap s="팬이 [지갑을 여는 순간]은 따로 있습니다" at={333.35} />
    <Char who="woman" at={333.4} x={CHAR_LEFT} face="think" arms="chin" poses={[[340.9, 'smile', 'point']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={120}>
        <Item icon="sparkles" at={338.7} label="상품이 좋아 보일 때" size={140} x={340.3} />
        <Item icon="bandage" at={340.9} label="{내 고민을 해결}해 줄 것 같을 때" size={140} check={342.4} />
      </Row>
    </Stage>
  </Sc>
));

// ───────────────────────── Chapter 3 ─────────────────────────

S(343.2, '챕터 3', () => (
  <Sc>
    <Stage top={0} bottom={0}>
      <Chapter n="03" pre="사람은 상품이 아니라" s="‘{공감된 문제의 해결}’에 돈을 낸다" icon="heart-handshake" at={343.3} />
    </Stage>
  </Sc>
));

S(347.0, '깔창과 연고', () => (
  <Sc>
    <Cap s="물건이 아니라 [그 물건이 해결해 주는 것]을 삽니다" at={347.1} />
    <Char who="man" at={347.2} x={CHAR_LEFT} face="neutral" arms="point" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={50}>
      <Row gap={50} align="center">
        <Item icon="shoe" at={347.3} label="깔창" size={120} dim={351.0} />
        <Arrow at={351.1} red w={120} iconSize={120} />
        <Item icon="ruler-2" at={351.4} label="[키가 커 보이고] 싶어서" size={120} />
      </Row>
      <Row gap={50} align="center">
        <Item icon="first-aid-kit" at={353.4} label="연고" size={120} dim={356.6} />
        <Arrow at={356.7} red w={120} iconSize={120} />
        <Item icon="bandage" at={357.0} label="상처가 [빨리 낫기를]" size={120} />
      </Row>
    </Stage>
  </Sc>
));

S(359.15, '고민에 돈을 낸다', () => (
  <Sc>
    <Cap s="이처럼 사람들은 물건이 아니라" at={359.25} />
    <Char who="woman" at={359.3} x={0} face="smile" arms="present" />
    <At x={0} y={330}>
      <Tx s="물건이 해결해 주는 {고민}에 돈을 냅니다" at={361.9} size={62} hl={363.0} />
    </At>
  </Sc>
));

S(364.6, '팔 상품이 없는데요', () => (
  <Sc>
    <Cap s="상품이 꼭 [내가 만든 물건]일 필요는 없습니다" at={366.7} />
    <Char who="man" at={364.7} x={0} face="worry" poses={[[366.7, 'surprise']]} />
    <At x={0} y={330}>
      <Bubble s="“그런데 저는 [팔 상품이 없는데요?]”" at={364.8} size={46} />
    </At>
  </Sc>
));

S(369.85, '모두 상품이 된다', () => (
  <Sc>
    <Cap s="고민을 해결해 줄 수 있다면 {모두 상품}" at={369.95} hl={380.3} />
    <Char who="woman" at={370.0} x={0} h={560} face="smile" arms="present" poses={[[379.0, 'happy', 'present']]} />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Row gap={40}>
        <Item icon="book-2" at={370.1} label="전자책" size={110} labelSize={36} />
        <Item icon="school" at={371.0} label="강의" size={110} labelSize={36} />
        <Item icon="messages" at={372.3} label="상담" size={110} labelSize={36} />
      </Row>
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Row gap={40}>
        <Item icon="bulb" at={373.4} label="코칭" size={110} labelSize={36} />
        <Item icon="building-store" at={374.4} label="가게·서비스" size={110} labelSize={36} />
        <Item icon="heart-handshake" at={376.5} label="제휴·협찬" size={110} labelSize={36} />
      </Row>
    </At>
  </Sc>
));

S(382.4, '구매의 4단계', () => (
  <Sc>
    <Cap s="사람이 [구매하는 과정]" at={382.5} />
    <Char who="woman" at={382.6} x={0} h={430} face="think" arms="chin" poses={[[391.7, 'smile', 'none'], [395.3, 'happy', 'fist']]} />
    <Stage top={190} bottom={460}>
      <Row gap={22}>
        <Item icon="heart" at={385.4} label="① {공감}" sub="“어, 이거 내 얘기다”" size={110} labelSize={38} />
        <Arrow at={388.6} w={80} iconSize={110} />
        <Item icon="bulb" at={388.9} label="② 깨달음" sub="“이런 문제가 있었구나”" size={110} labelSize={38} />
        <Arrow at={391.4} w={80} iconSize={110} />
        <Item icon="tool" at={391.7} label="③ 방법" sub="“이렇게 하면 되는구나”" size={110} labelSize={38} />
        <Arrow at={395.0} red w={80} iconSize={110} />
        <Item icon="credit-card" at={395.3} label="④ [구매]" sub="“돈 낼 만하다”" size={110} labelSize={38} check={399.2} />
      </Row>
    </Stage>
  </Sc>
));

S(400.85, '공감이란', () => (
  <Sc>
    <Cap s="가장 중요한 건 첫 단계, {공감}" at={400.95} hl={401.8} />
    <Char who="man" at={401.0} x={-DUO_X} h={560} face="smile" dim={405.8} />
    <Char who="woman" at={405.8} x={DUO_X} h={560} face="smile" arms="point" />
    <At x={-DUO_X} y={DUO_Y}>
      <Bubble s="“고생했어”" at={403.6} size={44} />
      <div style={{height: 12}} />
      <Tx s="위로가 아니라" at={404.4} size={40} color={C.gray} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Bubble s="“나도 그거 {겪어 봤어}”" at={405.9} size={46} red />
    </At>
  </Sc>
));

S(408.0, '어깨가 찝히는 느낌', () => (
  <Sc>
    <Cap s="운동을 해 본 사람만 [무슨 뜻인지] 압니다" at={412.2} />
    <Char who="man" at={408.1} x={CHAR_LEFT} face="worry" />
    <At x={CHAR_LEFT} y={DUO_Y}>
      <Bubble s="“무거운 걸 들 때|[어깨가 찝히는] 느낌”" at={408.2} size={42} />
    </At>
    <At x={STAGE_CX} y={SIDE_Y}>
      <Icon name="barbell" size={220} stroke={1.3} />
    </At>
  </Sc>
));

S(414.45, '걱정거리', () => (
  <Sc>
    <Cap s="그 사람에게는 바로 [걱정거리]가 되죠" at={414.55} />
    <Char who="man" at={414.6} x={0} face="worry" poses={[[417.4, 'surprise', 'cheek']]} />
    <At x={0} y={330}>
      <Bubble s="“어, 나도 그런데. {다치는 거 아니야?}”" at={417.5} size={46} red />
    </At>
  </Sc>
));

S(420.0, '겪어 보지 않은 사람', () => (
  <Sc>
    <Cap s="겪어 보지 않은 사람에게는 [문제로 느껴지지도] 않습니다" at={420.1} />
    <Char who="woman" at={420.2} x={CHAR_LEFT} face="neutral" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={46}>
        <Item icon="mood-empty" at={420.3} label="문제로 안 느껴짐" size={130} />
        <Arrow at={423.7} w={100} iconSize={130} />
        <Item icon="pill" at={424.0} label="좋은 해결책" size={130} />
        <Arrow at={425.5} red w={100} iconSize={130} />
        <Item icon="wallet" at={425.8} label="{돈을 내지 않는다}" size={130} x={427.0} />
      </Row>
    </Stage>
  </Sc>
));

S(429.25, '좋은 소식', () => (
  <Sc>
    <Cap s="여기서 [좋은 소식]이 있습니다" at={429.35} />
    <Char who="man" at={429.4} x={CHAR_LEFT} face="happy" arms="point" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={60}>
        <Item icon="target-arrow" at={431.5} label="주제를 [좁게] 잡으면" size={140} />
        <Arrow at={434.6} red w={130} iconSize={140} />
        <Item icon="users-group" at={434.9} label="{비슷한 고민}을 겪은 사람들" size={140} />
      </Row>
    </Stage>
  </Sc>
));

S(439.45, '연구할 필요 없음', () => (
  <Sc>
    <Cap s="그래서 시청자를 [따로 연구할 필요가 없습니다]" at={439.55} />
    <Char who="woman" at={439.6} x={0} face="smile" arms="present" />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Icon name="user" size={140} />
      <div style={{height: 16}} />
      <Tx s="[내]가 겪은 이야기" at={442.2} size={46} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Icon name="users-group" size={140} />
      <div style={{height: 16}} />
      <Tx s="{그들의} 이야기" at={444.0} size={46} />
    </At>
  </Sc>
));

S(446.05, '진짜 공감', () => (
  <Sc>
    <Cap s="억지로 꾸민 공감이 아니라" at={446.15} />
    <Char who="man" at={446.2} x={0} face="happy" arms="fist" />
    <At x={0} y={330}>
      <Row gap={40} align="center">
        <Pill s="꾸민 공감" at={446.4} strike={447.4} size={44} />
        <Arrow at={448.1} red w={110} iconSize={44} />
        <Pill s="진짜 경험에서 나온 공감" at={448.4} solid size={48} />
      </Row>
    </At>
  </Sc>
));

S(450.55, '계산', () => (
  <Sc>
    <Cap s="이제 가장 궁금하셨을 [계산]" at={450.65} />
    <Char who="woman" at={450.7} x={0} face="think" arms="chin" />
    <ThinkIcon icon="calculator" at={451.0} x={330} y={430} />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Tx s="조회수가 정말|{얼마나} 필요할까?" at={454.1} size={58} hl={455.4} />
    </At>
  </Sc>
));

// ───────────────────────── Chapter 4 ─────────────────────────

S(457.6, '챕터 4', () => (
  <Sc>
    <Stage top={0} bottom={0}>
      <Chapter n="04" pre="월 100만 원에 필요한 조회수," s="{생각보다 적습니다}" icon="calculator" at={457.7} />
    </Stage>
  </Sc>
));

S(461.05, '광고 수익 vs 상품 판매', () => (
  <Sc>
    <Cap s="먼저 [짚고 넘어갈 것]" at={461.15} />
    <Char who="man" at={461.2} x={-DUO_X} h={540} face="neutral" dim={466.2} />
    <Char who="woman" at={466.9} x={DUO_X} h={540} face="smile" arms="point" />
    <At x={-DUO_X} y={DUO_Y}>
      <Row gap={16} align="center">
        <Icon name="ad-2" size={80} stroke={1.6} />
        <Tx s="유튜브 광고 수익" at={463.3} size={46} />
      </Row>
      <div style={{height: 14}} />
      <Tx s="훨씬 많은 조회수가 필요" at={470.5} size={38} color={C.gray} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Row gap={16} align="center">
        <Icon name="shopping-bag" size={80} stroke={1.6} />
        <Tx s="{상품 판매} 수익" at={466.9} size={48} hl={467.6} />
      </Row>
      <div style={{height: 14}} />
      <Tx s="이야기가 [완전히] 다릅니다" at={475.2} size={40} />
    </At>
  </Sc>
));

S(477.6, '계산식', () => {
  const rows = [
    {l: '상품 1개 판매', r: '[1만 원] 남음', at: 477.7},
    {l: '월 100만 원', r: '[100개] 판매', at: 480.8},
    {l: '100명 중', r: '[1명] 구매', at: 483.7},
    {l: '필요한 사람', r: '{1만 명}', at: 487.35},
  ];
  return (
    <Sc>
      <Cap s="[같이 계산해] 볼게요" at={477.7} />
      <Char who="woman" at={477.8} x={CHAR_LEFT} h={600} face="smile" arms="point" poses={[[487.35, 'surprise', 'none']]} />
      <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
        <Card at={477.65} style={{padding: '44px 70px', border: `3px solid ${C.ink}`, boxShadow: 'none'}}>
          <Col gap={24} style={{alignItems: 'stretch'}}>
            {rows.map((r, i) => (
              <Rv key={i} at={r.at}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 100,
                    fontSize: 50,
                    paddingBottom: 20,
                    borderBottom: i < rows.length - 1 ? `2px dashed ${C.line}` : 'none',
                    width: 860,
                  }}
                >
                  <span style={{color: C.gray}}>{r.l}</span>
                  <Tx s={r.r} at={r.at} size={50} hl={r.at + 0.5} />
                </div>
              </Rv>
            ))}
          </Col>
        </Card>
      </Stage>
    </Sc>
  );
});

S(489.8, '만 회면 된다', () => (
  <Sc>
    <Cap s="한 달 동안 채널 전체에서" at={489.9} />
    <Char who="man" at={490.0} x={CHAR_LEFT} face="neutral" poses={[[493.15, 'surprise', 'cheek']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={30}>
      <Strike s="1,000,000회" at={490.3} strike={492.2} size={76} />
      <Num to={10000} at={493.15} dur={1.0} size={190} suffix="회" />
    </Stage>
  </Sc>
));

S(494.7, '천만 원이라면', () => (
  <Sc>
    <Cap s="목표가 한 달에 [1,000만 원]이라면?" at={494.8} />
    <Char who="woman" at={494.9} x={CHAR_LEFT} face="think" arms="chin" poses={[[497.0, 'happy', 'fist']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Num to={100000} at={497.0} dur={1.0} size={190} suffix="회" />
    </Stage>
  </Sc>
));

S(499.05, '만 명이 안 볼 수도', () => (
  <Sc>
    <Cap s="상품 이야기만으로는 [만 명이 보지 않을 수도] 있습니다" at={499.15} />
    <Char who="man" at={499.2} x={0} face="worry" />
    <ThinkIcon icon="target-arrow" at={503.2} x={330} y={430} />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Tx s="주제를 좁히면|볼 사람이 [적으니까요]" at={503.3} size={48} />
    </At>
  </Sc>
));

S(506.45, '좁게 넓게', () => {
  const t = useT();
  const a = prog(t, 509.0, 0.7);
  const b = prog(t, 510.2, 0.8);
  return (
    <Sc>
      <Cap s="그래서 기억하실 [원칙] 하나" at={506.55} />
      <Char who="woman" at={506.6} x={CHAR_LEFT} face="determined" arms="point" />
      <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={60}>
        <Row gap={120} align="flex-end">
          <Col gap={26}>
            <div style={{width: 340, height: 170, display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
              <div style={{width: 100, height: 170 * a, border: `4px solid ${C.ink}`, borderRadius: 16}} />
            </div>
            <Tx s="주제는 [좁게]" at={508.9} size={52} />
          </Col>
          <Col gap={26}>
            <div style={{width: 340, height: 170, display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
              <div style={{width: 340 * b, height: 170, background: C.ink, borderRadius: 16}} />
            </div>
            <Tx s="영상의 입구는 {넓게}" at={510.1} size={52} hl={510.6} />
          </Col>
        </Row>
        <Tx s="상품 이야기보다 [한 걸음 앞]에서 시작" at={511.5} size={44} />
      </Stage>
    </Sc>
  );
});

S(514.45, '깔창 영상 예시', () => (
  <Sc>
    <Cap s="예를 들어 [깔창]을 판다면" at={514.55} />
    <Char who="man" at={514.6} x={-DUO_X} h={560} face="neutral" dim={517.6} />
    <Char who="woman" at={517.6} x={DUO_X} h={560} face="worry" />
    <At x={-DUO_X} y={DUO_Y}>
      <Strike s="깔창 소개 영상" at={515.0} strike={516.6} size={46} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Bubble s="“키 때문에 소개팅에서|{자신 없었던} 경험”" at={518.1} size={42} red />
    </At>
  </Sc>
));

S(523.0, '공감하는 사람이 더 많다', () => {
  const t = useT();
  const people = (n: number, at: number, dim?: boolean) => (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${Math.min(n, 5)}, 70px)`, gap: 14}}>
      {Array.from({length: n}).map((_, i) => {
        const p = prog(t, at + i * 0.04, 0.4);
        return (
          <div key={i} style={{opacity: p * (dim ? 0.35 : 1)}}>
            <Icon name="user" size={70} stroke={1.8} />
          </div>
        );
      })}
    </div>
  );
  return (
    <Sc>
      <Cap s="깔창을 찾는 사람보다 [그 고민에 공감하는 사람]이 훨씬 많으니까요" at={523.1} size={50} />
      <Stage top={200} bottom={200}>
        <Row gap={200} align="center">
          <Col gap={30}>
            {people(3, 523.3, true)}
            <Tx s="깔창을 찾는 사람" at={523.3} size={42} color={C.gray} />
          </Col>
          <Col gap={30}>
            {people(15, 524.6)}
            <Tx s="그 고민에 {공감하는 사람}" at={524.6} size={46} hl={525.6} />
          </Col>
        </Row>
      </Stage>
    </Sc>
  );
});

S(527.4, '고민에서 출발', () => (
  <Sc>
    <Cap s="전문 분야는 [좁게] 지키되" at={527.5} />
    <Char who="woman" at={527.6} x={0} face="smile" arms="present" />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Icon name="target-arrow" size={140} />
      <div style={{height: 16}} />
      <Tx s="전문 분야는 [좁게]" at={527.7} size={46} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Icon name="users-group" size={140} />
      <div style={{height: 16}} />
      <Tx s="영상은 {많은 사람의 고민}에서" at={529.9} size={46} hl={531.0} />
    </At>
  </Sc>
));

S(533.0, '제목과 썸네일', () => (
  <Sc>
    <Cap s="어디서부터 이야기할지 정하면" at={533.1} />
    <Char who="man" at={533.2} x={CHAR_LEFT} face="neutral" poses={[[535.8, 'happy', 'point']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={60}>
        <Item icon="message-circle" at={533.3} label="이야기 시작점" size={150} />
        <Arrow at={535.5} red w={130} iconSize={150} />
        <Item icon="photo" at={535.8} label="제목·썸네일도 {자연스럽게}" size={150} />
      </Row>
    </Stage>
  </Sc>
));

S(538.5, '순서만 바꾸면', () => (
  <Sc>
    <Cap s="순서만 바꾸면" at={538.6} />
    <Char who="woman" at={538.7} x={0} face="happy" arms="fist" />
    <At x={0} y={320}>
      <Tx s="{작은 채널도 돈이 됩니다}" at={538.9} size={72} hl={539.4} />
    </At>
  </Sc>
));

S(541.7, '6300 vs 11만', () => (
  <Sc>
    <Cap s="실제로 이런 채널들이 있습니다" at={541.8} />
    <Char who="woman" at={541.9} x={-DUO_X} h={520} face="happy" arms="fist" />
    <Char who="man" at={546.9} x={DUO_X} h={520} face="worry" />
    <At x={-DUO_X} y={DUO_Y}>
      <Tx s="구독자 [6,300명]" at={541.9} size={44} />
      <div style={{height: 10}} />
      <Tx s="{1억 2천만 원}" at={544.6} size={76} weight={800} hl={545.4} />
    </At>
    <At x={DUO_X} y={DUO_Y}>
      <Tx s="구독자 [11만 명]" at={546.9} size={44} />
      <div style={{height: 10}} />
      <Tx s="210만 원" at={548.6} size={76} weight={800} color={C.gray} />
    </At>
  </Sc>
));

S(551.1, '17배', () => (
  <Sc>
    <Cap s="구독자는 17배 넘게 차이 나는데" at={551.2} />
    <Char who="man" at={551.3} x={CHAR_LEFT} face="surprise" arms="cheek" />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM} gap={30}>
      <Num to={17} at={551.4} dur={1.0} size={200} suffix="배" />
      <Tx s="결과는 {정반대}" at={552.8} size={60} hl={553.5} />
    </Stage>
  </Sc>
));

S(554.5, '무엇을 누구에게', () => (
  <Sc>
    <Cap s="차이는 처음부터 [무엇을 누구에게 팔지] 정했느냐" at={554.6} />
    <Char who="woman" at={554.7} x={0} face="determined" arms="point" />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Item icon="package" at={555.4} label="무엇을" size={130} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Item icon="user-check" at={556.4} label="누구에게" size={130} />
    </At>
    <At x={0} y={330}>
      <Pill s="11만 구독자 = 허영 지표" at={559.0} solid size={46} />
    </At>
  </Sc>
));

S(562.25, '도움이 되는 수익', () => (
  <Sc>
    <Cap s="순서만 바꾸면 [작은 채널도 돈]이 됩니다" at={562.35} />
    <Char who="man" at={562.4} x={0} face="smile" arms="present" />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Strike s="유명해지기" at={565.3} strike={566.3} size={50} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Tx s="내 삶에 실제로|{도움이 되는 수익}" at={567.3} size={52} hl={568.2} />
    </At>
  </Sc>
));

S(570.5, '손님을 모으세요', () => (
  <Sc>
    <Cap s="좋아요가 아니라 [손님]을 모으세요" at={570.6} size={60} />
    <Char who="woman" at={570.6} x={0} face="happy" arms="point" />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Item icon="heart" at={570.7} label="좋아요" size={140} x={571.2} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Item icon="users" at={571.2} label="{손님}" size={140} check={572.0} />
    </At>
  </Sc>
));

// ───────────────────────── CTA ─────────────────────────

S(572.75, '막히는 지점', () => (
  <Sc>
    <Cap s="막상 시작하려고 하면 대부분 [여기서 막힙니다]" at={579.3} />
    <Char who="man" at={572.9} x={0} face="think" arms="chin" poses={[[579.3, 'worry', 'none']]} />
    <At x={-SIDE_X} y={DUO_Y + 60}>
      <Bubble s="“내 주제는 뭐지?”" at={574.7} size={40} />
    </At>
    <At x={SIDE_X} y={DUO_Y + 60}>
      <Bubble s="“뭘 팔 수 있지?”" at={576.2} size={40} />
    </At>
    <At x={0} y={DUO_Y - 40}>
      <Bubble s="“어디서부터 이야기하지?”" at={577.7} size={40} />
    </At>
  </Sc>
));

S(582.5, '내 상황에서', () => (
  <Sc>
    <Cap s="지금 [내 상황]에서 무엇부터 준비할지" at={582.6} />
    <Char who="woman" at={582.7} x={CHAR_LEFT} face="think" arms="chin" poses={[[586.6, 'smile', 'point']]} />
    <Stage left={STAGE_LEFT} top={STAGE_TOP} bottom={STAGE_BOTTOM}>
      <Row gap={60}>
        <Item icon="search" at={582.9} label="무엇부터 준비할지" size={150} />
        <Arrow at={586.3} red w={130} iconSize={150} />
        <Item icon="clipboard-check" at={586.6} label="{먼저 확인}하기" size={150} check={587.6} />
      </Row>
    </Stage>
  </Sc>
));

const PinnedComment: React.FC<{at: number}> = ({at}) => (
  <Card at={at} style={{padding: '28px 34px', width: 500, border: `3px solid ${C.ink}`, boxShadow: 'none'}}>
    <Row gap={16} align="center" style={{justifyContent: 'flex-start'}}>
      <Icon name="pin" size={44} stroke={2} />
      <div style={{fontSize: 30, fontWeight: 700}}>고정 댓글</div>
    </Row>
    <div style={{height: 12, width: '90%', marginTop: 20, borderRadius: 6, background: C.line}} />
    <div
      style={{
        marginTop: 20,
        display: 'inline-block',
        fontSize: 28,
        fontWeight: 700,
        color: '#fff',
        background: C.ink,
        borderRadius: 999,
        padding: '12px 28px',
      }}
    >
      내 상황 확인하기 →
    </div>
  </Card>
);

S(589.65, '고정 댓글 링크', () => (
  <Sc>
    <Cap s="[고정 댓글]에 링크를 남겨두었습니다" at={589.75} />
    <Stage top={200} bottom={420}>
      <Row gap={36}>
        <div style={{marginTop: 0}}>
          <PinnedComment at={589.9} />
        </div>
        <Arrow at={592.6} red w={90} iconSize={190} />
        <Item icon="message-circle" at={592.8} label="질문에 답하고" size={120} labelSize={36} />
        <Arrow at={594.0} w={90} iconSize={120} />
        <Item icon="check" at={594.2} label="신청 완료" size={120} labelSize={36} />
        <Arrow at={595.4} red w={90} iconSize={120} />
        <Item icon="clipboard-list" at={595.6} label="{기초 진단표}" size={120} labelSize={36} />
      </Row>
    </Stage>
    <Char who="man" at={590.0} x={0} h={400} face="smile" arms="point" poses={[[595.6, 'happy', 'point']]} />
  </Sc>
));

S(597.8, '지금 확인', () => (
  <Sc>
    <Cap s="지금 [고정 댓글]에서 확인해 보세요" at={597.9} />
    <Char who="woman" at={598.0} x={0} face="think" arms="chin" poses={[[603.0, 'smile', 'point']]} />
    <At x={-SIDE_X} y={SIDE_Y}>
      <Bubble s="“무엇부터 시작해야 하지?”" at={599.9} size={42} />
    </At>
    <At x={SIDE_X} y={SIDE_Y}>
      <Tx s="{내 상황부터}|확인해 보세요" at={603.0} size={54} hl={604.6} />
    </At>
  </Sc>
));

export const SCENES = scenes;
