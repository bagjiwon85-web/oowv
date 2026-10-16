# 작업 규칙

- **영상(모션그래픽) 제작·수정은 반드시 Remotion으로 한다.** 다른 렌더링 방식(직접 만든 브라우저 캡처 스크립트, moviepy 등)은 쓰지 않는다.
- Remotion 프로젝트는 `motion/` 에 있다. 영상마다 `motion/src/<영상ID>/` 폴더와 `src/Root.jsx` 의 `<Composition>` 하나씩.
- 완성본은 `output/` 에 버전 번호를 붙여 저장한다 (예: `BPT27_motion_v4.mp4`).

## 렌더링 (클라우드 세션)
Remotion이 크롬을 내려받지 못하므로 미리 설치된 헤드리스 크롬을 지정한다.
```
cd motion && npm install
export REMOTION_CHROME=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npx remotion render BPT27 out/BPT27.mp4 --concurrency=4
npx remotion studio   # 미리보기/편집
```
