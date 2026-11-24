#!/usr/bin/env python3
"""Relève des faits chiffrés sur les pages officielles (pour sourcer les fiches) : texte de chaque page, phrases qui contiennent
un nombre et un mot-clé, tableaux HTML. Liste des pages : tools/probe/facts.json ({clé: [url, …]}). Sortie : tools/probe/_out/facts/<clé>.md."""
import os, re, sys, json, html, requests
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "_out", "facts"); os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers["User-Agent"] = "Mozilla/5.0 (X11; Linux x86_64) earthobservers-probe/1.0 (+https://github.com/Rolgim/EarthObservers)"
KW = r"launch|mass|kg|km|altitude|orbit|inclin|repeat|revisit|equator|crossing|local time|swath|resolution|band|µm|nm|GHz|MHz|lifetime|design life|power|W\b|watts|meters|metres|aperture|telescope|detector|pixel|bits|dimension|length|width|height|solar array|data rate|Mbps|Gb"
ONLY = sys.argv[1:]   # facultatif : clés à relever (sinon toutes)
for key, urls in json.load(open(os.path.join(HERE, "facts.json"))).items():
    if ONLY and key not in ONLY: continue
    rep = []
    for u in urls:
        try: r = S.get(u, timeout=90)
        except Exception as e: rep.append("## " + u + " ÉCHEC " + repr(e)[:120]); continue
        rep.append("## " + u + " -> " + str(r.status_code) + " " + r.url)
        if not r.ok: continue
        t = r.text
        tabs = re.findall(r"(?s)<table.*?</table>", t)
        for tb in tabs[:8]:
            rows = []
            for tr in re.findall(r"(?s)<tr.*?</tr>", tb):
                cells = [html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", c))).strip() for c in re.findall(r"(?s)<t[hd][^>]*>(.*?)</t[hd]>", tr)]
                if any(cells): rows.append(" | ".join(cells))
            rep.append("### tableau\n" + "\n".join(rows[:60]))
        txt = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"(?s)<(script|style|nav|footer|header)[^>]*>.*?</\1>", " ", t))))
        seen = set()
        for m in re.finditer(r"[^.!?]{0,260}\d[^.!?]{0,260}[.!?]", txt):
            s = m.group(0).strip()
            if re.search(KW, s, re.I) and s not in seen and len(s) > 25: seen.add(s); rep.append("- " + s[:520])
        rep.append("### texte\n" + txt[:40000])
    open(os.path.join(OUT, key + ".md"), "w").write("\n".join(rep) + "\n"); print(key, len(rep))
