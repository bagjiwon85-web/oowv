# 무료 AI 영상 사이트 정리 (Hailuo · Vidu)

2026-10-27 기준, 쇼츠2 만들면서 직접 써 본 내용

## 바로가기

| 사이트 | 링크 |
|---|---|
| Hailuo AI | [hailuoai.video](https://hailuoai.video) |
| MiniMax (Hailuo 운영사) | [minimax.io](https://www.minimax.io) |
| Vidu | [vidu.com](https://www.vidu.com) |
| Kling | [kling.ai](https://kling.ai) |
| HuggingFace ZeroGPU | [ZeroGPU 문서](https://huggingface.co/docs/hub/spaces-zerogpu) · [huggingface.co](https://huggingface.co) |
| Wan 2.2 (로컬) | [github.com/Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2) |

## 1. [Hailuo AI](https://hailuoai.video)

* 운영사: [MiniMax](https://www.minimax.io). 한국어 화면 지원.
* 무료 플랜: 가입할 때 한 번 주는 체험 크레딧이 전부예요. 월마다 다시 차지 않아요(무료 플랜은 "월 0 크레딧").
* 비용: 텍스트→영상, MiniMax H3, 1:1 768p 4초 한 편에 28크레딧.
* 남은 크레딧: 10. 한 편에 28이 들어서 더는 못 만들어요. 무료로는 끝난 상태예요.
* 대기: 무료는 동시에 1개만 생성돼요. 대기열이 길면 6분 넘게 기다렸어요.
* 워터마크: 오른쪽 아래 "MINIMAX | Hailuo AI". 화면 아래쪽 약 10%를 잘라 가렸어요.
* 다운로드: 문제없이 받아졌어요.
* 유료: Standard 월 $8.40(연간 결제 기준), 월 1000크레딧.

## 2. [Vidu](https://www.vidu.com)

* 영어 화면.
* 크레딧 받는 법(사이트 안내 기준):
  1. 가입 보너스
  2. 매일 로그인 보상(하루에 몇 크레딧인지는 안내에 없어요)
  3. 이벤트·미션 보상
  4. 구독
* 남은 크레딧: 4.
* 무료 체험(모델별 1회, 0크레딧): Q3 텍스트→영상, Q4 이미지→영상, Q2 텍스트→영상. 셋 다 썼어요.
* 비용: Q2 텍스트→영상 1080p 5초 한 편에 8크레딧.
* 미션 보상: 받을 수 있는 보상이 총 65크레딧 남아 있어요. 그중 확인한 건 아래 두 개예요. 다만 미션을 하려면 영상을 만들어야 해서 크레딧이 먼저 들어가요.
  * Q2 이미지→영상 +10
  * Q2 레퍼런스→영상 +15
* 대기: 무료는 "High demand" 대기가 길어요. 한 편에 30분 넘게 걸린 것도 있어요.
* 워터마크: 오른쪽 아래 작은 "Vidu AI". Hailuo처럼 아래를 잘라 가렸어요.
* 다운로드 주의: 크롬이 [vidu.com](https://www.vidu.com)의 연속 다운로드를 막아요. 주소창 오른쪽 차단 아이콘에서 "항상 허용"으로 바꾸거나, 영상마다 ↓ → "With Watermark"를 직접 누르세요.
* 유료: Standard 월 $5.92(연간 결제 기준), 월 800크레딧.

## 3. 그 밖에 시도한 것

* [Kling](https://kling.ai): 웹에는 체험 크레딧 6이 보이는데, 명령줄 도구(CLI)에서는 0으로 나와서 못 썼어요.
* [HuggingFace ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu): 무료 사용량을 다 써서 막혔어요. 하루쯤 지나면 풀려요.
* 로컬 [Wan 2.2](https://github.com/Wan-Video/Wan2.2): 클립 하나에 약 10분이 걸리고 품질이 낮아서 그만뒀어요.

## 4. 요약

* 지금 무료로 더 만들 수 있는 곳은 [Vidu](https://www.vidu.com)뿐이에요(매일 로그인 크레딧). [Hailuo](https://hailuoai.video)는 새 계정이 아니면 끝났어요.
* 쇼츠 하나(장면 9개)를 만드는 데 Hailuo 체험 크레딧 전부, Vidu 무료 체험 3번, Vidu 크레딧 16을 썼어요.
* 그림체를 맞추려면 모든 프롬프트 앞에 같은 문구를 붙이세요: "2D flat animated illustration, cartoon style… navy hoodie man".

Vidu 매일 로그인 보상이 하루에 몇 크레딧인지는 사이트에 숫자가 없어서 확인하지 못했어요. 내일 로그인해서 늘어난 만큼 보시면 정확해요.
