#!/usr/bin/env python3
"""Cherche des conditions d'usage sur des pages web : texte autour des mots « copyright », « license », « terms », « permission »…
Usage : python tools/probe/probe_terms.py URL [URL …]  Écrit tools/probe/_out/terms.txt."""
import os, re, sys, html, requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
KW = re.compile(r"copyright|licen[cs]e|terms|permission|free(ly)? (to|available)|public domain|attribut|redistribut|acknowledg|cite|citation", re.I)
o = []
for u in sys.argv[1:]:
    try: r = S.get(u, timeout=(20, 60))
    except Exception as e: o.append("## %s ÉCHEC %r" % (u, e)); continue
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", r.text, flags=re.S | re.I)
    links = sorted(set(re.findall(r'href="([^"]*(?:faq|term|licen|copyright|about|policy|usage|webmaster)[^"]*)"', t, re.I)))
    t = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)))
    open(os.path.join(OUT, "full_%d.txt" % sys.argv[1:].index(u)), "w").write(u + "\n\n" + t)   # texte entier de la page
    o.append("## %s %s (%d car.)\nliens utiles : %s" % (u, r.status_code, len(t), " ".join(links)[:1500]))
    seen = set()
    for m in KW.finditer(t):
        a = max(0, m.start() - 300)
        if a // 400 in seen: continue
        seen.add(a // 400); o.append("… " + t[a:m.end() + 400] + " …")
open(os.path.join(OUT, "terms.txt"), "w").write("\n\n".join(o)); print("\n\n".join(o)[:6000])
