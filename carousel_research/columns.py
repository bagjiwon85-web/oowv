"""시트 헤더(양식)를 내부 필드로 매핑한다.

양식의 열 이름이 무엇이든 동작하도록, 알려진 열(수치/메타데이터)은 별칭으로 매칭하고
나머지 빈 열은 "Claude가 헤더 이름을 보고 채우는 분석 열"로 취급한다.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

# 내부 필드 -> 헤더 별칭 (정규화 후 비교)
FIELD_ALIASES: dict[str, list[str]] = {
    # 입력 / 기본 정보
    "url": ["url", "링크", "게시물링크", "게시글링크", "포스트링크", "게시물url", "permalink", "주소"],
    "account": ["계정", "계정명", "아이디", "인스타아이디", "username", "account", "핸들", "채널", "크리에이터"],
    "followers": ["팔로워", "팔로워수", "followers", "follower"],
    "posted_at": ["업로드일", "게시일", "업로드날짜", "게시날짜", "날짜", "date", "작성일", "업로드일자", "게시일자"],
    "weekday": ["요일", "업로드요일", "게시요일"],
    "hour": ["업로드시간", "게시시간", "시간대", "업로드시각", "시간"],
    "media_type": ["유형", "게시물유형", "포맷", "mediatype"],
    "slide_count": ["장수", "슬라이드수", "슬라이드", "이미지수", "캐러셀장수", "페이지수", "카드수", "총장수"],
    # 반응 지표
    "likes": ["좋아요", "좋아요수", "likes", "like"],
    "comments": ["댓글", "댓글수", "comments", "comment"],
    "saves": ["저장", "저장수", "saves", "save"],
    "shares": ["공유", "공유수", "shares", "share"],
    "engagement": ["총반응", "총반응수", "반응수", "인게이지먼트수", "engagement"],
    "engagement_rate": ["참여율", "인게이지먼트율", "반응률", "er", "engagementrate"],
    "like_follower_ratio": ["좋아요팔로워비율", "팔로워대비좋아요", "좋아요비율"],
    "comment_like_ratio": ["댓글좋아요비율", "좋아요대비댓글", "댓글비율"],
    "viral_index": ["바이럴지수", "바이럴점수", "아웃라이어", "아웃라이어배수", "평균대비", "평균대비배수", "평균대비성과", "outlier", "viralindex"],
    "account_median_engagement": ["계정평균반응", "계정중앙값", "평균반응", "계정평균"],
    # 캡션
    "caption": ["캡션", "캡션전문", "본문", "caption", "캡션내용"],
    "caption_first_line": ["캡션첫줄", "캡션도입", "캡션첫문장", "첫줄"],
    "caption_length": ["캡션길이", "글자수", "캡션글자수"],
    "hashtags": ["해시태그", "hashtags", "태그"],
    "hashtag_count": ["해시태그수", "해시태그개수", "태그수"],
    "collected_at": ["수집일", "수집일자", "분석일", "조사일"],
}

# 사람이 직접 쓰는 열: Claude가 건드리지 않는다
DEFAULT_SKIP = ["메모", "비고", "담당자", "체크", "확인", "no", "번호", "순번", "#", "참고", "note", "memo"]


def normalize(text: str) -> str:
    text = re.sub(r"\(.*?\)|\[.*?\]", "", text or "")
    text = text.lower()
    return re.sub(r"[\s\-_/·.,:%?!'\"()\[\]]+", "", text)


_ALIAS_INDEX: dict[str, str] = {
    normalize(alias): name for name, aliases in FIELD_ALIASES.items() for alias in aliases
}


def match_field(header: str) -> str | None:
    """헤더 하나를 내부 필드명으로.

    부분 일치는 쓰지 않는다("슬라이드 구성"이 장수 열로 잡히는 식의 오매칭 방지).
    대신 "총", "개/명/건/회" 같은 접두·접미 단위만 떼고 다시 비교한다.
    """
    norm = normalize(header)
    candidates = [norm]
    if norm.startswith("총"):
        candidates.append(norm[1:])
    for c in list(candidates):
        if c[-1:] in ("개", "명", "건", "회"):
            candidates.append(c[:-1])
    for c in candidates:
        if c in _ALIAS_INDEX:
            return _ALIAS_INDEX[c]
    return None


@dataclass
class ColumnPlan:
    """양식 분석 결과: 어떤 열을 코드로 채우고, 어떤 열을 Claude가 채울지."""

    headers: list[str]
    field_cols: dict[str, int] = field(default_factory=dict)  # 내부필드 -> 열 index
    ai_cols: list[int] = field(default_factory=list)  # Claude가 채울 열 index
    skip_cols: list[int] = field(default_factory=list)

    def col(self, name: str) -> int | None:
        return self.field_cols.get(name)


def build_plan(
    headers: list[str],
    overrides: dict[str, str] | None = None,
    skip: list[str] | None = None,
) -> ColumnPlan:
    """overrides: {"헤더 이름": "내부필드" 또는 "ai" 또는 "skip"}"""
    overrides = {normalize(k): v for k, v in (overrides or {}).items()}
    skip_norm = {normalize(s) for s in (skip if skip is not None else DEFAULT_SKIP)}
    plan = ColumnPlan(headers=headers)
    for idx, header in enumerate(headers):
        norm = normalize(header)
        if not norm:
            continue
        target = overrides.get(norm)
        if target == "skip" or (target is None and norm in skip_norm):
            plan.skip_cols.append(idx)
            continue
        if target == "ai":
            plan.ai_cols.append(idx)
            continue
        name = target if target in FIELD_ALIASES else match_field(header)
        if name and name not in plan.field_cols:
            plan.field_cols[name] = idx
        else:
            plan.ai_cols.append(idx)
    return plan
