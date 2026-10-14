# oowv — 인스타그램 바이럴 캐러셀 리서치 자동 분석기

구글 시트의 **리서치 양식을 그대로** 읽어서, 각 행(게시물)의 빈 칸을 채워 주는 도구입니다.

- 열을 추가·삭제하거나 순서를 바꾸지 않습니다. **빈 칸만** 채웁니다(`--overwrite` 를 주면 다시 채움).
- 양식의 열 이름을 보고 두 종류로 나눕니다.
  - **수치/메타 열** (좋아요, 댓글, 팔로워, 참여율, 바이럴 지수, 요일, 업로드 시간, 장수, 해시태그 수 …) → 코드로 계산하거나 Instagram API로 수집
  - **그 밖의 열** (1장 후킹 문구, 후킹 유형, 슬라이드 구성, CTA, 디자인 특징, 바이럴 요인 …) → Claude가 **열 이름을 지시문으로 삼아** 슬라이드 이미지·캡션·지표를 보고 작성
- 양식에 "작성 가이드/예시" 행이 있으면(`--guide-row`) 그 내용을 열별 지시로 그대로 따릅니다.
- 이미 사람이 채워 둔 행이 있으면 그 행을 톤·형식 예시로 참고합니다.

## 1. 설치

```bash
pip install -r requirements.txt
cp .env.example .env   # 값을 채운 뒤
set -a; source .env; set +a
```

| 항목 | 필요 여부 | 설명 |
|---|---|---|
| `ANTHROPIC_API_KEY` | 분석 열을 채울 때 | Claude API 키 |
| `GOOGLE_APPLICATION_CREDENTIALS` | 구글 시트 직접 연결 시 | 서비스 계정 JSON 키 경로. **시트를 서비스 계정 이메일(`...@...iam.gserviceaccount.com`)에 편집자로 공유**해야 합니다. CSV 모드면 필요 없음 |
| `IG_USER_ID`, `IG_ACCESS_TOKEN` | 선택 | Instagram Graph API(Business Discovery). 내 비즈니스/크리에이터 계정 ID와 토큰. 있으면 좋아요·댓글·팔로워·캡션·슬라이드 이미지를 자동 수집 |

> Instagram API로는 남의 계정의 **저장·공유·도달 수는 받을 수 없습니다.** 해당 열은 직접 입력하면 참여율 계산에 반영됩니다.
> API가 없으면 시트에 적힌 값만으로 계산하고, Claude는 캡션·지표 기반으로 분석합니다(이미지 없이 판단한 항목은 "(캡션 기반)" 표시).

## 2. 사용법

```bash
SHEET="https://docs.google.com/spreadsheets/d/1AzUpClX8HSvZyG8JcSHNcqlEY019E_nvhIhy5Im3PYQ/edit"

# (1) 양식 매핑 확인 — 어떤 열을 계산하고, 어떤 열을 Claude가 쓰는지 출력
python -m carousel_research inspect --sheet "$SHEET"

# (2) 빈 칸 채우기 (링크 열에 게시물 URL만 넣어 두면 됨)
python -m carousel_research analyze --sheet "$SHEET"

# 미리보기만 (시트에 안 씀) / 특정 행만 / 지표만
python -m carousel_research analyze --sheet "$SHEET" --rows 3-10 --dry-run
python -m carousel_research analyze --sheet "$SHEET" --no-ai

# (3) 계정에서 '평소 대비 2배 이상 터진' 캐러셀을 찾아 행 추가 + 바로 분석 (IG API 필요)
python -m carousel_research collect --sheet "$SHEET" --accounts brand_a,brand_b --min-viral 2 --top 10 --analyze
```

구글 시트 연결 없이 쓰려면 시트를 CSV로 내려받아 `--sheet` 대신 `--csv 파일.csv --out 결과.csv` 를 쓰고, 결과 CSV를 다시 붙여 넣으면 됩니다.

### 자주 쓰는 옵션

| 옵션 | 설명 |
|---|---|
| `--worksheet 탭이름` | 분석할 탭 (기본: 첫 탭) |
| `--header-row N` | 열 이름이 있는 행 (기본 1) |
| `--guide-row N` | 열별 작성 가이드/예시가 적힌 행. 예: "질문형/숫자형/공감형 중 선택" |
| `--start-row N` | 데이터 시작 행 (기본: 헤더·가이드 다음 행) |
| `--map "열이름=필드"` | 자동 매핑이 틀릴 때 직접 지정. 필드는 아래 표, 또는 `ai`(Claude가 작성)·`skip`(건드리지 않음) |
| `--skip 열이름` | 채우지 않을 열 추가 (기본으로 메모·비고·담당자·No 등은 건너뜀) |
| `--effort low/medium/high` | Claude 분석 깊이 (기본 medium) |
| `--max-images N` | Claude에게 보낼 슬라이드 최대 장수 (기본 10) |

### 자동 인식되는 열 이름 (일부)

| 필드 | 인식하는 열 이름 예 |
|---|---|
| `url` | 링크, 게시물 링크, URL |
| `account` | 계정, 계정명, 아이디 |
| `followers` / `likes` / `comments` / `saves` / `shares` | 팔로워 수 / 좋아요 / 댓글 / 저장 / 공유 |
| `posted_at` / `weekday` / `hour` | 업로드일 / 요일 / 업로드 시간 |
| `slide_count` | 장수, 슬라이드 수, 이미지 수 |
| `engagement` / `engagement_rate` | 총반응 / 참여율(%) — (좋아요+댓글+저장+공유) ÷ 팔로워 × 100 |
| `viral_index` | 바이럴 지수, 평균 대비 배수, 아웃라이어 — 계정의 다른 게시물 반응 중앙값 대비 배수 |
| `caption` / `caption_first_line` / `hashtags` / `hashtag_count` | 캡션 / 캡션 첫줄 / 해시태그 / 해시태그 수 |

전체 목록은 `carousel_research/columns.py` 의 `FIELD_ALIASES` 에 있습니다. "(개)", "(%)" 같은 괄호 단위와 "총", "~수/개/명" 같은 표현은 무시하고 비교합니다.
위 표에 없는 열은 모두 Claude가 열 이름 그대로의 의미로 채웁니다.

## 3. 테스트

```bash
pip install pytest && python -m pytest -q
```
