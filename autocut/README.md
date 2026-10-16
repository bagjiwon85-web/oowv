# autocut — Premiere Pro 자동 컷 편집 XML

영상에서 아래 구간을 잘라낸 시퀀스를 **Premiere Pro에서 불러올 수 있는 XML**(Final Cut Pro 7 XML)로 만듭니다.

| 규칙 | 방법 |
|---|---|
| 0.5초 이상 무음 삭제 | ffmpeg `silencedetect` (-35dB 기준) |
| 같은 말 반복 → 마지막 테이크만 | Whisper 단어 타임스탬프 → 구(phrase) 단위로 묶고, 뒤에 나오는 구와 유사도 0.75 이상(또는 끊긴 시도가 뒤 문장의 앞부분과 일치)이면 앞 테이크 삭제 |
| "음", "어" 필러 삭제 | 단어 전체가 `음/으음/어/어어/에/흠/엄/um/uh…` 인 경우 |
| 컷 앞뒤 0.1초 여유 | 남는 구간을 무음 쪽으로 0.1초씩 늘림 (삭제된 필러 안으로는 들어가지 않음) |

## 설치
```bash
# ffmpeg (macOS: brew install ffmpeg / Windows: winget install ffmpeg)
pip install -r autocut/requirements.txt
```
처음 실행할 때 Whisper 모델(기본 `large-v3-turbo`, 약 1.6GB)을 huggingface.co 에서 받습니다.

## 사용법
```bash
python3 autocut/autocut.py 원본.mp4 --media-path "D:/촬영/원본.mp4" --preview 미리보기.mp4
```
결과물
- `원본_autocut.xml` — Premiere: **파일 > 가져오기** → 시퀀스가 생깁니다.
  미디어가 오프라인이면 **미디어 연결**로 원본 파일을 지정하세요. `--media-path` 에 Premiere PC 기준 경로를 주면 바로 연결됩니다.
- `원본_autocut_cuts.csv` — 남긴/자른 구간과 사유(silence / filler / retake) 목록
- `원본_autocut_words.json` — 음성인식 결과. 수정 후 `--transcript` 로 다시 쓰면 인식을 건너뜁니다.
- `--preview` 지정 시 컷 결과 mp4

## 조정 옵션
| 옵션 | 기본값 | 설명 |
|---|---|---|
| `--min-silence` | 0.5 | 삭제할 최소 무음 길이(초) |
| `--silence-db` | -35 | 무음 판정 dB. 배경 소음이 크면 -30 쪽으로 |
| `--pad` | 0.1 | 컷 앞뒤 여유(초) |
| `--retake-threshold` | 0.75 | 반복 판정 유사도. 오탐이 많으면 올리고, 놓치면 내리기 |
| `--model` | large-v3-turbo | 느리면 `small`/`medium` |
| `--fillers` | (정규식) | 필러 목록 직접 지정 |
| `--no-fillers` / `--no-retakes` / `--no-transcribe` | | 각 기능 끄기 |

## 주의
- Whisper는 필러를 생략하고 받아적는 경향이 있어, 필러가 섞인 프롬프트로 이를 줄였지만 일부는 놓칠 수 있습니다. 놓친 필러가 0.5초 이상 무음 사이에 있으면 무음 컷으로 함께 정리되지 않으니 CSV/미리보기로 확인하세요.
- 반복 판정은 글자 유사도 기반이라 의도적인 반복(후렴, 강조)도 지울 수 있습니다. `_cuts.csv` 의 `RETAKE` 줄에서 확인하세요.
