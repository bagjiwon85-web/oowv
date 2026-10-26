import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { Card, Photo, SIZE, Stack, ip, pop } from "./kit";

type P = { d: number };
const quad = (t: number, a: number[], c: number[], b: number[]) => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];
const Vignette: React.FC<{ a?: number }> = ({ a = 0.55 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, transparent 45%, rgba(0,0,0,${a}) 100%)` }} />
);
const Dim: React.FC<{ a: number }> = ({ a }) => <AbsoluteFill style={{ background: `rgba(6,9,22,${a})` }} />;

// 0 사람들은 딱 세 가지의 돈을 씁니다 — 돈다발 세 덩이가 차례로 등장
export const S0: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const xs = [220, 540, 860];
  return (
    <AbsoluteFill>
      <Photo src="d.jpg" cx={768} cy={512} s={ip(f, 0, d, 1, 1.12)} />
      {xs.map((x, i) => {
        const t = ip(f, 6 + i * 14, 30 + i * 14, 0, 1, pop);
        return <Stack key={i} x={x} y={ip(f, 6 + i * 14, 30 + i * 14, 700, 850 - (i === 1 ? 40 : 0))} size={300} scale={t} opacity={Math.min(1, t * 2)} rot={(i - 1) * 6} />;
      })}
    </AbsoluteFill>
  );
};

// 1 첫째, 자신의 고통을 없애기 위해 지갑을 엽니다 — 지친 얼굴로 다가가며 돈이 빠져나감
export const S1: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Photo src="b.jpg" cx={ip(f, 0, d, 768, 840)} cy={ip(f, 0, d, 512, 440)} s={ip(f, 0, d, 1, 1.35, Easing.inOut(Easing.quad))} />
      <Vignette />
      {[0, 1, 2, 3, 4].map((i) => {
        const st = 22 + i * 14, t = ip(f, st, st + 50, 0, 1, Easing.out(Easing.cubic));
        return <Stack key={i} x={760 + t * (i - 2) * 140} y={850 - t * 600} size={150} rot={(i - 2) * 25 * t} opacity={f < st ? 0 : 1 - t * t} scale={0.6 + 0.5 * t} />;
      })}
    </AbsoluteFill>
  );
};

// 2 스트레스, 빚, 체중… 문제가 클수록 더 많은 돈 — 확대되며 돈다발이 점점 늘어남
export const S2: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const spots = [[830, 900], [640, 940], [900, 740], [450, 960]];
  return (
    <AbsoluteFill>
      <Photo src="b.jpg" cx={ip(f, 0, d, 840, 860)} cy={ip(f, 0, d, 440, 400)} s={ip(f, 0, d, 1.35, 1.7, Easing.linear)} />
      <Vignette a={0.65} />
      {spots.map(([x, y], i) => {
        const t = ip(f, 12 + i * 28, 38 + i * 28, 0, 1, pop);
        return <Stack key={i} x={x} y={y} size={260 + i * 20} scale={t} opacity={Math.min(1, t * 3)} rot={-8 + i * 7} />;
      })}
    </AbsoluteFill>
  );
};

// 3 스트레스 해소 쇼핑 — 야경, 롯데타워 쪽으로 이동하며 돈이 떨어짐
export const S3: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Photo src="a.jpg" cx={ip(f, 0, d, 560, 1000, Easing.inOut(Easing.cubic))} cy={ip(f, 0, d, 500, 420)} s={ip(f, 0, d, 1.1, 1.3)} />
      <Vignette />
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 20) % 70) / 70;
        return <Stack key={i} x={760 + i * 110} y={-100 + t * 1250} size={130} rot={t * 140 * (i % 2 ? 1 : -1)} opacity={Math.min(1, t * 5) * (1 - t * 0.4)} />;
      })}
    </AbsoluteFill>
  );
};

// 4 다이어트하기 위해 돈을 쓰는 것처럼요 — 다시 사람에게 돌아와 푸시인
export const S4: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Photo src="a.jpg" cx={ip(f, 0, d, 1000, 560)} cy={ip(f, 0, d, 420, 520)} s={ip(f, 0, d, 1.3, 1.65)} />
      <Vignette />
      <Stack x={ip(f, 10, d, 150, 880)} y={ip(f, 10, d, 900, 880)} size={190} rot={ip(f, 10, d, -20, 20)} opacity={ip(f, 8, 22, 0, 1)} />
    </AbsoluteFill>
  );
};

// 5 둘째, 삼성·애플·쿠팡·아마존 — 도시 빌딩 네 장이 카드로 등장
export const S5: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const crops = [[1000, 330, 1.7], [150, 590, 2.3], [770, 560, 2.3], [1390, 610, 2.3]];
  const pos = [[300, 300], [780, 300], [300, 780], [780, 780]];
  return (
    <AbsoluteFill style={{ background: "#0c1226" }}>
      {crops.map(([cx, cy, z], i) => {
        const t = ip(f, 4 + i * 8, 30 + i * 8, 0, 1, pop);
        const W = 440;
        const k = (1024 / 1024) * z * 1.0;
        return (
          <div key={i} style={{ position: "absolute", left: pos[i][0] - W / 2, top: pos[i][1] - W / 2 + (1 - t) * 120, width: W, height: W, borderRadius: 40, overflow: "hidden", scale: 0.8 + 0.2 * t, opacity: Math.min(1, t * 2.5), boxShadow: "0 24px 50px rgba(0,0,0,.5)" }}>
            <Img src={staticFile("a.jpg")} style={{ position: "absolute", width: 1536 * k, height: 1024 * k, left: W / 2 - cx * k - ip(f, 0, d, 0, 20 * (i % 2 ? -1 : 1), Easing.linear), top: W / 2 - cy * k }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6 세계적인 기업들의 공통점 — 스카이라인을 따라 와이드 팬
export const S6: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Photo src="a.jpg" cx={ip(f, 0, d, 400, 1150, Easing.inOut(Easing.quad))} cy={600} s={1.25} />
      <Vignette />
    </AbsoluteFill>
  );
};

// 7 더 빠르게, 더 쉽게, 편리하게 — 빠른 단계별 줌 + 스피드 라인
export const S7: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const step = d / 3;
  const s = f < step ? ip(f, 0, 10, 1, 1.15) : f < 2 * step ? ip(f, step, step + 10, 1.15, 1.45) : ip(f, 2 * step, 2 * step + 10, 1.45, 1.85);
  const cx = f < step ? 768 : f < 2 * step ? 780 : 760;
  const cy = f < step ? 512 : f < 2 * step ? 560 : 600;
  return (
    <AbsoluteFill>
      <Photo src="d.jpg" cx={cx} cy={cy} s={s} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const x = (((f * 38 + i * 211) % 1500) - 250);
        return <div key={i} style={{ position: "absolute", left: x, top: 120 + i * 130, width: 260, height: 6, borderRadius: 3, background: "rgba(60,70,90,.18)" }} />;
      })}
    </AbsoluteFill>
  );
};

// 8 귀찮음을 해소해줄 때 — 노트북 쪽으로 부드럽게 이동
export const S8: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Photo src="d.jpg" cx={ip(f, 0, d, 760, 1130)} cy={ip(f, 0, d, 600, 720)} s={ip(f, 0, d, 1.5, 1.7, Easing.linear)} />
    </AbsoluteFill>
  );
};

// 9 돈을 쓴다는 걸 알고 있기 때문이죠 — 돈다발이 툭 떨어짐
export const S9: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const drop = ip(f, 0, 26, -500, 0, Easing.out(Easing.bounce));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #ffffff, #e4e6ec)" }}>
      <Stack x={540} y={560 + drop} size={ip(f, 0, d, 640, 700, Easing.linear)} rot={ip(f, 0, 26, -10, 0)} />
      {[[-1, 0], [1, 8]].map(([sg, dl], i) => (
        <Stack key={i} x={540 + sg * 360} y={ip(f, 18 + dl, 44 + dl, -200, 800, Easing.out(Easing.bounce))} size={200} rot={sg * 14} opacity={f < 18 + dl ? 0 : 1} />
      ))}
    </AbsoluteFill>
  );
};

// 10 셋째, 다른 데서 얻을 수 없는 그 순간의 감정 — 야경 속 인물로 천천히 접근
export const S10: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Photo src="a.jpg" cx={ip(f, 0, d, 768, 560, Easing.linear)} cy={ip(f, 0, d, 512, 470, Easing.linear)} s={ip(f, 0, d, 1, 1.55, Easing.linear)} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 80% 40%, rgba(255,196,90,.28), transparent 55%)", opacity: 0.6 + 0.4 * Math.sin(f / 9) }} />
      <Vignette />
    </AbsoluteFill>
  );
};

// 11 나중에 할 얘기거리에 돈을 씁니다 — 댓글 카드가 팝업
export const S11: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const pos = [[300, 300], [770, 200], [790, 470], [290, 620], [580, 830], [790, 960]];
  const order = [0, 1, 2, 3, 4, 5];
  return (
    <AbsoluteFill>
      <Photo src="d.jpg" cx={768} cy={512} s={1.3} style={{ filter: "blur(16px) brightness(1.02)" }} />
      {order.map((i) => {
        const t = ip(f, 4 + i * 11, 26 + i * 11, 0, 1, pop);
        return <Card key={i} i={i} x={pos[i][0]} y={pos[i][1] + Math.sin((f + i * 17) / 14) * 6} scale={t} opacity={Math.min(1, t * 3)} rot={(i % 2 ? 1 : -1) * 2} />;
      })}
    </AbsoluteFill>
  );
};

// 12 편의점 봉투값 100원은 아까워서 — 아주 작은 돈을 손에 쥠
export const S12: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const sc = ip(f, 0, d, 1.55, 1.8, Easing.linear);
  return (
    <AbsoluteFill>
      <Photo src="d.jpg" cx={ip(f, 0, d, 790, 800)} cy={ip(f, 0, d, 660, 680)} s={sc} />
      <Stack x={620} y={600 + Math.sin(f / 10) * 5} size={ip(f, 0, 20, 10, 105, pop) + Math.sin(f / 7) * 2} rot={-12} />
    </AbsoluteFill>
  );
};

// 13 해외여행엔 100만원을 턱턱 — 돈다발이 쌓여 올라옴
export const S13: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const pos = [[200, 830], [540, 880], [880, 830], [370, 690], [710, 690], [540, 520]];
  return (
    <AbsoluteFill>
      <Photo src="a.jpg" cx={ip(f, 0, d, 600, 1000, Easing.linear)} cy={560} s={1.15} />
      <Dim a={0.45} />
      {pos.map(([x, y], i) => {
        const t = ip(f, 4 + i * 8, 28 + i * 8, 0, 1, pop);
        return <Stack key={i} x={x} y={y + (1 - t) * 300} size={i === 5 ? 340 : 360} scale={0.4 + 0.6 * t} opacity={Math.min(1, t * 3)} rot={(i % 3 - 1) * 5} />;
      })}
    </AbsoluteFill>
  );
};

// 14 돈은 이 세 군데로만 흐릅니다 — 한 곳에서 세 갈래로 돈이 흐름
export const S14: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const top = [540, 230];
  const tg = [[190, 800], [540, 850], [890, 800]];
  const ctrl = [[240, 380], [540, 520], [840, 380]];
  return (
    <AbsoluteFill style={{ background: "#0c1226" }}>
      <Photo src="a.jpg" cx={768} cy={512} s={1.05} style={{ filter: "blur(10px) brightness(.45)" }} />
      <svg width={SIZE} height={SIZE} style={{ position: "absolute", inset: 0 }}>
        {tg.map((t, i) => (
          <path key={i} d={`M${top[0]} ${top[1]} Q${ctrl[i][0]} ${ctrl[i][1]} ${t[0]} ${t[1] - 80}`} fill="none" stroke="#ffc857" strokeOpacity={0.5} strokeWidth={6} strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={ip(f, 10 + i * 8, 40 + i * 8, 1000, 0, Easing.out(Easing.cubic))} />
        ))}
      </svg>
      <Stack x={top[0]} y={top[1]} size={ip(f, 0, 20, 10, 300, pop)} />
      {tg.map((t, i) => {
        const s = ip(f, 24 + i * 8, 46 + i * 8, 0, 1, pop);
        return <Stack key={i} x={t[0]} y={t[1]} size={280} scale={s} opacity={Math.min(1, s * 3)} />;
      })}
      {tg.map((t, i) =>
        [0, 1, 2, 3].map((j) => {
          const u = ((f - 20) / 50 + j / 4 + i * 0.08) % 1;
          if (f < 20) return null;
          const [x, y] = quad(u, top, ctrl[i], [t[0], t[1] - 80]);
          return <Stack key={`${i}-${j}`} x={x} y={y} size={90} rot={u * 360} opacity={Math.sin(u * Math.PI)} />;
        }),
      )}
    </AbsoluteFill>
  );
};

// 15 돈을 버는 사람은 이 세 중 하나를 주는 사람 — 사람이 손으로 돈을 건넴
export const S15: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const t = ip(f, 12, 56, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill>
      <Photo src="d.jpg" cx={ip(f, 0, d, 768, 770)} cy={ip(f, 0, d, 512, 600)} s={ip(f, 0, d, 1, 1.3)} />
      <Stack x={620 + (540 - 620) * t} y={640 + (860 - 640) * t} size={120 + 380 * t} rot={-12 * (1 - t)} opacity={ip(f, 10, 20, 0, 1)} />
    </AbsoluteFill>
  );
};

// 16 나는 이 세 중에 뭘 줄 수 있는 사람일까요? — 고민하는 얼굴로 접근
export const S16: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Photo src="b.jpg" cx={ip(f, 0, d, 800, 850, Easing.linear)} cy={ip(f, 0, d, 480, 380, Easing.linear)} s={ip(f, 0, d, 1.1, 1.95, Easing.inOut(Easing.quad))} />
      <Vignette a={0.7} />
    </AbsoluteFill>
  );
};

// 17 질문 몇 개만 답하면 알 수 있게 — 촬영 중인 폰 화면으로 줌
export const S17: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const t = ip(f, 0, d, 0, 1, Easing.inOut(Easing.cubic));
  const s = 1 + 1.15 * t;
  const k = (SIZE / 1024) * s;
  const cx = 768 - (768 - 300) * t, cy = 512 + (560 - 512) * t;
  const ccx = Math.max(540 / k, cx);
  const rx = 540 + (415 - ccx) * k, ry = 540 + (553 - Math.min(Math.max(540 / k, cy), 1024 - 540 / k)) * k;
  return (
    <AbsoluteFill>
      <Photo src="d.jpg" cx={cx} cy={cy} s={s} />
      <div style={{ position: "absolute", left: rx - 14, top: ry - 14, width: 28, height: 28, borderRadius: 14, background: "#ff3b30", opacity: Math.sin(f / 5) > 0 ? 1 : 0.2, boxShadow: "0 0 24px #ff3b30" }} />
    </AbsoluteFill>
  );
};

// 18 프로필링크에서 확인해보세요 — 채널 프로필 이미지 + 링크 클릭
export const S18: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const W = 900, scale = W / 491;
  const left = 90, top = 540 - (208 * scale) / 2;
  const lx = left + 244 * scale, ly = top + 138 * scale;
  const pin = ip(f, 0, 22, 0, 1, pop);
  const cur = ip(f, 24, 62, 0, 1, Easing.inOut(Easing.cubic));
  const click = f > 66;
  const rip = ip(f, 66, 96, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #ffffff, #eceef3)" }}>
      <Img src={staticFile("e.png")} style={{ position: "absolute", left, top, width: W, scale: 0.85 + 0.15 * pin, opacity: pin, borderRadius: 16, boxShadow: "0 30px 60px rgba(0,0,0,.18)" }} />
      <div style={{ position: "absolute", left: lx - 112, top: ly - 20, width: 224, height: 40, borderRadius: 12, background: "rgba(30,100,255,.16)", opacity: click ? 0.5 + 0.5 * Math.sin((f - 66) / 5) ** 2 : 0 }} />
      {click && <div style={{ position: "absolute", left: lx - 120 * rip, top: ly - 120 * rip, width: 240 * rip, height: 240 * rip, borderRadius: "50%", border: "6px solid rgba(30,100,255,.55)", opacity: 1 - rip }} />}
      <svg width={64} height={64} viewBox="0 0 24 24" style={{ position: "absolute", left: lx + 30 + (1 - cur) * 330, top: ly + 6 + (1 - cur) * 300 + (click ? Math.min(6, (f - 66) * 2) : 0), filter: "drop-shadow(0 6px 8px rgba(0,0,0,.35))", scale: click && f < 74 ? 0.88 : 1 }}>
        <path d="M5 2 L5 19 L9.5 15 L12.5 22 L15 21 L12 14.2 L18 14 Z" fill="#111" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

export const SCENES = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18];
