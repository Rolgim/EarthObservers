/* Textes anglais des satellites : EN_MISSIONS[id] = { name, agency, desc, sections, refs, parts, model, targets } (mêmes champs que MISSIONS).
   Les clés de source des lignes de la fiche sont reprises du français. */
var EN_MISSIONS = {
  landsat9:{
    agency:'NASA and USGS; Northrop Grumman platform',
    targets:['Land', 'Ice', 'Oceans'],
    desc:"Launched in 2021 by NASA and USGS, Landsat 9 extends the longest record of Earth images taken from space, begun in 1972. Its OLI-2 camera sees land in nine bands, from blue to near infrared, with 30 m pixels; its TIRS-2 sensor measures surface temperature. With Landsat 8, placed on the same orbit on the opposite side, it revisits every place every eight days.",
    refs:{ nasa:'Landsat 9 (mission page, “Quick Facts”)', eop:'Landsat-9 (eoPortal, last updated 30 August 2023)', ct:'GP elements of LANDSAT 9 (NORAD no. 49260)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      inst:{ name:'OLI-2 and TIRS-2 instruments', desc:'Both instruments, on the Earth-facing side: the OLI-2 camera (visible and near-infrared light) and the TIRS-2 thermal sensor. The model merges them into a single block: they are described separately under “Mission and instruments”.', facts:['Common swath: 185 km, 15° field of view', 'Design life: 5 years'] },
      solar:{ name:'Solar array', desc:'One large steerable array, held by a gimbal, which powers the satellite.' },
      bus:{ name:'Platform', desc:'The satellite structure (Northrop Grumman LEOStar-3 platform, the same as Landsat 8): power, attitude control, propulsion, image recording and transmission.', facts:['Platform: LEOStar-3', 'Builder: Northrop Grumman', 'Propellant for at least 10 years'] }
    },
    sections:[
      { title:'Mission', rows:[
        ['Launch', '27 September 2021, Atlas V 401, Vandenberg Space Force Base (California)'], ['Agencies', 'NASA (building, launch) and USGS (operations, archive)'],
        ['Design life', '5 years; propellant for 10 years'], ['Images', 'about 750 scenes per day'] ]},
      { title:'Orbit', rows:[
        ['Type', 'near-polar, sun-synchronous'], ['Altitude', '705 km'], ['Inclination', '98.2°'], ['Period', '99 minutes, ≈ 14.5 orbits per day'],
        ['Equator crossing', '10:12 a.m. (± 5 min) local time, descending'], ['Repeat cycle', '16 days; 8 days with Landsat 8'] ]},
      { title:'Images', rows:[
        ['Bands', '11 (9 for OLI-2, 2 for TIRS-2)'], ['Resolution', '15 m (panchromatic), 30 m (visible and infrared), 100 m (thermal)'],
        ['Scene', '185 × 180 km'], ['Quantization', '14 bits'] ]}
    ]
  }
};
