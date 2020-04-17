console.log('tp03')

const WebGLRend = require('./classes/webglrenderer')
const Scene = require('./classes/scene')
const PerspectiveCamera = require('./classes/camera/perspectiveCamera')
const OrtographicCamera = require('./classes/camera/ortographicCamera')
const Utils = require('./classes/utils')
const Mesh = require('./classes/mesh')
const CubeGeometry = require('./classes/figures/cubeGeometry')
const CylinderGeometry = require('./classes/figures/cylinderGeometry')
const SphereGeometry = require('./classes/figures/sphereGeometry')

// Obtener canvas sobre el que dibujar
const canvas = document.getElementById('c')

// --------------------------------
// Variables para DAT GUI
//  camarasGui representa la camara en uso.
let camarasGui = {
  camara: 0,
}
//  figures: arreglo con los nombres para el GUI
//  de cada figura, en orden
const figures = ['Cube', 'Sphere', 'Cylinder', 'Cone']
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

const colors = [
  [0.5, 1.0, 0.0, 1.0],
  [1.0, 0.0, 0.0, 1.0],
  [0.0, 1.0, 1.0, 1.0],
  [1.0, 0.0, 1.0, 1.0]
] //  Arreglo que tendrá el color de cada polígono

let meshes = []
//  Generar Cono, Cubo, Cilindro y Esfera
const cube = new CubeGeometry(1)
const sphere = new SphereGeometry(1)
const cylinder = new CylinderGeometry(1, [1, 1])
const cone = new CylinderGeometry(1, [1, 0])

//  Meter en malla
const cubeColor = Utils.generateColorsArray(colors[0], 8)
const sphereColor = Utils.generateColorsArray(colors[3], sphere._vertices.length)
const cylinderColor = Utils.generateColorsArray(colors[2], 32)
const coneColor = Utils.generateColorsArray(colors[1], 17)

meshes.push(new Mesh(cube, cubeColor))
meshes.push(new Mesh(sphere, sphereColor))
meshes.push(new Mesh(cylinder, cylinderColor))
meshes.push(new Mesh(cone, coneColor))

//  Cámaras
let cameras = []
//  Perspectiva
cameras[0] = new PerspectiveCamera(perspectiveGui.fovy, perspectiveGui.aspect,
  perspectiveGui.near, perspectiveGui.far)
//  Ortográfica
cameras[1] = new OrtographicCamera(orthoGui.left, orthoGui.right, orthoGui.bottom,
  orthoGui.top, orthoGui.near, orthoGui.far)

//  Crear cuadro con figuras a dibujar
//  Ejes
const axes = Utils.defaultVertexes()
//  Grilla
const grid = Utils.generateGrid([-10, 10], 0, [-10, 10], [0.5, 0.5, 0.5, 1.0])
//  Escena
const scene = new Scene({
  r: 0,
  g: 0,
  b: 0,
  a: 1
})
//  Preparar escena
scene.addMesh(axes)
scene.addMesh(grid)
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

//  Generar DatGui
const args = {
  meshes: meshes,
  camarasGui: camarasGui,
  cameras: cameras,
  figures: figures
}
Utils.generateDatGui(args)
