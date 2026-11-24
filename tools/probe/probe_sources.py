#!/usr/bin/env python3
"""Sonde de l'étape 1 d'EarthObservers : ce que les sources publiques exposent vraiment, depuis GitHub Actions.
1. Catalogues STAC (Copernicus Data Space, Earth Search, Planetary Computer, NASA CMR-STAC) : collections utiles, licence
   déclarée, dernier item, rôles et hôtes des assets d'aperçu, et si l'aperçu se télécharge sans compte.
2. CelesTrak : éléments orbitaux (GP, JSON) de chaque satellite pressenti, par nom.
3. Maquettes 3D : application « Eyes on the Earth » de la NASA (chemins sc_*), dépôt nasa/NASA-3D-Resources.
4. Pages de licence : Copernicus, USGS Landsat, NASA Earthdata, EUMETSAT ; phrases clés relevées.
Sortie : tools/probe/_out/sources/ (branche probe-out)."""
import os, re, json
from urllib.parse import urljoin
import requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out", "sources"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "Mozilla/5.0 (earthobservers-probe/1.0; +https://github.com/Rolgim/EarthObservers)"
REP = []
def log(*a):
    s = " ".join(str(x) for x in a); print(s, flush=True); REP.append(s)
def get(u, **kw):
    try: return S.get(u, timeout=kw.pop("timeout", 90), **kw)
    except Exception as e: log("  ÉCHEC", u, repr(e)[:160]); return None
def dump(name, obj): json.dump(obj, open(os.path.join(OUT, name), "w"), indent=1, ensure_ascii=False)

WANT = r"sentinel|landsat|modis|terra|aqua|viirs|icesat|atl0|grace|swot|tropomi|s5p|olci|slstr|msi|grd|smap|goes|aster|airs|ceres"
CATS = {"copernicus": "https://stac.dataspace.copernicus.eu/v1", "earth-search": "https://earth-search.aws.element84.com/v1",
        "planetary-computer": "https://planetarycomputer.microsoft.com/api/stac/v1"}
log("## 1. Catalogues STAC")
found = {}
def collections(root):
    out, u = [], root.rstrip("/") + "/collections"
    for _ in range(30):
        r = get(u)
        if not r or not r.ok: log("  collections", u, r.status_code if r else "-"); break
        j = r.json(); out += j.get("collections", [])
        nx = [l["href"] for l in j.get("links", []) if l.get("rel") == "next"]
        if not nx: break
        u = nx[0]
    return out
def probe_cat(name, root, max_items=40):
    r = get(root); log(f"### {name} {root} -> {r.status_code if r else '-'}")
    if not r or not r.ok: return
    cols = collections(root); log("  collections :", len(cols))
    keep = [c for c in cols if re.search(WANT, c.get("id", "") + " " + (c.get("title") or ""), re.I)]
    found[name] = []
    for c in keep[:max_items]:
        cid = c["id"]; lic = c.get("license"); ll = [l.get("href") for l in c.get("links", []) if l.get("rel") == "license"]
        ext = (c.get("extent", {}).get("temporal", {}).get("interval") or [[None, None]])[0]
        rec = {"id": cid, "title": c.get("title"), "license": lic, "license_links": ll, "temporal": ext}
        rs = None
        try: rs = S.post(root.rstrip("/") + "/search", json={"collections": [cid], "limit": 1, "sortby": [{"field": "properties.datetime", "direction": "desc"}]}, timeout=90)
        except Exception as e: rec["search"] = repr(e)[:120]
        if rs is not None and not rs.ok:
            rs = get(root.rstrip("/") + "/search?collections=" + cid + "&limit=1")
        if rs is not None and rs.ok and rs.json().get("features"):
            f = rs.json()["features"][0]; rec["item"] = f["id"]; rec["datetime"] = f["properties"].get("datetime")
            prev = []
            for k, a in f.get("assets", {}).items():
                roles = a.get("roles") or []
                if set(roles) & {"thumbnail", "overview", "visual", "browse"} or re.search(r"thumb|preview|browse|quicklook|visual|rendered", k, re.I):
                    h = a.get("href", ""); st = None
                    if h.startswith("http"):
                        try: hr = S.get(h, timeout=60, stream=True); st = hr.status_code; ct = hr.headers.get("content-type"); hr.close()
                        except Exception as e: st = "ERR"; ct = None
                    else: ct = None
                    prev.append({"key": k, "roles": roles, "type": a.get("type"), "host": re.sub(r"^(\w+://[^/]+).*", r"\1", h), "status": st, "ctype": ct})
            rec["previews"] = prev
        found[name].append(rec)
        p = rec.get("previews") or []
        log(f"  - {cid} | {lic} | {rec.get('datetime','')} | aperçus : " + "; ".join(f"{x['key']}({x['status']},{x['host']})" for x in p))
for n, u in CATS.items(): probe_cat(n, u)
# NASA CMR-STAC : un catalogue par fournisseur
log("### NASA CMR-STAC")
for prov in ("LPCLOUD", "NSIDC_CPRD", "POCLOUD", "GES_DISC", "LAADS", "LANCEMODIS"):
    probe_cat("cmr-" + prov, "https://cmr.earthdata.nasa.gov/stac/" + prov, max_items=15)
dump("stac.json", found)

log("\n## 2. CelesTrak (GP JSON)")
SATS = ["LANDSAT 8", "LANDSAT 9", "SENTINEL-2A", "SENTINEL-2B", "SENTINEL-2C", "SENTINEL-1A", "SENTINEL-1C", "SENTINEL-3A", "SENTINEL-3B",
        "SENTINEL-5P", "TERRA", "AQUA", "ICESAT-2", "GRACE-FO 1", "GRACE-FO 2", "SWOT", "SMAP", "SUOMI NPP", "NOAA 20", "GOES 18", "METEOSAT-12"]
gp = {}
for n in SATS:
    r = get("https://celestrak.org/NORAD/elements/gp.php", params={"NAME": n, "FORMAT": "json"})
    if not r or not r.ok: log("  ", n, "->", r.status_code if r else "-"); continue
    try: j = r.json()
    except Exception: log("  ", n, "-> pas de JSON :", r.text[:80]); continue
    gp[n] = j; log("  ", n, "->", [(x.get("OBJECT_NAME"), x.get("NORAD_CAT_ID"), x.get("EPOCH"), round(x.get("INCLINATION", 0), 2), x.get("MEAN_MOTION")) for x in j][:4])
dump("celestrak.json", gp)

log("\n## 3. Maquettes 3D")
for base in ("https://eyes.nasa.gov/apps/earth/", "https://eyes.nasa.gov/apps/solar-system/"):
    r = get(base)
    if not r or not r.ok: log(base, "->", r.status_code if r else "-"); continue
    srcs = [urljoin(r.url, m) for m in re.findall(r'<script[^>]+src="([^"]+)"', r.text)]
    app = ""
    for u in srcs:
        t = get(u, timeout=120)
        if t is not None and t.ok: app += t.text
    log(base, "scripts", len(srcs), "taille", len(app))
    paths = sorted(set(re.findall(r'models/(sc_[a-z0-9_]+/[^"\'\s]+\.(?:gltf|glb))', app)))
    log("  maquettes sc_* :", len(paths))
    for p in paths:
        if re.search(r"landsat|terra|aqua|icesat|grace|swot|sentinel|smap|suomi|npp|noaa|jpss|goes|oco|calipso|cloudsat|aura|gpm|pace|nisar|tempo|sorce|jason|metop", p, re.I): log("   ", p)
    roots = sorted(set(re.findall(r'https://[a-z0-9.\-]+/[a-z0-9_/\-]*static[a-z0-9_/\-]*', app)))[:6]
    log("  racines :", roots)
    for p in [x for x in paths if re.search(r"landsat_9|terra|aqua|icesat|grace|swot|sentinel", x, re.I)][:12]:
        for r0 in roots + ["https://eyes.nasa.gov/assets/static/"]:
            u = r0.rstrip("/") + "/models/" + p; t = get(u, timeout=60)
            if t is not None and t.ok and len(t.content) > 200:
                try: a = t.json().get("asset") if p.endswith(".gltf") else "glb"
                except Exception: a = "?"
                log("   TROUVÉ", u, len(t.content), json.dumps(a, ensure_ascii=False)[:200]); break
        else: log("   introuvable", p)
r = get("https://api.github.com/repos/nasa/NASA-3D-Resources/git/trees/master?recursive=1", timeout=180,
        headers={"Authorization": "Bearer " + os.environ["GITHUB_TOKEN"]} if os.environ.get("GITHUB_TOKEN") else {})
if r is not None and r.ok:
    tree = [x["path"] for x in r.json().get("tree", [])]
    log("NASA-3D-Resources :", len(tree), "chemins, tronqué :", r.json().get("truncated"))
    for p in tree:
        if re.search(r"3D Models/[^/]*(landsat|terra|aqua|icesat|grace|swot|sentinel|smap|suomi|jpss|goes|calipso|cloudsat|aura|gpm|oco|jason|trmm)[^/]*/?$", p, re.I): log("   ", p)
else: log("NASA-3D-Resources ->", r.status_code if r is not None else "-")

log("\n## 4. Pages de licence")
LIC = {"Copernicus (avis juridique Sentinel)": "https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice",
       "Copernicus Data Space (conditions)": "https://dataspace.copernicus.eu/terms-and-conditions",
       "USGS Landsat (politique de données)": "https://www.usgs.gov/landsat-missions/landsat-data-access",
       "USGS (crédits)": "https://www.usgs.gov/information-policies-and-instructions/crediting-usgs",
       "NASA Earthdata (politique)": "https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance",
       "EUMETSAT (politique de données)": "https://www.eumetsat.int/data-policy",
       "CelesTrak (usage)": "https://celestrak.org/webmaster.php",
       "Planetary Computer (conditions)": "https://planetarycomputer.microsoft.com/terms"}
for k, u in LIC.items():
    r = get(u, timeout=60)
    if not r: continue
    txt = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", r.text))
    log(f"### {k} : {u} -> {r.status_code} {r.url}")
    for m in list(re.finditer(r"[^.]{0,220}(free|open|licen[cs]e|attribution|acknowledg|credit|public domain|commercial|modified)[^.]{0,220}\.", txt, re.I))[:8]: log("   «", m.group(0).strip()[:440], "»")
open(os.path.join(OUT, "report.md"), "w").write("\n".join(REP) + "\n")
