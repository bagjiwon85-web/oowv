# 영상 제작 기본 규칙

사용자가 따로 다른 형식을 요청하지 않는 한, 이 저장소에서 만드는 모든 영상은 아래 규칙을 따른다.

- **형식**: 모션그래픽 영상
- **해상도**: 1920×1080 (1080p), 가로(16:9), 30fps
- **배경**: 검은색
- **주요 색상**: 흰색과 빨간색
- **모션**: 과하지 않게, 깔끔하고 절제된 움직임
- **구성**: 음성(MP3)과 SRT에 맞춰 문장마다 모션그래픽으로 표현
- **자막**: 넣는다. 스타일은 `assets/TTS 회색바 자막.prtextstyle` 기준 (NEXON Lv2 Gothic Regular 50px, 흰 글씨, 회색 바, 하단 중앙)
- **캐릭터**: `assets/character.png` 캐릭터를 중간중간 등장시켜 장면을 표현

사용자가 다른 형식을 원하면 그 요청에 명시된 부분만 위 규칙 대신 따른다.

## 제작 파이프라인 (`video/`)

- `engine.js`: 캔버스 렌더 엔진 (아이콘, 카드, 텍스트, 자막, 애니메이션)
- `scenes.js`: 문장(큐)별 장면 정의
- `cues.json` / `cues.js`: SRT에서 중복 줄을 합친 큐 목록
- `render.mjs`: Playwright로 프레임을 캡처해 ffmpeg로 인코딩
  - 미리보기: `node render.mjs --preview 1,10,20` → `build/preview_*.jpg`
  - 전체 렌더: `node render.mjs` 후 `build/seg*.mp4`를 concat하고 음성 합성
