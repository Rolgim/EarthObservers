#!/usr/bin/env python3
"""Sonde 2 de l'étape 1 : ce que la première sonde n'a pas tranché.
1. Copernicus Data Space STAC : identifiants des collections, dernier item Sentinel-1/2/3/5P, aperçus téléchargeables sans compte ?
2. USGS LandsatLook STAC : Landsat 9 seul (pas l'harmonisé HLS), vignettes publiques ?
3. GRACE-FO, SWOT, ICESat-2, MODIS, ASTER : collections CMR utiles et aperçus.
4. Textures de la Terre (Blue Marble, NASA Visible Earth) et satellite.js (MIT) sur jsDelivr.
5. Textes de licence (Planetary Computer, Earth Search, CelesTrak, NASA médias).
Sortie : tools/probe/_out/sources2/ (branche probe-out)."""
import os, re, json
import requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out", "sources2"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "Mozilla/5.0 (earthobservers-probe/1.0; +https://github.com/Rolgim/EarthObservers)"
REP = []
def log(*a):
    s = " ".join(str(x) for x in a); print(s, flush=True); REP.append(s)
def get(u, **kw):
    try: return S.get(u, timeout=kw.pop("timeout", 90), **kw)
    except Exception as e: log("  ÉCHEC", u, repr(e)[:160]); return None
def st(u):
    if not u or not u.startswith("http"): return None
    try:
        r = S.get(u, timeout=60, stream=True); s = (r.status_code, r.headers.get("content-type"), r.headers.get("content-length")); r.close(); return s
    except Exception as e: return ("ERR", repr(e)[:80])
def items(root, cid, n=1, extra=None):
    q = {"collections": [cid], "limit": n, "sortby": [{"field": "properties.datetime", "direction": "desc"}]}
    if extra: q.update(extra)
    try:
        r = S.post(root + "/search", json=q, timeout=90)
        if not r.ok: log("   search", cid, r.status_code, r.text[:200]); return []
        return r.json().get("features", [])
    except Exception as e: log("   search ÉCHEC", cid, repr(e)[:120]); return []
def show(f):
    log("   item", f["id"], f["properties"].get("datetime"), {k: f["properties"].get(k) for k in ("platform", "eo:cloud_cover", "constellation") if k in f["properties"]})
    for k, a in f.get("assets", {}).items():
        if re.search(r"thumb|preview|browse|quicklook|ql|visual|rendered|overview", k + " " + " ".join(a.get("roles") or []), re.I):
            log("     asset", k, a.get("roles"), a.get("type"), a.get("href", "")[:160], st(a.get("href")))

log("## 1. Copernicus Data Space STAC")
CR = "https://stac.dataspace.copernicus.eu/v1"
r = get(CR + "/collections")
ids = []
if r is not None and r.ok:
    j = r.json(); ids = [c["id"] for c in j.get("collections", [])]
    log("  collections (page 1) :", len(ids), ids)
    for l in j.get("links", []):
        if l.get("rel") == "next": log("  next :", l.get("href"))
    lic = {c["id"]: (c.get("license"), [l.get("href") for l in c.get("links", []) if l.get("rel") == "license"]) for c in j.get("collections", [])}
    for i in ids:
        if re.search(r"sentinel-(1|2|3|5p)", i, re.I): log("   licence", i, lic[i])
else: log("  ->", r.status_code if r is not None else "-", (r.text[:300] if r is not None else ""))
for cid in [i for i in ids if re.search(r"sentinel-1-grd|sentinel-2-l2a|sentinel-3-olci-1-efr|sentinel-3-olci|sentinel-5p-l2-no2|sentinel-5p", i, re.I)][:8]:
    log("  ##", cid)
    for f in items(CR, cid): show(f)

log("\n## 2. USGS LandsatLook STAC (Landsat 9)")
LR = "https://landsatlook.usgs.gov/stac-server"
r = get(LR + "/collections"); 
if r is not None and r.ok: log("  collections :", [(c["id"], c.get("license")) for c in r.json().get("collections", [])])
else: log("  ->", r.status_code if r is not None else "-")
for f in items(LR, "landsat-c2l2-sr", 1, {"query": {"platform": {"eq": "LANDSAT_9"}, "eo:cloud_cover": {"lt": 10}}}): show(f)
for f in items(LR, "landsat-c2l1", 1, {"query": {"platform": {"eq": "LANDSAT_9"}}}): show(f)
ES = "https://earth-search.aws.element84.com/v1"
for f in items(ES, "landsat-c2-l2", 1, {"query": {"platform": {"eq": "landsat-9"}}}): show(f)

log("\n## 3. CMR (collections utiles)")
def cmr(q, n=8):
    r = get("https://cmr.earthdata.nasa.gov/search/collections.json", params={"keyword": q, "page_size": n, "has_granules": "true", "sort_key": "-usage_score"})
    if r is None or not r.ok: log("  cmr", q, "->", r.status_code if r is not None else "-"); return
    for e in r.json()["feed"]["entry"]:
        log("  ", q, "|", e.get("short_name"), e.get("version_id"), e.get("data_center"), "|", (e.get("title") or "")[:90], "| browse" if e.get("browse_flag") else "")
for q in ("GRACE-FO mascon", "GRACE-FO level-3 land", "SWOT L2 HR raster", "SWOT L2 LR SSH", "ICESat-2 ATL06", "ICESat-2 ATL08", "MODIS Terra true color", "MOD09GA", "MYD09GA", "ASTER L1T", "Sentinel-5P NO2"):
    cmr(q)
# granules avec aperçu : quelques produits candidats
for prov, cid in (("POCLOUD", "TELLUS_GRAC-GRFO_MASCON_CRI_GRID_RL06.3_V4"), ("POCLOUD", "SWOT_L2_HR_Raster_D_D"), ("NSIDC_CPRD", "ATL06_007"),
                  ("LPCLOUD", "MOD09GA_061"), ("LPCLOUD", "MYD09GA_061"), ("LPCLOUD", "AST_L1T_004"), ("LPCLOUD", "HLSL30_2.0"), ("GES_DISC", "S5P_L2__NO2____HiR_2")):
    log("  ##", prov, cid)
    for f in items("https://cmr.earthdata.nasa.gov/stac/" + prov, cid): show(f)

log("\n## 4. Textures et bibliothèques")
for u in ("https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg",
          "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg",
          "https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg",
          "https://visibleearth.nasa.gov/images/73909/december-blue-marble-next-generation-w-topography-and-bathymetry",
          "https://cdn.jsdelivr.net/npm/satellite.js@5.0.0/dist/satellite.min.js",
          "https://cdn.jsdelivr.net/npm/satellite.js@6.0.1/dist/satellite.min.js",
          "https://cdn.jsdelivr.net/npm/satellite.js@5.0.0/LICENSE.md",
          "https://data.jsdelivr.com/v1/package/npm/satellite.js"):
    log(" ", u, st(u))
r = get("https://data.jsdelivr.com/v1/package/npm/satellite.js")
if r is not None and r.ok: log("  versions satellite.js :", r.json().get("versions", [])[:12])
r = get("https://cdn.jsdelivr.net/npm/satellite.js@5.0.0/")
if r is not None and r.ok: log("  fichiers 5.0.0 :", re.findall(r'href="/npm/satellite\.js@5\.0\.0/([^"]+)"', r.text)[:40])

log("\n## 5. Textes de licence")
def sentences(u, pat=r"licen[cs]|free|open|attribution|credit|public domain|commercial|copyright|terms|use of", n=14):
    r = get(u, timeout=60)
    log(f"### {u} -> {r.status_code if r is not None else '-'} {r.url if r is not None else ''}")
    if r is None or not r.ok: return
    txt = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"(?s)<(script|style)[^>]*>.*?</\1>", " ", r.text)))
    for m in list(re.finditer(r"[^.]{0,240}(" + pat + r")[^.]{0,240}\.", txt, re.I))[:n]: log("   «", m.group(0).strip()[:480], "»")
for u in ("https://planetarycomputer.microsoft.com/terms", "https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice",
          "https://celestrak.org/webmaster.php", "https://www.nasa.gov/nasa-brand-center/images-and-media/",
          "https://eyes.nasa.gov/apps/earth/", "https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance",
          "https://registry.opendata.aws/sentinel-2-l2a-cogs/", "https://registry.opendata.aws/usgs-landsat/",
          "https://visibleearth.nasa.gov/image-use-policy"):
    sentences(u)
open(os.path.join(OUT, "report.md"), "w").write("\n".join(REP) + "\n")
