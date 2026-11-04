import numpy as np
from PIL import Image
D = '/Users/reyriordan/Documents/AIFM_Task5/deck'
im = Image.open(D + '/assets/img/intro/salesperson-v2.png').convert('RGB')
im.save(D + '/assets/img/salesperson-assembled.jpg', quality=90)
W, H = im.size
C = np.asarray(im).astype(np.float32)
B = np.array([30.0, 27.0, 28.0])
a = np.clip((C - B) / (255.0 - B), 0, 1).max(axis=2)
a = np.clip((a - 0.012) / (1 - 0.012), 0, 1)
F = np.clip(B + (C - B) / np.maximum(a, 1e-4)[..., None], 0, 255)
ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
def ramp(v, lo, hi):
    t = np.clip((v - lo) / (hi - lo), 0, 1); return t * t * (3 - 2 * t)
m_up   = 1 - ramp(ys, 503, 523)          # above the neck gap
m_rt   = ramp(xs, 1020, 1040)            # right of the bubble
m_bub  = m_up * (1 - m_rt)
m_head = m_up * m_rt
m_body = 1 - m_up
for name, m in (('assist', m_bub), ('interact', m_head), ('price', m_body)):
    Image.fromarray(np.dstack([F, np.clip(a * m, 0, 1) * 255.0]).astype(np.uint8)).save(
        '%s/assets/img/intro/part-%s.png' % (D, name), optimize=True)
acc = np.tile(B, (H, W, 1))
for m in (m_body, m_bub, m_head):
    al = (a * m)[..., None]; acc = al * F + (1 - al) * acc
print('recomposite err max %.1f mean %.2f' % (np.abs(acc - C).max(), np.abs(acc - C).mean()))
bg = (30, 27, 28); sheet = Image.new('RGB', (W, H * 3), bg)
for i, n in enumerate(('price', 'assist', 'interact')):
    p = Image.open('%s/assets/img/intro/part-%s.png' % (D, n))
    c = Image.new('RGB', (W, H), bg); c.paste(p, (0, 0), p); sheet.paste(c, (0, i * H))
sheet.resize((W // 2, H * 3 // 2)).save('/private/tmp/claude-501/-Users-reyriordan-Documents-AIFM-Task5/6aa0c8b6-08e2-452c-b748-f0f2f4937c27/scratchpad/parts2.png')
