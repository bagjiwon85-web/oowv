#!/usr/bin/env python3
"""Premiere Pro 자동 컷 편집 XML 생성기.

영상에서 다음을 잘라낸 시퀀스를 Final Cut Pro 7 XML(xmeml)로 만든다.
Premiere Pro에서 File > Import 로 불러올 수 있다.

  1. 일정 길이(기본 0.5초) 이상 무음 구간
  2. 같은 말을 다시 한 부분(재촬영/말 더듬기) -> 마지막 테이크만 남김
  3. "음", "어" 같은 필러
  4. 각 컷 앞뒤로 여유(기본 0.1초)를 남김

사용 예:
  python3 autocut/autocut.py input.mp4 -o input_autocut.xml
  python3 autocut/autocut.py input.mp4 --media-path "D:/촬영/input.mp4" --preview preview.mp4
"""

from __future__ import annotations

import argparse
import csv
import difflib
import json
import os
import re
import subprocess
import sys
import unicodedata
from dataclasses import asdict, dataclass, field
from fractions import Fraction
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape

# --------------------------------------------------------------------------
# 데이터 구조
# --------------------------------------------------------------------------


@dataclass
class Word:
    start: float
    end: float
    text: str
    removed: str = ""  # "" = 유지, "filler" / "retake" = 삭제 사유


@dataclass
class MediaInfo:
    path: str
    duration: float
    fps: Fraction
    width: int
    height: int
    has_video: bool
    audio_streams: list[dict] = field(default_factory=list)  # [{channels, sample_rate}]

    @property
    def timebase(self) -> int:
        return round(float(self.fps))

    @property
    def ntsc(self) -> bool:
        return abs(float(self.fps) - self.timebase) > 0.001


# --------------------------------------------------------------------------
# ffmpeg / ffprobe
# --------------------------------------------------------------------------


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, check=True)


def probe(path: str) -> MediaInfo:
    out = run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path]).stdout
    data = json.loads(out)
    duration = float(data["format"].get("duration", 0))
    fps, width, height, has_video = Fraction(30000, 1001), 1920, 1080, False
    audio = []
    for s in data["streams"]:
        if s["codec_type"] == "video" and not has_video and s.get("disposition", {}).get("attached_pic", 0) == 0:
            has_video = True
            width, height = int(s["width"]), int(s["height"])
            rate = s.get("avg_frame_rate") or s.get("r_frame_rate") or "30000/1001"
            if rate in ("0/0", "0/1"):
                rate = s.get("r_frame_rate", "30000/1001")
            fps = Fraction(rate)
        elif s["codec_type"] == "audio":
            audio.append({"channels": int(s.get("channels", 2)), "sample_rate": int(s.get("sample_rate", 48000))})
    fps = snap_fps(fps)
    return MediaInfo(path, duration, fps, width, height, has_video, audio)


def snap_fps(fps: Fraction) -> Fraction:
    """23.976 같은 근사값을 정확한 NTSC 분수로 맞춘다."""
    f = float(fps)
    for base in (24, 30, 60, 120):
        if abs(f - base * 1000 / 1001) < 0.01:
            return Fraction(base * 1000, 1001)
    for base in (24, 25, 30, 48, 50, 60, 100, 120):
        if abs(f - base) < 0.01:
            return Fraction(base)
    return fps


def detect_silences(path: str, noise_db: float, min_dur: float) -> list[tuple[float, float]]:
    """ffmpeg silencedetect 로 무음 구간 목록을 얻는다."""
    proc = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-map", "0:a:0", "-af",
         f"silencedetect=noise={noise_db}dB:d={min_dur}", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"silencedetect 실패:\n{proc.stderr[-2000:]}")
    silences, start = [], None
    for line in proc.stderr.splitlines():
        m = re.search(r"silence_start: (-?[\d.]+)", line)
        if m:
            start = max(0.0, float(m.group(1)))
            continue
        m = re.search(r"silence_end: ([\d.]+)", line)
        if m and start is not None:
            silences.append((start, float(m.group(1))))
            start = None
    if start is not None:  # 파일 끝까지 무음
        silences.append((start, float("inf")))
    return silences


# --------------------------------------------------------------------------
# 음성 인식 (faster-whisper)
# --------------------------------------------------------------------------

# Whisper 는 기본적으로 필러를 지우고 받아적는다. 필러가 섞인 프롬프트를 주면
# 필러도 받아적는 경향이 생긴다.
FILLER_PROMPT = "음... 어, 그러니까 음, 제가 어... 오늘은 음 이거를, 어어 말씀드리면요."


def transcribe(path: str, model_name: str, language: str | None, device: str, compute_type: str) -> list[Word]:
    from faster_whisper import WhisperModel

    model = WhisperModel(model_name, device=device, compute_type=compute_type)
    segments, info = model.transcribe(
        path,
        language=language,
        word_timestamps=True,
        initial_prompt=FILLER_PROMPT if (language or "ko") == "ko" else "Um, uh, so, uh, I mean, um...",
        condition_on_previous_text=False,
        vad_filter=False,
        beam_size=5,
    )
    words: list[Word] = []
    for seg in segments:
        for w in seg.words or []:
            text = w.word.strip()
            if text:
                words.append(Word(round(w.start, 3), round(w.end, 3), text))
        print(f"\r  인식 중... {seg.end:7.1f}s / {info.duration:.1f}s", end="", file=sys.stderr)
    print(file=sys.stderr)
    return words


# --------------------------------------------------------------------------
# 필러 / 재촬영 판별
# --------------------------------------------------------------------------

DEFAULT_FILLER_RE = r"(음+|으+음*|어+|에+|흠+|엄+|um+|uh+m*|hm+|er+m*|ah+)"


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFC", text).lower()
    return re.sub(r"[^\w]", "", text)


def mark_fillers(words: list[Word], filler_re: str) -> None:
    pat = re.compile(rf"^{filler_re}$")
    for w in words:
        if not w.removed and pat.match(normalize(w.text)):
            w.removed = "filler"


def split_phrases(words: list[Word], gap: float) -> list[list[int]]:
    """단어를 쉼(gap) 또는 문장부호 기준으로 구(phrase) 단위로 묶는다 (필러 제외)."""
    phrases: list[list[int]] = []
    cur: list[int] = []
    prev_end = None
    for i, w in enumerate(words):
        if w.removed == "filler":
            continue
        if cur and prev_end is not None and w.start - prev_end >= gap:
            phrases.append(cur)
            cur = []
        cur.append(i)
        prev_end = w.end
        if re.search(r"[.?!。]$", w.text):
            phrases.append(cur)
            cur = []
    if cur:
        phrases.append(cur)
    return phrases


def is_retake(a: str, b: str, threshold: float, min_chars: int) -> bool:
    """구 a 가 뒤에 나온 구 b 에서 다시 말해진 것인지 판단한다."""
    if len(a) < min_chars or not b:
        return False
    if difflib.SequenceMatcher(None, a, b).ratio() >= threshold:
        return True  # 같은 문장을 통째로 다시 말함
    # a 가 중간에 끊긴 시도(false start)이고 b 가 같은 말로 시작하는 경우
    head = b[: len(a)]
    return len(a) <= len(b) and difflib.SequenceMatcher(None, a, head).ratio() >= threshold


def mark_retakes(words: list[Word], gap: float, window: int, max_dist: float,
                 threshold: float, min_chars: int) -> list[tuple[str, str]]:
    phrases = split_phrases(words, gap)
    texts = [normalize("".join(words[i].text for i in p)) for p in phrases]
    found = []
    for pi, p in enumerate(phrases):
        end_t = words[p[-1]].end
        for pj in range(pi + 1, min(len(phrases), pi + 1 + window)):
            q = phrases[pj]
            if words[q[0]].start - end_t > max_dist:
                break
            # 뒤 구를 몇 구 이어붙인 것과도 비교 (한 문장이 여러 구로 나뉜 경우)
            joined = "".join(texts[pj: pj + 3])
            if is_retake(texts[pi], texts[pj], threshold, min_chars) or \
                    is_retake(texts[pi], joined, threshold, min_chars):
                for i in p:
                    words[i].removed = "retake"
                found.append(("".join(words[i].text + " " for i in p).strip(),
                              " ".join(words[i].text for i in q)))
                break
    return found


# --------------------------------------------------------------------------
# 구간 계산
# --------------------------------------------------------------------------


def merge(intervals: list[tuple[float, float]], tol: float = 1e-6) -> list[tuple[float, float]]:
    out: list[list[float]] = []
    for s, e in sorted(intervals):
        if e - s <= tol:
            continue
        if out and s <= out[-1][1] + tol:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return [(s, e) for s, e in out]


def subtract(base: list[tuple[float, float]], cuts: list[tuple[float, float]]) -> list[tuple[float, float]]:
    result = []
    cuts = merge(cuts)
    for s, e in base:
        cur = s
        for cs, ce in cuts:
            if ce <= cur or cs >= e:
                continue
            if cs > cur:
                result.append((cur, cs))
            cur = max(cur, ce)
        if cur < e:
            result.append((cur, e))
    return result


def compute_keep(duration: float, silences: list[tuple[float, float]], words: list[Word],
                 pad: float, min_keep: float) -> list[tuple[float, float]]:
    """남길 구간 목록을 계산한다."""
    duration_cut = [(s, min(e, duration)) for s, e in silences]

    # 삭제 단어(필러/재촬영)는 앞뒤의 '남는 단어' 사이 틈 전체를 잘라낸다.
    hard: list[tuple[float, float]] = []
    removed_spans: list[tuple[float, float]] = []
    prev_end = [0.0] * len(words)  # i 이전 마지막 '남는 단어'의 끝
    last = 0.0
    for i, w in enumerate(words):
        prev_end[i] = last
        if not w.removed:
            last = max(last, w.end)
    next_start = [duration] * len(words)  # i 이후 첫 '남는 단어'의 시작
    nxt = duration
    for i in range(len(words) - 1, -1, -1):
        next_start[i] = nxt
        if not words[i].removed:
            nxt = min(nxt, words[i].start)
    for i, w in enumerate(words):
        if not w.removed:
            continue
        removed_spans.append((w.start, w.end))
        hard.append((min(prev_end[i], w.start), max(next_start[i], w.end)))

    keep = subtract([(0.0, duration)], duration_cut + hard)

    # 여유(padding): 무음 쪽으로만 늘리고 삭제된 단어 안으로는 들어가지 않는다.
    removed_spans = merge(removed_spans)
    padded = []
    for s, e in keep:
        lo = max([0.0] + [re_ for rs, re_ in removed_spans if re_ <= s + 1e-6])
        hi = min([duration] + [rs for rs, re_ in removed_spans if rs >= e - 1e-6])
        padded.append((max(lo, s - pad), min(hi, e + pad)))
    padded = merge(padded)

    # 말소리가 하나도 없는 아주 짧은 조각(잡음, 숨소리)은 버린다.
    kept_words = [(w.start, w.end) for w in words if not w.removed]
    final = []
    for s, e in padded:
        has_word = any(ws < e and we > s for ws, we in kept_words)
        if e - s >= min_keep or has_word or not words:
            final.append((s, e))
    return final


# --------------------------------------------------------------------------
# Premiere Pro 용 FCP7 XML
# --------------------------------------------------------------------------


def path_to_url(p: str) -> str:
    p = p.replace("\\", "/")
    if re.match(r"^[A-Za-z]:/", p):  # Windows 드라이브 경로
        return "file://localhost/" + quote(p, safe="/:")
    return "file://localhost" + quote(os.path.abspath(p) if not p.startswith("/") else p, safe="/")


def rate_xml(info: MediaInfo) -> str:
    return f"<rate><timebase>{info.timebase}</timebase><ntsc>{'TRUE' if info.ntsc else 'FALSE'}</ntsc></rate>"


def to_frames(t: float, info: MediaInfo) -> int:
    return round(t * float(info.fps))


def build_xml(info: MediaInfo, keep: list[tuple[float, float]], seq_name: str, media_path: str) -> str:
    rate = rate_xml(info)
    total_frames = to_frames(info.duration, info)
    file_name = os.path.basename(media_path.replace("\\", "/"))

    # 프레임 단위 클립 목록 (길이 0 제거)
    clips = []
    for s, e in keep:
        fi, fo = to_frames(s, info), min(to_frames(e, info), total_frames)
        if fo > fi:
            clips.append((fi, fo))

    n_audio = len(info.audio_streams)
    # 트랙 인덱스: V1, A1..An  /  링크 목록 생성용
    def clip_id(kind: str, track: int, idx: int) -> str:
        return f"clipitem-{kind}{track}-{idx}"

    def links(idx: int) -> str:
        parts = []
        if info.has_video:
            parts.append(f"<link><linkclipref>{clip_id('v', 1, idx)}</linkclipref><mediatype>video</mediatype>"
                         f"<trackindex>1</trackindex><clipindex>{idx}</clipindex></link>")
        for a in range(1, n_audio + 1):
            parts.append(f"<link><linkclipref>{clip_id('a', a, idx)}</linkclipref><mediatype>audio</mediatype>"
                         f"<trackindex>{a}</trackindex><clipindex>{idx}</clipindex>"
                         f"<groupindex>1</groupindex></link>")
        return "".join(parts)

    file_def_done = False

    def file_xml() -> str:
        nonlocal file_def_done
        if file_def_done:
            return '<file id="file-1"/>'
        file_def_done = True
        media = ""
        if info.has_video:
            media += (f"<video><samplecharacteristics>{rate}<width>{info.width}</width>"
                      f"<height>{info.height}</height></samplecharacteristics></video>")
        for a in info.audio_streams:
            media += (f"<audio><samplecharacteristics><depth>16</depth><samplerate>{a['sample_rate']}"
                      f"</samplerate></samplecharacteristics><channelcount>{a['channels']}</channelcount></audio>")
        return (f'<file id="file-1"><name>{escape(file_name)}</name>'
                f"<pathurl>{escape(path_to_url(media_path))}</pathurl>{rate}"
                f"<duration>{total_frames}</duration><media>{media}</media></file>")

    def clipitem(kind: str, track: int, idx: int, fi: int, fo: int, start: int) -> str:
        src = ""
        if kind == "a":
            src = f"<sourcetrack><mediatype>audio</mediatype><trackindex>{track}</trackindex></sourcetrack>"
        return (f'<clipitem id="{clip_id(kind, track, idx)}"><name>{escape(file_name)}</name>'
                f"<enabled>TRUE</enabled><duration>{total_frames}</duration>{rate}"
                f"<start>{start}</start><end>{start + fo - fi}</end><in>{fi}</in><out>{fo}</out>"
                f"{file_xml()}{src}{links(idx)}</clipitem>")

    video_items, audio_items = [], {a: [] for a in range(1, n_audio + 1)}
    pos = 0
    for idx, (fi, fo) in enumerate(clips, start=1):
        if info.has_video:
            video_items.append(clipitem("v", 1, idx, fi, fo, pos))
        for a in range(1, n_audio + 1):
            audio_items[a].append(clipitem("a", a, idx, fi, fo, pos))
        pos += fo - fi

    video_xml = ""
    if info.has_video:
        video_xml = (f"<video><format><samplecharacteristics>{rate}<width>{info.width}</width>"
                     f"<height>{info.height}</height><pixelaspectratio>square</pixelaspectratio>"
                     f"<fielddominance>none</fielddominance></samplecharacteristics></format>"
                     f"<track>{''.join(video_items)}<enabled>TRUE</enabled><locked>FALSE</locked></track></video>")
    audio_tracks = ""
    for a in range(1, n_audio + 1):
        ch = info.audio_streams[a - 1]["channels"]
        ttype = "Stereo" if ch == 2 else ("Mono" if ch == 1 else "Multichannel")
        audio_tracks += (f'<track premiereTrackType="{ttype}">{"".join(audio_items[a])}'
                         f"<enabled>TRUE</enabled><locked>FALSE</locked>"
                         f"<outputchannelindex>{min(a, 2)}</outputchannelindex></track>")
    sr = info.audio_streams[0]["sample_rate"] if info.audio_streams else 48000
    audio_xml = (f"<audio><numOutputChannels>2</numOutputChannels><format><samplecharacteristics>"
                 f"<depth>16</depth><samplerate>{sr}</samplerate></samplecharacteristics></format>"
                 f"{audio_tracks}</audio>")

    tc_fmt = "DF" if info.ntsc and info.timebase in (30, 60) else "NDF"
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n<xmeml version="4">'
            f'<sequence id="sequence-1"><name>{escape(seq_name)}</name><duration>{pos}</duration>{rate}'
            f"<timecode>{rate}<string>00:00:00:00</string><frame>0</frame><displayformat>{tc_fmt}</displayformat>"
            f"</timecode><media>{video_xml}{audio_xml}</media></sequence></xmeml>\n")


# --------------------------------------------------------------------------
# 미리보기 렌더 / 리포트
# --------------------------------------------------------------------------


def render_preview(src: str, keep: list[tuple[float, float]], out: str, info: MediaInfo, workdir: Path) -> None:
    parts, labels = [], []
    for i, (s, e) in enumerate(keep):
        if info.has_video:
            parts.append(f"[0:v]trim=start={s:.3f}:end={e:.3f},setpts=PTS-STARTPTS[v{i}];")
        parts.append(f"[0:a:0]atrim=start={s:.3f}:end={e:.3f},asetpts=PTS-STARTPTS[a{i}];")
        labels.append((f"[v{i}]" if info.has_video else "") + f"[a{i}]")
    v = 1 if info.has_video else 0
    graph = "".join(parts) + "".join(labels) + f"concat=n={len(keep)}:v={v}:a=1" + ("[v][a]" if v else "[a]")
    script = workdir / "preview_filter.txt"
    script.write_text(graph, encoding="utf-8")
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", src,
           "-filter_complex_script", str(script)]
    cmd += (["-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "23"] if v else [])
    cmd += ["-map", "[a]", "-c:a", "aac", "-b:a", "160k", out]
    run(cmd)


def write_report(path: Path, words: list[Word], keep: list[tuple[float, float]], duration: float,
                 retakes: list[tuple[str, str]]) -> None:
    removed = subtract([(0.0, duration)], keep)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        wr = csv.writer(f)
        wr.writerow(["type", "start", "end", "length", "detail"])
        for s, e in keep:
            wr.writerow(["KEEP", f"{s:.3f}", f"{e:.3f}", f"{e - s:.3f}", ""])
        for s, e in removed:
            reasons = sorted({w.removed for w in words if w.removed and w.start < e and w.end > s})
            text = " ".join(w.text for w in words if w.removed and w.start < e and w.end > s)
            wr.writerow(["CUT", f"{s:.3f}", f"{e:.3f}", f"{e - s:.3f}",
                         ("+".join(reasons) or "silence") + (f": {text}" if text else "")])
        for old, new in retakes:
            wr.writerow(["RETAKE", "", "", "", f"삭제: {old}  →  유지: {new}"])


def fmt_time(t: float) -> str:
    return f"{int(t // 60):d}:{t % 60:05.2f}"


# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="무음/필러/재촬영을 잘라낸 Premiere Pro XML 생성")
    ap.add_argument("input", help="원본 영상 파일")
    ap.add_argument("-o", "--output", help="출력 XML 경로 (기본: <입력>_autocut.xml)")
    ap.add_argument("--media-path", help="Premiere 를 실행하는 PC 에서의 원본 영상 경로 (예: D:/촬영/a.mp4)")
    ap.add_argument("--silence-db", type=float, default=-35.0, help="무음 판정 기준 dB (기본 -35)")
    ap.add_argument("--min-silence", type=float, default=0.5, help="삭제할 최소 무음 길이(초, 기본 0.5)")
    ap.add_argument("--pad", type=float, default=0.1, help="컷 앞뒤 여유(초, 기본 0.1)")
    ap.add_argument("--min-keep", type=float, default=0.2, help="말소리 없는 조각의 최소 유지 길이(초)")
    ap.add_argument("--model", default="large-v3-turbo", help="Whisper 모델 (기본 large-v3-turbo)")
    ap.add_argument("--language", default="ko", help="언어 코드 (기본 ko)")
    ap.add_argument("--device", default="auto", help="cpu / cuda / auto")
    ap.add_argument("--compute-type", default="auto", help="int8 / float16 / auto")
    ap.add_argument("--transcript", help="저장된 단어 타임스탬프 JSON 재사용 (음성인식 생략)")
    ap.add_argument("--no-transcribe", action="store_true", help="음성인식 없이 무음만 자르기")
    ap.add_argument("--fillers", default=DEFAULT_FILLER_RE, help="필러 정규식 (단어 전체 일치)")
    ap.add_argument("--no-fillers", action="store_true", help="필러 삭제 끄기")
    ap.add_argument("--no-retakes", action="store_true", help="재촬영 판별 끄기")
    ap.add_argument("--retake-threshold", type=float, default=0.75, help="재촬영 유사도 기준 0~1 (기본 0.75)")
    ap.add_argument("--retake-min-chars", type=int, default=4, help="재촬영으로 볼 최소 글자 수")
    ap.add_argument("--retake-window", type=int, default=4, help="몇 구(phrase) 뒤까지 비교할지")
    ap.add_argument("--retake-max-gap", type=float, default=15.0, help="재촬영 사이 최대 간격(초)")
    ap.add_argument("--phrase-gap", type=float, default=0.35, help="구를 나누는 쉼 길이(초)")
    ap.add_argument("--preview", help="결과 미리보기 mp4 경로 (지정 시 렌더)")
    args = ap.parse_args(argv)

    src = args.input
    if not os.path.exists(src):
        ap.error(f"파일이 없습니다: {src}")
    stem = Path(src).with_suffix("")
    out_xml = Path(args.output) if args.output else Path(f"{stem}_autocut.xml")
    workdir = out_xml.parent
    workdir.mkdir(parents=True, exist_ok=True)

    info = probe(src)
    if not info.audio_streams:
        ap.error("오디오 트랙이 없는 영상입니다.")
    print(f"[1/4] 영상 정보: {info.width}x{info.height}, {float(info.fps):.3f}fps, "
          f"{fmt_time(info.duration)}, 오디오 {len(info.audio_streams)}트랙", file=sys.stderr)

    print(f"[2/4] 무음 감지 ({args.silence_db}dB, {args.min_silence}s 이상)", file=sys.stderr)
    silences = detect_silences(src, args.silence_db, args.min_silence)
    print(f"  무음 구간 {len(silences)}개", file=sys.stderr)

    words: list[Word] = []
    retakes: list[tuple[str, str]] = []
    if args.transcript:
        words = [Word(**{k: d[k] for k in ("start", "end", "text")}) for d in json.load(open(args.transcript, encoding="utf-8"))]
    elif not args.no_transcribe:
        print(f"[3/4] 음성 인식 (Whisper {args.model})", file=sys.stderr)
        words = transcribe(src, args.model, args.language, args.device, args.compute_type)
        tpath = Path(f"{out_xml.with_suffix('')}_words.json")
        tpath.write_text(json.dumps([{"start": w.start, "end": w.end, "text": w.text} for w in words],
                                    ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"  단어 {len(words)}개 -> {tpath}", file=sys.stderr)

    if words:
        if not args.no_fillers:
            mark_fillers(words, args.fillers)
        if not args.no_retakes:
            retakes = mark_retakes(words, args.phrase_gap, args.retake_window, args.retake_max_gap,
                                   args.retake_threshold, args.retake_min_chars)
        n_f = sum(w.removed == "filler" for w in words)
        print(f"  필러 {n_f}개, 재촬영 {len(retakes)}건", file=sys.stderr)
        for old, new in retakes:
            print(f"    - 삭제: {old}\n      유지: {new}", file=sys.stderr)

    keep = compute_keep(info.duration, silences, words, args.pad, args.min_keep)
    kept = sum(e - s for s, e in keep)
    print(f"[4/4] 클립 {len(keep)}개, {fmt_time(info.duration)} -> {fmt_time(kept)} "
          f"({kept / info.duration * 100:.0f}%)", file=sys.stderr)

    media_path = args.media_path or os.path.abspath(src)
    out_xml.write_text(build_xml(info, keep, Path(src).stem + "_autocut", media_path), encoding="utf-8")
    report = Path(f"{out_xml.with_suffix('')}_cuts.csv")
    write_report(report, words, keep, info.duration, retakes)
    print(f"  XML: {out_xml}\n  컷 목록: {report}", file=sys.stderr)

    if args.preview:
        render_preview(src, keep, args.preview, info, workdir)
        print(f"  미리보기: {args.preview}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
