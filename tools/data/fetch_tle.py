#!/usr/bin/env python3
"""Éléments orbitaux (TLE) des satellites du registre, chez CelesTrak, une fois par jour (le site les propage avec SGP4
dans le navigateur, satellite.js). Lit les numéros NORAD dans src/data-missions.js (champ norad:[…]) et écrit data/tle.json.
CelesTrak demande de ne pas retélécharger les mêmes éléments plus d'une fois toutes les deux heures : un passage par jour."""
import os, re, json, datetime, requests
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
S = requests.Session(); S.headers["User-Agent"] = "earthobservers-data/1.0 (+https://github.com/Rolgim/EarthObservers)"
src = open(os.path.join(ROOT, "src", "data-missions.js"), encoding="utf-8").read()
ids = []
for m in re.finditer(r"norad:\[([\d,\s]+)\]", src): ids += [int(x) for x in re.findall(r"\d+", m.group(1))]
out = {"source": "CelesTrak, éléments GP au format TLE (gp.php?CATNR=…&FORMAT=TLE)", "page": "https://celestrak.org/NORAD/elements/",
       "fetched": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%MZ"), "sats": {}}
old = {}
try: old = json.load(open(os.path.join(ROOT, "data", "tle.json"), encoding="utf-8")).get("sats", {})
except Exception: pass
for n in ids:
    try:
        r = S.get("https://celestrak.org/NORAD/elements/gp.php", params={"CATNR": n, "FORMAT": "TLE"}, timeout=60)
        L = [x.rstrip() for x in r.text.strip().splitlines()]
        if not r.ok or len(L) < 3 or not L[1].startswith("1 ") or not L[2].startswith("2 "): raise ValueError(r.status_code, r.text[:80])
        yy, doy = int(L[1][18:20]), float(L[1][20:32])
        ep = datetime.datetime(2000 + yy if yy < 57 else 1900 + yy, 1, 1, tzinfo=datetime.timezone.utc) + datetime.timedelta(days=doy - 1)
        out["sats"][str(n)] = {"name": L[0].strip(), "l1": L[1], "l2": L[2], "epoch": ep.strftime("%Y-%m-%dT%H:%MZ")}
        print(n, L[0].strip(), ep.date())
    except Exception as e:
        print("ÉCHEC", n, repr(e)[:160])
        if str(n) in old: out["sats"][str(n)] = old[str(n)]; print("  éléments précédents gardés")
json.dump(out, open(os.path.join(ROOT, "data", "tle.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
