from pathlib import Path
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
src_path = ROOT / 'public/generated/sa-functional-phone-shell.png'
out_path = ROOT / 'public/generated/sa-functional-phone-frame.png'
crop_path = ROOT / 'public/generated/sa-functional-phone-frame-crop.png'
isolated_shell_path = ROOT / 'public/generated/sa-functional-phone-shell-isolated.png'
isolated_frame_path = ROOT / 'public/generated/sa-functional-phone-frame-isolated.png'
preview_path = ROOT / 'qa/sa-functional-phone-frame-preview.png'

src = Image.open(src_path).convert('RGBA')
W, H = src.size

# A rounded reference screen is perspective-warped into the exact glass opening
# of the generated phone. Coordinates were measured from the 1024x1536 source.
rw, rh = 430, 1080
reference = Image.new('L', (rw, rh), 0)
d = ImageDraw.Draw(reference)
d.rounded_rectangle((4, 4, rw - 5, rh - 5), radius=54, fill=255)

# Source reference corners -> measured destination corners in the phone render.
src_pts = np.array([[0, 0], [rw - 1, 0], [rw - 1, rh - 1], [0, rh - 1]], dtype=float)
dst_pts = np.array([[313, 240], [708, 255], [719, 1282], [307, 1298]], dtype=float)

# PIL expects an output->input projective mapping.
def homography(from_pts, to_pts):
    rows = []
    vals = []
    for (x, y), (u, v) in zip(from_pts, to_pts):
        rows += [
            [x, y, 1, 0, 0, 0, -u*x, -u*y],
            [0, 0, 0, x, y, 1, -v*x, -v*y],
        ]
        vals += [u, v]
    h = np.linalg.solve(np.asarray(rows, float), np.asarray(vals, float))
    return (*h, 1.0)

# Map destination phone pixels back into the rectangular reference mask.
Hmat = homography(dst_pts, src_pts)
coeffs = (Hmat[0], Hmat[1], Hmat[2], Hmat[3], Hmat[4], Hmat[5], Hmat[6], Hmat[7])
warped = reference.transform((W, H), Image.Transform.PERSPECTIVE, coeffs, resample=Image.Resampling.BICUBIC)
warped = warped.filter(ImageFilter.GaussianBlur(0.45))

# Keep the Dynamic Island physically above the live screen.
island = Image.new('L', (W, H), 0)
idraw = ImageDraw.Draw(island)
idraw.rounded_rectangle((474, 258, 590, 296), radius=22, fill=255)

alpha = Image.eval(warped, lambda p: 255 - p)
alpha = Image.composite(Image.new('L', (W, H), 255), alpha, island)
frame = src.copy()
frame.putalpha(alpha)
frame.save(out_path, optimize=True)

# Tight cinematic crop: keeps atmospheric floor/smoke while letting the phone
# occupy the hero instead of floating small inside the original 2:3 canvas.
crop_box = (180, 140, 844, 1400)
frame.crop(crop_box).save(crop_path, optimize=True)
if isolated_shell_path.exists():
    isolated_shell = Image.open(isolated_shell_path).convert('RGBA')
    cropped_frame = Image.open(crop_path).convert('RGBA')
    isolated_shell.putalpha(ImageChops.darker(isolated_shell.getchannel('A'), cropped_frame.getchannel('A')))
    isolated_shell.save(isolated_frame_path, optimize=True)

# Checker preview makes transparency obvious during QA.
checker = Image.new('RGBA', (W, H), (20, 20, 24, 255))
cdraw = ImageDraw.Draw(checker)
for y in range(0, H, 48):
    for x in range(0, W, 48):
        if (x // 48 + y // 48) % 2 == 0:
            cdraw.rectangle((x, y, x + 47, y + 47), fill=(48, 48, 56, 255))
checker.alpha_composite(frame)
preview_path.parent.mkdir(parents=True, exist_ok=True)
checker.save(preview_path)
print(out_path)
print(crop_path)
if isolated_frame_path.exists():
    print(isolated_frame_path)
print(preview_path)
