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
},
sentinel1:{
  intro:L('Sentinel-1 est la première mission du programme Copernicus de l\'Union européenne, développée et exploitée par l\'ESA. Les satellites volent par deux sur la même orbite, à 180° l\'un de l\'autre. Les données sont gratuites, sur le Copernicus Data Space Ecosystem.',
          'Sentinel-1 is the first mission of the European Union\'s Copernicus programme, developed and operated by ESA. The satellites fly in pairs on the same orbit, 180° apart. The data are free, on the Copernicus Data Space Ecosystem.'),
  phases:[
    [L('3 avril 2014', '3 April 2014'), L('Lancement de Sentinel-1A', 'Launch of Sentinel-1A'), L('Soyouz depuis Kourou.', 'Soyuz from Kourou.'), 'esa'],
    [L('25 avril 2016', '25 April 2016'), L('Lancement de Sentinel-1B', 'Launch of Sentinel-1B'), L('Soyouz depuis Kourou ; avec 1A, revisite en 6 jours.', 'Soyuz from Kourou; with 1A, 6-day repeat.'), 'esa'],
    [L('août 2022', 'August 2022'), L('Fin de Sentinel-1B', 'End of Sentinel-1B'), L('Sentinel-1A reste seul jusqu\'à l\'arrivée de 1C.', 'Sentinel-1A remains alone until 1C arrives.'), 'esa'],
    [L('5 décembre 2024', '5 December 2024'), L('Lancement de Sentinel-1C', 'Launch of Sentinel-1C'), L('Vega-C depuis Kourou ; 1C porte aussi un récepteur AIS pour les navires.', 'Vega-C from Kourou; 1C also carries an AIS receiver for ships.'), 'esa'],
    [L('4 novembre 2025', '4 November 2025'), L('Lancement de Sentinel-1D', 'Launch of Sentinel-1D'), L('Ariane 6 depuis Kourou.', 'Ariane 6 from Kourou.'), 'esa'],
    [L('juin 2026', 'June 2026'), L('Fin de Sentinel-1A', 'End of Sentinel-1A'), L('Après plus de douze ans en orbite.', 'After more than twelve years in orbit.'), 'esa']
  ],
  ops:[
    [L('Exploitation', 'Operations'), L('ESA', 'ESA'), 'esa'], [L('Financement', 'Funding'), L('États membres de l\'ESA et Union européenne', 'ESA Member States and the European Union'), 'esa'],
    [L('Stations de réception', 'Receiving stations'), L('Svalbard, Matera, Maspalomas, Inuvik, et relais laser EDRS', 'Svalbard, Matera, Maspalomas, Inuvik, and the EDRS laser relay'), 'esa'],
    [L('Accès', 'Access'), 'dataspace.copernicus.eu', 'esa']
  ], refs:{}, checked:'2026-11-24'
},
sentinel2:{
  intro:L('Sentinel-2 est la mission d\'imagerie optique du programme Copernicus. Deux satellites volent à 180° l\'un de l\'autre ; pendant une campagne de prolongation, Sentinel-2A vole à 36° de Sentinel-2B pour élargir la bande couverte.',
          'Sentinel-2 is the optical imaging mission of the Copernicus programme. Two satellites fly 180° apart; during an extension campaign, Sentinel-2A flies 36° from Sentinel-2B to widen the covered strip.'),
  phases:[
    [L('23 juin 2015', '23 June 2015'), L('Lancement de Sentinel-2A', 'Launch of Sentinel-2A'), L('Vega depuis Kourou.', 'Vega from Kourou.'), 'esa'],
    [L('7 mars 2017', '7 March 2017'), L('Lancement de Sentinel-2B', 'Launch of Sentinel-2B'), L('Vega depuis Kourou ; revisite de 5 jours à deux.', 'Vega from Kourou; 5-day revisit with two.'), 'esa'],
    [L('5 septembre 2024', '5 September 2024'), L('Lancement de Sentinel-2C', 'Launch of Sentinel-2C'), L('Il prend la place de 2A face à 2B ; 2A poursuit une campagne de prolongation.', 'It takes 2A\'s place opposite 2B; 2A continues in an extension campaign.'), 'wiki']
  ],
  ops:[
    [L('Exploitation', 'Operations'), L('ESA', 'ESA'), 'esa'], [L('Réception', 'Reception'), L('stations Sentinel et relais laser EDRS', 'Sentinel ground stations and the EDRS laser relay'), 'esa'],
    [L('Construction', 'Built by'), L('Airbus Defence and Space (Allemagne pour le satellite, France pour la caméra)', 'Airbus Defence and Space (Germany for the satellite, France for the camera)'), 'esa'],
    [L('Accès', 'Access'), 'sentinel.esa.int', 'esa']
  ], refs:{}, checked:'2026-11-24'
},
sentinel3:{
  intro:L('Sentinel-3 est développé par l\'ESA et exploité conjointement avec EUMETSAT, l\'organisation européenne des satellites météorologiques. Deux satellites volent sur la même orbite, à 140° l\'un de l\'autre.',
          'Sentinel-3 is developed by ESA and operated jointly with EUMETSAT, the European organisation for meteorological satellites. Two satellites fly on the same orbit, 140° apart.'),
  phases:[
    [L('16 février 2016', '16 February 2016'), L('Lancement de Sentinel-3A', 'Launch of Sentinel-3A'), L('Rockot depuis Plessetsk.', 'Rockot from Plesetsk.'), 'esa'],
    [L('25 avril 2018', '25 April 2018'), L('Lancement de Sentinel-3B', 'Launch of Sentinel-3B'), L('Rockot depuis Plessetsk.', 'Rockot from Plesetsk.'), 'esa'],
    [L('15 septembre 2026', '15 September 2026'), L('Lancement de Sentinel-3C', 'Launch of Sentinel-3C'), L('Vega-C depuis Kourou, sur une orbite d\'environ 820 km.', 'Vega-C from Kourou, into an orbit of about 820 km.'), 'wiki']
  ],
  ops:[
    [L('Exploitation', 'Operations'), L('ESA et EUMETSAT', 'ESA and EUMETSAT'), 'esa'],
    [L('Construction', 'Built by'), L('Thales Alenia Space (satellite, OLCI, SRAL), Leonardo (SLSTR), Airbus Espagne (MWR)', 'Thales Alenia Space (satellite, OLCI, SRAL), Leonardo (SLSTR), Airbus Spain (MWR)'), 'esa'],
    [L('Accès', 'Access'), 'dataspace.copernicus.eu', 'esa']
  ], refs:{}, checked:'2026-11-24'
},
sentinel5p:{
  intro:L('Sentinel-5P (« précurseur ») comble l\'attente entre les anciens instruments de mesure de l\'atmosphère et les futurs Sentinel-4 et -5. Il vole en formation avec le satellite américain Suomi-NPP, dont l\'imageur VIIRS fournit des masques de nuages plus fins.',
          'Sentinel-5P ("precursor") bridges the gap between older atmospheric instruments and the future Sentinel-4 and -5. It flies in formation with the US Suomi-NPP satellite, whose VIIRS imager provides finer cloud masks.'),
  phases:[
    [L('13 octobre 2017', '13 October 2017'), L('Lancement', 'Launch'), L('Rockot depuis Plessetsk (Russie).', 'Rockot from Plesetsk (Russia).'), 'esa']
  ],
  ops:[
    [L('Exploitation', 'Operations'), L('ESA ; traitement et diffusion des données par le DLR', 'ESA; data processing and dissemination by DLR'), 'esa'],
    [L('Réception', 'Reception'), L('Svalbard et Inuvik (science) ; Kiruna (télécommande)', 'Svalbard and Inuvik (science); Kiruna (telecommand)'), 'esa'],
    [L('Accès', 'Access'), 'dataspace.copernicus.eu', 'esa']
  ], refs:{}, checked:'2026-11-24'
},
terra:{
  intro:L('Terra est le premier grand satellite du programme EOS de la NASA. Il a longtemps volé en tête d\'une file de satellites du matin ; à court de carburant, il n\'est plus maintenu sur son orbite depuis 2020 et en est sorti en octobre 2022.',
          'Terra is the first large satellite of NASA\'s EOS programme. It long led a line of morning satellites; running out of fuel, it has not been held on its orbit since 2020 and left it in October 2022.'),
  phases:[
    [L('18 décembre 1999', '18 December 1999'), L('Lancement', 'Launch'), L('Premier satellite du programme EOS.', 'First satellite of the EOS programme.'), 'about'],
    [L('février 2020', 'February 2020'), L('Début de la dérive', 'Start of the drift'), L('L\'heure de passage à l\'équateur avance peu à peu.', 'The equator crossing time gradually moves earlier.'), 'about'],
    [L('octobre 2022', 'October 2022'), L('Sortie de la constellation', 'Constellation exit'), L('Passage avant 10 h 15.', 'Crossing before 10:15 a.m.'), 'about'],
    [L('décembre 2025', 'December 2025'), L('Passage avant 9 h', 'Crossing before 9 a.m.'), L('Selon le calendrier de dérive publié par la NASA.', 'According to the drift schedule published by NASA.'), 'about']
  ],
  ops:[
    [L('Exploitation', 'Operations'), 'NASA', 'about'], [L('Instruments en service', 'Instruments in service'), L('ASTER (sans l\'infrarouge court), CERES, MISR, MODIS, MOPITT', 'ASTER (without short-wave IR), CERES, MISR, MODIS, MOPITT'), 'about'],
    [L('Accès', 'Access'), L('plusieurs centres de données de la NASA', 'several NASA data centres'), 'about']
  ], refs:{}, checked:'2026-11-24'
},
aqua:{
  intro:L('Aqua (d\'abord nommé EOS/PM-1) est le deuxième grand satellite du programme EOS de la NASA, consacré au cycle de l\'eau. Il a longtemps mené le « A-Train », une file de satellites de l\'après-midi.',
          'Aqua (first named EOS/PM-1) is the second large satellite of NASA\'s EOS programme, dedicated to the water cycle. It long led the "A-Train", a line of afternoon satellites.'),
  phases:[
    [L('4 mai 2002', '4 May 2002'), L('Lancement', 'Launch'), L('Delta II depuis Vandenberg.', 'Delta II from Vandenberg.'), 'about'],
    [L('février 2003', 'February 2003'), L('Panne de HSB', 'HSB failure'), L('Le sondeur d\'humidité brésilien s\'arrête.', 'The Brazilian humidity sounder stops.'), 'nasa'],
    [L('octobre 2011', 'October 2011'), L('Panne majeure d\'AMSR-E', 'Major AMSR-E anomaly'), L('Le radiomètre micro-onde japonais cesse de fournir des données de qualité.', 'The Japanese microwave radiometer stops providing high-quality data.'), 'nasa'],
    [L('décembre 2021', 'December 2021'), L('Dernière correction d\'orbite', 'Last orbit correction'), L('Faute de carburant, Aqua dérive : il descend sous le A-Train et passe de plus en plus tard.', 'Out of fuel, Aqua drifts: it sinks below the A-Train and crosses later and later.'), 'nasa']
  ],
  ops:[
    [L('Exploitation', 'Operations'), 'NASA', 'nasa'], [L('Instruments en service', 'Instruments in service'), 'AIRS, AMSU, CERES, MODIS', 'nasa'],
    [L('Durée prévue à l\'origine', 'Original design life'), L('6 ans', '6 years'), 'about']
  ], refs:{}, checked:'2026-11-24'
},
icesat2:{
  intro:L('ICESat-2 succède à ICESat (2003-2009). Son altimètre laser compte les photons un par un, ce qui permet six faisceaux fins plutôt qu\'un seul gros. Au-dessus des terres, il vise un peu à côté de sa trace de référence pour mieux couvrir les forêts.',
          'ICESat-2 follows ICESat (2003-2009). Its laser altimeter counts photons one by one, which allows six thin beams rather than a single large one. Over land, it points slightly off its reference track to better cover forests.'),
  phases:[
    [L('15 septembre 2018', '15 September 2018'), L('Lancement', 'Launch'), L('Depuis la base de Vandenberg.', 'From Vandenberg Air Force Base.'), 'eop']
  ],
  ops:[
    [L('Exploitation', 'Operations'), 'NASA', 'eop'], [L('Statut', 'Status'), L('mission prolongée', 'extended mission'), 'eop'],
    [L('Archive', 'Archive'), 'NSIDC DAAC', 'specs']
  ], refs:{}, checked:'2026-11-24'
},
gracefo:{
  intro:L('GRACE-FO (« Follow-On ») prend la suite de la mission GRACE pour suivre les déplacements d\'eau et de glace à la surface de la Terre. La NASA (JPL) et le GFZ allemand se partagent la mission ; les satellites ont été construits avec Airbus.',
          'GRACE-FO (Follow-On) continues the GRACE mission to track movements of water and ice on the Earth\'s surface. NASA (JPL) and Germany\'s GFZ share the mission; the satellites were built with Airbus.'),
  phases:[
    [L('22 mai 2018', '22 May 2018'), L('Lancement', 'Launch'), L('Falcon 9 depuis Vandenberg, en partage avec cinq satellites Iridium-NEXT.', 'Falcon 9 from Vandenberg, shared with five Iridium-NEXT satellites.'), 'gfz'],
    [L('14 juin 2018', '14 June 2018'), L('Premier faisceau laser', 'First laser link'), L('L\'interféromètre laser mesure pour la première fois la distance entre deux satellites.', 'The laser interferometer measures the distance between two satellites for the first time.'), 'gfz'],
    [L('janvier 2019', 'January 2019'), L('Phase scientifique', 'Science phase'), L('Début des opérations de routine.', 'Start of routine operations.'), 'eop'],
    [L('24 mai 2019', '24 May 2019'), L('Premières données', 'First data'), L('Produits de niveau 1 publiés au PO.DAAC de la NASA et à l\'ISDC du GFZ.', 'Level 1 products released at NASA\'s PO.DAAC and GFZ\'s ISDC.'), 'eop']
  ],
  ops:[
    [L('Exploitation', 'Operations'), L('NASA (JPL) et GFZ', 'NASA (JPL) and GFZ'), 'gfz'], [L('Produits', 'Products'), L('champ de gravité mensuel ; profils d\'atmosphère par radio-occultation GPS', 'monthly gravity field; atmospheric profiles by GPS radio occultation'), 'eop'],
    [L('Archives', 'Archives'), 'NASA PO.DAAC, GFZ ISDC', 'eop']
  ], refs:{}, checked:'2026-11-24'
},
swot:{
  intro:L('SWOT est une mission de la NASA et du CNES, avec les agences spatiales canadienne et britannique. Après une phase de mise au point sur une orbite à répétition rapide, le satellite a rejoint en juillet 2023 son orbite scientifique de 21 jours.',
          'SWOT is a NASA and CNES mission, with the Canadian and UK space agencies. After a commissioning phase on a fast-repeat orbit, the satellite reached its 21-day science orbit in July 2023.'),
  phases:[
    [L('16 décembre 2022', '16 December 2022'), L('Lancement', 'Launch'), L('Falcon 9.', 'Falcon 9.'), 'eop'],
    [L('26 juillet 2023', '26 July 2023'), L('Orbite scientifique', 'Science orbit'), L('Passage à 890 km, cycle de 21 jours ; début de la phase scientifique et premiers produits publics.', 'Move to 890 km, 21-day cycle; start of the science phase and first public products.'), 'cnes'],
    [L('octobre 2024', 'October 2024'), L('Version 2 des produits', 'Version 2 of the products'), L('Diffusion publique et retraitement complet depuis le lancement.', 'Public release and full reprocessing since launch.'), 'cnes']
  ],
  ops:[
    [L('Exploitation', 'Operations'), L('NASA (JPL) et CNES', 'NASA (JPL) and CNES'), 'jpl'], [L('Statut', 'Status'), L('en exploitation', 'in operation'), 'cnes'],
    [L('Archives', 'Archives'), 'NASA PO.DAAC, AVISO+ (CNES)', 'cnes']
  ], refs:{}, checked:'2026-11-24'
}
};
