# oowv

BPT 29 내레이션(`public/audio.mp3`, `public/script.srt`)에 맞춘 Remotion 인포그래픽 영상.
레퍼런스(BPT 30) 스타일: 흰 배경 · 중앙 미니멀 인포그래픽 · 네이비 텍스트 + 빨간 강조 · 플랫 아이콘 · 점선 화살표.

## 실행

```bash
npm install
npm run studio          # 미리보기 (Remotion Studio)
npm run render          # out/video.mp4 로 렌더
```

Remotion이 자체 Chrome을 내려받을 수 없는 환경이면 `--browser-executable=<chromium 경로>`를 붙여 주세요.

## 구조

- `src/scenes.tsx` — 장면 대본. 모든 시간은 SRT와 같은 절대 초(秒) 단위.
  - 텍스트 마크업: `[빨강 강조]`, `{빨강 + 형광펜 강조}`, `|` 줄바꿈
- `src/kit.tsx` — 공용 컴포넌트(Item, Arrow, Pill, Bubble, Num, Chapter …)
- `scripts/build-icons.mjs` — 사용한 Fluent Emoji 아이콘만 추려 `src/icons.generated.ts` 생성
- `scripts/preview-stills.mjs` — 장면별 스틸 미리보기 렌더

## 떨림 방지 원칙

- 모든 모션은 clamp된 `interpolate` + 오버슈트 없는 ease-out만 사용 (spring 바운스·흔들기·반복 idle 모션 없음)
- 요소는 처음부터 레이아웃에 배치되고 투명도/짧은 슬라이드로만 등장 → 다른 요소가 밀리지 않음
- 숫자 카운트업은 최종 값 폭으로 고정된 박스 + tabular 숫자 → 자릿수 변화에 의한 좌우 흔들림 없음
