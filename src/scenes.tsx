import React from 'react';
import {
  Arrow,
  Bubble,
  C,
  Card,
  Chapter,
  Col,
  Crowd,
  Frame,
  Icon,
  Item,
  Num,
  Pill,
  Row,
  Rv,
  Strike,
  Tx,
  prog,
  useT,
} from './kit';

/*
 * All times are absolute seconds on the narration clock (same as the SRT).
 * Markup: [red]  {red + highlighter}  | line break
 */

export type Scene = {start: number; name: string; Body: React.FC};
const scenes: Scene[] = [];
const S = (start: number, name: string, Body: React.FC) => scenes.push({start, name, Body});

const MAN = 'man-office-worker-medium-light';
const WOMAN = 'woman-office-worker-medium-light';
const PERSON = 'man-medium-light';
const PERSON2 = 'woman-medium-light';

// ───────────────────────── Intro ─────────────────────────

S(0, '같은 조건 다른 결과', () => (
  <Frame gap={80}>
    <Tx s="같은 조건, {다른 결과}" at={0.1} hl={7.8} />
    <Col gap={50}>
      <Row gap={50}>
        <Item icon={MAN} at={0.4} size={150} label="A" />
        <Arrow at={2.4} red w={200} iconSize={150} />
        <Item icon="money-bag" at={2.7} size={150} label="월급 걱정 {없는 삶}" check={4.2} />
      </Row>
      <Row gap={50}>
        <Item icon={WOMAN} at={0.6} size={150} label="B" />
        <Arrow at={7.7} w={200} iconSize={150} />
        <Item icon="chart-decreasing" at={8.0} size={150} label="허탈한 결과" sub="채널을 [접는다]" dim={true} />
      </Row>
    </Col>
  </Frame>
));

S(10.85, '왜 갈릴까', () => (
  <Frame gap={30}>
    <Tx s="?" at={10.95} size={150} weight={900} color={C.red} />
    <Tx s="같은 조건에서 출발한 두 사람" at={11.1} size={50} weight={700} />
    <Tx s="결과가 [왜] 이렇게 갈릴까요?" at={11.5} size={72} weight={800} />
  </Frame>
));

S(14.3, '수익의 한 가지 원리', () => (
  <Frame>
    <Tx s="유튜브 수익의 {한 가지 원리}" at={14.4} />
    <Row gap={70}>
      <Pill s="아느냐" at={17.6} red solid size={56} />
      <Tx s="vs" at={18.1} size={48} color={C.gray} style={{marginTop: 22}} />
      <Pill s="모르냐" at={18.4} size={56} />
    </Row>
  </Frame>
));

S(19.2, '허영 지표', () => (
  <Frame gap={60}>
    <Tx s="혹시 들어 보셨나요?" at={19.3} size={48} weight={700} color={C.gray} />
    <Tx s="{허영 지표}" at={19.6} size={130} weight={900} hl={20.3} />
    <Row gap={30} align="center">
      <Item icon="blue-book" at={22.1} size={110} />
      <Tx s="에릭 리스 『[린 스타트업]』" at={22.3} size={46} weight={700} style={{marginTop: -30}} />
    </Row>
  </Frame>
));

S(24.9, '숫자의 착각', () => (
  <Frame>
    <Tx s="숫자가 커지면 [착각]한다" at={25.0} />
    <Row gap={60}>
      <Item icon="chart-increasing" at={25.2} label="숫자가 커진다" />
      <Arrow at={28.3} w={180} />
      <Item icon="thinking-face" at={28.6} label="“일이 잘되고 있어”" sub="실제로는 {착각}" />
    </Row>
  </Frame>
));

S(30.6, '허영 지표 정의', () => (
  <Frame gap={80}>
    <Row gap={70}>
      <Item icon="sparkles" at={30.7} label="겉으로는 [화려한] 숫자" />
      <Tx s="≠" at={32.2} size={110} weight={800} color={C.gray} style={{marginTop: 20}} />
      <Item icon="dollar-banknote" at={32.4} label="실제 돈" sub="아무 상관 없음" dim={true} />
    </Row>
    <Pill s="그게 바로 ‘허영 지표’" at={34.6} red solid size={52} />
  </Frame>
));

// ───────────────────────── Cafe story ─────────────────────────

S(36.4, '두 카페 사장님', () => (
  <Frame>
    <Tx s="예를 들어, 두 [카페] 사장님" at={36.5} />
    <Row gap={240}>
      <Item icon="hot-beverage" at={36.8} label="A 카페" />
      <Item icon="hot-beverage" at={37.1} label="B 카페" />
    </Row>
  </Frame>
));

S(39.6, 'A 사장님 인스타그램', () => (
  <Frame>
    <Tx s="A 사장님의 [인스타그램]" at={39.7} />
    <Row gap={50}>
      <Item icon="camera-with-flash" at={39.9} label="예쁜 사진 게시" />
      <Arrow at={43.0} w={120} />
      <Item icon="shortcake" at={43.4} label="유행 디저트" />
      <Item icon="potted-plant" at={44.6} label="감성 인테리어" />
    </Row>
  </Frame>
));

S(46.9, '팔로워 1만', () => (
  <Frame gap={90}>
    <Row gap={160}>
      <Col gap={20}>
        <Tx s="팔로워" at={47.0} size={46} weight={700} />
        <Num to={10000} at={47.1} dur={1.4} size={150} suffix="명" />
      </Col>
      <Col gap={20}>
        <Tx s="사진 한 장에 좋아요" at={48.6} size={46} weight={700} />
        <Num to={300} at={48.7} dur={1.2} size={150} suffix="+" />
      </Col>
    </Row>
    <Row gap={24} align="center">
      <Rv at={51.6}><Icon name="party-popper" size={90} /></Rv>
      <Tx s="“곧 [대박] 날 거야!”" at={51.6} size={54} />
    </Row>
  </Frame>
));

S(55.85, '저녁 매출 정산', () => (
  <Frame gap={70}>
    <Tx s="그날 저녁 [매출 정산]" at={55.95} />
    <Item icon="receipt" at={56.2} size={140} />
    <Col gap={30}>
      <Crowd n={10} at={58.7} cols={10} size={74} icons={[PERSON, PERSON2]} stagger={0.05} />
      <Tx s="손님은 어제와 똑같이 {열 명 남짓}" at={59.2} size={54} hl={60.0} />
    </Col>
  </Frame>
));

S(61.55, 'B 사장님', () => (
  <Frame>
    <Tx s="반면, 길 건너 [B 사장님]" at={61.65} />
    <Row gap={60}>
      <Item icon="convenience-store" at={61.9} label="B 카페" />
      <Arrow at={64.3} w={160} />
      <Item icon={MAN} at={64.5} label="가게 앞 [직장인들]" />
      <Arrow at={65.6} w={160} />
      <Item icon="memo" at={65.8} label="이런 글을 올린다" />
    </Row>
  </Frame>
));

S(67.05, 'B 사장님의 글', () => (
  <Frame>
    <Row gap={60} align="stretch">
      <Card at={67.15} style={{width: 640}}>
        <Row gap={20} align="center" style={{justifyContent: 'flex-start'}}>
          <Icon name="alarm-clock" size={64} />
          <Tx s="오늘 아침" at={67.15} size={36} weight={700} color={C.gray} />
        </Row>
        <div style={{height: 24}} />
        <Tx s="8시까지 오시면|아메리카노 {천 원 할인}" at={67.4} size={50} hl={68.6} style={{textAlign: 'left'}} />
      </Card>
      <Card at={70.55} style={{width: 640}}>
        <Row gap={20} align="center" style={{justifyContent: 'flex-start'}}>
          <Icon name="bento-box" size={64} />
          <Tx s="점심시간" at={70.55} size={36} weight={700} color={C.gray} />
        </Row>
        <div style={{height: 24}} />
        <Tx s="10분 안에 받아 가는|{세트 메뉴}" at={70.8} size={50} hl={71.9} style={{textAlign: 'left'}} />
      </Card>
    </Row>
  </Frame>
));

S(73.75, '팔로워 300', () => (
  <Frame gap={70}>
    <Row gap={50} align="center">
      <Tx s="팔로워는 고작" at={73.85} size={56} weight={700} />
      <Num to={300} at={74.0} dur={1.0} size={130} suffix="명" color={C.ink} />
    </Row>
    <Row gap={60}>
      <Item icon="sunrise" at={76.1} label="매일 아침" />
      <Arrow at={76.6} red w={160} />
      <Item icon="door" at={77.0} label="{같은 얼굴들}이 들어온다" check={78.0} />
    </Row>
  </Frame>
));

S(78.75, '두 카페의 차이', () => (
  <Frame gap={90}>
    <Tx s="두 카페는 [무엇이] 달랐을까요?" at={78.85} />
    <Row gap={200}>
      <Item icon="red-heart" at={82.5} label="A: 좋아요를 모았다" dim={true} />
      <Item icon="busts-in-silhouette" at={84.3} label="B: {손님}을 모았다" check={85.3} />
    </Row>
  </Frame>
));

// ───────────────────────── YouTube vanity metrics ─────────────────────────

S(86.65, '유튜브도 마찬가지', () => (
  <Frame>
    <Tx s="유튜브도 [마찬가지]" at={86.75} />
    <Row gap={60}>
      <Item icon="eye" at={88.3} label="조회수" />
      <Item icon="busts-in-silhouette" at={89.3} label="구독자" />
      <Arrow at={90.9} red w={160} />
      <Item icon="sparkles" at={91.2} label="가장 쉬운 {허영 지표}" />
    </Row>
  </Frame>
));

S(93.7, '조회수는 오르는데', () => (
  <Frame>
    <Tx s="숫자만 오르는 채널" at={93.8} />
    <Row gap={70}>
      <Item icon="chart-increasing" at={94.0} label="조회수는 [매일] 상승" />
      <Arrow at={95.6} w={170} />
      <Item icon="bank" at={96.0} label="통장 잔고는 {그대로}" />
    </Row>
  </Frame>
));

S(98.5, '돈 버는 유튜버의 순서', () => (
  <Frame gap={80}>
    <Tx s="돈 버는 유튜버의 [순서]" at={98.6} />
    <Strike s="조회수부터 쫓기" at={99.0} strike={100.7} size={48} />
    <Row gap={60}>
      <Item icon="money-bag" at={102.1} label="① 벌고 싶은 돈 [먼저]" />
      <Arrow at={104.1} red w={170} />
      <Item icon="abacus" at={104.3} label="② 필요한 조회수" sub="{거꾸로} 계산" />
    </Row>
  </Frame>
));

S(108.6, '여러분이라면', () => (
  <Frame>
    <Row gap={200}>
      <Item icon="man-technologist-medium-light" at={108.7} label="유튜브를 [하고 있거나]" />
      <Item icon="thinking-face" at={111.6} label="시작을 [고민 중]이라면" />
    </Row>
    <Tx s="돈 버는 채널의 방법을 {쉽게} 알려드립니다" at={113.4} size={56} hl={115.6} />
  </Frame>
));

S(117.55, '영상이 끝난 후', () => (
  <Frame>
    <Tx s="영상이 끝난 후" at={117.65} />
    <Row gap={70}>
      <Item icon="cloud" at={119.1} label="막연한 꿈" dim={true} />
      <Arrow at={121.0} red w={180} />
      <Item icon="desert-island" at={121.3} label="월급 걱정 없는 삶" sub="더욱 {가까이}" />
    </Row>
  </Frame>
));

S(124.3, '많은 분들의 생각', () => (
  <Frame gap={50}>
    <Tx s="많은 분들이 처음엔 이렇게 생각합니다" at={124.4} size={52} weight={700} />
    <Bubble s="“일단 조회수부터 올리면|돈은 [따라오는] 거 아닌가?”" at={126.9} size={50} />
    <Item icon="thinking-face" at={126.6} size={150} />
  </Frame>
));

S(130.15, '순서가 정반대', () => (
  <Frame gap={70}>
    <Tx s="돈 버는 채널은 순서가 {정반대}" at={130.25} hl={133.0} />
    <Row gap={60} align="center">
      <Pill s="조회수 → 돈" at={130.6} strike={132.9} size={50} />
      <Arrow at={133.2} red w={150} iconSize={50} />
      <Pill s="돈 → 조회수" at={133.5} red solid size={50} />
    </Row>
  </Frame>
));

S(134.35, '네 가지', () => {
  const t = useT();
  return (
    <Frame gap={80}>
      <Tx s="꼭 알아야 할 {네 가지}" at={134.45} hl={136.7} />
      <Row gap={40}>
        {[1, 2, 3, 4].map((n, i) => {
          const p = prog(t, 136.7 + i * 0.35, 0.5);
          return (
            <div
              key={n}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: `5px solid ${C.ink}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 60,
                fontWeight: 900,
                color: C.ink,
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px)`,
              }}
            >
              {n}
            </div>
          );
        })}
      </Row>
    </Frame>
  );
});

S(139.6, '첫 번째', () => (
  <Frame>
    <Tx s="[첫 번째]" at={139.7} />
    <Row gap={70}>
      <Item icon="television" at={139.9} label="유튜브가 영상을|보여주는 방식" />
      <Arrow at={142.9} w={170} />
      <Item icon="counterclockwise-arrows-button" at={143.2} label="어떻게 [바뀌었나]" />
    </Row>
  </Frame>
));

// ───────────────────────── Chapter 1 ─────────────────────────

S(145.05, '챕터 1', () => (
  <Frame>
    <Chapter n="01" pre="이제는 ‘아는 사람’이 아니라" s="‘{주제}’가 사람을 모은다" icon="magnet" at={145.15} />
  </Frame>
));

S(148.8, '예전에는', () => (
  <Frame gap={70}>
    <Tx s="[예전]에는" at={148.9} />
    <Col gap={50}>
      <Row gap={50} align="center">
        <Item icon="camera-with-flash" at={149.0} size={120} />
        <Tx s="인스타그램 → [팔로우한 친구] 사진만" at={151.1} size={50} weight={700} style={{marginTop: -30}} />
      </Row>
      <Row gap={50} align="center">
        <Item icon="play-button" at={153.9} size={120} />
        <Tx s="유튜브 → [구독한 채널] 영상만" at={154.2} size={50} weight={700} style={{marginTop: -30}} />
      </Row>
    </Col>
  </Frame>
));

S(156.55, '아는 사람끼리', () => (
  <Frame>
    <Tx s="싸이월드 일촌 · 초창기 페이스북" at={156.65} size={56} />
    <Row gap={70}>
      <Item icon="handshake" at={159.2} label="아는 사람끼리 [연결]" />
      <Arrow at={162.6} red w={170} />
      <Item icon="people-hugging" at={162.9} label="친구가 많을수록 {유리}" />
    </Row>
  </Frame>
));

S(166.1, '틱톡', () => (
  <Frame>
    <Tx s="2018년, [틱톡]이 판을 뒤집다" at={166.2} />
    <Row gap={46}>
      <Item icon="bust-in-silhouette" at={170.8} label="팔로워가 없어도" x={171.6} />
      <Arrow at={171.8} w={110} />
      <Item icon="face-with-tears-of-joy" at={172.1} label="영상이 재밌으면" />
      <Arrow at={173.0} red w={110} />
      <Item icon="globe-showing-asia-australia" at={173.3} label="{모르는 사람}에게도" />
    </Row>
  </Frame>
));

S(175.9, '릴스와 쇼츠', () => (
  <Frame>
    <Tx s="이후 [짧은 영상]의 시대" at={176.0} />
    <Row gap={200}>
      <Col gap={40}>
        <Item icon="camera-with-flash" at={176.1} label="인스타그램" />
        <Pill s="릴스" at={176.6} red size={46} />
      </Col>
      <Col gap={40}>
        <Item icon="play-button" at={177.3} label="유튜브" />
        <Pill s="쇼츠" at={177.8} red size={46} />
      </Col>
    </Row>
  </Frame>
));

S(179.3, '피드 대부분', () => {
  const t = useT();
  const subscribed = [false, false, true, false, false, false];
  return (
    <Frame gap={70}>
      <Tx s="지금 뜨는 영상 대부분은 {구독하지 않은} 채널" at={179.4} hl={183.3} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 360px)', gap: 36}}>
        {subscribed.map((sub, i) => {
          const p = prog(t, 180.0 + i * 0.25, 0.5);
          const tag = prog(t, 182.9 + i * 0.12, 0.4);
          return (
            <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
              <div
                style={{
                  height: 200,
                  borderRadius: 20,
                  background: sub ? '#E9EBF0' : '#F1F2F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Icon name="play-button" size={80} />
                <div
                  style={{
                    position: 'absolute',
                    right: 14,
                    bottom: 14,
                    fontSize: 26,
                    fontWeight: 800,
                    padding: '6px 16px',
                    borderRadius: 999,
                    color: '#fff',
                    background: sub ? C.gray : C.red,
                    opacity: tag,
                  }}
                >
                  {sub ? '구독' : '구독 안 함'}
                </div>
              </div>
              <div style={{height: 16, width: '80%', marginTop: 16, borderRadius: 8, background: C.line}} />
              <div style={{height: 16, width: '50%', marginTop: 10, borderRadius: 8, background: C.line}} />
            </div>
          );
        })}
      </div>
    </Frame>
  );
});

S(185.45, '알고리즘 추천', () => (
  <Frame gap={80}>
    <Row gap={70}>
      <Item icon="robot" at={185.55} label="유튜브가 알아서" />
      <Arrow at={186.6} w={170} />
      <Item icon="wrapped-gift" at={186.9} label="“이 사람이 [좋아할 만한] 영상”" />
    </Row>
    <Pill s="‘알고리즘 추천’" at={190.3} red solid size={54} />
  </Frame>
));

S(192.7, '중요한 이유', () => (
  <Frame gap={80}>
    <Tx s="이게 [중요한] 이유" at={192.8} />
    <Row gap={160}>
      <Col gap={30}>
        <Tx s="예전" at={194.7} size={44} weight={700} color={C.gray} />
        <Item icon="busts-in-silhouette" at={194.8} label="아는 사람이 [많아야]" dim={197.0} />
      </Col>
      <Col gap={30}>
        <Tx s="지금" at={197.6} size={44} weight={700} color={C.red} />
        <Item icon="speech-balloon" at={197.7} label="{무엇을} 이야기하느냐" />
      </Col>
    </Row>
  </Frame>
));

S(200.75, '주제가 전부', () => (
  <Frame gap={70}>
    <Strike s="지인에게 구독 부탁하던 시대" at={200.85} strike={202.6} size={54} />
    <Tx s="이제는 어떤 [주제]를 잡느냐가 {전부}" at={204.2} size={68} hl={205.2} />
  </Frame>
));

S(206.15, '어떤 주제가 돈이 될까', () => (
  <Frame>
    <Tx s="어떤 주제가 [돈]이 될까요?" at={206.25} />
    <Row gap={70}>
      <Item icon="money-bag" at={206.4} label="돈 되는 주제" />
      <Arrow at={208.5} red w={170} />
      <Item icon="high-voltage" at={208.7} label="{영향력}이 어디서?" />
    </Row>
  </Frame>
));

// ───────────────────────── Chapter 2 ─────────────────────────

S(210.85, '챕터 2', () => (
  <Frame>
    <Chapter n="02" s="돈은 ‘{기준을 정하는 사람}’에게 모인다" icon="straight-ruler" at={210.95} />
  </Frame>
));

S(213.1, '힘은 어디서', () => (
  <Frame gap={80}>
    <Tx s="방송이든 유튜브든, [힘]은" at={213.2} />
    <Row gap={70}>
      <Item icon="eye" at={213.5} label="조회수" x={215.0} />
      <Arrow at={216.6} red w={170} />
      <Item icon="person-raising-hand-medium-light" at={216.9} label="“이 분야는 {저 사람 말}”" sub="사람들의 믿음" />
    </Row>
  </Frame>
));

S(220.6, '영화 평론가', () => (
  <Frame gap={70}>
    <Tx s="예를 들어, [영화 평론가]" at={220.7} />
    <Row gap={70}>
      <Item icon="face-with-monocle" at={220.9} label="“볼 만하다”" />
      <Arrow at={222.6} w={170} />
      <Item icon="admission-tickets" at={222.9} label="관객이 [몰린다]" />
    </Row>
    <Tx s="기준을 정하는 사람에게 {돈이 모인다}" at={225.2} size={56} />
  </Frame>
));

S(228.6, '주제를 좁혀야', () => (
  <Frame>
    <Tx s="큰 분야의 기준은 [큰 채널]이 이미 쥐고 있다" at={228.7} size={58} />
    <Row gap={70}>
      <Item icon="crown" at={229.0} label="큰 채널" />
      <Arrow at={232.9} red w={170} />
      <Item icon="bullseye" at={233.1} label="그래서 주제를 {좁혀야}" />
    </Row>
  </Frame>
));

S(234.45, '좁히기', () => {
  const t = useT();
  const steps = [
    {s: '요리', at: 234.6, w: 1000},
    {s: '다이어트 요리', at: 237.4, w: 820},
    {s: '도시락', at: 239.7, w: 640},
    {s: '직장인 도시락', at: 241.4, w: 460},
  ];
  return (
    <Frame gap={60}>
      <Tx s="주제를 [좁히기]" at={234.55} />
      <Col gap={22}>
        {steps.map((st, i) => {
          const p = prog(t, st.at, 0.55);
          const next = steps[i + 1];
          const dimP = next ? prog(t, next.at, 0.5) : 0;
          const active = 1 - dimP;
          return (
            <div
              key={st.s}
              style={{
                width: st.w,
                height: 96,
                borderRadius: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 46,
                fontWeight: 800,
                opacity: p * (0.35 + 0.65 * active),
                transform: `translateY(${(1 - p) * 20}px)`,
                background: i === steps.length - 1 ? C.red : '#F1F2F6',
                color: i === steps.length - 1 ? '#fff' : C.ink,
                border: i === steps.length - 1 ? 'none' : `3px solid ${C.line}`,
              }}
            >
              {st.s}
            </div>
          );
        })}
      </Col>
    </Frame>
  );
});

S(244.6, '한 번 더', () => (
  <Frame gap={70}>
    <Tx s="여기서 [한 번 더]" at={244.7} />
    <Pill s="직장인 도시락" at={244.9} size={52} />
    <Row gap={80}>
      <Item icon="coin" at={245.9} label="예산 [1주일 3만 원]" size={140} />
      <Item icon={MAN} at={247.8} label="혼자 사는 [30대 직장인]" size={140} />
    </Row>
  </Frame>
));

S(251.35, '경쟁자도 없다', () => (
  <Frame gap={70}>
    <Bubble s="“이렇게 좁히면 볼 사람이 없잖아요?”" at={251.45} size={48} />
    <Row gap={140}>
      <Item icon="busts-in-silhouette" at={253.2} label="맞습니다, 시청자 [적음]" dim={true} />
      <Item icon="trophy" at={254.6} label="그런데 {경쟁자도 없다}" check={255.8} />
    </Row>
  </Frame>
));

S(256.8, '유명 유튜버 vs 경험자', () => (
  <Frame gap={50}>
    <Row gap={100} align="flex-end">
      <Col gap={36}>
        <Bubble s="“닭가슴살과 채소|위주로 싸면 됩니다”" at={259.4} size={40} />
        <Item icon="man-cook-medium-light" at={256.9} label="유명 다이어트 유튜버" size={140} />
      </Col>
      <Col gap={36}>
        <Bubble s="“사흘 만에 [질려서] 포기해요”|“재료도 [남아서] 버리게 되고요”" at={267.0} size={40} red />
        <Item icon={MAN} at={263.7} label="혼자 매일 도시락 싸 본 사람" size={140} />
      </Col>
    </Row>
  </Frame>
));

S(271.45, '틈', () => (
  <Frame>
    <Row gap={46}>
      <Item icon="megaphone" at={271.55} label="큰 채널: [모두]를 위한 이야기" labelSize={36} />
      <Arrow at={274.7} w={110} />
      <Item icon="warning" at={274.9} label="특정 상황엔 [안 맞는] 말" labelSize={36} />
      <Arrow at={277.8} red w={110} />
      <Item icon="puzzle-piece" at={278.0} label="그 {틈}에서 생기는 이야기" labelSize={36} />
    </Row>
  </Frame>
));

S(281.9, '과정 3단계', () => {
  const t = useT();
  const steps = [
    {n: '01', s: '이미 있는 이야기에 [내 경험과 생각]을 더한다', at: 283.6},
    {n: '02', s: '큰 채널과 [다른 의견]을 말한다', at: 287.6},
    {n: '03', s: '작은 분야의 [대표]가 되어 {기준을 정한다}', at: 290.6},
  ];
  return (
    <Frame gap={70}>
      <Tx s="과정은 이렇습니다" at={282.0} />
      <Col gap={34} style={{alignItems: 'flex-start'}}>
        {steps.map((st, i) => {
          const next = steps[i + 1];
          const active = next ? 1 - prog(t, next.at, 0.5) : 1;
          return (
            <div key={st.n} style={{opacity: 0.32 + 0.68 * active}}>
              <Rv at={st.at}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 26, fontSize: 52, fontWeight: 800, color: C.ink}}>
                  <span style={{color: C.red, fontWeight: 900}}>{st.n}</span>
                  <Tx s={st.s} at={st.at} size={52} hl={st.at + 0.6} style={{textAlign: 'left'}} />
                </div>
              </Rv>
            </div>
          );
        })}
      </Col>
    </Frame>
  );
});

S(297.0, '내세울 게 없어도', () => (
  <Frame gap={70}>
    <Tx s="내세울 게 없어도 [괜찮습니다]" at={297.1} />
    <Row gap={60}>
      <Item icon="graduation-cap" at={299.8} label="평범한 학력" size={140} />
      <Item icon="house" at={300.9} label="넉넉지 않은 집안" size={140} />
      <Item icon="coin" at={302.0} label="적은 돈" size={140} />
    </Row>
    <Tx s="이것 자체가 {하나의 주제}" at={304.1} size={60} />
  </Frame>
));

S(306.7, '특별하지 않은 사람', () => (
  <Frame gap={50}>
    <Row gap={90} align="flex-end">
      <Col gap={36}>
        <Bubble s="“이렇게 하면 됩니다”" at={306.8} size={42} />
        <Item icon="crown" at={306.8} label="큰 채널" size={130} dim={309.5} />
      </Col>
      <Col gap={36}>
        <Bubble s="“그건 [특별한 사람]의 얘기잖아요”|“저처럼 특별하지 않은 사람은 [이렇게] 해야 해요”" at={309.5} size={40} red />
        <Item icon={PERSON} at={309.5} label="나" size={130} />
      </Col>
    </Row>
  </Frame>
));

S(315.15, '팬', () => (
  <Frame gap={70}>
    <Tx s="나와 같은 처지의 사람들이 [내 편]이 된다" at={315.25} size={58} />
    <Crowd n={8} at={315.6} cols={8} size={90} icons={[PERSON, PERSON2]} stagger={0.06} />
    <Row gap={24} align="center">
      <Rv at={318.1}><Icon name="sparkling-heart" size={100} /></Rv>
      <Tx s="그게 바로 {팬}" at={318.1} size={72} hl={318.5} />
    </Row>
  </Frame>
));

S(319.45, '경험이 없어도', () => (
  <Frame gap={60}>
    <Bubble s="“아직 그 분야 경험이 없는데요?”" at={319.55} size={46} />
    <Row gap={70}>
      <Item icon="books" at={322.9} label="배우고 시도하는 과정" size={140} />
      <Arrow at={323.6} red w={150} iconSize={140} />
      <Item icon="video-camera" at={324.0} label="{그 자체가 콘텐츠}" size={140} />
    </Row>
  </Frame>
));

S(325.85, '막 시작한 사람', () => (
  <Frame gap={80}>
    <Tx s="같은 출발선의 사람들에게 [더 와닿는다]" at={325.95} size={58} />
    <Row gap={180}>
      <Item icon="trophy" at={326.2} label="이미 성공한 사람" dim={true} />
      <Item icon="seedling" at={328.2} label="{지금 막 시작한} 사람" check={331.0} />
    </Row>
  </Frame>
));

S(333.25, '지갑을 여는 순간', () => (
  <Frame gap={70}>
    <Tx s="팬이 [지갑을 여는] 순간은 따로 있다" at={333.35} />
    <Row gap={160}>
      <Item icon="sparkles" at={338.7} label="상품이 좋아 보일 때" x={340.3} />
      <Item icon="adhesive-bandage" at={340.9} label="{내 고민을 해결}해 줄 것 같을 때" check={342.4} />
    </Row>
  </Frame>
));

// ───────────────────────── Chapter 3 ─────────────────────────

S(343.2, '챕터 3', () => (
  <Frame>
    <Chapter n="03" pre="사람은 상품이 아니라" s="‘{공감된 문제의 해결}’에 돈을 낸다" icon="purse" at={343.3} />
  </Frame>
));

S(347.0, '깔창과 연고', () => (
  <Frame gap={60}>
    <Row gap={60}>
      <Item icon="running-shoe" at={347.1} label="깔창" size={140} dim={351.0} />
      <Arrow at={351.1} red w={150} iconSize={140} />
      <Item icon="straight-ruler" at={351.4} label="[키가 커 보이고] 싶어서" size={140} />
    </Row>
    <Row gap={60}>
      <Item icon="lotion-bottle" at={353.4} label="연고" size={140} dim={356.6} />
      <Arrow at={356.7} red w={150} iconSize={140} />
      <Item icon="adhesive-bandage" at={357.0} label="상처가 [빨리 낫기를]" size={140} />
    </Row>
  </Frame>
));

S(359.15, '고민에 돈을 낸다', () => (
  <Frame gap={50}>
    <Tx s="사람들은 물건이 아니라" at={359.25} size={56} weight={700} color={C.gray} />
    <Tx s="물건이 해결해 주는 {고민}에 돈을 냅니다" at={361.9} size={72} hl={363.0} />
  </Frame>
));

S(364.6, '팔 상품이 없는데요', () => (
  <Frame gap={70}>
    <Bubble s="“그런데 저는 팔 상품이 없는데요?”" at={364.7} size={48} />
    <Tx s="상품 = 꼭 [내가 만든 물건]일 필요는 없다" at={366.7} size={58} />
  </Frame>
));

S(369.85, '모두 상품이 된다', () => (
  <Frame gap={70}>
    <Row gap={50}>
      <Item icon="open-book" at={370.0} label="전자책" size={120} labelSize={36} />
      <Item icon="graduation-cap" at={371.0} label="강의" size={120} labelSize={36} />
      <Item icon="speech-balloon" at={372.3} label="상담" size={120} labelSize={36} />
      <Item icon="light-bulb" at={373.4} label="코칭" size={120} labelSize={36} />
      <Item icon="convenience-store" at={374.4} label="가게·서비스" size={120} labelSize={36} />
      <Item icon="handshake" at={376.5} label="제휴·협찬" size={120} labelSize={36} />
    </Row>
    <Tx s="시청자의 고민을 해결한다면 {모두 상품}" at={379.0} size={62} hl={380.3} />
  </Frame>
));

S(382.4, '구매의 4단계', () => (
  <Frame gap={70}>
    <Tx s="사람이 [구매]하는 과정" at={382.5} />
    <Row gap={22}>
      <Item icon="sparkling-heart" at={385.4} label="① {공감}" sub="“어, 이거 내 얘기다”" size={130} labelSize={38} />
      <Arrow at={388.6} w={80} iconSize={130} />
      <Item icon="light-bulb" at={388.9} label="② 깨달음" sub="“이런 문제가 있었구나”" size={130} labelSize={38} />
      <Arrow at={391.4} w={80} iconSize={130} />
      <Item icon="wrench" at={391.7} label="③ 방법" sub="“이렇게 하면 되는구나”" size={130} labelSize={38} />
      <Arrow at={395.0} red w={80} iconSize={130} />
      <Item icon="credit-card" at={395.3} label="④ [구매]" sub="“돈 낼 만하다”" size={130} labelSize={38} check={399.2} />
    </Row>
  </Frame>
));

S(400.85, '공감이란', () => (
  <Frame gap={70}>
    <Tx s="가장 중요한 건 첫 단계, {공감}" at={400.95} hl={401.8} />
    <Row gap={60} align="center">
      <Pill s="“고생했어” (위로)" at={403.6} strike={404.9} size={46} />
      <Arrow at={405.7} red w={130} iconSize={46} />
      <Pill s="“나도 그거 겪어 봤어”" at={405.95} red solid size={50} />
    </Row>
  </Frame>
));

S(408.0, '어깨가 찝히는 느낌', () => (
  <Frame gap={40}>
    <Bubble s="“헬스장에서 무거운 걸 들 때|[어깨가 찝히는] 느낌”" at={408.1} size={46} />
    <Item icon="person-lifting-weights-medium-light" at={408.3} size={150} />
    <Tx s="운동을 해 본 사람만 {무슨 뜻인지} 압니다" at={412.2} size={52} />
  </Frame>
));

S(414.45, '걱정거리', () => (
  <Frame gap={50}>
    <Tx s="그 사람에게는 바로 [걱정거리]" at={414.55} />
    <Bubble s="“어, 나도 그런데. {다치는 거 아니야?}”" at={417.5} size={48} red />
    <Item icon="worried-face" at={417.3} size={150} />
  </Frame>
));

S(420.0, '겪어 보지 않은 사람', () => (
  <Frame gap={70}>
    <Tx s="반대로, [겪어 보지 않은] 사람에게는" at={420.1} />
    <Row gap={50}>
      <Item icon="slightly-smiling-face" at={420.3} label="문제로 안 느껴짐" />
      <Arrow at={423.7} w={130} />
      <Item icon="pill" at={424.0} label="좋은 해결책" />
      <Arrow at={425.5} red w={130} />
      <Item icon="money-with-wings" at={425.8} label="{돈을 내지 않는다}" x={427.0} />
    </Row>
  </Frame>
));

S(429.25, '좋은 소식', () => (
  <Frame gap={70}>
    <Row gap={24} align="center">
      <Rv at={429.35}><Icon name="party-popper" size={100} /></Rv>
      <Tx s="여기서 [좋은 소식]" at={429.35} />
    </Row>
    <Row gap={70}>
      <Item icon="bullseye" at={431.5} label="주제를 [좁게] 잡으면" />
      <Arrow at={434.6} red w={160} />
      <Item icon="busts-in-silhouette" at={434.9} label="{비슷한 고민}을 겪어 본 사람들" />
    </Row>
  </Frame>
));

S(439.45, '연구할 필요 없음', () => (
  <Frame gap={70}>
    <Strike s="시청자를 따로 연구하기" at={439.55} strike={441.2} size={52} />
    <Row gap={60}>
      <Item icon={PERSON} at={442.2} label="[내]가 겪은 이야기" />
      <Tx s="=" at={443.4} size={100} weight={800} color={C.gray} style={{marginTop: 30}} />
      <Item icon="busts-in-silhouette" at={444.0} label="{그들의} 이야기" />
    </Row>
  </Frame>
));

S(446.05, '진짜 공감', () => (
  <Frame gap={70}>
    <Row gap={60} align="center">
      <Pill s="억지로 꾸민 공감" at={446.15} strike={447.4} size={48} />
      <Arrow at={448.1} red w={130} iconSize={48} />
      <Pill s="진짜 경험에서 나온 공감" at={448.4} red solid size={52} />
    </Row>
  </Frame>
));

S(450.55, '계산', () => (
  <Frame gap={50}>
    <Item icon="abacus" at={450.65} size={160} />
    <Tx s="가장 궁금하셨을 [계산]" at={450.9} size={54} weight={700} />
    <Tx s="조회수가 정말 {얼마나} 필요할까?" at={454.1} size={72} hl={455.4} />
  </Frame>
));

// ───────────────────────── Chapter 4 ─────────────────────────

S(457.6, '챕터 4', () => (
  <Frame>
    <Chapter n="04" pre="월 100만 원에 필요한 조회수," s="{생각보다 적습니다}" icon="money-bag" at={457.7} />
  </Frame>
));

S(461.05, '광고 수익 vs 상품 판매', () => (
  <Frame gap={70}>
    <Tx s="먼저 짚고 넘어갈 것" at={461.15} />
    <Row gap={180}>
      <Col gap={30}>
        <Item icon="television" at={463.3} label="유튜브 광고 수익" dim={466.2} />
        <Tx s="훨씬 많은 조회수 필요" at={470.5} size={40} weight={700} color={C.gray} />
      </Col>
      <Col gap={30}>
        <Item icon="shopping-bags" at={466.9} label="{상품 판매} 수익" />
        <Tx s="이야기가 [완전히] 다르다" at={475.2} size={40} weight={700} />
      </Col>
    </Row>
  </Frame>
));

S(477.6, '계산식', () => {
  const rows = [
    {l: '상품 1개 판매', r: '[1만 원] 남음', at: 477.7},
    {l: '월 100만 원', r: '[100개] 판매', at: 480.8},
    {l: '100명 중', r: '[1명] 구매', at: 483.7},
    {l: '필요한 사람', r: '{1만 명}', at: 487.35},
  ];
  return (
    <Frame>
      <Card at={477.65} style={{padding: '50px 90px'}}>
        <Col gap={28} style={{alignItems: 'stretch'}}>
          {rows.map((r, i) => (
            <Rv key={i} at={r.at}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 120,
                  fontSize: 54,
                  fontWeight: 800,
                  color: C.ink,
                  paddingBottom: 22,
                  borderBottom: i < rows.length - 1 ? `2px dashed ${C.line}` : 'none',
                  width: 980,
                }}
              >
                <span style={{color: C.gray, fontWeight: 700}}>{r.l}</span>
                <Tx s={r.r} at={r.at} size={54} hl={r.at + 0.5} />
              </div>
            </Rv>
          ))}
        </Col>
      </Card>
    </Frame>
  );
});

S(489.8, '만 회면 된다', () => (
  <Frame gap={40}>
    <Tx s="한 달 동안 채널 전체에서" at={489.9} size={50} weight={700} />
    <Strike s="1,000,000회" at={490.3} strike={492.2} size={84} />
    <Num to={10000} at={493.15} dur={1.0} size={210} suffix="회" />
  </Frame>
));

S(494.7, '천만 원이라면', () => (
  <Frame gap={40}>
    <Tx s="목표가 한 달에 [1,000만 원]이라면?" at={494.8} size={60} />
    <Num to={100000} at={497.0} dur={1.0} size={210} suffix="회" />
  </Frame>
));

S(499.05, '만 명이 안 볼 수도', () => (
  <Frame gap={70}>
    <Tx s="상품 이야기만으로는|[만 명]이 보지 않을 수도 있다" at={499.15} size={60} />
    <Row gap={30} align="center">
      <Rv at={503.2}><Icon name="bullseye" size={90} /></Rv>
      <Tx s="주제를 좁히면 볼 사람이 적으니까" at={503.2} size={46} weight={700} color={C.gray} />
    </Row>
  </Frame>
));

S(506.45, '좁게 넓게', () => {
  const t = useT();
  const a = prog(t, 509.0, 0.7);
  const b = prog(t, 510.2, 0.8);
  return (
    <Frame gap={70}>
      <Tx s="기억하실 [원칙] 하나" at={506.55} />
      <Row gap={140} align="flex-end">
        <Col gap={26}>
          <div style={{width: 380, height: 180, display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
            <div style={{width: 110, height: 180 * a, background: C.ink, borderRadius: 18}} />
          </div>
          <Tx s="주제는 [좁게]" at={508.9} size={56} />
        </Col>
        <Col gap={26}>
          <div style={{width: 380, height: 180, display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
            <div style={{width: 380 * b, height: 180, background: C.red, borderRadius: 18}} />
          </div>
          <Tx s="영상의 입구는 {넓게}" at={510.1} size={56} hl={510.6} />
        </Col>
      </Row>
      <Tx s="상품 이야기보다 [한 걸음 앞]에서 시작" at={511.5} size={48} weight={700} />
    </Frame>
  );
});

S(514.45, '깔창 영상 예시', () => (
  <Frame gap={60}>
    <Tx s="예를 들어, [깔창]을 판다면" at={514.55} />
    <Row gap={60} align="center">
      <Pill s="깔창 소개 영상" at={515.0} strike={516.6} size={46} />
      <Arrow at={517.6} red w={130} iconSize={46} />
      <Bubble s="“키 때문에 소개팅에서|{자신 없었던} 경험”" at={518.1} size={44} tail="none" red />
    </Row>
  </Frame>
));

S(523.0, '공감하는 사람이 더 많다', () => (
  <Frame gap={70}>
    <Row gap={160}>
      <Col gap={34}>
        <Crowd n={3} at={523.3} cols={3} size={80} icons={[PERSON]} dim={true} />
        <Tx s="깔창을 찾는 사람" at={523.3} size={44} weight={700} color={C.gray} />
      </Col>
      <Col gap={34}>
        <Crowd n={15} at={524.6} cols={5} size={80} icons={[PERSON, PERSON2]} stagger={0.04} />
        <Tx s="그 고민에 {공감하는 사람}" at={524.6} size={44} hl={525.6} />
      </Col>
    </Row>
  </Frame>
));

S(527.4, '고민에서 출발', () => (
  <Frame gap={70}>
    <Row gap={80}>
      <Item icon="bullseye" at={527.5} label="전문 분야는 [좁게]" />
      <Item icon="busts-in-silhouette" at={529.9} label="영상은 {더 많은 사람의 고민}에서" />
    </Row>
  </Frame>
));

S(533.0, '제목과 썸네일', () => (
  <Frame>
    <Tx s="어디서부터 이야기할지 정하면" at={533.1} />
    <Row gap={70}>
      <Item icon="speech-balloon" at={533.3} label="이야기 시작점" />
      <Arrow at={535.5} red w={170} />
      <Item icon="framed-picture" at={535.8} label="제목 · 썸네일도 {자연스럽게}" />
    </Row>
  </Frame>
));

S(538.5, '순서만 바꾸면', () => (
  <Frame>
    <Tx s="순서만 바꾸면|{작은 채널도 돈이 됩니다}" at={538.6} size={80} hl={539.4} />
  </Frame>
));

S(541.7, '6300 vs 11만', () => (
  <Frame>
    <Row gap={90} align="stretch">
      <Card at={541.8} style={{width: 660, textAlign: 'center'}}>
        <Col gap={20}>
          <Tx s="구독자 [6,300명]" at={541.8} size={48} />
          <Tx s="매출" at={544.5} size={38} weight={700} color={C.gray} />
          <Tx s="1억 2천만 원" at={544.6} size={92} weight={900} color={C.red} />
        </Col>
      </Card>
      <Card at={546.9} style={{width: 660, textAlign: 'center'}}>
        <Col gap={20}>
          <Tx s="구독자 11만 명" at={546.9} size={48} />
          <Tx s="수익" at={548.5} size={38} weight={700} color={C.gray} />
          <Tx s="210만 원" at={548.6} size={92} weight={900} color={C.gray} />
        </Col>
      </Card>
    </Row>
  </Frame>
));

S(551.1, '17배', () => (
  <Frame gap={30}>
    <Tx s="구독자는" at={551.2} size={54} weight={700} />
    <Num to={17} at={551.4} dur={1.0} size={220} suffix="배 차이" />
    <Tx s="그런데 결과는 [정반대]" at={552.8} size={60} />
  </Frame>
));

S(554.5, '무엇을 누구에게', () => (
  <Frame gap={70}>
    <Tx s="차이는 처음부터" at={554.6} size={54} weight={700} color={C.gray} />
    <Tx s="{무엇을 누구에게} 팔지 정하고 시작했느냐" at={555.2} size={70} hl={556.0} />
    <Pill s="11만 구독자 = 허영 지표" at={559.0} red solid size={50} />
  </Frame>
));

S(562.25, '도움이 되는 수익', () => (
  <Frame gap={70}>
    <Tx s="순서만 바꾸면 작은 채널도 돈이 됩니다" at={562.35} size={56} />
    <Row gap={60} align="center">
      <Pill s="유명해지기" at={565.3} strike={566.3} size={48} />
      <Arrow at={567.0} red w={130} iconSize={48} />
      <Pill s="내 삶에 실제로 도움이 되는 수익" at={567.3} red solid size={50} />
    </Row>
  </Frame>
));

S(570.5, '손님을 모으세요', () => (
  <Frame gap={80}>
    <Row gap={200}>
      <Item icon="red-heart" at={570.6} label="좋아요" x={571.2} />
      <Item icon="busts-in-silhouette" at={571.2} label="{손님}" check={572.0} />
    </Row>
    <Tx s="좋아요가 아니라 [손님]을 모으세요" at={570.8} size={64} />
  </Frame>
));

// ───────────────────────── CTA ─────────────────────────

S(572.75, '막히는 지점', () => (
  <Frame gap={40}>
    <Tx s="막상 시작하려고 하면" at={572.85} size={52} weight={700} color={C.gray} />
    <Row gap={30} align="flex-end">
      <Bubble s="“내 주제는 뭐지?”" at={574.7} size={40} />
      <Bubble s="“뭘 팔 수 있지?”" at={576.2} size={40} />
      <Bubble s="“어디서부터 이야기하지?”" at={577.7} size={40} />
    </Row>
    <Item icon="thinking-face" at={573.0} size={140} />
    <Tx s="대부분 여기서 {막힙니다}" at={579.3} size={60} hl={580.0} />
  </Frame>
));

S(582.5, '내 상황에서', () => (
  <Frame>
    <Tx s="지금 [내 상황]에서" at={582.6} />
    <Row gap={70}>
      <Item icon="magnifying-glass-tilted-left" at={582.9} label="무엇부터 준비할지" />
      <Arrow at={586.3} red w={170} />
      <Item icon="clipboard" at={586.6} label="{먼저 확인}하기" check={587.6} />
    </Row>
  </Frame>
));

const PinnedComment: React.FC<{at: number}> = ({at}) => (
  <Card at={at} style={{padding: '30px 36px', width: 520}}>
    <Row gap={18} align="center" style={{justifyContent: 'flex-start'}}>
      <Icon name={PERSON} size={60} />
      <div style={{fontSize: 24, fontWeight: 800, color: '#fff', background: C.ink, borderRadius: 8, padding: '4px 10px'}}>
        PIN
      </div>
      <div style={{fontSize: 30, fontWeight: 800, color: C.ink}}>고정 댓글</div>
    </Row>
    <div style={{height: 14, width: '90%', marginTop: 22, borderRadius: 7, background: C.line}} />
    <div
      style={{
        marginTop: 22,
        display: 'inline-block',
        fontSize: 30,
        fontWeight: 800,
        color: '#fff',
        background: C.red,
        borderRadius: 999,
        padding: '12px 28px',
      }}
    >
      내 상황 확인하기 →
    </div>
  </Card>
);

S(589.65, '고정 댓글 링크', () => (
  <Frame gap={70}>
    <Tx s="[고정 댓글] 링크" at={589.75} />
    <Row gap={40}>
      <div style={{marginTop: 10}}>
        <PinnedComment at={589.9} />
      </div>
      <Arrow at={592.6} red w={100} iconSize={200} />
      <Item icon="speech-balloon" at={592.8} label="질문에 답하고" size={140} labelSize={36} />
      <Arrow at={594.0} w={100} iconSize={140} />
      <Item icon="check-mark-button" at={594.2} label="신청 완료" size={140} labelSize={36} />
      <Arrow at={595.4} red w={100} iconSize={140} />
      <Item icon="clipboard" at={595.6} label="{기초 진단표}" size={140} labelSize={36} />
    </Row>
  </Frame>
));

S(597.8, '지금 확인', () => (
  <Frame gap={40}>
    <Tx s="지금 [고정 댓글]에서 확인" at={597.9} />
    <Bubble s="“무엇부터 시작해야 하지?”" at={599.9} size={46} />
    <Item icon="thinking-face" at={599.8} size={150} />
    <Tx s="{내 상황부터} 확인해 보세요" at={603.0} size={60} hl={604.6} />
  </Frame>
));

export const SCENES = scenes;
