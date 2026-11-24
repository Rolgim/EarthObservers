#!/usr/bin/env python3
"""Vérifie chaque lien externe du site (index.html construit, CREDITS.md) : code HTTP après redirections.
Écrit tools/probe/_out/links.txt (liens en échec d'abord). Usage : python tools/probe/probe_links.py"""
import os, re, html, concurrent.futures as cf, requests
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT = os.path.join(ROOT, "tools", "probe", "_out"); os.makedirs(OUT, exist_ok=True)
txt = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read() + open(os.path.join(ROOT, "CREDITS.md"), encoding="utf-8").read()
urls = sorted({html.unescape(u).rstrip(".,);'\\") for u in re.findall(r"https?://[^\s\"'<>`)\]]+", txt)})
urls = [u for u in urls if not re.search(r"\{|\+|localhost|\$|sig=|planetarycomputer\.microsoft\.com/api/data|wms\.cgi", u)]
S = requests.Session(); S.headers["User-Agent"] = "Mozilla/5.0 (link check; earthobservers)"
def chk(u):
    try:
        r = S.head(u, allow_redirects=True, timeout=30)
        if r.status_code >= 400 or r.status_code == 0: r = S.get(u, allow_redirects=True, timeout=45, stream=True)
        return u, r.status_code, r.url
    except Exception as e: return u, -1, repr(e)[:120]
with cf.ThreadPoolExecutor(12) as ex: res = list(ex.map(chk, urls))
bad = [x for x in res if not (200 <= x[1] < 400)]
o = ["%d liens, %d en échec" % (len(res), len(bad)), ""] + ["%s %s -> %s" % (c, u, f) for u, c, f in bad] + ["", "## tous"] + ["%s %s" % (c, u) for u, c, f in res]
open(os.path.join(OUT, "links.txt"), "w").write("\n".join(o)); print("\n".join(o[:80]))
