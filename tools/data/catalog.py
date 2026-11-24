#!/usr/bin/env python3
"""Relevé des catalogues (équivalent de stac_catalog.py dans SolarExplorers) : pour chaque collection retenue par instrument,
le titre, le niveau de traitement, la licence, le DOI, la période et le nombre de produits, lus dans le catalogue lui-même.
Écrit data/cat.json, intégré à la page par build.js. La liste des collections est ici (COLS) ; tout le reste vient des catalogues."""
import os, json, datetime, requests
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-data/1.0 (+https://github.com/Rolgim/EarthObservers)"
CATS = {
  "cmr": {"label": "NASA CMR (Earthdata)", "api": "https://cmr.earthdata.nasa.gov/stac/", "page": "https://search.earthdata.nasa.gov/"},
  "usgs": {"label": "USGS LandsatLook STAC", "api": "https://landsatlook.usgs.gov/stac-server", "page": "https://landsatlook.usgs.gov/"},
  "es": {"label": "Earth Search (Element 84, AWS)", "api": "https://earth-search.aws.element84.com/v1", "page": "https://element84.com/earth-search/"},
  "cdse": {"label": "Copernicus Data Space Ecosystem", "api": "https://stac.dataspace.copernicus.eu/v1", "page": "https://dataspace.copernicus.eu/"},
  "pc": {"label": "Microsoft Planetary Computer", "api": "https://planetarycomputer.microsoft.com/api/stac/v1", "page": "https://planetarycomputer.microsoft.com/catalog"},
}
# (satellite, instrument, catalogue, collection, filtre propre au satellite pour le compte, fournisseur CMR)
COLS = [
  ("landsat9", "oli2", "usgs", "landsat-c2l1", {"platform": {"eq": "LANDSAT_9"}}, None),
  ("landsat9", "oli2", "usgs", "landsat-c2l2-sr", {"platform": {"eq": "LANDSAT_9"}}, None),
  ("landsat9", "oli2", "cmr", "HLSL30_2.0", None, "LPCLOUD"),
  ("landsat9", "tirs2", "usgs", "landsat-c2l1", {"platform": {"eq": "LANDSAT_9"}}, None),
  ("landsat9", "tirs2", "usgs", "landsat-c2l2-st", {"platform": {"eq": "LANDSAT_9"}}, None),
  ("sentinel1", "csar", "pc", "sentinel-1-grd", None, None),
  ("sentinel1", "csar", "es", "sentinel-1-grd", None, None),
  ("sentinel2", "msi", "pc", "sentinel-2-l2a", None, None),
  ("sentinel2", "msi", "es", "sentinel-2-l2a", None, None),
  ("sentinel2", "msi", "es", "sentinel-2-c1-l2a", None, None),
  ("sentinel3", "olci", "pc", "sentinel-3-olci-wfr-l2-netcdf", None, None),
  ("sentinel3", "olci", "pc", "sentinel-3-olci-lfr-l2-netcdf", None, None),
  ("sentinel3", "slstr", "pc", "sentinel-3-slstr-lst-l2-netcdf", None, None),
  ("sentinel5p", "tropomi", "pc", "sentinel-5p-l2-netcdf", None, None),
  ("terra", "modis", "cmr", "MOD09GA_061", None, "LPCLOUD"),
  ("terra", "aster", "cmr", "AST_L1T_003", None, "LPCLOUD"),
  ("aqua", "modis", "cmr", "MYD09GA_061", None, "LPCLOUD"),
  ("aqua", "airs", "cmr", "AIRS3STD_7.0", None, "GES_DISC"),
  ("icesat2", "atlas", "cmr", "ATL06_007", None, "NSIDC_CPRD"),
  ("icesat2", "atlas", "cmr", "ATL03_007", None, "NSIDC_CPRD"),
  ("gracefo", "kbr", "cmr", "TELLUS_GRAC-GRFO_MASCON_CRI_GRID_RL06.3_V4", None, "POCLOUD:short"),
  ("swot", "karin", "cmr", "SWOT_L2_LR_SSH", None, "POCLOUD:short"),
  ("swot", "karin", "cmr", "SWOT_L2_HR_Raster", None, "POCLOUD:short"),
]
def stac_col(cat, cid, q, prov):
    root = CATS[cat]["api"] + (prov or "")
    c = S.get(root.rstrip("/") + "/collections/" + cid, timeout=90); c.raise_for_status(); c = c.json()
    rec = {"title": c.get("title"), "license": c.get("license"), "license_links": [l["href"] for l in c.get("links", []) if l.get("rel") == "license"],
           "period": (c.get("extent", {}).get("temporal", {}).get("interval") or [[None, None]])[0], "api": root, "doi": c.get("sci:doi")}
    body = {"collections": [cid], "limit": 1}
    if q: body["query"] = q
    r = S.post(root.rstrip("/") + "/search", json=body, timeout=120)
    if r.ok:
        j = r.json(); rec["matched"] = j.get("numberMatched") or (j.get("context") or {}).get("matched")
        if q:   # premier et dernier produit de ce satellite
            for d, k in (("asc", "first"), ("desc", "last")):
                r2 = S.post(root.rstrip("/") + "/search", json=dict(body, sortby=[{"field": "properties.datetime", "direction": d}]), timeout=120)
                if r2.ok and r2.json().get("features"): rec[k] = r2.json()["features"][0]["properties"].get("datetime")
    return rec
def cmr_umm(cid, short_only=False):
    # short_only : identifiant = nom court seul (collections PO.DAAC absentes de CMR-STAC) ; on garde la version la plus récente
    short, ver = (cid, None) if short_only else cid.rsplit("_", 1)
    p = {"short_name": short} if short_only else {"short_name": short, "version": ver}
    r = S.get("https://cmr.earthdata.nasa.gov/search/collections.umm_json", params=dict(p, sort_key="-revision_date"), timeout=90); r.raise_for_status()
    it = r.json()["items"][0]; u = it["umm"]
    if short_only: p["version"] = u.get("Version")
    h = S.get("https://cmr.earthdata.nasa.gov/search/granules.json", params=dict(p, page_size=0), timeout=90)
    t = (u.get("TemporalExtents") or [{}])[0].get("RangeDateTimes") or [{}]
    return {"version": u.get("Version"), "title_umm": u.get("EntryTitle"), "period_umm": [t[0].get("BeginningDateTime"), t[0].get("EndingDateTime")],"level": (u.get("ProcessingLevel") or {}).get("Id"), "doi": (u.get("DOI") or {}).get("DOI"), "concept": it["meta"]["concept-id"],
            "page": "https://cmr.earthdata.nasa.gov/search/concepts/" + it["meta"]["concept-id"] + ".html", "matched_all": int(h.headers.get("CMR-Hits", 0)) or None,
            "use": ((u.get("UseConstraints") or {}).get("LicenseURL") or {}).get("Linkage") or (u.get("UseConstraints") or {}).get("Description")}
out = {"fetched": datetime.date.today().isoformat(), "cats": CATS, "cols": {}}
for mid, inst, cat, cid, q, prov in COLS:
    try:
        if prov and prov.endswith(":short"):
            rec = cmr_umm(cid, True); rec.update(title=rec.get("title_umm"), period=rec.get("period_umm"), api="https://cmr.earthdata.nasa.gov/search/", matched=rec.get("matched_all"))
        else:
            rec = stac_col(cat, cid, q, prov)
            if cat == "cmr": rec.update(cmr_umm(cid))
        rec.update(inst=inst, cat=cat, id=cid, sat_filter=q)
        out["cols"].setdefault(mid, []).append(rec); print(mid, inst, cid, rec.get("matched"), rec.get("level"), rec.get("license"))
    except Exception as e: print("ÉCHEC", mid, cid, repr(e)[:200])
json.dump(out, open(os.path.join(ROOT, "data", "cat.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
