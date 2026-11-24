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
  ,
  sentinel1:{
    agency:'ESA and European Union (Copernicus programme); Thales Alenia Space satellites, Airbus radar',
    targets:['Land', 'Ice', 'Oceans'],
    desc:'The Sentinel-1 satellites of the European Copernicus programme carry a C-band radar, which sees the ground by day and night and through clouds: sea ice, glaciers, oil spills, floods, ground deformation after an earthquake. Sentinel-1C (2024) and Sentinel-1D (2025) took over from Sentinel-1B, stopped in 2022, and Sentinel-1A, stopped in June 2026.',
    refs:{ ct:'GP elements of SENTINEL-1C and -1D (NORAD nos. 62261, 66315)' },
    sections:[
      { title:'Mission', rows:[
        ['Launches', '1A: 3 April 2014; 1B: 25 April 2016; 1C: 5 December 2024; 1D: 4 November 2025'], ['Launchers', 'Soyuz (1A, 1B), Vega-C (1C), Ariane 6 (1D), from Kourou'],
        ['End of mission', '1B: August 2022; 1A: June 2026'], ['Design life', 'at least 7 years per satellite'],
        ['Satellite', '21 m long with two 10 m solar arrays and a 12 m radar antenna; 2,185 kg'] ]},
      { title:'Orbit', rows:[
        ['Type', 'near-polar, sun-synchronous'], ['Altitude', '693 km'], ['Inclination', '98.18°'], ['Period', '98.6 minutes'],
        ['Equator crossing', '6 p.m. local time, ascending'], ['Repeat cycle', '12 days per satellite; 6 days with two'] ]},
      { title:'Images', rows:[
        ['Radar', 'synthetic aperture, C band, 5.405 GHz'], ['Main mode (IW)', '250 km swath, 5 × 20 m pixels'],
        ['Other modes', 'Stripmap: 80 km, 5 × 5 m; Extra-wide: 400 km, 20 × 40 m; Wave: 20 × 20 km vignettes every 100 km'], ['Resolution', '5 × 20 m (IW mode)'] ]}
    ]
  },
  sentinel2:{
    agency:'ESA and European Union (Copernicus programme); Airbus satellites and camera',
    targets:['Land', 'Oceans'],
    desc:'The Sentinel-2 satellites photograph all land and coasts in thirteen bands, from blue to infrared, with 10 m pixels. Two satellites placed opposite each other on the same orbit revisit every place every five days at the equator: crops, forests, cities, coastal waters, disasters.',
    refs:{ ct:'GP elements of SENTINEL-2A, -2B and -2C (NORAD nos. 40697, 42063, 60989)' },
    sections:[
      { title:'Mission', rows:[
        ['Launches', '2A: 23 June 2015; 2B: 7 March 2017; 2C: 5 September 2024'], ['Launcher', 'Vega, from Kourou'], ['Design life', 'at least 7 years'],
        ['Satellite', '3.4 × 1.8 × 2.35 m; 1,140 kg including 123 kg of propellant'], ['Coverage', 'land and coasts between 84° N and 84° S'] ]},
      { title:'Orbit', rows:[
        ['Type', 'polar, sun-synchronous'], ['Altitude', '786 km'], ['Inclination', '98.62°'], ['Period', '100.6 minutes'],
        ['Equator crossing', '10:30 a.m. local time, descending'], ['Repeat cycle', '10 days per satellite; 5-day revisit with two (at the equator)'] ]},
      { title:'Images', rows:[
        ['Bands', '13, from 443 to 2,190 nm'], ['Resolution', '10 m (4 bands), 20 m (6 bands), 60 m (3 bands)'], ['Swath', '290 km'] ]}
    ]
  },
  sentinel3:{
    agency:'ESA and European Union (Copernicus programme), operated with EUMETSAT; Thales Alenia Space satellites',
    targets:['Oceans', 'Land', 'Ice'],
    desc:'The Sentinel-3 satellites mainly watch the oceans: water colour (plankton, sediments), sea and land temperature, the height of the sea, lakes and rivers. Each satellite carries a 21-band camera (OLCI), an infrared radiometer (SLSTR) and a radar altimeter (SRAL). Sentinel-3C joined the first two in September 2026.',
    refs:{ ct:'GP elements of SENTINEL-3A, -3B and -3C (NORAD nos. 41335, 43437, 100690)' },
    sections:[
      { title:'Mission', rows:[
        ['Launches', '3A: 16 February 2016; 3B: 25 April 2018; 3C: 15 September 2026'], ['Launchers', 'Rockot from Plesetsk (3A, 3B); Vega-C from Kourou (3C)'],
        ['Design life', '7 years; consumables for 12 years'], ['Satellite', '2.2 × 2.2 × 3.7 m; 1,150 kg including 130 kg of propellant'], ['Operations', 'ESA and EUMETSAT'] ]},
      { title:'Orbit', rows:[
        ['Type', 'polar, sun-synchronous'], ['Altitude', '814.5 km (mean)'], ['Inclination', '98.65°'], ['Period', '100.99 minutes'],
        ['Equator crossing', '10 a.m. local time, descending'], ['Repeat cycle', '27 days (385 orbits)'] ]},
      { title:'Images', rows:[
        ['OLCI', '21 bands from 400 to 1,020 nm, 1,270 km swath'], ['SLSTR', '9 bands from 550 to 12,000 nm, dual view: 1,400 km (nadir) and 740 km (oblique) swaths'],
        ['SRAL', 'Ku- and C-band radar altimeter (300 m after SAR processing)'], ['Resolution', '300 m (OLCI); 500 m and 1 km (SLSTR)'], ['Revisit (oceans, two satellites)', 'SLSTR ≈ 1 day, OLCI ≈ 2 days'] ]}
    ]
  },
  sentinel5p:{
    agency:'ESA, Netherlands Space Office and European Union (Copernicus); Airbus satellite; data processed by DLR',
    targets:['Atmosphere'],
    desc:'Sentinel-5P measures every day, over the whole Earth, the gases that pollute the air or warm the climate: nitrogen dioxide, ozone, carbon monoxide, methane, sulphur dioxide, as well as aerosols and clouds. Its TROPOMI spectrometer covers a 2,600 km strip with pixels a few kilometres across.',
    refs:{ ct:'GP elements of SENTINEL-5P (NORAD no. 42969)' },
    sections:[
      { title:'Mission', rows:[
        ['Launch', '13 October 2017, Rockot, from Plesetsk (Russia)'], ['Design life', 'at least 7 years; consumables for 10 years'], ['Satellite', '820 kg including 82 kg of propellant'],
        ['Agencies', 'ESA and Netherlands Space Office; data processing: DLR'] ]},
      { title:'Orbit', rows:[
        ['Type', 'polar, sun-synchronous, in formation with the US Suomi-NPP satellite'], ['Altitude', '824 km'], ['Inclination', '98.74°'], ['Period', '101 minutes'],
        ['Equator crossing', '1:30 p.m. local time, ascending'], ['Repeat cycle', '17 days (227 orbits); whole-Earth coverage every day'] ]},
      { title:'Images', rows:[
        ['Bands', 'ultraviolet and visible (270 – 495 nm), near infrared (675 – 775 nm), short-wave infrared (2,305 – 2,385 nm)'], ['Resolution', 'down to 7 × 3.5 km'], ['Swath', '2,600 km'] ]}
    ]
  },
  terra:{
    agency:'NASA, with Japan (METI, ASTER instrument) and Canada (CSA, MOPITT instrument)',
    targets:['Land', 'Atmosphere', 'Oceans'],
    desc:'Terra, the “flagship” of NASA\'s EOS programme, has observed the Earth since 1999 with five instruments: MODIS photographs the whole planet almost every day, ASTER takes detailed images, MISR looks from nine angles, CERES measures the energy received and sent back, MOPITT tracks pollution. Out of fuel, its orbit has been drifting since 2020: it passes earlier and earlier in the morning.',
    refs:{ ct:'GP elements of TERRA (NORAD no. 25994)', modis:'Aqua (eoPortal, description of MODIS)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      bus:{ name:'Platform and instruments', desc:'The body of the satellite, with its five instruments on the Earth-facing side (MODIS, ASTER, MISR, CERES, MOPITT). The model does not separate them: they are described one by one under “Mission and instruments”.', facts:['Platform: 6.8 m long, 3.5 m wide', 'Launch mass: 5,190 kg'] },
      solar:{ name:'Solar array', desc:'One large solar array at the end of an arm, which powers the satellite.' },
      antenna:{ name:'High-gain antenna', desc:'Dish antenna at the end of a mast, which sends the data to NASA\'s relay satellites.' }
    },
    sections:[
      { title:'Mission', rows:[
        ['Launch', '18 December 1999'], ['Launch mass', '5,190 kg'], ['Instruments', 'ASTER, CERES, MISR, MODIS, MOPITT; ASTER short-wave infrared data are no longer available'],
        ['Drift', 'since February 2020; crossing before 10:15 a.m. since October 2022, before 9 a.m. since December 2025'] ]},
      { title:'Orbit', rows:[
        ['Type', 'near-polar, sun-synchronous (morning crossing)'], ['Altitude', '705 km'], ['Inclination', '98.5°'], ['Period', '99 minutes, 14 orbits per day'],
        ['Equator crossing', '10:30 a.m. local time, descending (original orbit, before the drift)'], ['Repeat cycle', '16 days'] ]},
      { title:'Images', rows:[
        ['MODIS', '36 bands from 0.4 to 14.4 µm, 2,330 km swath'], ['ASTER', '14 bands; 15 m (visible), 30 m (short-wave IR), 90 m (thermal); 60 km swath'],
        ['MISR', '9 cameras, 4 bands; common swath of about 400 km'], ['Resolution', '15 m (ASTER, visible)'] ]}
    ]
  },
  aqua:{
    agency:'NASA, with Japan (JAXA, AMSR-E instrument) and Brazil (INPE, HSB instrument); TRW (Northrop Grumman) platform',
    targets:['Atmosphere', 'Oceans', 'Ice'],
    desc:'Aqua studies the water cycle: water vapour and air temperature (AIRS, AMSU), clouds and energy budget (CERES), seas, ice and vegetation (MODIS). Launched in 2002 for six years, it still works with four of its six instruments. It passes in the afternoon, three hours after Terra; out of fuel since late 2021, it is slowly sinking and passing later and later.',
    refs:{ nasa:'Aqua (mission page)', ct:'GP elements of AQUA (NORAD no. 27424)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      inst:{ name:'Instruments', desc:'The instruments on the Earth-facing side: AIRS, AMSU-A, CERES, MODIS, and the AMSR-E antenna at the end of the satellite. The model groups them in a single set.', facts:['Six instruments, four of which still work'] },
      solar:{ name:'Solar array', desc:'One large single-piece solar array.', facts:['Power: 4,860 W at end of life'] },
      bus:{ name:'Platform', desc:'The satellite structure (TRW AB1200 platform, now Northrop Grumman): power, attitude control, hydrazine propulsion, transmission.', facts:['Launch mass: 2,934 kg', 'Deployed size: 4.8 × 16.7 × 8 m'] }
    },
    sections:[
      { title:'Mission', rows:[
        ['Launch', '4 May 2002, Delta II 7920-10L, Vandenberg Air Force Base (California)'], ['Launch mass', '2,934 kg'], ['Design life', '6 years'],
        ['Instruments', 'AIRS, AMSU-A, HSB, AMSR-E, MODIS, CERES; AIRS, AMSU, CERES and MODIS still work'] ]},
      { title:'Orbit', rows:[
        ['Type', 'near-polar, sun-synchronous (afternoon crossing)'], ['Altitude', '705 km'], ['Inclination', '98.2°'], ['Period', '98.8 minutes'],
        ['Equator crossing', '1:30 p.m. local time, ascending (original orbit, before the drift)'], ['Repeat cycle', '16 days'] ]},
      { title:'Images', rows:[
        ['MODIS', '36 bands from 0.4 to 14.4 µm, 2,330 km swath'], ['AIRS', 'more than 2,300 infrared channels, 1,650 km swath'],
        ['AMSR-E', '12 channels from 6.9 to 89 GHz, swath over 1,450 km'], ['Resolution', '13.5 km (AIRS, at nadir)'] ]}
    ]
  },
  icesat2:{
    agency:'NASA; Northrop Grumman platform',
    targets:['Ice', 'Land', 'Oceans'],
    desc:'ICESat-2 measures surface height with a green laser: six beams, 10,000 pulses per second, and a telescope that counts the returning photons one by one. It tracks the thinning of the Greenland and Antarctic ice sheets, sea ice thickness, forest height.',
    refs:{ ct:'GP elements of ICESAT-2 (NORAD no. 43613)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      atlas:{ name:'ATLAS telescope', desc:'The aperture of the receiving telescope of the ATLAS laser altimeter, facing the Earth; it collects the photons of the six beams after their round trip.', facts:['Laser wavelength: 532 nm (green)', 'Six beams, in three pairs'] },
      solar:{ name:'Solar arrays', desc:'A wing of four solar panels, with its hinges.' },
      bus:{ name:'Platform and instrument', desc:'The satellite body (Northrop Grumman LEOStar-3 platform) and the rest of the ATLAS instrument, which the model does not separate.', facts:['Platform: LEOStar-3', 'Mass: 1,580 kg'] }
    },
    sections:[
      { title:'Mission', rows:[
        ['Launch', '15 September 2018'], ['Mass', '1,580 kg'], ['Design life', '3 years, 5-year goal; propellant for 7 years'], ['Instrument', 'ATLAS laser altimeter, the only instrument on board'] ]},
      { title:'Orbit', rows:[
        ['Type', 'near-polar, not sun-synchronous'], ['Altitude', '≈ 500 km'], ['Inclination', '92° (coverage up to 88° N and S)'], ['Repeat cycle', '91 days, monthly sub-cycle over the poles and oceans'] ]},
      { title:'Images', rows:[
        ['Beams', '6, in 3 pairs'], ['Footprint', '11 m'], ['Rate', '10,000 pulses per second (one every ≈ 0.7 m on the ground)'], ['Resolution', '11 m footprint every 0.7 m along the track'], ['Pointing', '45 m pointing control'] ]}
    ]
  },
  gracefo:{
    agency:'NASA (JPL) and GFZ (Germany); Airbus satellites',
    targets:['Gravity', 'Ice', 'Oceans'],
    desc:'GRACE-FO is two identical satellites flying about 220 km apart. By measuring the distance between them continuously and very precisely, they “weigh” the Earth: when they fly over a larger mass, the first one speeds up before the second. Every month this yields ice melt, falling groundwater, droughts.',
    refs:{ nasa:'GRACE-FO (mission page)', ct:'GP elements of GRACE-FO 1 and 2 (NORAD nos. 43476, 43477)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      inst:{ name:'Antennas and sensors', desc:'What sticks out of the shell: the horn of the microwave ranging (towards the other satellite), the star cameras, the GPS antennas. The laser (LRI) and the accelerometer are inside.', facts:['Ranging in K (24 GHz) and Ka (32 GHz) bands'] },
      bus:{ name:'Shell and platform', desc:'The roof-shaped shell, covered with solar cells, of one of the two twin satellites, derived from those of CHAMP, GRACE and Swarm.', facts:['About 3 × 3 × 0.8 m and 600 kg'] }
    },
    sections:[
      { title:'Mission', rows:[
        ['Launch', '22 May 2018, Falcon 9, Vandenberg, with five Iridium-NEXT satellites'], ['Satellites', 'two, about 3 × 3 × 0.8 m and 600 kg'],
        ['Science phase', 'since January 2019, planned for 5 years after launch'], ['Agencies', 'NASA (JPL) and GFZ; satellites built with Airbus'] ]},
      { title:'Orbit', rows:[
        ['Type', 'polar, both satellites on the same orbit'], ['Altitude', '≈ 490 km'], ['Inclination', '89.0° (± 0.1°)'], ['Period', '≈ 90 minutes'], ['Separation', '≈ 220 km (kept between 170 and 270 km)'] ]},
      { title:'Images', rows:[
        ['Measurement', 'change in the distance between the two satellites'], ['Microwave (KBR)', 'K (24 GHz) and Ka (32 GHz) bands'], ['Laser (LRI)', 'demonstrator, nanometre precision'], ['Resolution', 'monthly maps of the gravity field'] ]}
    ]
  },
  swot:{
    agency:'NASA and CNES, with the Canadian Space Agency and the UK Space Agency',
    targets:['Oceans', 'Land'],
    desc:'SWOT measures water height over a 120 km wide strip, rather than along a single line like classic altimeters: it sees ocean eddies about twenty kilometres across, and the height of lakes and rivers. Its KaRIn radar has two antennas at the ends of a 10 m boom.',
    refs:{ ct:'GP elements of SWOT (NORAD no. 54754)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      karin:{ name:'KaRIn radar', desc:'The 10 m boom and, at each end, an antenna of the KaRIn interferometric radar. Both antennas receive the same echo: the small path difference gives the water height on each side of the track.', facts:['10 m boom', 'KaRIn mass: 294 kg'] },
      nadir:{ name:'Poseidon-3C altimeter', desc:'The antenna of the classic altimeter, which measures straight below the satellite, in the middle of KaRIn\'s strip.' },
      solar:{ name:'Solar arrays', desc:'Two wings of solar panels.' },
      bus:{ name:'Platform', desc:'The satellite body (platform supplied by CNES) and the other instruments: AMR-S radiometer, DORIS and GPS receivers, laser reflectors.' }
    },
    sections:[
      { title:'Mission', rows:[
        ['Launch', '16 December 2022, Falcon 9'], ['Mass', '≈ 2,000 kg, including 294 kg for KaRIn'], ['Planned duration', '3 years'], ['Instruments', '6, including KaRIn and the Poseidon-3C altimeter'] ]},
      { title:'Orbit', rows:[
        ['Type', 'near-circular, not sun-synchronous'], ['Altitude', '890 km'], ['Inclination', '77.6°'], ['Repeat cycle', '21 days (science orbit since July 2023)'], ['Coverage', 'between 78° N and 78° S, 90 to 95% of the surface'] ]},
      { title:'Images', rows:[
        ['KaRIn', 'Ka-band interferometric radar, two 50 km strips on either side of the track'], ['Swath', '≈ 120 km'], ['Resolution', '15 km (ocean); eddies visible from ≈ 20 km'], ['Water bodies', 'lakes and reservoirs from 250 × 250 m'] ]}
    ]
  },
  pace:{
    name:'PACE (Plankton, Aerosol, Cloud, ocean Ecosystem)',
    agency:'NASA (Goddard center); Dutch SPEXone polarimeter',
    targets:['Oceans', 'Atmosphere'],
    desc:'PACE observes ocean colour with a spectrometer that splits light into 5 nm bands, from ultraviolet to near infrared: it can tell apart the groups of phytoplankton, the base of marine life. Two polarimeters also measure aerosols and clouds. It sees the whole Earth in two days.',
    refs:{ nasa:'PACE (mission page)', gsfc:'PACE, project site', wiki:'Plankton, Aerosol, Cloud, ocean Ecosystem', ct:'GP elements of PACE (NORAD no. 58928)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      bus:{ name:'Platform and instruments', desc:'The satellite body, built at NASA Goddard, and its three instruments: the OCI spectrometer (under its rotating telescope), the SPEXone and HARP2 polarimeters. The model merges them into a single block; they are described separately under “Mission and instruments”.', facts:['1.5 × 1.5 × 3.2 m, at most 1,700 kg with propellant'] },
      solar:{ name:'Solar array', desc:'The deployed solar array that powers the satellite.', facts:['Power: 1,000 W'] }
    },
    sections:[
      { title:'Mission', rows:[['Launch', '8 February 2024, Falcon 9, Cape Canaveral (Florida)'], ['Agency', 'NASA; satellite and OCI built at the Goddard center'], ['Planned duration', 'at least 3 years; propellant for 10 years'], ['Satellite', '1.5 × 1.5 × 3.2 m; at most 1,700 kg'] ]},
      { title:'Orbit', rows:[['Type', 'polar, sun-synchronous'], ['Altitude', '676.5 km'], ['Inclination', '98°'], ['Period', '≈ 98.3 minutes'], ['Equator crossing', '1 p.m. (± 10 min) local time'] ]},
      { title:'Images', rows:[['OCI', '315 to 895 nm in 5 nm steps, and 7 shortwave infrared bands (940 to 2,260 nm)'], ['Swath', '≈ 2,700 km (OCI): the whole Earth in 2 days'], ['Resolution', '≈ 1 km² at nadir (OCI)'], ['Polarimeters', 'HARP2: 4 colours, 1,556 km swath; SPEXone: 385 to 770 nm, 100 km swath'] ]}
    ]
  },
  jpss:{
    name:'JPSS: Suomi NPP, NOAA-20 and NOAA-21',
    agency:'NOAA (operations) and NASA (building, launch); Ball Aerospace (Suomi NPP, NOAA-20) and Northrop Grumman (NOAA-21) satellites',
    targets:['Atmosphere', 'Oceans', 'Land'],
    desc:'The US polar weather satellites of the JPSS programme circle the Earth fourteen times a day and cover all of it twice a day. Their VIIRS camera sees 22 bands, from blue to thermal infrared, over a 3,000 km swath; their sounders measure air temperature and humidity for forecasts. Suomi NPP, the first one, was switched off on 2 November 2026.',
    refs:{ eop:'Suomi NPP (eoPortal)', eopj:'JPSS (eoPortal)', npp:'Suomi NPP', n20:'NOAA-20', n21:'NOAA-21', ct:'GP elements of NOAA 20 and NOAA 21 (NORAD nos. 43013, 54234)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      bus:{ name:'Platform and instruments', desc:'The body of NOAA-20 and its instruments: the VIIRS camera, the CrIS infrared sounder, the ATMS microwave sounder, OMPS (ozone) and CERES (radiation budget). The model merges them into a single block.', facts:['Launch mass: 2,540 kg', '1.3 × 1.3 × 4.2 m'] },
      solar:{ name:'Solar array', desc:'The solar wing, on one side of the satellite.', facts:['Power: 1,932 W (NOAA-20)'] }
    },
    sections:[
      { title:'Mission', rows:[['Launches', 'Suomi NPP: 28 October 2011; NOAA-20: 18 November 2017; NOAA-21: 10 November 2022, all from Vandenberg'], ['Launchers', 'Delta II (Suomi NPP, NOAA-20), Atlas V 401 (NOAA-21)'], ['End of Suomi NPP', 'data stopped on 1 November 2026, satellite deactivated on 2 November 2026'], ['Design life', '7 years (NOAA-20)'] ]},
      { title:'Orbit', rows:[['Type', 'polar, sun-synchronous; NOAA-21 on the same orbit as NOAA-20'], ['Altitude', '≈ 833 km'], ['Inclination', '98.75°'], ['Period', '≈ 101 minutes, ≈ 14 orbits per day'], ['Coverage', 'the whole Earth twice a day'] ]},
      { title:'Images', rows:[['VIIRS', '22 bands, from 412 nm to 12 µm'], ['Swath', '3,000 km'], ['Resolution', '0.4 km at nadir (fine bands)'], ['Other instruments', 'CrIS, ATMS, OMPS; CERES on NOAA-20'] ]}
    ]
  },
  smap:{
    name:'SMAP (Soil Moisture Active Passive)',
    agency:'NASA (JPL), with the Canadian Space Agency',
    targets:['Land', 'Ice', 'Oceans'],
    desc:'SMAP measures the moisture of the top centimetres of soil and detects frozen ground. Its radiometer picks up the faint microwave radiation emitted by the Earth, weaker when the soil is wet. A 6 m antenna, spinning on itself, sweeps a 1,000 km strip: the whole Earth in three days.',
    refs:{ nasa:'SMAP (mission page)', wiki:'Soil Moisture Active Passive', ct:'GP elements of SMAP (NORAD no. 40376)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      reflector:{ name:'6 m antenna', desc:'The large mesh reflector, which spins and sweeps the ground in a circle on either side of the track. The radiometer and the radar (failed since 2015) share this reflector.', facts:['Diameter ≈ 6 m', 'Radiometer footprint ≈ 40 km'] },
      boom:{ name:'Reflector boom', desc:'The deployable boom that holds the reflector above the microwave feed.' },
      solar:{ name:'Solar array', desc:'The satellite\'s solar array.', facts:['Power: 1,450 W'] },
      bus:{ name:'Platform', desc:'The satellite body, with the instrument electronics and the mechanism that spins the antenna.', facts:['Launch mass: 944 kg'] }
    },
    sections:[
      { title:'Mission', rows:[['Launch', '31 January 2015, Delta II 7320, Vandenberg Air Force Base'], ['Mass', '944 kg'], ['Instruments', 'L-band radiometer (1.41 GHz); L-band radar stopped in July 2015 after a failure'], ['Agencies', 'NASA (JPL); Canadian Space Agency'] ]},
      { title:'Orbit', rows:[['Type', 'sun-synchronous, dawn-dusk'], ['Altitude', '685 km'], ['Inclination', '98°'], ['Period', '98.5 minutes'], ['Equator crossing', '6 p.m. local time, ascending'], ['Repeat cycle', '8 days; global map every 3 days'] ]},
      { title:'Images', rows:[['Swath', '1,000 km'], ['Resolution', '≈ 40 km (radiometer footprint); moisture maps on a 9 km grid'], ['Depth', 'the top 2 to 5 centimetres of soil'] ]}
    ]
  },
  oco2:{
    name:'OCO-2 (Orbiting Carbon Observatory 2)',
    agency:'NASA (JPL); Orbital Sciences satellite',
    targets:['Atmosphere', 'Land'],
    desc:'OCO-2 measures the carbon dioxide in the air. Its three spectrometers analyse sunlight reflected by the Earth: CO₂ and oxygen absorb some of its colours. From this it derives the average amount of CO₂ through the whole height of the atmosphere, along a narrow 10 km strip, in small 1.3 × 2.3 km footprints.',
    refs:{ wiki:'Orbiting Carbon Observatory 2', ct:'GP elements of OCO 2 (NORAD no. 40059)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      bus:{ name:'Platform and instrument', desc:'The satellite body (Orbital Sciences LEOStar-2 platform) and the instrument: three grating spectrometers sharing one telescope; a cryocooler keeps their detectors very cold to reduce noise.', facts:['Launch mass: 449 kg', 'Detectors cooled by a cryocooler'] },
      solar:{ name:'Solar arrays', desc:'The two solar wings.', facts:['Power: 815 W'] }
    },
    sections:[
      { title:'Mission', rows:[['Launch', '2 July 2014, Delta II 7320, Vandenberg Air Force Base'], ['Mass', '449 kg'], ['Planned duration', '2 years'], ['Context', 'replaces OCO, lost at launch in 2009'] ]},
      { title:'Orbit', rows:[['Type', 'polar, sun-synchronous; in the “afternoon train” (A-Train)'], ['Altitude', '705 km'], ['Inclination', '98.2°'], ['Period', '98.8 minutes'], ['Equator crossing', 'around 1:30 p.m. local time, ascending'], ['Repeat cycle', '16 days'] ]},
      { title:'Images', rows:[['Bands', '3: oxygen (≈ 0.76 µm), weak CO₂ (≈ 1.61 µm), strong CO₂ (≈ 2.06 µm)'], ['Swath', '10 km'], ['Resolution', '1.29 × 2.25 km per measurement'] ]}
    ]
  },
  gpm:{
    name:'GPM (Global Precipitation Measurement), core observatory',
    agency:'NASA and JAXA',
    targets:['Atmosphere', 'Oceans'],
    desc:'The GPM core observatory measures rain and snow. Its dual-frequency radar sees rain in three dimensions, drops and snowflakes included; its microwave radiometer serves as the reference for other weather satellites. Together they give a global precipitation map every half hour (IMERG).',
    refs:{ wiki:'Global Precipitation Measurement', ct:'GP elements of GPM-CORE (NORAD no. 39574)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      gmi:{ name:'GMI radiometer', desc:'The antenna of the GMI microwave radiometer, on top of the satellite: it spins and sweeps a cone ahead.', facts:['13 channels, from 10 to 183 GHz', '885 km swath'] },
      bus:{ name:'Platform and DPR radar', desc:'The satellite body, built at the Goddard center, with, underneath, the two flat antennas of the DPR radar supplied by JAXA. The model merges the radar and the platform.', facts:['13 × 6.5 × 5 m', 'Mass: ≈ 3,850 kg'] }
    },
    sections:[
      { title:'Mission', rows:[['Launch', '27 February 2014, H-IIA, Tanegashima (Japan)'], ['Mass', '≈ 3,850 kg'], ['Planned duration', '3 years; propellant for 5 years'], ['Agencies', 'NASA (satellite, GMI) and JAXA (DPR radar, launch)'] ]},
      { title:'Orbit', rows:[['Type', 'circular, not sun-synchronous (varying overpass time)'], ['Altitude', '407 km'], ['Inclination', '65°'], ['Coverage', 'between ≈ 65° N and 65° S'] ]},
      { title:'Images', rows:[['DPR radar', 'Ku (13.6 GHz) and Ka (35.5 GHz) bands; 245 km swath for both since May 2018'], ['GMI radiometer', '13 channels from 10 to 183 GHz; 885 km swath'], ['Resolution', '5 km at nadir (DPR)'] ]}
    ]
  },
  nisar:{
    name:'NISAR (NASA-ISRO Synthetic Aperture Radar)',
    agency:'NASA (JPL: L-band radar, reflector) and ISRO (S-band radar, platform, launch)',
    targets:['Land', 'Ice'],
    desc:'NISAR, a joint mission of NASA and the Indian space agency, carries two radars (L and S bands) sharing a 12 m reflector, unfolded at the end of a 9 m boom. It revisits all land and ice every 12 days and measures ground deformation to the centimetre: earthquakes, volcanoes, landslides, glaciers.',
    refs:{ nasa:'NISAR (mission page)', wiki:'NISAR (satellite)', ct:'GP elements of NISAR (NORAD no. 65053)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      reflector:{ name:'12 m reflector', desc:'The large mesh reflector shared by both radars: it illuminates the whole 242 km swath.', facts:['Diameter: 12 m'] },
      boom:{ name:'9 m boom', desc:'The deployable boom that holds the reflector in front of the radar antennas.', facts:['Length: 9 m'] },
      solar:{ name:'Solar arrays', desc:'The satellite\'s solar arrays.', facts:['Power: 6,500 W'] },
      bus:{ name:'Platform and radars', desc:'ISRO\'s I-3K platform and, above it, the structure carrying the electronics and the feed antennas of the L-band (NASA) and S-band (ISRO) radars.', facts:['I-3K platform (ISRO)', 'Launch mass: 2,393 kg'] }
    },
    sections:[
      { title:'Mission', rows:[['Launch', '30 July 2025, GSLV-F16, Satish Dhawan Space Centre (India)'], ['Mass', '2,393 kg'], ['Planned duration', '3 years; propellant for 5 years'], ['Agencies', 'NASA (JPL) and ISRO'] ]},
      { title:'Orbit', rows:[['Type', 'sun-synchronous, dawn-dusk'], ['Altitude', '747 km'], ['Inclination', '98.4°'], ['Repeat cycle', '12 days, ascending and descending'] ]},
      { title:'Images', rows:[['L-SAR radar', 'L band, 1.25 GHz (24 cm)'], ['S-SAR radar', 'S band, 3.2 GHz'], ['Swath', '242 km'], ['Resolution', '3 to 10 m depending on mode'] ]}
    ]
  },
  aura:{
    agency:'NASA, with the Netherlands and Finland (OMI) and the United Kingdom (HIRDLS)',
    targets:['Atmosphere'],
    desc:'Aura studies the chemistry of the atmosphere: the ozone layer, air pollution and climate. Its OMI spectrometer sees ozone, nitrogen dioxide and aerosols over a 2,600 km swath; MLS measures ozone and other gases layer by layer, looking at the edge of the atmosphere. Launched in 2004, it has far outlived its planned six years.',
    refs:{ nasa:'Aura (mission page)', wiki:'Aura (satellite)', ct:'GP elements of AURA (NORAD no. 28376)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      inst:{ name:'Instruments', desc:'The four instruments, mounted on the platform: MLS (microwaves, looking ahead), HIRDLS (infrared, stopped in 2008), TES (infrared) and OMI (ultraviolet and visible, looking down).', facts:['OMI: 270 to 500 nm, 2,600 km swath'] },
      solar:{ name:'Solar array', desc:'The large solar wing; its output, which declines with age, is expected to limit the mission\'s length.' },
      bus:{ name:'Platform', desc:'TRW\'s modular AB1200 platform, the same as Aqua\'s.', facts:['Mass: ≈ 3,000 kg'] }
    },
    sections:[
      { title:'Mission', rows:[['Launch', '15 July 2004, Delta II 7920, Vandenberg Air Force Base'], ['Mass', '≈ 3,000 kg'], ['Planned duration', '6 years'], ['Instruments', 'MLS, OMI, TES; HIRDLS failed in 2008'] ]},
      { title:'Orbit', rows:[['Type', 'polar, sun-synchronous; in the “afternoon train” (A-Train)'], ['Altitude', '705 km'], ['Inclination', '98.2°'], ['Period', '98.8 minutes'], ['Equator crossing', '1:45 p.m. local time, ascending (originally)'], ['Repeat cycle', '16 days'] ]},
      { title:'Images', rows:[['OMI', 'spectrometer from 270 to 500 nm; 2,600 km swath'], ['Resolution', '13 × 24 km at nadir (OMI)'], ['MLS', 'microwaves, looking at the edge of the atmosphere: vertical profiles of ozone and other gases'] ]}
    ]
  },
  tempo:{
    name:'TEMPO (Tropospheric Emissions: Monitoring of Pollution)',
    agency:'NASA (Langley center) and Smithsonian Astrophysical Observatory; Ball Aerospace instrument, hosted by the Intelsat 40e communications satellite (Maxar)',
    targets:['Atmosphere'],
    desc:'TEMPO is a spectrometer mounted on a communications satellite, in geostationary orbit above North America. It stays facing the continent and scans it every hour in daytime, from Mexico City to the Canadian oil sands: ozone, nitrogen dioxide, formaldehyde. One can watch city pollution rise and fall over the day.',
    refs:{ nasa:'TEMPO (mission page)', wiki:'Tropospheric Emissions: Monitoring of Pollution', is40:'Intelsat 40e', ct:'GP elements of INTELSAT 40E, which carries TEMPO (NORAD no. 56174)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      bus:{ name:'Host satellite and TEMPO', desc:'The body of the Intelsat 40e communications satellite (Maxar platform), on whose face the TEMPO instrument is mounted, facing the Earth. The model does not separate the instrument.', facts:['Instrument: 1.4 × 1.1 × 1.2 m, 148 kg', 'Host satellite: 5,440 kg at launch'] },
      antenna:{ name:'Communications antennas', desc:'The antennas of Intelsat 40e, whose primary mission is relaying communications; they are not used by TEMPO.' },
      solar:{ name:'Solar arrays', desc:'The two solar wings of the host satellite.' }
    },
    sections:[
      { title:'Mission', rows:[['Launch', '7 April 2023, Falcon 9, Cape Canaveral, aboard Intelsat 40e'], ['Instrument', '1.4 × 1.1 × 1.2 m; 148 kg; built by Ball Aerospace'], ['Leads', 'Smithsonian Astrophysical Observatory (science, operations center); NASA Langley (project)'], ['Host satellite', 'Intelsat 40e, communications, planned for 15 years'] ]},
      { title:'Orbit', rows:[['Type', 'geostationary: the satellite stays above the same point of the equator'], ['Altitude', '≈ 35,786 km'], ['Position', '91° west'] ]},
      { title:'Images', rows:[['Spectrum', '290 to 490 nm and 540 to 740 nm; 0.57 nm spectral resolution'], ['Resolution', '2.2 × 5 km on the ground (2.21 × 4.97 km at the centre of the area)'], ['Frequency', 'one scan per hour, in daytime'], ['Area', 'North America, from Mexico City to the Canadian oil sands, from the Atlantic to the Pacific'] ]}
    ]
  },
  goes:{
    name:'GOES-East (GOES-19)',
    agency:'NOAA (operations) and NASA (building, launch); Lockheed Martin satellite, L3Harris imager',
    targets:['Atmosphere', 'Oceans'],
    desc:'GOES-19 is the US geostationary weather satellite that watches the eastern Americas and the Atlantic, as GOES-East. Its ABI imager photographs the whole Earth disk every ten minutes in 16 bands, and some areas every minute: thunderstorms, hurricanes, fires, fog. Its GLM detector counts lightning.',
    refs:{ eop:'GOES-R series (eoPortal)', wiki:'GOES-19', ct:'GP elements of GOES 19 (NORAD no. 60133)' },
    sections:[
      { title:'Mission', rows:[['Launch', '25 June 2024, Falcon Heavy, Kennedy Space Center (Florida)'], ['Entered service', '7 April 2025, as GOES-East'], ['Series', 'last of the four GOES-R satellites (GOES-16 to 19)'], ['Builder', 'Lockheed Martin'] ]},
      { title:'Orbit', rows:[['Type', 'geostationary'], ['Altitude', '≈ 35,786 km'], ['Position', '75.2° west'] ]},
      { title:'Images', rows:[['ABI imager', '16 bands: 2 visible, 4 near-infrared, 10 infrared'], ['Resolution', '0.5 km (visible), 1 km (near infrared), 2 km (infrared)'], ['Frequency', 'full disk every 10 min; United States every 5 min; small areas every 30 to 60 s'], ['Lightning', 'GLM detector, which maps lightning continuously'] ]}
    ]
  },
  sentinel6:{
    name:'Sentinel-6 Michael Freilich and Sentinel-6B',
    agency:'European Union (Copernicus), ESA, EUMETSAT, NASA, NOAA, with CNES; Airbus satellites',
    targets:['Oceans'],
    desc:'The Sentinel-6 satellites are the reference altimeters for ocean level: they extend the record begun in 1992 with TOPEX/Poseidon, then the Jason satellites. Their Poseidon-4 radar measures sea height straight below the satellite; in ten days they cover 95% of the oceans. Sentinel-6B was launched in November 2025.',
    refs:{ eop:'Copernicus: Sentinel-6 (eoPortal)', wiki:'Sentinel-6 Michael Freilich', wikib:'Sentinel-6B', ct:'GP elements of SENTINEL-6A and -6B (NORAD nos. 46984, 66514)' },
    model:{ license:'NASA/JPL-Caltech, free use (NASA media usage guidelines, which cover 3D models)' },
    parts:{
      poseidon:{ name:'Poseidon-4 altimeter', desc:'The antenna of the radar altimeter, facing the Earth: it sends radar pulses straight down and times their echo from the sea.' },
      amr:{ name:'AMR-C radiometer', desc:'The microwave radiometer, supplied by NASA: it measures water vapour in the air, which slows radar waves, to correct the measured height.' },
      doris:{ name:'DORIS antenna', desc:'The receiver of the French DORIS system, which locates the satellite to the centimetre using a network of ground beacons.' },
      gnss:{ name:'GNSS antennas', desc:'The antennas of the satellite navigation (GNSS) receivers, for precise orbit determination (POD) and radio occultation (atmospheric temperature profiles).' },
      lra:{ name:'Laser reflector', desc:'The retroreflector, targeted from the ground by laser stations to check the orbit.' },
      solar:{ name:'Solar arrays', desc:'The satellite\'s solar arrays.', facts:['Power: 891 W'] },
      bus:{ name:'Platform', desc:'The platform, built by Airbus, with its sloping roof.', facts:['Mass: 1,192 kg', '5.13 × 4.17 × 2.34 m'] }
    },
    sections:[
      { title:'Mission', rows:[['Launches', 'Sentinel-6 Michael Freilich: 21 November 2020; Sentinel-6B: 17 November 2025; Falcon 9, Vandenberg'], ['Mass', '1,192 kg'], ['Planned duration', '5.5 years per satellite'], ['Role', 'reference altimetry mission, following Jason-3'] ]},
      { title:'Orbit', rows:[['Type', 'not sun-synchronous'], ['Altitude', '1,336 km'], ['Inclination', '66°'], ['Repeat cycle', '≈ 10 days'] ]},
      { title:'Images', rows:[['Altimeter', 'Poseidon-4 radar, looking straight down'], ['Coverage', '95% of the oceans'], ['Other instruments', 'AMR-C radiometer, DORIS, GNSS, laser reflector, GNSS radio occultation'] ]}
    ]
  }
};
