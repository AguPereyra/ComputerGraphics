console.log('tp03')

const WebGLRend = require('./clases/webglrenderer')
const Mesh = require('./clases/mesh')
const Scene = require('./clases/scene')
const Geometry = require('./clases/geometry')
const RegPol = require('./clases/regularConvexPolygonGeometry')
const Dat = require('dat.gui')
const PerspectiveCamera = require('./clases/perspectiveCamera')
const OrtographicCamera = require('./clases/ortographicCamera')

// Obtener canvas sobre el que dibujar
const canvas = document.getElementById('c')

// --------------------------------
// Variables para DAT GUI
let camarasGui = {
  camara: 0,
}
// --------------------------------
//  Valores por defecto
const gl = canvas.getContext('webgl')
let orthoGui = {
  left: -10,
  right: 10,
  far: 1000,
  near: 0.001,
  bottom: -10,
  top: 10
}
let perspectiveGui = {
  fovy: Math.PI / 4,
  aspect: gl.canvas.width / gl.canvas.height,
  near: 0.001,
  far: 1000
}

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

//  Cámaras
let cameras = []
//  Perspectiva
cameras[0] = new PerspectiveCamera(perspectiveGui.fovy, perspectiveGui.aspect,
  perspectiveGui.near, perspectiveGui.far)
//  Ortográfica
cameras[1] = new OrtographicCamera(orthoGui.left, orthoGui.right, orthoGui.bottom,
  orthoGui.top, orthoGui.near, orthoGui.far)

//  Función que dibuja los vertices
//  positivos XY con rojo y verde en
//  una malla de la escena.
function _defaultVertexes () {
  //  Ejes
  const vertices = new Float32Array([
    0.0, 0.0, 0.0, // Línea roja (X)
    0.0, 0.0, 0.0, // Línea verde (Y)
    0.0, 0.0, 0.0, // Línea azul (Z)
    10.0, 0.0, 0.0, // Línea roja (X)
    0.0, 10.0, 0.0, // Línea verde (Y)
    0.0, 0.0, 10.0 // Línea azul (Z)
  ])
  const indexes = new Uint16Array([
    0, 3, // X
    1, 4, // Y
    2, 5 // Z
  ])
  const colors = new Float32Array([
    1.0, 0.0, 0.0, 1.0, //  Rojo
    0.0, 1.0, 0.0, 1.0, //  Verde
    0.0, 0.0, 1.0, 1.0, //  Azul
    1.0, 0.0, 0.0, 1.0, //  Rojo
    0.0, 1.0, 0.0, 1.0, //  Verde
    0.0, 0.0, 1.0, 1.0 //  Azul
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
  r: 0,
  g: 0,
  b: 0,
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
  renderer.render(scene, cameras[camarasGui.camara])
}
window.requestAnimationFrame(main)

//  DatGUI
const gui = new Dat.GUI()
//  Polígonos
const polFolder = gui.addFolder('Polygons')
const polGui = []
for (let i = 0; i < meshes.length; i++) {
  polGui.push(polFolder.addFolder('Polygon ' + i))
  polGui[i].add(meshes[i], '_tx').min(-5).max(5).step(0.01)
  polGui[i].add(meshes[i], '_ty').min(-5).max(5).step(0.01)
  polGui[i].add(meshes[i], '_tz').min(-5).max(5).step(0.01)
  polGui[i].add(meshes[i], '_rz').min(0).max(2 * Math.PI).step(0.01)
  polGui[i].add(meshes[i], '_sx').min(0).step(0.1)
  polGui[i].add(meshes[i], '_sy').min(0).step(0.1)
}
//  Cámaras
const camaraFolder = gui.addFolder('Camera')
camaraFolder.add(camarasGui, 'camara', { Perspective: 0, Orthographic: 1 })

//  Cámara de Proyección Ortográfica
const orthoFolder = camaraFolder.addFolder('Orthographic Camera')
orthoFolder.add(cameras[1], '_left').min(-1000).max(0).step(0.01)
orthoFolder.add(cameras[1], '_right').min(0).max(1000).step(0.01)
orthoFolder.add(cameras[1], '_bottom').min(-1000).max(0).step(0.01)
orthoFolder.add(cameras[1], '_top').min(0).max(1000).step(0.01)
orthoFolder.add(cameras[1], '_near').min(0).max(100).step(0.001)
orthoFolder.add(cameras[1], '_far').min(0).max(1000).step(0.01)

//  Posición de la cámara
const cameraPosFolderOrtho = orthoFolder.addFolder('Position')
//  Posición del ojo
const eyeFolderOrtho = cameraPosFolderOrtho.addFolder('Eye')
eyeFolderOrtho.add(cameras[1], '_eyeX').min(-10).max(10).step(0.1)
eyeFolderOrtho.add(cameras[1], '_eyeY').min(-10).max(10).step(0.1)
eyeFolderOrtho.add(cameras[1], '_eyeZ').min(-10).max(10).step(0.1)
//  Hacia donde se mira
const centerFolderOrtho = cameraPosFolderOrtho.addFolder('Center')
centerFolderOrtho.add(cameras[1], '_centerX').min(-10).max(10).step(0.1)
centerFolderOrtho.add(cameras[1], '_centerY').min(-10).max(10).step(0.1)
centerFolderOrtho.add(cameras[1], '_centerZ').min(-10).max(10).step(0.1)
//  Orientación de la camara
const upCameraFolderOrtho = cameraPosFolderOrtho.addFolder('Up')
upCameraFolderOrtho.add(cameras[1], '_upX').min(-10).max(10).step(0.1)
upCameraFolderOrtho.add(cameras[1], '_upY').min(-10).max(10).step(0.1)
upCameraFolderOrtho.add(cameras[1], '_upZ').min(-10).max(10).step(0.1)

//  Cámara de Proyección en Perspectiva
const perspectiveFolder = camaraFolder.addFolder('Perspective Camera')
perspectiveFolder.add(cameras[0], '_fovy').min(0).max(2 * Math.PI).step(0.01)
perspectiveFolder.add(cameras[0], '_aspect')
perspectiveFolder.add(cameras[0], '_near').min(0).max(100).step(0.001)
perspectiveFolder.add(cameras[0], '_far').min(0).max(1000).step(0.01)
//  Posición de la cámara
const cameraPosFolderPerspective = perspectiveFolder.addFolder('Position')
//  Posición del ojo
const eyeFolderPerspective = cameraPosFolderPerspective.addFolder('Eye')
eyeFolderPerspective.add(cameras[0], '_eyeX').min(-10).max(10).step(0.1)
eyeFolderPerspective.add(cameras[0], '_eyeY').min(-10).max(10).step(0.1)
eyeFolderPerspective.add(cameras[0], '_eyeZ').min(-10).max(10).step(0.1)
//  Hacia donde se mira
const centerFolderPerspective = cameraPosFolderPerspective.addFolder('Center')
centerFolderPerspective.add(cameras[0], '_centerX').min(-10).max(10).step(0.1)
centerFolderPerspective.add(cameras[0], '_centerY').min(-10).max(10).step(0.1)
centerFolderPerspective.add(cameras[0], '_centerZ').min(-10).max(10).step(0.1)
//  Orientación de la camara
const upCameraFolderPerspective = cameraPosFolderPerspective.addFolder('Up')
upCameraFolderPerspective.add(cameras[0], '_upX').min(-10).max(10).step(0.1)
upCameraFolderPerspective.add(cameras[0], '_upY').min(-10).max(10).step(0.1)
upCameraFolderPerspective.add(cameras[0], '_upZ').min(-10).max(10).step(0.1)
