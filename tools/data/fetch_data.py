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

# ---------- Planetary Computer (Microsoft) : catalogue STAC public, aperçus rendus par son API de données, sans compte ----------
PC = "https://planetarycomputer.microsoft.com/api/stac/v1"
def pc_items(collection, query=None, days=40, n=60):
    end = datetime.date.today(); start = end - datetime.timedelta(days=days)
    body = {"collections": [collection], "datetime": start.isoformat() + "T00:00:00Z/" + end.isoformat() + "T23:59:59Z", "limit": n, "sortby": [{"field": "datetime", "direction": "desc"}]}
    if query: body["query"] = query
    r = S.post(PC + "/search", json=body, timeout=120); r.raise_for_status(); return r.json().get("features", [])
def pc_sign(href):
    r = S.get("https://planetarycomputer.microsoft.com/api/sas/v1/sign", params={"href": href}, timeout=60); r.raise_for_status(); return r.json()["href"]
def pc_recipe(name, collection, query, instrument, alt_asset=None, need=None, days=40):
    for f in pc_items(collection, query, days):
        if need and not need(f): continue
        a = f["assets"]; href = (a.get("rendered_preview") or {}).get("href")
        if not href and alt_asset and alt_asset in a: href = pc_sign(a[alt_asset]["href"])
        if not href: continue
        r = S.get(href, timeout=300)
        if not r.ok or not r.headers.get("content-type", "").startswith("image/"): print("  aperçu refusé", r.status_code, f["id"]); continue
        im = Image.open(io.BytesIO(r.content))
        if im.mode in ("RGBA", "LA", "P"):   # fond transparent (hors fauchée) -> noir
            im = im.convert("RGBA"); bg = Image.new("RGB", im.size, (0, 0, 0)); bg.paste(im, mask=im.split()[3]); im = bg
        p = f["properties"]
        save(name, im, {"src": "copernicus", "archive": "Microsoft Planetary Computer (catalogue STAC)", "collection": collection, "product": f["id"],
             "datetime": p.get("datetime"), "instrument": instrument, "platform": p.get("platform"), "cloud": p.get("eo:cloud_cover"),
             "href": href.split("&st=")[0] if "sig=" in href else href, "page": PC + "/collections/" + collection + "/items/" + f["id"],
             "credit": "Contains modified Copernicus Sentinel data " + str(p.get("datetime", ""))[:4] + " ; aperçu : Microsoft Planetary Computer"})
        return
    raise RuntimeError("aucun produit retenu dans " + collection)
def sentinel1(): pc_recipe("sentinel1-sar", "sentinel-1-grd", {"sar:instrument_mode": {"eq": "IW"}, "platform": {"in": ["SENTINEL-1C", "SENTINEL-1D", "sentinel-1c", "sentinel-1d"]}}, "C-SAR",
                          need=lambda f: "rendered_preview" in f["assets"])
def sentinel2(): pc_recipe("sentinel2-msi", "sentinel-2-l2a", {"eo:cloud_cover": {"lt": 3}, "s2:nodata_pixel_percentage": {"lt": 5}}, "MSI")
def sentinel3(): pc_recipe("sentinel3-olci", "sentinel-3-olci-wfr-l2-netcdf", {"eo:cloud_cover": {"lt": 20}}, "OLCI", alt_asset="browse-jpg", days=20)

# ---------- NASA GIBS (Global Imagery Browse Services) : images des produits NASA, sans compte ; remerciement demandé par GIBS ----------
GIBS_ACK = "Imagery from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Science Data and Information System (ESDIS)"
def gibs(name, layer, bbox, size, instrument, product, date=None, legend=None):
    q = {"SERVICE": "WMS", "REQUEST": "GetMap", "VERSION": "1.3.0", "LAYERS": layer, "CRS": "EPSG:4326", "STYLES": "",
         "BBOX": ",".join(str(v) for v in bbox), "WIDTH": size[0], "HEIGHT": size[1], "FORMAT": "image/png"}
    if date: q["TIME"] = date
    url = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"; r = S.get(url, params=q, timeout=300)
    if not r.ok or not r.headers.get("content-type", "").startswith("image/"): raise RuntimeError("GIBS %s %s" % (r.status_code, r.text[:200]))
    im = Image.open(io.BytesIO(r.content)).convert("RGBA"); bg = Image.new("RGB", im.size, (0, 0, 0)); bg.paste(im, mask=im.split()[3]); im = bg
    meta = {"src": "nasa-cc0", "archive": "NASA GIBS (Worldview)", "collection": layer, "product": product, "datetime": date or "", "instrument": instrument,
            "bbox_lat_lon": bbox, "href": r.url, "page": "https://worldview.earthdata.nasa.gov/?l=" + layer + ("&t=" + date if date else ""), "credit": "NASA ; " + GIBS_ACK}
    if legend:   # légende officielle de la couche (GIBS), collée sous l'image
        lg = S.get(legend, timeout=60)
        if lg.ok and lg.headers.get("content-type", "").startswith("image/png"):
            L = Image.open(io.BytesIO(lg.content)).convert("RGBA"); k = min(1.0, im.width / L.width); L = L.resize((round(L.width * k), round(L.height * k)))
            out = Image.new("RGB", (im.width, im.height + L.height + 8), (255, 255, 255)); out.paste(im, (0, 0)); out.paste(L, ((im.width - L.width) // 2, im.height + 4), L); im = out
            meta["legend"] = legend
    save(name, im, meta, max_px=1000)
def days_ago(n): return (datetime.date.today() - datetime.timedelta(days=n)).isoformat()
EUROPE = [41, -5, 51.5, 10]   # lat min, lon min, lat max, lon max : France et Alpes (même lieu que la galerie)
def terra(): gibs("terra-modis", "MODIS_Terra_CorrectedReflectance_TrueColor", EUROPE, (1000, 700), "MODIS", "MODIS Terra, réflectance corrigée, couleurs naturelles", days_ago(3))
def aqua(): gibs("aqua-modis", "MODIS_Aqua_CorrectedReflectance_TrueColor", EUROPE, (1000, 700), "MODIS", "MODIS Aqua, réflectance corrigée, couleurs naturelles", days_ago(3))
def gracefo():
    layer = "GRACE_Tellus_Liquid_Water_Equivalent_Thickness_Mascon_CRI"
    cap = S.get("https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml", timeout=120).text
    blk = cap[cap.find("<ows:Identifier>" + layer + "</ows:Identifier>") - 4000:][:9000]
    leg = re.findall(r'xlink:href="([^"]+?(?:_H|horizontal)[^"]*?\.png)"', blk) or re.findall(r'xlink:href="([^"]+?\.png)"', blk)
    dflt = re.search(r'<Dimension>.*?<Default>([^<]+)</Default>', blk[blk.find(layer):], re.S)
    date = dflt.group(1)[:10] if dflt else None
    gibs("gracefo-mascon", layer, [-90, -180, 90, 180], (1000, 500), "KBR / LRI", "GRACE et GRACE-FO, épaisseur d'eau équivalente (mascons JPL RL06.3 CRI)", date, leg[0] if leg else None)

# ---------- images publiées (Wikimedia Commons) : licence relue dans les métadonnées ; domaine public ou CC BY-SA seulement ----------
def commons(name, title, instrument, what_fr, max_px=1000):
    r = S.get("https://commons.wikimedia.org/w/api.php", params={"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url|extmetadata|size|timestamp",
              "iiurlwidth": 1600, "format": "json"}, timeout=60)
    ii = next(iter(r.json()["query"]["pages"].values()))["imageinfo"][0]; em = ii.get("extmetadata", {})
    v = lambda k: re.sub(r"<[^>]+>", "", (em.get(k) or {}).get("value", "")).strip()
    lic = v("LicenseShortName")
    if not re.search(r"public domain|^PD|CC BY-SA 3\.0 igo|CC BY 4\.0|CC BY-SA 4\.0", lic, re.I): raise RuntimeError("licence refusée : " + lic)
    im = Image.open(io.BytesIO(S.get(ii.get("thumburl") or ii["url"], timeout=300).content))
    save(name, im, {"src": "commons", "press": True, "archive": "Wikimedia Commons", "collection": "", "product": title[5:], "title": v("ObjectName") or title[5:],
         "datetime": v("DateTimeOriginal")[:10] or ii.get("timestamp", "")[:10], "instrument": instrument, "href": ii["url"], "page": ii.get("descriptionurl"),
         "credit": (v("Artist") or v("Credit"))[:240], "license": lic, "license_url": v("LicenseUrl"), "source": v("Credit")[:240],
         "description": v("ImageDescription")[:500], "what_fr": what_fr}, max_px)
def sentinel5p(): commons("sentinel5p-tropomi", "File:Nitrogen dioxide over the Netherlands (TROPOMI, 2017-12-01).png", "TROPOMI", "dioxyde d'azote")
def swot(): commons("swot-karin", "File:Global sea surface height by the Surface Water and Ocean Topography (SWOT) mission – the first 21-day cycle (SVS31265 - swot 2023-10-30-A 0001).tiff", "KaRIn", "hauteur de la mer")
def icesat2(): commons("icesat2-atlas", "File:ICESat-2 Sea Ice Thickness 2023 (SVS5100 - sea ice thickness 2023 1570 print).jpg", "ATLAS", "épaisseur de la banquise")

RECIPES = {"textures": earth_texture, "landsat9": landsat9, "sentinel1": sentinel1, "sentinel2": sentinel2, "sentinel3": sentinel3, "sentinel5p": sentinel5p,
           "terra": terra, "aqua": aqua, "icesat2": icesat2, "gracefo": gracefo, "swot": swot}
if __name__ == "__main__":
    want = sys.argv[1:] or list(RECIPES); bad = 0
    for k in want:
        try: RECIPES[k]()
        except Exception as e: bad += 1; print("ÉCHEC", k, repr(e)[:300])
    sys.exit(1 if bad == len(want) else 0)
