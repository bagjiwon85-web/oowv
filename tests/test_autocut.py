import json
import subprocess
import sys
import xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "autocut"))
import autocut as ac  # noqa: E402


def W(s, e, t):
    return ac.Word(s, e, t)


def test_fillers_marked_only_as_whole_words():
    words = [W(0, .3, "음,"), W(.4, .7, "어..."), W(.8, 1.2, "어제"), W(1.3, 1.5, "음음"), W(1.6, 2, "음식")]
    ac.mark_fillers(words, ac.DEFAULT_FILLER_RE)
    assert [w.removed for w in words] == ["filler", "filler", "", "filler", ""]


def test_retake_keeps_last_take():
    words = [
        W(0.0, 0.4, "오늘은"), W(0.5, 0.9, "제가"), W(1.0, 1.3, "소개할"),       # 끊긴 1차 시도
        W(2.5, 2.9, "오늘은"), W(3.0, 3.4, "제가"), W(3.5, 3.9, "소개해"),        # 2차 시도
        W(4.0, 4.4, "드릴"),  # 쉼 없이 이어짐
        W(5.5, 5.9, "오늘은"), W(6.0, 6.4, "제가"), W(6.5, 6.9, "소개해"), W(7.0, 7.3, "드릴"),
        W(7.4, 7.9, "제품입니다."),                                             # 최종 테이크
        W(9.0, 9.5, "가격은"), W(9.6, 10.0, "만원입니다."),
    ]
    found = ac.mark_retakes(words, gap=0.35, window=4, max_dist=15, threshold=0.75, min_chars=4)
    assert len(found) == 2
    assert all(w.removed == "retake" for w in words[:7])
    assert not any(w.removed for w in words[7:])


def test_retake_ignores_unrelated_sentences():
    words = [W(0, .5, "안녕하세요."), W(1.5, 2, "반갑습니다."), W(3, 3.5, "오늘은"), W(3.6, 4, "날씨가"), W(4.1, 4.5, "좋네요.")]
    assert ac.mark_retakes(words, 0.35, 4, 15, 0.75, 4) == []


def test_compute_keep_silence_and_padding():
    # 0~1 말, 1~2 무음, 2~3 말
    keep = ac.compute_keep(3.0, [(1.0, 2.0)], [W(0.1, 0.9, "가나"), W(2.1, 2.9, "다라")], pad=0.1, min_keep=0.2)
    assert keep == [(0.0, 1.1), (1.9, 3.0)]


def test_compute_keep_filler_padding_does_not_reenter_filler():
    words = [W(0.0, 1.0, "안녕"), W(1.05, 1.45, "음"), W(1.5, 2.5, "하세요")]
    ac.mark_fillers(words, ac.DEFAULT_FILLER_RE)
    keep = ac.compute_keep(2.5, [], words, pad=0.1, min_keep=0.2)
    assert keep == [(0.0, 1.05), (1.45, 2.5)]


def test_frames_and_ntsc():
    info = ac.MediaInfo("x.mp4", 10, ac.snap_fps(Fraction(2997, 100)), 1920, 1080, True,
                        [{"channels": 2, "sample_rate": 48000}])
    assert info.fps == Fraction(30000, 1001) and info.timebase == 30 and info.ntsc
    assert ac.to_frames(1.0, info) == 30


def test_path_to_url():
    assert ac.path_to_url("C:\\영상\\a b.mp4") == "file://localhost/C:/%EC%98%81%EC%83%81/a%20b.mp4"
    assert ac.path_to_url("/Users/me/a.mp4") == "file://localhost/Users/me/a.mp4"


@pytest.fixture(scope="module")
def sample(tmp_path_factory):
    """톤(말 대신) 1s / 무음 1s / 톤 1s / 무음 0.3s / 톤 1s 짜리 테스트 영상."""
    d = tmp_path_factory.mktemp("media")
    out = d / "sample.mp4"
    tone = "sine=frequency=440:sample_rate=48000"
    graph = (f"{tone}:duration=1[t1];anullsrc=r=48000:cl=mono,atrim=duration=1[s1];"
             f"{tone}:duration=1[t2];anullsrc=r=48000:cl=mono,atrim=duration=0.3[s2];"
             f"{tone}:duration=1[t3];[t1][s1][t2][s2][t3]concat=n=5:v=0:a=1,aformat=channel_layouts=stereo[a]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i",
                    "testsrc2=size=640x360:rate=30000/1001:duration=4.3",
                    "-filter_complex", graph, "-map", "0:v", "-map", "[a]",
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(out)], check=True)
    return out


def test_end_to_end_xml(sample, tmp_path):
    words = [{"start": 0.05, "end": 0.95, "text": "첫번째"}, {"start": 2.05, "end": 2.95, "text": "두번째"},
             {"start": 3.35, "end": 4.25, "text": "세번째"}]
    tpath = tmp_path / "w.json"
    tpath.write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
    xml_path = tmp_path / "out.xml"
    preview = tmp_path / "preview.mp4"
    assert ac.main([str(sample), "-o", str(xml_path), "--transcript", str(tpath),
                    "--media-path", "D:/촬영/sample.mp4", "--preview", str(preview)]) == 0

    root = ET.parse(xml_path).getroot()
    seq = root.find("sequence")
    assert seq.find("rate/timebase").text == "30" and seq.find("rate/ntsc").text == "TRUE"
    vclips = seq.findall("media/video/track/clipitem")
    aclips = seq.findall("media/audio/track/clipitem")
    assert len(vclips) == 2 and len(aclips) == 2  # 1초 무음만 잘리고 0.3초 무음은 유지
    # 타임라인 상 클립이 빈틈 없이 이어진다
    assert int(vclips[0].find("end").text) == int(vclips[1].find("start").text)
    # 첫 클립 out ≈ (1.0 + 0.1)s, 두번째 in ≈ (2.0 - 0.1)s
    assert abs(int(vclips[0].find("out").text) - 33) <= 1
    assert abs(int(vclips[1].find("in").text) - 57) <= 1
    assert "file://localhost/D:/" in ET.tostring(root, encoding="unicode")
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                str(preview)], capture_output=True, text=True).stdout)
    assert abs(dur - 3.5) < 0.15
