#!/usr/bin/env python3
"""Registre des crédits et licences de TOUT ce que le site montre (règles 1 et 8) :
images et tracés de data/, textures, éléments orbitaux, maquettes 3D, polices et bibliothèques.
- Lit data/*.json (métadonnées écrites au téléchargement), src/data-missions.js (maquettes) et la liste fixe des ressources externes.
- Attribue à chaque fichier sa licence d'après sa source (table SOURCES ci-dessous, chaque règle avec la page qui l'énonce).
- Écrit la licence dans chaque data/*.json (champs license_fr, license_en, license_url, credit_line, status) pour que le site l'affiche
  sous l'image, puis écrit data/credits.json et CREDITS.md (le registre lisible).
Lancé par le workflow « Données réelles » après les téléchargements ; peut se relancer seul : python tools/data/credits.py"""
import os, re, sys, json, glob

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DATA = os.path.join(ROOT, "data")
sys.path.insert(0, os.path.join(ROOT, "socle", "data"))   # parties communes du registre (socle/data/credits_lib.py)
from credits_lib import transform, dep, fonts_row, own_code_row, socle_row, write_register

NASA_MEDIA = "https://www.nasa.gov/nasa-brand-center/images-and-media/"
SPACERADAR_LICENSE = "https://github.com/Sara-Managed-Projects/space-radar/blob/main/LICENSE"
SPACERADAR_RAW = "https://raw.githubusercontent.com/Sara-Managed-Projects/space-radar/main/site/models/"
EARTHDATA = "https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance"
USGS = "https://www.usgs.gov/information-policies-and-instructions/acknowledging-or-crediting-usgs"
COPERNICUS = "https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice"
CELESTRAK = "https://celestrak.org/NORAD/elements/"
CELESTRAK_POLICY = "https://celestrak.org/usage-policy.php"   # « CelesTrak Usage Policy », T.S. Kelso, 15/05/2026, mise à jour 22/05/2026 (relue le 24/11/2026)
CC0 = "https://creativecommons.org/publicdomain/zero/1.0/"

PD = ("Domaine public (données et images de la NASA, non protégées par le droit d'auteur)", "Public domain (NASA data and images, not copyrighted)")

def rule(name, d):
    """-> (licence fr, licence en, url de la règle, crédit, statut). Statut : « ok », « à confirmer », « ok (site non commercial) ».
    La règle est choisie par le champ « src » écrit par la recette de téléchargement (tools/data/fetch_data.py)."""
    src = d.get("src")
    if src == "nasa-cc0":
        return ("CC0 1.0 (données des missions de la NASA, politique d'usage d'Earthdata) ; citer le jeu de données" + (" (DOI " + d["doi"] + ")" if d.get("doi") else ""),
                "CC0 1.0 (NASA mission data, Earthdata use policy); cite the dataset" + (" (DOI " + d["doi"] + ")" if d.get("doi") else ""), EARTHDATA, d.get("credit") or "NASA", "ok")
    if src == "usgs-pd":
        return ("Domaine public (USGS) ; crédit demandé", "Public domain (USGS); credit requested", USGS, d.get("credit") or "USGS", "ok")
    if src == "copernicus":
        return ("Données Copernicus Sentinel, libres et gratuites ; mention « Contains modified Copernicus Sentinel data " + str(d.get("datetime", ""))[:4] + " »",
                "Copernicus Sentinel data, free and open; notice “Contains modified Copernicus Sentinel data " + str(d.get("datetime", ""))[:4] + "”", COPERNICUS,
                "Contains modified Copernicus Sentinel data " + str(d.get("datetime", ""))[:4], "ok")
    if src == "commons":
        lic = d.get("license", "")
        if re.search(r"public domain|^PD", lic, re.I): return (PD[0] if "NASA" in (d.get("credit") or "NASA") else "Domaine public", PD[1], d.get("page"), d.get("credit"), "ok")
        if re.search(r"CC BY(-SA)? [34]\.0", lic, re.I):   # licence libre avec attribution (et partage à l'identique pour BY-SA) : le site la reprend telle quelle
            u = d.get("license_url") or d.get("page")
            return (lic + " ; attribution : " + (d.get("credit") or "") + " ; image réduite par ce site, publiée sous la même licence", lic + "; attribution: " + (d.get("credit") or "") + "; image scaled down by this site, shared under the same licence", u, d.get("credit"), "ok")
        return (lic, lic, d.get("page"), d.get("credit"), "à confirmer")
    if d.get("press"):
        return (PD[0] + " ; sans logo de la NASA", PD[1] + "; no NASA logo", NASA_MEDIA, d.get("credit") or "NASA", "ok")
    return ("inconnue", "unknown", None, None, "à confirmer")

def main():
    rows = []
    for f in sorted(glob.glob(os.path.join(DATA, "*.json"))):
        name = os.path.basename(f)[:-5]
        if name == "credits": continue
        d = json.load(open(f, encoding="utf-8"))
        if name.startswith("tex-"):
            lf, le, lu, cr, st = rule(name, d)
            rows.append(dict(kind="texture", file="data/" + name + ".jpg", title=d.get("title"), source=d.get("href"), page=d.get("page"),
                             license=lf, license_url=lu, credit=cr, fetched=d.get("fetched"), transform="réduite à %s × %s px, enregistrée en JPEG" % tuple(d.get("size", ["?", "?"])), status=st))
            d.update(license_fr=lf, license_en=le, license_url=lu, credit_line=cr, status=st)
        elif name == "tle":
            rows.append(dict(kind="orbites", file="data/tle.json", title=d.get("source"), source=d.get("page"), page=CELESTRAK,
                             license="Aucune licence écrite : la politique d'usage de CelesTrak (22/05/2026) parle de données « freely available to all users » et ne fixe que des limites d'accès (un téléchargement par mise à jour, toutes les 2 h au plus) ; ce site les respecte (un téléchargement par jour) et cite la source. Éléments dérivés du catalogue de la Space Force américaine",
                             license_url=CELESTRAK_POLICY, credit="CelesTrak (T.S. Kelso)", fetched=d.get("fetched"), transform="aucune : propagés par SGP4 dans le navigateur", status="à confirmer"))
            continue
        elif name == "cat":
            rows.append(dict(kind="orbites", file="data/cat.json", title="Relevé des catalogues (titres, niveaux, licences déclarées, nombres de produits)", source=None, page=None,
                             license="métadonnées publiques des catalogues, citées comme faits", license_url=None, credit="NASA CMR, USGS, Element 84, Copernicus",
                             fetched=d.get("fetched"), transform="extraits par tools/data/catalog.py", status="ok"))
            continue
        else:
            lf, le, lu, cr, st = rule(name, d)
            kind = "tracé" if d.get("plot") else ("image Commons" if d.get("src") == "commons" else ("image de presse" if d.get("press") else "aperçu d'archive"))
            rows.append(dict(kind=kind, file="data/" + name + ".jpg", title=(d.get("title") or d.get("product")), instrument=d.get("instrument"),
                             source=d.get("href"), page=d.get("page") or d.get("stac"), archive=d.get("archive"), license=lf, license_url=lu, credit=cr,
                             fetched=d.get("fetched"), transform=transform(d), status=st))
            d.update(license_fr=lf, license_en=le, license_url=lu, credit_line=cr, status=st)
        json.dump(d, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)

    src = open(os.path.join(ROOT, "src", "data-missions.js"), encoding="utf-8").read()
    for body in re.split(r"\n  \{\s*\n", src)[1:]:
        mm = re.search(r"model:\{ src:'((?:[^'\\]|\\.)*)', license:'((?:[^'\\]|\\.)*)', u:'([^']+)'", body)
        fm = re.search(r"file:'(models/[^']+)'", body)
        if not mm or not fm: continue
        s, lic, u = (x.replace("\\'", "'") for x in mm.groups())
        if "Space Radar" in s:   # maquettes Space Radar : faites par l'équipe en code, licence MIT du dépôt (page de chaque maquette et LICENSE relus le 25/11/2026)
            slug = u.rstrip("/").rsplit("/", 1)[-1]
            rows.append(dict(kind="maquette 3D", file=fm.group(1), title=s, source=SPACERADAR_RAW + slug + ".glb", page=u, license=lic, license_url=SPACERADAR_LICENSE,
                             credit=re.sub(r"^.*?« (.*) ».*$", r"\1", s) + " 3D model by Space Radar (spaceradar.ai), MIT License", fetched="2026-11-25",
                             transform="décompressée (meshopt), découpée en pièces d'après la place et la taille de chaque îlot (tools/models/sentinel_parts.js), géométrie quantifiée (voir tools/models/README.md)", status="ok"))
            continue
        st = "à confirmer" if "ESA" in s.split(",")[0] else "ok"
        rows.append(dict(kind="maquette 3D", file=fm.group(1), title=s, source=u, page=u, license=lic,
                         license_url=(u if st != "ok" else NASA_MEDIA), credit=("ESA" if st != "ok" else ("NASA/JPL-Caltech" if "Eyes" in s else "NASA")),
                         fetched=None, transform="convertie en glTF binaire, nœuds renommés par pièce, textures réduites à 1024 px (WebP), géométrie quantifiée (voir tools/models/README.md)", status=st))
    rows += [
        fonts_row(),
        dict(kind="schémas", file="src/optics.js, src/missionpage.js (SVG)", title="Trajets de la lumière, traces au sol, bandes spectrales", source=None, page=None,
             license="créés pour ce site", license_url=None, credit="Observateurs de la Terre", fetched=None, transform="schémas de principe dessinés à partir des références citées sous chaque schéma", status="ok")]
    # Code : celui du dépôt, celui repris d'Observatories, et les dépendances (versions relevées le 24/11/2026)
    rows += [
        own_code_row(ROOT, "Observateurs de la Terre", "Rolgim/EarthObservers"),
        socle_row(),
        dict(kind="code", file="build.js, src/, tools/", title="Architecture reprise de SolarExplorers (même auteur, Apache-2.0), elle-même issue d'Observatories v1.0",
             source="https://github.com/Rolgim/SolarExplorers", page=None, license="Apache-2.0 (code du même auteur)",
             license_url="https://github.com/Rolgim/SolarExplorers/blob/main/LICENSE", credit="Rolgim", fetched=None, transform="adapté aux satellites d'observation de la Terre", status="ok"),
        dep("satellite.js 5.0.0 (jsDelivr)", "propagation des orbites (SGP4) dans le navigateur", "MIT", "https://github.com/shashwatak/satellite-js/blob/develop/LICENSE.md", True),
        dep("three.js r128 (cdnjs)", "rendu 3D dans le navigateur", "MIT", "https://github.com/mrdoob/three.js/blob/r128/LICENSE", True),
        dep("GLTFLoader.js (three@0.128.0, jsDelivr)", "lecture des maquettes glTF", "MIT", "https://github.com/mrdoob/three.js/blob/r128/LICENSE", True),
        dep("@gltf-transform/core, cli, extensions, functions 4.5.1", "conversion et allègement des maquettes", "MIT", "https://github.com/donmccurdy/glTF-Transform/blob/main/LICENSE.md"),
        dep("meshoptimizer 1.2.0", "simplification des maquettes", "MIT", "https://github.com/zeux/meshoptimizer/blob/master/LICENSE.md"),
        dep("Playwright", "tests et captures (tools/smoke.js, tools/a11y.js)", "Apache-2.0", "https://github.com/microsoft/playwright/blob/main/LICENSE"),
        dep("axe-core", "audit d'accessibilité (tools/a11y.js)", "MPL-2.0", "https://github.com/dequelabs/axe-core/blob/develop/LICENSE"),
        dep("requests", "téléchargements (tools/data, tools/probe)", "Apache-2.0", "https://github.com/psf/requests/blob/main/LICENSE"),
        dep("Pillow", "traitement des images", "MIT-CMU (HPND)", "https://github.com/python-pillow/Pillow/blob/main/LICENSE"),
        dep("NumPy", "calculs sur les images", "BSD-3-Clause", "https://github.com/numpy/numpy/blob/main/LICENSE.txt")]
    write_register(ROOT, rows, "images, tracés de données, textures, éléments orbitaux, maquettes 3D, polices et bibliothèques",
        ["| Données des missions de la NASA (Earthdata : LP DAAC, NSIDC, PO.DAAC, GES DISC) | CC0 1.0, citer le jeu de données | " + EARTHDATA + " |",
           "| Landsat (USGS) | Domaine public, crédit demandé | " + USGS + " |",
           "| Copernicus Sentinel | Libres et gratuites, mention « Contains modified Copernicus Sentinel data [année] » | " + COPERNICUS + " |",
           "| Wikimedia Commons | Licence relue dans les métadonnées de Commons au téléchargement ; seul le domaine public est accepté pour le globe | https://commons.wikimedia.org/ |",
           "| Bibliothèque d'images de la NASA | Domaine public, sans logo de la NASA | " + NASA_MEDIA + " |",
           "| Maquettes NASA Eyes on the Earth et NASA 3D Resources | Usage libre (règles d'usage des médias de la NASA, qui couvrent les maquettes 3D) | " + NASA_MEDIA + " |",
           "| Maquettes Space Radar (models.spaceradar.ai) | MIT (licence du dépôt Space Radar), avec la ligne de crédit donnée sur la page de chaque maquette | " + SPACERADAR_LICENSE + " |",
           "| Éléments orbitaux CelesTrak | à confirmer : diffusés librement (« freely available to all users »), sans licence écrite ; politique d'usage respectée (un téléchargement par jour) | " + CELESTRAK_POLICY + " |"],
        ("aperçu d'archive", "tracé", "image de presse", "image Commons", "texture", "orbites", "maquette 3D", "police", "bibliothèque", "schémas", "code"))

if __name__ == "__main__": main()
