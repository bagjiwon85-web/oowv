"""Claude로 '양식의 분석 열'을 채운다.

열 이름(헤더)과 가이드 행(있으면)을 그대로 지시문으로 넘기므로,
양식에 어떤 분석 항목이 있든 그 항목 그대로 채운다.
"""

from __future__ import annotations

import base64
import json
import logging

import anthropic

log = logging.getLogger(__name__)

MODEL = "claude-opus-5-5"

SYSTEM = """당신은 인스타그램 캐러셀(슬라이드형 게시물) 바이럴 콘텐츠를 분석하는 콘텐츠 전략가입니다.
리서치 시트의 한 행(게시물 1개)을 채웁니다. 시트의 열 이름이 곧 분석 항목입니다.

원칙:
- 각 열 이름(그리고 가이드가 있으면 가이드)의 의도에 맞춰 그 칸에 들어갈 내용만 씁니다.
- 스프레드시트 셀에 들어갈 분량으로 간결하게, 한국어로 씁니다. 목록이 필요하면 " / "로 구분합니다.
- 슬라이드 이미지를 직접 보고 판단합니다. 슬라이드 문구를 인용할 때는 이미지에 쓰인 그대로 옮깁니다.
- 지표(좋아요, 참여율, 평균 대비 배수 등)는 주어진 숫자만 근거로 씁니다. 숫자를 지어내지 않습니다.
- 이미지가 없어 판단할 수 없는 항목은 캡션 기반으로 추정하고 앞에 "(캡션 기반)"을 붙입니다.
  캡션으로도 판단할 수 없으면 빈 문자열을 반환합니다.
- 가이드에 선택지나 예시 형식이 있으면 그 형식을 따릅니다."""


class Analyzer:
    def __init__(self, model: str = MODEL, effort: str = "medium", max_images: int = 10):
        self.client = anthropic.Anthropic()
        self.model = model
        self.effort = effort
        self.max_images = max_images

    def fill(
        self,
        columns: list[tuple[str, str]],
        post: dict,
        images: list[tuple[str, bytes]],
        examples: list[dict] | None = None,
    ) -> dict[int, str]:
        """columns: [(헤더, 가이드)] -> {columns 내 순번: 값}"""
        if not columns:
            return {}
        keys = {f"c{i + 1}": i for i in range(len(columns))}
        schema = {
            "type": "object",
            "properties": {k: {"type": "string", "description": columns[i][0]} for k, i in keys.items()},
            "required": list(keys),
            "additionalProperties": False,
        }

        col_lines = []
        for i, (header, guide) in enumerate(columns):
            line = f'- c{i + 1}: "{header}"'
            if guide:
                line += f"  (가이드: {guide})"
            col_lines.append(line)

        content: list[dict] = []
        for idx, (mtype, data) in enumerate(images[: self.max_images], start=1):
            content.append({"type": "text", "text": f"[슬라이드 {idx}]"})
            content.append(
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": mtype, "data": base64.standard_b64encode(data).decode()},
                }
            )
        text = [
            "## 게시물 정보",
            json.dumps(post, ensure_ascii=False, indent=2),
            f"\n슬라이드 이미지: {len(images[: self.max_images])}장 첨부" if images else "\n슬라이드 이미지: 없음",
        ]
        if examples:
            text += [
                "\n## 같은 시트에 이미 작성된 행 (톤·형식 참고용)",
                json.dumps(examples, ensure_ascii=False, indent=2),
            ]
        text += [
            "\n## 채울 열",
            "\n".join(col_lines),
            "\n각 키(c1, c2, ...)에 해당 열에 들어갈 값을 담아 JSON으로 답하세요.",
        ]
        content.append({"type": "text", "text": "\n".join(text)})

        response = self.client.beta.messages.create(
            model=self.model,
            max_tokens=16000,
            system=SYSTEM,
            thinking={"type": "adaptive"},
            output_config={"effort": self.effort, "format": {"type": "json_schema", "schema": schema}},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            messages=[{"role": "user", "content": content}],
        )
        if response.stop_reason == "refusal":
            detail = response.stop_details.category if response.stop_details else None
            log.warning("Claude가 분석을 거절했습니다 (category=%s)", detail)
            return {}
        if response.stop_reason == "max_tokens":
            log.warning("응답이 max_tokens에서 잘렸습니다")
            return {}
        raw = next(b.text for b in response.content if b.type == "text")
        data = json.loads(raw)
        return {keys[k]: (v or "").strip() for k, v in data.items() if k in keys}
