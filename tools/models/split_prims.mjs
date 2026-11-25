// Sépare chaque primitive d'un maillage en un nœud propre « <maillage>~<matériau> » et affiche sa boîte englobante (m),
// pour les maquettes faites d'un nœud par grande famille (Space Radar : foil, body, solar-panel). Usage : node split_prims.mjs entrée.glb sortie.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/core';
const [,, inp, out] = process.argv;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS), doc = await io.read(inp), root = doc.getRoot();
for (const node of root.listNodes()) {
  const mesh = node.getMesh(); if (!mesh || mesh.listPrimitives().length < 2) continue;
  const parent = node.getParentNode(), scene = root.listScenes()[0];
  for (const prim of mesh.listPrimitives()) {
    const name = mesh.getName() + '~' + (prim.getMaterial() ? prim.getMaterial().getName() : 'x');
    const m = doc.createMesh(name).addPrimitive(prim); mesh.removePrimitive(prim);
    const n = doc.createNode(name).setMesh(m).setTranslation(node.getTranslation()).setRotation(node.getRotation()).setScale(node.getScale());
    (parent || scene).addChild(n);
  }
  node.dispose(); mesh.dispose();
}
for (const n of root.listNodes()) if (n.getMesh()) { const b = getBounds(n); console.log(n.getName().padEnd(26), b.min.map(v => v.toFixed(2)).join(' '), '→', b.max.map(v => v.toFixed(2)).join(' ')); }
await io.write(out, doc);
