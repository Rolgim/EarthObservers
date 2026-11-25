# Observateurs de la Terre : spécifications

Version de travail du cahier des charges (document partagé : « EarthObservers : cahier des charges »). Ce fichier en garde les règles et l'avancement dans le dépôt.

## Règles (reprises de SolarExplorers)

1. Tout est sourcé : chaque chiffre renvoie à une page citée.
2. Les approximations sont signalées par « ≈ » ou « schéma de principe ».
3. Uniquement des données réelles, avec leur produit et leur date.
4. Bilingue français et anglais, sans texte oublié (`tools/i18n-scan.js`).
5. Accessible : WCAG 2.1 A et AA (`tools/a11y.js`). Aucune agence mise en avant.
6. La licence est affichée à côté de chaque objet ; registre unique `CREDITS.md`, rempli dès le premier fichier.
7. Avant chaque livraison : tests, captures, commit, push et publication.
8. Site non commercial ; code sous licence Apache 2.0.

## Étapes

1. Sonde des sources (fait le 24/11/2026) : `tools/probe/probe_sources.py`, `probe_sources2.py`, `fetch_eyes_models.py`, `probe_facts.py`.
   - Éléments orbitaux CelesTrak pour tous les satellites ; satellite.js (MIT) sur jsDelivr.
   - Maquettes NASA Eyes on the Earth : Landsat 9, Terra, Aqua, ICESat-2, GRACE-FO, SWOT (règles d'usage des médias de la NASA, qui couvrent les maquettes 3D). Sentinel-1, 2 et 3 : maquettes Space Radar (models.spaceradar.ai, licence MIT), reconstituées par Space Radar à partir des dimensions publiées.
   - Aperçus publics sans compte : MODIS (Terra, Aqua), ASTER, HLS, ICESat-2 (NASA, CC0) ; Sentinel-2 sur Earth Search (Copernicus).
   - Compte Earthdata nécessaire pour SWOT, les grilles GRACE-FO et Sentinel-5P : refusé, on prend des images déjà publiées (Commons, GIBS).
   - Globe : Blue Marble de la NASA via Wikimedia Commons (domaine public), le serveur de la NASA refusant GitHub Actions.
2. Squelette repris de SolarExplorers, accueil « La Terre vue d'en haut » avec SGP4 (fait).
3. Landsat 9 complet : vue 3D, mission, instruments, orbite réelle, donnée réelle, registre (fait).
4. Les neuf autres satellites : Sentinel-1, -2, -3, -5P, Terra, Aqua, ICESat-2, GRACE-FO, SWOT (fait le 24/11/2026 ; images publiées pour SWOT, GRACE-FO et Sentinel-5P, sans compte, décision du 24/11/2026).
5. Pages Flotte et Comparer (fait).
6. Galerie « le même lieu vu par plusieurs satellites » : Comparer › Le même lieu (fait le 24/11/2026 ; Mont-Blanc et est du Léman, Sentinel-1, Sentinel-2, Landsat 9, Terra, Aqua, avec un gros plan à la taille réelle des pixels).
7. Audit complet (traductions, accessibilité, liens, licences) et version 1.0 (fait le 24/11/2026 : `tools/i18n-scan.js` et `tools/a11y.js` sans erreur en français et en anglais, thèmes clair et sombre ; liens vérifiés par `tools/probe/probe_links.py` ; seul statut « à confirmer » du registre : les éléments CelesTrak, publiés sans licence écrite).

Couleur de surlignage : vert #127A46 (décision du 24/11/2026).
