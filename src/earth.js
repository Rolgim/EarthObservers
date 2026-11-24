/* =================================================================
   ACCUEIL « LA TERRE VUE D'EN HAUT » — le globe et les satellites du registre à leur position réelle, sur le modèle de
   l'accueil « Système solaire » de SolarExplorers (solar.js) : la vue, des boutons posés dessus, la barre de lecture en dessous,
   la liste des satellites à droite.
   Positions : éléments orbitaux (TLE) de CelesTrak téléchargés chaque jour (data/tle.json, tools/data/fetch_tle.py), propagés dans
   le navigateur par le modèle SGP4 (bibliothèque satellite.js, licence MIT). Précision de SGP4 : de l'ordre du kilomètre près de
   l'époque des éléments, quelques kilomètres par jour au-delà (≈, signalé).
   À l'échelle : la Terre, l'altitude et la forme des orbites. Pas à l'échelle : la taille des points des satellites (signalé).
   Repère : inertiel (TEME de SGP4) ; la Terre tourne dedans selon le temps sidéral ; le Soleil éclaire d'après sa position
   calculée par la formule simplifiée de l'Astronomical Almanac (précision ≈ 0,01°).
   EarthPage.html() rend la page, EarthPage.mount() la branche, EarthPage.stop() l'arrête.
================================================================= */
var EarthPage = (function(){
'use strict';
var RE = 6371;   /* rayon moyen de la Terre, km (NASA NSSDCA, « Earth Fact Sheet ») */
var COL = ['#FF6B9A', '#4DD0E1', '#B39DDB', '#FFB74D', '#81C784', '#F06292', '#64B5F6', '#FFD54F', '#A1887F', '#E57373'];   /* une couleur par satellite, dans l'ordre du registre */
var SPEED = [[1, 'temps réel'], [10, '10 fois plus vite'], [60, 'une minute par seconde'], [600, 'dix minutes par seconde']];
var S = { t:Date.now(), speed:1, run:true, raf:0, last:0, sel:'', az:0, el:0.35, dist:4.2, frame:0, built:false };
var R = null;   /* objets three.js */
function T(s){ return OBS_T(s); }
function en(){ return OBS_LANG === 'en'; }
function colon(){ return en() ? ': ' : ' : '; }
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function reduce(){ return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; }
function dec(x, d){ return OBS_NUM(x.toFixed(d).replace('.', en() ? '.' : ',')); }
function fmt(t){ return new Date(t).toLocaleString(en() ? 'en-GB' : 'fr-FR', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', timeZone:'UTC' }) + (en() ? ' UTC' : ' TU'); }
function TLE(){ return (window.DATA_FILES || {}).tle; }

/* satellites à suivre : un par numéro NORAD du registre (une constellation en donne plusieurs) */
function sats(){
  var d = TLE(), out = [];
  if (!d || !window.satellite) return out;
  MISSIONS.forEach(function(m, i){ (m.norad || []).forEach(function(n){ var e = d.sats[String(n)]; if (!e) return;
    var rec = satellite.twoline2satrec(e.l1, e.l2); if (rec.error) return;
    out.push({ m:m, n:n, name:e.name, epoch:e.epoch, rec:rec, col:COL[i % COL.length], key:m.id + ':' + n }); }); });
  return out;
}
/* position inertielle (km) à l'instant t ; null si SGP4 échoue */
function eci(s, t){ var p = satellite.propagate(s.rec, new Date(t)); return p && p.position && typeof p.position === 'object' ? p : null; }
function v3(p){ return new THREE.Vector3(p.x / RE, p.z / RE, -p.y / RE); }   /* TEME (x, y, z) → scène (x, z, -y), en rayons terrestres */
/* direction du Soleil dans le repère inertiel (Astronomical Almanac, formule simplifiée) */
function sunDir(t){
  var n = t / 864e5 + 2440587.5 - 2451545, rd = Math.PI / 180;
  var L = 280.460 + 0.9856474 * n, g = (357.528 + 0.9856003 * n) * rd, lam = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rd, eps = (23.439 - 0.0000004 * n) * rd;
  return v3({ x:Math.cos(lam), y:Math.cos(eps) * Math.sin(lam), z:Math.sin(eps) * Math.sin(lam) }).multiplyScalar(RE).normalize();
}

function html(){
  var sp = SPEED.map(function(s){ return '<option value="' + s[0] + '"' + (s[0] === S.speed ? ' selected' : '') + '>' + esc(T(s[1])) + '</option>'; }).join('');
  return '<div class="home solar earth">' +
    '<div class="home-map">' +
      '<div class="home-head"><h2>' + esc(T('La Terre vue d\'en haut')) + '</h2><p>' + esc(T('Les satellites d\'observation de la Terre à leur position réelle, calculée dans votre navigateur à partir de leurs éléments orbitaux du jour. La lecture part de l\'instant présent.')) + '</p></div>' +
      '<div class="home-sky so-sky eo-sky" id="eo-wrap">' +
        '<div class="eo-labs" id="eo-labs" aria-hidden="true"></div>' +
        '<div class="home-zoom" role="group" aria-label="' + esc(T('Cadrage')) + '">' +
          '<button id="eo-zin" aria-label="' + esc(T('Zoomer')) + '" title="' + esc(T('Zoomer')) + '">+</button><button id="eo-zout" aria-label="' + esc(T('Dézoomer')) + '" title="' + esc(T('Dézoomer')) + '">−</button></div>' +
        '<p class="m-msg" id="eo-msg" hidden></p>' +
      '</div>' +
      '<div class="home-ctl so-ctl">' +
        '<button class="dep-b" id="eo-play"></button>' +
        '<span class="home-yr" id="eo-day" aria-live="off"></span>' +
        '<label class="so-sel"><span>' + esc(T('Vitesse')) + '</span> <select id="eo-speed">' + sp + '</select></label>' +
        '<button class="chip" id="eo-now">' + esc(T('Maintenant')) + '</button>' +
      '</div>' +
      '<p class="cap" id="eo-note"></p><p class="sr-only" id="eo-cap"></p>' +
    '</div>' +
    '<aside class="home-side" aria-label="' + esc(T('Satellites')) + '">' +
      '<p class="home-al">' + esc(T('Choisissez un satellite pour voir son orbite et sa position. Glisser pour tourner, molette ou boutons pour zoomer.')) + '</p>' +
      '<h3>' + esc(T('Satellites')) + '</h3><div class="home-leg" id="eo-list"></div>' +
      '<div id="eo-info"></div>' +
    '</aside></div>';
}

function list(L){
  $('eo-list').innerHTML = L.map(function(s){
    return '<button class="home-li" data-eo="' + s.key + '" aria-pressed="' + (S.sel === s.key) + '"><i style="background:' + s.col + '"></i><b>' + esc(s.name) + '</b><span></span><small>' + esc(s.m.short) + '</small></button>';
  }).join('');
}
function info(){
  var s = R && R.list.filter(function(x){ return x.key === S.sel; })[0], box = $('eo-info'); if (!box) return;
  if (!s){ box.innerHTML = ''; return; }
  var p = eci(s, S.t); if (!p){ box.innerHTML = '<p class="cap">' + esc(T('Position non calculable à cette date (SGP4).')) + '</p>'; return; }
  var g = satellite.eciToGeodetic(p.position, satellite.gstime(new Date(S.t))), v = p.velocity;
  var lat = satellite.degreesLat(g.latitude), lon = satellite.degreesLong(g.longitude), spd = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  var age = (S.t - Date.parse(s.epoch)) / 864e5;
  box.innerHTML = '<div class="home-pick eo-info"><h3>' + esc(s.name) + '</h3><dl class="eo-dl">' +
    '<dt>' + esc(T('Altitude')) + '</dt><dd>≈ ' + dec(g.height, 0) + ' km</dd>' +
    '<dt>' + esc(T('Latitude')) + '</dt><dd>' + dec(Math.abs(lat), 2) + '° ' + T(lat >= 0 ? 'N' : 'S') + '</dd>' +
    '<dt>' + esc(T('Longitude')) + '</dt><dd>' + dec(Math.abs(lon), 2) + '° ' + T(lon >= 0 ? 'E' : 'O') + '</dd>' +
    '<dt>' + esc(T('Vitesse')) + '</dt><dd>' + dec(spd, 2) + ' km/s</dd>' +
    '<dt>' + esc(T('Éléments du')) + '</dt><dd>' + esc(s.epoch.replace('T', ' ').replace('Z', en() ? ' UTC' : ' TU')) + '</dd></dl>' +
    (Math.abs(age) > 3 ? '<p class="cap">' + esc(T('Loin de la date des éléments : la position est moins sûre (SGP4 dérive de quelques kilomètres par jour).')) + '</p>' : '') +
    '<a class="cta" href="#' + s.m.id + '">' + esc(T('Voir le satellite')) + ' : ' + esc(s.m.short) + '</a></div>';
}

function build(){
  var wrap = $('eo-wrap'), r = R;
  r.renderer = new THREE.WebGLRenderer({ antialias:true }); r.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.renderer.outputEncoding = THREE.sRGBEncoding;
  r.renderer.domElement.setAttribute('aria-hidden', 'true'); wrap.insertBefore(r.renderer.domElement, wrap.firstChild);
  r.scene = new THREE.Scene(); r.camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  r.sun = new THREE.DirectionalLight(0xffffff, 1.9); r.scene.add(r.sun, new THREE.AmbientLight(0xffffff, 0.22));
  var tex = new THREE.TextureLoader().load('data/tex-earth.jpg'); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
  r.globe = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 48), new THREE.MeshStandardMaterial({ map:tex, roughness:1, metalness:0 }));
  r.scene.add(r.globe);
  r.list.forEach(function(s){
    s.dot = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3)),
      new THREE.PointsMaterial({ color:s.col, size:9, sizeAttenuation:false }));
    s.orb = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color:s.col, transparent:true, opacity:0.35 }));
    r.scene.add(s.dot, s.orb);
  });
  var cv = r.renderer.domElement, drag = null;
  cv.addEventListener('pointerdown', function(e){ drag = { x:e.clientX, y:e.clientY, moved:false }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', function(e){ if (!drag) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
    S.az -= dx * 0.006; S.el = Math.max(-1.45, Math.min(1.45, S.el + dy * 0.005)); drag.x = e.clientX; drag.y = e.clientY; cv.classList.add('dragging'); kick(); });
  cv.addEventListener('pointerup', function(e){ cv.classList.remove('dragging'); if (drag && !drag.moved) pick(e); drag = null; });
  cv.addEventListener('wheel', function(e){ e.preventDefault(); zoom(1 + Math.sign(e.deltaY) * 0.1); }, { passive:false });
}
function zoom(f){ S.dist = Math.max(1.35, Math.min(14, S.dist * f)); kick(); }
/* clic sur la vue : le satellite visible le plus proche du pointeur, à 14 px près */
function pick(e){
  var rect = R.renderer.domElement.getBoundingClientRect(), best = null, bd = 14;
  R.list.forEach(function(s){ if (!s.scr || s.hid) return; var d = Math.hypot(s.scr[0] - (e.clientX - rect.left), s.scr[1] - (e.clientY - rect.top)); if (d < bd){ bd = d; best = s; } });
  select(best ? best.key : '');
}
function select(k){
  S.sel = S.sel === k ? '' : k;
  document.querySelectorAll('#eo-list [data-eo]').forEach(function(b){ b.setAttribute('aria-pressed', String(b.getAttribute('data-eo') === S.sel)); });
  S.orbAt = 0; kick(); info();
}
function resize(){ if (!R || !R.renderer) return; var w = $('eo-wrap'); if (!w) return; var W = w.clientWidth, H = w.clientHeight; R.renderer.setSize(W, H, false); R.camera.aspect = W / Math.max(1, H); R.camera.updateProjectionMatrix(); S.W = W; S.H = H; }

/* orbites : un tour complet autour de l'instant affiché, recalculé quand l'instant a bougé de plus de 2 minutes */
function orbits(){
  R.list.forEach(function(s){
    var per = 2 * Math.PI / s.rec.no * 60000, pts = [];   /* no : mouvement moyen en radians par minute */
    for (var k = 0; k <= 160; k++){ var p = eci(s, S.t + (k / 160 - 0.5) * per); if (p) pts.push(v3(p.position)); }
    s.orb.geometry.dispose(); s.orb.geometry = new THREE.BufferGeometry().setFromPoints(pts);
    s.orb.material.opacity = !S.sel ? 0.35 : s.key === S.sel ? 0.95 : 0.12;
  });
  S.orbAt = S.t;
}
function draw(){
  var r = R, t = S.t, date = new Date(t);
  r.globe.rotation.y = satellite.gstime(date);
  var sd = sunDir(t); r.sun.position.copy(sd).multiplyScalar(10);
  if (!S.orbAt || Math.abs(t - S.orbAt) > 120000) orbits();
  var ce = Math.cos(S.el); r.camera.position.set(Math.sin(S.az) * ce * S.dist, Math.sin(S.el) * S.dist, Math.cos(S.az) * ce * S.dist); r.camera.lookAt(0, 0, 0);
  r.camera.updateMatrixWorld();
  var labs = '', cam = r.camera.position;
  r.list.forEach(function(s){
    var p = eci(s, t); s.dot.visible = !!p; if (!p){ s.scr = null; return; }
    var v = v3(p.position); s.dot.geometry.attributes.position.setXYZ(0, v.x, v.y, v.z); s.dot.geometry.attributes.position.needsUpdate = true;
    s.dot.material.size = s.key === S.sel ? 13 : 9;
    /* caché derrière la Terre : le segment caméra → satellite coupe la sphère */
    var d = v.clone().sub(cam), a = d.dot(d), b = 2 * cam.dot(d), c = cam.dot(cam) - 1, disc = b * b - 4 * a * c, u = disc > 0 ? (-b - Math.sqrt(disc)) / (2 * a) : 2;
    s.hid = u > 0 && u < 1;
    var q = v.clone().project(r.camera); s.scr = [(q.x + 1) / 2 * S.W, (1 - q.y) / 2 * S.H];
    if (!s.hid && q.z < 1) labs += '<span class="eo-lab' + (s.key === S.sel ? ' on' : '') + '" style="left:' + s.scr[0].toFixed(0) + 'px;top:' + s.scr[1].toFixed(0) + 'px;color:' + s.col + '">' + esc(s.name) + '</span>';
  });
  $('eo-labs').innerHTML = labs;
  r.renderer.render(r.scene, r.camera);
}
function ui(){
  $('eo-day').textContent = fmt(S.t);
  var b = $('eo-play'); b.textContent = S.run ? '❚❚' : '▶'; b.setAttribute('aria-label', T(S.run ? 'Pause' : 'Lecture')); b.title = T(S.run ? 'Pause' : 'Lecture');
  if (++S.frame % 30 === 1 || !S.run) info();
  var vis = R.list.filter(function(s){ return s.scr && !s.hid; }).map(function(s){ return s.name; });
  $('eo-cap').textContent = T('Vue du globe le') + ' ' + fmt(S.t) + '. ' + T('Satellites du côté visible') + colon() + (vis.join(', ') || T('aucun')) + '.';
}
function loop(now){
  S.raf = 0; if (!$('eo-wrap')) return stop();
  if (S.run){ var dt = S.last ? Math.min(0.25, (now - S.last) / 1000) : 0; S.t += dt * 1000 * S.speed; }
  S.last = now; draw(); ui();
  if (S.run || S.dirty){ S.dirty = false; S.raf = requestAnimationFrame(loop); }
}
function kick(){ S.dirty = true; if (!S.raf){ S.last = 0; S.raf = requestAnimationFrame(loop); } }
function play(v){ S.run = v; kick(); }
function stop(){ S.run = false; S.last = 0; if (S.raf) cancelAnimationFrame(S.raf); S.raf = 0; }

function mount(){
  var d = TLE(), msg = $('eo-msg');
  function fail(t){ msg.hidden = false; msg.textContent = T(t); }
  if (!window.THREE || !window.satellite) return fail('La vue demande les bibliothèques three.js et satellite.js, qui n\'ont pas pu être chargées.');
  if (!d) return fail('Éléments orbitaux pas encore téléchargés (workflow « Données réelles »).');
  if (!R){ R = { list:sats() }; try { build(); } catch(e){ R = null; return fail('La vue 3D demande WebGL, indisponible ici.'); } }
  else $('eo-wrap').insertBefore(R.renderer.domElement, $('eo-wrap').firstChild);
  if (S.az === 0) S.az = -satellite.gstime(new Date(S.t)) + Math.PI / 2 + 0.2;   /* première ouverture : l'Europe et l'Afrique face à la caméra */
  list(R.list); info();
  var tx = d.fetched;
  $('eo-note').innerHTML = esc(T('Positions : éléments orbitaux de CelesTrak téléchargés le') + ' ' + tx.replace('T', ' ').replace('Z', en() ? ' UTC' : ' TU') + ', ' +
    T('propagés par le modèle SGP4 (satellite.js) ; précision ≈ quelques kilomètres. La Terre, les altitudes et les orbites sont à l\'échelle ; les points des satellites sont agrandis. Éclairage d\'après la position calculée du Soleil.')) +
    ' <a class="src" href="https://celestrak.org/NORAD/elements/" rel="noopener" target="_blank">CelesTrak</a> <a class="src" href="https://github.com/shashwatak/satellite-js" rel="noopener" target="_blank">satellite.js</a>' + texCredit();
  $('eo-play').addEventListener('click', function(){ play(!S.run); });
  $('eo-now').addEventListener('click', function(){ S.t = Date.now(); S.orbAt = 0; kick(); info(); });
  $('eo-speed').addEventListener('change', function(e){ S.speed = +e.target.value; kick(); });
  $('eo-zin').addEventListener('click', function(){ zoom(1 / 1.25); });
  $('eo-zout').addEventListener('click', function(){ zoom(1.25); });
  $('eo-list').addEventListener('click', function(e){ var b = e.target.closest('[data-eo]'); if (b) select(b.getAttribute('data-eo')); });
  if (!window.__eoResize){ window.__eoResize = 1; window.addEventListener('resize', function(){ if ($('eo-wrap')){ resize(); kick(); } }); }
  if (reduce()) S.run = false;   /* mouvement réduit demandé : la vue part à l'arrêt (bouton Lecture) */
  resize(); kick();
}
function texCredit(){
  var t = (window.DATA_FILES || {})['tex-earth']; if (!t) return '';
  return '<br>' + esc(T('Globe')) + colon() + esc(t.title) + ' (' + esc(t.credit || 'NASA') + ') · ' + esc(T('Licence')) + colon() + '<a href="' + esc(t.page) + '" rel="noopener" target="_blank">' + esc(T(t.license_fr || t.license)) + '</a>';
}
return { html:html, mount:mount, stop:stop };
})();
