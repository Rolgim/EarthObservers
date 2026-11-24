#!/usr/bin/env python3
"""Cherche des éléments GP chez CelesTrak par nom ou désignation internationale (ex. SENTINEL-3 ou 2026-209).
Usage : python tools/probe/probe_gp.py NAME=SENTINEL-3 INTDES=2026-209 …  Écrit tools/probe/_out/gp.txt."""
import os, sys, requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
o = []
for a in sys.argv[1:]:
    k, v = a.split("=", 1)
    for f in ("TLE", "JSON"):
        r = S.get("https://celestrak.org/NORAD/elements/gp.php", params={k: v, "FORMAT": f}, timeout=60)
        o.append("### %s=%s %s (%s)\n%s\n" % (k, v, f, r.status_code, r.text[:3000]))
open(os.path.join(OUT, "gp.txt"), "w").write("\n".join(o)); print("\n".join(o)[:4000])
