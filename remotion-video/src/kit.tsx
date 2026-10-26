import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";

export const SIZE = 1080;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const pop = Easing.out(Easing.back(1.8));

// f 구간 [a,b]에서 x→y로 보간 (범위 밖은 고정)
export const ip = (f: number, a: number, b: number, x: number, y: number, e: (t: number) => number = ease) =>
  interpolate(f, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// 1536x1024 원본 사진을 (cx,cy)=보고 싶은 중심(원본 px), s=확대배율로 1080 정사각 프레임에 배치
const K0 = SIZE / 1024;
export const Photo: React.FC<{
  src: string;
  cx: number;
  cy: number;
  s: number;
  style?: React.CSSProperties;
}> = ({ src, cx, cy, s, style }) => {
  const k = K0 * s;
  const ccx = Math.min(1536 - 540 / k, Math.max(540 / k, cx));
  const ccy = Math.min(1024 - 540 / k, Math.max(540 / k, cy));
  return (
    <Img
      src={staticFile(src)}
      style={{ position: "absolute", width: 1536 * k, height: 1024 * k, left: 540 - ccx * k, top: 540 - ccy * k, ...style }}
    />
  );
};

// 누끼 딴 5만원권 다발 (830x862)
export const Stack: React.FC<{
  x: number;
  y: number;
  size: number;
  rot?: number;
  scale?: number;
  opacity?: number;
}> = ({ x, y, size, rot = 0, scale = 1, opacity = 1 }) => (
  <Img
    src={staticFile("c.png")}
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - (size * 862) / 830 / 2,
      width: size,
      rotate: `${rot}deg`,
      scale,
      opacity,
      filter: "drop-shadow(0 18px 24px rgba(0,0,0,.35))",
    }}
  />
);

// 2번 이미지(b.jpg)에서 잘라낸 댓글 카드 6장 [x, y, w, h]
export const CARDS: [number, number, number, number][] = [
  [58, 237, 335, 148],
  [1048, 102, 277, 146],
  [1061, 404, 264, 142],
  [58, 660, 261, 143],
  [503, 771, 281, 140],
  [1061, 696, 324, 121],
];
export const Card: React.FC<{ i: number; x: number; y: number; scale?: number; opacity?: number; rot?: number }> = ({
  i, x, y, scale = 1, opacity = 1, rot = 0,
}) => {
  const [cx, cy, w, h] = CARDS[i];
  const z = 1.45;
  return (
    <div
      style={{
        position: "absolute",
        left: x - (w * z) / 2,
        top: y - (h * z) / 2,
        width: w * z,
        height: h * z,
        borderRadius: 22,
        overflow: "hidden",
        scale,
        opacity,
        rotate: `${rot}deg`,
        boxShadow: "0 20px 40px rgba(0,0,0,.35)",
      }}
    >
      <Img
        src={staticFile("b.jpg")}
        style={{ position: "absolute", width: 1536 * z, height: 1024 * z, left: -cx * z, top: -cy * z }}
      />
    </div>
  );
};
