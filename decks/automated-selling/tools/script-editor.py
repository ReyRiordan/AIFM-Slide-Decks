#!/usr/bin/env python3
"""Script editor for the deck: live slide on the left, that slide's speaker notes on the right.

Run from anywhere:   python3 decks/automated-selling/tools/script-editor.py      (then open the printed URL)

Saving writes the notes straight back into sections/NN-*.js as a '…' + '…' string,
keeping any // comments that sat inside the old notes expression. No dependencies.
"""
import http.server, json, os, re, socketserver, sys, webbrowser

DECK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECTIONS = os.path.join(DECK, 'sections')
PORT = int(os.environ.get('PORT', '8765'))
WRAP = 128  # target line width for re-emitted string pieces


# ---------- tiny JS string-concat parser ----------
def parse_expr(src, i):
    """Parse `'a' + "b" + 'c'` (with // and /* */ comments) starting at i.
    Returns (value, comments, end_index) where end_index points just past the last literal."""
    parts, comments, end = [], [], i
    expect_lit = True
    n = len(src)
    while i < n:
        c = src[i]
        if c in ' \t\r\n':
            i += 1
        elif src.startswith('//', i):
            j = src.find('\n', i); j = n if j < 0 else j
            comments.append(src[i:j].strip()); i = j
        elif src.startswith('/*', i):
            j = src.find('*/', i) + 2
            comments.append(src[i:j].strip()); i = j
        elif expect_lit and c in '\'"`':
            val, i = read_str(src, i)
            parts.append(val); end = i; expect_lit = False
        elif not expect_lit and c == '+':
            expect_lit = True; i += 1
        else:
            break
    if not parts:
        raise ValueError('notes is not a string literal')
    return ''.join(parts), comments, end


ESC = {'n': '\n', 't': '\t', 'r': '\r', 'b': '\b', 'f': '\f', 'v': '\v', '0': '\0'}

def read_str(src, i):
    q = src[i]; i += 1; out = []
    while True:
        c = src[i]
        if c == '\\':
            d = src[i + 1]
            if d == 'u':
                if src[i + 2] == '{':
                    j = src.index('}', i); out.append(chr(int(src[i + 3:j], 16))); i = j + 1
                else:
                    out.append(chr(int(src[i + 2:i + 6], 16))); i += 6
                continue
            if d == 'x':
                out.append(chr(int(src[i + 2:i + 4], 16))); i += 4; continue
            if d == '\n':
                i += 2; continue
            out.append(ESC.get(d, d)); i += 2
        elif c == q:
            return ''.join(out), i + 1
        elif q == '`' and src.startswith('${', i):
            raise ValueError('template interpolation in notes is not supported')
        else:
            out.append(c); i += 1


def js_quote(s):
    s = s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
    return "'" + s + "'"


def emit_expr(text, comments, indent):
    """Split into pieces at [click] markers, then wrap long pieces at spaces."""
    chunks = re.split(r'(?=\[click\])', text)
    pieces = []
    for ch in chunks:
        while len(ch) > WRAP:
            cut = ch.rfind(' ', 0, WRAP)
            if cut <= 0: break
            pieces.append(ch[:cut + 1]); ch = ch[cut + 1:]
        if ch: pieces.append(ch)
    if not pieces: pieces = ['']
    head = ''.join('\n' + indent + c for c in comments)
    return head + '\n' + ' +\n'.join(indent + js_quote(p) for p in pieces)


# ---------- locate slides ----------
SEC_ID = re.compile(r"Deck\.section\(\s*\{[^}]*?\bid:\s*'([^']+)'", re.S)
SLIDE_ID = re.compile(r"\bid:\s*'([^']+)'")
NOTES = re.compile(r"\bnotes:")

def section_files():
    out = {}
    for f in sorted(os.listdir(SECTIONS)):
        if not f.endswith('.js'): continue
        p = os.path.join(SECTIONS, f)
        src = open(p, encoding='utf-8').read()
        m = SEC_ID.search(src)
        if m: out[m.group(1)] = p
    return out


def find_notes(src, slide_id):
    """Return (value_start, value_end, value, comments, indent) for the notes of slide_id."""
    for m in SLIDE_ID.finditer(src):
        if m.group(1) != slide_id: continue
        nxt = SLIDE_ID.search(src, m.end())
        limit = nxt.start() if nxt else len(src)
        n = NOTES.search(src, m.end(), limit)
        if not n: continue
        start = n.end()
        value, comments, end = parse_expr(src, start)
        line_start = src.rfind('\n', 0, n.start()) + 1
        indent = re.match(r'[ \t]*', src[line_start:]).group(0) + '  '
        return start, end, value, comments, indent
    raise KeyError(slide_id)


def get_all():
    data = {}
    for sec, p in section_files().items():
        src = open(p, encoding='utf-8').read()
        data[sec] = {'file': os.path.relpath(p, DECK), 'slides': {}}
        for m in SLIDE_ID.finditer(src):
            sid = m.group(1)
            if sid in data[sec]['slides']: continue
            try:
                data[sec]['slides'][sid] = find_notes(src, sid)[2]
            except (KeyError, ValueError):
                pass
    return data


class Conflict(Exception):
    pass


def save(sec, sid, text, base=None):
    p = section_files()[sec]
    src = open(p, encoding='utf-8').read()
    start, end, cur, comments, indent = find_notes(src, sid)
    if base is not None and cur != base:
        raise Conflict('the notes for this slide changed on disk since you opened it')
    new = src[:start] + emit_expr(text, comments, indent) + src[end:]
    # round-trip check before touching disk
    if find_notes(new, sid)[2] != text:
        raise ValueError('round-trip check failed; file not written')
    with open(p, 'w', encoding='utf-8') as f:
        f.write(new)
    return os.path.relpath(p, DECK)


# ---------- server ----------
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=DECK, **k)

    def log_message(self, fmt, *args):
        if self.path.startswith('/api/'): sys.stderr.write('  ' + (fmt % args) + '\n')

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def _json(self, code, obj):
        b = json.dumps(obj).encode()
        self.send_response(code); self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)

    def do_GET(self):
        if self.path == '/' or self.path.startswith('/?'):
            self.send_response(302); self.send_header('Location', '/tools/editor.html'); self.end_headers(); return
        if self.path.startswith('/api/notes'):
            try: return self._json(200, get_all())
            except Exception as e: return self._json(500, {'error': str(e)})
        return super().do_GET()

    def do_POST(self):
        if not self.path.startswith('/api/notes'): return self._json(404, {'error': 'not found'})
        try:
            body = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
            f = save(body['sec'], body['id'], body['notes'], body.get('base'))
            return self._json(200, {'ok': True, 'file': f})
        except Conflict as e:
            return self._json(409, {'error': str(e), 'conflict': True})
        except Exception as e:
            return self._json(500, {'error': str(e)})


class S(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True; allow_reuse_address = True


if __name__ == '__main__':
    url = 'http://localhost:%d/tools/editor.html' % PORT
    with S(('127.0.0.1', PORT), H) as srv:
        print('Script editor: ' + url + '   (Ctrl+C to stop)')
        if '--no-open' not in sys.argv: webbrowser.open(url)
        srv.serve_forever()
