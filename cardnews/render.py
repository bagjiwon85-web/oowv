"""카드뉴스 렌더러: 카드 문구 JSON -> 1080x1350(인스타 4:5) PNG.

사용법:
  python3 cardnews/render.py specs/2026-10-16_5iV7NuZBBoA.json --out out/
  python3 cardnews/render.py specs/*.json --out out/

문구 안에서 *이렇게* 감싼 부분은 노란색 강조, 줄바꿈은 \n.
카드 종류: cover, text, point, stat, quote, check, end (아래 CARD 함수 참고).
"""
import argparse
import base64
import html
import json
import mimetypes
import os
import re
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HANDLE = "@mindgrow.kr"
W, H = 1080, 1350


def font_face():
    rules = []
    for weight, name in [(400, "Regular"), (500, "Medium"), (600, "SemiBold"),
                         (700, "Bold"), (800, "ExtraBold"), (900, "Black")]:
        path = os.path.join(HERE, "fonts", f"Pretendard-{name}.otf")
        rules.append(
            f"@font-face{{font-family:P;font-weight:{weight};"
            f"src:url('file://{path}') format('opentype');}}"
        )
    return "\n".join(rules)


CSS = """
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;font-family:P,sans-serif;color:#fff;word-break:keep-all;
 -webkit-font-smoothing:antialiased}
.card{width:1080px;height:1350px;position:relative;overflow:hidden;background:#000}
.y{color:#FFC93C}
.handle{position:absolute;left:84px;top:64px;font-size:30px;font-weight:600;color:#e8e8e8;
 letter-spacing:-0.3px}
.handle small{display:block;font-size:26px;color:#FFC93C;font-weight:500;margin-top:4px}
.page{position:absolute;right:84px;top:64px;font-size:28px;font-weight:600;color:#777}
.wrap{position:absolute;left:84px;right:84px;top:0;bottom:0;display:flex;
 flex-direction:column;justify-content:center}
.lead{font-size:62px;font-weight:800;line-height:1.38;letter-spacing:-1.6px}
.body{font-size:48px;font-weight:600;line-height:1.5;letter-spacing:-1.1px;color:#f2f2f2;
 margin-top:52px}
.num{font-size:62px;font-weight:800;color:#FFC93C;letter-spacing:-1px}
.big{font-size:150px;font-weight:900;line-height:1.1;letter-spacing:-5px;color:#FFC93C}
.label{font-size:52px;font-weight:700;line-height:1.45;letter-spacing:-1.2px;margin-top:44px}
.qmark{font-size:220px;font-weight:900;color:#FFC93C;line-height:0.8;height:120px}
.quote{font-size:54px;font-weight:700;line-height:1.5;letter-spacing:-1.2px}
.by{font-size:34px;font-weight:500;color:#aaa;margin-top:48px}
.check{margin-top:56px}
.check div{font-size:46px;font-weight:600;line-height:1.45;letter-spacing:-1px;
 padding:30px 0 30px 78px;position:relative;border-top:2px solid #262626}
.check div:last-child{border-bottom:2px solid #262626}
.check div:before{content:"";position:absolute;left:0;top:38px;width:44px;height:44px;
 border:5px solid #FFC93C;border-radius:8px}
.src{position:absolute;left:84px;right:84px;bottom:70px;font-size:28px;font-weight:500;
 color:#8a8a8a;line-height:1.5}
/* cover */
.bg{position:absolute;inset:0;background-size:cover;background-position:center 30%}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 30%,
 rgba(0,0,0,.55) 52%,rgba(0,0,0,.92) 68%,#000 80%)}
.cov{position:absolute;left:72px;right:72px;bottom:110px}
.cov .kick{font-size:40px;font-weight:700;color:#FFC93C;letter-spacing:-0.8px;
 margin-bottom:26px;line-height:1.35}
.cov .head{font-size:86px;font-weight:800;line-height:1.28;letter-spacing:-2.6px}
.cov .who{font-size:32px;font-weight:500;color:#cfcfcf;margin-top:38px}
.cov .h2{font-size:30px;font-weight:600;color:#e8e8e8;margin-bottom:22px}
.nophoto .cov{bottom:auto;top:50%;transform:translateY(-50%)}
.nophoto .head{font-size:104px;letter-spacing:-3.4px}
.deco{position:absolute;right:-60px;top:-120px;font-size:640px;font-weight:900;
 color:#141414;line-height:1;letter-spacing:-30px}
.swipe{position:absolute;right:72px;bottom:56px;font-size:28px;font-weight:600;color:#bbb}
"""


def rich(text):
    """*강조* -> 노란색, \\n -> <br>."""
    out = html.escape(text)
    out = re.sub(r"\*(.+?)\*", r'<span class="y">\1</span>', out, flags=re.S)
    return out.replace("\n", "<br>")


def data_uri(path):
    mime = mimetypes.guess_type(path)[0] or "image/jpeg"
    with open(path, "rb") as f:
        return f"data:{mime};base64,{base64.b64encode(f.read()).decode()}"


def header(spec, i, n):
    sub = f"<small>{html.escape(spec['series'])}</small>" if spec.get("series") else ""
    return (f'<div class="handle">{HANDLE}{sub}</div>'
            f'<div class="page">{i}/{n}</div>')


def cover(c, spec, i, n, base):
    photo = c.get("photo") or spec.get("photo")
    if photo and not os.path.isabs(photo):
        photo = os.path.join(base, photo)
    has = bool(photo and os.path.exists(photo))
    bg = (f'<div class="bg" style="background-image:url({data_uri(photo)})"></div>'
          '<div class="shade"></div>') if has else (
        f'<div class="deco">{html.escape(c.get("deco", ""))}</div>')
    kick = f'<div class="kick">{rich(c["kicker"])}</div>' if c.get("kicker") else ""
    who = f'<div class="who">— {rich(c["who"])}</div>' if c.get("who") else ""
    return (f'<div class="card{"" if has else " nophoto"}">{bg}'
            f'<div class="cov"><div class="h2">{HANDLE}</div>{kick}'
            f'<div class="head">{rich(c["head"])}</div>{who}</div>'
            f'<div class="swipe">밀어서 보기 →</div></div>')


def text(c, spec, i, n, base):
    body = f'<div class="body">{rich(c["body"])}</div>' if c.get("body") else ""
    return (f'<div class="card">{header(spec, i, n)}<div class="wrap">'
            f'<div class="lead">{rich(c["lead"])}</div>{body}</div></div>')


def point(c, spec, i, n, base):
    body = f'<div class="body">{rich(c["body"])}</div>' if c.get("body") else ""
    return (f'<div class="card">{header(spec, i, n)}<div class="wrap">'
            f'<div class="num">{html.escape(str(c["num"]))}.</div>'
            f'<div class="lead">{rich(c["lead"])}</div>{body}</div></div>')


def stat(c, spec, i, n, base):
    return (f'<div class="card">{header(spec, i, n)}<div class="wrap">'
            f'<div class="big">{rich(c["big"])}</div>'
            f'<div class="label">{rich(c["label"])}</div></div></div>')


def quote(c, spec, i, n, base):
    by = f'<div class="by">{rich(c["by"])}</div>' if c.get("by") else ""
    return (f'<div class="card">{header(spec, i, n)}<div class="wrap">'
            f'<div class="qmark">“</div><div class="quote">{rich(c["quote"])}</div>'
            f'{by}</div></div>')


def check(c, spec, i, n, base):
    items = "".join(f"<div>{rich(t)}</div>" for t in c["items"])
    return (f'<div class="card">{header(spec, i, n)}<div class="wrap">'
            f'<div class="lead">{rich(c["lead"])}</div><div class="check">{items}</div>'
            f'</div></div>')


def end(c, spec, i, n, base):
    src = f'<div class="src">{rich(c["source"])}</div>' if c.get("source") else ""
    return (f'<div class="card">{header(spec, i, n)}<div class="wrap">'
            f'<div class="lead">{rich(c["lead"])}</div>'
            f'<div class="body">{rich(c.get("body", ""))}</div></div>{src}</div>')


CARD = {"cover": cover, "text": text, "point": point, "stat": stat,
        "quote": quote, "check": check, "end": end}


def safe_name(s):
    s = re.sub(r'[\\/:*?"<>|\n\r\t]', " ", s)
    return re.sub(r"\s+", " ", s).strip()[:90]


def render(spec_path, out_dir, page):
    with open(spec_path, encoding="utf-8") as f:
        spec = json.load(f)
    base = os.path.dirname(os.path.abspath(spec_path))
    cards = spec["cards"]
    if len(cards) > 10:
        sys.exit(f"{spec_path}: 카드는 10장 이내여야 합니다 ({len(cards)}장)")
    n = len(cards)
    folder = os.path.join(out_dir, safe_name(spec["file_title"]))
    os.makedirs(folder, exist_ok=True)
    files = []
    for i, c in enumerate(cards, 1):
        inner = CARD[c["type"]](c, spec, i, n, base)
        tmp = os.path.join(folder, "_card.html")
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(f"<html><head><meta charset='utf-8'><style>{font_face()}{CSS}"
                    f"</style></head><body>{inner}</body></html>")
        page.goto(f"file://{tmp}")
        page.evaluate("document.fonts.ready")
        path = os.path.join(folder, f"{i:02d}.png")
        page.locator(".card").screenshot(path=path)
        files.append(path)
    os.remove(tmp)
    return folder, files


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("specs", nargs="+")
    ap.add_argument("--out", default="out")
    a = ap.parse_args()
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get(
            "CHROMIUM_PATH") or None, args=["--allow-file-access-from-files"])
        page = browser.new_page(viewport={"width": W, "height": H})
        for s in a.specs:
            folder, files = render(s, a.out, page)
            print(f"{folder}\t{len(files)}")
        browser.close()


if __name__ == "__main__":
    main()
