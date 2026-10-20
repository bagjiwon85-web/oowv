"""렌더링된 카드뉴스 폴더를 구글 드라이브에 영상별 하위 폴더로 올린다.

drive_uploader.gs 웹앱(사용자 계정으로 실행)을 통해 업로드한다. 웹앱은 drive.file 권한만 써서
자기가 만든 '카드뉴스 자동 업로드' 폴더 안에 올리며, 사용자가 이 폴더를 '카드뉴스' 폴더 안으로 옮겨 둔다.
환경변수: CARDNEWS_UPLOAD_URL, CARDNEWS_UPLOAD_TOKEN

사용법:
  python3 cardnews/upload.py out/            # out/ 아래 모든 폴더
  python3 cardnews/upload.py "out/[2026-10-20] 제목"
"""
import base64
import glob
import json
import os
import sys
import time
import urllib.error
import urllib.request


def upload_folder(folder):
    files = []
    for path in sorted(glob.glob(os.path.join(glob.escape(folder), "*.png"))):
        with open(path, "rb") as f:
            files.append({"name": os.path.basename(path), "mimeType": "image/png",
                          "base64": base64.b64encode(f.read()).decode()})
    body = json.dumps({"token": os.environ["CARDNEWS_UPLOAD_TOKEN"],
                       "folderName": os.path.basename(folder.rstrip("/")),
                       "files": files}).encode()
    req = urllib.request.Request(os.environ["CARDNEWS_UPLOAD_URL"], data=body,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:  # Apps Script는 302로 결과를 돌려줌
        res = json.load(r)
    if not res.get("ok"):
        raise RuntimeError(f"{folder}: {res}")
    return res


def main():
    targets = []
    for arg in sys.argv[1:]:
        if glob.glob(os.path.join(glob.escape(arg), "*.png")):
            targets.append(arg)
        else:
            targets += sorted(d for d in glob.glob(os.path.join(glob.escape(arg), "*"))
                              if os.path.isdir(d))
    failed = []
    for folder in targets:
        for attempt in range(4):  # Apps Script가 가끔 502/503을 돌려주므로 잠시 쉬고 다시 시도
            try:
                res = upload_folder(folder)
                print(f"{os.path.basename(folder)}\t{len(res['saved'])}장\t{res['folderUrl']}",
                      flush=True)
                break
            except (urllib.error.URLError, TimeoutError, ValueError) as e:
                if attempt == 3:
                    print(f"{os.path.basename(folder)}\t실패\t{e}", flush=True)
                    failed.append(folder)
                else:
                    time.sleep(10 * 2 ** attempt)
    if failed:
        sys.exit(f"업로드 실패 {len(failed)}개")


if __name__ == "__main__":
    main()
