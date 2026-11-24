# Observateurs de la Terre

*Earth Observers: an interactive guide to Earth observation satellites, at their real position, with 3D models, sourced fact sheets, instruments, orbits and real archive data, in English (default) and French.*

Troisième site de la série, après [Observatoires en orbite](https://github.com/Rolgim/Observatories) et [Explorateurs du Système solaire](https://github.com/Rolgim/SolarExplorers), dont ce dépôt reprend l'architecture. Chaque satellite a sa maquette 3D (ou un point bleu s'il n'en existe pas de libre), sa fiche sourcée, ses instruments, son orbite réelle et de vraies données tirées des archives publiques (NASA Earthdata, USGS, Copernicus). L'accueil montre la Terre et tous les satellites à leur position du moment, calculée dans le navigateur par le modèle SGP4 à partir des éléments orbitaux de CelesTrak.

Règles, périmètre et étapes : [SPECS.md](SPECS.md).

Pour le lancer en local : `node build.js`, puis `python3 -m http.server` et ouvrir http://localhost:8000.

## Organisation du dépôt

| Chemin | Rôle |
|---|---|
| `index.html`, `models/*.glb` | le site tel qu'il est servi par GitHub Pages |
| `build.js` | `node build.js` assemble `src/` en `index.html` ; `node build.js artifact` produit une variante dans `dist/` (maquettes en base64) pour l'artifact claude.ai |
| `src/data-missions.js` | **registre des satellites** (`MISSIONS`) : fiche, thèmes, numéros NORAD, maquette ; schéma en tête du fichier |
| `src/data-inst.js`, `src/data-mission.js`, `src/data-fleet.js` | instruments ; déroulé des missions et niveaux de traitement ; « qui a fait quoi » |
| `src/earth.js` | accueil : globe et satellites en temps réel (three.js et satellite.js) |
| `src/app.js`, `src/viewer.js`, `src/missionpage.js`, `src/views.js`, `src/optics.js` | en-tête, routage, vue 3D, page « Mission et instruments », Flotte et Comparer, trajets de la lumière |
| `src/en/`, `src/i18n.js`, `src/lang.js` | version anglaise |
| `data/` | données réelles produites par `tools/data/` (ne pas modifier à la main) : aperçus et leurs fiches, `tle.json` (éléments orbitaux du jour), `cat.json` (relevé des catalogues), `credits.json` |
| `tools/data/` | `fetch_data.py` (aperçus), `fetch_tle.py` (éléments orbitaux), `catalog.py` (relevé des catalogues), `credits.py` (registre des licences) |
| `tools/probe/` | sondes lancées depuis GitHub Actions ; résultats sur la branche `probe-out` |
| `tools/models/` | conversion et allègement des maquettes (voir son `README.md`) |
| `tools/pages.js`, `tools/smoke.js`, `tools/a11y.js`, `tools/i18n-scan.js` | tests dans un vrai navigateur sur toutes les pages listées par `tools/pages.js` |

Après une modification dans `src/`, relancer `node build.js` et commiter `index.html` avec les sources : le workflow « Tests » vérifie que les deux correspondent.

## Intégration continue

| Workflow | Quand | Rôle |
|---|---|---|
| Données réelles | chaque jour (éléments orbitaux seuls), à la demande et à chaque changement de `tools/data/` (tout) | télécharge, met à jour le registre des crédits, reconstruit `index.html` et commite |
| Site (GitHub Pages) | après chaque mise à jour du site ou des données | publie le site |
| Tests | à chaque push touchant le site | `index.html` à jour, parcours, accessibilité, traduction |
| Sonde | à la demande | lance un script de `tools/probe/` |

## Crédits et licences

Le code est sous licence [Apache 2.0](LICENSE) (voir [NOTICE](NOTICE)). Cette licence ne couvre pas les médias. Tout ce que le site montre sans l'avoir créé est listé dans [CREDITS.md](CREDITS.md), avec sa source, sa licence, son crédit, sa date et les transformations faites ; la licence de chaque image est aussi affichée sous l'image.
