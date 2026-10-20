# CLAUDE.md

## 모션그래픽 영상 제작 규칙

- 모션그래픽 영상은 **항상 Remotion으로만** 만든다.
- 영상을 만들거나 편집할 때 **ffmpeg CLI나 Python(moviepy, PIL, matplotlib 애니메이션 등)을 직접 쓰지 않는다.**
  - 단, Remotion이 렌더링할 때 내부적으로 쓰는 자체 인코더는 예외다. 이것은 Remotion의 일부다.
- 렌더링은 Remotion CLI(`npx remotion render`)나 `@remotion/renderer`로 한다.
- 사용자가 요청할 때 "Remotion으로"라고 말하지 않아도 이 규칙을 따른다.

## 환경 참고

- Remotion이 자체 브라우저를 내려받지 못하면, 설치된 Chromium(`/opt/pw-browsers` 아래)을
  `--browser-executable` 옵션이나 `Config.setBrowserExecutable()`로 지정해서 쓴다.
