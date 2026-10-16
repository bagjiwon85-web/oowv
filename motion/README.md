# BPT27 모션 영상 (v2)

흰 배경, 단순한 등장 모션(페이드 + 살짝 확대), 음성 타이밍에 맞춘 장면 구성으로 다시 만든 버전입니다.

- `build/lines.json` : 자막 143줄과 각 줄의 실제 발화 구간(원본 음성의 무음 구간에서 계산)
- `build/scenes.js` : 장면 구성 (좌표는 1920x1080 기준, 상단 y<230 영역은 소제목바·로고용으로 비워 둠)
- `build/engine.js` : 등장/퇴장 모션, 인물 실루엣, 말풍선 등 공통 요소

## 다시 만들기
```
npm i
node build/build.js                       # build/index.html 생성
node render.js 0 11559 parts/all.mp4      # 프레임 렌더 (30fps)
ffmpeg -i parts/all.mp4 -i <원본 영상> -map 0:v -map 1:a -c copy -shortest out.mp4
```
