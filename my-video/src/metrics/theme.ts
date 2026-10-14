import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const COLORS = {
  bg: "#000000",
  key: "#FF4D1F",
  text: "#F5F5F7",
  muted: "#86868B",
  surface: "#1C1C1E",
  surfaceHigh: "#2C2C2E",
};

export const FONT = "Pretendard";

const WEIGHTS = [
  ["Regular", "400"],
  ["Medium", "500"],
  ["SemiBold", "600"],
  ["Bold", "700"],
  ["ExtraBold", "800"],
] as const;

export const fontsLoaded = Promise.all(
  WEIGHTS.map(([name, weight]) =>
    loadFont({
      family: FONT,
      url: staticFile(`fonts/Pretendard-${name}.woff2`),
      weight,
    }),
  ),
);

// Apple 스타일의 부드럽고 절제된 감속 곡선
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const progress = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });

// 아래에서 살짝 떠오르며 나타나는 등장 효과
export const reveal = (
  frame: number,
  start: number,
  duration = 24,
  distance = 30,
): React.CSSProperties => {
  const p = progress(frame, start, duration);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

// 장면 끝에서 조용히 사라지는 효과
export const fadeOut = (frame: number, end: number, duration = 12) =>
  interpolate(frame, [end - duration, end], [1, 0], clamp);

export const formatNumber = (n: number) => Math.round(n).toLocaleString("en-US");
