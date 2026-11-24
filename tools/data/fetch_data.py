#!/usr/bin/env python3
"""Données réelles : une recette par produit, indépendantes. Chaque recette télécharge un produit d'une archive publique,
en tire un aperçu léger dans data/, et écrit à côté une fiche JSON (archive, collection, produit, date, URL, licence de la source) (règle 3).
Le champ « src » de chaque fiche nomme la règle de licence appliquée par tools/data/credits.py.
Usage : python tools/data/fetch_data.py [recette …]   (sans argument : toutes)."""
import io, json, os, re, sys, datetime, requests
from PIL import Image
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DATA = os.path.join(ROOT, "data"); os.makedirs(DATA, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-data/1.0 (+https://github.com/Rolgim/EarthObservers)"
CMR = "https://cmr.earthdata.nasa.gov"
def today(): return datetime.date.today().isoformat()
def save(name, im, meta, max_px=900):
    full = im.size; im = im.convert("RGB"); k = min(1.0, max_px / max(full))
    out = im.resize((round(full[0] * k), round(full[1] * k)), Image.LANCZOS) if k < 1 else im
    out.save(os.path.join(DATA, name + ".jpg"), quality=85, optimize=True)
    meta.update(full_size=list(full), out_size=list(out.size), fetched=today())
    json.dump(meta, open(os.path.join(DATA, name + ".json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(name, ":", meta.get("product"), meta.get("datetime"), full)

# ---------- globe : Blue Marble de la NASA (domaine public) via Wikimedia Commons ; licence relue dans les métadonnées ----------
EARTH = ["File:Land ocean ice 2048.jpg", "File:Whole world - land and oceans 12000.jpg", "File:Land shallow topo 2048.jpg"]
def earth_texture():
    for title in EARTH:
        r = S.get("https://commons.wikimedia.org/w/api.php", params={"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url|extmetadata|size",
                  "iiurlwidth": 2048, "format": "json"}, timeout=60)
        pages = r.json().get("query", {}).get("pages", {})
        ii = next(iter(pages.values()), {}).get("imageinfo")
        if not ii: print("  absent :", title); continue
        ii = ii[0]; em = ii.get("extmetadata", {}); lic = re.sub(r"<[^>]+>", "", em.get("LicenseShortName", {}).get("value", ""))
        if not re.search(r"public domain|PD", lic, re.I): print("  licence refusée :", title, lic); continue
        im = Image.open(io.BytesIO(S.get(ii.get("thumburl") or ii["url"], timeout=300).content)).convert("RGB")
        if im.width > 2048: im = im.resize((2048, 1024), Image.LANCZOS)
        if abs(im.width - 2 * im.height) > 4: print("  pas équirectangulaire :", title, im.size); continue
        im.save(os.path.join(DATA, "tex-earth.jpg"), quality=84, optimize=True)
        meta = {"src": "commons", "body": "earth", "title": title[5:], "href": ii["url"], "page": ii.get("descriptionurl"),
                "credit": re.sub(r"<[^>]+>", "", em.get("Artist", {}).get("value", "NASA"))[:200].strip(), "license": lic,
                "description": re.sub(r"<[^>]+>", "", em.get("ImageDescription", {}).get("value", ""))[:400], "size": list(im.size), "fetched": today()}
        json.dump(meta, open(os.path.join(DATA, "tex-earth.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        print("texture Terre :", title, im.size, lic); return
    raise RuntimeError("aucune texture de la Terre retenue")

# ---------- produits NASA par CMR (Earthdata) : aperçu « browse » public, licence CC0 des missions NASA ----------
def granules(short, version, n=40, **params):
    q = {"short_name": short, "version": version, "sort_key": "-start_date", "page_size": n}; q.update(params)
    r = S.get(CMR + "/search/granules.umm_json", params=q, timeout=120); r.raise_for_status()
    return r.json().get("items", [])
def browse_url(umm):
    for u in umm.get("RelatedUrls", []):
        if u.get("Type") == "GET RELATED VISUALIZATION" and u.get("URL", "").startswith("https") and re.search(r"\.(jpe?g|png)$", u["URL"], re.I): return u["URL"]
def attrs(umm): return {a.get("Name"): (a.get("Values") or [None])[0] for a in umm.get("AdditionalAttributes", [])}

def landsat9():
    """Landsat 9, OLI-2 : scène HLS L30 (produit NASA harmonisé, calculé à partir d'une scène Landsat 9) la plus récente
    avec peu de nuages et une tuile presque pleine ; aperçu en couleurs naturelles publié par le LP DAAC."""
    for g in granules("HLSL30", "2.0", 200, cloud_cover="0,5"):
        umm, meta = g["umm"], g["meta"]; a = attrs(umm)
        if not re.search(r"LC09|LANDSAT[-_ ]?9", json.dumps(a)): continue
        if float(a.get("SPATIAL_COVERAGE") or 0) < 90: continue
        href = browse_url(umm)
        if not href: continue
        r = S.get(href, timeout=300)
        if not r.ok or not r.headers.get("content-type", "").startswith(("image/", "binary/", "application/octet")): print("  aperçu refusé", r.status_code, href); continue
        im = Image.open(io.BytesIO(r.content))
        save("landsat9-oli", im, {"src": "nasa-cc0", "archive": "NASA LP DAAC (Earthdata), catalogue CMR", "collection": "HLSL30 v2.0",
             "product": umm.get("GranuleUR"), "datetime": umm.get("TemporalExtent", {}).get("RangeDateTime", {}).get("BeginningDateTime"),
             "instrument": "OLI-2", "landsat_id": next((v for v in a.values() if v and re.search(r"LC09", str(v))), None),
             "cloud": a.get("CLOUD_COVERAGE"), "tile": a.get("MGRS_TILE_ID"), "href": href,
             "page": CMR + "/search/concepts/" + meta["concept-id"] + ".html", "doi": "10.5067/HLS/HLSL30.002",
             "credit": "NASA/USGS Landsat 9 ; HLS : NASA LP DAAC", "attrs": {k: a[k] for k in list(a)[:40]}})
        return
    raise RuntimeError("aucune scène HLS Landsat 9 retenue")

RECIPES = {"textures": earth_texture, "landsat9": landsat9}
if __name__ == "__main__":
    want = sys.argv[1:] or list(RECIPES); bad = 0
    for k in want:
        try: RECIPES[k]()
        except Exception as e: bad += 1; print("ÉCHEC", k, repr(e)[:300])
    sys.exit(1 if bad == len(want) else 0)
