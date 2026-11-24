#!/usr/bin/env python3
"""Sonde 3 (étape 4) : numéros NORAD des neuf satellites (CelesTrak, par nom), collections publiques sans compte (Planetary Computer,
Earth Search, CMR), aperçus rendus, et accessibilité des serveurs d'images publiées (GIBS, Photojournal, SVS). Sortie : _out/report3.md."""
import os, json, requests
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "_out"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
R = []
def get(u, **k):
    try: r = S.get(u, timeout=60, **k); R.append("- GET " + u + " -> " + str(r.status_code) + " " + r.headers.get("content-type", "")[:40] + " " + str(len(r.content))); return r
    except Exception as e: R.append("- GET " + u + " ÉCHEC " + repr(e)[:150]); return None
R.append("## CelesTrak par nom")
for n in ["SENTINEL-1", "SENTINEL-2", "SENTINEL-3", "SENTINEL-5P", "TERRA", "AQUA", "ICESAT-2", "GRACE-FO", "SWOT"]:
    r = get("https://celestrak.org/NORAD/elements/gp.php", params={"NAME": n, "FORMAT": "JSON"})
    if r is not None and r.ok:
        try:
            for o in r.json(): R.append("  - " + o["OBJECT_NAME"] + " NORAD " + str(o["NORAD_CAT_ID"]) + " COSPAR " + o["OBJECT_ID"] + " epoch " + o["EPOCH"] + " inc " + str(o["INCLINATION"]) + " mm " + str(o["MEAN_MOTION"]))
        except Exception as e: R.append("  json? " + r.text[:200])
PC = "https://planetarycomputer.microsoft.com/api/stac/v1"
R.append("## Planetary Computer")
cols = ["sentinel-1-grd", "sentinel-1-rtc", "sentinel-2-l2a", "sentinel-3-olci-lfr-l2-netcdf", "sentinel-3-olci-wfr-l2-netcdf", "sentinel-3-slstr-lst-l2-netcdf", "sentinel-3-synergy-syn-l2-netcdf", "sentinel-5p-l2-netcdf", "modis-09A1-061", "modis-13Q1-061", "modis-14A1-061", "modis-10A1-061", "aster-l1t", "landsat-c2-l2"]
for c in cols:
    r = get(PC + "/collections/" + c)
    if r is None or not r.ok: continue
    j = r.json(); R.append("  - " + c + " | " + j.get("title", "") + " | licence " + str(j.get("license")) + " | " + " ; ".join(l.get("href", "") for l in j.get("links", []) if l.get("rel") == "license")[:300])
    R.append("    extent " + json.dumps(j.get("extent", {}).get("temporal", {}))[:120] + " | item_assets " + ",".join(list((j.get("item_assets") or {}).keys())[:12]))
    r2 = get(PC + "/search", params={"collections": c, "limit": 1, "datetime": "2025-06-01/2025-07-01"})
    if r2 is not None and r2.ok and r2.json().get("features"):
        f = r2.json()["features"][0]; R.append("    item " + f["id"] + " assets " + ",".join(f["assets"].keys())[:300])
        for k, a in f["assets"].items():
            if k in ("rendered_preview", "thumbnail", "preview", "browse"): R.append("    " + k + " " + a["href"][:300]); p = get(a["href"])
        R.append("    props " + json.dumps({k: v for k, v in f["properties"].items() if k in ("platform", "constellation", "instruments", "s5p:product_name", "s3:product_name", "sar:instrument_mode", "eo:cloud_cover")})[:300])
R.append("## Earth Search")
for c in ["sentinel-2-l2a", "sentinel-2-c1-l2a", "sentinel-1-grd"]:
    r = get("https://earth-search.aws.element84.com/v1/collections/" + c)
    if r is not None and r.ok: j = r.json(); R.append("  - " + c + " licence " + str(j.get("license")) + " " + " ; ".join(l.get("href", "") for l in j.get("links", []) if l.get("rel") == "license")[:200])
R.append("## CMR (MODIS, ICESat-2, GRACE-FO, SWOT : collections et images d'aperçu)")
for sn, v in [("MOD09GA", "061"), ("MYD09GA", "061"), ("MOD021KM", "061"), ("ATL06", "006"), ("ATL03", "006"), ("GRACEFO_L2_JPL_MONTHLY_0063", None), ("SWOT_L2_LR_SSH_2.0", None), ("SWOT_L2_HR_Raster_2.0", None), ("TELLUS_GRAC-GRFO_MASCON_CRI_GRID_RL06.3_V4", None), ("AIRS3STD", "7.0"), ("AST_L1T", "003")]:
    q = {"short_name": sn, "page_size": 1}
    if v: q["version"] = v
    r = get("https://cmr.earthdata.nasa.gov/search/collections.umm_json", params=q)
    if r is None or not r.ok or not r.json().get("items"): continue
    it = r.json()["items"][0]; u = it["umm"]
    R.append("  - " + sn + " " + it["meta"]["concept-id"] + " " + it["meta"].get("provider-id", "") + " | " + u.get("EntryTitle", "")[:90] + " | DOI " + str((u.get("DOI") or {}).get("DOI")) + " | " + str(u.get("UseConstraints"))[:200])
    g = get("https://cmr.earthdata.nasa.gov/search/granules.umm_json", params={"collection_concept_id": it["meta"]["concept-id"], "page_size": 1, "sort_key": "-start_date"})
    if g is not None and g.ok and g.json().get("items"):
        gu = g.json()["items"][0]["umm"]
        for l in gu.get("RelatedUrls", []):
            if l.get("Type") in ("GET RELATED VISUALIZATION",) or str(l.get("URL", "")).lower().endswith((".jpg", ".png")): R.append("    browse " + l["URL"][:200]); get(l["URL"])
R.append("## Serveurs d'images publiées")
for u in ["https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&CRS=EPSG:4326&BBOX=40,0,50,10&WIDTH=512&HEIGHT=512&FORMAT=image/jpeg&TIME=2025-06-15",
          "https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=MODIS_Aqua_CorrectedReflectance_TrueColor&CRS=EPSG:4326&TIME=2025-06-15&BBOX=40,0,50,10&FORMAT=image/jpeg&WIDTH=512&HEIGHT=512",
          "https://photojournal.jpl.nasa.gov/catalog/PIA25768", "https://svs.gsfc.nasa.gov/api/search?keywords=GRACE-FO", "https://images-api.nasa.gov/search?q=SWOT%20sea%20level&media_type=image",
          "https://images-api.nasa.gov/search?q=GRACE-FO&media_type=image", "https://images-api.nasa.gov/search?q=ICESat-2&media_type=image", "https://science.nasa.gov/mission/swot/", "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=SWOT%20satellite%20sea%20surface%20height&srnamespace=6&format=json",
          "https://www.esa.int/ESA_Multimedia/Images", "https://sentinels.copernicus.eu/"]:
    r = get(u)
    if r is not None and r.ok and "json" in r.headers.get("content-type", ""): R.append("    " + r.text[:900].replace("\n", " "))
open(os.path.join(OUT, "report3.md"), "w").write("\n".join(R) + "\n"); print("\n".join(R))
