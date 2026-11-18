"""Clean a generated transparent PNG and save it as WebP for the deck.
Usage: python3 tools/cutout.py <in.png> <out.webp> [max_side=900]
Clamps near-opaque alpha to 255, drops near-zero alpha, trims to content, resizes."""
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
mx = int(sys.argv[3]) if len(sys.argv) > 3 else 900
im = Image.open(src).convert('RGBA')
a = im.getchannel('A').point(lambda v: 0 if v < 8 else (255 if v > 240 else v))
im.putalpha(a)
im = im.crop(a.getbbox())
s = mx / max(im.size)
if s < 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
im.save(dst, 'WEBP', quality=88, method=6)
print(dst, im.size)
