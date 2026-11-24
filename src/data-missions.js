/* =================================================================
   SATELLITES — registre (équivalent de TELESCOPES dans Observatories et de MISSIONS dans SolarExplorers ; le nom MISSIONS est gardé
   pour réutiliser le code). Ajouter un satellite = une entrée ici (et ses textes dans data-inst, data-mission, data-cat, en/*) ;
   app.js n'a pas à changer. build.js, tools/pages.js et tools/data/fetch_tle.py lisent ce registre (une ligne « id:'…' » par satellite,
   indentée de 4 espaces).
     id, name, short, year      identifiant (ancre #id), nom complet, nom court, année de lancement
     agency                     agences, en texte (règle 5 : aucune n'est mise en avant)
     targets                    thèmes observés, du plus important au moins important ('Terres émergées', 'Océans', 'Glaces', 'Atmosphère', 'Gravité')
     events                     [{ type:'launch'|'orbit'|'add'|'loss'|'note'|'end', label, date:'AAAA-MM-JJ', ref }] : étapes datées ; add : un satellite
                                de plus dans la série, loss : un satellite ou un instrument perdu, note : autre étape, end : fin de toute la mission
     norad, cospar              numéros du catalogue (NORAD, COSPAR) ; norad sert à télécharger les éléments orbitaux (CelesTrak)
     file, bytes, unit          maquette (models/<id>.glb), null s'il n'en existe pas de libre (point bleu) ; unit : mètres par unité
     model                      { src, license, u } : provenance et licence de la maquette, écrites à côté d'elle (règle 8)
     body                       { name, tex, nadir, inc } : la Terre au centre de la vue 3D ; nadir : direction des instruments dans le
                                repère de la maquette ; inc : inclinaison de l'orbite dessinée (degrés)
     view, sun                  cadrage initial { az, el, dist } ; direction de la lumière dans le repère de la maquette
     real                       { key, alt } : donnée réelle (data/<key>.jpg et .json, tools/data/fetch_data.py) et son texte alternatif
     parts                      pièces cliquables : { key (nom du nœud), name, desc, facts:[[texte, clé de source]] }
     refs                       sources : { clé:{ t:titre, p:éditeur, u:URL } } ; chaque valeur chiffrée cite une clé (règle 1)
     sections                   fiche : [{ title, rows:[[libellé, valeur, clé de source]] }] ; « ≈ » pour l'approximatif (règle 2)
     desc                       description courte (premier niveau de lecture)
     checked                    date de la dernière vérification des valeurs
================================================================= */
var MISSIONS = [
  {
    id:'landsat9', name:'Landsat 9', short:'Landsat 9', year:'2021',
    agency:'NASA et USGS ; plateforme Northrop Grumman',
    targets:['Terres émergées', 'Glaces', 'Océans'],
    events:[
      { type:'launch', body:'Terre', date:'2021-09-27', ref:'usgs' }
    ],
    norad:[49260], cospar:'2021-088A',
    file:'models/landsat9.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « Landsat 9 »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[1, 0, 0], inc:98.2 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'landsat9-oli', alt:'Scène en couleurs naturelles prise par Landsat 9' },
    desc:'Lancé en 2021 par la NASA et l\'USGS, Landsat 9 prolonge la plus longue série d\'images de la Terre prises depuis l\'espace, commencée en 1972. Sa caméra OLI-2 voit les terres en neuf bandes, du bleu à l\'infrarouge proche, avec des pixels de 30 m ; son capteur TIRS-2 mesure la température de surface. Avec Landsat 8, placé sur la même orbite à l\'opposé, il revoit chaque lieu tous les huit jours.',
    checked:'2026-11-24',
    refs:{
      nasa:{ t:'Landsat 9 (page de mission, « Quick Facts »)', p:'NASA', u:'https://science.nasa.gov/mission/landsat-9/' },
      usgs:{ t:'Landsat 9', p:'USGS', u:'https://www.usgs.gov/landsat-missions/landsat-9' },
      eop:{ t:'Landsat-9 (eoPortal, dernière mise à jour le 30 août 2023)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/landsat-9' },
      bands:{ t:'What are the band designations for the Landsat satellites?', p:'USGS', u:'https://www.usgs.gov/faqs/what-are-band-designations-landsat-satellites' },
      oli:{ t:'Operational Land Imager (OLI)', p:'NASA', u:'https://science.nasa.gov/mission/landsat/oli/' },
      tirs:{ t:'Thermal Infrared Sensor (TIRS)', p:'NASA', u:'https://science.nasa.gov/mission/landsat/tirs/' },
      ct:{ t:'Éléments orbitaux GP de LANDSAT 9 (n° NORAD 49260)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=49260&FORMAT=TLE' }
    },
    parts:[
      { key:'inst', name:'Instruments OLI-2 et TIRS-2', desc:'Les deux instruments, sur la face tournée vers la Terre : la caméra OLI-2 (lumière visible et infrarouge proche) et le capteur thermique TIRS-2. La maquette les réunit en un seul bloc : ils sont décrits séparément dans « Mission et instruments ».',
        facts:[['Fauchée commune : 185 km, champ de 15°', 'eop'], ['Durée de vie prévue : 5 ans', 'usgs']] },
      { key:'solar', name:'Panneau solaire', desc:'Un grand panneau orientable, tenu par un cardan, qui alimente le satellite.',
        facts:[] },
      { key:'bus', name:'Plateforme', desc:'Structure du satellite (plateforme LEOStar-3 de Northrop Grumman, la même que Landsat 8) : alimentation, contrôle d\'attitude, propulsion, enregistrement et transmission des images.',
        facts:[['Plateforme : LEOStar-3', 'eop'], ['Constructeur : Northrop Grumman', 'usgs'], ['Ergols pour au moins 10 ans', 'nasa']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '27 septembre 2021, Atlas V 401, base de Vandenberg (Californie)', 'usgs'],
        ['Agences', 'NASA (construction, lancement) et USGS (exploitation, archive)', 'usgs'],
        ['Durée de vie prévue', '5 ans ; ergols pour 10 ans', 'nasa'],
        ['Images', 'environ 750 scènes par jour', 'usgs']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'quasi polaire, héliosynchrone', 'nasa'],
        ['Altitude', '705 km', 'nasa'],
        ['Inclinaison', '98,2°', 'nasa'],
        ['Période', '99 minutes, ≈ 14,5 orbites par jour', 'nasa'],
        ['Passage à l\'équateur', '10 h 12 (± 5 min), heure locale, en descendant', 'nasa'],
        ['Cycle de répétition', '16 jours ; 8 jours avec Landsat 8', 'usgs']
      ]},
      { title:'Images', rows:[
        ['Bandes', '11 (9 pour OLI-2, 2 pour TIRS-2)', 'nasa'],
        ['Résolution', '15 m (panchromatique), 30 m (visible et infrarouge), 100 m (thermique)', 'nasa'],
        ['Scène', '185 × 180 km', 'nasa'],
        ['Codage', '14 bits', 'nasa']
      ]}
    ]
  }
  ,
  {
    id:'sentinel1', name:'Sentinel-1', short:'Sentinel-1', year:'2014',
    agency:'ESA et Union européenne (programme Copernicus) ; satellites Thales Alenia Space, radar Airbus',
    targets:['Terres émergées', 'Glaces', 'Océans'],
    events:[
      { type:'launch', label:'Lancement de Sentinel-1A', date:'2014-04-03', ref:'esa' },
      { type:'add', label:'Lancement de Sentinel-1B', date:'2016-04-25', ref:'esa' },
      { type:'loss', label:'Fin de Sentinel-1B', date:'2022-08', ref:'esa' },
      { type:'add', label:'Lancement de Sentinel-1C', date:'2024-12-05', ref:'esa' },
      { type:'add', label:'Lancement de Sentinel-1D', date:'2025-11-04', ref:'esa' },
      { type:'loss', label:'Fin de Sentinel-1A', date:'2026-06', ref:'esa' }
    ],
    norad:[62261, 66315], cospar:'2024-235A, 2025-251A',
    file:null, bytes:0, unit:1,
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.18 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'sentinel1-sar', alt:'Image radar de Sentinel-1 en fausses couleurs (polarisations VV et VH)' },
    desc:'Les satellites Sentinel-1 du programme européen Copernicus portent un radar en bande C, qui voit le sol de jour comme de nuit et à travers les nuages : banquise, glaciers, marées noires, inondations, déformations du sol après un séisme. Sentinel-1C (2024) et Sentinel-1D (2025) ont pris le relais de Sentinel-1B, arrêté en 2022, et de Sentinel-1A, arrêté en juin 2026.',
    checked:'2026-11-24',
    refs:{
      esa:{ t:'Sentinel-1, Facts and figures', p:'ESA', u:'https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Facts_and_figures' },
      wiki:{ t:'S1 Mission (SentiWiki)', p:'ESA / Copernicus', u:'https://sentiwiki.copernicus.eu/web/s1-mission' },
      eop:{ t:'Copernicus: Sentinel-1 (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/copernicus-sentinel-1' },
      ct:{ t:'Éléments orbitaux GP de SENTINEL-1C et -1D (n° NORAD 62261, 66315)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?NAME=SENTINEL-1&FORMAT=TLE' }
    },
    parts:[],
    sections:[
      { title:'Mission', rows:[
        ['Lancements', '1A : 3 avril 2014 ; 1B : 25 avril 2016 ; 1C : 5 décembre 2024 ; 1D : 4 novembre 2025', 'esa'],
        ['Lanceurs', 'Soyouz (1A, 1B), Vega-C (1C), Ariane 6 (1D), depuis Kourou', 'esa'],
        ['Fins de mission', '1B : août 2022 ; 1A : juin 2026', 'esa'],
        ['Durée de vie prévue', 'au moins 7 ans par satellite', 'esa'],
        ['Satellite', '21 m de long avec deux panneaux solaires de 10 m et une antenne radar de 12 m ; 2 185 kg', 'esa']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'quasi polaire, héliosynchrone', 'esa'],
        ['Altitude', '693 km', 'esa'],
        ['Inclinaison', '98,18°', 'wiki'],
        ['Période', '98,6 minutes', 'wiki'],
        ['Passage à l\'équateur', '18 h, heure locale, en montant', 'wiki'],
        ['Cycle de répétition', '12 jours par satellite ; 6 jours à deux', 'wiki']
      ]},
      { title:'Images', rows:[
        ['Radar', 'à synthèse d\'ouverture, bande C, 5,405 GHz', 'esa'],
        ['Mode principal (IW)', 'fauchée de 250 km, pixels de 5 × 20 m', 'esa'],
        ['Autres modes', 'Stripmap : 80 km, 5 × 5 m ; Extra-wide : 400 km, 20 × 40 m ; Wave : vignettes de 20 × 20 km tous les 100 km', 'esa'],
        ['Résolution', '5 × 20 m (mode IW)', 'esa']
      ]}
    ]
  },
  {
    id:'sentinel2', name:'Sentinel-2', short:'Sentinel-2', year:'2015',
    agency:'ESA et Union européenne (programme Copernicus) ; satellites et caméra Airbus',
    targets:['Terres émergées', 'Océans'],
    events:[
      { type:'launch', label:'Lancement de Sentinel-2A', date:'2015-06-23', ref:'esa' },
      { type:'add', label:'Lancement de Sentinel-2B', date:'2017-03-07', ref:'esa' },
      { type:'add', label:'Lancement de Sentinel-2C', date:'2024-09-05', ref:'esa' }
    ],
    norad:[40697, 42063, 60989], cospar:'2015-028A, 2017-013A, 2024-157A',
    file:null, bytes:0, unit:1,
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.62 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'sentinel2-msi', alt:'Scène en couleurs naturelles prise par Sentinel-2' },
    desc:'Les Sentinel-2 photographient toutes les terres émergées et les côtes en treize bandes, du bleu à l\'infrarouge, avec des pixels de 10 m. Deux satellites placés à l\'opposé sur la même orbite revoient chaque lieu tous les cinq jours à l\'équateur : cultures, forêts, villes, eaux côtières, catastrophes.',
    checked:'2026-11-24',
    refs:{
      esa:{ t:'Sentinel-2, Facts and figures', p:'ESA', u:'https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/Facts_and_figures' },
      wiki:{ t:'S2 Mission (SentiWiki)', p:'ESA / Copernicus', u:'https://sentiwiki.copernicus.eu/web/s2-mission' },
      eop:{ t:'Copernicus: Sentinel-2 (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/copernicus-sentinel-2' },
      ct:{ t:'Éléments orbitaux GP de SENTINEL-2A, -2B et -2C (n° NORAD 40697, 42063, 60989)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?NAME=SENTINEL-2&FORMAT=TLE' }
    },
    parts:[],
    sections:[
      { title:'Mission', rows:[
        ['Lancements', '2A : 23 juin 2015 ; 2B : 7 mars 2017 ; 2C : 5 septembre 2024', 'esa'],
        ['Lanceur', 'Vega, depuis Kourou', 'esa'],
        ['Durée de vie prévue', 'au moins 7 ans', 'esa'],
        ['Satellite', '3,4 × 1,8 × 2,35 m ; 1 140 kg dont 123 kg d\'ergols', 'esa'],
        ['Couverture', 'terres et côtes entre 84° N et 84° S', 'esa']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'polaire, héliosynchrone', 'esa'],
        ['Altitude', '786 km', 'esa'],
        ['Inclinaison', '98,62°', 'wiki'],
        ['Période', '100,6 minutes', 'wiki'],
        ['Passage à l\'équateur', '10 h 30, heure locale, en descendant', 'wiki'],
        ['Cycle de répétition', '10 jours par satellite ; revisite de 5 jours à deux (à l\'équateur)', 'wiki']
      ]},
      { title:'Images', rows:[
        ['Bandes', '13, de 443 à 2 190 nm', 'esa'],
        ['Résolution', '10 m (4 bandes), 20 m (6 bandes), 60 m (3 bandes)', 'esa'],
        ['Fauchée', '290 km', 'esa']
      ]}
    ]
  },
  {
    id:'sentinel3', name:'Sentinel-3', short:'Sentinel-3', year:'2016',
    agency:'ESA et Union européenne (programme Copernicus), exploité avec EUMETSAT ; satellites Thales Alenia Space',
    targets:['Océans', 'Terres émergées', 'Glaces'],
    events:[
      { type:'launch', label:'Lancement de Sentinel-3A', date:'2016-02-16', ref:'esa' },
      { type:'add', label:'Lancement de Sentinel-3B', date:'2018-04-25', ref:'esa' },
      { type:'add', label:'Lancement de Sentinel-3C', date:'2026-09-15', ref:'esa' }
    ],
    norad:[41335, 43437, 100690], cospar:'2016-011A, 2018-039A, 2026-209B',
    file:null, bytes:0, unit:1,
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.65 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'sentinel3-olci', alt:'Aperçu publié avec le produit OLCI de niveau 2 « eaux » (WFR) de Sentinel-3' },
    desc:'Les Sentinel-3 surveillent surtout les océans : couleur de l\'eau (plancton, sédiments), température de la mer et des terres, hauteur de la mer, des lacs et des fleuves. Chaque satellite porte une caméra à 21 bandes (OLCI), un radiomètre infrarouge (SLSTR) et un altimètre radar (SRAL). Sentinel-3C a rejoint les deux premiers en septembre 2026.',
    checked:'2026-11-24',
    refs:{
      esa:{ t:'Sentinel-3, Facts and figures', p:'ESA', u:'https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-3/Facts_and_figures' },
      wiki:{ t:'S3 Mission (SentiWiki)', p:'ESA / Copernicus', u:'https://sentiwiki.copernicus.eu/web/s3-mission' },
      olci:{ t:'S3 OLCI Instrument (SentiWiki)', p:'ESA / Copernicus', u:'https://sentiwiki.copernicus.eu/web/s3-olci-instrument' },
      slstr:{ t:'S3 SLSTR Instrument (SentiWiki)', p:'ESA / Copernicus', u:'https://sentiwiki.copernicus.eu/web/s3-slstr-instrument' },
      ct:{ t:'Éléments orbitaux GP de SENTINEL-3A, -3B et -3C (n° NORAD 41335, 43437, 100690)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?NAME=SENTINEL-3&FORMAT=TLE' }
    },
    parts:[],
    sections:[
      { title:'Mission', rows:[
        ['Lancements', '3A : 16 février 2016 ; 3B : 25 avril 2018 ; 3C : 15 septembre 2026', 'esa'],
        ['Lanceurs', 'Rockot depuis Plessetsk (3A, 3B) ; Vega-C depuis Kourou (3C)', 'esa'],
        ['Durée de vie prévue', '7 ans ; consommables pour 12 ans', 'esa'],
        ['Satellite', '2,2 × 2,2 × 3,7 m ; 1 150 kg dont 130 kg d\'ergols', 'esa'],
        ['Exploitation', 'ESA et EUMETSAT', 'esa']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'polaire, héliosynchrone', 'esa'],
        ['Altitude', '814,5 km (moyenne)', 'esa'],
        ['Inclinaison', '98,65°', 'wiki'],
        ['Période', '100,99 minutes', 'wiki'],
        ['Passage à l\'équateur', '10 h, heure locale, en descendant', 'wiki'],
        ['Cycle de répétition', '27 jours (385 orbites)', 'wiki']
      ]},
      { title:'Images', rows:[
        ['OLCI', '21 bandes de 400 à 1 020 nm, fauchée de 1 270 km', 'esa'],
        ['SLSTR', '9 bandes de 550 à 12 000 nm, double visée : fauchées de 1 400 km (verticale) et 740 km (oblique)', 'esa'],
        ['SRAL', 'altimètre radar en bandes Ku et C (300 m après traitement SAR)', 'esa'],
        ['Résolution', '300 m (OLCI) ; 500 m et 1 km (SLSTR)', 'olci'],
        ['Revisite (océans, deux satellites)', 'SLSTR ≈ 1 jour, OLCI ≈ 2 jours', 'esa']
      ]}
    ]
  },
  {
    id:'sentinel5p', name:'Sentinel-5 Precursor', short:'Sentinel-5P', year:'2017',
    agency:'ESA, Netherlands Space Office et Union européenne (Copernicus) ; satellite Airbus ; données traitées par le DLR',
    targets:['Atmosphère'],
    events:[
      { type:'launch', label:'Lancement', date:'2017-10-13', ref:'esa' }
    ],
    norad:[42969], cospar:'2017-064A',
    file:null, bytes:0, unit:1,
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.74 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'sentinel5p-tropomi', alt:'Carte du dioxyde d\'azote au-dessus des Pays-Bas mesuré par TROPOMI' },
    desc:'Sentinel-5P mesure chaque jour, sur toute la Terre, les gaz qui polluent l\'air ou réchauffent le climat : dioxyde d\'azote, ozone, monoxyde de carbone, méthane, dioxyde de soufre, ainsi que les aérosols et les nuages. Son spectromètre TROPOMI couvre une bande de 2 600 km avec des pixels de quelques kilomètres.',
    checked:'2026-11-24',
    refs:{
      esa:{ t:'Sentinel-5P, Facts and figures', p:'ESA', u:'https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-5P/Facts_and_figures' },
      wiki:{ t:'S5P Mission (SentiWiki)', p:'ESA / Copernicus', u:'https://sentiwiki.copernicus.eu/web/s5p-mission' },
      eop:{ t:'Copernicus: Sentinel-5P (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/copernicus-sentinel-5p' },
      ct:{ t:'Éléments orbitaux GP de SENTINEL-5P (n° NORAD 42969)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=42969&FORMAT=TLE' }
    },
    parts:[],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '13 octobre 2017, Rockot, depuis Plessetsk (Russie)', 'esa'],
        ['Durée de vie prévue', 'au moins 7 ans ; consommables pour 10 ans', 'esa'],
        ['Satellite', '820 kg dont 82 kg d\'ergols', 'esa'],
        ['Agences', 'ESA et Netherlands Space Office ; traitement des données : DLR', 'esa']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'polaire, héliosynchrone, en formation avec le satellite américain Suomi-NPP', 'esa'],
        ['Altitude', '824 km', 'esa'],
        ['Inclinaison', '98,74°', 'eop'],
        ['Période', '101 minutes', 'eop'],
        ['Passage à l\'équateur', '13 h 30, heure locale, en montant', 'wiki'],
        ['Cycle de répétition', '17 jours (227 orbites) ; couverture de toute la Terre chaque jour', 'eop']
      ]},
      { title:'Images', rows:[
        ['Bandes', 'ultraviolet et visible (270 – 495 nm), proche infrarouge (675 – 775 nm), infrarouge court (2 305 – 2 385 nm)', 'esa'],
        ['Résolution', 'jusqu\'à 7 × 3,5 km', 'esa'],
        ['Fauchée', '2 600 km', 'esa']
      ]}
    ]
  },
  {
    id:'terra', name:'Terra', short:'Terra', year:'1999',
    agency:'NASA, avec le Japon (METI, instrument ASTER) et le Canada (ASC, instrument MOPITT)',
    targets:['Terres émergées', 'Atmosphère', 'Océans'],
    events:[
      { type:'launch', label:'Lancement', date:'1999-12-18', ref:'about' },
      { type:'note', label:'Début de la dérive de l\'orbite', date:'2020-02', ref:'about' }
    ],
    norad:[25994], cospar:'1999-068A',
    file:'models/terra.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « Terra »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.5 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'terra-modis', alt:'La France et les Alpes vues par MODIS sur Terra, en couleurs naturelles' },
    desc:'Terra, le « vaisseau amiral » du programme EOS de la NASA, observe la Terre depuis 1999 avec cinq instruments : MODIS photographie toute la planète chaque jour ou presque, ASTER prend des images détaillées, MISR regarde sous neuf angles, CERES mesure l\'énergie reçue et renvoyée, MOPITT suit la pollution. Faute de carburant, son orbite dérive depuis 2020 : il passe de plus en plus tôt dans la matinée.',
    checked:'2026-11-24',
    refs:{
      about:{ t:'About Terra (Quick Facts, Terra Status)', p:'NASA', u:'https://terra.nasa.gov/about' },
      inst:{ t:'Terra Instruments', p:'NASA', u:'https://terra.nasa.gov/about/terra-instruments' },
      aster:{ t:'ASTER Instrument Characteristics', p:'NASA JPL', u:'https://asterweb.jpl.nasa.gov/characteristics.asp' },
      misr:{ t:'MISR Instrument', p:'NASA JPL', u:'https://misr.jpl.nasa.gov/mission/misr-instrument/' },
      modis:{ t:'Aqua (eoPortal, description de MODIS)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/aqua' },
      ct:{ t:'Éléments orbitaux GP de TERRA (n° NORAD 25994)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=25994&FORMAT=TLE' }
    },
    parts:[
      { key:'bus', name:'Plateforme et instruments', desc:'Le corps du satellite, avec ses cinq instruments sur la face tournée vers la Terre (MODIS, ASTER, MISR, CERES, MOPITT). La maquette ne les sépare pas : ils sont décrits un par un dans « Mission et instruments ».',
        facts:[['Plateforme : 6,8 m de long, 3,5 m de large', 'about'], ['Masse au lancement : 5 190 kg', 'about']] },
      { key:'solar', name:'Panneau solaire', desc:'Un grand panneau solaire au bout d\'un bras, qui alimente le satellite.', facts:[] },
      { key:'antenna', name:'Antenne à grand gain', desc:'Antenne parabolique au bout d\'un mât, qui envoie les données vers les satellites relais de la NASA.', facts:[] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '18 décembre 1999', 'about'],
        ['Masse au lancement', '5 190 kg', 'about'],
        ['Instruments', 'ASTER, CERES, MISR, MODIS, MOPITT ; les données infrarouge court d\'ASTER ne sont plus disponibles', 'about'],
        ['Dérive', 'depuis février 2020 ; passage avant 10 h 15 depuis octobre 2022, avant 9 h depuis décembre 2025', 'about']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'quasi polaire, héliosynchrone (passage du matin)', 'about'],
        ['Altitude', '705 km', 'about'],
        ['Inclinaison', '98,5°', 'about'],
        ['Période', '99 minutes, 14 orbites par jour', 'about'],
        ['Passage à l\'équateur', '10 h 30, heure locale, en descendant (orbite d\'origine, avant la dérive)', 'about'],
        ['Cycle de répétition', '16 jours', 'about']
      ]},
      { title:'Images', rows:[
        ['MODIS', '36 bandes de 0,4 à 14,4 µm, fauchée de 2 330 km', 'modis'],
        ['ASTER', '14 bandes ; 15 m (visible), 30 m (infrarouge court), 90 m (thermique) ; fauchée de 60 km', 'aster'],
        ['MISR', '9 caméras, 4 bandes ; fauchée commune d\'environ 400 km', 'misr'],
        ['Résolution', '15 m (ASTER, visible)', 'aster']
      ]}
    ]
  },
  {
    id:'aqua', name:'Aqua', short:'Aqua', year:'2002',
    agency:'NASA, avec le Japon (JAXA, instrument AMSR-E) et le Brésil (INPE, instrument HSB) ; plateforme TRW (Northrop Grumman)',
    targets:['Atmosphère', 'Océans', 'Glaces'],
    events:[
      { type:'launch', label:'Lancement', date:'2002-05-04', ref:'about' },
      { type:'loss', label:'Panne de l\'instrument HSB', date:'2003-02', ref:'nasa' },
      { type:'loss', label:'Panne majeure d\'AMSR-E', date:'2011-10', ref:'nasa' },
      { type:'note', label:'Dernière correction d\'orbite, début de la dérive', date:'2021-12', ref:'nasa' }
    ],
    norad:[27424], cospar:'2002-022A',
    file:'models/aqua.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « Aqua »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, 0, 1], inc:98.2 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'aqua-modis', alt:'La France et les Alpes vues par MODIS sur Aqua, en couleurs naturelles' },
    desc:'Aqua étudie le cycle de l\'eau : vapeur d\'eau et température de l\'air (AIRS, AMSU), nuages et bilan d\'énergie (CERES), mers, glaces et végétation (MODIS). Lancé en 2002 pour six ans, il fonctionne toujours avec quatre de ses six instruments. Il passe l\'après-midi, trois heures après Terra ; sans carburant depuis fin 2021, il descend lentement et passe de plus en plus tard.',
    checked:'2026-11-24',
    refs:{
      nasa:{ t:'Aqua (page de mission)', p:'NASA', u:'https://science.nasa.gov/mission/aqua/' },
      about:{ t:'About Aqua: spacecraft and instruments', p:'NASA', u:'https://science.nasa.gov/mission/aqua/about-aqua-spacecraft-and-instruments/' },
      eop:{ t:'Aqua (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/aqua' },
      ct:{ t:'Éléments orbitaux GP d\'AQUA (n° NORAD 27424)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=27424&FORMAT=TLE' }
    },
    parts:[
      { key:'inst', name:'Instruments', desc:'Les instruments sur la face tournée vers la Terre : AIRS, AMSU-A, CERES, MODIS, et l\'antenne d\'AMSR-E au bout du satellite. La maquette les réunit en un seul ensemble.',
        facts:[['Six instruments, dont quatre fonctionnent encore', 'nasa']] },
      { key:'solar', name:'Panneau solaire', desc:'Un grand panneau solaire d\'un seul tenant.', facts:[['Puissance : 4 860 W en fin de vie', 'about']] },
      { key:'bus', name:'Plateforme', desc:'Structure du satellite (plateforme AB1200 de TRW, aujourd\'hui Northrop Grumman) : alimentation, contrôle d\'attitude, propulsion à l\'hydrazine, transmission.',
        facts:[['Masse au lancement : 2 934 kg', 'about'], ['Dimensions déployé : 4,8 × 16,7 × 8 m', 'about']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '4 mai 2002, Delta II 7920-10L, base de Vandenberg (Californie)', 'about'],
        ['Masse au lancement', '2 934 kg', 'about'],
        ['Durée de vie prévue', '6 ans', 'about'],
        ['Instruments', 'AIRS, AMSU-A, HSB, AMSR-E, MODIS, CERES ; AIRS, AMSU, CERES et MODIS fonctionnent encore', 'nasa']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'quasi polaire, héliosynchrone (passage de l\'après-midi)', 'about'],
        ['Altitude', '705 km', 'about'],
        ['Inclinaison', '98,2°', 'about'],
        ['Période', '98,8 minutes', 'about'],
        ['Passage à l\'équateur', '13 h 30, heure locale, en montant (orbite d\'origine, avant la dérive)', 'about'],
        ['Cycle de répétition', '16 jours', 'eop']
      ]},
      { title:'Images', rows:[
        ['MODIS', '36 bandes de 0,4 à 14,4 µm, fauchée de 2 330 km', 'eop'],
        ['AIRS', 'plus de 2 300 canaux infrarouges, fauchée de 1 650 km', 'eop'],
        ['AMSR-E', '12 canaux de 6,9 à 89 GHz, fauchée de plus de 1 450 km', 'eop'],
        ['Résolution', '13,5 km (AIRS, à la verticale)', 'eop']
      ]}
    ]
  },
  {
    id:'icesat2', name:'ICESat-2', short:'ICESat-2', year:'2018',
    agency:'NASA ; plateforme Northrop Grumman',
    targets:['Glaces', 'Terres émergées', 'Océans'],
    events:[
      { type:'launch', label:'Lancement', date:'2018-09-15', ref:'eop' }
    ],
    norad:[43613], cospar:'2018-070A',
    file:'models/icesat2.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « ICESat-2 »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, 1, 0], inc:92 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'icesat2-atlas', alt:'Carte de l\'épaisseur de la banquise arctique tirée des mesures d\'ICESat-2' },
    desc:'ICESat-2 mesure l\'altitude de la surface avec un laser vert : six faisceaux, 10 000 impulsions par seconde, et un télescope qui compte les photons revenus un par un. Il suit l\'amincissement des calottes du Groenland et de l\'Antarctique, l\'épaisseur de la banquise, la hauteur des forêts.',
    checked:'2026-11-24',
    refs:{
      specs:{ t:'ICESat-2 Technical Specs', p:'NASA', u:'https://icesat-2.gsfc.nasa.gov/science/specs' },
      eop:{ t:'ICESat-2 (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/icesat-2' },
      nssdc:{ t:'ICESat-2 (NSSDC Master Catalog)', p:'NASA', u:'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-070A' },
      ct:{ t:'Éléments orbitaux GP d\'ICESAT-2 (n° NORAD 43613)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=43613&FORMAT=TLE' }
    },
    parts:[
      { key:'atlas', name:'Télescope d\'ATLAS', desc:'L\'ouverture du télescope de réception de l\'altimètre laser ATLAS, tournée vers la Terre ; il recueille les photons des six faisceaux après leur aller-retour.',
        facts:[['Longueur d\'onde du laser : 532 nm (vert)', 'specs'], ['Six faisceaux, en trois paires', 'specs']] },
      { key:'solar', name:'Panneaux solaires', desc:'Une aile de quatre panneaux solaires, avec ses charnières.', facts:[] },
      { key:'bus', name:'Plateforme et instrument', desc:'Le corps du satellite (plateforme LEOStar-3 de Northrop Grumman) et le reste de l\'instrument ATLAS, que la maquette ne sépare pas.',
        facts:[['Plateforme : LEOStar-3', 'eop'], ['Masse : 1 580 kg', 'nssdc']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '15 septembre 2018', 'eop'],
        ['Masse', '1 580 kg', 'nssdc'],
        ['Durée de vie prévue', '3 ans, objectif 5 ans ; ergols pour 7 ans', 'eop'],
        ['Instrument', 'altimètre laser ATLAS, seul instrument à bord', 'eop']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'quasi polaire, non héliosynchrone', 'specs'],
        ['Altitude', '≈ 500 km', 'specs'],
        ['Inclinaison', '92° (couverture jusqu\'à 88° N et S)', 'specs'],
        ['Cycle de répétition', '91 jours, sous-cycle mensuel aux pôles et sur les océans', 'specs']
      ]},
      { title:'Images', rows:[
        ['Faisceaux', '6, en 3 paires', 'specs'],
        ['Tache au sol', '11 m', 'specs'],
        ['Cadence', '10 000 impulsions par seconde (une tous les ≈ 0,7 m au sol)', 'specs'],
        ['Résolution', 'tache de 11 m tous les 0,7 m le long de la trace', 'specs'],
        ['Visée', 'précision de pointage de 45 m', 'specs']
      ]}
    ]
  },
  {
    id:'gracefo', name:'GRACE-FO', short:'GRACE-FO', year:'2018',
    agency:'NASA (JPL) et GFZ (Allemagne) ; satellites Airbus',
    targets:['Gravité', 'Glaces', 'Océans'],
    events:[
      { type:'launch', label:'Lancement des deux satellites', date:'2018-05-22', ref:'gfz' },
      { type:'orbit', label:'Début de la phase scientifique', date:'2019-01', ref:'eop' }
    ],
    norad:[43476, 43477], cospar:'2018-047A, 2018-047B',
    file:'models/gracefo.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « GRACE-FO »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:89 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'gracefo-mascon', alt:'Carte du monde des variations d\'eau stockée mesurées par GRACE et GRACE-FO' },
    desc:'GRACE-FO, ce sont deux satellites identiques qui se suivent à environ 220 km. En mesurant sans cesse et très précisément la distance qui les sépare, ils « pèsent » la Terre : quand ils survolent une masse plus grande, le premier accélère avant le second. On en tire chaque mois la fonte des glaces, la baisse des nappes phréatiques, les sécheresses.',
    checked:'2026-11-24',
    refs:{
      gfz:{ t:'GRACE-FO (Gravity Recovery and Climate Experiment Follow-On)', p:'GFZ', u:'https://www.gfz.de/en/section/global-geomonitoring-and-gravity-field/projects/grace-fo-gravity-recovery-and-climate-experiment-follow-on-mission' },
      eop:{ t:'GRACE-FO (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/grace-fo' },
      nasa:{ t:'GRACE-FO (page de mission)', p:'NASA', u:'https://science.nasa.gov/mission/grace-fo/' },
      ct:{ t:'Éléments orbitaux GP de GRACE-FO 1 et 2 (n° NORAD 43476, 43477)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?NAME=GRACE-FO&FORMAT=TLE' }
    },
    parts:[
      { key:'inst', name:'Antennes et capteurs', desc:'Ce qui dépasse de la coque : le cornet de la mesure de distance micro-onde (vers l\'autre satellite), les viseurs d\'étoiles, les antennes GPS. Le laser (LRI) et l\'accéléromètre sont à l\'intérieur.',
        facts:[['Mesure de distance en bandes K (24 GHz) et Ka (32 GHz)', 'eop']] },
      { key:'bus', name:'Coque et plateforme', desc:'Coque en forme de toit, couverte de cellules solaires, d\'un des deux satellites jumeaux, dérivée de celles de CHAMP, GRACE et Swarm.',
        facts:[['Environ 3 × 3 × 0,8 m et 600 kg', 'eop']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '22 mai 2018, Falcon 9, base de Vandenberg, avec cinq satellites Iridium-NEXT', 'gfz'],
        ['Satellites', 'deux, d\'environ 3 × 3 × 0,8 m et 600 kg', 'eop'],
        ['Phase scientifique', 'depuis janvier 2019, prévue pour 5 ans après le lancement', 'eop'],
        ['Agences', 'NASA (JPL) et GFZ ; satellites construits avec Airbus', 'gfz']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'polaire, les deux satellites sur la même orbite', 'eop'],
        ['Altitude', '≈ 490 km', 'eop'],
        ['Inclinaison', '89,0° (± 0,1°)', 'gfz'],
        ['Période', '≈ 90 minutes', 'eop'],
        ['Écart entre les satellites', '≈ 220 km (maintenu entre 170 et 270 km)', 'eop']
      ]},
      { title:'Images', rows:[
        ['Mesure', 'variation de la distance entre les deux satellites', 'gfz'],
        ['Micro-ondes (KBR)', 'bandes K (24 GHz) et Ka (32 GHz)', 'eop'],
        ['Laser (LRI)', 'démonstrateur, précision du nanomètre', 'gfz'],
        ['Résolution', 'cartes mensuelles du champ de gravité', 'eop']
      ]}
    ]
  },
  {
    id:'swot', name:'SWOT', short:'SWOT', year:'2022',
    agency:'NASA et CNES, avec l\'Agence spatiale canadienne et l\'Agence spatiale du Royaume-Uni',
    targets:['Océans', 'Terres émergées'],
    events:[
      { type:'launch', label:'Lancement', date:'2022-12-16', ref:'eop' },
      { type:'orbit', label:'Début de la phase scientifique', date:'2023-07-26', ref:'cnes' }
    ],
    norad:[54754], cospar:'2022-173A',
    file:'models/swot.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « SWOT »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:77.6 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'swot-karin', alt:'Carte mondiale de la hauteur de la mer mesurée par SWOT pendant son premier cycle de 21 jours' },
    desc:'SWOT mesure la hauteur de l\'eau sur une bande de 120 km de large, et non plus sur un simple trait comme les altimètres classiques : il voit les tourbillons de l\'océan d\'une vingtaine de kilomètres, et la hauteur des lacs et des fleuves. Son radar KaRIn a deux antennes au bout d\'un mât de 10 m.',
    checked:'2026-11-24',
    refs:{
      eop:{ t:'SWOT (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/swot' },
      cnes:{ t:'SWOT', p:'CNES', u:'https://cnes.fr/projets/swot' },
      jpl:{ t:'Surface Water and Ocean Topography (SWOT)', p:'NASA JPL', u:'https://www.jpl.nasa.gov/missions/surface-water-and-ocean-topography-swot/' },
      ct:{ t:'Éléments orbitaux GP de SWOT (n° NORAD 54754)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=54754&FORMAT=TLE' }
    },
    parts:[
      { key:'karin', name:'Radar KaRIn', desc:'Le mât de 10 m et, à chaque bout, une antenne du radar interférométrique KaRIn. Les deux antennes reçoivent le même écho : la petite différence de trajet donne la hauteur de l\'eau de chaque côté de la trace.',
        facts:[['Mât de 10 m', 'eop'], ['Masse de KaRIn : 294 kg', 'eop']] },
      { key:'nadir', name:'Altimètre Poseidon-3C', desc:'L\'antenne de l\'altimètre classique, qui mesure à la verticale du satellite, au milieu de la bande de KaRIn.', facts:[] },
      { key:'solar', name:'Panneaux solaires', desc:'Deux ailes de panneaux solaires.', facts:[] },
      { key:'bus', name:'Plateforme', desc:'Le corps du satellite (plateforme fournie par le CNES) et les autres instruments : radiomètre AMR-S, récepteurs DORIS et GPS, réflecteurs laser.', facts:[] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '16 décembre 2022, Falcon 9', 'eop'],
        ['Masse', '≈ 2 000 kg, dont 294 kg pour KaRIn', 'eop'],
        ['Durée prévue', '3 ans', 'cnes'],
        ['Instruments', '6, dont KaRIn et l\'altimètre Poseidon-3C', 'cnes']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'presque circulaire, non héliosynchrone', 'eop'],
        ['Altitude', '890 km', 'eop'],
        ['Inclinaison', '77,6°', 'eop'],
        ['Cycle de répétition', '21 jours (orbite scientifique depuis juillet 2023)', 'cnes'],
        ['Couverture', 'entre 78° N et 78° S, 90 à 95 % de la surface', 'eop']
      ]},
      { title:'Images', rows:[
        ['KaRIn', 'radar interférométrique en bande Ka, deux bandes de 50 km de part et d\'autre de la trace', 'eop'],
        ['Fauchée', '≈ 120 km', 'eop'],
        ['Résolution', '15 km (océan) ; tourbillons visibles dès ≈ 20 km', 'cnes'],
        ['Plans d\'eau', 'lacs et réservoirs à partir de 250 × 250 m', 'cnes']
      ]}
    ]
  }
  ,
  {
    id:'pace', name:'PACE (Plankton, Aerosol, Cloud, ocean Ecosystem)', short:'PACE', year:'2024',
    agency:'NASA (centre Goddard) ; polarimètre SPEXone néerlandais',
    targets:['Océans', 'Atmosphère'],
    events:[
      { type:'launch', label:'Lancement', date:'2024-02-08', ref:'wiki' },
      { type:'note', label:'Premières données publiques', date:'2024-04-11', ref:'gsfc' }
    ],
    norad:[58928], cospar:'2024-025A',
    file:'models/pace.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « PACE »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'pace-oci', alt:'La Terre entière vue en une journée par l\'instrument OCI de PACE, en couleurs naturelles' },
    desc:'PACE observe la couleur de l\'océan avec un spectromètre qui découpe la lumière en bandes de 5 nm, de l\'ultraviolet à l\'infrarouge proche : il distingue les familles de plancton végétal, base de la vie marine. Deux polarimètres mesurent aussi les aérosols et les nuages. Il voit toute la Terre en deux jours.',
    checked:'2026-11-24',
    refs:{
      nasa:{ t:'PACE (page de mission)', p:'NASA', u:'https://science.nasa.gov/mission/pace/' },
      gsfc:{ t:'PACE, site du projet', p:'NASA Goddard', u:'https://pace.gsfc.nasa.gov/' },
      osc:{ t:'PACE Mission Overview', p:'NASA Ocean Biology Processing Group', u:'https://pace.oceansciences.org/mission.htm' },
      oci:{ t:'Ocean Color Instrument (OCI)', p:'NASA Ocean Biology Processing Group', u:'https://pace.oceansciences.org/oci.htm' },
      wiki:{ t:'Plankton, Aerosol, Cloud, ocean Ecosystem', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Plankton,_Aerosol,_Cloud,_ocean_Ecosystem' },
      ct:{ t:'Éléments orbitaux GP de PACE (n° NORAD 58928)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=58928&FORMAT=TLE' }
    },
    parts:[
      { key:'bus', name:'Plateforme et instruments', desc:'Le corps du satellite, construit au centre Goddard de la NASA, et ses trois instruments : le spectromètre OCI (sous son télescope tournant), les polarimètres SPEXone et HARP2. La maquette les réunit en un seul bloc ; ils sont décrits séparément dans « Mission et instruments ».',
        facts:[['1,5 × 1,5 × 3,2 m, au plus 1 700 kg avec ses ergols', 'osc']] },
      { key:'solar', name:'Panneau solaire', desc:'Le panneau solaire déployé qui alimente le satellite.', facts:[['Puissance : 1 000 W', 'wiki']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '8 février 2024, Falcon 9, Cap Canaveral (Floride)', 'wiki'],
        ['Agence', 'NASA ; satellite et OCI construits au centre Goddard', 'nasa'],
        ['Durée prévue', 'au moins 3 ans ; ergols pour 10 ans', 'osc'],
        ['Satellite', '1,5 × 1,5 × 3,2 m ; au plus 1 700 kg', 'osc']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'polaire, héliosynchrone', 'wiki'],
        ['Altitude', '676,5 km', 'osc'],
        ['Inclinaison', '98°', 'osc'],
        ['Période', '≈ 98,3 minutes', 'gsfc'],
        ['Passage à l\'équateur', '13 h (± 10 min), heure locale', 'wiki']
      ]},
      { title:'Images', rows:[
        ['OCI', 'de 315 à 895 nm par pas de 5 nm, plus 7 bandes de l\'infrarouge court (940 à 2 260 nm)', 'osc'],
        ['Fauchée', '≈ 2 700 km (OCI) : toute la Terre en 2 jours', 'oci'],
        ['Résolution', '≈ 1 km² au nadir (OCI)', 'osc'],
        ['Polarimètres', 'HARP2 : 4 couleurs, fauchée de 1 556 km ; SPEXone : 385 à 770 nm, fauchée de 100 km', 'osc']
      ]}
    ]
  },
  {
    id:'jpss', name:'JPSS : Suomi NPP, NOAA-20 et NOAA-21', short:'JPSS', year:'2011',
    agency:'NOAA (exploitation) et NASA (construction, lancement) ; satellites Ball Aerospace (Suomi NPP, NOAA-20) et Northrop Grumman (NOAA-21)',
    targets:['Atmosphère', 'Océans', 'Terres émergées'],
    events:[
      { type:'launch', label:'Lancement de Suomi NPP', date:'2011-10-28', ref:'npp' },
      { type:'add', label:'Lancement de NOAA-20 (JPSS-1)', date:'2017-11-18', ref:'n20' },
      { type:'add', label:'Lancement de NOAA-21 (JPSS-2)', date:'2022-11-10', ref:'n21' },
      { type:'loss', label:'Fin de Suomi NPP', date:'2026-11-02', ref:'npp' }
    ],
    norad:[43013, 54234], cospar:'2017-073A, 2022-150A',
    file:'models/noaa20.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « NOAA-20 »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.7 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'jpss-viirs', alt:'La France et les Alpes vues par l\'instrument VIIRS, en couleurs naturelles' },
    desc:'Les satellites météorologiques polaires américains du programme JPSS font le tour de la Terre quatorze fois par jour et la couvrent entière deux fois par jour. Leur caméra VIIRS voit 22 bandes, du bleu à l\'infrarouge thermique, sur 3 000 km de large ; leurs sondeurs mesurent la température et l\'humidité de l\'air pour les prévisions. Suomi NPP, le premier, a été arrêté le 2 novembre 2026.',
    checked:'2026-11-24',
    refs:{
      noaa:{ t:'Joint Polar Satellite System (JPSS)', p:'NOAA NESDIS', u:'https://www.nesdis.noaa.gov/our-satellites/currently-flying/joint-polar-satellite-system' },
      viirs:{ t:'Visible Infrared Imaging Radiometer Suite (VIIRS)', p:'NOAA NESDIS', u:'https://www.nesdis.noaa.gov/our-satellites/currently-flying/joint-polar-satellite-system/visible-infrared-imaging-radiometer-suite-viirs' },
      eop:{ t:'Suomi NPP (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/suomi-npp' },
      eopj:{ t:'JPSS (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/jpss' },
      npp:{ t:'Suomi NPP', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Suomi_NPP' },
      n20:{ t:'NOAA-20', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/NOAA-20' },
      n21:{ t:'NOAA-21', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/NOAA-21' },
      ct:{ t:'Éléments orbitaux GP de NOAA 20 et NOAA 21 (n° NORAD 43013, 54234)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=43013&FORMAT=TLE' }
    },
    parts:[
      { key:'bus', name:'Plateforme et instruments', desc:'Le corps de NOAA-20 et ses instruments : la caméra VIIRS, le sondeur infrarouge CrIS, le sondeur micro-onde ATMS, OMPS (ozone) et CERES (bilan radiatif). La maquette les réunit en un seul bloc.',
        facts:[['Masse au lancement : 2 540 kg', 'n20'], ['1,3 × 1,3 × 4,2 m', 'n20']] },
      { key:'solar', name:'Panneau solaire', desc:'L\'aile de panneaux solaires, d\'un seul côté du satellite.', facts:[['Puissance : 1 932 W (NOAA-20)', 'n20']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancements', 'Suomi NPP : 28 octobre 2011 ; NOAA-20 : 18 novembre 2017 ; NOAA-21 : 10 novembre 2022, tous depuis Vandenberg', 'n21'],
        ['Lanceurs', 'Delta II (Suomi NPP, NOAA-20), Atlas V 401 (NOAA-21)', 'n21'],
        ['Fin de Suomi NPP', 'données arrêtées le 1er novembre 2026, satellite désactivé le 2 novembre 2026', 'npp'],
        ['Durée de vie prévue', '7 ans (NOAA-20)', 'n20']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'polaire, héliosynchrone ; NOAA-21 sur la même orbite que NOAA-20', 'n21'],
        ['Altitude', '≈ 833 km', 'eopj'],
        ['Inclinaison', '98,75°', 'eopj'],
        ['Période', '≈ 101 minutes, ≈ 14 orbites par jour', 'eop'],
        ['Couverture', 'toute la Terre deux fois par jour', 'n21']
      ]},
      { title:'Images', rows:[
        ['VIIRS', '22 bandes, de 412 nm à 12 µm', 'eopj'],
        ['Fauchée', '3 000 km', 'eopj'],
        ['Résolution', '0,4 km au nadir (bandes fines)', 'eopj'],
        ['Autres instruments', 'CrIS, ATMS, OMPS ; CERES sur NOAA-20', 'n21']
      ]}
    ]
  },
  {
    id:'smap', name:'SMAP (Soil Moisture Active Passive)', short:'SMAP', year:'2015',
    agency:'NASA (JPL), avec l\'Agence spatiale canadienne',
    targets:['Terres émergées', 'Glaces', 'Océans'],
    events:[
      { type:'launch', label:'Lancement', date:'2015-01-31', ref:'wiki' },
      { type:'loss', label:'Panne du radar', date:'2015-07', ref:'eop' }
    ],
    norad:[40376], cospar:'2015-003A',
    file:'models/smap.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « SMAP »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'smap-radiometer', alt:'Carte du monde de l\'humidité du sol mesurée par le radiomètre de SMAP' },
    desc:'SMAP mesure l\'humidité des premiers centimètres du sol et repère les sols gelés. Son radiomètre capte le faible rayonnement micro-onde émis par la Terre, plus faible quand le sol est humide. Une antenne de 6 m, qui tourne sur elle-même, balaie une bande de 1 000 km : toute la Terre en trois jours.',
    checked:'2026-11-24',
    refs:{
      eop:{ t:'SMAP (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/smap' },
      nasa:{ t:'SMAP (page de mission)', p:'NASA', u:'https://science.nasa.gov/mission/smap/' },
      wiki:{ t:'Soil Moisture Active Passive', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Soil_Moisture_Active_Passive' },
      ct:{ t:'Éléments orbitaux GP de SMAP (n° NORAD 40376)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=40376&FORMAT=TLE' }
    },
    parts:[
      { key:'reflector', name:'Antenne de 6 m', desc:'Le grand réflecteur en maille, qui tourne sur lui-même et balaie le sol en cercle de part et d\'autre de la trace. Le radiomètre et le radar (en panne depuis 2015) partagent ce réflecteur.',
        facts:[['Diamètre ≈ 6 m', 'eop'], ['Tache au sol du radiomètre ≈ 40 km', 'eop']] },
      { key:'boom', name:'Bras du réflecteur', desc:'Le bras déployable qui tient le réflecteur au-dessus de la source micro-onde.', facts:[] },
      { key:'solar', name:'Panneau solaire', desc:'Le panneau solaire du satellite.', facts:[['Puissance : 1 450 W', 'wiki']] },
      { key:'bus', name:'Plateforme', desc:'Le corps du satellite, avec l\'électronique des instruments et le mécanisme qui fait tourner l\'antenne.', facts:[['Masse au lancement : 944 kg', 'eop']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '31 janvier 2015, Delta II 7320, base de Vandenberg', 'wiki'],
        ['Masse', '944 kg', 'eop'],
        ['Instruments', 'radiomètre en bande L (1,41 GHz) ; radar en bande L arrêté en juillet 2015 après une panne', 'eop'],
        ['Agences', 'NASA (JPL) ; Agence spatiale canadienne', 'eop']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'héliosynchrone, à l\'aube et au crépuscule', 'eop'],
        ['Altitude', '685 km', 'eop'],
        ['Inclinaison', '98°', 'eop'],
        ['Période', '98,5 minutes', 'eop'],
        ['Passage à l\'équateur', '18 h, heure locale, en montant', 'eop'],
        ['Cycle de répétition', '8 jours ; carte mondiale tous les 3 jours', 'eop']
      ]},
      { title:'Images', rows:[
        ['Fauchée', '1 000 km', 'eop'],
        ['Résolution', '≈ 40 km (tache du radiomètre) ; cartes d\'humidité sur une grille de 9 km', 'eop'],
        ['Profondeur', 'les 2 à 5 premiers centimètres du sol', 'eop']
      ]}
    ]
  },
  {
    id:'oco2', name:'OCO-2 (Orbiting Carbon Observatory 2)', short:'OCO-2', year:'2014',
    agency:'NASA (JPL) ; satellite Orbital Sciences',
    targets:['Atmosphère', 'Terres émergées'],
    events:[
      { type:'launch', label:'Lancement', date:'2014-07-02', ref:'wiki' }
    ],
    norad:[40059], cospar:'2014-035A',
    file:'models/oco2.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « OCO-2 »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.2 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'oco2-co2', alt:'Traces des mesures de dioxyde de carbone d\'OCO-2 sur 16 jours, sur une carte du monde' },
    desc:'OCO-2 mesure le dioxyde de carbone de l\'air. Ses trois spectromètres analysent la lumière du Soleil renvoyée par la Terre : le CO₂ et l\'oxygène en absorbent certaines couleurs. Il en tire la quantité moyenne de CO₂ sur toute la hauteur de l\'atmosphère, sur une bande étroite de 10 km, en petites taches de 1,3 × 2,3 km.',
    checked:'2026-11-24',
    refs:{
      jpl:{ t:'OCO-2 Quick Facts', p:'NASA JPL', u:'https://ocov2.jpl.nasa.gov/mission/quick-facts/' },
      inst:{ t:'OCO-2 Instrument', p:'NASA JPL', u:'https://ocov2.jpl.nasa.gov/observatory/instrument/' },
      eop:{ t:'OCO-2 (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/oco-2' },
      wiki:{ t:'Orbiting Carbon Observatory 2', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Orbiting_Carbon_Observatory_2' },
      ct:{ t:'Éléments orbitaux GP d\'OCO 2 (n° NORAD 40059)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=40059&FORMAT=TLE' }
    },
    parts:[
      { key:'bus', name:'Plateforme et instrument', desc:'Le corps du satellite (plateforme LEOStar-2 d\'Orbital Sciences) et l\'instrument : trois spectromètres à réseau qui partagent un même télescope ; un cryoréfrigérateur garde leurs détecteurs très froids pour réduire le bruit.',
        facts:[['Masse au lancement : 449 kg', 'eop'], ['Détecteurs refroidis par un cryoréfrigérateur', 'inst']] },
      { key:'solar', name:'Panneaux solaires', desc:'Les deux ailes de panneaux solaires.', facts:[['Puissance : 815 W', 'wiki']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '2 juillet 2014, Delta II 7320, base de Vandenberg', 'wiki'],
        ['Masse', '449 kg', 'eop'],
        ['Durée prévue', '2 ans', 'eop'],
        ['Contexte', 'remplace OCO, perdu au lancement en 2009', 'wiki']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'polaire, héliosynchrone ; dans le « train de l\'après-midi » (A-Train)', 'eop'],
        ['Altitude', '705 km', 'eop'],
        ['Inclinaison', '98,2°', 'eop'],
        ['Période', '98,8 minutes', 'eop'],
        ['Passage à l\'équateur', 'vers 13 h 30, heure locale, en montant', 'jpl'],
        ['Cycle de répétition', '16 jours', 'eop']
      ]},
      { title:'Images', rows:[
        ['Bandes', '3 : oxygène (≈ 0,76 µm), CO₂ faible (≈ 1,61 µm), CO₂ fort (≈ 2,06 µm)', 'eop'],
        ['Fauchée', '10 km', 'eop'],
        ['Résolution', '1,29 × 2,25 km par mesure', 'eop']
      ]}
    ]
  },
  {
    id:'gpm', name:'GPM (Global Precipitation Measurement), satellite principal', short:'GPM', year:'2014',
    agency:'NASA et JAXA',
    targets:['Atmosphère', 'Océans'],
    events:[
      { type:'launch', label:'Lancement', date:'2014-02-27', ref:'wiki' }
    ],
    norad:[39574], cospar:'2014-009C',
    file:'models/gpm.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « GPM »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:65 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'gpm-imerg', alt:'Carte du monde des précipitations d\'une journée (produit IMERG)' },
    desc:'Le satellite principal de GPM mesure la pluie et la neige. Son radar à deux fréquences voit la pluie en trois dimensions, gouttes et flocons compris ; son radiomètre micro-onde sert d\'étalon aux autres satellites météorologiques. Ensemble, ils donnent une carte mondiale des précipitations toutes les demi-heures (IMERG).',
    checked:'2026-11-24',
    refs:{
      gpm:{ t:'GPM Core Observatory', p:'NASA', u:'https://gpm.nasa.gov/missions/GPM/core-observatory' },
      mis:{ t:'GPM Mission', p:'NASA', u:'https://gpm.nasa.gov/missions/GPM' },
      eop:{ t:'GPM (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/gpm' },
      wiki:{ t:'Global Precipitation Measurement', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Global_Precipitation_Measurement' },
      ct:{ t:'Éléments orbitaux GP de GPM-CORE (n° NORAD 39574)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=39574&FORMAT=TLE' }
    },
    parts:[
      { key:'gmi', name:'Radiomètre GMI', desc:'L\'antenne du radiomètre micro-onde GMI, au sommet du satellite : elle tourne et balaie un cône vers l\'avant.',
        facts:[['13 canaux, de 10 à 183 GHz', 'mis'], ['Fauchée de 885 km', 'mis']] },
      { key:'bus', name:'Plateforme et radar DPR', desc:'Le corps du satellite, construit au centre Goddard, avec, dessous, les deux antennes plates du radar DPR fourni par la JAXA. La maquette réunit le radar et la plateforme.',
        facts:[['13 × 6,5 × 5 m', 'eop'], ['Masse : ≈ 3 850 kg', 'eop']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '27 février 2014, H-IIA, Tanegashima (Japon)', 'wiki'],
        ['Masse', '≈ 3 850 kg', 'eop'],
        ['Durée prévue', '3 ans ; ergols pour 5 ans', 'eop'],
        ['Agences', 'NASA (satellite, GMI) et JAXA (radar DPR, lancement)', 'eop']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'circulaire, non héliosynchrone (heure de passage variable)', 'eop'],
        ['Altitude', '407 km', 'eop'],
        ['Inclinaison', '65°', 'eop'],
        ['Couverture', 'entre ≈ 65° N et 65° S', 'eop']
      ]},
      { title:'Images', rows:[
        ['Radar DPR', 'bandes Ku (13,6 GHz) et Ka (35,5 GHz) ; fauchée de 245 km pour les deux depuis mai 2018', 'mis'],
        ['Radiomètre GMI', '13 canaux de 10 à 183 GHz ; fauchée de 885 km', 'mis'],
        ['Résolution', '5 km au nadir (DPR)', 'mis']
      ]}
    ]
  },
  {
    id:'nisar', name:'NISAR (NASA-ISRO Synthetic Aperture Radar)', short:'NISAR', year:'2025',
    agency:'NASA (JPL : radar en bande L, réflecteur) et ISRO (radar en bande S, plateforme, lancement)',
    targets:['Terres émergées', 'Glaces'],
    events:[
      { type:'launch', label:'Lancement', date:'2025-07-30', ref:'wiki' }
    ],
    norad:[65053], cospar:'2025-163A',
    file:'models/nisar.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « NISAR »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.4 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'nisar-sar', alt:'Bandes d\'images radar de NISAR en fausses couleurs, superposées sur 12 jours, sur une carte du monde' },
    desc:'NISAR, mission commune de la NASA et de l\'agence spatiale indienne, porte deux radars (bandes L et S) qui partagent un réflecteur de 12 m, déplié au bout d\'un bras de 9 m. Il revoit toutes les terres et les glaces tous les 12 jours et mesure au centimètre près les déformations du sol : séismes, volcans, glissements, glaciers.',
    checked:'2026-11-24',
    refs:{
      jpl:{ t:'NISAR Quick Facts', p:'NASA JPL', u:'https://science.nasa.gov/mission/nisar/mission-overview/' },
      nasa:{ t:'NISAR (page de mission)', p:'NASA', u:'https://science.nasa.gov/mission/nisar/' },
      eop:{ t:'NISAR (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/nisar' },
      wiki:{ t:'NISAR (satellite)', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/NISAR_(satellite)' },
      ct:{ t:'Éléments orbitaux GP de NISAR (n° NORAD 65053)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=65053&FORMAT=TLE' }
    },
    parts:[
      { key:'reflector', name:'Réflecteur de 12 m', desc:'Le grand réflecteur en maille dorée, commun aux deux radars : il éclaire toute la fauchée de 242 km.',
        facts:[['Diamètre : 12 m', 'eop']] },
      { key:'boom', name:'Bras de 9 m', desc:'Le bras déployable qui tient le réflecteur devant les antennes des radars.', facts:[['Longueur : 9 m', 'eop']] },
      { key:'solar', name:'Panneaux solaires', desc:'Les panneaux solaires du satellite.', facts:[['Puissance : 6 500 W', 'wiki']] },
      { key:'bus', name:'Plateforme et radars', desc:'La plateforme I-3K de l\'ISRO et, au-dessus, la structure qui porte l\'électronique et les antennes d\'alimentation des radars en bandes L (NASA) et S (ISRO).',
        facts:[['Plateforme I-3K (ISRO)', 'eop'], ['Masse au lancement : 2 393 kg', 'wiki']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '30 juillet 2025, GSLV-F16, centre spatial Satish Dhawan (Inde)', 'wiki'],
        ['Masse', '2 393 kg', 'wiki'],
        ['Durée prévue', '3 ans ; ergols pour 5 ans', 'eop'],
        ['Agences', 'NASA (JPL) et ISRO', 'eop']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'héliosynchrone, à l\'aube et au crépuscule', 'jpl'],
        ['Altitude', '747 km', 'jpl'],
        ['Inclinaison', '98,4°', 'jpl'],
        ['Cycle de répétition', '12 jours, en montant et en descendant', 'jpl']
      ]},
      { title:'Images', rows:[
        ['Radar L-SAR', 'bande L, 1,25 GHz (24 cm)', 'eop'],
        ['Radar S-SAR', 'bande S, 3,2 GHz', 'eop'],
        ['Fauchée', '242 km', 'eop'],
        ['Résolution', '3 à 10 m selon le mode', 'eop']
      ]}
    ]
  },
  {
    id:'aura', name:'Aura', short:'Aura', year:'2004',
    agency:'NASA, avec les Pays-Bas et la Finlande (OMI) et le Royaume-Uni (HIRDLS)',
    targets:['Atmosphère'],
    events:[
      { type:'launch', label:'Lancement', date:'2004-07-15', ref:'wiki' },
      { type:'loss', label:'Panne de HIRDLS', date:'2008', ref:'eop' }
    ],
    norad:[28376], cospar:'2004-026A',
    file:'models/aura.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « Aura »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:98.2 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'aura-omi', alt:'Carte du monde de la quantité totale d\'ozone mesurée en une journée par OMI' },
    desc:'Aura étudie la chimie de l\'atmosphère : la couche d\'ozone, la pollution de l\'air et le climat. Son spectromètre OMI voit l\'ozone, le dioxyde d\'azote et les aérosols sur une bande de 2 600 km ; MLS mesure l\'ozone et d\'autres gaz couche par couche, en visant le bord de l\'atmosphère. Lancé en 2004, il a dépassé de loin les six ans prévus.',
    checked:'2026-11-24',
    refs:{
      nasa:{ t:'Aura (page de mission)', p:'NASA', u:'https://science.nasa.gov/mission/aura/' },
      eop:{ t:'Aura (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/aura' },
      wiki:{ t:'Aura (satellite)', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Aura_(satellite)' },
      ct:{ t:'Éléments orbitaux GP d\'AURA (n° NORAD 28376)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=28376&FORMAT=TLE' }
    },
    parts:[
      { key:'inst', name:'Instruments', desc:'Les quatre instruments, montés sur la plateforme : MLS (micro-ondes, vers l\'avant), HIRDLS (infrarouge, arrêté en 2008), TES (infrarouge) et OMI (ultraviolet et visible, vers le bas).',
        facts:[['OMI : 270 à 500 nm, fauchée de 2 600 km', 'eop']] },
      { key:'solar', name:'Panneau solaire', desc:'La grande aile de panneaux solaires ; sa production, qui baisse avec l\'âge, devrait limiter la durée de la mission.', facts:[] },
      { key:'bus', name:'Plateforme', desc:'La plateforme modulaire AB1200 de TRW, la même que celle d\'Aqua.', facts:[['Masse : ≈ 3 000 kg', 'eop']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '15 juillet 2004, Delta II 7920, base de Vandenberg', 'wiki'],
        ['Masse', '≈ 3 000 kg', 'eop'],
        ['Durée prévue', '6 ans', 'eop'],
        ['Instruments', 'MLS, OMI, TES ; HIRDLS en panne depuis 2008', 'eop']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'polaire, héliosynchrone ; dans le « train de l\'après-midi » (A-Train)', 'eop'],
        ['Altitude', '705 km', 'eop'],
        ['Inclinaison', '98,2°', 'eop'],
        ['Période', '98,8 minutes', 'eop'],
        ['Passage à l\'équateur', '13 h 45, heure locale, en montant (à l\'origine)', 'eop'],
        ['Cycle de répétition', '16 jours', 'eop']
      ]},
      { title:'Images', rows:[
        ['OMI', 'spectromètre de 270 à 500 nm ; fauchée de 2 600 km', 'eop'],
        ['Résolution', '13 × 24 km au nadir (OMI)', 'eop'],
        ['MLS', 'micro-ondes, visée du bord de l\'atmosphère : profils verticaux de l\'ozone et d\'autres gaz', 'eop']
      ]}
    ]
  },
  {
    id:'tempo', name:'TEMPO (Tropospheric Emissions: Monitoring of Pollution)', short:'TEMPO', year:'2023',
    agency:'NASA (centre Langley) et Smithsonian Astrophysical Observatory ; instrument Ball Aerospace, hébergé par le satellite de télécommunications Intelsat 40e (Maxar)',
    targets:['Atmosphère'],
    events:[
      { type:'launch', label:'Lancement (sur Intelsat 40e)', date:'2023-04-07', ref:'wiki' }
    ],
    norad:[56174], cospar:'2023-052A',
    file:'models/tempo.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « TEMPO »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:0 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'tempo-no2', alt:'Carte de l\'Amérique du Nord du dioxyde d\'azote mesuré par TEMPO en un balayage' },
    desc:'TEMPO est un spectromètre posé sur un satellite de télécommunications, en orbite géostationnaire au-dessus de l\'Amérique du Nord. Il reste face au continent et le balaie toutes les heures, le jour, de Mexico aux sables bitumineux du Canada : ozone, dioxyde d\'azote, formaldéhyde. On voit ainsi la pollution des villes monter et descendre au fil de la journée.',
    checked:'2026-11-24',
    refs:{
      sao:{ t:'TEMPO, Overview', p:'Smithsonian Astrophysical Observatory', u:'https://tempo.si.edu/overview.html' },
      nasa:{ t:'TEMPO (page de mission)', p:'NASA', u:'https://science.nasa.gov/mission/tempo/' },
      eop:{ t:'TEMPO (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/tempo' },
      wiki:{ t:'Tropospheric Emissions: Monitoring of Pollution', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Tropospheric_Emissions:_Monitoring_of_Pollution' },
      is40:{ t:'Intelsat 40e', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Intelsat_40e' },
      ct:{ t:'Éléments orbitaux GP d\'INTELSAT 40E, qui porte TEMPO (n° NORAD 56174)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=56174&FORMAT=TLE' }
    },
    parts:[
      { key:'bus', name:'Satellite hôte et TEMPO', desc:'Le corps du satellite de télécommunications Intelsat 40e (plateforme Maxar), sur la face duquel est fixé l\'instrument TEMPO, tourné vers la Terre. La maquette ne distingue pas l\'instrument.',
        facts:[['Instrument : 1,4 × 1,1 × 1,2 m, 148 kg', 'eop'], ['Satellite hôte : 5 440 kg au lancement', 'is40']] },
      { key:'antenna', name:'Antennes de télécommunications', desc:'Les antennes d\'Intelsat 40e, dont la mission première est de relayer des télécommunications ; elles ne servent pas à TEMPO.', facts:[] },
      { key:'solar', name:'Panneaux solaires', desc:'Les deux ailes de panneaux solaires du satellite hôte.', facts:[] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '7 avril 2023, Falcon 9, Cap Canaveral, à bord d\'Intelsat 40e', 'wiki'],
        ['Instrument', '1,4 × 1,1 × 1,2 m ; 148 kg ; construit par Ball Aerospace', 'eop'],
        ['Responsables', 'Smithsonian Astrophysical Observatory (science, centre d\'opérations) ; NASA Langley (projet)', 'eop'],
        ['Satellite hôte', 'Intelsat 40e, télécommunications, prévu pour 15 ans', 'is40']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'géostationnaire : le satellite reste au-dessus du même point de l\'équateur', 'wiki'],
        ['Altitude', '≈ 35 786 km', 'eop'],
        ['Position', '91° ouest', 'is40']
      ]},
      { title:'Images', rows:[
        ['Spectre', '290 à 490 nm et 540 à 740 nm ; résolution spectrale de 0,57 nm', 'eop'],
        ['Résolution', '2,2 × 5 km au sol (2,21 × 4,97 km au centre de la zone)', 'eop'],
        ['Fréquence', 'un balayage par heure, le jour', 'sao'],
        ['Zone', 'Amérique du Nord, de Mexico aux sables bitumineux du Canada, de l\'Atlantique au Pacifique', 'eop']
      ]}
    ]
  },
  {
    id:'goes', name:'GOES-East (GOES-19)', short:'GOES-East', year:'2024',
    agency:'NOAA (exploitation) et NASA (construction, lancement) ; satellite Lockheed Martin, imageur L3Harris',
    targets:['Atmosphère', 'Océans'],
    events:[
      { type:'launch', label:'Lancement de GOES-U', date:'2024-06-25', ref:'wiki' },
      { type:'orbit', label:'Orbite géostationnaire atteinte, renommé GOES-19', date:'2024-07-07', ref:'eop' },
      { type:'note', label:'Mis en service comme GOES-East', date:'2025-04-07', ref:'wiki' }
    ],
    norad:[60133], cospar:'2024-119A',
    file:null, bytes:0, unit:1,
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:0 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'goes-abi', alt:'Le disque de la Terre vu par GOES-East, des Amériques à l\'Afrique de l\'Ouest (image GeoColor)' },
    desc:'GOES-19 est le satellite météorologique géostationnaire américain qui surveille l\'est des Amériques et l\'Atlantique, sous le nom de GOES-East. Son imageur ABI photographie tout le disque de la Terre toutes les dix minutes en 16 bandes, et certaines zones toutes les minutes : orages, ouragans, incendies, brouillard. Son détecteur GLM compte les éclairs.',
    checked:'2026-11-24',
    refs:{
      noaa:{ t:'Geostationary satellites', p:'NOAA NESDIS', u:'https://www.nesdis.noaa.gov/our-satellites/currently-flying/geostationary-satellites' },
      abi:{ t:'Advanced Baseline Imager (ABI)', p:'NOAA NESDIS', u:'https://www.nesdis.noaa.gov/our-satellites/currently-flying/goes-east-west/advanced-baseline-imager-abi' },
      eop:{ t:'GOES-R series (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/goes-r' },
      wiki:{ t:'GOES-19', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/GOES-19' },
      ct:{ t:'Éléments orbitaux GP de GOES 19 (n° NORAD 60133)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?CATNR=60133&FORMAT=TLE' }
    },
    parts:[],
    sections:[
      { title:'Mission', rows:[
        ['Lancement', '25 juin 2024, Falcon Heavy, centre spatial Kennedy (Floride)', 'wiki'],
        ['Mise en service', '7 avril 2025, comme GOES-East', 'wiki'],
        ['Série', 'dernier des quatre satellites GOES-R (GOES-16 à 19)', 'eop'],
        ['Constructeur', 'Lockheed Martin', 'eop']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'géostationnaire', 'wiki'],
        ['Altitude', '≈ 35 786 km', 'eop'],
        ['Position', '75,2° ouest', 'wiki']
      ]},
      { title:'Images', rows:[
        ['Imageur ABI', '16 bandes : 2 visibles, 4 du proche infrarouge, 10 infrarouges', 'abi'],
        ['Résolution', '0,5 km (visible), 1 km (proche infrarouge), 2 km (infrarouge)', 'eop'],
        ['Fréquence', 'disque entier toutes les 10 min ; États-Unis toutes les 5 min ; petites zones toutes les 30 à 60 s', 'abi'],
        ['Éclairs', 'détecteur GLM, qui cartographie les éclairs en continu', 'noaa']
      ]}
    ]
  },
  {
    id:'sentinel6', name:'Sentinel-6 Michael Freilich et Sentinel-6B', short:'Sentinel-6', year:'2020',
    agency:'Union européenne (Copernicus), ESA, EUMETSAT, NASA, NOAA, avec le CNES ; satellites Airbus',
    targets:['Océans'],
    events:[
      { type:'launch', label:'Lancement de Sentinel-6 Michael Freilich', date:'2020-11-21', ref:'esa' },
      { type:'add', label:'Lancement de Sentinel-6B', date:'2025-11-17', ref:'esa' }
    ],
    norad:[46984, 66514], cospar:'2020-086A, 2025-264A',
    file:'models/sentinel6.glb', bytes:0, unit:1,
    model:{ src:'NASA Eyes on the Earth, « Sentinel-6 Michael Freilich »', license:'NASA/JPL-Caltech, usage libre (règles d\'usage des médias de la NASA, qui couvrent les maquettes 3D)', u:'https://eyes.nasa.gov/apps/earth/' },
    body:{ name:'Terre', tex:'earth', nadir:[0, -1, 0], inc:66 },
    view:{ az:0.7, el:0.3, dist:1.5 }, sun:[0.5, 0.8, 0.4],
    real:{ key:'sentinel6-poseidon', alt:'Carte du monde de l\'écart de hauteur de la mer mesuré par Sentinel-6 Michael Freilich' },
    desc:'Les Sentinel-6 sont les altimètres de référence pour le niveau des océans : ils prolongent la série de mesures commencée en 1992 avec TOPEX/Poseidon, puis les Jason. Leur radar Poseidon-4 mesure la hauteur de la mer à la verticale du satellite ; en dix jours, ils couvrent 95 % des océans. Sentinel-6B a été lancé en novembre 2025.',
    checked:'2026-11-24',
    refs:{
      esa:{ t:'Sentinel-6', p:'ESA', u:'https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-6' },
      eum:{ t:'Sentinel-6', p:'EUMETSAT', u:'https://www.eumetsat.int/sentinel-6' },
      eop:{ t:'Copernicus: Sentinel-6 (eoPortal)', p:'ESA eoPortal', u:'https://www.eoportal.org/satellite-missions/sentinel-6' },
      wiki:{ t:'Sentinel-6 Michael Freilich', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Sentinel-6_Michael_Freilich' },
      wikib:{ t:'Sentinel-6B', p:'Wikipedia', u:'https://en.wikipedia.org/wiki/Sentinel-6B' },
      ct:{ t:'Éléments orbitaux GP de SENTINEL-6A et -6B (n° NORAD 46984, 66514)', p:'CelesTrak', u:'https://celestrak.org/NORAD/elements/gp.php?NAME=SENTINEL-6&FORMAT=TLE' }
    },
    parts:[
      { key:'poseidon', name:'Altimètre Poseidon-4', desc:'L\'antenne de l\'altimètre radar, tournée vers la Terre : elle envoie des impulsions radar à la verticale et chronomètre leur écho sur la mer.', facts:[] },
      { key:'amr', name:'Radiomètre AMR-C', desc:'Le radiomètre micro-onde, fourni par la NASA : il mesure la vapeur d\'eau de l\'air, qui ralentit les ondes radar, pour corriger la hauteur mesurée.', facts:[] },
      { key:'doris', name:'Antenne DORIS', desc:'Le récepteur du système français DORIS, qui situe le satellite au centimètre près grâce à un réseau de balises au sol.', facts:[] },
      { key:'gnss', name:'Antennes GNSS', desc:'Les antennes des récepteurs de navigation par satellite (GNSS), pour l\'orbite précise (POD) et la radio-occultation (profils de température de l\'atmosphère).', facts:[] },
      { key:'lra', name:'Réflecteur laser', desc:'Le rétroréflecteur, visé depuis le sol par des stations laser pour vérifier l\'orbite.', facts:[] },
      { key:'solar', name:'Panneaux solaires', desc:'Les panneaux solaires du satellite.', facts:[['Puissance : 891 W', 'wiki']] },
      { key:'bus', name:'Plateforme', desc:'La plateforme, construite par Airbus, au toit en pente.', facts:[['Masse : 1 192 kg', 'wiki'], ['5,13 × 4,17 × 2,34 m', 'wikib']] }
    ],
    sections:[
      { title:'Mission', rows:[
        ['Lancements', 'Sentinel-6 Michael Freilich : 21 novembre 2020 ; Sentinel-6B : 17 novembre 2025 ; Falcon 9, base de Vandenberg', 'esa'],
        ['Masse', '1 192 kg', 'wiki'],
        ['Durée prévue', '5 ans et demi par satellite', 'wiki'],
        ['Rôle', 'mission de référence de l\'altimétrie, à la suite de Jason-3', 'eum']
      ]},
      { title:'Orbite', rows:[
        ['Type', 'non héliosynchrone', 'wiki'],
        ['Altitude', '1 336 km', 'esa'],
        ['Inclinaison', '66°', 'esa'],
        ['Cycle de répétition', '≈ 10 jours', 'wiki']
      ]},
      { title:'Images', rows:[
        ['Altimètre', 'radar Poseidon-4, à la verticale du satellite', 'esa'],
        ['Couverture', '95 % des océans', 'esa'],
        ['Autres instruments', 'radiomètre AMR-C, DORIS, GNSS, réflecteur laser, radio-occultation GNSS', 'wiki']
      ]}
    ]
  }
];
