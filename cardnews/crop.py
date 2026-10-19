"""표지 사진을 4:5(1080x1350)로 잘라낸다. 얼굴이 있으면 얼굴이 가운데 위쪽에 오도록.

render.py가 표지마다 자동 호출한다. 스펙의 cover 카드에 "crop": [x, y, w, h]
(원본 비율 0~1)를 주면 얼굴 인식 대신 그 영역을 쓴다.
"""
import os

import cv2
from PIL import Image

OUT_W, OUT_H = 1080, 1350
_CASCADE = None


def faces(path):
    global _CASCADE
    if _CASCADE is None:
        _CASCADE = cv2.CascadeClassifier(
            os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml"))
    img = cv2.imread(path)
    if img is None:
        return []
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    found = _CASCADE.detectMultiScale(gray, 1.1, 6, minSize=(60, 60))
    return sorted(found, key=lambda f: f[2] * f[3], reverse=True)


def crop_cover(src, dst, manual=None):
    im = Image.open(src).convert("RGB")
    W, H = im.size
    ratio = OUT_W / OUT_H
    if manual:
        x, y, w, h = manual
        box = (x * W, y * H, (x + w) * W, (y + h) * H)
    else:
        if W / H > ratio:
            ch, cw = H, H * ratio
        else:
            cw, ch = W, W / ratio
        cx, cy = W / 2, H / 2
        fs = faces(src)
        if fs:
            fx, fy, fw, fh = fs[0]
            cx = fx + fw / 2
            cy = fy + fh / 2 + ch * 0.12  # 얼굴을 위쪽에 두고 아래는 문구 자리
        left = max(0, min(W - cw, cx - cw / 2))
        top = max(0, min(H - ch, cy - ch / 2))
        box = (left, top, left + cw, top + ch)
    im.crop(tuple(int(v) for v in box)).resize((OUT_W, OUT_H), Image.LANCZOS).save(
        dst, quality=92)
    return dst
