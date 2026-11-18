#!/usr/bin/env python3
"""Capture every build step of every slide, plus the print (final) state, with agent-browser.

Usage:  python3 decks/automated-selling/tools/capture.py <unit|all> <outdir>
  unit = intro | airbnb | rufus | griffin | tavus | future   (intro also covers refs)
Writes  <outdir>/<unit>/<slideId>-s<k>.png, <slideId>-print.png and <outdir>/<unit>/manifest.json.
Each unit uses its own browser session, so several captures can run at once.
"""
import hashlib, json, os, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

DECK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UNITS = ['intro', 'airbnb', 'rufus', 'griffin', 'tavus', 'future']
SECS = {u: [u] for u in UNITS}
SECS['intro'] = ['intro', 'refs']


def ab(session, *args, check=True):
    r = subprocess.run(['agent-browser', '--session', session, *args], capture_output=True, text=True, timeout=120)
    if check and r.returncode != 0:
        raise RuntimeError('agent-browser %s failed: %s %s' % (args[0], r.stdout, r.stderr))
    return r.stdout.strip()


def ev(session, js):
    out = ab(session, 'eval', js)
    v = json.loads(out) if out else None
    return json.loads(v) if isinstance(v, str) else v


def wait_ready(session):
    for _ in range(50):
        if ev(session, "JSON.stringify(document.documentElement.getAttribute('data-ready'))") == '1':
            return
        time.sleep(0.2)


SETTLE = "Deck.finishStep(); Deck.finishStep(); JSON.stringify(Deck.state())"


def capture(unit, outdir):
    tag = hashlib.md5(os.path.abspath(outdir).encode()).hexdigest()[:6]
    s = 'bts-cap-%s-%s' % (unit, tag)
    d = os.path.join(outdir, unit)
    os.makedirs(d, exist_ok=True)
    url = 'file://%s/index.html' % DECK
    ab(s, 'set', 'viewport', '1920', '1080')
    ab(s, 'open', url + '?r=%s' % tag + '#/intro/title')
    wait_ready(s)
    ab(s, 'errors', '--clear', check=False)
    meta = ev(s, "JSON.stringify(Deck.slides.map(function(x,i){var d=x.def;return {index:i,sec:x.sec.id,id:d.id,title:d.title||'',heading:d.heading||'',budgetSec:d.budgetSec||0,notes:d.notes||''}}))")
    mine = [m for m in meta if m['sec'] in SECS[unit]]
    for m in mine:
        st = ev(s, 'Deck.go(%d); ' % m['index'] + SETTLE)
        time.sleep(0.6)
        ev(s, SETTLE)
        if st['index'] != m['index']:
            raise RuntimeError('could not reach slide %s' % m['id'])
        m['steps'] = st['steps']
        m['images'] = []
        for k in range(st['steps']):
            if k > 0:
                ev(s, 'Deck.next(); ' + SETTLE)
                time.sleep(0.35)
                ev(s, SETTLE)
            p = os.path.join(d, '%s-s%d.png' % (m['id'], k))
            ab(s, 'screenshot', p)
            m['images'].append(p)
    show_errors = ab(s, 'errors', check=False)
    for m in mine:
        ab(s, 'open', url + '?preview=%d&r=%s' % (m['index'], tag))
        wait_ready(s)
        time.sleep(0.4)
        p = os.path.join(d, '%s-print.png' % m['id'])
        ab(s, 'screenshot', p)
        m['print'] = p
    print_errors = ab(s, 'errors', check=False)
    ab(s, 'close', check=False)
    man = {'unit': unit, 'errors_show': show_errors, 'errors_print': print_errors, 'slides': mine}
    with open(os.path.join(d, 'manifest.json'), 'w') as f:
        json.dump(man, f, indent=1)
    n = sum(len(m['images']) for m in mine)
    return '%s: %d slides, %d step shots, errors(show)=%r errors(print)=%r' % (unit, len(mine), n, show_errors, print_errors)


if __name__ == '__main__':
    if len(sys.argv) != 3 or (sys.argv[1] != 'all' and sys.argv[1] not in UNITS):
        sys.exit(__doc__)
    units = UNITS if sys.argv[1] == 'all' else [sys.argv[1]]
    with ThreadPoolExecutor(len(units)) as ex:
        for line in ex.map(lambda u: capture(u, sys.argv[2]), units):
            print(line)
