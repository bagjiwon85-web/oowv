from carousel_research.columns import build_plan, match_field
from carousel_research.instagram import clean_username, shortcode, username_from_url
from carousel_research.metrics import caption_features, compute, to_int, viral_index


def test_match_field_exact_and_units():
    assert match_field("게시물 링크") == "url"
    assert match_field("좋아요 수(개)") == "likes"
    assert match_field("총 댓글수") == "comments"
    assert match_field("팔로워 수") == "followers"
    assert match_field("참여율(%)") == "engagement_rate"
    assert match_field("업로드 시간 (KST)") == "hour"


def test_analysis_columns_are_not_misread_as_metrics():
    # 부분 일치로 수치 열에 잡히면 안 되는 분석 열들
    for h in ["슬라이드 구성", "후킹 유형", "1장 후킹 문구", "바이럴 요인", "CTA", "디자인 특징"]:
        assert match_field(h) is None, h


def test_build_plan():
    headers = ["No", "게시물 링크", "계정", "좋아요", "댓글", "주제", "후킹 문구", "메모", ""]
    plan = build_plan(headers, overrides={"주제": "skip"})
    assert plan.col("url") == 1 and plan.col("likes") == 3
    assert plan.ai_cols == [6]
    assert set(plan.skip_cols) == {0, 5, 7}


def test_numbers_and_ratios():
    assert to_int("1,234") == 1234
    assert to_int("1.2만") == 12000
    assert to_int("3.5k") == 3500
    assert to_int("") is None
    assert viral_index(300, [100, 100, 100, 200]) == 3.0
    assert viral_index(300, [100]) is None  # 기준선이 너무 적으면 계산 안 함

    out = compute(
        {"likes": "900", "comments": "100", "followers": "10,000", "posted_at": "2026-09-01T12:30:00+0000",
         "caption": "\n저장해두세요\n#캐러셀 #마케팅"},
        baseline=[200, 250, 300],
        tz="Asia/Seoul",
    )
    assert out["engagement"] == 1000
    assert out["engagement_rate"] == 10.0
    assert out["viral_index"] == 4.0
    assert out["weekday"] == "화" and out["hour"] == "21시"
    assert out["caption_first_line"] == "저장해두세요"
    assert out["hashtag_count"] == 2


def test_caption_features_empty():
    assert caption_features("")["hashtag_count"] == 0


def test_instagram_url_helpers():
    assert shortcode("https://www.instagram.com/p/C1a2B3c4/?img_index=1") == "C1a2B3c4"
    assert shortcode("https://www.instagram.com/someone/p/XYZ_123/") == "XYZ_123"
    assert username_from_url("https://www.instagram.com/someone/p/XYZ_123/") == "someone"
    assert username_from_url("https://www.instagram.com/p/XYZ_123/") is None
    assert clean_username("@brand.kr") == "brand.kr"
    assert clean_username("https://instagram.com/brand.kr/") == "brand.kr"
