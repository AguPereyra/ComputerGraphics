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
const AmbientLight = require('./classes/light/ambientLight')
const PointLight = require('./classes/light/pointLight')
const SpotLight = require('./classes/light/spotLight')
const Material = require('./classes/scene/material')

// Obtener canvas sobre el que dibujar
const canvas = document.getElementById('c')
const gl = canvas.getContext('webgl')
// ---------------------------------------
//  Datos de contexto para la aplicacion.
const context = {
  gui: {
    camara: {
      camara: 1
    },
    figures: ['Cube', 'Sphere', 'Cylinder', 'Cone']
  },
  default: {
    orthoGui: {
      left: -10,
      right: 10,
      far: 1000,
      near: 0.001,
      bottom: -10,
      top: 10
    },
    perspectiveGui: {
      fovy: Math.PI / 4,
      aspect: gl.canvas.width / gl.canvas.height,
      near: 0.001,
      far: 1000
    }
  }
}
// ---------------------------------------

let meshes = []
//  Generar Cono, Cubo, Cilindro y Esfera
const cube = new CubeGeometry(1)
const sphere = new SphereGeometry(1)
const cylinder = new CylinderGeometry(1, [1, 1])
const cone = new CylinderGeometry(1, [1, 0])

//  Crear propiedades de las figuras
const cubeMaterial = {
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
cameras[0] = new PerspectiveCamera(context.default.perspectiveGui.fovy, context.default.perspectiveGui.aspect,
  context.default.perspectiveGui.near, context.default.perspectiveGui.far)
//  Ortográfica
cameras[1] = new OrtographicCamera(context.default.orthoGui.left, context.default.orthoGui.right, context.default.orthoGui.bottom,
  context.default.orthoGui.top, context.default.orthoGui.near, context.default.orthoGui.far)
//  Camara rotacional
cameras[2] = new OrbitalCamera(context.default.perspectiveGui.fovy, context.default.perspectiveGui.aspect,
  context.default.perspectiveGui.near, context.default.perspectiveGui.far)

//  Observer, que sirve para poder cambiar desde el dat.GUI
//  los parametros de posicion de ambas camaras con una sola interfaz
context.gui.observerCamera = new ObserverCamera({ perspectiveCamera: cameras[0],
  orthoCamera: cameras[1],
  orbitalCamera: cameras[2] })

//  Crear cuadro con figuras a dibujar
//  Ejes
const axes = Utils.defaultVertexes()
//  Grilla
const grid = Utils.generateGrid([-10, 10], 0, [-10, 10], [0.5, 0.5, 0.5])
//  Escena
const scene = new Scene({
  r: 0,
  g: 0,
  b: 0,
  a: 1
})
//  Preparar escena
for (let i = 0; i < axes.length; i++) {
  scene.addMesh(axes[i])
}
scene.addMesh(grid)
for (let i = 0; i < meshes.length; i++) {
  scene.addMesh(meshes[i])
}

//  Setear luces
//  Luz de ambiente
scene._ambientLight = new AmbientLight([-0.2, -1.0, -0.3], {
  ambient: [0.2, 0.2, 0.2],
  diffuse: [0.5, 0.5, 0.5],
  specular: [1.0, 1.0, 1.0]
})
//  Luz puntal
scene._pointLight = [new PointLight({ x: 0, y: 3, z: 3 }, {
  ambient: [0.6, 0.6, 0.6],
  diffuse: [0.5, 0.5, 0.5],
  specular: [1.0, 1.0, 1.0]
}), new PointLight({ x: 0, y: 3, z: -3 }, {
  ambient: [0.6, 0.6, 0.6],
  diffuse: [0.5, 0.5, 0.5],
  specular: [1.0, 1.0, 1.0]
})]
//  Luz focal
scene._spotLight = new SpotLight({ x: 0.0, y: 5.0, z: 0.0 }, {
  ambient: [0.2, 0.2, 0.2],
  diffuse: [0.5, 0.5, 0.5],
  specular: [1.0, 1.0, 1.0] }, { x: 0.0, y: -1.0, z: 0.0 }, { innerCutOff: 12.5 * Math.PI / 180, outerCutOff: 17.5 * Math.PI / 180 })

//  Obtener renderer
const renderer = new WebGLRend(canvas)

//  Redibujar la escena
function main () {
  //  Refrescar pantalla
  window.requestAnimationFrame(main)
  //  Dibujar
  renderer.render(scene, cameras[context.gui.camara.camara])
}
window.requestAnimationFrame(main)

//  Generar DatGui
const args = {
  meshes: meshes,
  datGui: context.gui,
  cameras: cameras
}
Utils.generateDatGui(args)
