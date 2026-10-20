import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// 폰트를 public/fonts에 두고 불러온다. 렌더링 중에 네트워크가 필요 없다.
export const displayFont = "Black Han Sans";
export const bodyFont = "Noto Sans KR";

loadFont({
  family: displayFont,
  url: staticFile("fonts/BlackHanSans-Regular.ttf"),
  weight: "400",
});
loadFont({
  family: bodyFont,
  url: staticFile("fonts/NotoSansKR-Regular.ttf"),
  weight: "400",
});
loadFont({
  family: bodyFont,
  url: staticFile("fonts/NotoSansKR-Bold.ttf"),
  weight: "700",
});
