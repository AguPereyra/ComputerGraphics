console.log('tp03')

const WebGLRend = require('./clases/webglrenderer')
const Mesh = require('./clases/mesh')
const Scene = require('./clases/scene')
const Geometry = require('./clases/geometry')
const RegPol = require('./clases/regularConvexPolygonGeometry')
const Dat = require('dat.gui')
const Camera = require('./clases/camera')

// Obtener canvas sobre el que dibujar
const canvas = document.getElementById('c')

const edges = [4, 6, 20] //  Arreglo que tendrá la cantidad de vértices de los polígonos
const colors = [
  [0.5, 1.0, 0.0, 1.0],
  [1.0, 0.0, 0.0, 1.0],
  [0.0, 1.0, 1.0, 1.0]
] //  Arreglo que tendrá el color de cada polígono

//  Función que genera el arreglo Float32Array
//  del largo necesario para establecer el color en todos los
//  vértices de la figura. El color que establece es el pasado
//  por parámetros.
//  Se espera que color sea un vector en rgba.
function generateColorsArray (color, edges) {
  let colors = []
  for (let i = 0; i < edges; i++) {
    colors.push(color[0], color[1], color[2], color[3])
  }
  return new Float32Array(colors)
}

//  Polígonos en las mallas a renderizar
let meshes = []
//  Generar polígonos e insertar en los meshes
for (let i = 0; i < 3; i++) {
  let pol = new RegPol(edges[i])
  let polColor = generateColorsArray(colors[i], edges[i])
  meshes[i] = new Mesh(pol, polColor)
}

//  Cámara
const camera = new Camera()

//  Función que dibuja los vertices
//  positivos XY con rojo y verde en
//  una malla de la escena.
function _defaultVertexes () {
  //  Ejes
  const vertices = new Float32Array([
    0.0, 0.0, 0.0, //  Línea roja
    0.0, 0.0, 0.0, //  Línea verde
    1.0, 0.0, 0.0, //  Línea roja
    0.0, -1.0, 0.0 //  Línea verde
  ])
  const indexes = new Uint16Array([
    0, 2,
    1, 3
  ])
  const colors = new Float32Array([
    1.0, 0.0, 0.0, 1.0, //  Rojo
    0.0, 1.0, 0.0, 1.0, //  Verde
    1.0, 0.0, 0.0, 1.0, //  Rojo
    0.0, 1.0, 0.0, 1.0, //  Verde
  ])
  //  Envolver en objeto Geometry
  const geometry = new Geometry()
  geometry._vertices = vertices
  geometry._faces = indexes
  //  Crear mesh
  const mesh = new Mesh(geometry, colors)
  mesh._drawAsTriangle = false // Dibujar meshes con LINES y no con TRIANGLES
  return mesh
}

//  Crear cuadro con figuras a dibujar
//  Ejes
const axes = _defaultVertexes()
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
  renderer.render(scene, camera)
}
window.requestAnimationFrame(main)

//  DatGUI
const gui = new Dat.GUI()
//  Polígonos
const polGui = []
for (let i = 0; i < meshes.length; i++) {
  polGui.push(gui.addFolder('Polygon ' + i))
  polGui[i].add(meshes[i], '_tx').min(-5).max(5).step(0.01)
  polGui[i].add(meshes[i], '_ty').min(-5).max(5).step(0.01)
  polGui[i].add(meshes[i], '_tz').min(-5).max(5).step(0.01)
  polGui[i].add(meshes[i], '_rz').min(0).max(2 * Math.PI).step(0.01)
  polGui[i].add(meshes[i], '_sx').min(0).step(0.1)
  polGui[i].add(meshes[i], '_sy').min(0).step(0.1)
}
