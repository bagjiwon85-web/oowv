"""표지 사진: 스펙의 photo_query로 Pexels에서 주제 관련 세로 사진을 받아 data/photos/<id>.jpg로 저장.

Pexels 사진은 상업적 사용 가능, 출처 표기 의무 없음. 이미 쓴 사진은 다시 고르지 않는다
(data/photos/used.json). 유튜브 썸네일·화면은 표지에 쓰지 않는다.

사용법:
  python3 cardnews/photos.py cardnews/specs/2026-10-16.json [--force ID ...]
PEXELS_API_KEY 환경변수 필요.
"""
import argparse
import json
import os
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PHOTOS = os.path.join(HERE, "data", "photos")
USED = os.path.join(PHOTOS, "used.json")


def search(query, page=1):
    url = "https://api.pexels.com/v1/search?" + urllib.parse.urlencode(
        {"query": query, "orientation": "portrait", "per_page": 15, "page": page})
    req = urllib.request.Request(url, headers={"Authorization": os.environ["PEXELS_API_KEY"]})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r).get("photos", [])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("specs", nargs="+")
    ap.add_argument("--force", nargs="*", default=[], help="이 영상 ID는 사진을 새로 고름")
    a = ap.parse_args()
    os.makedirs(PHOTOS, exist_ok=True)
    used = json.load(open(USED)) if os.path.exists(USED) else {}
    taken = set(used.values())
    for path in a.specs:
        specs = json.load(open(path, encoding="utf-8"))
        for spec in specs if isinstance(specs, list) else [specs]:
            vid = spec["id"]
            dst = os.path.join(PHOTOS, f"{vid}.jpg")
            if os.path.exists(dst) and vid not in a.force:
                continue
            queries = spec.get("photo_query") or "success"
            queries = queries if isinstance(queries, list) else [queries]
            pick = None
            for q in queries + ["business success", "dark office"]:
                for page in (1, 2):
                    for ph in search(q, page):
                        if str(ph["id"]) not in taken:
                            pick = ph
                            break
                    if pick:
                        break
                if pick:
                    break
            if not pick:
                print(f"{vid}: 사진 없음")
                continue
            src = pick["src"].get("large2x") or pick["src"]["original"]
            with urllib.request.urlopen(src, timeout=60) as r, open(dst, "wb") as f:
                f.write(r.read())
            used[vid] = str(pick["id"])
            taken.add(str(pick["id"]))
            json.dump(used, open(USED, "w"), indent=1)
            print(vid, pick["id"], pick.get("alt", "")[:50])


if __name__ == "__main__":
    main()
