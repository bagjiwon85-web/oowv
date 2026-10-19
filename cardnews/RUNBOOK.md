# 카드뉴스 일일 제작 절차

매일 오전 조사 작업이 시트에 20개를 추가하면, 그 20개 영상으로 영상별 카드뉴스를 만들어
구글 드라이브 `카드뉴스` 폴더(1VfBuDOcJhl5Caeh4fNwjcLZ33GzLlnZK)에 올린다.

- 시트: 1mCkwHZQtKVXJHuCsY5OGoYx7K9bNVD0rsbNbOgwFvOg, 탭 `유튜브 롱폼 조사`
  (A 조사일, B 구분, C 분야, D 제목, E 채널, N 선정 이유, O 좋아요순 댓글 1위, P 댓글 좋아요,
  Q 강의 연결 키워드, S 영상 ID)
- 계정명: @mindgrow.kr / 인스타 피드 4:5 (1080x1350) / 영상당 10장 이내

## 준비

```
pip install -q playwright pillow "opencv-python-headless<5"
```
필요 환경변수: YOUTUBE_API_KEY, PEXELS_API_KEY, CARDNEWS_UPLOAD_URL, CARDNEWS_UPLOAD_TOKEN

## 절차

1. 시트 A:S를 읽어 A열이 오늘 날짜(KST)인 행을 모은다. 20개가 아니면 조사 작업이 아직 끝나지 않은 것:
   10분 뒤 다시 확인하도록 send_later로 예약하고 종료(최대 6번).
2. 이미 만든 영상은 건너뛴다: `cardnews/specs/*.json`에 있는 id는 제외.
3. 오늘 ID를 `cardnews/data/ids.txt`에 `날짜 ID ID ...` 한 줄로 추가하고
   `python3 cardnews/fetch.py --ids-file cardnews/data/ids.txt` (제목·채널·설명 저장)
4. 영상마다 카드 문구를 써서 `cardnews/specs/<날짜>_1.json`(국내), `<날짜>_2.json`(해외)에 저장.
   기존 스펙 파일과 같은 형식:
   - `{"id", "date", "series"(분야), "photo_query": [영문 검색어 2개], "cards": [...]}`
   - 카드 구성(8~9장, 최대 10장): cover → text(문제 제기) → point 3~4개 → stat/quote 1개 → check → end
   - cover: `kicker`(누가/어떤 영상), `head`(후킹 문구, 3줄 이내), `who`(채널 「영상 제목」)
   - 강조는 `*노란색*`, 줄바꿈은 `\n`. 한 줄은 16자 안팎, lead 4줄·body 5줄 이내
   - quote는 시트 O열(좋아요순 댓글 1위)이 의미 있을 때만 쓰고 `by`에 좋아요 수
   - 영상에 없는 사실·수치·인용을 지어내지 않는다. 시트 N/O/Q열과 설명란에 있는 내용,
     널리 알려진 책·인물의 핵심 개념만 쓰고, 나머지는 일반적인 교훈으로 쓴다
   - end: 마무리 한 줄 + "저장해 두고 … *@mindgrow.kr*". 투자·수익 관련은 면책 한 줄
   - 원고 연결 포인트(R열)와 비즈니스PT 홍보 문구는 카드에 넣지 않는다
5. 표지 사진: `python3 cardnews/photos.py cardnews/specs/<날짜>_*.json`
   (Pexels에서 주제 관련 세로 사진. 유튜브 썸네일·화면은 쓰지 않는다)
6. 렌더링: `python3 cardnews/render.py cardnews/specs/<날짜>_*.json --out out/<날짜>`
   "넘침" 경고가 나오면 그 카드 문구를 줄여 다시 렌더링.
   표지 몇 장을 직접 열어 사진과 글자가 잘 읽히는지 확인.
7. 업로드: `python3 cardnews/upload.py out/<날짜>` → 영상별 `[날짜] 영상 제목` 폴더에 01~NN.png
8. specs, ids.txt, data/videos, data/photos/used.json을 커밋하고 브랜치에 푸시.
9. 한두 줄 보고: 만든 영상 수, 드라이브 폴더 링크, 문제 있던 영상.
