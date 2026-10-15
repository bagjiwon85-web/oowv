# BPT 27 모션그래픽

부자가 되기 위한 세 가지(목표 / 가치 / 돈으로 바꾸는 기술) 내레이션용 1920×1080 · 30fps 모션그래픽입니다.
레퍼런스 영상의 톤(모눈종이 배경, 검정·빨강 2색, 손글씨 밑줄, 세리프 숫자, 회색 자막 바)을 따릅니다.

- `engine.js` – 캔버스 렌더러(아이콘, 사람, 말풍선, 박스, 화살표, 밑줄, 장면 전환, 자막 바)
- `scenes.js` – SRT 타이밍에 맞춘 57개 장면 스크립트
- `captions.js` – `build_captions.mjs`로 SRT에서 생성
- `render.mjs` – Playwright(Chromium)로 프레임을 찍어 ffmpeg로 인코딩

## 다시 렌더링하기

```bash
node build_captions.mjs                       # SRT 수정 시
node render.mjs --stills 10,50,120 ./stills   # 미리보기 스틸
node render.mjs 0 11559 video.mp4             # 영상(프레임 범위 지정, 병렬 분할 가능)
ffmpeg -i video.mp4 -i BPT27.mp3 -c:v copy -c:a aac -b:a 192k -shortest BPT27_motion.mp4
```

폰트: Pretendard(본문·자막), DM Serif Display(숫자).
