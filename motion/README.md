# BPT27 모션 영상 (v3)

플랫 일러스트 화풍(얼굴 없는 플랫 인물 + 2톤 아이콘), 헤드라인/라벨과 그림을 섞은 구성, 핵심어 빨간색 강조, 음성 타이밍에 맞춘 장면 구성입니다.

- `build/art.js` : 인물·아이콘 일러스트 (SVG) — `node artsheet.js` 로 전체 시안 시트 확인
- `build/lines_marked.txt` : 자막 원문, `{ }` 로 감싼 부분은 자막에서 빨간색으로 강조

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
