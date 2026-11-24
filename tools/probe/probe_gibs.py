#!/usr/bin/env python3
"""Cherche des couches GIBS (NASA) par motif et, en option, des images Wikimedia Commons avec leur licence.
Usage : python tools/probe/probe_gibs.py PACE VIIRS_NOAA SMAP OCO-2 IMERG NISAR OMI TEMPO GOES-East commons:Sentinel-6
Pour chaque couche : identifiant, dimension de temps (défaut, valeurs), format, légendes. Écrit tools/probe/_out/gibs.txt
et, pour chaque couche trouvée, un essai de GetMap (WMS) sur le monde entier à la date par défaut."""
import os, re, sys, requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
o = []
cap = S.get("https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml", timeout=180).text
layers = re.findall(r"<Layer>(.*?)</Layer>", cap, re.S)
for pat in [a for a in sys.argv[1:] if not a.startswith(("commons:", "raw:"))]:
    o.append("## motif " + pat)
    n = 0
    for b in layers:
        ident = re.search(r"<ows:Identifier>([^<]+)</ows:Identifier>", b).group(1)
        if not re.search(pat, ident, re.I): continue
        n += 1
        if n > 25: o.append("  …"); break
        title = re.search(r"<ows:Title[^>]*>([^<]+)</ows:Title>", b)
        dflt = re.search(r"<Default>([^<]+)</Default>", b); vals = re.findall(r"<Value>([^<]+)</Value>", b)
        legs = re.findall(r'xlink:href="([^"]+\.(?:png|svg))"', b)
        o.append("- %s | %s | défaut %s | valeurs %s … %s | légendes %s" % (ident, title.group(1) if title else "", dflt.group(1) if dflt else "-",
                 vals[:1], vals[-1:], legs[:2]))
    if n == 0: o.append("  (aucune)")
for a in [a for a in sys.argv[1:] if a.startswith("raw:")]:   # extrait brut du GetCapabilities autour d'une couche
    i = cap.find("<ows:Identifier>" + a[4:] + "</ows:Identifier>"); o.append("## raw " + a[4:] + "\n" + cap[max(0, i - 3000):i + 4000])
for a in [a for a in sys.argv[1:] if a.startswith("commons:")]:
    q = a[8:].replace("_", " ")
    r = S.get("https://commons.wikimedia.org/w/api.php", params={"action": "query", "generator": "search", "gsrsearch": q, "gsrnamespace": 6, "gsrlimit": 40,
              "prop": "imageinfo", "iiprop": "url|extmetadata|size", "format": "json"}, timeout=60).json()
    o.append("## commons " + q)
    for p in (r.get("query", {}).get("pages", {}) or {}).values():
        ii = (p.get("imageinfo") or [{}])[0]; em = ii.get("extmetadata", {})
        v = lambda k: re.sub(r"<[^>]+>", "", (em.get(k) or {}).get("value", "")).strip()[:160]
        o.append("- %s | %sx%s | %s | %s | %s" % (p["title"], ii.get("width"), ii.get("height"), v("LicenseShortName"), v("Artist"), v("Credit")))
open(os.path.join(OUT, "gibs.txt"), "w").write("\n".join(o)); print("\n".join(o)[:6000])
