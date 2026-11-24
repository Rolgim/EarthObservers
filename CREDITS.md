# Crédits et licences

Registre de tout ce que le site affiche et qui ne vient pas de lui : images, tracés de données, textures, éléments orbitaux, maquettes 3D, polices et bibliothèques.
Il est **généré** par `tools/data/credits.py` à partir des métadonnées écrites au téléchargement (`data/*.json`) et de `src/data-missions.js` : ne pas le modifier à la main.
La licence de chaque image est aussi affichée sous l'image, sur le site.

Généré le 2026-11-24. Statuts : **ok** (licence vérifiée sur la page citée), **à confirmer** (aucune licence écrite trouvée : voir la colonne licence), **ok (site non commercial)** (licence limitée à l'usage non commercial, ce qui est le cas de ce site).

## Règles appliquées, par source

| Source | Licence retenue | Page qui l'énonce |
|---|---|---|
| Données des missions de la NASA (Earthdata : LP DAAC, NSIDC, PO.DAAC, GES DISC) | CC0 1.0, citer le jeu de données | https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance |
| Landsat (USGS) | Domaine public, crédit demandé | https://www.usgs.gov/information-policies-and-instructions/acknowledging-or-crediting-usgs |
| Copernicus Sentinel | Libres et gratuites, mention « Contains modified Copernicus Sentinel data [année] » | https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice |
| Wikimedia Commons | Licence relue dans les métadonnées de Commons au téléchargement ; seul le domaine public est accepté pour le globe | https://commons.wikimedia.org/ |
| Bibliothèque d'images de la NASA | Domaine public, sans logo de la NASA | https://www.nasa.gov/nasa-brand-center/images-and-media/ |
| Maquettes NASA Eyes on the Earth et NASA 3D Resources | Usage libre (règles d'usage des médias de la NASA, qui couvrent les maquettes 3D) | https://www.nasa.gov/nasa-brand-center/images-and-media/ |
| Éléments orbitaux CelesTrak | à confirmer : diffusés librement, sans licence écrite | https://celestrak.org/NORAD/elements/ |

## Maquette 3D (1)

| Fichier | Titre / produit | Crédit | Licence | Statut | Source | Téléchargé le | Transformations |
|---|---|---|---|---|---|---|---|
| `models/landsat9.glb` | NASA Eyes on the Earth, « Landsat 9 » | NASA/JPL-Caltech | [NASA/JPL-Caltech, usage libre (règles d'usage des médias de la NASA, qui couvrent les maquettes 3D)](https://www.nasa.gov/nasa-brand-center/images-and-media/) | ok | [fichier](https://eyes.nasa.gov/apps/earth/) | — | convertie en glTF binaire, redécoupée en pièces, géométrie quantifiée (voir tools/models/README.md) |

## Police (1)

| Fichier | Titre / produit | Crédit | Licence | Statut | Source | Téléchargé le | Transformations |
|---|---|---|---|---|---|---|---|
| `Google Fonts` | Archivo ; IBM Plex Mono | Omnibus-Type (Archivo) ; IBM (Plex) | [SIL Open Font License 1.1](https://openfontlicense.org/) | ok | [fichier](https://fonts.google.com/) | — | aucune (chargées depuis Google Fonts) |

## Schémas (1)

| Fichier | Titre / produit | Crédit | Licence | Statut | Source | Téléchargé le | Transformations |
|---|---|---|---|---|---|---|---|
| `src/optics.js, src/missionpage.js (SVG)` | Trajets de la lumière, traces au sol, bandes spectrales | Observateurs de la Terre | créés pour ce site | ok | fichier | — | schémas de principe dessinés à partir des références citées sous chaque schéma |

## Code (12)

| Fichier | Titre / produit | Crédit | Licence | Statut | Source | Téléchargé le | Transformations |
|---|---|---|---|---|---|---|---|
| `src/, build.js, tools/` | Code du site (Observateurs de la Terre) | Rolgim | [Apache-2.0 (code seulement : les médias gardent leur licence, voir NOTICE)](https://github.com/Rolgim/EarthObservers/blob/main/LICENSE) | ok | [fichier](https://github.com/Rolgim/EarthObservers) | — | — |
| `build.js, src/, tools/` | Architecture reprise de SolarExplorers (même auteur, Apache-2.0), elle-même issue d'Observatories v1.0 | Rolgim | [Apache-2.0 (code du même auteur)](https://github.com/Rolgim/SolarExplorers/blob/main/LICENSE) | ok | [fichier](https://github.com/Rolgim/SolarExplorers) | — | adapté aux satellites d'observation de la Terre |
| `satellite.js 5.0.0 (jsDelivr)` | propagation des orbites (SGP4) dans le navigateur | — | [MIT](https://github.com/shashwatak/satellite-js/blob/develop/LICENSE.md) | ok | [fichier](https://github.com/shashwatak/satellite-js/blob/develop/LICENSE.md) | — | servi aux visiteurs tel quel |
| `three.js r128 (cdnjs)` | rendu 3D dans le navigateur | — | [MIT](https://github.com/mrdoob/three.js/blob/r128/LICENSE) | ok | [fichier](https://github.com/mrdoob/three.js/blob/r128/LICENSE) | — | servi aux visiteurs tel quel |
| `GLTFLoader.js (three@0.128.0, jsDelivr)` | lecture des maquettes glTF | — | [MIT](https://github.com/mrdoob/three.js/blob/r128/LICENSE) | ok | [fichier](https://github.com/mrdoob/three.js/blob/r128/LICENSE) | — | servi aux visiteurs tel quel |
| `@gltf-transform/core, cli, extensions, functions 4.5.1` | conversion et allègement des maquettes | — | [MIT](https://github.com/donmccurdy/glTF-Transform/blob/main/LICENSE.md) | ok | [fichier](https://github.com/donmccurdy/glTF-Transform/blob/main/LICENSE.md) | — | outil de préparation ou de test, pas distribué avec le site |
| `meshoptimizer 1.2.0` | simplification des maquettes | — | [MIT](https://github.com/zeux/meshoptimizer/blob/master/LICENSE.md) | ok | [fichier](https://github.com/zeux/meshoptimizer/blob/master/LICENSE.md) | — | outil de préparation ou de test, pas distribué avec le site |
| `Playwright` | tests et captures (tools/smoke.js, tools/a11y.js) | — | [Apache-2.0](https://github.com/microsoft/playwright/blob/main/LICENSE) | ok | [fichier](https://github.com/microsoft/playwright/blob/main/LICENSE) | — | outil de préparation ou de test, pas distribué avec le site |
| `axe-core` | audit d'accessibilité (tools/a11y.js) | — | [MPL-2.0](https://github.com/dequelabs/axe-core/blob/develop/LICENSE) | ok | [fichier](https://github.com/dequelabs/axe-core/blob/develop/LICENSE) | — | outil de préparation ou de test, pas distribué avec le site |
| `requests` | téléchargements (tools/data, tools/probe) | — | [Apache-2.0](https://github.com/psf/requests/blob/main/LICENSE) | ok | [fichier](https://github.com/psf/requests/blob/main/LICENSE) | — | outil de préparation ou de test, pas distribué avec le site |
| `Pillow` | traitement des images | — | [MIT-CMU (HPND)](https://github.com/python-pillow/Pillow/blob/main/LICENSE) | ok | [fichier](https://github.com/python-pillow/Pillow/blob/main/LICENSE) | — | outil de préparation ou de test, pas distribué avec le site |
| `NumPy` | calculs sur les images | — | [BSD-3-Clause](https://github.com/numpy/numpy/blob/main/LICENSE.txt) | ok | [fichier](https://github.com/numpy/numpy/blob/main/LICENSE.txt) | — | outil de préparation ou de test, pas distribué avec le site |
