// node bbox.mjs in.glb — centre et taille (repère de la maquette) de chaque nœud maillé, pour écrire une table maps/<id>.json
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/core';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS), doc = await io.read(process.argv[2]);
for (const n of doc.getRoot().listNodes()){ if (!n.getMesh()) continue;
  const b = getBounds(n), c = b.min.map((v, i) => +((v + b.max[i]) / 2).toFixed(2)), s = b.min.map((v, i) => +(b.max[i] - v).toFixed(2));
  console.log(JSON.stringify(n.getName()), JSON.stringify(c), JSON.stringify(s)); }
