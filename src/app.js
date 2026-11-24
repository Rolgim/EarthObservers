/* =================================================================
   APPLICATION — en-tête, routage par ancre, pages.
   Repris de SolarExplorers (src/app.js). Rien ici n'est propre à un satellite : tout part de MISSIONS (src/data-missions.js).
================================================================= */
(function(){
'use strict';
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function mission(id){ for (var i = 0; i < MISSIONS.length; i++) if (MISSIONS[i].id === id) return MISSIONS[i]; return null; }
var T = OBS_T;

function isDark(){ var a = document.documentElement.getAttribute('data-theme'); return a ? a === 'dark' : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); }
(function(){ try { var v = localStorage.getItem('eo-theme'); if (v === 'dark' || v === 'light') document.documentElement.setAttribute('data-theme', v); } catch(e){} })();

/* vues d'ensemble : boutons fixes en haut à droite, même graisse quel que soit l'état (règle 6) */
var VIEWS = [['missions', 'Satellites'], ['accueil', 'La Terre'], ['comparer', 'Comparer'], ['flotte', 'Flotte']];
function renderHeader(route){
  /* onglets des satellites, comme les onglets d'observatoires d'Observatories : sur une page de satellite, on passe d'un satellite à l'autre
     en restant sur le même type de page (vue 3D ou « Mission et instruments ») */
  var cur = mission(route.replace(/-donnees(-[\w-]+)?$/, '')), dat = /-donnees/.test(route);
  /* deux rangées, comme les domaines spectraux d'Observatories : les thèmes (filtrent), puis les satellites du thème choisi */
  function bodyOf(m){ return m.targets[0]; }
  var bodies = []; MISSIONS.forEach(function(m){ if (bodies.indexOf(bodyOf(m)) < 0) bodies.push(bodyOf(m)); });
  if (cur && !window.EO_BODY_LOCK) window.EO_BODY = bodyOf(cur);
  var sb = window.EO_BODY || (cur && bodyOf(cur));
  $('tabs').innerHTML = cur ? '<div class="drow" role="group" aria-label="' + T('Thème principal') + '">' + bodies.map(function(b){
    var n = MISSIONS.filter(function(m){ return bodyOf(m) === b; }).length;
    return '<button class="dsel' + (b === bodyOf(cur) ? ' cur' : '') + '" data-body="' + esc(b) + '" aria-pressed="' + (b === sb) + '"><span class="dl">' + esc(T(b)) + '</span><span class="ds">' + esc(T(b)) + '</span><span class="dn">' + n + '</span></button>';
  }).join('') + '</div><div class="trow" role="tablist" aria-label="' + T('Satellite') + '">' + MISSIONS.filter(function(m){ return bodyOf(m) === sb; }).map(function(m){
    return '<button class="tab" role="tab" data-go="' + m.id + (dat ? route.replace(/^\w+?(-donnees)/, '$1') : '') + '" aria-selected="' + (m.id === cur.id) + '">' + esc(m.short || m.name) + '<small>' + esc(m.year || '') + '</small></button>';
  }).join('') + '</div>' : '';
  $('views').innerHTML = '<div class="views">' + VIEWS.map(function(v){
    var on = route === v[0] || (v[0] === 'missions' && cur);
    return '<button class="vbtn" data-go="' + v[0] + '" aria-pressed="' + !!on + '">' + T(v[1]) + '</button>';
  }).join('') + '</div>';
  var ll = OBS_LANG === 'en' ? 'Lire en français' : 'Read in English';
  var h = '<button class="tab util lang" id="b-lang" title="' + ll + '" aria-label="' + ll + '" lang="' + (OBS_LANG === 'en' ? 'fr' : 'en') + '"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10" cy="10" r="7.6"/><path d="M2.4 10h15.2M10 2.4c2.2 2.1 3.3 4.6 3.3 7.6s-1.1 5.5-3.3 7.6M10 2.4C7.8 4.5 6.7 7 6.7 10s1.1 5.5 3.3 7.6"/></svg><span>' + (OBS_LANG === 'en' ? 'FR' : 'EN') + '</span></button>';
  var dk = isDark(), lab = T(dk ? 'Passer au thème clair' : 'Passer au thème sombre');
  h += '<button class="tab util theme" id="b-theme" title="' + lab + '" aria-label="' + lab + '"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">' +
       (dk ? '<circle cx="10" cy="10" r="3.6"/><path d="M10 1.8v2.2M10 16v2.2M1.8 10H4M16 10h2.2M4.2 4.2l1.6 1.6M14.2 14.2l1.6 1.6M4.2 15.8l1.6-1.6M14.2 5.8l1.6-1.6"/>'
           : '<path d="M16.6 12.1A7 7 0 0 1 7.9 3.4a7 7 0 1 0 8.7 8.7z" stroke-linejoin="round"/>') + '</svg></button>';
  $('utils').innerHTML = h;
}

/* ---------- pages ---------- */
function src(m, k){
  var r = k && m.refs && m.refs[k];
  return r ? ' <a class="src" href="' + esc(r.u) + '" rel="noopener" target="_blank" title="' + esc(r.t) + '">' + esc(r.p) + '</a>' : '';
}
function fiche(m){
  var h = '<p class="desc">' + esc(m.desc || '') + '</p>';
  (m.sections || []).forEach(function(sec){
    h += '<h3>' + esc(sec.title) + '</h3><table class="sk-table"><tbody>' + sec.rows.map(function(r){
      return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(OBS_NUM(r[1])) + src(m, r[2]) + '</td></tr>';
    }).join('') + '</tbody></table>';
  });
  return h + bodyCredit(m) + '<button class="cta" data-go="' + m.id + '-donnees">' + T('Mission et instruments') + '<small>' + T('Instruments, orbite réelle et données tirées des archives.') + '</small></button>';
}
function partsHtml(m, sel){
  return '<ul class="parts">' + m.parts.map(function(p){
    var on = p.key === sel;
    return '<li class="part' + (on ? ' on' : '') + '"><button data-part="' + p.key + '" aria-expanded="' + on + '">' + esc(p.name) + '</button>' +
      (on ? '<div class="part-body"><p>' + esc(p.desc) + '</p>' + (p.facts.length ? '<ul>' + p.facts.map(function(f){ return '<li>' + esc(OBS_NUM(f[0])) + src(m, f[1]) + '</li>'; }).join('') + '</ul>' : '') + '</div>' : '') + '</li>';
  }).join('') + '</ul>' + (m.file ? '<p class="note">' + T('Maquette') + ' : ' + esc(m.model.src) + ' · ' + T('Licence') + ' : ' + esc(m.model.license) + ' · <a href="' + CREDITS_URL + '" rel="noopener" target="_blank">' + T('registre des crédits') + '</a></p>'
    : '<p class="note">' + T('Pas de maquette 3D libre de droits pour ce satellite : il est figuré par un point bleu sur son orbite.') + '</p>') + bodyCredit(m);
}
function bodyCredit(m){
  var d = m.body && (window.DATA_FILES || {})['tex-' + m.body.tex]; if (!d) return '';
  return '<p class="note">' + T(m.body.name) + ' : ' + T(d.credit) + ' · ' + T('Licence') + ' : <a href="' + esc(d.page) + '" rel="noopener" target="_blank">' + esc(d.license) + '</a></p>';
}
var MS = { tab:'fiche', part:null, explode:0, view:'probe', run:!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) };
function missionPage(m){
  if (MS.mid !== m.id){ MS.part = null; MS.mid = m.id; }   /* la pièce choisie ne passe pas d'une sonde à l'autre */
  if (!m.file) MS.view = 'orbit';   /* sans maquette, la vue d'orbite montre mieux la sonde (un point) */
  return '<div class="mission"><section id="stage" class="m-stage" aria-label="' + T('Vue 3D du satellite') + '">' +
    '<div class="m-hud"><div class="m-name">' + esc(m.name) + '</div><div class="m-sub">' + esc(m.agency) + ' · ' + esc(m.targets.join(', ')) + '</div>' +
      (m.body ? '<p class="m-body-note" id="m-body-note" hidden>' + T(m.body.name) + (OBS_LANG === 'en' ? ': ' : ' : ') + T('orbite en schéma de principe (tailles, altitude, inclinaison et vitesse non respectées)') + (m.file ? '' : ' · ' + T('pas de maquette libre de droits : le satellite est un point bleu')) + '</p>' : '') + '</div>' +
    '<p class="m-msg" id="m-msg" hidden></p>' +
    '<div class="m-tools" role="toolbar" aria-label="' + T('Affichage') + '">' +
      (m.file ? '<label class="m-ex" title="' + T('Écarter les pièces') + '">' + ICO.ex + '<span class="lbl">' + T('Éclater') + '</span><input id="m-explode" type="range" min="0" max="100" value="' + Math.round(MS.explode*100) + '" aria-label="' + T('Écarter les pièces') + '"></label>' : '') +
      '<button class="m-b" id="m-reset" title="' + T('Recadrer') + '">' + ICO.reset + '<span class="lbl">' + T('Recadrer') + '</span></button>' +
      (m.body ? '<button class="m-b" id="m-view" aria-pressed="' + (MS.view === 'orbit') + '" title="' + T('Vue d\'orbite') + '">' + ICO.orbit + '<span class="lbl">' + T('Vue d\'orbite') + '</span></button>' : '') +
      '<button class="m-b" id="m-run" aria-pressed="' + !MS.run + '" title="' + T('Pause') + '">' + ICO.pause + '<span class="lbl">' + T('Pause') + '</span></button></div>' +
    '<p class="m-hint">' + T(m.file ? 'Glisser pour tourner, molette pour zoomer, cliquer une pièce pour l\'identifier' : 'Glisser pour tourner, molette pour zoomer') + '</p>' +
    '</section><aside class="m-panel"><h2 class="sr-only">' + esc(m.name) + '</h2>' +
    '<div class="ptl-row"><div class="ptl" role="tablist" aria-label="' + T('Contenu du panneau') + '">' +
      (m.parts.length ? ['fiche', 'parts'] : ['fiche']).map(function(k){ return '<button class="ptab" role="tab" data-ptab="' + k + '" aria-selected="' + (MS.tab === k) + '">' + T(k === 'fiche' ? 'Fiche' : 'Pièces') + (k === 'parts' ? ' <small>' + m.parts.length + '</small>' : '') + '</button>'; }).join('') +
    '</div><a class="ptab go" href="#' + m.id + '-donnees">' + T('Mission et instruments') + '</a></div><div id="m-body">' + (MS.tab === 'fiche' ? fiche(m) : partsHtml(m, MS.part)) + '</div></aside></div>';
}
/* icônes de la barre d'outils de la vue 3D (mêmes traits que celles d'Observatories) */
var ICO = (function(){ function i(d){ return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true" focusable="false">' + d + '</svg>'; }
  return { ex:i('<rect x="5.5" y="5.5" width="5" height="5"/><path d="M8 3.6V1M8 15v-2.6M3.6 8H1M15 8h-2.6"/>'), reset:i('<path d="M1.5 5.5v-4h4M14.5 5.5v-4h-4M1.5 10.5v4h4M14.5 10.5v4h-4"/>'),
    orbit:i('<ellipse cx="8" cy="8" rx="6.5" ry="3.2"/><circle cx="8" cy="8" r="2"/><circle cx="13.6" cy="6.4" r="1" fill="currentColor"/>'), pause:i('<path d="M5.5 3.5v9M10.5 3.5v9"/>') }; })();
function mountMission(m){
  var msg = $('m-msg');
  if (!Viewer.available()){ msg.hidden = false; msg.textContent = T('La vue 3D demande WebGL, indisponible ici. La fiche reste lisible à droite.'); return; }
  Viewer.open($('stage'), m, {
    onPick:function(k){ MS.part = k; MS.tab = 'parts'; renderPanel(m); },
    onState:function(st, hasBody){ msg.hidden = st === 'ready'; if ($('m-body-note')) $('m-body-note').hidden = !(st === 'ready' && hasBody); msg.textContent = st === 'loading' ? T('Chargement de la maquette…') : st === 'nogl' ? T('La vue 3D demande WebGL, indisponible ici. La fiche reste lisible à droite.') : st === 'error' ? T('La maquette n\'a pas pu être chargée.') : ''; }
  });
  Viewer.select(MS.part); Viewer.explode(MS.explode);
  if ($('m-explode')) $('m-explode').addEventListener('input', function(e){ MS.explode = e.target.value / 100; Viewer.explode(MS.explode); });
  $('m-reset').addEventListener('click', function(){ Viewer.reset(m); });
  /* vue de la sonde (le sol défile dessous) ou vue d'orbite (le corps entier, sonde agrandie) ; pause : arrête l'orbite et la rotation (WCAG 2.2.2) */
  Viewer.view(MS.view); Viewer.run(MS.run);
  if ($('m-view')) $('m-view').addEventListener('click', function(e){ MS.view = MS.view === 'orbit' ? 'probe' : 'orbit'; Viewer.view(MS.view); e.currentTarget.setAttribute('aria-pressed', String(MS.view === 'orbit')); });
  $('m-run').addEventListener('click', function(e){ MS.run = !MS.run; Viewer.run(MS.run); e.currentTarget.setAttribute('aria-pressed', String(!MS.run)); });
}
function renderPanel(m){
  if (!m.parts.length) MS.tab = 'fiche';
  document.querySelectorAll('.m-panel [data-ptab]').forEach(function(b){ b.setAttribute('aria-selected', String(b.getAttribute('data-ptab') === MS.tab)); });
  $('m-body').innerHTML = MS.tab === 'fiche' ? fiche(m) : partsHtml(m, MS.part);
}

/* ---------- page « Mission et données » ---------- */
/* date de l'aperçu : la date STAC d'une mosaïque assemblée après la mission n'est pas celle de la prise de vue */
function when(m, d){
  var day = String(d.datetime).slice(0, 10), end = (m.events || []).filter(function(e){ return e.type === 'end'; })[0];
  return end && day > end.date ? T('Date du produit dans le catalogue') + ' : ' + esc(day) + ' (' + T('après la fin de la mission : ce n\'est pas la date de prise de vue') + '). '
    : T('Prise le') + ' ' + esc(day) + '. ';
}
/* licence et crédit de l'image, écrits dans data/*.json par tools/data/credits.py ; registre complet : CREDITS.md */
var CREDITS_URL = 'https://github.com/Rolgim/EarthObservers/blob/main/CREDITS.md';
function licLine(d, noCredit){
  if (!d.license_fr) return '';
  var en = OBS_LANG === 'en', l = en ? d.license_en : d.license_fr;
  return '<br>' + T('Licence') + (en ? ': ' : ' : ') + (d.license_url ? '<a href="' + esc(d.license_url) + '" rel="noopener" target="_blank">' + esc(l) + '</a>' : esc(l)) +
    (d.credit_line && !noCredit ? ' · ' + T('Crédit') + (en ? ': ' : ' : ') + esc(d.credit_line) : '') + ' · <a href="' + CREDITS_URL + '" rel="noopener" target="_blank">' + T('registre des crédits') + '</a>';
}
function realData(m, R){
  R = R || m.real;
  var key = R && R.key, d = key && (window.DATA_FILES || {})[key];
  if (!d) return '<p class="note">' + T(R && R.none || 'Aucune donnée réelle téléchargée pour l\'instant.') + '</p>';
  if (d.press) return pressImage(m, R, d);
  if (d.plot) return plotFigure(m, R, d);
  var out = d.out_size || [d.out_px, d.out_px], en = OBS_LANG === 'en';
  var how = d.crop ? (en ? 'Middle part (' + d.crop[0] + ' × ' + d.crop[1] + ' pixels) of the ' + d.full_size[0] + ' × ' + d.full_size[1] + ' pixel strip published by the archive' + (out[0] !== d.crop[0] ? ', scaled to ' + out[0] + ' × ' + out[1] : '')
                            : 'Partie centrale (' + d.crop[0] + ' × ' + d.crop[1] + ' pixels) de la bande de ' + d.full_size[0] + ' × ' + d.full_size[1] + ' pixels publiée par l\'archive' + (out[0] !== d.crop[0] ? ', ramenée à ' + out[0] + ' × ' + out[1] : ''))
          : d.crop_px ? (en ? 'Central square of the ' + d.full_size[0] + ' × ' + d.full_size[1] + ' pixel strip (' + d.crop_px + ' pixels wide), scaled to ' + out[0] + ' × ' + out[1]
                            : 'Carré central de la bande de ' + d.full_size[0] + ' × ' + d.full_size[1] + ' pixels (' + d.crop_px + ' pixels de côté), ramené à ' + out[0] + ' × ' + out[1])
                      : (en ? 'Whole preview published by the archive (' + d.full_size[0] + ' × ' + d.full_size[1] + ' pixels)' + (out[0] !== d.full_size[0] ? ', scaled to ' + out[0] + ' × ' + out[1] : '')
                            : 'Aperçu entier publié par l\'archive (' + d.full_size[0] + ' × ' + d.full_size[1] + ' pixels)' + (out[0] !== d.full_size[0] ? ', ramené à ' + out[0] + ' × ' + out[1] : ''));
  return '<figure class="real"><img src="data/' + key + '.jpg" width="' + out[0] + '" height="' + out[1] + '" alt="' + (R.altRaw ? esc(R.altRaw) : T(R.alt)) + ' (' + esc(d.product) + ')">' +
    '<figcaption><strong>' + esc(T(d.instrument)) + ' · ' + esc(d.product) + '</strong><br>' + when(m, d) + how +
    (d.stretch ? (en ? ', contrast stretched between the ' + d.stretch[0] + ' and ' + d.stretch[1] + ' percentiles' : ', contraste étiré entre les centiles ' + OBS_NUM(String(d.stretch[0]).replace('.', ',')) + ' et ' + OBS_NUM(String(d.stretch[1]).replace('.', ','))) : '') + '.<br>' +
    T('Archive') + ' : ' + T(d.archive) + ' · ' + T('collection') + ' <code>' + esc(d.collection) + '</code> · <a href="' + esc(d.href) + '" rel="noopener" target="_blank">' + T('aperçu d\'origine') + '</a> · ' + T('téléchargé le') + ' ' + esc(d.fetched) + licLine(d) + '</figcaption></figure>';
}
/* tracé fait par ce site à partir d'un fichier de données de l'archive (tools/data/plots.py) */
function plotFigure(m, R, d){
  var out = d.out_size, en = OBS_LANG === 'en';
  return '<figure class="real plot"><img src="data/' + R.key + '.jpg" width="' + out[0] + '" height="' + out[1] + '" alt="' + esc(R.altRaw || R.alt) + ' (' + esc(d.product) + ')">' +
    '<figcaption><strong>' + esc(T(d.instrument)) + ' · ' + esc(d.product) + '</strong><br>' + (d.datetime ? T('Date du produit dans le catalogue') + ' : ' + esc(String(d.datetime).slice(0, 10)) + '. ' : '') + esc(en ? d.how_en : d.how_fr) + '<br>' +
    T('Archive') + ' : ' + T(d.archive) + ' · ' + T('collection') + ' <code>' + esc(d.collection) + '</code> · <a href="' + esc(d.href) + '" rel="noopener" target="_blank">' + T('fichier de données') + '</a> · ' + T('téléchargé le') + ' ' + esc(d.fetched) + licLine(d) + '</figcaption></figure>';
}
/* image de presse (bibliothèque d'images de la NASA) : déjà traitée par l'équipe, ce n'est pas un produit d'archive */
function pressImage(m, R, d){
  var out = d.out_size, en = OBS_LANG === 'en';
  return '<figure class="real"><img src="data/' + R.key + '.jpg" width="' + out[0] + '" height="' + out[1] + '" alt="' + esc(R.altRaw || R.alt) + ' (' + esc(d.product) + ')">' +
    '<figcaption><strong>' + esc(T(d.instrument)) + ' · ' + esc(d.product) + ' · ' + (en ? '“' : '« ') + esc(d.title) + (en ? '”' : ' »') + '</strong><br>' +
    (d.datetime ? T('Image publiée le') + ' ' + esc(String(d.datetime).slice(0, 10)) + '. ' : '') + esc(R.what || '') + ' ' +
    (en ? 'Whole image as published (' + d.full_size[0] + ' × ' + d.full_size[1] + ' pixels)' + (out[0] !== d.full_size[0] ? ', scaled to ' + out[0] + ' × ' + out[1] : '') + ', already processed by the team: a press image, not an archive product.'
        : 'Image entière telle que publiée (' + d.full_size[0] + ' × ' + d.full_size[1] + ' pixels)' + (out[0] !== d.full_size[0] ? ', ramenée à ' + out[0] + ' × ' + out[1] : '') + ', déjà traitée par l\'équipe : image de presse, pas un produit d\'archive.') + '<br>' +
    T('Crédit') + (en ? ': ' : ' : ') + esc(d.credit) + ' · ' + T(d.archive) + ' · <a href="' + esc(d.page) + '" rel="noopener" target="_blank">' + T('page de l\'image') + '</a> · ' + T('téléchargé le') + ' ' + esc(d.fetched) + licLine(d, true) +
    (R.why ? '<br><span class="note">' + esc(R.why) + '</span>' : '') + '</figcaption></figure>';
}
var PAGES = {
  accueil: function(){ return EarthPage.html(); },
};

function currentRoute(){ var r = (location.hash || '').replace(/^#/, '').replace(/^(en|fr)-/, ''); return r; }
function route(){
  var r = (location.hash || '').replace(/^#/, '').replace(/^(en|fr)-/, '') || 'accueil';
  if (r === 'missions'){ r = window.EO_LAST || MISSIONS[0].id; history.replaceState(null, '', '#' + ((location.hash.match(/^#((?:en|fr)-)/) || [])[1] || '') + r); }   /* « Missions » ouvre la vue 3D de la dernière sonde vue */
  var dm = /^(\w+)-donnees(?:-([\w-]+))?$/.exec(r), m = mission(dm ? dm[1] : r);
  if (m) window.EO_LAST = m.id;
  var xp = !m && Views.page(r);   /* Flotte, Comparer et leurs sous-pages */
  if (!m && !xp && !PAGES[r]) r = 'accueil';
  renderHeader(m ? m.id + (dm ? '-donnees' + (dm[2] && /^(mission|orbite)$/.test(dm[2]) ? '-' + dm[2] : '') : '') : Views.base(r));
  $('page').innerHTML = m ? (dm ? MissionPage.html(m, dm[2] || '', { real:realData }) : missionPage(m)) : xp || PAGES[r]();
  $('page').classList.toggle('is-mission', !!(m && !dm));
  $('page').classList.toggle('is-xp', !!(xp || dm));
  $('page').classList.toggle('is-solar', !m && !xp && r === 'accueil');
  if (m && !dm) mountMission(m);
  if (!m && r === 'accueil') EarthPage.mount(); else EarthPage.stop();
  var h2 = $('page').querySelector('h2');
  document.title = (h2 ? h2.textContent + ' · ' : '') + T('Observateurs de la Terre');
  $('live').textContent = h2 ? h2.textContent : '';
}

document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest('#b-lang,#b-theme,[data-go],[data-ptab],[data-part],[data-body]') : null;
  if (!el) return;
  var cm = mission((location.hash || '').replace(/^#/, '').replace(/^(en|fr)-/, ''));
  if (el.hasAttribute('data-ptab') && cm){ MS.tab = el.getAttribute('data-ptab'); renderPanel(cm); return; }
  if (el.hasAttribute('data-part') && cm){ var k = el.getAttribute('data-part'); MS.part = MS.part === k ? null : k; Viewer.select(MS.part); renderPanel(cm); var b = document.querySelector('[data-part="' + k + '"]'); if (b) b.focus(); return; }
  if (el.hasAttribute('data-body')){ window.EO_BODY = el.getAttribute('data-body'); window.EO_BODY_LOCK = true; renderHeader(currentRoute()); window.EO_BODY_LOCK = false;
    var f = document.querySelector('#tabs .trow .tab'); if (f) f.focus(); return; }
  if (el.id === 'b-lang'){ var nl = OBS_LANG === 'en' ? 'fr' : 'en'; try { localStorage.setItem('eo-lang', nl); } catch(x){} location.hash = nl + '-' + (location.hash || '').replace(/^#/, '').replace(/^(en|fr)-/, ''); location.reload(); return; }
  if (el.id === 'b-theme'){ var nt = isDark() ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', nt); try { localStorage.setItem('eo-theme', nt); } catch(x){} route(); $('b-theme').focus(); return; }
  location.hash = el.getAttribute('data-go');
});
/* onglets des sondes : flèches gauche/droite, début, fin (motif « tablist ») */
document.addEventListener('keydown', function(e){
  var t = e.target.closest && e.target.closest('#tabs [role="tab"]'); if (!t) return;
  var all = [].slice.call(document.querySelectorAll('#tabs [role="tab"]')), i = all.indexOf(t), n = all.length, j = -1;
  if (e.key === 'ArrowRight') j = (i + 1) % n; else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1;
  if (j < 0) return; e.preventDefault(); location.hash = all[j].getAttribute('data-go');
  setTimeout(function(){ var a = document.querySelector('#tabs [aria-selected="true"]'); if (a) a.focus(); }, 0);
});
window.addEventListener('hashchange', route);
OBS_I18N.static();
route();
window.__eo = { route:route, mission:mission };
})();
