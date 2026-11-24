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
out = {"source": "CelesTrak, éléments GP au format TLE (gp.php?CATNR=…&FORMAT=TLE ; au-delà du n° 99999, FORMAT=JSON remis en TLE avec un numéro Alpha-5)", "page": "https://celestrak.org/NORAD/elements/",
       "fetched": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%MZ"), "sats": {}}
A5 = "ABCDEFGHJKLMNPQRSTUVWXYZ"   # numéros NORAD au-delà de 99999 : format « Alpha-5 » dans les TLE (I et O exclus)
def a5(n): return "%05d" % n if n < 100000 else A5[n // 10000 - 10] + "%04d" % (n % 10000)
def ck(l): return str(sum(int(c) if c.isdigit() else (1 if c == "-" else 0) for c in l) % 10)
def ex(x):   # mantisse et exposant implicites du TLE : 4.4681e-5 -> " 44681-4"
    if x == 0: return " 00000+0"
    m, e = ("%.4e" % abs(x)).split("e"); return ("-" if x < 0 else " ") + m.replace(".", "") + "%+d" % (int(e) + 1)
def omm2tle(o, n):
    """CelesTrak ne sert pas de TLE au-delà du n° 99999 : on recompose les deux lignes à partir des éléments GP (OMM, JSON), sans rien recalculer."""
    t = datetime.datetime.fromisoformat(o["EPOCH"]); j = t.timetuple().tm_yday + (t - t.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds() / 86400
    nd = ("%.8f" % o["MEAN_MOTION_DOT"]).replace("0.", ".", 1); nd = (nd if nd.startswith("-") else " " + nd)
    i = o["OBJECT_ID"]; intl = (i[2:4] + i[5:]).ljust(8)
    l1 = "1 %sU %s %02d%012.8f %s %s %s 0 %4d" % (a5(n), intl, t.year % 100, j, nd, ex(o["MEAN_MOTION_DDOT"]), ex(o["BSTAR"]), o["ELEMENT_SET_NO"] % 10000)
    l2 = "2 %s %8.4f %8.4f %s %8.4f %8.4f %11.8f%5d" % (a5(n), o["INCLINATION"], o["RA_OF_ASC_NODE"], ("%.7f" % o["ECCENTRICITY"])[2:], o["ARG_OF_PERICENTER"], o["MEAN_ANOMALY"], o["MEAN_MOTION"], o["REV_AT_EPOCH"] % 100000)
    return [o["OBJECT_NAME"], l1 + ck(l1), l2 + ck(l2)]
old = {}
try: old = json.load(open(os.path.join(ROOT, "data", "tle.json"), encoding="utf-8")).get("sats", {})
except Exception: pass
for n in ids:
    try:
        if n < 100000:
            r = S.get("https://celestrak.org/NORAD/elements/gp.php", params={"CATNR": n, "FORMAT": "TLE"}, timeout=60)
            L = [x.rstrip() for x in r.text.strip().splitlines()]
        else:
            r = S.get("https://celestrak.org/NORAD/elements/gp.php", params={"CATNR": n, "FORMAT": "JSON"}, timeout=60)
            L = omm2tle(r.json()[0], n) if r.ok and r.text.strip().startswith("[{") else []
        if not r.ok or len(L) < 3 or not L[1].startswith("1 ") or not L[2].startswith("2 "): raise ValueError(r.status_code, r.text[:80])
        yy, doy = int(L[1][18:20]), float(L[1][20:32])
        ep = datetime.datetime(2000 + yy if yy < 57 else 1900 + yy, 1, 1, tzinfo=datetime.timezone.utc) + datetime.timedelta(days=doy - 1)
        out["sats"][str(n)] = {"name": L[0].strip(), "l1": L[1], "l2": L[2], "epoch": ep.strftime("%Y-%m-%dT%H:%MZ")}
        print(n, L[0].strip(), ep.date())
    except Exception as e:
        print("ÉCHEC", n, repr(e)[:160])
        if str(n) in old: out["sats"][str(n)] = old[str(n)]; print("  éléments précédents gardés")
json.dump(out, open(os.path.join(ROOT, "data", "tle.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
