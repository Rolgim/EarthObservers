#!/usr/bin/env python3
"""Télécharge des pages ou fichiers publics et suit leurs liens d'un niveau sur le même hôte (sans compte).
Usage : python tools/probe/probe_fetch.py https://exemple/page/ 0:https://exemple/fichier …  Écrit tools/probe/_out/fetch/ (pages, fichiers .glb/.gltf/.bin/LICENSE,
en-têtes) et tools/probe/_out/fetch.txt (liste des liens trouvés, statut et taille de chaque fichier)."""
import os, re, sys, requests
from urllib.parse import urljoin, urlparse
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out"); D = os.path.join(OUT, "fetch"); os.makedirs(D, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
o = []; seen = set()
KEEP = re.compile(r"(\.(glb|gltf|bin|json|txt|md|html?|xml)$|licen[cs]e|readme|/$)", re.I)
def name(u): p = urlparse(u); return re.sub(r"[^A-Za-z0-9._-]", "_", p.netloc + p.path)[:180] or "index"
def get(u, depth):
    if u in seen or len(seen) > 120: return
    seen.add(u)
    try: r = S.get(u, timeout=90)
    except Exception as e: o.append("- %s ERREUR %s" % (u, e)); return
    ct = r.headers.get("Content-Type", ""); o.append("- %s | %s | %s | %s o" % (u, r.status_code, ct, len(r.content)))
    if r.status_code != 200 or len(r.content) > 40e6: return
    fn = name(u) + (".html" if "html" in ct and not u.endswith((".html", ".htm")) else "")
    open(os.path.join(D, fn), "wb").write(r.content)
    if "html" in ct or u.endswith((".json", ".gltf")):
        t = r.text
        links = set(re.findall(r'(?:href|src)=["\']([^"\'#]+)', t)) | set(re.findall(r'["\']([^"\']+\.(?:glb|gltf|bin))["\']', t))
        for l in sorted(links):
            a = urljoin(u, l); o.append("    lien %s" % a)
            if depth > 0 and urlparse(a).netloc == urlparse(u).netloc and KEEP.search(urlparse(a).path): get(a, depth - 1)
for a in sys.argv[1:]:   # « 0:URL » : sans suivre les liens
    d, u = (int(a[0]), a[2:]) if re.match(r"\d:", a) else (2, a); o.append("## " + u); get(u, d)
open(os.path.join(OUT, "fetch.txt"), "w").write("\n".join(o)); print("\n".join(o)[:8000])
