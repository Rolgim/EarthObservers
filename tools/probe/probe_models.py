#!/usr/bin/env python3
"""Cherche des maquettes 3D libres d'un satellite : fichiers 3D de Wikimedia Commons (STL, GLB) et modèles téléchargeables de Sketchfab,
avec leur licence telle que déclarée. Usage : python tools/probe/probe_models.py Sentinel-1 Sentinel-2 …  Écrit tools/probe/_out/models.txt"""
import os, re, sys, requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
o = []
for q in [a.replace("_", " ") for a in sys.argv[1:]]:
    o.append("## commons " + q)
    try:
        r = S.get("https://commons.wikimedia.org/w/api.php", params={"action": "query", "generator": "search", "gsrsearch": q + " filetype:3d|filetype:drawing|stl|glb", "gsrnamespace": 6,
                  "gsrlimit": 30, "prop": "imageinfo", "iiprop": "url|extmetadata|mime", "format": "json"}, timeout=60).json()
        for p in (r.get("query", {}).get("pages", {}) or {}).values():
            ii = (p.get("imageinfo") or [{}])[0]; em = ii.get("extmetadata", {})
            v = lambda k: re.sub(r"<[^>]+>", "", (em.get(k) or {}).get("value", "")).strip()[:140]
            if re.search(r"stl|gltf|glb|model|3d", (ii.get("mime") or "") + p["title"], re.I):
                o.append("- %s | %s | %s | %s | %s" % (p["title"], ii.get("mime"), v("LicenseShortName"), v("Artist"), ii.get("url")))
    except Exception as e: o.append("  erreur %r" % e)
    o.append("## sketchfab " + q)
    try:
        r = S.get("https://api.sketchfab.com/v3/search", params={"type": "models", "q": q, "downloadable": "true", "count": 24}, timeout=60).json()
        for m in r.get("results", []):
            o.append("- %s | %s | %s | %s | faces %s" % (m.get("name"), (m.get("user") or {}).get("username"), (m.get("license") or {}).get("label"), m.get("viewerUrl"), m.get("faceCount")))
    except Exception as e: o.append("  erreur %r" % e)
    o.append("## nasa 3d " + q)
    try:
        r = S.get("https://api.github.com/search/code", params={"q": q + " repo:nasa/NASA-3D-Resources"}, timeout=60)
        o.append("  (github) %s" % r.status_code)
        t = S.get("https://api.github.com/repos/nasa/NASA-3D-Resources/git/trees/master?recursive=1", timeout=120).json()
        for x in t.get("tree", []):
            if re.search(q.replace(" ", ".?"), x["path"], re.I): o.append("- " + x["path"])
    except Exception as e: o.append("  erreur %r" % e)
open(os.path.join(OUT, "models.txt"), "w").write("\n".join(o)); print("\n".join(o)[:5000])
