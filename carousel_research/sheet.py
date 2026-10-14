"""스프레드시트 입출력: Google Sheets(gspread) 또는 로컬 CSV.

두 백엔드 모두 "양식을 그대로" 다룬다. 헤더 행을 읽고, 빈 셀만 채우며,
열을 추가/삭제하거나 순서를 바꾸지 않는다.
"""

from __future__ import annotations

import csv
import re
from pathlib import Path


class Table:
    """행 번호는 모두 1부터 시작하는 시트 기준 번호."""

    def __init__(self, values: list[list[str]], header_row: int = 1):
        self.values = [list(r) for r in values]
        self.header_row = header_row
        width = max((len(r) for r in self.values), default=0)
        for r in self.values:
            r.extend([""] * (width - len(r)))
        self._pending: dict[tuple[int, int], str] = {}

    @property
    def headers(self) -> list[str]:
        return [h.strip() for h in self.values[self.header_row - 1]]

    def row(self, row_no: int) -> list[str]:
        if row_no - 1 < len(self.values):
            return self.values[row_no - 1]
        return [""] * len(self.headers)

    def last_row(self) -> int:
        return len(self.values)

    def get(self, row_no: int, col: int) -> str:
        r = self.row(row_no)
        return r[col].strip() if col < len(r) else ""

    def set(self, row_no: int, col: int, value) -> None:
        while len(self.values) < row_no:
            self.values.append([""] * len(self.headers))
        self.values[row_no - 1][col] = "" if value is None else str(value)
        self._pending[(row_no, col)] = self.values[row_no - 1][col]

    def append_row(self) -> int:
        self.values.append([""] * len(self.headers))
        return len(self.values)

    def discard(self) -> dict[tuple[int, int], str]:
        """쓰지 않고 대기 중인 변경을 버린다(dry-run). 버린 변경을 반환."""
        dropped, self._pending = self._pending, {}
        return dropped

    def flush(self) -> int:
        n = len(self._pending)
        if n:
            self._write(self._pending)
        self._pending = {}
        return n

    def _write(self, cells: dict[tuple[int, int], str]) -> None:
        raise NotImplementedError


class CsvTable(Table):
    def __init__(self, path: str, out_path: str | None = None, header_row: int = 1):
        self.path = Path(path)
        self.out_path = Path(out_path) if out_path else self.path
        with self.path.open(encoding="utf-8-sig", newline="") as f:
            values = list(csv.reader(f))
        super().__init__(values, header_row)

    def _write(self, cells) -> None:
        with self.out_path.open("w", encoding="utf-8-sig", newline="") as f:
            csv.writer(f).writerows(self.values)


class GoogleSheetTable(Table):
    def __init__(self, sheet: str, worksheet: str | None, credentials: str, header_row: int = 1):
        import gspread

        gc = gspread.service_account(filename=credentials)
        sh = gc.open_by_key(extract_sheet_id(sheet))
        self.ws = sh.worksheet(worksheet) if worksheet else sh.get_worksheet(0)
        super().__init__(self.ws.get_all_values(), header_row)

    def _write(self, cells) -> None:
        from gspread.utils import rowcol_to_a1

        need_rows = max(r for r, _ in cells)
        if need_rows > self.ws.row_count:
            self.ws.add_rows(need_rows - self.ws.row_count)
        # RAW: 캡션이 "=" "+"로 시작해도 수식으로 해석되지 않게. 숫자는 숫자로 넣는다.
        self.ws.batch_update(
            [{"range": rowcol_to_a1(r, c + 1), "values": [[_typed(v)]]} for (r, c), v in sorted(cells.items())],
            value_input_option="RAW",
        )


def _typed(v: str):
    if re.fullmatch(r"-?\d+", v):
        return int(v)
    if re.fullmatch(r"-?\d+\.\d+", v):
        return float(v)
    return v


def extract_sheet_id(url_or_id: str) -> str:
    m = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", url_or_id)
    return m.group(1) if m else url_or_id
