/* =================================================================
   INSTRUMENTS — page « Mission et instruments » de chaque satellite (schéma de SolarExplorers, src/data-inst.js).
   Chaque texte est donné en français et en anglais : L(fr, en).
   INST_DATA[id] = { summary, refs:{clé:{t,p,u}}, archives:[{label, desc, url}], instruments:[{
       id, name, full, type (INST_TYPES), use, summary, bands:[{l, lo, hi}] (µm), specs:[[libellé, valeur, clé(s) de source]],
       docs:[{l, u}] }] } ; les collections de chaque instrument sont dans tools/data/catalog.py (relevé : data/cat.json)
   Les clés de source renvoient aux refs du satellite (data-missions.js) ou à celles d'ici. Règle 1 : chaque valeur chiffrée cite sa source.
   Faits relevés par tools/probe/probe_facts.py (24 novembre 2026).
================================================================= */
function L(fr, en){ return OBS_LANG === 'en' ? en : fr; }
var INST_TYPES = {
  cam:   { c:'#2F6FE4', l:L('Imageur', 'Imager') },
  therm: { c:'#C2452D', l:L('Imageur thermique', 'Thermal imager') },
  spec:  { c:'#C0398A', l:L('Spectromètre', 'Spectrometer') },
  radar: { c:'#B86A00', l:L('Radar', 'Radar') },
  alt:   { c:'#0F8A7A', l:L('Altimètre', 'Altimeter') },
  rad:   { c:'#8A5A00', l:L('Radiomètre', 'Radiometer') },
  grav:  { c:'#5B6770', l:L('Gravimétrie', 'Gravimetry') }
};
var USGS_EE = { label:'USGS EarthExplorer', desc:L('Archive Landsat de l\'USGS : recherche et téléchargement des scènes (compte gratuit)', 'USGS Landsat archive: scene search and download (free account)'), url:'https://earthexplorer.usgs.gov/' };
var LP_DAAC = { label:'NASA LP DAAC', desc:L('Archive des produits terrestres de la NASA (HLS, MODIS, ASTER)', 'NASA archive of land products (HLS, MODIS, ASTER)'), url:'https://www.earthdata.nasa.gov/centers/lp-daac' };
var EARTHDATA = { label:'NASA Earthdata Search', desc:L('Recherche dans toutes les archives de la NASA (catalogue CMR)', 'Search across all NASA archives (CMR catalogue)'), url:'https://search.earthdata.nasa.gov/' };

var INST_DATA = {
landsat9:{
  summary:L('Deux instruments qui regardent ensemble la même bande de 185 km : la caméra OLI-2 (neuf bandes, du bleu à l\'infrarouge moyen) et le capteur thermique TIRS-2 (deux bandes vers 11 µm). Ce sont des copies améliorées de ceux de Landsat 8 : codage sur 14 bits pour OLI-2, lumière parasite réduite et durée de vie allongée pour TIRS-2.',
            'Two instruments that look together at the same 185 km strip: the OLI-2 camera (nine bands, from blue to mid-infrared) and the TIRS-2 thermal sensor (two bands near 11 µm). They are improved copies of Landsat 8\'s: 14-bit coding for OLI-2, less stray light and a longer life for TIRS-2.'),
  refs:{},
  archives:[USGS_EE, LP_DAAC, EARTHDATA, { label:'Earth Search (Element 84)', desc:L('Catalogue STAC des données Landsat et Sentinel-2 sur AWS', 'STAC catalogue of Landsat and Sentinel-2 data on AWS'), url:'https://earth-search.aws.element84.com/v1' }],
  instruments:[
    { id:'oli2', name:'OLI-2', full:'Operational Land Imager 2', type:'cam',
      use:L('Photographier toutes les terres émergées en neuf bandes, pour suivre les cultures, les forêts, les villes, l\'eau et la neige.', 'Photograph all land surfaces in nine bands, to follow crops, forests, cities, water and snow.'),
      summary:L('Imageur « à balai-brosse » (pushbroom) : de longues barrettes de détecteurs couvrent toute la largeur de la fauchée d\'un coup, sans miroir tournant. Plus de 7 000 détecteurs par bande, 13 000 pour la bande panchromatique, répartis en 14 modules. Construit par Ball Aerospace.',
                'A pushbroom imager: long detector arrays cover the whole swath width at once, with no scanning mirror. Over 7,000 detectors per band, 13,000 for the panchromatic band, spread over 14 modules. Built by Ball Aerospace.'),
      bands:[{ l:L('1 côtière', '1 coastal'), lo:0.43, hi:0.45 }, { l:L('2 bleu', '2 blue'), lo:0.45, hi:0.51 }, { l:L('3 vert', '3 green'), lo:0.53, hi:0.59 }, { l:L('4 rouge', '4 red'), lo:0.64, hi:0.67 },
             { l:L('5 proche IR', '5 near IR'), lo:0.85, hi:0.88 }, { l:'6 SWIR 1', lo:1.57, hi:1.65 }, { l:'7 SWIR 2', lo:2.11, hi:2.29 }, { l:L('8 panchromatique', '8 panchromatic'), lo:0.50, hi:0.68 }, { l:L('9 cirrus', '9 cirrus'), lo:1.36, hi:1.38 }],
      specs:[[L('Bandes', 'Bands'), L('9, de 0,43 à 2,29 µm', '9, from 0.43 to 2.29 µm'), 'bands'], [L('Pixel au sol', 'Ground pixel'), L('30 m ; 15 m en panchromatique', '30 m; 15 m panchromatic'), 'bands'],
        [L('Fauchée', 'Swath'), L('185 km (champ de 15°)', '185 km (15° field of view)'), 'eop'], [L('Détecteurs', 'Detectors'), L('plus de 7 000 par bande (13 000 en panchromatique), en 14 modules', 'over 7,000 per band (13,000 panchromatic), in 14 modules'), 'eop'],
        [L('Codage', 'Quantization'), L('14 bits (12 bits sur Landsat 8)', '14 bits (12 bits on Landsat 8)'), 'usgs'], [L('Construction', 'Built by'), 'Ball Aerospace', 'oli']],
      docs:[{ l:L('OLI (NASA)', 'OLI (NASA)'), u:'https://science.nasa.gov/mission/landsat/oli/' }] },
    { id:'tirs2', name:'TIRS-2', full:'Thermal Infrared Sensor 2', type:'therm',
      use:L('Mesurer la température de la surface : îlots de chaleur des villes, irrigation et évaporation des cultures, volcans, glaciers.', 'Measure surface temperature: urban heat islands, crop irrigation and evaporation, volcanoes, glaciers.'),
      summary:L('Imageur thermique à barrettes, lui aussi « à balai-brosse ». Ses détecteurs QWIP, refroidis à 43 K par une machine cryogénique, voient deux bandes vers 11 µm, ce qui permet de séparer la température du sol de celle de l\'atmosphère. Version renforcée de TIRS (Landsat 8) : durée de vie de 5 ans au lieu de 3, lumière parasite réduite.',
                'A pushbroom thermal imager too. Its QWIP detectors, cooled to 43 K by a cryocooler, see two bands near 11 µm, which lets the ground temperature be separated from the atmosphere\'s. A hardened version of TIRS (Landsat 8): 5-year design life instead of 3, less stray light.'),
      bands:[{ l:'10 TIR 1', lo:10.6, hi:11.19 }, { l:'11 TIR 2', lo:11.5, hi:12.51 }],
      specs:[[L('Bandes', 'Bands'), L('2 : 10,6 – 11,19 µm et 11,50 – 12,51 µm', '2: 10.6 – 11.19 µm and 11.50 – 12.51 µm'), 'bands'], [L('Pixel au sol', 'Ground pixel'), L('100 m (rééchantillonné à 30 m)', '100 m (resampled to 30 m)'), 'bands'],
        [L('Fauchée', 'Swath'), L('185 km (champ de 15°)', '185 km (15° field of view)'), 'tirs'], [L('Détecteurs', 'Detectors'), L('3 barrettes QWIP de 640 détecteurs, soit 1 850 pixels utiles', '3 QWIP arrays of 640 detectors, 1,850 effective pixels'), 'tirs'],
        [L('Refroidissement', 'Cooling'), L('détecteurs à 43 K, télescope à 185 K', 'detectors at 43 K, telescope at 185 K'), 'tirs'], [L('Durée de vie prévue', 'Design life'), L('5 ans', '5 years'), 'usgs'],
        [L('Optique', 'Optics'), L('télescope à quatre lentilles, f/1,64', 'four-element refractive telescope, f/1.64'), 'tirs']],
      docs:[{ l:L('TIRS (NASA)', 'TIRS (NASA)'), u:'https://science.nasa.gov/mission/landsat/tirs/' }] }
  ]
}
};
