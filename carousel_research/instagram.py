"""Instagram Graph API - Business Discovery로 다른 비즈니스/크리에이터 계정의 공개 게시물 조회.

필요한 것: 내 Instagram 비즈니스(또는 크리에이터) 계정 ID + 그 계정에 연결된 액세스 토큰.
조회 가능한 것: 팔로워 수, 게시물(캡션/유형/타임스탬프/좋아요/댓글/캐러셀 이미지).
저장·공유·도달 수는 남의 계정이라 API로 받을 수 없다(시트에 직접 입력하면 계산에 반영).
좋아요를 숨긴 게시물은 like_count가 비어 있다.
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field

import requests

MEDIA_FIELDS = (
    "id,caption,media_type,media_product_type,media_url,permalink,timestamp,"
    "like_count,comments_count,children{media_type,media_url}"
)


@dataclass
class Post:
    permalink: str
    account: str
    followers: int | None
    caption: str
    media_type: str
    timestamp: str
    likes: int | None
    comments: int | None
    image_urls: list[str] = field(default_factory=list)
    slide_count: int = 1

    @property
    def is_carousel(self) -> bool:
        return self.media_type == "CAROUSEL_ALBUM"


@dataclass
class AccountData:
    username: str
    followers: int | None
    posts: list[Post]
    complete: bool = False  # 계정의 게시물을 끝까지 받았는지


class InstagramClient:
    def __init__(self, ig_user_id: str | None = None, token: str | None = None, version: str | None = None):
        self.ig_user_id = ig_user_id or os.environ.get("IG_USER_ID")
        self.token = token or os.environ.get("IG_ACCESS_TOKEN")
        self.version = version or os.environ.get("IG_GRAPH_VERSION", "v23.0")
        self._cache: dict[str, AccountData] = {}

    @property
    def enabled(self) -> bool:
        return bool(self.ig_user_id and self.token)

    def account(self, username: str, max_posts: int = 50) -> AccountData:
        username = clean_username(username)
        cached = self._cache.get(username)
        if cached and (cached.complete or len(cached.posts) >= max_posts):
            return cached
        posts: list[Post] = []
        followers = None
        after = None
        complete = False
        while len(posts) < max_posts:
            limit = min(50, max_posts - len(posts))
            media = f"media.limit({limit})" + (f".after({after})" if after else "")
            resp = requests.get(
                f"https://graph.facebook.com/{self.version}/{self.ig_user_id}",
                params={
                    "fields": f"business_discovery.username({username}){{followers_count,{media}{{{MEDIA_FIELDS}}}}}",
                    "access_token": self.token,
                },
                timeout=30,
            )
            data = resp.json()
            if "error" in data:
                raise RuntimeError(f"@{username}: {data['error'].get('message')}")
            bd = data["business_discovery"]
            followers = bd.get("followers_count")
            page = bd.get("media", {})
            for m in page.get("data", []):
                children = (m.get("children") or {}).get("data", [])
                images = [c["media_url"] for c in children if c.get("media_type") == "IMAGE" and c.get("media_url")]
                if not images and m.get("media_url") and m.get("media_type") != "VIDEO":
                    images = [m["media_url"]]
                posts.append(
                    Post(
                        permalink=m.get("permalink", ""),
                        account=username,
                        followers=followers,
                        caption=m.get("caption", "") or "",
                        media_type=m.get("media_type", ""),
                        timestamp=m.get("timestamp", ""),
                        likes=m.get("like_count"),
                        comments=m.get("comments_count"),
                        image_urls=images,
                        slide_count=len(children) or 1,
                    )
                )
            after = page.get("paging", {}).get("cursors", {}).get("after")
            if not after or not page.get("data"):
                complete = True
                break
        self._cache[username] = AccountData(username, followers, posts, complete)
        return self._cache[username]

    def find_post(self, username: str, url: str, max_posts: int = 100) -> tuple[AccountData, Post | None]:
        acct = self.account(username, max_posts=max_posts)
        code = shortcode(url)
        for p in acct.posts:
            if code and shortcode(p.permalink) == code:
                return acct, p
        return acct, None


def shortcode(url: str) -> str | None:
    m = re.search(r"instagram\.com/(?:[^/]+/)?(?:p|reel|tv)/([A-Za-z0-9_-]+)", url or "")
    return m.group(1) if m else None


def username_from_url(url: str) -> str | None:
    """instagram.com/<username>/p/<code> 형식이면 계정명을 뽑는다(/p/<code>만 있으면 None)."""
    m = re.search(r"instagram\.com/([A-Za-z0-9._]+)/(?:p|reel)/", url or "")
    return m.group(1) if m and m.group(1) not in ("p", "reel", "tv") else None


def clean_username(name: str) -> str:
    name = (name or "").strip()
    m = re.search(r"instagram\.com/([A-Za-z0-9._]+)", name)
    if m:
        name = m.group(1)
    return name.lstrip("@").strip("/")


def download_images(urls: list[str], limit: int) -> list[tuple[str, bytes]]:
    """(media_type, bytes) 목록. 실패한 이미지는 건너뛴다."""
    out = []
    for u in urls[:limit]:
        try:
            r = requests.get(u, timeout=30)
            r.raise_for_status()
        except requests.RequestException:
            continue
        ctype = r.headers.get("content-type", "image/jpeg").split(";")[0]
        if ctype not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
            ctype = "image/jpeg"
        if len(r.content) <= 5 * 1024 * 1024:
            out.append((ctype, r.content))
    return out
