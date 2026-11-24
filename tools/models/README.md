# Chaîne de préparation des maquettes

Reprise de SolarExplorers. Les fichiers `models/<id>.glb` du site sont produits ici à partir des maquettes d'origine, qui ne sont pas dans le dépôt : NASA Eyes on the Earth (`tools/probe/fetch_eyes_models.py` les télécharge depuis la CI, sur la branche `probe-out`).

| Maquette | Source | Traitement |
|---|---|---|
| `landsat9.glb` | NASA Eyes on the Earth « Landsat 9 » (`sc_landsat_9/Landsat9.gltf`, NASA/JPL-Caltech) | `gltf-transform copy` → `rename.mjs` + `maps/landsat9.json` (nœuds déjà séparés par pièce) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `terra.glb` | NASA Eyes on the Earth « Terra » (NASA/JPL-Caltech) | `gltf-transform copy` → `rename.mjs` + `maps/terra.json` → `resize` 1024 → `weld` → `quantize` → `webp` |
| `aqua.glb` | NASA Eyes on the Earth « Aqua » (NASA/JPL-Caltech) | `gltf-transform copy` → `rename.mjs` + `maps/aqua.json` → `resize` 1024 → `weld` → `quantize` → `webp` |
| `icesat2.glb` | NASA Eyes on the Earth « ICESat-2 » (NASA/JPL-Caltech) | `gltf-transform copy` → `rename.mjs` + `maps/icesat2.json` → `resize` 1024 → `weld` → `quantize` → `webp` |
| `gracefo.glb` | NASA Eyes on the Earth « GRACE-FO » (NASA/JPL-Caltech) | `gltf-transform copy` → `rename.mjs` + `maps/gracefo.json` → `resize` 1024 → `weld` → `quantize` → `webp` |
| `swot.glb` | NASA Eyes on the Earth « SWOT » (NASA/JPL-Caltech) | `gltf-transform copy` → `rename.mjs` + `maps/swot.json` → `resize` 1024 → `weld` → `quantize` → `webp` ; pièces attribuées par boîte englobante (`bbox.mjs`) |
| `pace.glb` | NASA Eyes on the Earth « PACE » (NASA/JPL-Caltech) | `rename.mjs` + `maps/pace.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `noaa20.glb` | NASA Eyes on the Earth « NOAA-20 » (utilisée pour la fiche JPSS) (NASA/JPL-Caltech) | `rename.mjs` + `maps/noaa20.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `smap.glb` | NASA Eyes on the Earth « SMAP » (NASA/JPL-Caltech) | `rename.mjs` + `maps/smap.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `oco2.glb` | NASA Eyes on the Earth « OCO-2 » (NASA/JPL-Caltech) | `rename.mjs` + `maps/oco2.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `gpm.glb` | NASA Eyes on the Earth « GPM » (NASA/JPL-Caltech) | `rename.mjs` + `maps/gpm.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `nisar.glb` | NASA Eyes on the Earth « NISAR » (NASA/JPL-Caltech) | `rename.mjs` + `maps/nisar.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `aura.glb` | NASA Eyes on the Earth « Aura » (NASA/JPL-Caltech) | `rename.mjs` + `maps/aura.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `tempo.glb` | NASA Eyes on the Earth « TEMPO » (NASA/JPL-Caltech) | `rename.mjs` + `maps/tempo.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |
| `sentinel6.glb` | NASA Eyes on the Earth « Sentinel-6 Michael Freilich » (NASA/JPL-Caltech) | `rename.mjs` + `maps/sentinel6.json` (clé `*` pour les nœuds non listés) → `resize` 1024 → `weld` → `quantize` → `webp` |

Les Sentinel n'ont pas de maquette libre de droits : le site les montre comme un point bleu (`file: null`).

Les maquettes d'Eyes on the Earth sont déjà découpées en nœuds nommés (instruments, panneaux, plateforme) : `rename.mjs` renomme chaque nœud d'après la table `maps/<id>.json` en `<pièce>_<n>`, sans passer par `seg_lib.js`.

## Redécoupage en pièces

Les fichiers d'origine sont découpés par texture ou d'un seul bloc, pas par pièce physique. `seg_lib.js` :

1. soude les sommets par position et calcule les îlots connexes de chaque primitive ;
2. appelle un classifieur `classify(îlot, nomDuNœud, nomDuMatériau)` qui renvoie le nom de la pièce (centre, boîte englobante et matériau de l'îlot à l'appui) ;
3. écrit un nœud par pièce et par matériau, nommé d'après la pièce.

Le site retrouve ensuite les pièces par le nom des nœuds (`key` ou `nodes` dans `src/data-missions.js`).

Outils de mise au point : `dump.js` (liste des îlots en JSON), `render.py` (rendu logiciel six vues, coloré par classe), `cls_view.js`, `view.js` (six vues dans Chromium, texturées ou colorées par pièce : `node view.js in.glb out.png cls`). Un classifieur qui renvoie `null` écarte l'îlot.

## Points d'attention

- Le site décode les maquettes sans Draco (pas de décodeur chargé) : seule l'extension `KHR_mesh_quantization` est utilisée.
- three.js r128 ne dénormalise pas les attributs entiers côté CPU ; `src/app.js` convertit donc les positions en flottants au chargement pour que le clic sur une pièce tombe juste.

## Ajouter un satellite

1. Maquette : convertir et redécouper (ci-dessus), déposer `models/<id>.glb`. Licence écrite à côté de l'objet (règle 8).
2. `src/data-missions.js` : une entrée dans `MISSIONS` (schéma en tête du fichier), avec ses numéros NORAD ; `build.js`, `tools/pages.js` et `tools/data/fetch_tle.py` lisent ce registre.
3. Textes et données : `INST_DATA` (`src/data-inst.js`), `MISSION` (`src/data-mission.js`), `FLEET` (`src/data-fleet.js`) ; collections dans `tools/data/catalog.py`, recette d'aperçu dans `tools/data/fetch_data.py`.
4. Anglais : `EN_MISSIONS` (`src/en/missions.js`) et les chaînes d'interface dans `src/en/ui.js`.
5. `node build.js`, puis `node tools/smoke.js` : le test signale les champs manquants du registre.
