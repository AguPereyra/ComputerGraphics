console.log('tp04')

const WebGLRend = require('./classes/webglrenderer')
const Scene = require('./classes/scene/scene')
const OrtographicCamera = require('./classes/camera/ortographicCamera')
const Utils = require('./classes/utils/utils')
const Mesh = require('./classes/scene/mesh')
const CubeGeometry = require('./classes/figures/cubeGeometry')
const CylinderGeometry = require('./classes/figures/cylinderGeometry')
const SphereGeometry = require('./classes/figures/sphereGeometry')
const ObserverCamera = require('./classes/utils/observerCamera')
const PerspectiveCamera = require('./classes/camera/perspectiveCamera')
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
      camara: 0
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
    },
    cubeMaterial: {
      // Obsidiana
      ambient: [0.05375, 0.05, 0.06625],
      diffuse: [0.18275, 0.17, 0.22525],
      specular: [0.332741, 0.328634, 0.346435],
      shininess: 33
    },
    cylinderMaterial: {
      // Turquesa
      ambient: [0.1, 0.18725, 0.1745],
      diffuse: [0.396, 0.74151, 0.69102],
      specular: [0.297254, 0.30829, 0.306678],
      shininess: 1
    },
    sphereMaterial: {
      // Cobre
      ambient: [0.19125, 0.0735, 0.0225],
      diffuse: [0.7038, 0.27048, 0.0828],
      specular: [0.256777, 0.137622, 0.086014],
      shininess: 1
    },
    axes: Utils.defaultVertexes(),
    grid: Utils.generateGrid([-10, 10], 0, [-10, 10], [0.5, 0.5, 0.5]),
    clearColor: {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    },
    ambientLight: new AmbientLight([-0.2, -1.0, -0.3], {
      ambient: [0.2, 0.2, 0.2],
      diffuse: [0.5, 0.5, 0.5],
      specular: [1.0, 1.0, 1.0]
    }),
    pointLights: [new PointLight([0, 3, 3], {
      ambient: [0.6, 0.6, 0.6],
      diffuse: [0.5, 0.5, 0.5],
      specular: [1.0, 1.0, 1.0]
    }), new PointLight([0, 3, -3], {
      ambient: [0.6, 0.6, 0.6],
      diffuse: [0.5, 0.5, 0.5],
      specular: [1.0, 1.0, 1.0]
    })],
    spotLight: new SpotLight([0.0, 3.0, 0.0],
      {
        ambient: [0.2, 0.2, 0.2],
        diffuse: [0.5, 0.5, 0.5],
        specular: [1.0, 1.0, 1.0]
      },
      {
        x: 0.0,
        y: -1.0,
        z: 0.0
      },
      {
        innerCutOff: 12.5 * Math.PI / 180,
        outerCutOff: 17.5 * Math.PI / 180
      }
    )
  }
}
// ---------------------------------------
//  Generar Figuras
// -------------------
let meshes = []
const cube = new CubeGeometry(1)
const sphere = new SphereGeometry(1)
const cylinder = new CylinderGeometry(1, [1, 1])
// -------------------
//  Crear Materiales para las figuras
const materials = []
materials.push(new Material(context.default.cubeMaterial))
materials.push(new Material(context.default.sphereMaterial))
materials.push(new Material(context.default.cylinderMaterial))
// -------------------
//  Meter en mallas las figuras
// -------------------
meshes.push(new Mesh(cube, materials[0]))
meshes.push(new Mesh(sphere, materials[1]))
meshes.push(new Mesh(cylinder, materials[2]))
// -------------------
//  Cámaras
// -------------------
let cameras = []
//  Camara Perspectiva con rotacion
cameras[0] = new PerspectiveCamera(context.default.perspectiveGui.fovy, context.default.perspectiveGui.aspect,
  context.default.perspectiveGui.near, context.default.perspectiveGui.far)
//  Ortográfica
cameras[1] = new OrtographicCamera(context.default.orthoGui.left, context.default.orthoGui.right, context.default.orthoGui.bottom,
  context.default.orthoGui.top, context.default.orthoGui.near, context.default.orthoGui.far)
// -------------------
//  Observer, que sirve para poder cambiar desde el dat.GUI
//  los parametros de posicion de ambas camaras con una sola interfaz
// -------------------
context.gui.observerCamera = new ObserverCamera({ orbitalCamera: cameras[0],
  orthoCamera: cameras[1] })
// -------------------
//  Escenas: dos, una para usar luces,
//  y otra sin luces (para grid y ejes).
// -------------------
const scene = new Scene(context.default.clearColor)
const darkScene = new Scene(context.default.clearColor)
//  Preparar escena
for (let i = 0; i < context.default.axes.length; i++) {
  darkScene.addMesh(context.default.axes[i])
}
darkScene.addMesh(context.default.grid)
for (let i = 0; i < meshes.length; i++) {
  scene.addMesh(meshes[i])
}
//  Luces
//  Luz de ambiente
scene._ambientLight = context.default.ambientLight
//  Luces puntales
scene._pointLight = context.default.pointLights
//  Luz focal
scene._spotLight = context.default.spotLight
// -------------------
//  Obtener renderer
// -------------------
const renderer = new WebGLRend(canvas)
// -------------------
//  Dibujar la escena
// -------------------
function main () {
  //  Refrescar pantalla
  window.requestAnimationFrame(main)
  //  Dibujar
  renderer.render(scene, cameras[context.gui.camara.camara])
  //  Base sin luz
  renderer.renderNoLights(darkScene, cameras[context.gui.camara.camara])
}
window.requestAnimationFrame(main)
// -------------------
//  Generar DatGui
// -------------------
const args = {
  meshes: meshes,
  datGui: context.gui,
  cameras: cameras,
  scene: scene
}
Utils.generateDatGui(args)
// -------------------
