# CLAUDE.md

## 모션그래픽 영상 제작 규칙

- 모션그래픽 영상은 **항상 Remotion으로만** 만든다.
- 영상을 만들거나 편집할 때 **ffmpeg CLI나 Python(moviepy, PIL, matplotlib 애니메이션 등)을 직접 쓰지 않는다.**
  - 단, Remotion이 렌더링할 때 내부적으로 쓰는 자체 인코더는 예외다. 이것은 Remotion의 일부다.
- 렌더링은 Remotion CLI(`npx remotion render`)나 `@remotion/renderer`로 한다. 프레임 확인은 `npx remotion still`로 한다.
- 사용자가 요청할 때 "Remotion으로"라고 말하지 않아도 이 규칙을 따른다.
- Remotion 플러그인 스킬(`remotion:remotion-best-practices` 등)이 있으면 작업 전에 먼저 읽고 따른다.

## 프로젝트 구조

- `src/Root.tsx`: 컴포지션 등록. 새 영상은 `src/<영상이름>/` 폴더에 만들고 여기에 등록한다.
- `src/Showcase/`: 설치된 효과 패키지 사용 예시 (라이트 릭, 전환, 노이즈 파티클, 모션 블러, 도형, 폰트).
- `public/`: 이미지, 오디오, 폰트 같은 에셋. `staticFile()`로 불러온다.
- 렌더 결과물은 `out/`에 저장한다 (Git에서 제외됨).

## 퀄리티를 높이는 설치된 패키지

| 패키지 | 용도 |
| --- | --- |
| `@remotion/transitions` | 장면 전환 (fade, slide, wipe, flip, clock-wipe 등)과 오버레이 |
| `@remotion/effects` | WebGL 효과 (lightLeak, glow, blur, vignette, chromaticAberration, noise 등) |
| `@remotion/motion-blur` | 모션 블러 (`Trail`, `CameraMotionBlur`) |
| `@remotion/noise` | 자연스러운 흔들림, 파티클 움직임 (`noise2D`, `noise3D`) |
| `@remotion/shapes`, `@remotion/paths` | 도형과 SVG 패스 애니메이션 (선 그리기 등) |
| `@remotion/lottie` + `lottie-web` | Lottie(After Effects) 애니메이션 삽입 |
| `@remotion/fonts` | `public/fonts`의 로컬 폰트 로드 |
| `@remotion/layout-utils` | 텍스트 크기 측정, 박스에 맞추기 |
| `@remotion/animation-utils` | transform 조합 유틸 |
| `@remotion/media`, `@remotion/media-utils`, `@remotion/gif` | 영상, 오디오, GIF 삽입과 오디오 시각화 |

- 폰트는 `public/fonts`에 두고 `@remotion/fonts`로 불러온다 (현재 Black Han Sans, Noto Sans KR, 모두 OFL 라이선스).
- 이미지 생성, 배경 제거, 스톡 에셋은 연결된 Adobe 커넥터를 써서 `public/`에 저장한 뒤 영상에 넣는다.

## 클라우드 환경 참고

- Remotion이 자체 브라우저를 내려받지 못하므로(remotion.media 차단) 설치된 headless shell을 지정한다:
  `npx remotion render <컴포지션ID> out/<파일>.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
- 이 브라우저는 Chrome 141이다. HTML-in-Canvas가 필요한 전환(`blurSlide`, `crossZoom`, `dreamyZoom`, `filmBurn`, `linearBlur` 등)은 Chrome 149 이상이 필요해서 여기서는 렌더되지 않는다. 사용자 PC처럼 Remotion이 최신 브라우저를 받을 수 있는 환경에서는 쓸 수 있다.
- 이 환경의 headless 브라우저는 Google Fonts CDN에 접속하지 못하므로 `@remotion/google-fonts` 대신 로컬 폰트를 쓴다.
