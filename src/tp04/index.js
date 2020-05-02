console.log('tp04')
console.log('NO OLVIDES LUZ DE AMBIENTE')

const WebGLRend = require('./classes/webglrenderer')
const Scene = require('./classes/scene/scene')
const PerspectiveCamera = require('./classes/camera/perspectiveCamera')
const OrtographicCamera = require('./classes/camera/ortographicCamera')
const Utils = require('./classes/utils/utils')
const Mesh = require('./classes/scene/mesh')
const CubeGeometry = require('./classes/figures/cubeGeometry')
const CylinderGeometry = require('./classes/figures/cylinderGeometry')
const SphereGeometry = require('./classes/figures/sphereGeometry')
const ObserverCamera = require('./classes/utils/observerCamera')
const OrbitalCamera = require('./classes/camera/orbitalCamera')
const Light = require('./classes/light/light')
const PointLight = require('./classes/light/pointLight')
const Material = require('./classes/scene/material')

// Obtener canvas sobre el que dibujar
const canvas = document.getElementById('c')

// --------------------------------
// Variables para DAT GUI
//  camarasGui representa la camara en uso.
let camarasGui = {
  camara: 1,
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
] //  Arreglo que tendrá el color de cada figura

let meshes = []
//  Generar Cono, Cubo, Cilindro y Esfera
const cube = new CubeGeometry(1)
const sphere = new SphereGeometry(1)
const cylinder = new CylinderGeometry(1, [1, 1])
const cone = new CylinderGeometry(1, [1, 0])

//  Colores
const cubeColor = Utils.generateColorsArray(colors[0], cube._vertices.length)
const sphereColor = Utils.generateColorsArray(colors[3], sphere._vertices.length)
const cylinderColor = Utils.generateColorsArray(colors[2], cylinder._vertices.length)
const coneColor = Utils.generateColorsArray(colors[1], cone._vertices.length)

//  Crear propiedades de las figuras
const cubeMaterial = {
  surface: cubeColor,
  ambient: [1.0, 0.5, 0.31],
  diffuse: [1.0, 0.5, 0.31],
  specular: [0.5, 0.5, 0.5],
  shininess: 32.0
}
//  Crear Materiales para las figuras
const materials = []
materials.push(new Material(cubeMaterial))

//  Meter en malla
meshes.push(new Mesh(cube, materials[0]))
// meshes.push(new Mesh(sphere, sphereColor))
// meshes.push(new Mesh(cylinder, cylinderColor))
// meshes.push(new Mesh(cone, coneColor))


//  Cámaras
let cameras = []
//  Perspectiva
cameras[0] = new PerspectiveCamera(perspectiveGui.fovy, perspectiveGui.aspect,
  perspectiveGui.near, perspectiveGui.far)
//  Ortográfica
cameras[1] = new OrtographicCamera(orthoGui.left, orthoGui.right, orthoGui.bottom,
  orthoGui.top, orthoGui.near, orthoGui.far)
//  Camara rotacional
cameras[2] = new OrbitalCamera(perspectiveGui.fovy, perspectiveGui.aspect,
  perspectiveGui.near, perspectiveGui.far)

//  Observer, que sirve para poder cambiar desde el dat.GUI
//  los parametros de posicion de ambas camaras con una sola interfaz
const observerCamera = new ObserverCamera({ perspectiveCamera: cameras[0],
  orthoCamera: cameras[1],
  orbitalCamera: cameras[2] })

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

//  Setear luces
//  Luz de ambiente
scene._ambientLight = new Light({
  ambient: [1.0, 1.0, 1.0],
  diffuse: [0.5, 0.5, 0.5],
  specular: [1.0, 1.0, 1.0]
})

scene._pointLight = new PointLight({ x: 0, y: 3, z: 3 }, {
  ambient: [0.6, 0.6, 0.6],
  diffuse: [0.5, 0.5, 0.5],
  specular: [1.0, 1.0, 1.0]
})
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
  figures: figures,
  observerCamera: observerCamera
}
Utils.generateDatGui(args)
