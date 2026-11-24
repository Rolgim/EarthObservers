#!/usr/bin/env python3
"""Planetary Computer : derniers produits d'une collection (dates, actifs). Usage : probe_pc.py <collection> [lonmin,latmin,lonmax,latmax]
Écrit tools/probe/_out/pc.txt."""
import os, sys, json, requests
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out"); os.makedirs(OUT, exist_ok=True)
PC = "https://planetarycomputer.microsoft.com/api/stac/v1"
o = []
for col in sys.argv[1].split(","):
    c = requests.get(PC + "/collections/" + col, timeout=60); o.append("## %s %s %s" % (col, c.status_code, json.dumps((c.json().get("extent") or {}).get("temporal")) if c.ok else c.text[:200]))
    body = {"collections": [col], "limit": 3, "sortby": [{"field": "datetime", "direction": "desc"}]}
    if len(sys.argv) > 2: body["bbox"] = [float(x) for x in sys.argv[2].split(",")]
    r = requests.post(PC + "/search", json=body, timeout=120); o.append("search %s" % r.status_code)
    for f in (r.json().get("features", []) if r.ok else []): o.append("  %s %s %s" % (f["id"], f["properties"].get("datetime"), sorted(f["assets"])))
    if not r.ok: o.append(r.text[:500])
open(os.path.join(OUT, "pc.txt"), "w").write("\n".join(o)); print("\n".join(o))
