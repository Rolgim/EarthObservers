#!/usr/bin/env python3
"""Télécharge les maquettes d'Eyes on the Earth (NASA/JPL-Caltech) des satellites de la première vague :
gltf, buffers et textures, avec le champ asset de chaque fichier (generator, copyright). Sortie : tools/probe/_out/eyes/ (branche probe-out).
Usage : règles d'usage des médias de la NASA, qui couvrent les maquettes 3D (sonde probe_sources2.py, 24/11/2026)."""
import os, json
from urllib.parse import urljoin
import requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out", "eyes"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "Mozilla/5.0 (earthobservers-probe/1.0; +https://github.com/Rolgim/EarthObservers)"
ROOT = "https://eyes.nasa.gov/assets/static/models/"
PATHS = ["sc_landsat_9/Landsat9.gltf", "sc_terra/Terra.gltf", "sc_aqua/Aqua.gltf", "sc_icesatii/ICESat2.gltf", "sc_grace_fo/graceFO.gltf", "sc_swot_v2/swot.gltf"]
REP = []
def log(*a):
    s = " ".join(str(x) for x in a); print(s, flush=True); REP.append(s)
for p in PATHS:
    u = ROOT + p; r = S.get(u, timeout=120)
    log("##", u, r.status_code, len(r.content))
    if not r.ok: continue
    d = os.path.join(OUT, os.path.dirname(p)); os.makedirs(d, exist_ok=True); open(os.path.join(OUT, p), "wb").write(r.content)
    g = r.json(); log("  asset :", json.dumps(g.get("asset"), ensure_ascii=False)); log("  extensions :", g.get("extensionsUsed"), "| nœuds :", len(g.get("nodes", [])), "| maillages :", len(g.get("meshes", [])))
    log("  noms des nœuds :", [n.get("name") for n in g.get("nodes", [])][:80])
    for b in g.get("buffers", []) + g.get("images", []):
        if b.get("uri") and not b["uri"].startswith("data:"):
            rb = S.get(urljoin(u, b["uri"]), timeout=120)
            if rb.ok:
                q = os.path.join(d, b["uri"]); os.makedirs(os.path.dirname(q), exist_ok=True); open(q, "wb").write(rb.content); log("  ", b["uri"], len(rb.content))
            else: log("  manque", b["uri"], rb.status_code)
open(os.path.join(OUT, "report.md"), "w").write("\n".join(REP) + "\n")
