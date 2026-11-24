#!/usr/bin/env python3
"""Cherche des collections dans le catalogue CMR de la NASA, par nom court exact ou motif (« * »), sans compte.
Usage : python tools/probe/probe_cmr.py PACE_OCI_L2_BGC* SPL3SMP* OCO2_L2_Lite_FP* …  Écrit tools/probe/_out/cmr.txt
(nom court, version, fournisseur, niveau, titre, nombre de produits, licence déclarée)."""
import os, sys, requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
o = []
for a in sys.argv[1:]:
    p = {"short_name": a, "page_size": 12, "sort_key": "-revision_date"}
    if "*" in a: p["options[short_name][pattern]"] = "true"
    try:
        r = S.get("https://cmr.earthdata.nasa.gov/search/collections.umm_json", params=p, timeout=90); r.raise_for_status()
    except Exception as e:
        o.append("## %s erreur %s" % (a, e)); continue
    o.append("## %s (%s)" % (a, r.headers.get("CMR-Hits")))
    for it in r.json().get("items", []):
        u = it["umm"]; m = it["meta"]
        h = S.get("https://cmr.earthdata.nasa.gov/search/granules.json", params={"concept_id": m["concept-id"], "page_size": 0}, timeout=90)
        lic = (u.get("UseConstraints") or {}); lic = (lic.get("LicenseURL") or {}).get("Linkage") or lic.get("Description") or ""
        o.append("- %s %s | %s | niv. %s | %s | %s produits | %s" % (u.get("ShortName"), u.get("Version"), m.get("provider-id"), (u.get("ProcessingLevel") or {}).get("Id"),
                 u.get("EntryTitle", "")[:110], h.headers.get("CMR-Hits"), str(lic)[:120]))
open(os.path.join(OUT, "cmr.txt"), "w").write("\n".join(o)); print("\n".join(o)[:6000])
