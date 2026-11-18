#!/usr/bin/env python3
"""Bake a readable recipe onto the blank paper photos for the samsung section.

Generated images never contain generated text (KIT §9), so the paper is generated blank and the
recipe is drawn here with the deck's own fonts. The lines match what the slides teach:
"1 pound carrots, young ones if possible" (parse) and "1/2 tsp salt" (errors).

Usage: python3 tools/recipe-text.py        (run from the deck folder)
"""
import math, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

DECK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(DECK, 'design', 'raw')
F_HAND = os.path.join(DECK, 'assets', 'fonts', 'Caveat.ttf')
F_DISP = os.path.join(DECK, 'assets', 'fonts', 'Fraunces.ttf')
F_BODY = os.path.join(DECK, 'assets', 'fonts', 'Figtree.ttf')

INK = (38, 52, 92)        # fountain-pen blue-black
PRINT = (54, 44, 36)      # printing ink on cream paper


def font(path, size, variation=None):
    f = ImageFont.truetype(path, size)
    if variation:
        try:
            f.set_variation_by_name(variation)
        except Exception:
            pass
    return f


def block(img, lines, angle, color, alpha=238, blur=0.7):
    """lines = [(text, font, x, y_baseline, jitter_deg)] in final-image coordinates.
       The whole block is drawn flat, then rotated by `angle` about its own centre."""
    ov = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    xs, ys = [], []
    for t, f, x, y, j in lines:
        d.text((x, y), t, font=f, fill=color + (alpha,), anchor='ls')
        b = d.textbbox((x, y), t, font=f, anchor='ls')
        xs += [b[0], b[2]]; ys += [b[1], b[3]]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    ov = ov.rotate(angle, resample=Image.BICUBIC, center=(cx, cy))
    if blur:
        ov = ov.filter(ImageFilter.GaussianBlur(blur))
    img.alpha_composite(ov)
    return img


# ---------------------------------------------------------------- recipe card (problem slide)
def recipe_card():
    im = Image.open(os.path.join(RAW, 'sm-card-blank.png')).convert('RGBA')
    ang = 3.7                                  # the card's tilt in the photo (counter-clockwise)
    title = font(F_HAND, 82, 'Bold')
    body = font(F_HAND, 62)
    X = 195
    rows = [
        (' Carrot & Potato Stew', title, X, 268, 0),
        ('1 pound carrots, young ones if possible', body, X, 414, 0),
        ('2 potatoes, diced', body, X, 484, 0),
        ('1 onion, chopped', body, X, 554, 0),
        ('½ tsp salt', body, X, 624, 0),
        ('2 tbsp olive oil', body, X, 694, 0),
        ('Simmer 40 minutes, until soft.', body, X, 804, 0),
    ]
    block(im, rows, ang, INK)
    # underline the title, by hand
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.line([(X + 6, 292), (X + 640, 284)], fill=INK + (210,), width=5)
    ov = ov.rotate(ang, resample=Image.BICUBIC, center=(X + 320, 288))
    im.alpha_composite(ov.filter(ImageFilter.GaussianBlur(.8)))
    out = im.convert('RGB').crop((45, 45, 1505, 963)).resize((1400, 880), Image.LANCZOS)
    out.save(os.path.join(DECK, 'assets/img/samsung/recipe-card.jpg'), quality=88)
    print('recipe-card.jpg', out.size)


# ---------------------------------------------------------------- printed page (read slide)
def page():
    im = Image.open(os.path.join(RAW, 'sm-page-blank.png')).convert('RGBA')
    title = font(F_DISP, 64, 'Bold')
    cap = font(F_BODY, 27, 'SemiBold')
    body = font(F_BODY, 37)
    X = 845
    rows = [
        ('Carrot Stew', title, X, 300, 0),
        ('SERVES FOUR', cap, X, 345, 0),
        ('1 pound carrots', body, X, 436, 0),
        ('2 potatoes, diced', body, X, 490, 0),
        ('1 onion, chopped', body, X, 544, 0),
        ('½ tsp salt', body, X, 598, 0),
        ('2 tbsp olive oil', body, X, 652, 0),
        ('Simmer 40 minutes,', body, X, 730, 0),
        ('until soft.', body, X, 778, 0),
    ]
    block(im, rows, 0, PRINT, alpha=232, blur=.5)
    out = im.convert('RGB').crop((756, 108, 1336, 898)).resize((580, 790), Image.LANCZOS)
    out.save(os.path.join(DECK, 'assets/img/samsung/page.jpg'), quality=88)
    print('page.jpg', out.size)


# ------------------------------------------------- cookbook (takeaways background, no text)
def cookbook():
    from PIL import ImageEnhance
    im = Image.open(os.path.join(RAW, 'sm-cookbook-blank.png')).convert('RGB')
    im = im.resize((1920, 1280), Image.LANCZOS).crop((0, 100, 1920, 1180))
    im = ImageEnhance.Brightness(im).enhance(1.35)
    im.save(os.path.join(DECK, 'assets/img/samsung/cookbook.jpg'), quality=88)
    print('cookbook.jpg', im.size)


# ------------------------------------------------- intro cut-out (agenda row + section opener)
def intro_card():
    im = Image.open(os.path.join(RAW, 'intro-card-blank.png')).convert('RGBA')
    # kill the coloured fringe the generator leaves around the cut edge
    a = im.getchannel('A').point(lambda v: 0 if v < 24 else (255 if v > 235 else v))
    im.putalpha(a)
    ang = 1.6
    title = font(F_HAND, 66, 'Bold')
    body = font(F_HAND, 52)
    X = 108
    rows = [
        ('Carrot Stew', title, X, 322, 0),
        ('1 lb carrots', body, X, 436, 0),
        ('2 potatoes', body, X, 494, 0),
        ('1 onion', body, X, 552, 0),
        ('½ tsp salt', body, X, 610, 0),
        ('2 tbsp olive oil', body, X, 668, 0),
        ('Simmer 40 min.', body, X, 782, 0),
    ]
    block(im, rows, ang, INK)
    im.putalpha(Image.composite(im.getchannel('A'), im.getchannel('A'), a))
    tmp = os.path.join(RAW, 'intro-card-text.png')
    im.save(tmp)
    os.system('python3 %s %s %s 900' % (os.path.join(DECK, 'tools/cutout.py'), tmp,
                                        os.path.join(DECK, 'assets/img/intro/card.webp')))


if __name__ == '__main__':
    recipe_card(); page(); cookbook(); intro_card()
