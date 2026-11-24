/* =================================================================
   MISSION ET TRAITEMENTS — sous-page « Mission et traitements » de chaque satellite (schéma de SolarExplorers, src/data-mission.js).
   MISSION[id] = { intro, phases:[[date, titre, texte, sources]], ops:[[libellé, valeur, sources]], refs, checked }
   Textes bilingues par L(fr, en) (data-inst.js). Les clés de source renvoient à MISSION[id].refs, puis à INST_DATA[id].refs,
   puis aux refs de la fiche (data-missions.js). La chaîne de traitement est tirée du relevé des catalogues (data/cat.json,
   tools/data/catalog.py) : le niveau de chaque collection est celui que déclare l'archive, ou celui de son nom (L1, L2…).
================================================================= */
var MISSION_LEVELS = [
  /* niveaux de traitement des données de la NASA (ref levels) : [clé, nom, ce que c'est] */
  ['0', L('Niveau 0 : brut', 'Level 0: raw'), L('Les données de l\'instrument telles qu\'elles arrivent au sol, remises en ordre, sans les en-têtes de transmission.', 'Instrument data as received on the ground, put back in order, without the transmission headers.')],
  ['1', L('Niveau 1 : étalonné et localisé', 'Level 1: calibrated and located'), L('Valeurs converties en grandeurs physiques (luminance, réflectance au sommet de l\'atmosphère) et chaque pixel placé sur la Terre.', 'Values converted into physical quantities (radiance, top-of-atmosphere reflectance) and each pixel located on Earth.')],
  ['2', L('Niveau 2 : grandeurs géophysiques', 'Level 2: geophysical variables'), L('Grandeurs de la surface ou de l\'atmosphère, au même endroit que les mesures : réflectance du sol (atmosphère corrigée), température de surface, hauteur de la mer…', 'Surface or atmospheric variables, at the same place as the measurements: ground reflectance (atmosphere corrected), surface temperature, sea height…')],
  ['3', L('Niveau 3 : sur une grille', 'Level 3: gridded'), L('Grandeurs rééchantillonnées sur une grille régulière d\'espace et de temps, prêtes à être comparées ou assemblées.', 'Variables resampled onto a regular grid in space and time, ready to be compared or assembled.')],
  ['4', L('Niveau 4 : modèles', 'Level 4: models'), L('Résultats de modèles ou d\'analyses combinant plusieurs mesures.', 'Results of models or analyses combining several measurements.')]
];
var MISSION_REFS = {
  levels:{ t:'Data Processing Levels', p:'NASA Earthdata', u:'https://www.earthdata.nasa.gov/learn/earth-observation-data-basics/data-processing-levels' },
  cat:{ t:'Relevé des catalogues STAC et CMR par ce site (tools/data/catalog.py)', p:'NASA, USGS, Element 84, Copernicus', u:'https://github.com/Rolgim/EarthObservers/blob/main/tools/data/catalog.py' }
};
var MISSION = {
landsat9:{
  intro:L('Landsat 9 a été lancé en septembre 2021 sur l\'orbite de Landsat 7, qu\'il remplace. Avec Landsat 8, à l\'opposé sur la même orbite, il revoit chaque lieu tous les huit jours. La NASA a construit et lancé le satellite ; l\'USGS l\'exploite et archive ses images au centre EROS (Dakota du Sud), qui les distribue gratuitement.',
          'Landsat 9 was launched in September 2021 into the orbit of Landsat 7, which it replaces. With Landsat 8, opposite on the same orbit, it revisits every place every eight days. NASA built and launched the satellite; USGS operates it and archives its images at the EROS center (South Dakota), which distributes them for free.'),
  phases:[
    [L('27 septembre 2021', '27 September 2021'), L('Lancement', 'Launch'), L('Atlas V 401 depuis la base de Vandenberg, en Californie.', 'Atlas V 401 from Vandenberg Space Force Base, California.'), 'usgs'],
    [L('novembre 2021', 'November 2021'), L('« Sous-vol » de Landsat 8', 'Landsat 8 “underfly”'), L('En montant vers son orbite, Landsat 9 passe juste sous Landsat 8 : les deux satellites voient les mêmes lieux au même moment, ce qui sert à étalonner l\'un sur l\'autre.', 'While rising to its orbit, Landsat 9 passes just below Landsat 8: both satellites see the same places at the same time, which is used to calibrate one against the other.'), 'usgs'],
    [L('février 2022', 'February 2022'), L('Données dans le nuage', 'Data in the cloud'), L('Les produits Landsat 9 de la Collection 2 (niveaux 1 et 2) sont disponibles sur le nuage d\'AWS, le 15 février 2022.', 'Landsat 9 Collection 2 products (levels 1 and 2) become available in the AWS cloud on 15 February 2022.'), 'usgs']
  ],
  ops:[
    [L('Exploitation', 'Operations'), L('USGS (centre EROS) ; NASA pour la construction et le lancement', 'USGS (EROS center); NASA for building and launch'), 'usgs'],
    [L('Images par jour', 'Images per day'), L('jusqu\'à 750 scènes ; près de 1 500 avec Landsat 8', 'up to 750 scenes; nearly 1,500 with Landsat 8'), 'usgs'],
    [L('Grille des scènes', 'Scene grid'), L('WRS-2 (chemins et rangées)', 'WRS-2 (paths and rows)'), 'usgs'],
    [L('Recouvrement entre traces', 'Sidelap'), L('de 7 % à l\'équateur à ≈ 85 % aux hautes latitudes', 'from 7% at the equator to ≈ 85% at high latitudes'), 'usgs'],
    [L('Accès', 'Access'), L('gratuit, sans restriction', 'free, without restriction'), 'nasa']
  ],
  refs:{}, checked:'2026-11-24'
}
};
