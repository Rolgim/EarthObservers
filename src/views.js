/* =================================================================
   VUES D'ENSEMBLE « FLOTTE » ET « COMPARER », sur le modèle des pages du même nom d'Observatories (src/fleet.js, inst-render.js) :
   sous-pages dans une colonne à gauche (.inst-nav), en-tête (.inst-head), filtres en pastilles (.chip), frise et tableaux (.ctable).
   Tout vient du registre (src/data-missions.js) : chaque date, chaque valeur garde la source de la fiche (règle 1).
   Aucune agence n'a de couleur ni de badge (règle 5) : les couleurs sont celles des satellites, dans l'ordre du registre.
   Views.page(route) rend #flotte, #flotte-qui, #comparer, #comparer-<sous-page> ; null pour une autre route.
================================================================= */
var Views = (function(){
'use strict';
var DAY = 864e5, COL = ['#D63C6E', '#0E8FA3', '#7B5CC4', '#C77700', '#3F8F46', '#B5446E', '#2D7DD2', '#8F6A00', '#5E8C31', '#9C4FB0'];   /* une couleur par satellite, ordre du registre (même ordre que l'accueil) */
var FS = { ag:null, st:null, body:null }, CS = { body:null, st:null }, cur = null;
function T(s){ return OBS_T(s); }
function en(){ return OBS_LANG === 'en'; }
function colon(){ return en() ? ': ' : ' : '; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function day(s){ var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(s); return Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 1) / DAY; }
function fmt(s){ var o = { month:'long', year:'numeric', timeZone:'UTC' }; if (s.length > 7) o.day = 'numeric';
  return new Date(day(s) * DAY).toLocaleDateString(en() ? 'en-GB' : 'fr-FR', o); }
function today(){ var d = new Date(); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / DAY; }
function src(m, k){ var r = k && m.refs && m.refs[k]; return r ? ' <a class="src" href="' + esc(r.u) + '" rel="noopener" target="_blank" title="' + esc(r.t) + '">' + esc(r.p) + '</a>' : ''; }
function col(m){ return COL[MISSIONS.indexOf(m) % COL.length]; }
var EV = { launch:'Lancement', orbit:'Mise en service', add:'Lancement d\'un satellite de la série', loss:'Perte d\'un satellite ou d\'un instrument', note:'Autre étape', end:'Fin de mission' };
function evName(e){ return T(e.label || EV[e.type]); }
function ev(m, ty){ return (m.events || []).filter(function(e){ return ty.indexOf(e.type) >= 0; })[0]; }
function launch(m){ return ev(m, ['launch']); }
function end(m){ return ev(m, ['end']); }
/* agences nommées dans le texte de la fiche, telles qu'écrites (sigles) */
function agencies(m){ var a = []; (String(m.agency).match(/\b(NASA|USGS|ESA|EUMETSAT|NOAA|ASI|JAXA|CNES|UKSA|CSA|DLR|GFZ|ISRO|KARI|Roscosmos|CNSA)\b/g) || []).forEach(function(x){ if (a.indexOf(x) < 0) a.push(x); }); return a; }
function allAgencies(){ var n = {}; MISSIONS.forEach(function(m){ agencies(m).forEach(function(a){ n[a] = (n[a] || 0) + 1; }); });
  return Object.keys(n).sort(function(a, b){ return n[b] - n[a] || (a < b ? -1 : 1); }); }
function themes(){ var b = []; MISSIONS.forEach(function(m){ m.targets.forEach(function(t){ if (b.indexOf(t) < 0) b.push(t); }); }); return b; }
function keep(F, m){
  if (F.ag && agencies(m).indexOf(F.ag) < 0) return false;
  if (F.st === 'on' && end(m)) return false; if (F.st === 'off' && !end(m)) return false;
  if (F.body && m.targets.indexOf(F.body) < 0) return false;
  return true;
}
function chips(scope, F, key, label, opts){
  return '<div class="fl-f" role="group" aria-label="' + esc(T(label)) + '"><span>' + esc(T(label)) + '</span><div class="fl-opts">' +
    '<button class="chip" data-xf="' + scope + ':' + key + ':" aria-pressed="' + !F[key] + '">' + esc(T('Toutes')) + '</button>' +
    opts.map(function(o){ return '<button class="chip" data-xf="' + scope + ':' + key + ':' + esc(o[0]) + '" aria-pressed="' + (F[key] === o[0]) + '">' + esc(T(o[1])) + '</button>'; }).join('') + '</div></div>';
}
var STATES = [['on', 'En service'], ['off', 'Terminées']];
/* gabarit commun : sous-pages à gauche, contenu à droite */
function shell(label, items, on, main){
  return '<div class="xp inst-body"><nav class="inst-nav" aria-label="' + esc(T(label)) + '">' + items.map(function(x){
    return '<a class="nav-i' + (x[0] === on ? ' on' : '') + '" href="#' + x[0] + '"' + (x[0] === on ? ' aria-current="page"' : '') + '><span class="n">' + esc(T(x[1])) + '</span><span class="k">' + esc(T(x[2])) + '</span></a>';
  }).join('') + '</nav><div class="inst-main" id="xp-main">' + main + '</div></div>';
}
function head(name, full, right){
  return '<div class="inst-head"><div class="inst-h"><h2 class="inst-name">' + esc(T(name)) + '</h2><div class="inst-full">' + esc(T(full)) + '</div></div>' + right + '</div>';
}

/* ---------- Flotte ---------- */
var FLEET_SECS = [['flotte', 'Frise chronologique', 'Du lancement à la fin de mission'], ['flotte-qui', 'Qui a fait quoi', 'Agences, thèmes, étapes datées']];
var SHAPE = {
  end:function(x, y){ return '<rect x="' + (x - 4) + '" y="' + (y - 4) + '" width="8" height="8"/>'; },
  add:function(x, y){ return '<path d="M' + x + ' ' + (y - 5) + 'l5 9h-10z"/>'; },
  loss:function(x, y){ return '<path d="M' + (x - 4) + ' ' + (y - 4) + 'l8 8m0-8l-8 8" class="ev-x"/>'; },
  note:function(x, y){ return '<circle cx="' + x + '" cy="' + y + '" r="3.5" class="ev-o"/>'; },
  orbit:function(x, y){ return '<path d="M' + x + ' ' + (y - 6) + 'l6 6l-6 6l-6-6z"/>'; }
};
function timeline(L){
  var y0 = Math.floor(Math.min.apply(null, [2000].concat(L.map(function(m){ return +String(m.year).slice(0, 4); }))) / 5) * 5, y1 = Math.max(2028, new Date().getUTCFullYear() + 2), W = 1000, lw = 120, rh = 30, top = 26, H = top + L.length * rh + 30, now = today();
  var t0 = Date.UTC(y0, 0, 1) / DAY, t1 = Date.UTC(y1, 0, 1) / DAY;
  function X(t){ return +(lw + (t - t0) / (t1 - t0) * (W - lw - 40)).toFixed(1); }
  var s = '';
  for (var y = y0; y <= y1; y += 5){ var xx = X(Date.UTC(y, 0, 1) / DAY); s += '<line x1="' + xx + '" y1="' + (top - 6) + '" x2="' + xx + '" y2="' + (H - 22) + '" class="fl-grid"/><text x="' + xx + '" y="14" text-anchor="middle" class="fl-year">' + y + '</text>'; }
  s += '<line x1="' + X(now) + '" y1="' + (top - 6) + '" x2="' + X(now) + '" y2="' + (H - 22) + '" stroke-width="1.5" stroke-dasharray="3 3" class="fl-now"/><text x="' + X(now) + '" y="' + (H - 8) + '" text-anchor="middle" class="fl-nowt">' + esc(T('aujourd\'hui')) + '</text>';
  L.forEach(function(m, i){
    var l = launch(m), e = end(m), a = X(day(l.date)), b = e ? X(day(e.date)) : X(now), yy = top + i * rh, cy = yy + 12, c = col(m);
    var tip = m.short + colon() + fmt(l.date) + ' – ' + (e ? fmt(e.date) : T('en service'));
    s += '<g class="fl-row" data-go="' + m.id + '" tabindex="0" role="link" aria-label="' + esc(tip) + '"><title>' + esc(tip) + '</title>' +
      '<rect x="0" y="' + (yy - 3) + '" width="' + W + '" height="' + rh + '" fill="transparent"/>' +
      '<text x="' + (lw - 10) + '" y="' + (cy + 4.5) + '" text-anchor="end" class="fl-lab">' + esc(m.short) + '</text>' +
      '<rect x="' + a + '" y="' + (cy - 7) + '" width="' + Math.max(3, b - a).toFixed(1) + '" height="14" fill="' + c + '"' + (e ? ' fill-opacity="0.55"' : '') + '/>' +
      (e ? '' : '<path d="M' + b + ' ' + (cy - 7) + ' l7 7 l-7 7 z" fill="' + c + '"/>') +
      '<g class="fl-ev">' + (m.events || []).filter(function(x){ return SHAPE[x.type]; }).map(function(x){ return SHAPE[x.type](X(day(x.date)), cy); }).join('') + '</g></g>';
  });
  var leg = [['Mise en service', SHAPE.orbit(8, 8)], ['Lancement d\'un satellite de la série', SHAPE.add(8, 8)], ['Perte d\'un satellite ou d\'un instrument', SHAPE.loss(8, 8)], ['Autre étape', SHAPE.note(8, 8)], ['Fin de mission', SHAPE.end(8, 8)]];
  return '<div class="isec"><h3>' + esc(T('Les satellites, du lancement à la fin')) + '</h3><div class="svgwrap fl-tl"><svg viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="' + esc(T('Frise chronologique des satellites')) + '">' + s + '</svg></div>' +
    '<p class="fl-leg">' + leg.map(function(l){ return '<span><svg viewBox="0 0 16 16" aria-hidden="true">' + l[1] + '</svg>' + esc(T(l[0])) + '</span>'; }).join('') + '<span><i class="fl-live"></i>' + esc(T('satellite en service')) + '</span></p>' +
    '<div class="cap">' + esc(T('Une barre par satellite, du lancement à la fin de mission ; pleine et fléchée s\'il est en service. Les étapes datées sont marquées sur la barre ; leurs sources sont dans « Qui a fait quoi ». Cliquer une barre ouvre le satellite en 3D.')) + '</div></div>';
}
function who(L){
  var nums = {}, refs = [], h = '';
  function ref(m, k){ if (!k || !m.refs || !m.refs[k]) return ''; var id = m.id + ':' + k; if (!nums[id]){ refs.push(m.refs[k]); nums[id] = refs.length; } return '<sup class="ref">' + nums[id] + '</sup>'; }
  L.forEach(function(m){
    var l = launch(m), e = end(m);
    h += '<div class="fl-who"><h3><a href="#' + m.id + '">' + esc(m.name) + '</a> <small>' + fmt(l.date) + ' – ' + (e ? fmt(e.date) : esc(T('en service'))) + '</small></h3>' +
      '<div class="spec-row"><div class="k"><b>' + esc(T('Agences')) + '</b></div><div class="v">' + esc(m.agency) + '</div></div>' +
      '<div class="spec-row"><div class="k"><b>' + esc(T('Thèmes')) + '</b></div><div class="v">' + m.targets.map(function(b){ return esc(T(b)); }).join(', ') + '</div></div>' +
      (m.events || []).map(function(x){ return '<div class="spec-row"><div class="k"><b>' + esc(evName(x)) + '</b></div><div class="v">' + fmt(x.date) + ref(m, x.ref) + '</div></div>'; }).join('') + '</div>';
  });
  return h + (refs.length ? '<div class="spec-section"><div class="spec-section-title">' + esc(T('Sources')) + '</div><ol class="refs">' + refs.map(function(r){
    return '<li><a href="' + esc(r.u) + '" target="_blank" rel="noopener">' + esc(r.t) + '</a> <span>' + esc(r.p) + '</span></li>'; }).join('') + '</ol></div>' : '') +
    '<p class="cap">' + esc(T('Agences citées telles que les sources les nomment ; l\'ordre suit le registre du site, sans hiérarchie.')) + '</p>';
}
function fleet(sec){
  var L = MISSIONS.filter(function(m){ return keep(FS, m); }).sort(function(a, b){ return day(launch(a).date) - day(launch(b).date); });
  var main = head('Flotte', 'Tous les satellites présentés sur ce site', '<p class="inst-sum">' + esc(T('Chaque satellite a sa fiche, sa vue 3D et ses données. Les filtres se combinent ; le nombre affiché est celui des satellites retenus.')) + '</p>') +
    '<div class="fl-filters">' + chips('f', FS, 'ag', 'Agence', allAgencies().map(function(a){ return [a, a]; })) + chips('f', FS, 'st', 'État', STATES) +
      chips('f', FS, 'body', 'Thème', themes().map(function(b){ return [b, b]; })) + '</div>' +
    '<p class="fl-count">' + esc(T('Satellites affichés')) + colon() + '<b>' + L.length + '</b> / ' + MISSIONS.length + '</p>';
  main += !L.length ? '<p class="cap">' + esc(T('Aucun satellite ne correspond à ces filtres.')) + '</p>' : sec === 'flotte-qui' ? who(L) : timeline(L);
  return shell('Flotte', FLEET_SECS, sec, main);
}

/* ---------- Comparer ---------- */
/* La fiche de chaque satellite suit le même ordre de sections (data-missions.js) : 0 Mission, 1 Orbite, 2 Images ; en anglais, les titres sont traduits
   mais l'ordre est le même, d'où la lecture par position. Les lignes sont lues par libellé (français ou anglais). */
var SEC = { mission:0, orbit:1, images:2 };
var CMP_SECS = [['comparer', 'Vue d\'ensemble', 'Années, altitudes, thèmes, agences'], ['comparer-orbites', 'Orbites', 'Altitude, inclinaison, période, revisite'],
                ['comparer-images', 'Images', 'Bandes, résolution, fauchée'], ['comparer-instruments', 'Instruments', 'Tous les instruments, leurs bandes côte à côte']];
function row(m, idx, re){ var s = m.sections && m.sections[idx]; return s && s.rows.filter(function(r){ return re.test(r[0]); })[0]; }
function num(s){ var m = /[\d][\d\s  ,.]*/.exec(s); return m ? +m[0].replace(/[\s  ]/g, '').replace(en() ? /,/g : /\./g, '').replace(',', '.') : NaN; }
function insts(m){ return (typeof INST_DATA !== 'undefined' && INST_DATA[m.id] && INST_DATA[m.id].instruments) || []; }
function bars(items, unit){
  var max = Math.max.apply(null, items.map(function(i){ return i.v; }));
  return '<ul class="cp-bars">' + items.map(function(i){
    return '<li><a href="#' + i.m.id + '" class="cp-n">' + esc(i.m.short) + '</a><span class="cp-t"><i style="width:' + (i.v / max * 100).toFixed(1) + '%;background:' + col(i.m) + '"></i></span><span class="cp-v">' + i.label + '</span></li>';
  }).join('') + '</ul>';
}
var RE_ALT = /^(Altitude)$/, RE_RES = /^(Résolution|Resolution)$/;
function overview(L){
  var rows = L.map(function(m){
    var l = launch(m), e = end(m), a = row(m, SEC.orbit, RE_ALT), r = row(m, SEC.images, RE_RES);
    return '<tr><td class="o" style="--c:' + col(m) + '"><a href="#' + m.id + '">' + esc(m.short) + '</a></td>' +
      '<td>' + l.date.slice(0, 4) + '–' + (e ? e.date.slice(0, 4) : ' <small>' + esc(T('en cours')) + '</small>') + '</td>' +
      '<td>' + (a ? esc(OBS_NUM(a[1])) + src(m, a[2]) : '—') + '</td>' +
      '<td>' + m.targets.map(function(b){ return esc(T(b)); }).join(', ') + '</td>' +
      '<td>' + esc(agencies(m).join(', ')) + '</td>' +
      '<td>' + (r ? esc(OBS_NUM(r[1])) + src(m, r[2]) : '—') + '</td>' +
      '<td>' + (insts(m).map(function(i){ return '<a href="#' + m.id + '-donnees-' + i.id + '">' + esc(i.name) + '</a>'; }).join(', ') || '—') + '</td></tr>';
  }).join('');
  return '<div class="isec"><h3>' + esc(T('Les satellites côte à côte')) + '</h3><div class="tablewrap"><table class="ctable"><thead><tr><th scope="col">' + esc(T('Satellite')) + '</th><th scope="col">' + esc(T('Années')) + '</th><th scope="col">' + esc(T('Altitude')) + '</th>' +
    '<th scope="col">' + esc(T('Thèmes')) + '</th><th scope="col">' + esc(T('Agences')) + '</th><th scope="col">' + esc(T('Résolution')) + '</th><th scope="col">' + esc(T('Instruments')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="cap">' + esc(T('Valeurs des fiches de chaque satellite, avec leur source. Cliquer un nom ouvre le satellite en 3D, un instrument ouvre sa page.')) + '</div></div>';
}
function rowsTable(L, idx, title, cap){
  var rows = '';
  L.forEach(function(m){ var s = m.sections && m.sections[idx]; if (!s) return;
    s.rows.forEach(function(r, j){ rows += '<tr' + (j ? '' : ' class="first"') + '><td class="o" style="--c:' + col(m) + '">' + (j ? '' : '<a href="#' + m.id + '">' + esc(m.short) + '</a>') + '</td>' +
      '<td class="n">' + esc(r[0]) + '</td><td>' + esc(OBS_NUM(r[1])) + src(m, r[2]) + '</td></tr>'; }); });
  return '<div class="isec"><h3>' + esc(T(title)) + '</h3><div class="tablewrap"><table class="ctable cp-rows"><thead><tr><th scope="col">' + esc(T('Satellite')) + '</th><th scope="col">' + esc(T('Élément')) + '</th><th scope="col">' + esc(T('Valeur et source')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="cap">' + esc(T(cap)) + '</div></div>';
}
/* bandes spectrales de tous les instruments (µm, échelle logarithmique de 0,3 à 15 µm) : valeurs des pages d'instrument (data-inst.js) */
var SP = [0.25, 15];
function spectrum(L){
  var list = []; L.forEach(function(m){ insts(m).forEach(function(i){ if (i.bands && i.bands.length) list.push([m, i]); }); });
  if (!list.length) return '';
  var W = 1000, lw = 150, rh = 28, top = 24, H = top + list.length * rh + 34;
  function X(u){ return +(lw + Math.log(u / SP[0]) / Math.log(SP[1] / SP[0]) * (W - lw - 20)).toFixed(1); }
  var s = '', zones = [[0.38, 0.75, 'visible']];
  zones.forEach(function(z){ s += '<rect x="' + X(z[0]) + '" y="' + (top - 6) + '" width="' + (X(z[1]) - X(z[0])) + '" height="' + (H - top - 22) + '" class="sp-vis"/><text x="' + ((X(z[0]) + X(z[1])) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" class="fl-nowt">' + esc(T('visible')) + '</text>'; });
  [0.3, 0.5, 1, 2, 5, 10, 15].forEach(function(u){ s += '<line x1="' + X(u) + '" y1="' + (top - 6) + '" x2="' + X(u) + '" y2="' + (H - 22) + '" class="fl-grid"/><text x="' + X(u) + '" y="14" text-anchor="middle" class="fl-year">' + OBS_NUM(String(u).replace('.', en() ? '.' : ',')) + ' µm</text>'; });
  list.forEach(function(p, k){
    var m = p[0], i = p[1], cy = top + k * rh + 12, c = col(m), tip = m.short + ' · ' + i.name + colon() + i.bands.map(function(b){ return b.l; }).join(', ');
    s += '<g class="fl-row" data-go="' + m.id + '-donnees-' + i.id + '" tabindex="0" role="link" aria-label="' + esc(tip) + '"><title>' + esc(tip) + '</title>' +
      '<rect x="0" y="' + (cy - 12) + '" width="' + W + '" height="' + rh + '" fill="transparent"/>' +
      '<text x="' + (lw - 10) + '" y="' + (cy + 4.5) + '" text-anchor="end" class="fl-lab">' + esc(m.short + ' · ' + i.name) + '</text>' +
      i.bands.map(function(b){ return '<rect x="' + X(b.lo) + '" y="' + (cy - 7) + '" width="' + Math.max(2, X(b.hi) - X(b.lo)).toFixed(1) + '" height="14" fill="' + c + '" fill-opacity="0.75"/>'; }).join('') + '</g>';
  });
  return '<div class="isec"><h3>' + esc(T('Les bandes spectrales')) + '</h3><div class="svgwrap fl-tl"><svg viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="' + esc(T('Bandes spectrales des instruments')) + '">' + s + '</svg></div>' +
    '<div class="cap">' + esc(T('Une ligne par instrument, une barre par bande, de la limite basse à la limite haute publiées (échelle logarithmique). Les radars et altimètres, qui travaillent en ondes radio ou avec un laser, ne figurent pas sur cette échelle. Cliquer une ligne ouvre la page de l\'instrument.')) + '</div></div>';
}
function instTable(L){
  var RP = /^(Pixel au sol|Ground pixel)$/, RF = /^(Fauchée|Swath)$/, rows = '';
  L.forEach(function(m){ insts(m).forEach(function(i, j){
    var p = (i.specs || []).filter(function(r){ return RP.test(r[0]); })[0], f = (i.specs || []).filter(function(r){ return RF.test(r[0]); })[0], ty = INST_TYPES[i.type];
    rows += '<tr' + (j ? '' : ' class="first"') + '><td class="o" style="--c:' + col(m) + '">' + (j ? '' : '<a href="#' + m.id + '">' + esc(m.short) + '</a>') + '</td>' +
      '<td><a href="#' + m.id + '-donnees-' + i.id + '">' + esc(i.name) + '</a> <small>' + esc(i.full) + '</small></td><td>' + esc(ty ? ty.l : i.type) + '</td>' +
      '<td>' + (p ? esc(OBS_NUM(p[1])) + src(m, p[2]) : '—') + '</td><td>' + (f ? esc(OBS_NUM(f[1])) + src(m, f[2]) : '—') + '</td></tr>'; }); });
  return '<div class="isec"><h3>' + esc(T('Tous les instruments')) + '</h3><div class="tablewrap"><table class="ctable cp-rows"><thead><tr><th scope="col">' + esc(T('Satellite')) + '</th><th scope="col">' + esc(T('Instrument')) + '</th><th scope="col">' + esc(T('Type')) + '</th><th scope="col">' + esc(T('Pixel au sol')) + '</th><th scope="col">' + esc(T('Fauchée')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="cap">' + esc(T('Valeurs des pages d\'instrument, avec leur source.')) + '</div></div>';
}
function compare(sec){
  var L = MISSIONS.filter(function(m){ return keep(CS, m); }), cs = CMP_SECS.filter(function(x){ return x[0] === sec; })[0];
  var main = head(cs[1], 'Comparer : les satellites sur les mêmes axes, avec les valeurs et les sources de leurs fiches',
    '<div class="fl-filters">' + chips('c', CS, 'body', 'Thème', themes().map(function(b){ return [b, b]; })) + chips('c', CS, 'st', 'État', STATES) + '</div>');
  if (!L.length) return shell('Comparer', CMP_SECS, sec, main + '<p class="cap">' + esc(T('Aucun satellite ne correspond à ces filtres.')) + '</p>');
  if (sec === 'comparer') main += overview(L);
  else if (sec === 'comparer-orbites'){
    var al = L.map(function(m){ var r = row(m, SEC.orbit, RE_ALT); if (!r) return null; var v = num(r[1]); return isNaN(v) ? null : { m:m, v:v, label:esc(OBS_NUM(r[1])) + src(m, r[2]) }; }).filter(Boolean);
    main += '<div class="isec"><h3>' + esc(T('Altitude')) + '</h3>' + bars(al) + '<div class="cap">' + esc(T('Altitude moyenne de l\'orbite, telle que la publie la source citée. L\'orbite réelle du jour, calculée à partir des éléments orbitaux, est sur la page « Orbite » de chaque satellite.')) + '</div></div>';
    main += rowsTable(L, SEC.orbit, 'Orbites', 'Valeurs de la section « Orbite » de chaque fiche.');
  } else if (sec === 'comparer-images') main += rowsTable(L, SEC.images, 'Images', 'Valeurs de la section « Images » de chaque fiche.');
  else main += spectrum(L) + instTable(L);
  return shell('Comparer', CMP_SECS, sec, main);
}

function page(r){
  if (FLEET_SECS.some(function(x){ return x[0] === r; })){ cur = r; return fleet(r); }
  if (CMP_SECS.some(function(x){ return x[0] === r; })){ cur = r; return compare(r); }
  return null;
}
/* pastilles de filtre : la page est redessinée sur place, défilement et focus gardés */
document.addEventListener('click', function(e){
  var b = e.target.closest && e.target.closest('[data-xf]'); if (!b || !cur) return;
  var p = b.getAttribute('data-xf').split(':'), F = p[0] === 'f' ? FS : CS; F[p[1]] = p[2] || null;
  var mm = document.getElementById('xp-main'), top = mm ? mm.scrollTop : 0, key = b.getAttribute('data-xf');
  document.getElementById('page').innerHTML = page(cur);
  mm = document.getElementById('xp-main'); if (mm) mm.scrollTop = top;
  var nb = document.querySelector('[data-xf="' + key.replace(/"/g, '\\"') + '"]'); if (nb) nb.focus();
});
/* lignes de la frise et des bandes : Entrée ou Espace ouvrent la page (role=link) */
document.addEventListener('keydown', function(e){
  var g = e.target.closest && e.target.closest('.fl-row[data-go]'); if (!g || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault(); location.hash = g.getAttribute('data-go');
});
return { page:page, base:function(r){ return /^flotte/.test(r) ? 'flotte' : /^comparer/.test(r) ? 'comparer' : r; } };
})();
