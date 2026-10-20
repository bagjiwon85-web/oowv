"""유튜브 롱폼 영상 조사 스크립트.

선정 조건 (사용자 요청):
- 쇼츠 제외 (4분 이상 롱폼만), 좋아요 1,000개 이상, 업로드 기간 제한 없음
- SNS, 브랜딩, 돈, 자기계발, 사업, 마케팅, 부자, 성공(성공한 사람 이야기·성공 습관·성공 방법·자수성가) 분야
- 계정 검증: 구독자 3만 이상 또는 (3만 미만이면 영상 조회수가 구독자의 5배 이상)
  관련 분야 영상 9개 확인 -> 저반응(좋아요 1,000 이하, 좋아요 숨김이면 댓글 50 이하) 3개 이상이면 통과
  통과한 계정에서 가장 성과가 좋은 영상 채택
- 시트에 이미 있는 영상(ID)은 제외, 한 번에 같은 계정은 최대 2개 (기본 1개)

사용법:
  python3 yt_research.py candidates --existing existing_ids.txt --out cand.json
  python3 yt_research.py comment VIDEO_ID
"""
import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request

KEY = os.environ["YOUTUBE_API_KEY"]
API = "https://www.googleapis.com/youtube/v3/"

KR_QUERIES = [
    "마케팅 강의", "퍼스널 브랜딩", "부자 되는 법", "돈 버는 습관", "자기계발 동기부여",
    "사업 성공 노하우", "인스타그램 마케팅", "유튜브 성장 전략", "창업 조언", "재테크 마인드",
    "세일즈 비법", "브랜드 만드는 법",
    "성공한 사람 이야기", "성공 습관", "성공하는 방법", "자수성가",
]
# 매일 후보가 겹치지 않도록 바꿔 쓰는 추가 검색어 세트 (--queryset 2)
KR_QUERIES2 = [
    "창업 성공 스토리", "자수성가 부자 인터뷰", "퍼스널브랜딩 강의", "마케팅 전략 사례",
    "부자 마인드셋", "돈 관리 방법", "1인 기업 성공", "인스타그램 성장 방법",
    "브랜드 스토리", "영업 잘하는 법", "성공한 CEO 인터뷰", "습관 바꾸는 법",
]
EN_QUERIES2 = [
    "founder story how I built", "self made billionaire interview", "personal brand strategy",
    "marketing lessons", "millionaire habits", "personal finance tips", "solopreneur business",
    "instagram growth", "brand story", "how to sell anything", "CEO interview success",
    "build better habits",
]
EN_QUERIES = [
    "marketing strategy", "personal branding", "how to get rich", "money habits",
    "self improvement", "how to start a business", "social media growth strategy",
    "sales psychology", "entrepreneur advice", "wealth mindset", "brand building",
    "copywriting tips",
    "success story self made", "habits of successful people", "how to be successful",
    "self made millionaire story",
]

FIELD_WORDS = re.compile(
    r"마케팅|브랜딩|브랜드|부자|돈|재테크|투자|자기계발|성공|사업|창업|장사|매출|세일즈|판매|"
    r"인스타|유튜브|SNS|콘텐츠|습관|부의|경제|월급|수익|자수성가|성공담|"
    r"market|brand|rich|money|wealth|millionaire|self|habit|business|entrepreneur|"
    r"startup|sales|sell|social media|instagram|youtube|content|income|invest|success|"
    r"productiv|copywrit|growth|founder|ceo|financ|self.made|success story",
    re.I,
)
# 자체 캠페인/자사 홍보로 보이는 영상 제외
PROMO_WORDS = re.compile(
    r"모집|수강생|신청|오픈 ?안내|출시|론칭|런칭|할인|이벤트|공지|광고문의|"
    r"enroll|sign up|launch|announcing|webinar|masterclass is open|discount|sale\b|giveaway",
    re.I,
)


def get(endpoint, **params):
    params["key"] = KEY
    url = API + endpoint + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)


def iso_dur(s):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", s or "")
    if not m:
        return 0
    d, h, mi, se = (int(x or 0) for x in m.groups())
    return d * 86400 + h * 3600 + mi * 60 + se


def videos(ids):
    out = {}
    for i in range(0, len(ids), 50):
        r = get("videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]))
        for it in r.get("items", []):
            st = it.get("statistics", {})
            out[it["id"]] = {
                "id": it["id"],
                "title": it["snippet"]["title"],
                "desc": it["snippet"].get("description", "")[:600],
                "channelId": it["snippet"]["channelId"],
                "channel": it["snippet"]["channelTitle"],
                "published": it["snippet"]["publishedAt"][:10],
                "lang": it["snippet"].get("defaultAudioLanguage") or it["snippet"].get("defaultLanguage") or "",
                "sec": iso_dur(it["contentDetails"].get("duration")),
                "views": int(st.get("viewCount", 0)),
                "likes": int(st["likeCount"]) if "likeCount" in st else None,
                "comments": int(st["commentCount"]) if "commentCount" in st else None,
            }
    return out


def channels(ids):
    out = {}
    for i in range(0, len(ids), 50):
        r = get("channels", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]))
        for it in r.get("items", []):
            out[it["id"]] = {
                "subs": int(it["statistics"].get("subscriberCount", 0)),
                "hidden_subs": it["statistics"].get("hiddenSubscriberCount", False),
                "country": it["snippet"].get("country", ""),
                "uploads": it["contentDetails"]["relatedPlaylists"]["uploads"],
            }
    return out


def is_korean(text):
    return len(re.findall(r"[가-힣]", text)) >= 3


def is_low(v):
    if v["likes"] is not None:
        return v["likes"] <= 1000
    return (v["comments"] or 0) <= 50


def channel_check(ch, cand_ids, existing):
    """관련 분야 롱폼 9개를 확인해 저반응 수를 센다."""
    ids, token = [], None
    for _ in range(3):  # 최근 업로드 최대 150개
        kw = dict(part="contentDetails", playlistId=ch["uploads"], maxResults=50)
        if token:
            kw["pageToken"] = token
        try:
            r = get("playlistItems", **kw)
        except Exception:
            break
        ids += [it["contentDetails"]["videoId"] for it in r.get("items", [])]
        token = r.get("nextPageToken")
        if not token:
            break
    vs = videos(ids)
    related = [v for v in (vs.get(i) for i in ids) if v and v["sec"] >= 240
               and FIELD_WORDS.search(v["title"] + " " + v["desc"][:200])]
    checked = related[:9]
    low = sum(is_low(v) for v in checked)
    pool = {v["id"]: v for v in related}
    return checked, low, pool


def cmd_candidates(a):
    existing = set()
    if a.existing and os.path.exists(a.existing):
        existing = {l.strip() for l in open(a.existing) if l.strip()}
    found = {}
    if a.per_region:
        # 날짜별로 검색어 풀을 돌려 쓰며 국내/해외 각각 N개만 검색 (검색량 절약)
        import datetime
        day = datetime.date.today().toordinal() + a.shift
        kpool, epool = KR_QUERIES + KR_QUERIES2, EN_QUERIES + EN_QUERIES2
        n = a.per_region
        kq = [kpool[(day * n + i) % len(kpool)] for i in range(n)]
        eq = [epool[(day * n + i) % len(epool)] for i in range(n)]
        if a.order == "auto":
            a.order = ("relevance", "viewCount", "rating")[day % 3]
        print("queries:", kq, eq, "order:", a.order, file=sys.stderr)
    else:
        kq, eq = (KR_QUERIES2, EN_QUERIES2) if a.queryset == 2 else (KR_QUERIES, EN_QUERIES)
    if a.order == "auto":
        a.order = "relevance"
    for region, qs in (("KR", kq), ("GLOBAL", eq)):
        for q in qs:
            for dur in ("medium", "long"):
                kw = dict(part="id", q=q, type="video", videoDuration=dur, maxResults=25,
                          order=a.order)
                if region == "KR":
                    kw.update(relevanceLanguage="ko", regionCode="KR")
                else:
                    kw.update(relevanceLanguage="en", regionCode="US")
                try:
                    r = get("search", **kw)
                except Exception as e:
                    print("search fail", q, e, file=sys.stderr)
                    continue
                for it in r.get("items", []):
                    found.setdefault(it["id"]["videoId"], (region, q))
    vs = videos(list(found))
    cands = []
    for vid, v in vs.items():
        region, q = found[vid]
        if vid in existing or v["sec"] < 240 or (v["likes"] or 0) < 1000:
            continue
        if PROMO_WORDS.search(v["title"]):
            continue
        kr = is_korean(v["title"])
        if (region == "KR") != kr:
            continue
        v["region"], v["query"] = ("국내" if kr else "해외"), q
        cands.append(v)
    if a.exclude_channels and os.path.exists(a.exclude_channels):
        skip = {l.strip() for l in open(a.exclude_channels) if l.strip()}
        cands = [v for v in cands if v["channel"].strip() not in skip]
    chs = channels(list({v["channelId"] for v in cands}))
    by_ch = {}
    for v in cands:
        by_ch.setdefault(v["channelId"], []).append(v)
    results = []
    for cid, vlist in by_ch.items():
        ch = chs.get(cid)
        if not ch:
            continue
        best_hit = max(vlist, key=lambda v: v["likes"] or 0)
        if ch["subs"] < 30000 and best_hit["views"] < ch["subs"] * 5:
            continue
        checked, low, pool = channel_check(ch, [v["id"] for v in vlist], existing)
        if len(checked) < 9 or low < 3:
            continue
        for v in vlist:
            pool.setdefault(v["id"], v)
        picks = sorted((v for v in pool.values() if v["id"] not in existing and v["sec"] >= 240
                        and (v["likes"] or 0) >= 1000 and not PROMO_WORDS.search(v["title"])
                        and is_korean(v["title"]) == (vlist[0]["region"] == "국내")
                        and (ch["subs"] >= 30000 or v["views"] >= ch["subs"] * 5)),
                       key=lambda v: v["likes"], reverse=True)
        if not picks:
            continue
        results.append({
            "channelId": cid, "channel": vlist[0]["channel"], "region": vlist[0]["region"],
            "subs": ch["subs"], "low": low, "checked": len(checked),
            "checked_titles": [(c["title"][:40], c["likes"], c["comments"]) for c in checked],
            "picks": [dict(p, region=vlist[0]["region"]) for p in picks[:3]],
        })
        print(f"PASS {vlist[0]['region']} {vlist[0]['channel']} subs={ch['subs']} low={low}/9",
              file=sys.stderr)
    json.dump(results, open(a.out, "w"), ensure_ascii=False, indent=1)
    print(len(results), "channels passed", file=sys.stderr)


def cmd_comment(a):
    best = None
    try:
        r = get("commentThreads", part="snippet", videoId=a.video, order="relevance",
                maxResults=100, textFormat="plainText")
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        return
    for it in r.get("items", []):
        s = it["snippet"]["topLevelComment"]["snippet"]
        if best is None or s["likeCount"] > best["likes"]:
            best = {"text": s["textDisplay"], "likes": s["likeCount"], "author": s["authorDisplayName"]}
    print(json.dumps(best, ensure_ascii=False))


def cmd_brief(a):
    """후보를 짧게 출력 (선정용)."""
    r = json.load(open(a.cand))
    for reg in ("국내", "해외"):
        rs = sorted((x for x in r if x["region"] == reg), key=lambda x: -x["picks"][0]["likes"])
        print("==", reg, len(rs))
        for x in rs[:a.top]:
            p = x["picks"][0]
            print(f"{x['channel'].strip()[:18]} | s={x['subs']} low={x['low']} | {p['likes']} {p['views']} "
                  f"{p['sec']//60}m {p['published'][:4]} | {p['id']} | {p['title'][:50]}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    sp = p.add_subparsers(dest="cmd", required=True)
    c = sp.add_parser("candidates")
    c.add_argument("--existing")
    c.add_argument("--out", default="cand.json")
    c.add_argument("--order", default="relevance")
    c.add_argument("--queryset", type=int, default=1)
    c.add_argument("--per-region", type=int, default=0,
                   help="국내/해외 각각 검색어 N개만 사용 (날짜별 순환)")
    c.add_argument("--shift", type=int, default=0, help="후보가 모자랄 때 다른 검색어 묶음 사용(1,2..)")
    c.add_argument("--exclude-channels", help="시트 E열 채널명 목록 파일 (이미 쓴 채널 제외)")
    c.set_defaults(f=cmd_candidates)
    b = sp.add_parser("brief")
    b.add_argument("cand")
    b.add_argument("--top", type=int, default=25)
    b.set_defaults(f=cmd_brief)
    m = sp.add_parser("comment")
    m.add_argument("video")
    m.set_defaults(f=cmd_comment)
    a = p.parse_args()
    a.f(a)
