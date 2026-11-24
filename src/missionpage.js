/* =================================================================
   PAGE « MISSION ET INSTRUMENTS » d'un satellite, reprise de SolarExplorers (src/missionpage.js) :
   sous-pages à gauche (vue d'ensemble, mission et traitements, orbite, un instrument par entrée), contenu à droite.
   Données : INST_DATA (data-inst.js), MISSION (data-mission.js), relevé des catalogues (data/cat.json), éléments orbitaux
   (data/tle.json), DATA_FILES (data/*.json).
   Chaque valeur chiffrée porte un numéro de source (règle 1) ; les classements approchés sont signalés par « ≈ » (règle 2).
   MissionPage.html(m, sec, extra) rend la route #<id>-donnees[-<sec>] ; extra = { traj, real } (fonctions de app.js).
================================================================= */
var MissionPage = (function(){
'use strict';
function en(){ return OBS_LANG === 'en'; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function num(v, d){ var t = v.toFixed(d); if (t.indexOf('.') >= 0) t = t.replace(/0+$/,'').replace(/\.$/,''); return en() ? t : t.replace('.', ','); }
function big(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, en() ? ',' : '\u202f'); }
function host(u){ return u.replace(/^https?:\/\//,'').replace(/\/.*$/,''); }
/* longueur d'onde en µm → texte lisible (nm, µm, mm, cm, m) */
function wl(um){
  if (um < 1) return num(um * 1000, um * 1000 < 100 ? 1 : 0) + ' nm';
  if (um < 1000) return num(um, um < 10 ? 2 : 1) + ' µm';
  if (um < 1e4) return num(um / 1000, 1) + ' mm';
  if (um < 1e6) return num(um / 1e4, 1) + ' cm';
  return num(um / 1e6, 1) + ' m';
}
function span(lo, hi){ var a = wl(lo), b = wl(hi); return a === b ? a : a + ' – ' + b; }
function range(it){ if (!it.bands || !it.bands.length) return L('hors spectre', 'not spectral');
  var lo = Math.min.apply(null, it.bands.map(function(b){ return b.lo; })), hi = Math.max.apply(null, it.bands.map(function(b){ return b.hi; }));
  return span(lo, hi); }
function color(it){ return (INST_TYPES[it.type] || INST_TYPES.radio).c; }
function kind(it){ return (INST_TYPES[it.type] || INST_TYPES.radio).l; }
function CAT(){ return (window.DATA_FILES || {}).cat || { cols:{}, cats:{} }; }
function cols(m, it){ return (CAT().cols[m.id] || []).filter(function(c){ return !it || c.inst === it.id; }); }
/* niveau de traitement : celui que déclare l'archive (CMR), sinon celui du nom de la collection (l1, l2…) */
function lvl(c){ var x = String(c.level || '').match(/\d/) || String(c.id).match(/(?:^|[-_])l(\d)/i); return x ? (x[1] || x[0]) : '?'; }
function catName(c){ var k = CAT().cats[c.cat]; return k ? k.label : c.cat; }
function period(c){ var a = c.first || (c.period || [])[0], b = c.last || (c.period || [])[1]; return (a ? String(a).slice(0, 10) : '…') + ' → ' + (b ? String(b).slice(0, 10) : L('en cours', 'ongoing')); }

/* ---------- sources : refs de la mission (MISSION), des instruments (INST_DATA), de la fiche (MISSIONS) et générales ---------- */
function refsOf(m){
  var r = {}, k, all = [m.refs || {}, (INST_DATA[m.id] || {}).refs || {}, (MISSION[m.id] || {}).refs || {}, MISSION_REFS];
  all.forEach(function(o){ for (k in o) r[k] = o[k]; }); return r;
}
function Marks(m){
  var refs = refsOf(m), nums = {}, n = 0;
  return {
    mark:function(keys){ var ks = [].concat(keys || []).filter(function(x){ return refs[x]; }); if (!ks.length) return '';
      return '<sup class="ref">' + ks.map(function(x){ if (!nums[x]) nums[x] = ++n; return '<a href="#ref-' + nums[x] + '" data-ref="' + nums[x] + '" aria-label="' + esc(L('source ', 'source ') + nums[x]) + '">' + nums[x] + '</a>'; }).join(',') + '</sup>'; },
    list:function(checked){
      var keys = Object.keys(nums).sort(function(a, b){ return nums[a] - nums[b]; }); if (!keys.length) return '';
      var c = (checked || '').split('-');
      return '<div class="isec wide"><h3>' + L('Sources', 'Sources') + '</h3><ol class="refs">' + keys.map(function(k){ var x = refs[k];
        return '<li id="ref-' + nums[k] + '"><a href="' + esc(x.u) + '" target="_blank" rel="noopener">' + esc(OBS_T(x.t)) + '</a> <span>' + esc(x.p) + '</span></li>'; }).join('') + '</ol>' +
        (checked ? '<p class="source-note">' + (en() ? 'Checked against the sources above on ' + checked + '.' : 'Vérifié le ' + c[2] + '/' + c[1] + '/' + c[0] + ' face aux sources ci-dessus.') + '</p>' : '') + '</div>';
    }
  };
}

/* ---------- couverture spectrale : axe logarithmique de l'ultraviolet à la radio ---------- */
var TICKS = [0.1, 0.3, 1, 3, 10, 30, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8];
function coverage(m, sel){
  var list = INST_DATA[m.id].instruments.filter(function(it){ return it.bands && it.bands.length; });
  if (!list.length) return '';
  var lo = Infinity, hi = 0; list.forEach(function(it){ it.bands.forEach(function(b){ lo = Math.min(lo, b.lo); hi = Math.max(hi, b.hi); }); });
  lo = Math.pow(10, Math.floor(Math.log(lo) / Math.LN10 * 2) / 2); hi = Math.pow(10, Math.ceil(Math.log(hi) / Math.LN10 * 2) / 2);
  var W = 560, Lm = 80, R = 14, a = Math.log(lo), b = Math.log(hi);
  function X(v){ return Lm + (Math.log(Math.max(lo, Math.min(hi, v))) - a) / (b - a) * (W - Lm - R); }
  var y = 30, rows = list.map(function(it){ var r = { it:it, y:y, h:it.bands.length > 1 && overlap(it.bands) ? it.bands.length * 15 + 9 : 24 }; y += r.h; return r; });
  function overlap(bs){ for (var i = 1; i < bs.length; i++) if (bs[i].lo < bs[i - 1].hi) return true; return false; }
  var s = '<svg class="cov" viewBox="0 0 ' + W + ' ' + (y + 34) + '" role="group" aria-label="' + esc(L('Couverture spectrale des instruments de ', 'Spectral coverage of the instruments of ') + m.short) + '">' +
    '<defs><linearGradient id="gvis" x1="0" x2="1"><stop offset="0" stop-color="#7a5cff"/><stop offset="0.25" stop-color="#3fa0ff"/><stop offset="0.5" stop-color="#5fe07a"/><stop offset="0.72" stop-color="#ffd85a"/><stop offset="1" stop-color="#ff5a4a"/></linearGradient></defs>';
  if (lo < 0.75 && hi > 0.38){ s += '<rect x="' + X(0.38) + '" y="22" width="' + (X(0.75) - X(0.38)) + '" height="' + (y - 22) + '" fill="url(#gvis)" opacity="0.26"/><text class="cov-vis" x="' + ((X(0.38) + X(0.75)) / 2) + '" y="14" text-anchor="middle">' + L('visible', 'visible') + '</text>'; }
  var last = -99; TICKS.forEach(function(v){ if (v < lo || v > hi) return; var x = X(v); if (x - last < 38) return; last = x;
    s += '<line class="cov-grid" x1="' + x + '" y1="22" x2="' + x + '" y2="' + y + '"/><text class="cov-tick" x="' + x + '" y="' + (y + 15) + '" text-anchor="middle">' + wl(v).replace(/^0,|^0\./, en() ? '0.' : '0,') + '</text>'; });
  s += '<line class="cov-axis" x1="' + Lm + '" y1="' + y + '" x2="' + (W - R) + '" y2="' + y + '"/><text class="cov-unit" x="' + (W - R) + '" y="' + (y + 30) + '" text-anchor="end">' + L('longueur d\'onde, échelle logarithmique', 'wavelength, logarithmic scale') + '</text>';
  rows.forEach(function(r){
    var it = r.it, st = overlap(it.bands);
    s += '<g class="cov-row' + (it.id === sel ? ' sel' : '') + '"><a href="#' + m.id + '-donnees-' + it.id + '" aria-label="' + esc(it.name) + '"><rect x="0" y="' + r.y + '" width="' + W + '" height="' + r.h + '" fill="transparent"/>' +
      '<text class="cov-lab" x="4" y="' + (r.y + r.h / 2 + 4) + '">' + esc(it.name) + '</text>';
    it.bands.forEach(function(bd, i){ var x0 = X(bd.lo), w = Math.max(3, X(bd.hi) - x0), yy = r.y + 5 + (st ? i * 15 : 0);
      s += '<rect x="' + x0.toFixed(1) + '" y="' + yy + '" width="' + w.toFixed(1) + '" height="13" rx="2" fill="' + color(it) + '"' + (sel && it.id !== sel ? ' opacity="0.35"' : '') + '><title>' + esc(it.name + ' ' + bd.l + ' : ' + wl(bd.lo) + ' – ' + wl(bd.hi)) + '</title></rect>'; });
    s += '</a></g>';
  });
  return '<div class="svgwrap">' + s + '</svg></div>';
}

/* ---------- briques ---------- */
function table(rows, mk){
  return '<div class="stable">' + rows.map(function(r){ return '<div class="srow"><div class="k">' + esc(r[0]) + '</div><div class="v">' + esc(OBS_NUM(r[1])) + (mk ? mk.mark(r[2]) : '') + '</div></div>'; }).join('') + '</div>';
}
var copyStore = [];
function code(text){ copyStore.push(text); return '<div class="codewrap"><pre class="code" tabindex="0" aria-label="' + L('Code', 'Code') + '">' + esc(text) + '</pre><button class="copy" data-copy="' + (copyStore.length - 1) + '">' + L('Copier', 'Copy') + '</button></div>'; }
function navItem(m, sec, cur, n, k, c){
  var on = sec === cur, h = '#' + m.id + '-donnees' + (sec ? '-' + sec : '');
  return '<a class="nav-i' + (on ? ' on' : '') + '" href="' + h + '"' + (on ? ' aria-current="page"' : '') + (c ? ' style="--c:' + c + '"' : '') + '><span class="n">' + esc(n) + '</span><span class="k">' + esc(k) + '</span></a>';
}
function get(m, id){ var a = INST_DATA[m.id].instruments; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
function realInst(m){ var key = m.real && m.real.key, d = key && (window.DATA_FILES || {})[key]; if (!d) return null;
  var n = String(d.instrument || '').toUpperCase(); return INST_DATA[m.id].instruments.filter(function(it){ return n.indexOf(it.name.toUpperCase()) >= 0; })[0] || null; }

/* ---------- vue d'ensemble ---------- */
function overview(m, X){
  var d = INST_DATA[m.id], mk = Marks(m), s = '';
  s += '<div class="inst-head"><div class="inst-h"><h2 class="inst-name">' + esc(L('Instruments de ', 'Instruments of ') + m.short) + '</h2><div class="inst-full">' + d.instruments.length + ' ' + L('instruments ou expériences. Cliquer une ligne du graphique ou une case pour ouvrir le détail.', 'instruments or investigations. Click a row of the chart or a card to open its page.') + '</div></div><p class="inst-sum">' + esc(d.summary) + '</p></div>';
  s += '<div class="inst-cols"><div class="isec"><h3>' + L('Couverture spectrale', 'Spectral coverage') + '</h3>' + coverage(m, null) +
    '<div class="cap">' + L('Plages reprises des pages d\'instruments, où chaque valeur renvoie à sa source. Les expériences de particules, de champs et de radioscience n\'ont pas de bande d\'observation : elles n\'apparaissent pas ici.', 'Ranges taken from the instrument pages, where each value cites its source. Particle, field and radio science investigations have no observing band and are not shown here.') + '</div></div>';
  var all = cols(m), cd = CAT().fetched;
  s += '<div class="isec"><h3>' + L('Données dans les catalogues', 'Data in the catalogues') + '</h3>' + (all.length ? table(all.map(function(c){
      var it = get(m, c.inst);
      return [(it ? it.name : c.inst) + ' · ' + c.id, (c.matched != null ? big(c.matched) + ' ' + (c.sat_filter ? L('produits de ce satellite', 'products from this satellite') : L('produits (toute la collection)', 'products (whole collection)')) : L('nombre non publié', 'count not published')) + ' · ' + catName(c), 'cat']; }), mk) +
    '<div class="cap">' + L('Relevé des catalogues le ', 'Catalogues surveyed on ') + esc(cd) + L('. Une même scène figure dans plusieurs collections (niveau 1, niveau 2…).', '. One scene appears in several collections (level 1, level 2…).') + '</div>'
    : '<p class="note">' + L('Catalogues pas encore relevés (workflow « Données réelles »).', 'Catalogues not surveyed yet (“Real data” workflow).') + '</p>') + '</div>';
  s += '<div class="isec wide"><h3>' + L('Instruments', 'Instruments') + '</h3><div class="icards">' + d.instruments.map(function(it){
    return '<a class="icard" style="--c:' + color(it) + '" href="#' + m.id + '-donnees-' + it.id + '"><span class="ic-n">' + esc(it.name) + '</span><span class="ic-k">' + esc(kind(it)) + '</span><span class="ic-r">' + esc(range(it)) + '</span></a>';
  }).join('') + '</div></div>';
  if (!realInst(m)) s += '<div class="isec wide"><h3>' + L('Une donnée réelle', 'Real data') + '</h3>' + X.real(m) + '</div>';
  s += '<div class="isec wide"><h3>' + L('Archives et documentation', 'Archives and documentation') + '</h3><div class="archs">' + d.archives.map(function(a){
    return '<a class="arch" href="' + esc(a.url) + '" target="_blank" rel="noopener"><span class="a-l">' + esc(a.label) + '</span><span class="a-d">' + esc(a.desc) + '</span><span class="a-u">' + esc(host(a.url)) + '</span></a>';
  }).join('') + '</div></div>';
  return s + mk.list() + '</div>';
}

/* ---------- mission et traitements ---------- */
function missionSec(m){
  var M = MISSION[m.id], mk = Marks(m), s = '';
  s += '<div class="inst-head"><div class="inst-h"><h2 class="inst-name">' + L('Mission et traitements', 'Mission and processing') + '</h2><div class="inst-full">' + esc(m.name) + '</div></div><p class="inst-sum">' + esc(M.intro) + '</p></div><div class="inst-cols">';
  s += '<div class="isec"><h3>' + L('Déroulé', 'Timeline') + '</h3><ol class="ms-tl">' + M.phases.map(function(p){
    return '<li><span class="ms-d">' + esc(p[0]) + '</span><div><strong>' + esc(p[1]) + '</strong>' + mk.mark(p[3]) + '<p>' + esc(OBS_NUM(p[2])) + '</p></div></li>'; }).join('') + '</ol></div>';
  s += '<div class="isec"><h3>' + L('Exploitation', 'Operations') + '</h3>' + table(M.ops, mk) + '</div>';
  /* chaîne : collections relevées dans les catalogues, rangées par niveau de traitement de la NASA */
  var by = {}; cols(m).forEach(function(c){ (by[lvl(c)] = by[lvl(c)] || []).push(c); });
  s += '<div class="isec wide"><h3>' + L('Chaîne de traitement', 'Processing chain') + '</h3><p class="ms-intro">' +
    L('Les mesures passent par des niveaux de traitement normalisés, du flux brut de l\'instrument aux cartes', 'Measurements go through standard processing levels, from the raw instrument stream to maps') + mk.mark('levels') +
    L('. Voici les collections du satellite relevées dans les catalogues, rangées par niveau', '. Here are the satellite\'s collections found in the catalogues, sorted by level') + mk.mark('cat') + '.</p><ol class="ms-chain">' +
    MISSION_LEVELS.map(function(v){ var a = by[v[0]] || [];
      return '<li><div class="ms-lv">' + L('Niveau ', 'Level ') + v[0] + '</div><div class="ms-st"><strong>' + esc(v[1]) + '</strong><p>' + esc(v[2]) + '</p><p>' +
        (a.length ? a.map(function(c){ var it = get(m, c.inst); return '<code>' + esc(c.id) + '</code> (' + esc(it ? it.name : c.inst) + ', ' + esc(catName(c)) + ')'; }).join(' · ')
          : L('aucune collection de ce niveau parmi celles relevées', 'no collection at this level among those surveyed')) + '</p></div></li>';
    }).join('') + '</ol></div>';
  return s + mk.list(M.checked) + '</div>';
}

/* ---------- orbite : trace au sol d'un tour, calculée par SGP4 à partir des éléments du jour (data/tle.json) ---------- */
var MU = 398600.4418, RE = 6378.137;   /* constante gravitationnelle et rayon équatorial de la Terre, km (WGS 84) */
function tleOf(m){ var d = (window.DATA_FILES || {}).tle; if (!d || !window.satellite) return null;
  return (m.norad || []).map(function(n){ var e = d.sats[String(n)]; if (!e) return null; var r = satellite.twoline2satrec(e.l1, e.l2); return r.error ? null : { n:n, e:e, rec:r }; }).filter(Boolean); }
function track(m, list){
  var W = 720, H = 360, t0 = Date.parse(list[0].e.epoch), segs = [];
  list.forEach(function(x, i){
    var per = 2 * Math.PI / x.rec.no, d = '', prev = null;
    for (var k = 0; k <= 240; k++){ var t = new Date(t0 + k / 240 * per * 60000), p = satellite.propagate(x.rec, t); if (!p.position) continue;
      var g = satellite.eciToGeodetic(p.position, satellite.gstime(t)), lo = satellite.degreesLong(g.longitude), la = satellite.degreesLat(g.latitude);
      var X = (lo + 180) / 360 * W, Y = (90 - la) / 180 * H;
      d += (prev === null || Math.abs(lo - prev) > 180 ? 'M' : 'L') + X.toFixed(1) + ' ' + Y.toFixed(1); prev = lo; }
    segs.push('<path d="' + d + '" class="gt' + (i ? ' gt2' : '') + '"/>');
  });
  var tex = (window.DATA_FILES || {})['tex-earth'];
  return '<figure class="traj gtrack"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(L('Trace au sol d\'un tour d\'orbite de ', 'Ground track of one orbit of ') + m.short) + '">' +
    (tex ? '<image href="data/tex-earth.jpg" x="0" y="0" width="' + W + '" height="' + H + '" preserveAspectRatio="none" opacity="0.85"/>' : '<rect width="' + W + '" height="' + H + '" class="gt-bg"/>') +
    segs.join('') + '</svg><figcaption>' +
    L('Trace au sol d\'un tour complet à partir de l\'époque des éléments orbitaux (', 'Ground track of one full orbit from the epoch of the orbital elements (') + esc(list[0].e.epoch.replace('T', ' ').replace('Z', en() ? ' UTC' : ' TU')) + '), ' +
    L('calculée par SGP4 (satellite.js) à partir des éléments de CelesTrak téléchargés le ', 'computed by SGP4 (satellite.js) from CelesTrak elements downloaded on ') + esc(String((window.DATA_FILES.tle || {}).fetched).slice(0, 10)) + '. ' +
    L('Projection équirectangulaire. D\'un tour à l\'autre, la trace se décale vers l\'ouest parce que la Terre tourne dessous.', 'Equirectangular projection. From one orbit to the next, the track shifts west because the Earth turns underneath.') + '</figcaption></figure>';
}
function orbitSec(m){
  var mk = Marks(m), list = tleOf(m) || [], s = '<div class="inst-head"><div class="inst-h"><h2 class="inst-name">' + L('Orbite', 'Orbit') + '</h2><div class="inst-full">' + esc(m.name) + '</div></div><p class="inst-sum">' +
    L('Orbite réelle, calculée à partir des derniers éléments orbitaux publiés : la trace au sol d\'un tour, et les grandeurs qu\'on en tire.', 'Real orbit, computed from the latest published orbital elements: the ground track of one orbit, and the quantities derived from it.') + '</p></div><div class="inst-cols">';
  if (list.length){
    var r = list[0].rec, n = r.no / 60, a = Math.pow(MU / (n * n), 1 / 3), e = r.ecco;
    s += '<div class="isec wide"><h3>' + L('Trace au sol', 'Ground track') + '</h3>' + track(m, list) + '</div>';
    s += '<div class="isec"><h3>' + L('D\'après les éléments du jour', 'From today\'s elements') + mk.mark('ct') + '</h3>' + table([
      [L('Inclinaison', 'Inclination'), num(r.inclo * 180 / Math.PI, 2) + '°'],
      [L('Période', 'Period'), num(2 * Math.PI / r.no, 1) + ' min'],
      [L('Altitude (≈, au-dessus de l\'équateur)', 'Altitude (≈, above the equator)'), num(a * (1 - e) - RE, 0) + ' – ' + num(a * (1 + e) - RE, 0) + ' km'],
      [L('Excentricité', 'Eccentricity'), num(e, 5)],
      [L('Tours par jour', 'Orbits per day'), num(1440 / (2 * Math.PI / r.no), 2)]
    ]) + '<div class="cap">' + L('Calculé par ce site à partir des éléments moyens SGP4 (n° NORAD ', 'Computed by this site from the mean SGP4 elements (NORAD no. ') + list.map(function(x){ return x.n; }).join(', ') +
      L(') ; l\'altitude réelle varie aussi avec l\'aplatissement de la Terre (≈ 20 km entre l\'équateur et les pôles).', '); the real altitude also varies with the Earth\'s flattening (≈ 20 km between equator and poles).') + '</div></div>';
  } else s += '<div class="isec wide"><p class="note">' + L('Éléments orbitaux pas encore téléchargés (workflow « Données réelles »).', 'Orbital elements not downloaded yet (“Real data” workflow).') + '</p></div>';
  var sec = (m.sections || []).filter(function(x){ return /^Orbit/.test(x.title); })[0];
  if (sec) s += '<div class="isec"><h3>' + L('Orbite prévue', 'Planned orbit') + '</h3>' + table(sec.rows.map(function(r){ return [OBS_T(r[0]), OBS_T(r[1]), r[2]]; }), mk) + '</div>';
  return s + mk.list() + '</div>';
}

/* ---------- un instrument ---------- */
function stacCode(c){
  var api = c.api.replace(/\/$/, ''), f = c.sat_filter ? JSON.stringify(c.sat_filter) : '';
  return 'curl -X POST "' + api + '/search" -H "Content-Type: application/json" \\\n  -d \'{"collections": ["' + c.id + '"], "limit": 1' + (f ? ', "query": ' + f : '') + '}\'\n\n# Python\nfrom pystac_client import Client\ncat = Client.open("' + api + '")\nitems = cat.search(collections=["' + c.id + '"]' + (f ? ', query=' + f : '') + ', max_items=10).item_collection()\nfor it in items:\n    print(it.id, it.datetime, list(it.assets))';
}
/* pourquoi un instrument n'a pas encore d'illustration (manque signalé, règle 2) */
function noData(m, it){
  if (cols(m, it).length) return L('Pas encore d\'illustration : l\'aperçu public des produits de cet instrument ne montre pas sa mesure propre (les aperçus Landsat sont en couleurs naturelles, faits avec OLI-2).', 'No illustration yet: the public previews of this instrument\'s products do not show its own measurement (Landsat previews are natural colour, made with OLI-2).');
  return L('Pas encore d\'illustration : aucune collection de cet instrument relevée dans les catalogues.', 'No illustration yet: no collection for this instrument found in the catalogues.');
}
function detail(m, it, X){
  var mk = Marks(m), s = '', cs = cols(m, it);
  s += '<div class="inst-head"><div class="inst-h"><h2 class="inst-name">' + esc(it.name) + '</h2><div class="inst-full">' + esc(it.full) + '</div><span class="kind">' + esc(kind(it)) + '</span></div><div>' +
    '<p class="inst-use"><b>' + L('À quoi ça sert', 'What it is for') + '</b>' + esc(it.use) + '</p><p class="inst-sum">' + esc(OBS_NUM(it.summary)) + '</p>';
  if (it.bands && it.bands.length) s += '<div class="inst-range">' + it.bands.map(function(b){ return '<span class="rng" style="--c:' + color(it) + '"><b>' + esc(b.l) + '</b> ' + span(b.lo, b.hi) + '</span>'; }).join('') + '</div>';
  s += '</div></div><div class="inst-cols">';
  s += '<div class="isec"><h3>' + L('Caractéristiques', 'Characteristics') + '</h3>' + table(it.specs, mk) + '</div>';
  if (it.bands && it.bands.length) s += '<div class="isec"><h3>' + L('Place dans le spectre', 'Place in the spectrum') + '</h3>' + coverage(m, it.id) + '<div class="cap">' + L('Plages reprises des caractéristiques ci-dessus.', 'Ranges taken from the characteristics above.') + '</div></div>';
  s += Optics.section(m, it, mk, table);
  if (realInst(m) === it) s += '<div class="isec wide"><h3>' + L('Une donnée réelle', 'Real data') + '</h3>' + X.real(m) + '</div>';
  var ik = 'i-' + m.id + '-' + it.id, figs = [];
  if ((window.DATA_FILES || {})[ik] && realInst(m) !== it) figs.push(X.real(m, { key:ik, altRaw:L('Aperçu d\'un produit ', 'Preview of a product of ') + it.name }));
  if ((window.DATA_FILES || {})['d-' + ik.slice(2)]) figs.push(X.real(m, { key:'d-' + ik.slice(2), altRaw:L('Tracé des données de ', 'Plot of data from ') + it.name }));
  if (it.real) figs.push(X.real(m, it.real));
  if ((window.DATA_FILES || {})['p-' + ik.slice(2)]) figs.push(X.real(m, { key:'p-' + ik.slice(2), altRaw:L('Image publiée par la NASA à partir des données de ', 'Image released by NASA from data of ') + it.name }));
  if ((window.DATA_FILES || {})['c-' + ik.slice(2)]) figs.push(X.real(m, { key:'c-' + ik.slice(2), altRaw:L('Image publiée à partir des données de ', 'Image released from data of ') + it.name }));
  if (figs.length) s += '<div class="isec wide"><h3>' + L('Une donnée réelle', 'Real data') + '</h3>' + figs.join('') + '</div>';
  else if (realInst(m) !== it) s += '<div class="isec wide"><h3>' + L('Une donnée réelle', 'Real data') + '</h3><p class="note">' + esc(noData(m, it)) + '</p></div>';
  s += '<div class="isec wide"><h3>' + L('Produits de données', 'Data products') + '</h3>';
  if (cs.length){
    s += '<div class="tablewrap"><table class="ctable"><thead><tr><th scope="col">' + L('Collection', 'Collection') + '</th><th scope="col">' + L('Catalogue', 'Catalogue') + '</th><th scope="col">' + L('Niveau', 'Level') + '</th><th scope="col">' + L('Produits', 'Products') + '</th><th scope="col">' + L('Période', 'Period') + '</th><th scope="col">' + L('Licence déclarée', 'Declared licence') + '</th></tr></thead><tbody>' +
      cs.map(function(c){ return '<tr><td><code>' + esc(c.id) + '</code>' + (c.title ? '<br><small>' + esc(c.title) + '</small>' : '') + '</td><td>' + esc(catName(c)) + '</td><td>' + esc(lvl(c)) + '</td><td class="n">' + (c.matched != null ? big(c.matched) + (c.sat_filter ? '' : ' *') : '—') + '</td><td>' + esc(period(c)) + '</td><td>' +
        (c.license_links && c.license_links[0] ? '<a href="' + esc(c.license_links[0]) + '" target="_blank" rel="noopener">' + esc(c.license || L('voir', 'see')) + '</a>' : esc(c.license || '—')) + (c.doi ? '<br><small>DOI ' + esc(c.doi) + '</small>' : '') + '</td></tr>'; }).join('') +
      '</tbody></table></div><div class="cap">' + L('Relevé des catalogues le ', 'Catalogues surveyed on ') + esc(CAT().fetched) + mk.mark('cat') + L('. Produits : ceux de ce satellite seul ; * : toute la collection, qui mêle plusieurs satellites. Niveau : celui que déclare l\'archive, ou celui du nom de la collection.', '. Products: those of this satellite only; *: the whole collection, which mixes several satellites. Level: as declared by the archive, or from the collection name.') + '</div>';
  } else s += '<p class="note">' + L('Aucune collection de cet instrument relevée dans les catalogues : ses données sont à chercher dans les archives ci-dessous.', 'No collection for this instrument found in the catalogues: look for its data in the archives below.') + '</p>';
  s += '</div>';
  if (cs.length){ var top = cs.filter(function(c){ return c.api && !/cmr/.test(c.api); })[0] || cs[0];
    s += '<div class="isec wide"><h3>' + L('Accéder aux données', 'Accessing the data') + '</h3><div class="ex-head"><span class="ex-title">' + L('Interroger le catalogue STAC', 'Query the STAC catalogue') + ' (' + esc(catName(top)) + ')</span></div>' + code(stacCode(top)) + '</div>'; }
  var links = INST_DATA[m.id].archives.map(function(a){ return { l:a.label, u:a.url }; }).concat(it.docs || []);
  s += mk.list(INST_DATA[m.id].checked || (MISSION[m.id] || {}).checked);
  s += '<div class="isec wide"><h3>' + L('Archive et documentation', 'Archive and documentation') + '</h3><div class="lnks">' + links.map(function(l){ return '<a class="lnk" href="' + esc(l.u) + '" target="_blank" rel="noopener">' + esc(l.l) + '<em>' + esc(host(l.u)) + '</em></a>'; }).join('') + '</div></div>';
  return s + '</div>';
}

function html(m, sec, X){
  copyStore = [];
  var d = INST_DATA[m.id]; if (!d) return '';
  var it = sec && get(m, sec); if (sec && !it && sec !== 'mission' && sec !== 'orbite') sec = '';
  var nav = navItem(m, '', sec || '', L('Vue d\'ensemble', 'Overview'), L('Spectre, instruments, archives', 'Spectrum, instruments, archives')) +
    (MISSION[m.id] ? navItem(m, 'mission', sec, L('Mission et traitements', 'Mission and processing'), L('Déroulé, exploitation, chaîne de traitement', 'Timeline, operations, processing chain')) : '') +
    navItem(m, 'orbite', sec, L('Orbite', 'Orbit'), L('Trace au sol, éléments du jour', 'Ground track, today\'s elements')) +
    d.instruments.map(function(x){ return navItem(m, x.id, sec, x.name, kind(x), color(x)); }).join('');
  var main = it ? detail(m, it, X) : sec === 'mission' ? missionSec(m) : sec === 'orbite' ? orbitSec(m) : overview(m, X);
  return '<div class="xp inst-body"><nav class="inst-nav" aria-label="' + esc(L('Sous-pages de ', 'Sub-pages of ') + m.short) + '">' + nav + '</nav><div class="inst-main" id="xp-main">' + main + '</div></div>';
}
document.addEventListener('click', function(e){
  var b = e.target.closest && e.target.closest('[data-copy],[data-ref]'); if (!b) return;
  if (b.hasAttribute('data-ref')){ e.preventDefault(); var t = document.getElementById('ref-' + b.getAttribute('data-ref')); if (t){ t.scrollIntoView({ block:'center' }); t.classList.add('hl'); setTimeout(function(){ t.classList.remove('hl'); }, 1500); } return; }
  var txt = copyStore[+b.getAttribute('data-copy')];
  try { navigator.clipboard.writeText(txt).then(function(){ b.textContent = L('Copié', 'Copied'); setTimeout(function(){ b.textContent = L('Copier', 'Copy'); }, 1500); }); } catch(x){}
});
return { html:html };
})();
