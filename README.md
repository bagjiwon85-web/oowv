# oowv

BPT 29 내레이션(`public/audio.mp3`, `public/script.srt`)에 맞춘 Remotion 인포그래픽 영상.
스타일: 흑백 라인아트 — 직접 그린 오리지널 캐릭터(셔츠+넥타이 남/여, 표정·제스처 전환) · 상단 자막(일반체 + **굵은 키워드**) · Tabler 라인 아이콘 · 왼쪽 챕터 진행 표시.

## 실행

```bash
npm install
npm run studio          # 미리보기 (Remotion Studio)
npm run render          # out/video.mp4 로 렌더
```

Remotion이 자체 Chrome을 내려받을 수 없는 환경이면 `--browser-executable=<chromium 경로>`를 붙여 주세요.

## 구조

- `src/scenes.tsx` — 장면 대본. 모든 시간은 SRT와 같은 절대 초(秒) 단위.
  - 텍스트 마크업: `[굵게]`, `{굵게 + 밑줄 강조}`, `|` 줄바꿈
- `src/Person.tsx` — 캐릭터 SVG (who: man/woman, face: 표정, arms: 제스처)
- `src/kit.tsx` — 공용 컴포넌트(Cap, Char, Item, Arrow, Pill, Bubble, Num, Chapter, Rail …)
- `scripts/build-icons.mjs` — 사용한 Tabler 아이콘만 추려 `src/icons.generated.ts` 생성
- `Characters` 컴포지션 — 캐릭터 포즈 확인용 시트
- `scripts/preview-stills.mjs` — 장면별 스틸 미리보기 렌더

## 떨림 방지 원칙

- 모든 모션은 clamp된 `interpolate` + 오버슈트 없는 ease-out만 사용 (spring 바운스·흔들기·반복 idle 모션 없음)
- 캐릭터 표정/제스처 변경은 중간 프레임 없는 즉시 전환(컷) — 흔들리는 보간 없음
- 요소는 처음부터 레이아웃에 배치되고 투명도/짧은 슬라이드로만 등장 → 다른 요소가 밀리지 않음
- 숫자 카운트업은 최종 값 폭으로 고정된 박스 + tabular 숫자 → 자릿수 변화에 의한 좌우 흔들림 없음
