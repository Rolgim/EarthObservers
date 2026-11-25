/* Réglages propres au site pour le module « Trajet de la lumière » (socle/page/optics.js).
   craft : nom du véhicule dans les schémas ; echo : 2e étape de la radioscience ;
   types : type d'instrument → famille de dessin ; data : valeurs sourcées des caméras principales
   (figs : un dessin par voie ; rows : [libellé, valeur, clé de source], règle 1). */
var OPTICS_SITE = {
  craft: function(){ return L('satellite', 'satellite'); },
  echo: function(){ return L('Le satellite le renvoie ; son mouvement décale la fréquence (effet Doppler).', 'The spacecraft sends it back; its motion shifts the frequency (Doppler effect).'); },
  types: { cam:'cam', therm:'cam', rad:'rad', alt:'alt', radar:'radar', grav:'radio' },
  data: function(){ return {
    'landsat9:tirs2':{ figs:[{ kind:'refr', lens:L('télescope à quatre lentilles, f/1,64', 'four-lens telescope, f/1.64'), filt:true, det:L('3 barrettes QWIP à 43 K', '3 QWIP arrays at 43 K') }],
      rows:[[L('Télescope', 'Telescope'), L('réfracteur à quatre lentilles, faisceau à f/1,64', 'four-element refractor, f/1.64 beam'), 'tirs'], [L('Champ', 'Field of view'), '15°', 'tirs'],
        [L('Filtres', 'Filters'), L('deux filtres interférentiels (bandes 10 et 11)', 'two interference filters (bands 10 and 11)'), 'tirs'],
        [L('Détecteurs', 'Detectors'), L('3 barrettes QWIP de 640 détecteurs, refroidies à 43 K', '3 QWIP arrays of 640 detectors, cooled to 43 K'), 'tirs']] }
  }; }
};
