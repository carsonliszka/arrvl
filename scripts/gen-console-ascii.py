"""Generate fixed-width console ASCII from arrvl_logo.png."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
img = Image.open(ROOT / "public/logos/arrvl_logo.png").convert("L")

# Console glyphs are ~2x taller than wide — compensate in resize.
cols = 62
rows = int(img.height * (cols / img.width) * 0.5)
img = img.resize((cols, rows), Image.Resampling.LANCZOS)

pixels = img.load()
for y in range(rows):
    for x in range(cols):
        pixels[x, y] = 255 if pixels[x, y] > 128 else 0

# Sparse → dense; reads like Merlin on dark consoles.
chars = " .'`#*@"

lines: list[str] = []
for y in range(rows):
    row = []
    for x in range(cols):
        p = pixels[x, y]
        idx = int(p * (len(chars) - 1) / 255)
        row.append(chars[idx])
    lines.append("".join(row))

# Trim empty vertical padding only (keep line width).
def has_ink(line: str) -> bool:
    return any(c != " " for c in line)

while lines and not has_ink(lines[0]):
    lines.pop(0)
while lines and not has_ink(lines[-1]):
    lines.pop()

width = max(len(line) for line in lines)
lines = [line.ljust(width) for line in lines]

art = "\n".join(lines)
print(art)
print("---")
print(f"lines={len(lines)} width={width}")
print("---TS---")
for line in lines:
    print(f"  '{line}',")
