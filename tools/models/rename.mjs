// node rename.mjs in.glb out.glb map.json — renomme les nœuds d'une maquette d'après une table { nomDOrigine: pièce } :
// chaque nœud devient « <pièce>_<n> » (le site retrouve la pièce par le nom du nœud, suffixe _<n> retiré, voir src/viewer.js).
// Pour les maquettes déjà découpées par pièce (Eyes on the Earth) : pas besoin de seg_lib.js. Un nœud absent de la table garde son nom.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import fs from 'fs';
const [src, out, mapf] = process.argv.slice(2), map = JSON.parse(fs.readFileSync(mapf, 'utf8'));
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS), doc = await io.read(src), n = {}, miss = [];
for (const node of doc.getRoot().listNodes()){
  const k = map[node.getName()]; if (!k){ miss.push(node.getName()); continue; }
  n[k] = (n[k] || 0) + 1; node.setName(k + '_' + n[k]);
  const m = node.getMesh(); if (m) m.setName(k + '_' + n[k]);
}
await io.write(out, doc); console.log('pièces', JSON.stringify(n), miss.length ? 'non renommés : ' + miss.join(', ') : '');
