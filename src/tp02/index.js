console.log('tp02')

const WebGLRend = require('./clases/webglrenderer')
const Mesh = require('./clases/mesh')
const Scene = require('./clases/scene')
const Geometry = require('./clases/geometry')
const RegPol = require('./clases/regularConvexPolygonGeometry')
const Dat = require('dat.gui')

// Obtener canvas sobre el que dibujar
const canvas = document.getElementById('c')

//  Parametros de los poligonos a dibujar
const statePol1 = {
  edges: 4,
  color: function () {
    let colors = []
    for (let i = 0; i < this.edges; i++) {
      colors.push(0.5, 1.0, 0.0, 1.0)
    }
    return new Float32Array(colors)
  }
}

const statePol2 = {
  edges: 6,
  color: function () {
    let colors = []
    for (let i = 0; i < this.edges; i++) {
      colors.push(1.0, 0.0, 0.0, 1.0)
    }
    return new Float32Array(colors)
  }
}

const statePol3 = {
  edges: 20,
  color: function () {
    let colors = []
    for (let i = 0; i < this.edges; i++) {
      colors.push(0.0, 1.0, 1.0, 1.0)
    }
    return new Float32Array(colors)
  }
}

//  Polígonos en las mallas a renderizar
let meshes = []
const pol1 = new RegPol(statePol1.edges)
const pol2 = new RegPol(statePol2.edges)
const pol3 = new RegPol(statePol3.edges)
meshes[0] = new Mesh(pol1, statePol1.color())
meshes[1] = new Mesh(pol2, statePol2.color())
meshes[2] = new Mesh(pol3, statePol3.color())

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
  mesh._drawAsTriangle = false
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
  renderer.render(scene)
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
