import { useCurrentFrame } from "remotion";
import { formatNumber, progress } from "./theme";

export const CountUp: React.FC<{
  value: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ value, start = 0, duration = 45, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const current = value * progress(frame, start, duration);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {formatNumber(current)}
      {suffix}
    </span>
  );
};
