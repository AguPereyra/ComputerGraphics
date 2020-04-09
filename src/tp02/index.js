console.log('tp02')

const WebGLRend = require('./clases/webglrenderer')
const Scene = require('./clases/scene')
const Utils = require('./clases/utils')

// Obtener canvas sobre el que dibujar
const canvas = document.getElementById('c')

const edges = [4, 6, 20] //  Arreglo que tendrá la cantidad de vértices de los polígonos
const colors = [
  [0.5, 1.0, 0.0, 1.0],
  [1.0, 0.0, 0.0, 1.0],
  [0.0, 1.0, 1.0, 1.0]
] //  Arreglo que tendrá el color de cada polígono

//  Polígonos en las mallas a renderizar
let meshes = Utils.generatePolMeshes(edges, colors)
//  Crear cuadro con figuras a dibujar
//  Ejes
const axes = Utils.defaultVertexes()
//  Escena
const scene = new Scene({
  r: 1,
  g: 1,
  b: 1,
  a: 1
})
//  Preparar escena
scene.addMesh(axes)
for (let i = 0; i < meshes.length; i++) {
  scene.addMesh(meshes[i])
}
//  Obtener renderer
const renderer = new WebGLRend(canvas)

//  Redibujar la escena
function main () {
  //  Refrescar pantalla
  window.requestAnimationFrame(main)
  //  Dibujar
  renderer.render(scene)
}
window.requestAnimationFrame(main)

//  Generar DatGui
Utils.generateDatGui(meshes)
