#!/usr/bin/env python3
"""Données réelles : une recette par produit, indépendantes. Chaque recette télécharge un produit d'une archive publique,
en tire un aperçu léger dans data/, et écrit à côté une fiche JSON (archive, collection, produit, date, URL, licence de la source) (règle 3).
Le champ « src » de chaque fiche nomme la règle de licence appliquée par tools/data/credits.py.
Usage : python tools/data/fetch_data.py [recette …]   (sans argument : toutes)."""
import time, io, json, os, re, sys, datetime, requests
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
             "page": CMR + "/search/concepts/" + meta["concept-id"] + ".umm_json",   # la page .html des granules répond 400 "doi": "10.5067/HLS/HLSL30.002",
             "credit": "NASA/USGS Landsat 9 ; HLS : NASA LP DAAC", "attrs": {k: a[k] for k in list(a)[:40]}})
        return
    raise RuntimeError("aucune scène HLS Landsat 9 retenue")

# ---------- Planetary Computer (Microsoft) : catalogue STAC public, aperçus rendus par son API de données, sans compte ----------
PC = "https://planetarycomputer.microsoft.com/api/stac/v1"
def pc_items(collection, query=None, days=40, n=60, bbox=None):
    end = datetime.date.today(); start = end - datetime.timedelta(days=days)
    body = {"collections": [collection], "datetime": start.isoformat() + "T00:00:00Z/" + end.isoformat() + "T23:59:59Z", "limit": n, "sortby": [{"field": "datetime", "direction": "desc"}]}
    if query: body["query"] = query
    if bbox: body["bbox"] = bbox
    r = S.post(PC + "/search", json=body, timeout=120); r.raise_for_status(); return r.json().get("features", [])
def pc_sign(href):
    for k in range(5):   # le service de signature limite le débit (429) : on attend et on réessaie
        r = S.get("https://planetarycomputer.microsoft.com/api/sas/v1/sign", params={"href": href}, timeout=60)
        if r.status_code != 429: break
        time.sleep(10 * (k + 1))
    r.raise_for_status(); return r.json()["href"]
def pc_recipe(name, collection, query, instrument, alt_asset=None, need=None, days=40, bbox=None):
    for f in pc_items(collection, query, days, bbox=bbox):
        if need and not need(f): continue
        a = f["assets"]; href = (a.get("rendered_preview") or {}).get("href")
        if not href and alt_asset and alt_asset in a: href = pc_sign(a[alt_asset]["href"])
        if not href: continue
        r = S.get(href, timeout=300)
        # le stockage Azure sert les aperçus signés en application/octet-stream : on reconnaît le JPEG ou le PNG à leurs premiers octets
        if not r.ok or not (r.headers.get("content-type", "").startswith("image/") or r.content[:3] == b"\xff\xd8\xff" or r.content[:4] == b"\x89PNG"): print("  aperçu refusé", r.status_code, f["id"]); continue
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
ALPS = [5.8, 45.6, 7.2, 46.6]   # lon min, lat min, lon max, lat max : Léman et Mont-Blanc (dans la zone EUROPE de la galerie)
def sentinel1(): pc_recipe("sentinel1-sar", "sentinel-1-grd", {"sar:instrument_mode": {"eq": "IW"}, "platform": {"in": ["SENTINEL-1C", "SENTINEL-1D", "sentinel-1c", "sentinel-1d"]}}, "C-SAR",
                          need=lambda f: "rendered_preview" in f["assets"], bbox=ALPS)
def sentinel2(): pc_recipe("sentinel2-msi", "sentinel-2-l2a", {"eo:cloud_cover": {"lt": 10}, "s2:nodata_pixel_percentage": {"lt": 5}}, "MSI", bbox=ALPS, days=90)
def sentinel3(): pc_recipe("sentinel3-olci", "sentinel-3-olci-wfr-l2-netcdf", None, "OLCI", alt_asset="browse-jpg", days=10, bbox=[-5, 41, 10, 51.5],
                          need=lambda f: "browse-jpg" in f["assets"] or "rendered_preview" in f["assets"])

# ---------- NASA GIBS (Global Imagery Browse Services) : images des produits NASA, sans compte ; remerciement demandé par GIBS ----------
GIBS_ACK = "Imagery from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Science Data and Information System (ESDIS)"
def gibs_get(layer, bbox, size, date=None):
    q = {"SERVICE": "WMS", "REQUEST": "GetMap", "VERSION": "1.3.0", "LAYERS": layer, "CRS": "EPSG:4326", "STYLES": "",
         "BBOX": ",".join(str(v) for v in bbox), "WIDTH": size[0], "HEIGHT": size[1], "FORMAT": "image/png"}
    if date: q["TIME"] = date
    url = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"; r = S.get(url, params=q, timeout=300)
    if not r.ok or not r.headers.get("content-type", "").startswith("image/"): raise RuntimeError("GIBS %s %s" % (r.status_code, r.text[:200]))
    return Image.open(io.BytesIO(r.content)).convert("RGBA"), r.url
_CAP = {}
def gibs_cap(layer):
    """Date par défaut (la plus récente) et légende horizontale d'une couche, lues dans le GetCapabilities WMTS de GIBS."""
    if "x" not in _CAP: _CAP["x"] = S.get("https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml", timeout=180).text
    cap = _CAP["x"]; i = cap.find("<ows:Identifier>" + layer + "</ows:Identifier>")
    if i < 0: raise RuntimeError("couche GIBS absente : " + layer)
    blk = cap[i:cap.find("</Layer>", i)]   # la couche seule, de son identifiant à sa fin (attributs entre apostrophes)
    leg = re.findall(r"""xlink:href=['"]([^'"]+?_H\.(?:svg|png))['"]""", blk) or re.findall(r"""LegendURL[^>]*xlink:href=['"]([^'"]+)['"]""", blk)
    dflt = re.search(r'<Dimension>.*?<Default>([^<]+)</Default>', blk, re.S)
    return (dflt.group(1) if dflt else None), (leg[0] if leg else None)
def gibs(name, layer, bbox, size, instrument, product, date=None, legend=None, stack=0, extra=None):
    """Image d'une couche GIBS. stack = n : superpose les n jours qui finissent à date (couches à traces étroites, comme OCO-2 ou NISAR)."""
    days = [date] if not stack else [(datetime.date.fromisoformat(date[:10]) - datetime.timedelta(days=k)).isoformat() for k in range(stack - 1, -1, -1)]
    im = None; url = None
    for d in days:
        try: a, url1 = gibs_get(layer, bbox, size, d)
        except Exception as e:
            if not stack: raise
            print("GIBS", layer, d, repr(e)[:120]); continue
        im = a if im is None else Image.alpha_composite(im, a); url = url or url1
    if im is None: raise RuntimeError("GIBS : aucune image pour " + layer)
    bg = Image.new("RGB", im.size, (0, 0, 0)); bg.paste(im, mask=im.split()[3]); im = bg
    meta = {"src": "nasa-cc0", "archive": "NASA GIBS (Worldview)", "collection": layer, "product": product, "datetime": date or "", "instrument": instrument,
            "bbox_lat_lon": bbox, "href": url, "page": "https://worldview.earthdata.nasa.gov/?l=" + layer + ("&t=" + date if date else ""), "credit": "NASA ; " + GIBS_ACK}
    if stack: meta.update(stack_days=stack, date_first=days[0])
    if extra: meta.update(extra)
    if legend:   # légende officielle de la couche (GIBS), collée sous l'image
        lg = S.get(legend[:-4] + ".png" if legend.endswith(".svg") else legend, timeout=60)   # GIBS publie chaque légende en SVG et en PNG
        L = None
        if lg.ok and lg.headers.get("content-type", "").startswith("image/png"): legend = lg.url; L = Image.open(io.BytesIO(lg.content)).convert("RGBA")
        elif legend.endswith(".svg"):   # sinon : le SVG, converti en PNG par cairosvg
            sv = S.get(legend, timeout=60)
            if sv.ok:
                import cairosvg
                L = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=sv.content, output_width=min(im.width, 760)))).convert("RGBA")
        if L is not None:
            k = min(1.0, im.width / L.width); L = L.resize((round(L.width * k), round(L.height * k)))
            out = Image.new("RGB", (im.width, im.height + L.height + 8), (255, 255, 255)); out.paste(im, (0, 0)); out.paste(L, ((im.width - L.width) // 2, im.height + 4), L); im = out
            meta["legend"] = legend
    save(name, im, meta, max_px=1000)
def gibs_latest(name, layers, bbox, size, instrument, product, stack=0, legend=True, extra=None):
    """Première couche disponible de la liste, à sa date par défaut (la plus récente), avec sa légende."""
    err = None
    for layer in layers:
        try:
            d, leg = gibs_cap(layer)
            return gibs(name, layer, bbox, size, instrument, product, d, leg if legend else None, stack, extra)
        except Exception as e: err = e; print("GIBS", layer, repr(e)[:160])
    raise err
def days_ago(n): return (datetime.date.today() - datetime.timedelta(days=n)).isoformat()
EUROPE = [41, -5, 51.5, 10]   # lat min, lon min, lat max, lon max : France et Alpes (même lieu que la galerie)
def terra(): gibs("terra-modis", "MODIS_Terra_CorrectedReflectance_TrueColor", EUROPE, (1000, 700), "MODIS", "MODIS Terra, réflectance corrigée, couleurs naturelles", days_ago(3))
def aqua(): gibs("aqua-modis", "MODIS_Aqua_CorrectedReflectance_TrueColor", EUROPE, (1000, 700), "MODIS", "MODIS Aqua, réflectance corrigée, couleurs naturelles", days_ago(3))
def gracefo(): gibs_latest("gracefo-mascon", ["GRACE_Tellus_Liquid_Water_Equivalent_Thickness_Mascon_CRI"], WORLD, (1000, 500), "KBR / LRI",
                            "GRACE et GRACE-FO, épaisseur d'eau équivalente (mascons JPL RL06.3 CRI)")
WORLD = [-90, -180, 90, 180]
NAMERICA = [14, -128, 58, -58]   # Amérique du Nord, champ de TEMPO
GOES_DISK = [-81.3, -156.2, 81.3, 6.2]   # disque vu depuis 75,2° O
def pace(): gibs_latest("pace-oci", ["OCI_PACE_True_Color"], WORLD, (1000, 500), "OCI", "PACE OCI, réflectance corrigée, couleurs naturelles (une journée)", legend=False)
def jpss(): gibs_latest("jpss-viirs", ["VIIRS_NOAA21_CorrectedReflectance_TrueColor", "VIIRS_NOAA20_CorrectedReflectance_TrueColor"], EUROPE, (1000, 700), "VIIRS",
                        "VIIRS, réflectance corrigée, couleurs naturelles", legend=False)
def smap(): gibs_latest("smap-radiometer", ["SMAP_L3_Passive_Enhanced_Day_Soil_Moisture", "SMAP_L3_Passive_Day_Soil_Moisture", "SMAP_L4_Analyzed_Root_Zone_Soil_Moisture"],
                        WORLD, (1000, 500), "Radiomètre", "SMAP, humidité du sol", stack=3)
def oco2(): gibs_latest("oco2-co2", ["OCO-2_Carbon_Dioxide_Total_Column_Average"], WORLD, (1000, 500), "OCO-2", "OCO-2, CO₂ moyen sur la colonne d'air (XCO₂), traces de 16 jours", stack=16)
def gpm(): gibs_latest("gpm-imerg", ["IMERG_Precipitation_Rate"], WORLD, (1000, 500), "GMI / DPR", "IMERG, taux de précipitation (une journée)")
def nisar(): gibs_latest("nisar-sar", ["NISAR_L2_Geocoded_Polarimetric_Covariance"], WORLD, (1000, 500), "L-SAR", "NISAR, rétrodiffusion radar en fausses couleurs (GCOV), traces de 12 jours", stack=12, legend=False)
def aura(): gibs_latest("aura-omi", ["OMI_Ozone_DOAS_Total_Column", "OMI_Ozone_TOMS_Total_Column"], WORLD, (1000, 500), "OMI", "OMI, colonne totale d'ozone (une journée)")
def tempo(): gibs_latest("tempo-no2", ["TEMPO_L3_NO2_Vertical_Column_Troposphere"], NAMERICA, (1000, 629), "TEMPO", "TEMPO, NO₂ troposphérique (un balayage horaire)")
def goes(): gibs_latest("goes-abi", ["GOES-East_ABI_GeoColor"], GOES_DISK, (900, 900), "ABI", "GOES-East (GOES-19) ABI, GeoColor (une image du disque)", legend=False)

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
         "datetime": v("DateTimeOriginal")[:10] if re.match(r"\d{4}-\d{2}-\d{2}", v("DateTimeOriginal")) else ii.get("timestamp", "")[:10], "instrument": instrument, "href": ii["url"], "page": ii.get("descriptionurl"),
         "credit": (v("Artist") if v("Artist") and not v("Artist").startswith("http") else v("Credit"))[:240], "license": lic, "license_url": v("LicenseUrl"), "source": v("Credit")[:240],
         "description": v("ImageDescription")[:500], "what_fr": what_fr}, max_px)
def sentinel5p(): commons("sentinel5p-tropomi", "File:Nitrogen dioxide over the Netherlands (TROPOMI, 2017-12-01).png", "TROPOMI", "dioxyde d'azote")
def swot(): commons("swot-karin", "File:Global sea surface height by the Surface Water and Ocean Topography (SWOT) mission – the first 21-day cycle (SVS31265 - swot 2023-10-30-A 0001).tiff", "KaRIn", "hauteur de la mer")
def sentinel6(): commons("sentinel6-poseidon", "File:Sea Surface Height Anomaly from Sentinel-6 MF (SVS31174).png", "Poseidon-4", "anomalie de hauteur de la mer")
def icesat2(): commons("icesat2-atlas", "File:ICESat-2 Sea Ice Thickness 2023 (SVS5100 - sea ice thickness 2023 1570 print).jpg", "ATLAS", "épaisseur de la banquise")

# ---------- galerie « le même lieu » : la même zone, découpée à l'identique dans les images de plusieurs satellites ----------
LIEU = [6.3, 45.8, 7.0, 46.4]   # lon min, lat min, lon max, lat max : Mont-Blanc, Chamonix, Annecy et l'est du Léman (≈ 54 × 67 km)
LIEU_PX = 800
ZOOM = [6.86, 45.885, 6.96, 45.955]   # gros plan ≈ 7,8 × 7,8 km (Chamonix et la Mer de Glace), découpé à la taille réelle des pixels de chaque instrument
def zoom_px(res_m):
    import math
    return max(8, round((ZOOM[2] - ZOOM[0]) * 111320 * math.cos(math.radians((ZOOM[1] + ZOOM[3]) / 2)) / res_m)), max(8, round((ZOOM[3] - ZOOM[1]) * 110950 / res_m))
def lieu_size(px=LIEU_PX):
    import math
    w = (LIEU[2] - LIEU[0]) * math.cos(math.radians((LIEU[1] + LIEU[3]) / 2)); h = LIEU[3] - LIEU[1]
    return (px, round(px * h / w)) if w >= h else (round(px * w / h), px)
def inside(geom, pts):
    """Tous les points (lon, lat) dans le polygone (premier anneau ; MultiPolygon : n'importe lequel des polygones)."""
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    def pin(r, x, y):
        c = False
        for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
        return c
    return all(any(pin([tuple(q[:2]) for q in pl[0]], x, y) for pl in polys) for x, y in pts)
def corners(b): return [(b[0], b[1]), (b[2], b[1]), (b[2], b[3]), (b[0], b[3]), ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2)]
def pc_crop(f, w, h, box=None):
    """Découpe LIEU dans un produit du Planetary Computer, avec les réglages de rendu de son aperçu officiel (rendered_preview)."""
    from urllib.parse import urlsplit, parse_qsl
    pv = f["assets"]["rendered_preview"]["href"]; q = [(k, v) for k, v in parse_qsl(urlsplit(pv).query) if k != "format"]
    bb = ",".join(str(v) for v in (box or LIEU))
    for path in ("item/bbox/%s/%dx%d.png" % (bb, w, h), "item/crop/%s/%dx%d.png" % (bb, w, h)):
        r = S.get("https://planetarycomputer.microsoft.com/api/data/v1/" + path, params=q, timeout=300)
        if r.ok and (r.content[:4] == b"\x89PNG" or r.content[:3] == b"\xff\xd8\xff"): return r.url, Image.open(io.BytesIO(r.content))
        print("  découpe refusée", path.split("/")[1], r.status_code, r.text[:160])
    return None, None
def black_share(im):
    g = im.convert("L").resize((100, 100)); return sum(1 for v in g.getdata() if v < 4) / 10000
def lieu_pc(key, sat, collection, query, instrument, src, credit, days, ms):
    """Produits du même jour et du même satellite réunis (une tuile ne couvre pas toujours toute la zone) : chaque découpe est collée
    sur la précédente là où elle a des pixels ; on garde le jour le plus récent où la zone est entière."""
    w, h = lieu_size(); groups = {}
    for f in pc_items(collection, query, days, n=200, bbox=LIEU):
        if "rendered_preview" not in f["assets"]: continue
        p = f["properties"]; groups.setdefault((str(p.get("datetime"))[:10], p.get("platform")), []).append(f)
    for (day, plat), fs in sorted(groups.items(), key=lambda x: x[0][0], reverse=True):
        full = [f for f in fs if inside(f["geometry"], corners(LIEU))]
        fs = (full[:1] or fs)[:4]; acc = None; urls = []
        for f in fs:
            url, im = pc_crop(f, w, h)
            if im is None: continue
            im = im.convert("RGBA"); urls.append(url)
            if acc is None: acc = Image.new("RGBA", im.size, (0, 0, 0, 0))
            acc.alpha_composite(im)
        if acc is None: continue
        im = Image.new("RGB", acc.size, (0, 0, 0)); im.paste(acc, mask=acc.split()[3])
        if black_share(im) > 0.02: print("  zone incomplète", day, plat, len(fs)); continue
        f = fs[0]; p = f["properties"]
        save("lieu-" + key, im, {"src": src, "lieu": LIEU, "sat": sat, "res_m": ms, "archive": "Microsoft Planetary Computer (catalogue STAC, découpe par son service de rendu)",
             "collection": collection, "product": " + ".join(x["id"] for x in fs), "datetime": p.get("datetime"), "instrument": instrument, "platform": p.get("platform"),
             "cloud": p.get("eo:cloud_cover"), "href": urls[0].split("&st=")[0], "page": PC + "/collections/" + collection + "/items/" + f["id"],
             "credit": credit.replace("{y}", str(p.get("datetime", ""))[:4]), "crop_lieu": True, "mosaic": len(urls)}, max_px=LIEU_PX)
        zw, zh = zoom_px(ms); acc = None
        for x in fs:
            u, zi = pc_crop(x, zw, zh, ZOOM)
            if zi is None: continue
            zi = zi.convert("RGBA"); acc = acc or Image.new("RGBA", zi.size, (0, 0, 0, 0)); acc.alpha_composite(zi)
        if acc is not None:
            zi = Image.new("RGB", acc.size, (0, 0, 0)); zi.paste(acc, mask=acc.split()[3])
            save("lieu-" + key + "-zoom", zi, {"src": src, "lieu": ZOOM, "zoom_of": "lieu-" + key, "sat": sat, "res_m": ms, "archive": "Microsoft Planetary Computer (catalogue STAC, découpe par son service de rendu)",
                 "collection": collection, "product": " + ".join(x["id"] for x in fs), "datetime": p.get("datetime"), "instrument": instrument, "href": u.split("&st=")[0],
                 "page": PC + "/collections/" + collection + "/items/" + f["id"], "credit": credit.replace("{y}", str(p.get("datetime", ""))[:4]), "crop_lieu": True, "native_px": True}, max_px=4000)
        print("lieu", key, day, plat, len(urls), "produit(s)"); return p.get("datetime")
    raise RuntimeError("lieu : aucun jour de " + collection + " ne couvre toute la zone")
def lieu():
    bad = 0; dates = {}
    for key, args in (("sentinel2", ("sentinel2", "sentinel-2-l2a", {"eo:cloud_cover": {"lt": 10}}, "MSI", "copernicus", "Contains modified Copernicus Sentinel data {y} (via Microsoft Planetary Computer)", 120, 10)),
                      ("landsat9", ("landsat9", "landsat-c2-l2", {"platform": {"in": ["landsat-9"]}, "eo:cloud_cover": {"lt": 15}}, "OLI-2", "usgs-pd", "Landsat 9: USGS (via Microsoft Planetary Computer)", 120, 30)),
                      ("sentinel1", ("sentinel1", "sentinel-1-rtc", {"sar:instrument_mode": {"eq": "IW"}}, "C-SAR", "copernicus", "Contains modified Copernicus Sentinel data {y} (terrain correction: Microsoft Planetary Computer)", 30, 10))):
        try: dates[key] = lieu_pc(key, *args)
        except Exception as e: bad += 1; print("ÉCHEC lieu", key, repr(e)[:200])
    d = (dates.get("sentinel2") or days_ago(3))[:10]   # MODIS le même jour que Sentinel-2 (passages du matin et de l'après-midi)
    bb = [LIEU[1], LIEU[0], LIEU[3], LIEU[2]]; w, h = lieu_size(400)
    for key, sat, layer in (("terra", "terra", "MODIS_Terra_CorrectedReflectance_TrueColor"), ("aqua", "aqua", "MODIS_Aqua_CorrectedReflectance_TrueColor")):
        try:
            gibs("lieu-" + key, layer, bb, (w, h), "MODIS", "MODIS " + key.capitalize() + ", réflectance corrigée, couleurs naturelles", d)
            f = os.path.join(DATA, "lieu-" + key + ".json"); m = json.load(open(f, encoding="utf-8")); m.update(lieu=LIEU, sat=sat, res_m=250, crop_lieu=True)
            json.dump(m, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
            zb = [ZOOM[1], ZOOM[0], ZOOM[3], ZOOM[2]]; gibs("lieu-" + key + "-zoom", layer, zb, zoom_px(250), "MODIS", "MODIS " + key.capitalize() + ", réflectance corrigée, couleurs naturelles", d)
            f = os.path.join(DATA, "lieu-" + key + "-zoom.json"); m = json.load(open(f, encoding="utf-8")); m.update(lieu=ZOOM, zoom_of="lieu-" + key, sat=sat, res_m=250, crop_lieu=True, native_px=True)
            json.dump(m, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False); print("lieu", key, d)
        except Exception as e: bad += 1; print("ÉCHEC lieu", key, repr(e)[:200])
    if bad == 5: raise RuntimeError("lieu : aucune image")

RECIPES = {"textures": earth_texture, "landsat9": landsat9, "sentinel1": sentinel1, "sentinel2": sentinel2, "sentinel3": sentinel3, "sentinel5p": sentinel5p,
           "terra": terra, "aqua": aqua, "icesat2": icesat2, "gracefo": gracefo, "swot": swot, "lieu": lieu,
           "pace": pace, "jpss": jpss, "smap": smap, "oco2": oco2, "gpm": gpm, "nisar": nisar, "aura": aura, "tempo": tempo, "goes": goes, "sentinel6": sentinel6}
if __name__ == "__main__":
    want = sys.argv[1:] or list(RECIPES); bad = 0
    for k in want:
        try: RECIPES[k]()
        except Exception as e: bad += 1; print("ÉCHEC", k, repr(e)[:300])
    sys.exit(1 if bad == len(want) else 0)
