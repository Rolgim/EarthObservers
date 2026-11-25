// Pièces des maquettes Sentinel-1, -2 et -3 de Space Radar (MIT) : chaque îlot est rangé d'après sa place et sa taille,
// relevées sur les rendus six vues (render.py) et sur les dimensions citées par Space Radar (pages models.spaceradar.ai/sentinel-N/).
// Repère de Space Radar : +Z vers la Terre. Usage : node sentinel_parts.js 1|2|3 entrée.glb sortie.glb
const { segment } = require('./seg_lib.js');
const sz = c => c.max.map((v, k) => v - c.min[k]);
const C = {
  // Sentinel-1 : antenne radar de 12,3 m le long de X (14 tuiles et son liseré doré), deux ailes solaires de 10 m, plateforme de 3,4 × 1,3 × 1,3 m.
  1: (c, node, mat) => {
    const s = sz(c), [x, y, z] = c.ctr;
    if (node === 'solar-panel' || Math.hypot(y, z) > 1.3) return 'solar';
    if (s[0] > 4 || (/e3e7ed/.test(mat) && s[0] > 0.7 && s[0] < 0.95 && z > 0.3) || (Math.abs(x) > 1.75 && Math.abs(y) < 1.2)) return 'sar';
    return 'bus';
  },
  // Sentinel-2 : aile solaire vers +X (plateforme de ±0,92 m) ; l'instrument MSI occupe le haut (Y > 0,3 m : 1,4 m sur 3,4 m).
  // (la fenêtre sombre de MSI est rangée par Space Radar dans le nœud « solar-panel » : seule la place compte ici)
  2: c => {
    const [x, y] = c.ctr;
    if (x > 0.95) return 'solar';
    return y > 0.3 ? 'msi' : 'bus';
  },
  // Sentinel-3 : aile solaire vers +X (plateforme de ±1,1 m) ; sur la face Terre (+Z) : parabole de SRAL en bas,
  // boîtier à deux ouvertures courbes (SLSTR) au milieu, OLCI et ses cinq objectifs en haut, réflecteur doré du MWR au coin.
  3: (c, node, mat) => {
    const [x, y, z] = c.ctr;
    if (node === 'solar-panel' || x > 1.15) return 'solar';
    if (/d9b25c/.test(mat)) return 'mwr';
    if (z > 0.95 && y < -0.6) return 'sral';
    if (z > 0.95 && y > 1.1) return 'olci';
    if (z > 0.95 && y > -0.6) return 'slstr';
    return 'bus';
  }
};
const [n, src, dst] = process.argv.slice(2);
segment(src, dst, C[n]).then(s => console.log('S' + n, JSON.stringify(s)));
