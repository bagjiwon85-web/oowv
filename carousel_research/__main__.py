"""인스타그램 바이럴 캐러셀 리서치 시트 자동 분석기.

  python -m carousel_research inspect --sheet <URL>          # 양식 열이 어떻게 매핑되는지 확인
  python -m carousel_research analyze --sheet <URL>          # 빈 칸 채우기 (지표 계산 + Claude 분석)
  python -m carousel_research collect --sheet <URL> --accounts a,b   # 계정에서 바이럴 캐러셀 수집해 행 추가
"""

from __future__ import annotations

import argparse
import logging
import os
import sys

from .columns import FIELD_ALIASES, build_plan
from .instagram import InstagramClient, clean_username, download_images, shortcode, username_from_url
from .metrics import compute, engagement, parse_time
from .sheet import CsvTable, GoogleSheetTable, Table

log = logging.getLogger("carousel_research")

MEDIA_TYPE_KO = {"CAROUSEL_ALBUM": "캐러셀", "IMAGE": "이미지", "VIDEO": "릴스/영상"}
LABELS_KO = {
    "account": "계정", "followers": "팔로워", "likes": "좋아요", "comments": "댓글", "saves": "저장",
    "shares": "공유", "posted_at": "업로드", "slide_count": "슬라이드 수", "caption": "캡션",
    "engagement": "총반응", "engagement_rate": "참여율(%)", "viral_index": "계정 평소 대비 반응 배수",
    "account_median_engagement": "계정 평소 반응(중앙값)", "url": "링크", "media_type": "유형",
}


# ---------------------------------------------------------------- helpers

def open_table(args) -> Table:
    if args.csv:
        return CsvTable(args.csv, args.out, header_row=args.header_row)
    creds = args.credentials or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not creds:
        sys.exit("Google 서비스 계정 키(JSON)가 필요합니다: --credentials 또는 GOOGLE_APPLICATION_CREDENTIALS")
    return GoogleSheetTable(args.sheet, args.worksheet, creds, header_row=args.header_row)


def parse_map(items: list[str]) -> dict[str, str]:
    out = {}
    for item in items or []:
        header, _, target = item.partition("=")
        if target not in FIELD_ALIASES and target not in ("ai", "skip"):
            sys.exit(f"--map '{item}': 알 수 없는 필드 '{target}'. 가능: {', '.join(FIELD_ALIASES)}, ai, skip")
        out[header.strip()] = target.strip()
    return out


def make_plan(table: Table, args):
    skip = None
    if args.skip:
        from .columns import DEFAULT_SKIP

        skip = DEFAULT_SKIP + args.skip
    return build_plan(table.headers, parse_map(args.map), skip)


def first_data_row(args) -> int:
    if args.start_row:
        return args.start_row
    return max(args.header_row, args.guide_row or 0) + 1


def row_range(table: Table, args) -> range:
    start = first_data_row(args)
    end = table.last_row()
    if args.rows:
        a, _, b = args.rows.partition("-")
        start, end = int(a), int(b or a)
    return range(start, end + 1)


def col_letter(i: int) -> str:
    s = ""
    i += 1
    while i:
        i, rem = divmod(i - 1, 26)
        s = chr(65 + rem) + s
    return s


def fmt_time(ts: str, tz: str) -> str:
    dt = parse_time(ts, tz)
    return dt.strftime("%Y-%m-%d %H:%M") if dt else ts


def account_baseline(table: Table, plan, account: str, exclude_row: int, start: int) -> list[int]:
    """API를 못 쓸 때: 시트 안의 같은 계정 행들로 평소 반응 기준선을 만든다."""
    a_col, l_col, c_col = plan.col("account"), plan.col("likes"), plan.col("comments")
    if a_col is None or l_col is None:
        return []
    out = []
    for r in range(start, table.last_row() + 1):
        if r == exclude_row or clean_username(table.get(r, a_col)) != account:
            continue
        e = engagement(table.get(r, l_col), table.get(r, c_col) if c_col is not None else None)
        if e:
            out.append(e)
    return out


def examples_from_sheet(table: Table, plan, rows: range, limit: int = 2) -> list[dict]:
    """이미 사람이 채워 둔 행을 Claude에 톤·형식 예시로 보여준다."""
    out = []
    for r in rows:
        filled = {table.headers[c]: table.get(r, c) for c in plan.ai_cols if table.get(r, c)}
        if plan.ai_cols and len(filled) >= max(1, len(plan.ai_cols) // 2):
            out.append(filled)
        if len(out) >= limit:
            break
    return out


# ---------------------------------------------------------------- commands

def cmd_inspect(args) -> None:
    table = open_table(args)
    plan = make_plan(table, args)
    print(f"헤더 행 {args.header_row}: {len(table.headers)}개 열, 데이터 {first_data_row(args)}행부터\n")
    by_col = {c: f for f, c in plan.field_cols.items()}
    for i, h in enumerate(table.headers):
        if not h:
            continue
        if i in by_col:
            kind = f"계산/수집  ({by_col[i]})"
        elif i in plan.ai_cols:
            kind = "Claude 분석"
        else:
            kind = "건너뜀(직접 작성)"
        guide = table.get(args.guide_row, i) if args.guide_row else ""
        print(f"  {col_letter(i):>3}  {h:<20} -> {kind}" + (f"   가이드: {guide}" if guide else ""))
    if plan.col("url") is None:
        print("\n주의: 게시물 링크 열을 찾지 못했습니다. --map '열이름=url' 로 지정하세요.")


def cmd_analyze(args) -> None:
    table = open_table(args)
    plan = make_plan(table, args)
    ig = InstagramClient()
    analyzer = None
    if not args.no_ai and plan.ai_cols:
        from .analyzer import Analyzer

        analyzer = Analyzer(model=args.model, effort=args.effort, max_images=args.max_images)
    if not ig.enabled:
        log.info("IG_USER_ID / IG_ACCESS_TOKEN 이 없어 Instagram API 수집은 건너뜁니다 (시트 값만 사용)")

    data_start = first_data_row(args)
    rows = row_range(table, args)
    guides = {c: table.get(args.guide_row, c) for c in plan.ai_cols} if args.guide_row else {}
    examples = examples_from_sheet(table, plan, range(data_start, table.last_row() + 1))

    def empty(r, c):
        return args.overwrite or not table.get(r, c)

    for r in rows:
        sheet_vals = {f: table.get(r, c) for f, c in plan.field_cols.items()}
        url = sheet_vals.get("url", "")
        account = clean_username(sheet_vals.get("account", "") or username_from_url(url) or "")
        if not (url or sheet_vals.get("caption")):
            continue
        log.info("행 %d: %s", r, url or account)

        api_vals: dict = {}
        images: list = []
        baseline: list[int] = []
        if ig.enabled and account and url:
            try:
                acct, post = ig.find_post(account, url, max_posts=args.scan_posts)
                if post:
                    api_vals = {
                        "account": acct.username,
                        "followers": acct.followers,
                        "likes": post.likes,
                        "comments": post.comments,
                        "caption": post.caption,
                        "posted_at": fmt_time(post.timestamp, args.tz),
                        "slide_count": post.slide_count,
                        "media_type": MEDIA_TYPE_KO.get(post.media_type, post.media_type),
                    }
                    baseline = [
                        e for p in acct.posts if p.permalink != post.permalink
                        and (e := engagement(p.likes, p.comments))
                    ]
                    if analyzer:
                        images = download_images(post.image_urls, args.max_images)
                else:
                    log.warning("  @%s 최근 %d개 게시물에서 링크를 찾지 못함", account, args.scan_posts)
            except RuntimeError as e:
                log.warning("  Instagram API 오류: %s", e)
        if not baseline and account:
            baseline = account_baseline(table, plan, account, r, data_start)

        merged = {**{k: v for k, v in api_vals.items() if v not in (None, "")},
                  **{k: v for k, v in sheet_vals.items() if v}}
        if account:
            merged["account"] = account
        merged.update({k: v for k, v in compute(merged, baseline, args.tz).items() if k not in sheet_vals or not sheet_vals[k]})

        for f, c in plan.field_cols.items():
            if f in merged and empty(r, c) and str(merged[f]) != table.get(r, c):
                table.set(r, c, merged[f])

        todo = [c for c in plan.ai_cols if empty(r, c)]
        if analyzer and todo:
            # 양식의 다른 열 값(방금 계산한 지표, 사람이 쓴 카테고리·메모 등)을 헤더 이름 그대로 전달하고,
            # 양식에 열이 없는 값(API 캡션, 계정 평소 반응 등)만 추가로 붙인다
            post_info = {h: table.get(r, c) for c, h in enumerate(table.headers)
                         if h and c not in todo and table.get(r, c)}
            for k, v in merged.items():
                if k in LABELS_KO and plan.col(k) is None:
                    post_info[LABELS_KO[k]] = v
            try:
                result = analyzer.fill([(table.headers[c], guides.get(c, "")) for c in todo], post_info, images, examples)
            except Exception as e:  # 한 행 실패가 전체 실행을 멈추지 않게
                log.error("  Claude 분석 실패: %s", e)
                result = {}
            for i, value in result.items():
                if value:
                    table.set(r, todo[i], value)

        if args.dry_run:
            for (_, c), v in sorted(table.discard().items()):
                print(f"  [{r}] {table.headers[c]}: {v}")
        else:
            n = table.flush()  # 행마다 저장 -> 중간에 멈춰도 진행분 보존
            log.info("  %d칸 기록", n)


def cmd_collect(args) -> None:
    table = open_table(args)
    plan = make_plan(table, args)
    ig = InstagramClient()
    if not ig.enabled:
        sys.exit("collect 는 Instagram Graph API가 필요합니다: IG_USER_ID, IG_ACCESS_TOKEN 환경변수를 설정하세요")
    url_col = plan.col("url")
    if url_col is None:
        sys.exit("양식에서 게시물 링크 열을 찾지 못했습니다. --map '열이름=url' 로 지정하세요")
    existing = {shortcode(table.get(r, url_col)) for r in range(1, table.last_row() + 1)} - {None}

    picked = []
    for name in args.accounts.split(","):
        name = clean_username(name)
        if not name:
            continue
        try:
            acct = ig.account(name, max_posts=args.scan_posts)
        except RuntimeError as e:
            log.warning("%s", e)
            continue
        base = [e for p in acct.posts if (e := engagement(p.likes, p.comments))]
        cands = []
        for p in acct.posts:
            if not p.is_carousel or shortcode(p.permalink) in existing:
                continue
            m = compute({"likes": p.likes, "comments": p.comments, "followers": acct.followers}, base, args.tz)
            vi = m.get("viral_index")
            if vi is not None and vi >= args.min_viral:
                cands.append((vi, p))
        cands.sort(key=lambda x: x[0], reverse=True)
        log.info("@%s: 캐러셀 %d개 중 기준(%.1f배) 이상 %d개", name,
                 sum(p.is_carousel for p in acct.posts), args.min_viral, len(cands))
        picked += [p for _, p in cands[: args.top]]

    # 양식에서 마지막으로 내용이 있는 행 뒤에 이어 붙인다
    last = max([r for r in range(1, table.last_row() + 1) if any(table.row(r))] + [first_data_row(args) - 1])
    for p in picked:
        last += 1
        while table.last_row() < last:
            table.append_row()
        table.set(last, url_col, p.permalink)
        if plan.col("account") is not None:
            table.set(last, plan.col("account"), p.account)
    if args.dry_run:
        for p in picked:
            print(p.permalink)
        return
    table.flush()
    log.info("%d개 행 추가", len(picked))
    if picked and args.analyze:
        if args.csv and args.out:
            args.csv = args.out
        args.rows = f"{last - len(picked) + 1}-{last}"
        cmd_analyze(args)


# ---------------------------------------------------------------- cli

def main(argv=None) -> None:
    p = argparse.ArgumentParser(prog="carousel_research", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    common = argparse.ArgumentParser(add_help=False)
    src = common.add_mutually_exclusive_group(required=True)
    src.add_argument("--sheet", help="Google 스프레드시트 URL 또는 ID")
    src.add_argument("--csv", help="로컬 CSV 파일 (구글 시트를 CSV로 내려받은 것)")
    common.add_argument("--out", help="CSV 모드 결과 저장 경로 (기본: 원본 덮어쓰기)")
    common.add_argument("--worksheet", help="탭 이름 (기본: 첫 번째 탭)")
    common.add_argument("--credentials", help="Google 서비스 계정 JSON 키 경로")
    common.add_argument("--header-row", type=int, default=1, help="헤더(열 이름) 행 번호 (기본 1)")
    common.add_argument("--guide-row", type=int, help="열마다 작성 가이드/예시가 적힌 행 번호 (있으면)")
    common.add_argument("--start-row", type=int, help="데이터 시작 행 (기본: 헤더/가이드 다음 행)")
    common.add_argument("--map", action="append", metavar="열이름=필드",
                        help="열 매핑 직접 지정. 필드: url, likes, ... 또는 ai, skip (여러 번 사용 가능)")
    common.add_argument("--skip", action="append", metavar="열이름", help="채우지 않을 열 (여러 번 사용 가능)")
    common.add_argument("--tz", default="Asia/Seoul", help="업로드 시간 표기 시간대")
    common.add_argument("-v", "--verbose", action="store_true")

    run = argparse.ArgumentParser(add_help=False)
    run.add_argument("--rows", help="처리할 행 범위, 예: 3-20 또는 7")
    run.add_argument("--overwrite", action="store_true", help="이미 값이 있는 칸도 다시 채움")
    run.add_argument("--no-ai", action="store_true", help="Claude 분석 없이 지표만 계산")
    run.add_argument("--dry-run", action="store_true", help="시트에 쓰지 않고 결과만 출력")
    run.add_argument("--model", default="claude-opus-5-5")
    run.add_argument("--effort", default="medium", choices=["low", "medium", "high", "xhigh", "max"])
    run.add_argument("--max-images", type=int, default=10, help="Claude에 보낼 슬라이드 최대 장수")
    run.add_argument("--scan-posts", type=int, default=100, help="계정당 조회할 최근 게시물 수")

    sub.add_parser("inspect", parents=[common], help="양식 매핑 확인")
    sub.add_parser("analyze", parents=[common, run], help="빈 칸 분석·채우기")
    c = sub.add_parser("collect", parents=[common, run], help="계정에서 바이럴 캐러셀 수집")
    c.add_argument("--accounts", required=True, help="쉼표로 구분한 계정명")
    c.add_argument("--min-viral", type=float, default=2.0, help="계정 평소 반응 대비 최소 배수 (기본 2.0)")
    c.add_argument("--top", type=int, default=10, help="계정당 최대 추가 개수")
    c.add_argument("--analyze", action="store_true", help="추가한 행을 바로 분석")

    args = p.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(message)s")
    {"inspect": cmd_inspect, "analyze": cmd_analyze, "collect": cmd_collect}[args.cmd](args)


if __name__ == "__main__":
    main()
