#!/usr/bin/env python3
"""Sonde 4 : couches GIBS utiles (Terra, Aqua, GRACE, SWOT, ICESat-2, TROPOMI…), images publiées avec leur licence
(NASA Images, Wikimedia Commons) pour SWOT, GRACE-FO, ICESat-2 et Sentinel-5P. Sortie : _out/report4.md."""
import os, re, json, requests
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "_out"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
R = []
r = S.get("https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml", timeout=120)
R.append("## GIBS WMTS " + str(r.status_code) + " " + str(len(r.text)))
ids = re.findall(r"<ows:Identifier>([^<]+)</ows:Identifier>", r.text)
R.append("couches : " + str(len(ids)))
for i in sorted(set(ids)):
    if re.search(r"GRACE|SWOT|ICESat|ATL|TROPOMI|S5P|Sentinel|OLCI|Terra_Corrected|Aqua_Corrected|ASTER|MISR|AIRS|Landsat|HLS|SAR|NO2|Ozone|Sea_Surface_Height|Mascon|CERES", i, re.I): R.append("- " + i)
def commons(q):
    j = S.get("https://commons.wikimedia.org/w/api.php", params={"action": "query", "generator": "search", "gsrsearch": q, "gsrnamespace": 6, "gsrlimit": 12, "prop": "imageinfo", "iiprop": "url|size|extmetadata", "format": "json"}, timeout=60).json()
    R.append("## Commons : " + q)
    for p in sorted((j.get("query") or {}).get("pages", {}).values(), key=lambda p: p.get("index", 0)):
        ii = p["imageinfo"][0]; em = ii.get("extmetadata", {})
        v = lambda k: re.sub(r"<[^>]+>", "", str((em.get(k) or {}).get("value", "")))[:140]
        R.append("- " + p["title"] + " | " + str(ii.get("width")) + "x" + str(ii.get("height")) + " | " + v("LicenseShortName") + " | " + v("Artist") + " | " + v("Credit") + " | " + ii["descriptionurl"])
for q in ["Sentinel-5P TROPOMI nitrogen dioxide", "Sentinel-5P methane", "TROPOMI", "SWOT sea surface height", "SWOT first light", "GRACE-FO water storage", "GRACE-FO gravity", "ICESat-2 elevation", "ICESat-2 ATLAS photon", "Sentinel-1 radar image", "Sentinel-3 OLCI", "Terra MODIS", "Aqua MODIS AIRS"]:
    try: commons(q)
    except Exception as e: R.append("échec " + q + repr(e)[:100])
def nasa(q):
    j = S.get("https://images-api.nasa.gov/search", params={"q": q, "media_type": "image"}, timeout=60).json()
    R.append("## NASA Images : " + q)
    for it in j["collection"]["items"][:15]:
        d = it["data"][0]; R.append("- " + d.get("nasa_id", "") + " | " + d.get("date_created", "")[:10] + " | " + d.get("center", "") + " | " + d.get("title", "")[:90] + " | " + (d.get("description", "")[:160]).replace("\n", " "))
for q in ["SWOT sea surface height", "SWOT KaRIn", "GRACE-FO water", "GRACE-FO mass change", "ICESat-2 elevation", "ICESat-2 sea ice", "TROPOMI"]:
    try: nasa(q)
    except Exception as e: R.append("échec " + q + repr(e)[:100])
open(os.path.join(OUT, "report4.md"), "w").write("\n".join(R) + "\n"); print("\n".join(R)[:3000])
