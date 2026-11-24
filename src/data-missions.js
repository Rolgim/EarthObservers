/* =================================================================
   SATELLITES — registre (équivalent de TELESCOPES dans Observatories et de MISSIONS dans SolarExplorers ; le nom MISSIONS est gardé
   pour réutiliser le code). Ajouter un satellite = une entrée ici (et ses textes dans data-inst, data-mission, data-cat, en/*) ;
   app.js n'a pas à changer. build.js, tools/pages.js et tools/data/fetch_tle.py lisent ce registre (une ligne « id:'…' » par satellite,
   indentée de 4 espaces).
     id, name, short, year      identifiant (ancre #id), nom complet, nom court, année de lancement
     agency                     agences, en texte (règle 5 : aucune n'est mise en avant)
     targets                    thèmes observés, du plus important au moins important ('Terres émergées', 'Océans', 'Glaces', 'Atmosphère', 'Gravité')
     events                     [{ type:'launch'|'orbit'|'end', body, date:'AAAA-MM-JJ', ref }] : étapes datées
     norad, cospar              numéros du catalogue (NORAD, COSPAR) ; norad sert à télécharger les éléments orbitaux (CelesTrak)
     file, bytes, unit          maquette (models/<id>.glb) ; unit : mètres par unité de la maquette
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
];
