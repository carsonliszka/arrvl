from collections import Counter
from pathlib import Path

SCALE = 2
SRC = Path(r"c:\Users\apollo\Downloads\ascii-art (1).txt")

raw = SRC.read_text(encoding="utf-8")
lines = [line for line in raw.splitlines() if line.strip()]

min_col = len(lines[0])
max_col = 0
for line in lines:
    for i, ch in enumerate(line):
        if ch != " ":
            min_col = min(min_col, i)
            max_col = max(max_col, i)
lines = [line[min_col : max_col + 1] for line in lines]

h = len(lines)
w = max(len(line) for line in lines)
grid = [list(line.ljust(w)) for line in lines]


def block_char(cells: list[str]) -> str:
    ink = [c for c in cells if c != " "]
    if not ink:
        return " "
    return Counter(ink).most_common(1)[0][0]


scaled: list[str] = []
for y in range(0, h, SCALE):
    row: list[str] = []
    for x in range(0, w, SCALE):
        cells = [
            grid[yy][xx]
            for yy in range(y, min(y + SCALE, h))
            for xx in range(x, min(x + SCALE, w))
        ]
        row.append(block_char(cells))
    scaled.append("".join(row))

lines = [line for line in scaled if line.strip()]
width = max(len(line) for line in lines)
lines = [line.ljust(width) for line in lines]

art = "\n".join(lines)
escaped = art.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

out = Path(__file__).resolve().parents[1] / "app/lib/console-logo-ascii.ts"
out.write_text(
    "/** ARRVL console mark — ascii-art (1).txt @ 1/2 scale */\n"
    "export const CONSOLE_LOGO_ASCII = `"
    + escaped
    + "`\n",
    encoding="utf-8",
)
print(f"wrote {out} ({len(lines)} lines x {width} cols)")
