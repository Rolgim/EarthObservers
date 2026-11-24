#!/usr/bin/env python3
"""Candidats pour une deuxième vague : maquettes d'Eyes on the Earth (chemins sc_*/…gltf trouvés dans le code de l'application),
couches GIBS sans compte (capacités WMTS) et collections du Planetary Computer. Écrit tools/probe/_out/candidates.txt."""
import os, re, json, requests
from urllib.parse import urljoin
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
o = []
def log(*a): s = " ".join(str(x) for x in a); print(s, flush=True); o.append(s)
# 1. Eyes on the Earth : fichiers de l'application, puis tout chemin de maquette
try:
    base = "https://eyes.nasa.gov/apps/earth/"; h = S.get(base, timeout=60).text
    js = set(re.findall(r'(?:src|href)="([^"]+\.(?:js|json))"', h)); seen = set(); models = set(); ids = set()
    todo = [urljoin(base, j) for j in js]
    while todo and len(seen) < 60:
        u = todo.pop(); 
        if u in seen: continue
        seen.add(u); t = S.get(u, timeout=60).text
        models |= set(re.findall(r"sc_[A-Za-z0-9_]+/[A-Za-z0-9_./-]+\.(?:gltf|glb)", t)); ids |= set(re.findall(r"['\"](sc_[a-z0-9_]+)['\"]", t))
        for j in re.findall(r'["\']((?:\./|/)?[A-Za-z0-9_./-]+\.js)["\']', t):
            if "chunk" in j or "index" in j or "app" in j: todo.append(urljoin(u, j))
    log("## Eyes : %d fichiers lus" % len(seen)); log("maquettes :", sorted(models)); log("identifiants sc_ :", sorted(ids))
except Exception as e: log("Eyes ÉCHEC", repr(e)[:200])
# 2. GIBS : couches dont l'identifiant évoque un candidat
try:
    cap = S.get("https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml", timeout=180).text
    L = sorted(set(re.findall(r"<ows:Identifier>([^<]+)</ows:Identifier>", cap)))
    log("## GIBS : %d couches" % len(L))
    for k in ["OCO", "SMAP", "IMERG", "GPM", "VIIRS_SNPP_CorrectedReflectance", "VIIRS_NOAA20_CorrectedReflectance", "VIIRS_NOAA21", "PACE", "OMI", "MOPITT", "MISR", "CERES", "AIRS", "GOES", "Himawari", "Sentinel", "TEMPO", "TROPOMI", "Jason", "CALIPSO", "CloudSat", "SWOT", "AMSR", "Landsat", "HLS", "NISAR", "EarthCARE", "TRMM"]:
        m = [x for x in L if k.lower() in x.lower()]; log(k, len(m), m[:8])
except Exception as e: log("GIBS ÉCHEC", repr(e)[:200])
# 3. Planetary Computer : collections
try:
    c = S.get("https://planetarycomputer.microsoft.com/api/stac/v1/collections", timeout=120).json()["collections"]
    log("## Planetary Computer : %d collections" % len(c)); log(sorted(x["id"] for x in c))
except Exception as e: log("PC ÉCHEC", repr(e)[:200])
open(os.path.join(OUT, "candidates.txt"), "w").write("\n".join(o))
