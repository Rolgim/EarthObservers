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
  grav:  { c:'#5B6770', l:L('Gravimétrie', 'Gravimetry') },
  pol:   { c:'#5B4BB7', l:L('Polarimètre', 'Polarimeter') }
};
var USGS_EE = { label:'USGS EarthExplorer', desc:L('Archive Landsat de l\'USGS : recherche et téléchargement des scènes (compte gratuit)', 'USGS Landsat archive: scene search and download (free account)'), url:'https://earthexplorer.usgs.gov/' };
var LP_DAAC = { label:'NASA LP DAAC', desc:L('Archive des produits terrestres de la NASA (HLS, MODIS, ASTER)', 'NASA archive of land products (HLS, MODIS, ASTER)'), url:'https://www.earthdata.nasa.gov/centers/lp-daac' };
var EARTHDATA = { label:'NASA Earthdata Search', desc:L('Recherche dans toutes les archives de la NASA (catalogue CMR)', 'Search across all NASA archives (CMR catalogue)'), url:'https://search.earthdata.nasa.gov/' };

var CDSE = { label:'Copernicus Data Space Ecosystem', desc:L('Archive officielle des données Sentinel : recherche, visualisation, téléchargement (compte gratuit)', 'Official Sentinel data archive: search, viewing, download (free account)'), url:'https://dataspace.copernicus.eu/' };
var PCOMP = { label:'Microsoft Planetary Computer', desc:L('Catalogue STAC public des données Sentinel, Landsat et MODIS, avec aperçus', 'Public STAC catalogue of Sentinel, Landsat and MODIS data, with previews'), url:'https://planetarycomputer.microsoft.com/catalog' };
var ESEARCH = { label:'Earth Search (Element 84)', desc:L('Catalogue STAC des données Landsat et Sentinel sur AWS', 'STAC catalogue of Landsat and Sentinel data on AWS'), url:'https://earth-search.aws.element84.com/v1' };
var WORLDVIEW = { label:'NASA Worldview', desc:L('Images quotidiennes de MODIS et de nombreux autres produits, à explorer dans le navigateur', 'Daily MODIS imagery and many other products, to explore in the browser'), url:'https://worldview.earthdata.nasa.gov/' };
var NSIDC = { label:'NSIDC DAAC', desc:L('Archive de la NASA pour la neige et les glaces (produits ICESat-2)', 'NASA archive for snow and ice (ICESat-2 products)'), url:'https://nsidc.org/data/icesat-2' };
var PODAAC = { label:'NASA PO.DAAC', desc:L('Archive océanographique de la NASA (SWOT, GRACE-FO) ; compte Earthdata pour télécharger', 'NASA oceanography archive (SWOT, GRACE-FO); Earthdata account to download'), url:'https://podaac.jpl.nasa.gov/' };
var GESDISC = { label:'NASA GES DISC', desc:L('Archive de la NASA pour l\'atmosphère (AIRS)', 'NASA archive for the atmosphere (AIRS)'), url:'https://disc.gsfc.nasa.gov/' };
var AVISO = { label:'AVISO+ (CNES)', desc:L('Distribution des données d\'altimétrie du CNES, dont SWOT', 'CNES altimetry data distribution, including SWOT'), url:'https://www.aviso.altimetry.fr/' };
var ISDC = { label:'GFZ ISDC', desc:L('Centre de données du GFZ (produits GRACE-FO)', 'GFZ data centre (GRACE-FO products)'), url:'https://isdc.gfz-potsdam.de/' };

var OBDAAC = { label:'NASA OB.DAAC', desc:L('Archive de la NASA pour la couleur de l\'océan (PACE) ; compte Earthdata pour télécharger', 'NASA ocean colour archive (PACE); Earthdata account to download'), url:'https://oceancolor.gsfc.nasa.gov/' };
var LAADS = { label:'NASA LAADS DAAC', desc:L('Archive de la NASA pour les produits VIIRS et MODIS de l\'atmosphère', 'NASA archive for VIIRS and MODIS atmosphere products'), url:'https://ladsweb.modaps.eosdis.nasa.gov/' };
var NSIDC_SMAP = { label:'NSIDC DAAC (SMAP)', desc:L('Archive de la NASA pour les produits d\'humidité du sol de SMAP', 'NASA archive for SMAP soil moisture products'), url:'https://nsidc.org/data/smap' };
var GPMPPS = { label:'GPM Data Directory', desc:L('Les produits de GPM (radar, radiomètre, IMERG) et leurs archives', 'GPM products (radar, radiometer, IMERG) and their archives'), url:'https://gpm.nasa.gov/data/directory' };
var ASF = { label:'ASF DAAC', desc:L('Archive radar de la NASA (Alaska Satellite Facility), dont NISAR ; compte Earthdata pour télécharger', 'NASA radar archive (Alaska Satellite Facility), including NISAR; Earthdata account to download'), url:'https://asf.alaska.edu/' };
var ASDC = { label:'NASA ASDC', desc:L('Archive de la NASA (centre Langley) pour TEMPO', 'NASA archive (Langley center) for TEMPO'), url:'https://www.earthdata.nasa.gov/centers/asdc-daac' };
var NOAA_AWS = { label:'NOAA Open Data (AWS)', desc:L('Images GOES brutes et produits ABI en accès libre, sans compte', 'Raw GOES imagery and ABI products in open access, no account'), url:'https://registry.opendata.aws/noaa-goes/' };
var EUMDS = { label:'EUMETSAT Data Store', desc:L('Archive des produits Sentinel-6 d\'EUMETSAT (compte gratuit)', 'EUMETSAT archive of Sentinel-6 products (free account)'), url:'https://data.eumetsat.int/' };
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
},
sentinel1:{
  summary:L('Un seul instrument : un radar à synthèse d\'ouverture en bande C, qui envoie ses propres ondes et n\'a donc besoin ni de Soleil ni de ciel dégagé. Sentinel-1C et -1D portent aussi un récepteur AIS, qui capte les signaux d\'identification des navires.',
            'A single instrument: a C-band synthetic aperture radar, which sends its own waves and so needs neither sunlight nor clear skies. Sentinel-1C and -1D also carry an AIS receiver, which picks up ship identification signals.'),
  refs:{}, archives:[CDSE, PCOMP, ESEARCH],
  instruments:[
    { id:'csar', name:'C-SAR', full:'C-band Synthetic Aperture Radar', type:'radar',
      use:L('Voir le sol et la mer de jour comme de nuit, à travers les nuages : glaces, marées noires, vagues et vent, inondations, mouvements du sol au centimètre près (interférométrie).', 'See land and sea day and night, through clouds: ice, oil spills, waves and wind, floods, ground motion to the centimetre (interferometry).'),
      summary:L('Radar à synthèse d\'ouverture : une antenne de 12 m envoie des impulsions de côté, et le traitement combine les échos reçus le long de la trajectoire comme si l\'antenne était beaucoup plus longue. Quatre modes, du plus fin (5 × 5 m) au plus large (400 km).',
                'Synthetic aperture radar: a 12 m antenna sends pulses sideways, and processing combines the echoes received along the track as if the antenna were much longer. Four modes, from the finest (5 × 5 m) to the widest (400 km).'),
      specs:[[L('Fréquence', 'Frequency'), L('5,405 GHz (bande C)', '5.405 GHz (C band)'), 'esa'], [L('Antenne', 'Antenna'), L('12 m de long', '12 m long'), 'esa'],
        [L('Fauchée', 'Swath'), L('250 km (mode IW) ; 80 à 400 km selon le mode', '250 km (IW mode); 80 to 400 km depending on mode'), 'esa'], [L('Pixel au sol', 'Ground pixel'), L('5 × 20 m (mode IW) ; 5 × 5 m (Stripmap, Wave)', '5 × 20 m (IW mode); 5 × 5 m (Stripmap, Wave)'), 'esa'],
        [L('Construction', 'Built by'), 'Airbus Defence and Space', 'esa']],
      docs:[{ l:L('Mission Sentinel-1 (SentiWiki)', 'Sentinel-1 mission (SentiWiki)'), u:'https://sentiwiki.copernicus.eu/web/s1-mission' }] }
  ]
},
sentinel2:{
  summary:L('Un seul instrument, la caméra multispectrale MSI : treize bandes du bleu à l\'infrarouge court, dont trois bandes « limite du rouge » très utiles pour l\'état de la végétation.',
            'A single instrument, the MSI multispectral camera: thirteen bands from blue to short-wave infrared, including three "red edge" bands that are very useful for vegetation health.'),
  refs:{}, archives:[CDSE, PCOMP, ESEARCH],
  instruments:[
    { id:'msi', name:'MSI', full:'MultiSpectral Instrument', type:'cam',
      use:L('Suivre les cultures, les forêts, les sols, les villes, les eaux côtières et intérieures, et cartographier les catastrophes.', 'Follow crops, forests, soils, cities, coastal and inland waters, and map disasters.'),
      summary:L('Imageur « à balai-brosse » : des barrettes de détecteurs couvrent les 290 km de la fauchée d\'un coup. Les limites des bandes ci-dessous sont calculées par ce site (longueur d\'onde centrale ± demi-largeur publiées pour Sentinel-2A) : ≈.',
                'Pushbroom imager: detector arrays cover the whole 290 km swath at once. The band limits below are computed by this site (published central wavelength ± half width for Sentinel-2A): ≈.'),
      bands:[{ l:L('1 côtière','1 coastal'), lo:0.4322, hi:0.4532 }, { l:L('2 bleu','2 blue'), lo:0.4602, hi:0.5252 }, { l:L('3 vert','3 green'), lo:0.5424, hi:0.5774 }, { l:L('4 rouge','4 red'), lo:0.6491, hi:0.6801 }, { l:L('5 limite du rouge','5 red edge'), lo:0.6966, hi:0.7116 }, { l:L('6 limite du rouge','6 red edge'), lo:0.7340, hi:0.7470 }, { l:L('7 limite du rouge','7 red edge'), lo:0.7733, hi:0.7923 }, { l:L('8 proche IR','8 near IR'), lo:0.7738, hi:0.8918 }, { l:L('8a proche IR étroit','8a narrow near IR'), lo:0.8547, hi:0.8747 }, { l:L('9 vapeur d\'eau','9 water vapour'), lo:0.9351, hi:0.9551 }, { l:L('10 cirrus','10 cirrus'), lo:1.3590, hi:1.3880 }, { l:'11 SWIR', lo:1.5692, hi:1.6582 }, { l:'12 SWIR', lo:2.1124, hi:2.2924 }],
      specs:[[L('Bandes', 'Bands'), L('13, de 443 à 2 190 nm', '13, from 443 to 2,190 nm'), 'esa'], [L('Pixel au sol', 'Ground pixel'), L('10 m (4 bandes), 20 m (6), 60 m (3)', '10 m (4 bands), 20 m (6), 60 m (3)'), 'esa'],
        [L('Fauchée', 'Swath'), '290 km', 'esa'], [L('Bandes de Sentinel-2A', 'Sentinel-2A bands'), L('centres et largeurs publiés bande par bande', 'centres and widths published band by band'), 'wiki'], [L('Construction', 'Built by'), 'Airbus Defence and Space (France)', 'esa']],
      docs:[{ l:L('Mission Sentinel-2 (SentiWiki)', 'Sentinel-2 mission (SentiWiki)'), u:'https://sentiwiki.copernicus.eu/web/s2-mission' }] }
  ]
},
sentinel3:{
  summary:L('Trois instruments principaux qui regardent ensemble : la caméra OLCI (couleur de l\'eau et des terres), le radiomètre SLSTR (température de surface, feux) et l\'altimètre SRAL (hauteur de la mer, des lacs, des glaces), aidé d\'un radiomètre micro-onde (MWR) qui corrige l\'effet de la vapeur d\'eau.',
            'Three main instruments looking together: the OLCI camera (colour of water and land), the SLSTR radiometer (surface temperature, fires) and the SRAL altimeter (height of sea, lakes and ice), helped by a microwave radiometer (MWR) that corrects for water vapour.'),
  refs:{}, archives:[CDSE, PCOMP],
  instruments:[
    { id:'olci', name:'OLCI', full:'Ocean and Land Colour Instrument', type:'spec',
      use:L('Mesurer la couleur de la mer (plancton, sédiments, qualité de l\'eau) et l\'état de la végétation.', 'Measure ocean colour (plankton, sediments, water quality) and vegetation health.'),
      summary:L('Spectromètre imageur « à balai-brosse » à cinq caméras, héritier de MERIS (Envisat). Les limites des bandes ci-dessous sont calculées par ce site (centre ± demi-largeur publiés) : ≈.',
                'Five-camera pushbroom imaging spectrometer, heir to MERIS (Envisat). The band limits below are computed by this site (published centre ± half width): ≈.'),
      bands:[{ l:'Oa1', lo:0.39250, hi:0.40750 }, { l:'Oa2', lo:0.40750, hi:0.41750 }, { l:'Oa3', lo:0.43750, hi:0.44750 }, { l:'Oa4', lo:0.48500, hi:0.49500 }, { l:'Oa5', lo:0.50500, hi:0.51500 }, { l:'Oa6', lo:0.55500, hi:0.56500 }, { l:'Oa7', lo:0.61500, hi:0.62500 }, { l:'Oa8', lo:0.66000, hi:0.67000 }, { l:'Oa9', lo:0.66950, hi:0.67700 }, { l:'Oa10', lo:0.67750, hi:0.68500 }, { l:'Oa11', lo:0.70375, hi:0.71375 }, { l:'Oa12', lo:0.75000, hi:0.75750 }, { l:'Oa13', lo:0.76000, hi:0.76250 }, { l:'Oa14', lo:0.76250, hi:0.76625 }, { l:'Oa15', lo:0.76625, hi:0.76875 }, { l:'Oa16', lo:0.77125, hi:0.78625 }, { l:'Oa17', lo:0.85500, hi:0.87500 }, { l:'Oa18', lo:0.88000, hi:0.89000 }, { l:'Oa19', lo:0.89500, hi:0.90500 }, { l:'Oa20', lo:0.93000, hi:0.95000 }, { l:'Oa21', lo:1.00000, hi:1.04000 }],
      specs:[[L('Bandes', 'Bands'), L('21, de 400 à 1 020 nm', '21, from 400 to 1,020 nm'), 'esa'], [L('Pixel au sol', 'Ground pixel'), '300 m', 'olci'], [L('Fauchée', 'Swath'), '1 270 km', 'esa'],
        [L('Masse', 'Mass'), '153 kg', 'olci'], [L('Durée de vie prévue', 'Design life'), L('7,5 ans', '7.5 years'), 'olci']],
      docs:[{ l:L('OLCI (SentiWiki)', 'OLCI (SentiWiki)'), u:'https://sentiwiki.copernicus.eu/web/s3-olci-instrument' }] },
    { id:'slstr', name:'SLSTR', full:'Sea and Land Surface Temperature Radiometer', type:'therm',
      use:L('Mesurer la température de la mer et des terres au dixième de degré, repérer les feux.', 'Measure sea and land temperature to a tenth of a degree, spot fires.'),
      summary:L('Radiomètre à balayage qui regarde chaque lieu deux fois, à la verticale puis en oblique, pour corriger l\'effet de l\'atmosphère. Seules les longueurs d\'onde centrales des bandes sont publiées : sur la figure, chaque bande est un trait à son centre.',
                'Scanning radiometer that looks at each place twice, straight down then at a slant, to correct for the atmosphere. Only the central wavelengths of the bands are published: in the figure, each band is a line at its centre.'),
      bands:[{ l:'S1', lo:0.554, hi:0.554 }, { l:'S2', lo:0.659, hi:0.659 }, { l:'S3', lo:0.868, hi:0.868 }, { l:'S4', lo:1.374, hi:1.374 }, { l:'S5', lo:1.613, hi:1.613 }, { l:'S6', lo:2.25, hi:2.25 }, { l:'S7', lo:3.742, hi:3.742 }, { l:'S8', lo:10.85, hi:10.85 }, { l:'S9', lo:12.02, hi:12.02 }],
      specs:[[L('Bandes', 'Bands'), L('9, de 0,554 à 12,02 µm (centres), plus 2 bandes « feux »', '9 (centres from 0.554 to 12.02 µm) and 2 "fire" bands'), 'slstr'], [L('Pixel au sol', 'Ground pixel'), L('0,5 km (visible, infrarouge court) ; 1 km (infrarouge thermique)', '0.5 km (visible, short-wave IR); 1 km (thermal IR)'), 'slstr'],
        [L('Fauchée', 'Swath'), L('1 400 km (verticale) ; 740 km (oblique)', '1,400 km (nadir); 740 km (oblique)'), 'esa'], [L('Sensibilité', 'Sensitivity'), L('< 50 mK (infrarouge thermique, à 270 K)', '< 50 mK (thermal IR, at 270 K)'), 'slstr'], [L('Construction', 'Built by'), 'Leonardo', 'esa']],
      docs:[{ l:L('SLSTR (SentiWiki)', 'SLSTR (SentiWiki)'), u:'https://sentiwiki.copernicus.eu/web/s3-slstr-instrument' }] },
    { id:'sral', name:'SRAL', full:'SAR Radar Altimeter', type:'alt',
      use:L('Mesurer la hauteur de la mer, des lacs, des fleuves et des glaces à la verticale du satellite.', 'Measure the height of sea, lakes, rivers and ice straight below the satellite.'),
      summary:L('Altimètre radar à deux fréquences (bandes Ku et C) : il mesure le temps d\'aller-retour d\'impulsions envoyées vers le bas. Le traitement SAR affine la tache au sol à 300 m le long de la trace.',
                'Dual-frequency radar altimeter (Ku and C bands): it measures the round-trip time of pulses sent downwards. SAR processing narrows the footprint to 300 m along the track.'),
      specs:[[L('Fréquences', 'Frequencies'), L('bandes Ku et C', 'Ku and C bands'), 'esa'], [L('Pixel au sol', 'Ground pixel'), L('300 m le long de la trace (après traitement SAR)', '300 m along track (after SAR processing)'), 'esa'],
        [L('Écart entre traces', 'Track spacing'), L('47 km à l\'équateur après 27 jours (deux satellites)', '47 km at the equator after 27 days (two satellites)'), 'esa'], [L('Construction', 'Built by'), 'Thales Alenia Space', 'esa']],
      docs:[{ l:L('Mission Sentinel-3 (SentiWiki)', 'Sentinel-3 mission (SentiWiki)'), u:'https://sentiwiki.copernicus.eu/web/s3-mission' }] }
  ]
},
sentinel5p:{
  summary:L('Un seul instrument, le spectromètre TROPOMI : il décompose la lumière solaire renvoyée par la Terre et y repère la signature de chaque gaz.',
            'A single instrument, the TROPOMI spectrometer: it splits the sunlight sent back by the Earth and picks out the signature of each gas.'),
  refs:{}, archives:[CDSE, PCOMP],
  instruments:[
    { id:'tropomi', name:'TROPOMI', full:'TROPOspheric Monitoring Instrument', type:'spec',
      use:L('Cartographier chaque jour le dioxyde d\'azote, l\'ozone, le monoxyde de carbone, le méthane, le dioxyde de soufre, le formaldéhyde, les aérosols et les nuages.', 'Map nitrogen dioxide, ozone, carbon monoxide, methane, sulphur dioxide, formaldehyde, aerosols and clouds every day.'),
      summary:L('Spectromètre imageur « à balai-brosse » : une fente regarde une ligne de 2 600 km en travers de la trace, et un réseau étale la lumière de chaque point en spectre sur un détecteur à deux dimensions. Ses bandes vont de l\'ultraviolet à l\'infrarouge court.',
                'Pushbroom imaging spectrometer: a slit looks at a 2,600 km line across the track, and a grating spreads the light of each point into a spectrum on a two-dimensional detector. Its bands range from the ultraviolet to the short-wave infrared.'),
      bands:[{ l:L('UV et visible', 'UV and visible'), lo:0.270, hi:0.495 }, { l:L('proche IR', 'near IR'), lo:0.675, hi:0.775 }, { l:'SWIR', lo:2.305, hi:2.385 }],
      specs:[[L('Bandes', 'Bands'), L('270 – 495 nm, 675 – 775 nm, 2 305 – 2 385 nm', '270 – 495 nm, 675 – 775 nm, 2,305 – 2,385 nm'), 'esa'], [L('Pixel au sol', 'Ground pixel'), L('jusqu\'à 7 × 3,5 km', 'down to 7 × 3.5 km'), 'esa'],
        [L('Fauchée', 'Swath'), '2 600 km', 'esa'], [L('Couverture', 'Coverage'), L('toute la Terre chaque jour', 'the whole Earth every day'), 'esa']],
      docs:[{ l:'TROPOMI', u:'https://www.tropomi.eu/' }] }
  ]
},
terra:{
  summary:L('Cinq instruments qui regardent ensemble : MODIS (toute la Terre en 36 bandes, presque chaque jour), ASTER (images détaillées en 14 bandes, et relief en stéréo), MISR (neuf caméras inclinées), CERES (bilan d\'énergie) et MOPITT (pollution par le monoxyde de carbone).',
            'Five instruments looking together: MODIS (the whole Earth in 36 bands, almost daily), ASTER (detailed images in 14 bands, and stereo relief), MISR (nine tilted cameras), CERES (energy budget) and MOPITT (carbon monoxide pollution).'),
  refs:{}, archives:[WORLDVIEW, LP_DAAC, EARTHDATA],
  instruments:[
    { id:'modis', name:'MODIS', full:'Moderate Resolution Imaging Spectroradiometer', type:'cam',
      use:L('Observer chaque jour ou presque toute la planète : nuages, aérosols, feux, neige, végétation, couleur et température de la mer.', 'Observe almost the whole planet every day: clouds, aerosols, fires, snow, vegetation, ocean colour and temperature.'),
      summary:L('Radiomètre imageur qui couvre une bande de 2 330 km en travers de la trace, en 36 bandes du visible à l\'infrarouge thermique. Le même instrument vole sur Aqua.',
                'Imaging radiometer that covers a 2,330 km strip across the track, in 36 bands from visible to thermal infrared. The same instrument flies on Aqua.'),
      specs:[[L('Bandes', 'Bands'), L('36, de 0,4 à 14,4 µm', '36, from 0.4 to 14.4 µm'), 'modis'], [L('Fauchée', 'Swath'), '2 330 km', 'modis']],
      docs:[{ l:L('Instruments de Terra (NASA)', 'Terra instruments (NASA)'), u:'https://terra.nasa.gov/about/terra-instruments' }] },
    { id:'aster', name:'ASTER', full:'Advanced Spaceborne Thermal Emission and Reflection Radiometer', type:'cam',
      use:L('Prendre des images détaillées des terres (volcans, glaciers, géologie, villes) et mesurer le relief en stéréo.', 'Take detailed images of land (volcanoes, glaciers, geology, cities) and measure relief in stereo.'),
      summary:L('Trois sous-systèmes : visible et proche infrarouge (avec une visée arrière pour la stéréo), infrarouge court, infrarouge thermique. Les données infrarouge court ne sont plus disponibles.',
                'Three subsystems: visible and near infrared (with a backward view for stereo), short-wave infrared, thermal infrared. Short-wave infrared data are no longer available.'),
      bands:[{ l:'1', lo:0.52, hi:0.60 }, { l:'2', lo:0.63, hi:0.69 }, { l:'3N/3B', lo:0.76, hi:0.86 }, { l:'4', lo:1.600, hi:1.700 }, { l:'5', lo:2.145, hi:2.185 }, { l:'6', lo:2.185, hi:2.225 }, { l:'7', lo:2.235, hi:2.285 }, { l:'8', lo:2.295, hi:2.365 }, { l:'9', lo:2.360, hi:2.430 },
             { l:'10', lo:8.125, hi:8.475 }, { l:'11', lo:8.475, hi:8.825 }, { l:'12', lo:8.925, hi:9.275 }, { l:'13', lo:10.25, hi:10.95 }, { l:'14', lo:10.95, hi:11.65 }],
      specs:[[L('Bandes', 'Bands'), L('14, de 0,52 à 11,65 µm', '14, from 0.52 to 11.65 µm'), 'aster'], [L('Pixel au sol', 'Ground pixel'), L('15 m (visible), 30 m (infrarouge court), 90 m (thermique)', '15 m (visible), 30 m (short-wave IR), 90 m (thermal)'), 'aster'],
        [L('Fauchée', 'Swath'), '60 km', 'aster'], [L('Codage', 'Quantization'), L('8 bits (12 bits en thermique)', '8 bits (12 bits thermal)'), 'aster'], [L('État', 'Status'), L('infrarouge court indisponible', 'short-wave IR unavailable'), 'about']],
      docs:[{ l:'ASTER (JPL)', u:'https://asterweb.jpl.nasa.gov/characteristics.asp' }] },
    { id:'misr', name:'MISR', full:'Multi-angle Imaging SpectroRadiometer', type:'cam',
      use:L('Regarder chaque lieu sous neuf angles pour mesurer les aérosols, la hauteur des nuages et la structure de la végétation.', 'Look at each place from nine angles to measure aerosols, cloud height and vegetation structure.'),
      summary:L('Neuf caméras « à balai-brosse », de la verticale à 70,5° vers l\'avant et vers l\'arrière, chacune en quatre bandes (bleu, vert, rouge, proche infrarouge). Construit par le JPL.',
                'Nine pushbroom cameras, from straight down to 70.5° forward and backward, each in four bands (blue, green, red, near infrared). Built by JPL.'),
      specs:[[L('Caméras', 'Cameras'), L('9, visées de 0 ; 26,1 ; 45,6 ; 60,0 et 70,5°', '9, view angles 0, 26.1, 45.6, 60.0 and 70.5°'), 'misr'], [L('Bandes', 'Bands'), L('4 (bleu, vert, rouge, proche infrarouge)', '4 (blue, green, red, near infrared)'), 'misr'],
        [L('Fauchée', 'Swath'), L('≈ 400 km (commune aux 9 caméras)', '≈ 400 km (common to the 9 cameras)'), 'misr'], [L('Masse', 'Mass'), '148 kg', 'misr'], [L('Couverture', 'Coverage'), L('toute la Terre en 9 jours', 'the whole Earth in 9 days'), 'misr']],
      docs:[{ l:'MISR (JPL)', u:'https://misr.jpl.nasa.gov/mission/misr-instrument/' }] }
  ]
},
aqua:{
  summary:L('Six instruments à l\'origine, quatre en service : MODIS (36 bandes), le sondeur infrarouge AIRS et le sondeur micro-onde AMSU, qui mesurent la température et l\'humidité de l\'air couche par couche, et CERES (bilan d\'énergie). AMSR-E (Japon) et HSB (Brésil) ne fournissent plus de données.',
            'Six instruments originally, four in service: MODIS (36 bands), the AIRS infrared sounder and the AMSU microwave sounder, which measure air temperature and humidity layer by layer, and CERES (energy budget). AMSR-E (Japan) and HSB (Brazil) no longer provide data.'),
  refs:{}, archives:[WORLDVIEW, GESDISC, EARTHDATA],
  instruments:[
    { id:'modis', name:'MODIS', full:'Moderate Resolution Imaging Spectroradiometer', type:'cam',
      use:L('Observer chaque jour ou presque toute la planète, l\'après-midi : nuages, aérosols, feux, glaces, couleur et température de la mer.', 'Observe almost the whole planet every afternoon: clouds, aerosols, fires, ice, ocean colour and temperature.'),
      summary:L('Le même instrument que sur Terra : une bande de 2 330 km en 36 bandes. Terra passe le matin, Aqua l\'après-midi.',
                'The same instrument as on Terra: a 2,330 km strip in 36 bands. Terra passes in the morning, Aqua in the afternoon.'),
      specs:[[L('Bandes', 'Bands'), L('36, de 0,4 à 14,4 µm', '36, from 0.4 to 14.4 µm'), 'eop'], [L('Fauchée', 'Swath'), '2 330 km', 'eop']],
      docs:[{ l:L('Aqua (NASA)', 'Aqua (NASA)'), u:'https://science.nasa.gov/mission/aqua/' }] },
    { id:'airs', name:'AIRS', full:'Atmospheric Infrared Sounder', type:'spec',
      use:L('Mesurer la température et l\'humidité de l\'air du sol jusqu\'à la stratosphère, et des gaz comme le CO₂, le méthane et le monoxyde de carbone.', 'Measure air temperature and humidity from the ground up to the stratosphere, and gases such as CO₂, methane and carbon monoxide.'),
      summary:L('Sondeur infrarouge à plus de 2 300 canaux : chaque canal voit une altitude différente de l\'atmosphère.',
                'Infrared sounder with more than 2,300 channels: each channel sees a different height in the atmosphere.'),
      specs:[[L('Canaux', 'Channels'), L('plus de 2 300', 'more than 2,300'), 'eop'], [L('Fauchée', 'Swath'), '1 650 km', 'eop'], [L('Pixel au sol', 'Ground pixel'), L('13,5 km à la verticale', '13.5 km at nadir'), 'eop']],
      docs:[{ l:'AIRS (JPL)', u:'https://airs.jpl.nasa.gov/' }] }
  ]
},
icesat2:{
  summary:L('Un seul instrument, l\'altimètre laser ATLAS : un laser vert découpé en six faisceaux, et un télescope qui chronomètre le retour de chaque photon.',
            'A single instrument, the ATLAS laser altimeter: a green laser split into six beams, and a telescope that times the return of each photon.'),
  refs:{}, archives:[NSIDC, EARTHDATA],
  instruments:[
    { id:'atlas', name:'ATLAS', full:'Advanced Topographic Laser Altimeter System', type:'alt',
      use:L('Mesurer l\'altitude des calottes, des glaciers, de la banquise, des forêts et des lacs, à quelques centimètres près en moyenne.', 'Measure the height of ice sheets, glaciers, sea ice, forests and lakes, to a few centimetres on average.'),
      summary:L('Altimètre laser à comptage de photons : 10 000 impulsions par seconde, chacune partagée en six faisceaux (trois paires, un fort et un faible). La durée de l\'aller-retour, mesurée à 800 picosecondes près, donne la distance.',
                'Photon-counting laser altimeter: 10,000 pulses per second, each split into six beams (three pairs, one strong and one weak). The round-trip time, measured to 800 picoseconds, gives the distance.'),
      specs:[[L('Laser', 'Laser'), L('532 nm (vert), 10 kHz', '532 nm (green), 10 kHz'), 'specs'], [L('Faisceaux', 'Beams'), L('6, en 3 paires', '6, in 3 pairs'), 'specs'],
        [L('Pixel au sol', 'Ground pixel'), L('tache de 11 m, une tous les ≈ 0,7 m', '11 m footprint, one every ≈ 0.7 m'), 'specs'], [L('Précision du chronométrage', 'Timing precision'), '800 ps', 'specs'], [L('Pointage', 'Pointing'), L('45 m (contrôle), 6,5 m (connaissance)', '45 m (control), 6.5 m (knowledge)'), 'specs']],
      docs:[{ l:L('Caractéristiques techniques (NASA)', 'Technical specs (NASA)'), u:'https://icesat-2.gsfc.nasa.gov/science/specs' }] }
  ]
},
gracefo:{
  summary:L('L\'instrument, c\'est la paire de satellites elle-même : la distance entre eux est mesurée en continu par micro-ondes (KBR) et, pour la première fois, par laser (LRI). Des accéléromètres retirent l\'effet du frottement de l\'air, des viseurs d\'étoiles donnent l\'orientation, le GPS la position.',
            'The instrument is the pair of satellites itself: the distance between them is measured continuously by microwaves (KBR) and, for the first time, by laser (LRI). Accelerometers remove the effect of air drag, star cameras give the orientation, GPS the position.'),
  refs:{}, archives:[PODAAC, ISDC, EARTHDATA],
  instruments:[
    { id:'kbr', name:'KBR', full:'K-Band Ranging System (Microwave Instrument)', type:'grav',
      use:L('Mesurer les variations de la distance entre les deux satellites, pour en tirer chaque mois le champ de gravité de la Terre.', 'Measure changes in the distance between the two satellites, to derive the Earth\'s gravity field every month.'),
      summary:L('Liaison micro-onde dans les deux sens entre les satellites, sur deux fréquences pour retirer l\'effet de l\'ionosphère. Instrument hérité de la mission GRACE.',
                'Two-way microwave link between the satellites, on two frequencies to remove the ionosphere\'s effect. Instrument inherited from the GRACE mission.'),
      specs:[[L('Fréquences', 'Frequencies'), L('24 GHz (bande K) et 32 GHz (bande Ka)', '24 GHz (K band) and 32 GHz (Ka band)'), 'eop'], [L('Distance mesurée', 'Measured distance'), L('≈ 220 km (170 à 270 km)', '≈ 220 km (170 to 270 km)'), 'eop']],
      docs:[{ l:'GRACE-FO (GFZ)', u:'https://www.gfz.de/en/section/global-geomonitoring-and-gravity-field/projects/grace-fo-gravity-recovery-and-climate-experiment-follow-on-mission' }] },
    { id:'lri', name:'LRI', full:'Laser Ranging Interferometer', type:'grav',
      use:L('Démontrer la mesure de distance par laser entre deux satellites, pour les futures missions de gravimétrie.', 'Demonstrate laser ranging between two satellites, for future gravity missions.'),
      summary:L('Interféromètre laser entre les deux satellites, qui mesure les mêmes variations de distance que KBR, avec moins de bruit. Premier fonctionnement le 14 juin 2018.',
                'Laser interferometer between the two satellites, which measures the same distance changes as KBR, with less noise. First operation on 14 June 2018.'),
      specs:[[L('Précision', 'Precision'), L('de l\'ordre du nanomètre', 'nanometre level'), 'gfz'], [L('Statut', 'Status'), L('démonstration technologique', 'technology demonstration'), 'gfz']],
      docs:[{ l:'GRACE-FO (eoPortal)', u:'https://www.eoportal.org/satellite-missions/grace-fo' }] }
  ]
},
swot:{
  summary:L('Deux altimètres : le radar interférométrique KaRIn, qui mesure la hauteur de l\'eau sur deux bandes de 50 km, et l\'altimètre classique Poseidon-3C, à la verticale. S\'y ajoutent un radiomètre (correction de la vapeur d\'eau) et trois systèmes de positionnement précis (DORIS, GPS, réflecteurs laser).',
            'Two altimeters: the KaRIn interferometric radar, which measures water height over two 50 km strips, and the classic Poseidon-3C altimeter, straight down. Added to these are a radiometer (water vapour correction) and three precise positioning systems (DORIS, GPS, laser reflectors).'),
  refs:{}, archives:[PODAAC, AVISO, EARTHDATA],
  instruments:[
    { id:'karin', name:'KaRIn', full:'Ka-band Radar Interferometer', type:'alt',
      use:L('Cartographier la hauteur de la mer en deux dimensions (tourbillons, courants côtiers) et celle des lacs et des fleuves.', 'Map sea surface height in two dimensions (eddies, coastal currents) and the height of lakes and rivers.'),
      summary:L('Deux antennes radar en bande Ka au bout d\'un mât de 10 m visent de part et d\'autre de la trace. Elles reçoivent le même écho ; la différence de trajet entre les deux donne la hauteur de chaque point, comme une stéréo radar.',
                'Two Ka-band radar antennas at the ends of a 10 m boom look on either side of the track. They receive the same echo; the path difference between them gives the height of each point, like radar stereo.'),
      specs:[[L('Fréquence', 'Frequency'), L('bande Ka', 'Ka band'), 'eop'], [L('Fauchée', 'Swath'), L('≈ 120 km : deux bandes de 50 km', '≈ 120 km: two 50 km strips'), 'eop'], [L('Mât', 'Boom'), '10 m', 'eop'], [L('Masse', 'Mass'), '294 kg', 'eop']],
      docs:[{ l:'SWOT (CNES)', u:'https://cnes.fr/projets/swot' }] },
    { id:'poseidon', name:'Poseidon-3C', full:'Nadir altimeter', type:'alt',
      use:L('Mesurer la hauteur de la mer à la verticale du satellite, au milieu de la bande de KaRIn, dans la continuité des altimètres Jason.', 'Measure sea height straight below the satellite, in the middle of KaRIn\'s strip, continuing the Jason altimeters.'),
      summary:L('Altimètre radar classique à deux fréquences, fourni par le CNES.', 'Classic dual-frequency radar altimeter, supplied by CNES.'),
      specs:[[L('Type', 'Type'), L('altimètre radar à deux fréquences, à la verticale', 'dual-frequency nadir radar altimeter'), 'eop']],
      docs:[{ l:'SWOT (eoPortal)', u:'https://www.eoportal.org/satellite-missions/swot' }] }
  ]
}
,
pace:{
  summary:L('Trois instruments : le spectromètre OCI, qui mesure la couleur de l\'océan en continu de l\'ultraviolet à l\'infrarouge proche, et deux polarimètres, HARP2 et SPEXone, qui mesurent aussi comment la lumière est polarisée et sous quels angles elle est renvoyée, pour les aérosols et les nuages.',
            'Three instruments: the OCI spectrometer, which measures ocean colour continuously from ultraviolet to near infrared, and two polarimeters, HARP2 and SPEXone, which also measure how light is polarised and at which angles it is scattered, for aerosols and clouds.'),
  refs:{}, archives:[OBDAAC, EARTHDATA, WORLDVIEW],
  instruments:[
    { id:'oci', name:'OCI', full:'Ocean Color Instrument', type:'spec',
      use:L('Mesurer la couleur de l\'océan pour suivre le plancton végétal et ses différentes familles, ainsi que les aérosols et les nuages.', 'Measure ocean colour to track phytoplankton and its different groups, as well as aerosols and clouds.'),
      summary:L('Spectromètre à télescope tournant, qui balaie la Terre d\'un bord à l\'autre. Il mesure un spectre continu de 315 à 895 nm, par pas de 5 nm, et sept bandes de l\'infrarouge court. Il peut s\'incliner de 20° vers l\'avant ou l\'arrière pour éviter le reflet du Soleil sur la mer.',
                'Spectrometer with a rotating telescope, which scans the Earth from edge to edge. It measures a continuous spectrum from 315 to 895 nm, in 5 nm steps, and seven shortwave infrared bands. It can tilt 20° forward or backward to avoid sun glint on the sea.'),
      bands:[{ l:L('315 à 895 nm, par pas de 5 nm', '315 to 895 nm, in 5 nm steps'), lo:0.315, hi:0.895 }, { l:L('7 bandes de 940 à 2 260 nm (étendue ≈)', '7 bands from 940 to 2,260 nm (≈ extent)'), lo:0.94, hi:2.26 }],
      specs:[[L('Spectre', 'Spectrum'), L('315 à 895 nm par pas de 5 nm ; 7 bandes de 940 à 2 260 nm', '315 to 895 nm in 5 nm steps; 7 bands from 940 to 2,260 nm'), 'osc'], [L('Pixel au sol', 'Ground pixel'), L('≈ 1,2 km au nadir', '≈ 1.2 km at nadir'), 'oci'],
        [L('Fauchée', 'Swath'), '≈ 2 700 km', 'oci'], [L('Inclinaison', 'Tilt'), '± 20°', 'oci']],
      docs:[{ l:'Ocean Color Instrument (NASA OBPG)', u:'https://pace.oceansciences.org/oci.htm' }] },
    { id:'harp2', name:'HARP2', full:'Hyper-Angular Rainbow Polarimeter #2', type:'pol',
      use:L('Mesurer la polarisation de la lumière renvoyée par les nuages et les aérosols, sous de nombreux angles.', 'Measure the polarisation of light scattered by clouds and aerosols, from many angles.'),
      summary:L('Polarimètre grand angle en quatre couleurs (440, 550, 670 et 870 nm).', 'Wide-angle polarimeter in four colours (440, 550, 670 and 870 nm).'),
      specs:[[L('Longueurs d\'onde', 'Wavelengths'), '440, 550, 670, 870 nm', 'osc'], [L('Fauchée', 'Swath'), '1 556 km', 'osc']],
      docs:[{ l:'PACE Mission Overview', u:'https://pace.oceansciences.org/mission.htm' }] },
    { id:'spexone', name:'SPEXone', full:'Spectro-polarimeter for Planetary Exploration', type:'pol',
      use:L('Caractériser finement les aérosols (taille, forme, composition) grâce à la polarisation, sous cinq angles de vue.', 'Characterise aerosols in detail (size, shape, composition) using polarisation, from five viewing angles.'),
      summary:L('Spectropolarimètre néerlandais à bande étroite, qui regarde chaque point sous cinq angles.', 'Dutch narrow-swath spectropolarimeter, which looks at each point from five angles.'),
      bands:[{ l:'385 – 770 nm', lo:0.385, hi:0.77 }],
      specs:[[L('Spectre', 'Spectrum'), L('385 à 770 nm', '385 to 770 nm'), 'osc'], [L('Fauchée', 'Swath'), '100 km', 'osc'], [L('Angles de vue', 'Viewing angles'), '5', 'osc']],
      docs:[{ l:'PACE Mission Overview', u:'https://pace.oceansciences.org/mission.htm' }] }
  ]
},
jpss:{
  summary:L('Les satellites JPSS portent la caméra VIIRS (images, nuages, incendies, couleur de l\'océan, lumières de nuit), deux sondeurs qui mesurent la température et l\'humidité de l\'air couche par couche (CrIS dans l\'infrarouge, ATMS en micro-ondes), OMPS pour l\'ozone et, sur NOAA-20, CERES pour le bilan d\'énergie de la Terre.',
            'The JPSS satellites carry the VIIRS camera (images, clouds, fires, ocean colour, night lights), two sounders that measure air temperature and humidity layer by layer (CrIS in the infrared, ATMS in microwaves), OMPS for ozone and, on NOAA-20, CERES for the Earth\'s energy budget.'),
  refs:{}, archives:[LAADS, LP_DAAC, EARTHDATA, WORLDVIEW],
  instruments:[
    { id:'viirs', name:'VIIRS', full:'Visible Infrared Imaging Radiometer Suite', type:'cam',
      use:L('Photographier toute la Terre deux fois par jour : nuages, incendies, neige, couleur de l\'océan, et lumières de la nuit grâce à une bande très sensible.', 'Photograph the whole Earth twice a day: clouds, fires, snow, ocean colour, and night lights thanks to a very sensitive band.'),
      summary:L('Radiomètre à balayage à 22 bandes du bleu à l\'infrarouge thermique, dont une bande « jour-nuit » qui voit les villes éclairées.', 'Scanning radiometer with 22 bands from blue to thermal infrared, including a day-night band that sees lit cities.'),
      bands:[{ l:L('22 bandes de 412 nm à 12 µm (étendue ≈)', '22 bands from 412 nm to 12 µm (≈ extent)'), lo:0.412, hi:12 }],
      specs:[[L('Bandes', 'Bands'), L('22, de 412 nm à 12 µm', '22, from 412 nm to 12 µm'), 'eopj'], [L('Pixel au sol', 'Ground pixel'), L('0,4 km au nadir', '0.4 km at nadir'), 'eopj'],
        [L('Fauchée', 'Swath'), '3 000 km', 'eopj'], [L('Champ de vue', 'Field of view'), '≈ ± 55,84°', 'eop']],
      docs:[{ l:'VIIRS (NOAA NESDIS)', u:'https://www.nesdis.noaa.gov/our-satellites/currently-flying/joint-polar-satellite-system/visible-infrared-imaging-radiometer-suite-viirs' }] },
    { id:'atms', name:'ATMS', full:'Advanced Technology Microwave Sounder', type:'rad',
      use:L('Mesurer la température et l\'humidité de l\'air sur toute la hauteur de l\'atmosphère, même à travers les nuages, pour les modèles de prévision.', 'Measure air temperature and humidity through the whole atmosphere, even through clouds, for forecast models.'),
      summary:L('Sondeur micro-onde à 22 canaux, utilisé avec le sondeur infrarouge CrIS.', '22-channel microwave sounder, used together with the CrIS infrared sounder.'),
      specs:[[L('Canaux', 'Channels'), '22', 'eop'], [L('Fauchée', 'Swath'), '2 300 km', 'eop']],
      docs:[{ l:'Suomi NPP (eoPortal)', u:'https://www.eoportal.org/satellite-missions/suomi-npp' }] }
  ]
},
smap:{
  summary:L('Deux instruments en bande L partageaient la grande antenne tournante : un radiomètre, qui fonctionne toujours, et un radar, en panne depuis juillet 2015. Le radiomètre mesure la température de brillance du sol, d\'où l\'on tire son humidité et son état (gelé ou non) ; il mesure aussi la salinité de la mer.',
            'Two L-band instruments shared the large rotating antenna: a radiometer, which still works, and a radar, which failed in July 2015. The radiometer measures the brightness temperature of the ground, from which its moisture and state (frozen or not) are derived; it also measures sea salinity.'),
  refs:{}, archives:[NSIDC_SMAP, EARTHDATA, WORLDVIEW],
  instruments:[
    { id:'radiometer', name:L('Radiomètre', 'Radiometer'), full:'L-band Radiometer', type:'rad',
      use:L('Mesurer l\'humidité des premiers centimètres du sol et repérer les sols gelés, sur toute la Terre en trois jours.', 'Measure the moisture of the top few centimetres of soil and detect frozen ground, over the whole Earth in three days.'),
      summary:L('Radiomètre micro-onde passif en bande L (1,41 GHz) : un sol humide émet moins qu\'un sol sec à cette fréquence.', 'Passive L-band microwave radiometer (1.41 GHz): wet soil emits less than dry soil at this frequency.'),
      specs:[[L('Fréquence', 'Frequency'), '1,41 GHz', 'eop'], [L('Pixel au sol', 'Ground pixel'), L('≈ 40 km (tache de l\'antenne)', '≈ 40 km (antenna footprint)'), 'eop'], [L('Fauchée', 'Swath'), '1 000 km', 'eop']],
      docs:[{ l:'SMAP (eoPortal)', u:'https://www.eoportal.org/satellite-missions/smap' }] },
    { id:'radar', name:'Radar', full:'L-band Radar', type:'radar',
      use:L('Affiner la carte d\'humidité du radiomètre à quelques kilomètres.', 'Sharpen the radiometer\'s moisture map to a few kilometres.'),
      summary:L('Radar en bande L (1,26 GHz) ; il a cessé de fonctionner en juillet 2015.', 'L-band radar (1.26 GHz); it stopped working in July 2015.'),
      specs:[[L('Fréquence', 'Frequency'), '1,26 GHz', 'eop'], [L('Statut', 'Status'), L('en panne depuis juillet 2015', 'failed in July 2015'), 'eop']],
      docs:[{ l:'SMAP (eoPortal)', u:'https://www.eoportal.org/satellite-missions/smap' }] }
  ]
},
oco2:{
  summary:L('Un seul instrument : trois spectromètres à réseau, nourris par un même télescope. Chacun découpe finement une bande étroite du spectre, où l\'oxygène ou le CO₂ absorbent la lumière du Soleil renvoyée par la Terre.',
            'A single instrument: three grating spectrometers, fed by the same telescope. Each finely splits a narrow band of the spectrum, where oxygen or CO₂ absorbs sunlight reflected by the Earth.'),
  refs:{}, archives:[GESDISC, EARTHDATA, WORLDVIEW],
  instruments:[
    { id:'oco2', name:L('Spectromètres', 'Spectrometers'), full:'OCO-2 Instrument (three grating spectrometers)', type:'spec',
      use:L('Mesurer la quantité moyenne de CO₂ dans toute la colonne d\'air (XCO₂), pour trouver où le carbone est émis et où il est absorbé.', 'Measure the average amount of CO₂ in the whole air column (XCO₂), to find where carbon is emitted and where it is absorbed.'),
      summary:L('La bande de l\'oxygène sert à mesurer la quantité totale d\'air et la pression au sol ; les deux bandes du CO₂ donnent la quantité de gaz. Les détecteurs sont refroidis par un cryoréfrigérateur.', 'The oxygen band measures the total amount of air and the surface pressure; the two CO₂ bands give the amount of gas. The detectors are cooled by a cryocooler.'),
      bands:[{ l:L('oxygène', 'oxygen'), lo:0.758, hi:0.772 }, { l:L('CO₂ faible', 'weak CO₂'), lo:1.594, hi:1.619 }, { l:L('CO₂ fort', 'strong CO₂'), lo:2.042, hi:2.082 }],
      specs:[[L('Bandes', 'Bands'), '758–772 nm, 1 594–1 619 nm, 2 042–2 082 nm', 'eop'], [L('Pixel au sol', 'Ground pixel'), '1,29 × 2,25 km', 'eop'], [L('Fauchée', 'Swath'), '10 km', 'eop']],
      docs:[{ l:'OCO-2 Instrument (NASA JPL)', u:'https://ocov2.jpl.nasa.gov/observatory/instrument/' }] }
  ]
},
gpm:{
  summary:L('Deux instruments : le radar DPR, fourni par la JAXA, qui mesure la pluie en trois dimensions à deux fréquences, et le radiomètre micro-onde GMI de la NASA, qui sert d\'étalon aux radiomètres des autres satellites de la constellation GPM.',
            'Two instruments: the DPR radar, supplied by JAXA, which measures rain in three dimensions at two frequencies, and NASA\'s GMI microwave radiometer, which serves as the reference for the radiometers of the other satellites in the GPM constellation.'),
  refs:{}, archives:[GPMPPS, GESDISC, EARTHDATA, WORLDVIEW],
  instruments:[
    { id:'dpr', name:'DPR', full:'Dual-frequency Precipitation Radar', type:'radar',
      use:L('Mesurer la structure verticale de la pluie et de la neige, et la taille des gouttes.', 'Measure the vertical structure of rain and snow, and the size of the drops.'),
      summary:L('Deux radars : en bande Ku (13,6 GHz) pour la pluie forte, en bande Ka (35,5 GHz) pour la pluie faible et la neige. La comparaison des deux échos renseigne sur la taille des gouttes.', 'Two radars: Ku band (13.6 GHz) for heavy rain, Ka band (35.5 GHz) for light rain and snow. Comparing the two echoes tells about drop size.'),
      specs:[[L('Fréquences', 'Frequencies'), '13,6 GHz (Ku), 35,5 GHz (Ka)', 'mis'], [L('Pixel au sol', 'Ground pixel'), L('5 km au nadir', '5 km at nadir'), 'mis'], [L('Fauchée', 'Swath'), L('245 km (les deux bandes, depuis mai 2018)', '245 km (both bands, since May 2018)'), 'mis']],
      docs:[{ l:'GPM Mission (NASA)', u:'https://gpm.nasa.gov/missions/GPM' }] },
    { id:'gmi', name:'GMI', full:'GPM Microwave Imager', type:'rad',
      use:L('Mesurer la pluie et la neige sur une large bande, et étalonner les autres satellites qui servent au produit mondial IMERG.', 'Measure rain and snow over a wide swath, and calibrate the other satellites used for the global IMERG product.'),
      summary:L('Radiomètre micro-onde conique à 13 canaux, de 10 à 183 GHz.', 'Conical-scanning microwave radiometer with 13 channels, from 10 to 183 GHz.'),
      specs:[[L('Canaux', 'Channels'), L('13, de 10 à 183 GHz', '13, from 10 to 183 GHz'), 'mis'], [L('Fauchée', 'Swath'), '885 km', 'mis']],
      docs:[{ l:'GPM Core Observatory (NASA)', u:'https://gpm.nasa.gov/missions/GPM/core-observatory' }] }
  ]
},
nisar:{
  summary:L('Deux radars à synthèse d\'ouverture, en bande L (NASA) et en bande S (ISRO), qui partagent le réflecteur de 12 m. En comparant deux passages, à 12 jours d\'intervalle, on mesure les déplacements du sol au centimètre près (interférométrie).',
            'Two synthetic aperture radars, L band (NASA) and S band (ISRO), sharing the 12 m reflector. By comparing two passes, 12 days apart, ground movements are measured to the centimetre (interferometry).'),
  refs:{}, archives:[ASF, EARTHDATA, WORLDVIEW],
  instruments:[
    { id:'lsar', name:'L-SAR', full:'L-band Synthetic Aperture Radar', type:'radar',
      use:L('Mesurer les déformations du sol, la biomasse des forêts et le mouvement des glaces ; la grande longueur d\'onde traverse la végétation.', 'Measure ground deformation, forest biomass and ice motion; the long wavelength passes through vegetation.'),
      summary:L('Radar en bande L (longueur d\'onde de 24 cm), fourni par le JPL.', 'L-band radar (24 cm wavelength), supplied by JPL.'),
      specs:[[L('Fréquence', 'Frequency'), '1,25 GHz (24 cm)', 'eop'], [L('Fauchée', 'Swath'), '242 km', 'eop'], [L('Pixel au sol', 'Ground pixel'), L('3 à 10 m selon le mode', '3 to 10 m depending on mode'), 'eop']],
      docs:[{ l:'NISAR (eoPortal)', u:'https://www.eoportal.org/satellite-missions/nisar' }] },
    { id:'ssar', name:'S-SAR', full:'S-band Synthetic Aperture Radar', type:'radar',
      use:L('Compléter la bande L pour les cultures, les sols et la végétation basse.', 'Complement the L band for crops, soils and low vegetation.'),
      summary:L('Radar en bande S (3,2 GHz), fourni par l\'ISRO.', 'S-band radar (3.2 GHz), supplied by ISRO.'),
      specs:[[L('Fréquence', 'Frequency'), '3,2 GHz', 'eop'], [L('Fauchée', 'Swath'), '242 km', 'eop']],
      docs:[{ l:'NISAR (eoPortal)', u:'https://www.eoportal.org/satellite-missions/nisar' }] }
  ]
},
aura:{
  summary:L('Quatre instruments au départ : OMI (ultraviolet et visible, vers le bas), MLS (micro-ondes, vers le bord de l\'atmosphère), TES (infrarouge) et HIRDLS (infrarouge, en panne depuis 2008). Ils mesurent l\'ozone, les gaz qui le détruisent, la pollution et les aérosols.',
            'Four instruments at launch: OMI (ultraviolet and visible, looking down), MLS (microwaves, looking at the edge of the atmosphere), TES (infrared) and HIRDLS (infrared, failed in 2008). They measure ozone, the gases that destroy it, pollution and aerosols.'),
  refs:{}, archives:[GESDISC, EARTHDATA, WORLDVIEW],
  instruments:[
    { id:'omi', name:'OMI', full:'Ozone Monitoring Instrument', type:'spec',
      use:L('Cartographier chaque jour l\'ozone, le dioxyde d\'azote, le dioxyde de soufre et les aérosols sur toute la Terre.', 'Map ozone, nitrogen dioxide, sulphur dioxide and aerosols over the whole Earth every day.'),
      summary:L('Spectromètre imageur à large fauchée, fourni par les Pays-Bas (NIVR) avec l\'institut météorologique finlandais (FMI).', 'Wide-swath imaging spectrometer, supplied by the Netherlands (NIVR) with the Finnish Meteorological Institute (FMI).'),
      bands:[{ l:'270 – 500 nm', lo:0.27, hi:0.5 }],
      specs:[[L('Spectre', 'Spectrum'), L('270 à 500 nm', '270 to 500 nm'), 'eop'], [L('Pixel au sol', 'Ground pixel'), L('13 × 24 km au nadir', '13 × 24 km at nadir'), 'eop'], [L('Fauchée', 'Swath'), '2 600 km', 'eop']],
      docs:[{ l:'Aura (eoPortal)', u:'https://www.eoportal.org/satellite-missions/aura' }] },
    { id:'mls', name:'MLS', full:'Microwave Limb Sounder', type:'rad',
      use:L('Mesurer, couche par couche, l\'ozone et les gaz qui le détruisent (chlore), ainsi que la vapeur d\'eau de la haute atmosphère.', 'Measure, layer by layer, ozone and the gases that destroy it (chlorine), as well as upper-atmosphere water vapour.'),
      summary:L('Radiomètre micro-onde qui vise le bord de l\'atmosphère (le limbe), vers l\'avant du satellite, et en tire des profils verticaux.', 'Microwave radiometer that looks at the edge of the atmosphere (the limb), ahead of the satellite, and derives vertical profiles.'),
      specs:[[L('Visée', 'Viewing'), L('au limbe, vers l\'avant', 'limb, forward'), 'eop']],
      docs:[{ l:'Aura (eoPortal)', u:'https://www.eoportal.org/satellite-missions/aura' }] },
    { id:'tes', name:'TES', full:'Tropospheric Emission Spectrometer', type:'spec',
      use:L('Mesurer l\'ozone et d\'autres gaz de la basse atmosphère, là où ils touchent la santé et le climat.', 'Measure ozone and other gases in the lower atmosphere, where they affect health and climate.'),
      summary:L('Spectromètre infrarouge à transformée de Fourier, du JPL.', 'Fourier transform infrared spectrometer, from JPL.'),
      bands:[{ l:'3,2 – 15,4 µm', lo:3.2, hi:15 }],
      specs:[[L('Spectre', 'Spectrum'), L('3,2 à 15,4 µm', '3.2 to 15.4 µm'), 'eop'], [L('Pixel au sol', 'Ground pixel'), '0,43 × 5,3 km', 'eop']],
      docs:[{ l:'Aura (eoPortal)', u:'https://www.eoportal.org/satellite-missions/aura' }] }
  ]
},
tempo:{
  summary:L('Un spectromètre ultraviolet-visible, en orbite géostationnaire, qui balaie l\'Amérique du Nord d\'est en ouest toutes les heures le jour. Il fait partie, avec GEMS (Corée du Sud) et Sentinel-4 (Europe), d\'une constellation qui suit la pollution de l\'air au-dessus de l\'hémisphère Nord.',
            'An ultraviolet-visible spectrometer in geostationary orbit, which scans North America from east to west every hour during daytime. Together with GEMS (South Korea) and Sentinel-4 (Europe), it is part of a constellation that tracks air pollution over the Northern Hemisphere.'),
  refs:{}, archives:[ASDC, EARTHDATA, WORLDVIEW],
  instruments:[
    { id:'tempo', name:'TEMPO', full:'Tropospheric Emissions: Monitoring of Pollution', type:'spec',
      use:L('Mesurer heure par heure l\'ozone, le dioxyde d\'azote, le formaldéhyde et les aérosols au-dessus de l\'Amérique du Nord.', 'Measure ozone, nitrogen dioxide, formaldehyde and aerosols over North America hour by hour.'),
      summary:L('Spectromètre à réseau qui couvre deux plages, de l\'ultraviolet au visible, avec une résolution spectrale de 0,57 nm. Construit par Ball Aerospace, il est fixé sur le satellite de télécommunications Intelsat 40e.', 'Grating spectrometer covering two ranges, from ultraviolet to visible, with a spectral resolution of 0.57 nm. Built by Ball Aerospace, it is mounted on the Intelsat 40e communications satellite.'),
      bands:[{ l:'290 – 490 nm', lo:0.29, hi:0.49 }, { l:'540 – 740 nm', lo:0.54, hi:0.74 }],
      specs:[[L('Spectre', 'Spectrum'), L('290 à 490 nm et 540 à 740 nm', '290 to 490 nm and 540 to 740 nm'), 'eop'], [L('Pixel au sol', 'Ground pixel'), '2,21 × 4,97 km', 'eop'],
        [L('Fréquence', 'Frequency'), L('toutes les heures, le jour', 'every hour, in daytime'), 'sao'], [L('Masse', 'Mass'), '148 kg', 'eop']],
      docs:[{ l:'TEMPO (Smithsonian)', u:'https://tempo.si.edu/overview.html' }] }
  ]
},
goes:{
  summary:L('L\'imageur ABI photographie la Terre en 16 bandes ; le détecteur GLM cartographie les éclairs en continu. D\'autres instruments surveillent le Soleil et l\'environnement spatial (SUVI, EXIS, SEISS, magnétomètre) et un coronographe, CCOR-1, observe les éjections de masse coronale.',
            'The ABI imager photographs the Earth in 16 bands; the GLM detector maps lightning continuously. Other instruments monitor the Sun and the space environment (SUVI, EXIS, SEISS, magnetometer) and a coronagraph, CCOR-1, observes coronal mass ejections.'),
  refs:{ ccor:{ t:'GOES-19', p:'Wikipédia (en anglais)', u:'https://en.wikipedia.org/wiki/GOES-19' } }, archives:[NOAA_AWS, WORLDVIEW],
  instruments:[
    { id:'abi', name:'ABI', full:'Advanced Baseline Imager', type:'cam',
      use:L('Suivre heure par heure, et même minute par minute, les nuages, les orages, les ouragans, les incendies, la fumée et le brouillard.', 'Track clouds, storms, hurricanes, fires, smoke and fog hour by hour, and even minute by minute.'),
      summary:L('Imageur à 16 bandes construit par L3Harris : 2 visibles, 4 du proche infrarouge, 10 infrarouges qui voient de jour comme de nuit.', '16-band imager built by L3Harris: 2 visible, 4 near-infrared, 10 infrared that see by day and night.'),
      specs:[[L('Bandes', 'Bands'), L('16 (2 visibles, 4 proche infrarouge, 10 infrarouges)', '16 (2 visible, 4 near-infrared, 10 infrared)'), 'abi'], [L('Pixel au sol', 'Ground pixel'), L('0,5 km (visible) à 2 km (infrarouge)', '0.5 km (visible) to 2 km (infrared)'), 'eop'],
        [L('Fréquence', 'Frequency'), L('disque entier toutes les 10 min ; États-Unis toutes les 5 min', 'full disk every 10 min; United States every 5 min'), 'abi']],
      docs:[{ l:'ABI (NOAA NESDIS)', u:'https://www.nesdis.noaa.gov/our-satellites/currently-flying/goes-east-west/advanced-baseline-imager-abi' }] },
    { id:'glm', name:'GLM', full:'Geostationary Lightning Mapper', type:'cam',
      use:L('Détecter tous les éclairs, dans les nuages et vers le sol, pour repérer les orages qui se renforcent.', 'Detect all lightning, in-cloud and cloud-to-ground, to spot strengthening storms.'),
      summary:L('Premier cartographe d\'éclairs opérationnel en orbite géostationnaire.', 'First operational lightning mapper in geostationary orbit.'),
      specs:[[L('Mesure', 'Measurement'), L('éclairs dans les nuages et vers le sol', 'in-cloud and cloud-to-ground lightning'), 'noaa']],
      docs:[{ l:'Geostationary satellites (NOAA NESDIS)', u:'https://www.nesdis.noaa.gov/our-satellites/currently-flying/geostationary-satellites' }] }
  ]
},
sentinel6:{
  summary:L('L\'altimètre radar Poseidon-4 mesure la hauteur de la mer ; le radiomètre AMR-C, fourni par la NASA, corrige l\'effet de la vapeur d\'eau ; DORIS, les récepteurs GNSS et le réflecteur laser donnent l\'orbite au centimètre près. Un récepteur GNSS de radio-occultation mesure aussi la température de l\'atmosphère.',
            'The Poseidon-4 radar altimeter measures sea height; the AMR-C radiometer, supplied by NASA, corrects for water vapour; DORIS, the GNSS receivers and the laser reflector give the orbit to the centimetre. A GNSS radio-occultation receiver also measures atmospheric temperature.'),
  refs:{}, archives:[PODAAC, EUMDS, EARTHDATA],
  instruments:[
    { id:'poseidon4', name:'Poseidon-4', full:'Poseidon-4 radar altimeter', type:'alt',
      use:L('Mesurer la hauteur de la mer, la hauteur des vagues et la vitesse du vent, pour suivre la montée du niveau des océans.', 'Measure sea height, wave height and wind speed, to track sea-level rise.'),
      summary:L('Altimètre radar qui vise à la verticale et chronomètre l\'écho sur la mer. Il fonctionne à la fois en mode classique et en mode à synthèse d\'ouverture, plus fin le long de la trace.', 'Radar altimeter that points straight down and times the echo from the sea. It works in both classic mode and synthetic aperture mode, finer along the track.'),
      specs:[[L('Couverture', 'Coverage'), L('95 % des océans en 10 jours', '95% of the oceans in 10 days'), 'esa'], [L('Visée', 'Viewing'), L('à la verticale (nadir)', 'straight down (nadir)'), 'esa']],
      docs:[{ l:'Sentinel-6 (ESA)', u:'https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-6' }] },
    { id:'amrc', name:'AMR-C', full:'Advanced Microwave Radiometer for Climate', type:'rad',
      use:L('Mesurer la vapeur d\'eau de l\'air sous le satellite, qui retarde l\'écho radar, pour corriger la hauteur de la mer.', 'Measure water vapour in the air below the satellite, which delays the radar echo, to correct sea height.'),
      summary:L('Radiomètre micro-onde fourni par la NASA.', 'Microwave radiometer supplied by NASA.'),
      specs:[[L('Fournisseur', 'Supplier'), 'NASA', 'wiki']],
      docs:[{ l:'Sentinel-6 Michael Freilich (Wikipedia)', u:'https://en.wikipedia.org/wiki/Sentinel-6_Michael_Freilich' }] }
  ]
}
};
