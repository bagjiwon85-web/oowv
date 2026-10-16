# 모션 영상 (Remotion)

## BPT27 (v4)
- `src/BPT27/art.js` : 플랫 인물·아이콘 일러스트 (SVG)
- `src/BPT27/scenes.js` : 장면 구성 — 좌표는 1920x1080 기준, 상단 y<240 은 소제목바·로고 자리로 비움
- `src/BPT27/engine.js` : 스프링 모션(Remotion `spring`), 단어별 등장, 화살표 그리기, 장면 전환
- `src/BPT27/Video.jsx` : Remotion 컴포지션 (장면마다 `<Sequence>`, 음성 `<Audio>`, 자막)
- `src/BPT27/lines_marked.txt` / `lines.json` : 자막과 발화 타이밍, `{ }` = 자막 빨간 강조

## 실행
```
npm install
npx remotion studio                       # 미리보기
npx remotion render BPT27 out/BPT27.mp4   # 렌더 (클라우드 세션은 REMOTION_CHROME 지정, CLAUDE.md 참고)
```
