"""영상 정보(제목, 채널, 설명)와 썸네일을 받아 카드 문구 작성용 자료로 저장.

사용법:
  python3 cardnews/fetch.py VIDEO_ID [VIDEO_ID ...]
  python3 cardnews/fetch.py --ids-file cardnews/data/ids.txt   # "날짜 ID ID ..." 줄 형식

결과: cardnews/data/videos/<ID>.json, cardnews/data/thumbs/<ID>.jpg
YOUTUBE_API_KEY 환경변수 필요.
"""
import argparse
import json
import os
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
KEY = os.environ["YOUTUBE_API_KEY"]


def api(endpoint, **params):
    params["key"] = KEY
    url = "https://www.googleapis.com/youtube/v3/" + endpoint + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)


def download(url, path):
    with urllib.request.urlopen(url, timeout=30) as r, open(path, "wb") as f:
        f.write(r.read())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--ids-file")
    a = ap.parse_args()
    dates = {}
    ids = list(a.ids)
    if a.ids_file:
        for line in open(a.ids_file, encoding="utf-8"):
            parts = line.split()
            for vid in parts[1:]:
                dates[vid] = parts[0]
                ids.append(vid)
    os.makedirs(os.path.join(DATA, "videos"), exist_ok=True)
    os.makedirs(os.path.join(DATA, "thumbs"), exist_ok=True)
    for i in range(0, len(ids), 50):
        batch = ids[i:i + 50]
        res = api("videos", part="snippet,statistics", id=",".join(batch))
        for it in res.get("items", []):
            vid = it["id"]
            sn = it["snippet"]
            thumbs = sn.get("thumbnails", {})
            best = next((thumbs[k] for k in ("maxres", "standard", "high", "medium", "default")
                         if k in thumbs), None)
            thumb_path = os.path.join(DATA, "thumbs", f"{vid}.jpg")
            if best and not os.path.exists(thumb_path):
                try:
                    download(best["url"], thumb_path)
                except Exception as e:  # 썸네일이 없어도 글자 표지로 진행
                    print(f"{vid}: 썸네일 실패 {e}")
            # 영상 중간 장면(자동 생성 프레임 1~3): 썸네일 글자가 없는 깨끗한 사진 후보
            for n in (1, 2, 3):
                fp = os.path.join(DATA, "thumbs", f"{vid}_f{n}.jpg")
                if os.path.exists(fp):
                    continue
                for k in ("maxres", "sd"):
                    try:
                        download(f"https://i.ytimg.com/vi/{vid}/{k}{n}.jpg", fp)
                        break
                    except Exception:
                        pass
            info = {
                "id": vid,
                "date": dates.get(vid, ""),
                "title": sn["title"],
                "channel": sn["channelTitle"],
                "published": sn["publishedAt"][:10],
                "description": sn.get("description", "")[:2500],
                "tags": sn.get("tags", [])[:15],
                "views": it.get("statistics", {}).get("viewCount"),
                "likes": it.get("statistics", {}).get("likeCount"),
                "thumb": f"thumbs/{vid}.jpg" if os.path.exists(thumb_path) else None,
            }
            with open(os.path.join(DATA, "videos", f"{vid}.json"), "w", encoding="utf-8") as f:
                json.dump(info, f, ensure_ascii=False, indent=1)
            print(vid, info["thumb"] or "-", info["title"][:40])


if __name__ == "__main__":
    main()
