"""수치 지표 계산 (Claude 없이 코드로 계산하는 열)."""

from __future__ import annotations

import re
import statistics
from datetime import datetime
from zoneinfo import ZoneInfo

WEEKDAYS_KO = ["월", "화", "수", "목", "금", "토", "일"]
HASHTAG_RE = re.compile(r"#[^\s#]+")


def to_int(value) -> int | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return int(value)
    s = str(value).strip().replace(",", "").lower()
    if not s:
        return None
    mult = 1
    for suffix, m in (("만", 10_000), ("천", 1_000), ("k", 1_000), ("m", 1_000_000)):
        if s.endswith(suffix):
            s, mult = s[: -len(suffix)], m
            break
    try:
        return int(float(s) * mult)
    except ValueError:
        return None


def engagement(likes, comments, saves=None, shares=None) -> int | None:
    parts = [to_int(x) for x in (likes, comments, saves, shares)]
    if parts[0] is None and parts[1] is None:
        return None
    return sum(p for p in parts if p is not None)


def ratio(numer, denom, pct: bool = True, digits: int = 2) -> float | None:
    n, d = to_int(numer), to_int(denom)
    if n is None or not d:
        return None
    return round(n / d * (100 if pct else 1), digits)


def viral_index(post_engagement, baseline: list[int]) -> float | None:
    """계정 평소 반응(중앙값) 대비 몇 배인지. 아웃라이어 판단용."""
    baseline = [b for b in baseline if b]
    if post_engagement is None or len(baseline) < 3:
        return None
    med = statistics.median(baseline)
    return round(post_engagement / med, 2) if med else None


def parse_time(ts: str, tz: str) -> datetime | None:
    if not ts:
        return None
    ts = ts.strip()
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00").replace("+0000", "+00:00"))
    except ValueError:
        for fmt in ("%Y.%m.%d", "%Y. %m. %d", "%Y/%m/%d", "%Y-%m-%d %H:%M"):
            try:
                dt = datetime.strptime(ts, fmt)
                break
            except ValueError:
                continue
        else:
            return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=ZoneInfo(tz))
    return dt.astimezone(ZoneInfo(tz))


def caption_features(caption: str) -> dict:
    caption = caption or ""
    tags = HASHTAG_RE.findall(caption)
    first = next((ln.strip() for ln in caption.splitlines() if ln.strip()), "")
    return {
        "caption_first_line": first,
        "caption_length": len(caption),
        "hashtags": " ".join(tags),
        "hashtag_count": len(tags),
    }


def compute(row: dict, baseline: list[int] | None, tz: str) -> dict:
    """row: 내부필드 -> 값(시트 값 또는 API 값). 계산 가능한 필드를 반환."""
    out: dict = {}
    eng = engagement(row.get("likes"), row.get("comments"), row.get("saves"), row.get("shares"))
    if eng is not None:
        out["engagement"] = eng
        out["engagement_rate"] = ratio(eng, row.get("followers"))
        # 기준선(계정의 다른 게시물)은 좋아요+댓글뿐이므로 같은 기준으로 비교한다
        out["viral_index"] = viral_index(engagement(row.get("likes"), row.get("comments")), baseline or [])
        if baseline and len([b for b in baseline if b]) >= 3:
            out["account_median_engagement"] = int(statistics.median([b for b in baseline if b]))
    out["like_follower_ratio"] = ratio(row.get("likes"), row.get("followers"))
    out["comment_like_ratio"] = ratio(row.get("comments"), row.get("likes"))
    dt = parse_time(str(row.get("posted_at") or ""), tz)
    if dt:
        out["weekday"] = WEEKDAYS_KO[dt.weekday()]
        if dt.hour or dt.minute:
            out["hour"] = f"{dt.hour:02d}시"
    if row.get("caption"):
        out.update(caption_features(row["caption"]))
    return {k: v for k, v in out.items() if v is not None and v != ""}
