#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent
pages_dir = root / 'qa' / 'pages'
paths = sorted(pages_dir.glob('page-*.png'))
if not paths:
    raise SystemExit('No rendered pages found')
thumb_w = 255
cols = 4
margin = 20
label_h = 26
thumbs = []
for path in paths:
    image = Image.open(path).convert('RGB')
    thumb_h = round(image.height * thumb_w / image.width)
    image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
    thumbs.append((path, image.copy(), thumb_h))
rows = (len(thumbs) + cols - 1) // cols
cell_h = max(h for _, _, h in thumbs) + label_h
sheet = Image.new('RGB', (margin + cols * (thumb_w + margin), margin + rows * (cell_h + margin)), '#d8d2c8')
draw = ImageDraw.Draw(sheet)
for i, (path, image, h) in enumerate(thumbs):
    x = margin + (i % cols) * (thumb_w + margin)
    y = margin + (i // cols) * (cell_h + margin)
    sheet.paste(image, (x, y + label_h))
    draw.text((x, y + 5), path.stem.replace('page-', 'PAGE '), fill='#161b25')
out = root / 'qa' / 'Stay-Automatic-Field-Manual-contact-sheet.jpg'
out.parent.mkdir(parents=True, exist_ok=True)
sheet.save(out, quality=88, optimize=True)
print(out)
