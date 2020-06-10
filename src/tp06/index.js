console.log('tp06')

const obj = require('../models/cube-with-triangulated-faces.obj')

console.log(obj)

const WebGLRend = require('./classes/webglrenderer')
const Scene = require('./classes/scene/scene')
const OrtographicCamera = require('./classes/camera/ortographicCamera')
const Utils = require('./classes/utils/utils')
const ObserverCamera = require('./classes/utils/observerCamera')
const ObserverMeshes = require('./classes/utils/observerMeshes')
const PerspectiveCamera = require('./classes/camera/perspectiveCamera')
const AmbientLight = require('./classes/light/ambientLight')
const PointLight = require('./classes/light/pointLight')
const SpotLight = require('./classes/light/spotLight')
const Material = require('./classes/scene/material')
const MeshFactory = require('./classes/utils/meshFactory')
const Mesh = require('./classes/scene/mesh')
const GeometryParser = require('./classes/figures/parsers/geometryParser')

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
  meshFactory: new MeshFactory(),
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
      shininess: 33,
      // Textura
      map: 'brick-wall.jpg'
    },
    cylinderMaterial: {
      // Turquesa
      ambient: [0.1, 0.18725, 0.1745],
      diffuse: [0.396, 0.74151, 0.69102],
      specular: [0.297254, 0.30829, 0.306678],
      shininess: 1,
      //  Textura
      map: 'bubbled-glass.jpg'
    },
    sphereMaterial: {
      // Cobre
      ambient: [0.19125, 0.0735, 0.0225],
      diffuse: [0.7038, 0.27048, 0.0828],
      specular: [0.256777, 0.137622, 0.086014],
      shininess: 1,
      //  Textura
      map: 'earthmap-1024x512.jpg'
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
// -------------------
//  Generar Figuras
// -------------------
let meshes = []
let figure0 = GeometryParser.parseFile({ path: 'monkey_smooth.obj' })
let figure1 = GeometryParser.parseFile({ path: 'monkey_flat.obj' })
let figure2 = GeometryParser.parseFile({ path: 'teapot.obj' })
// -------------------
//  Crear Materiales para las figuras
// -------------------
const materials = []
materials.push(new Material(context.default.cubeMaterial))
materials.push(new Material(context.default.sphereMaterial))
materials.push(new Material(context.default.cylinderMaterial))
// -------------------
//  Meter en mallas las figuras
// -------------------
// Cargar st por defecto
const defaultSt = function (figure) {
  for (let i = 0; i < figure._vertices.length; i++) {
    figure._st.push(0.0, 0.0)
  }
  return figure
}

figure0 = defaultSt(figure0)
figure1 = defaultSt(figure1)
figure2 = defaultSt(figure2)

meshes.push(context.meshFactory.getMesh(figure0, materials[0]))
meshes.push(context.meshFactory.getMesh(figure1, materials[1]))
meshes.push(context.meshFactory.getMesh(figure2, materials[2]))
meshes[0].useTexture = false
meshes[1].useTexture = false
meshes[2].useTexture = false
meshes[0]._tz = 3
meshes[1]._tx = 5
meshes[2]._sx = 0.5
meshes[2]._sy = 0.5
meshes[2]._sz = 0.5
// -------------------
//  Cámaras
// -------------------
let cameras = []
//  Camara Perspectiva
cameras[0] = new PerspectiveCamera(context.default.perspectiveGui.fovy, context.default.perspectiveGui.aspect,
  context.default.perspectiveGui.near, context.default.perspectiveGui.far)
//  Ortográfica
cameras[1] = new OrtographicCamera(context.default.orthoGui.left, context.default.orthoGui.right, context.default.orthoGui.bottom,
  context.default.orthoGui.top, context.default.orthoGui.near, context.default.orthoGui.far)
// -------------------
//  Observer, que sirve para poder cambiar desde el dat.GUI
//  los parametros de posicion de ambas camaras con una sola interfaz
context.gui.observerCamera = new ObserverCamera({ orbitalCamera: cameras[0],
  orthoCamera: cameras[1] })
// -------------------
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
//  Funcion para preparar la escena que contiene solo los ejes de las figuras.
//  (que luego se muestran al hacer click)
// -------------------
const generateAxesScene = function (scene) {
  /*  Dibujar ejes de figuras  */
  /*  Creamos una nueva escena con los ejes para cada mesh  */
  const axesScene = new Scene(context.default.clearColor)
  /*  Generar los tres ejes correspondientes para el mesh */
  const generateAxesMeshes = function (mesh) {
    /*  Generar vertices en funcion del tamaño de la figura */
    const size = mesh._geometry.sizeFromCenter
    const axes = Utils.defaultVertexes(size * 2, size * 2, size * 2) //  Creamos los meshes con los ejes de 0 a size * 2, para que sea visible
    for (let i = 0; i < axes.length; i++) {
      let temp = axes[i]
      temp._tx = mesh._tx
      temp._ty = mesh._ty
      temp._tz = mesh._tz
      temp._rx = mesh._rx
      temp._ry = mesh._ry
      temp._rz = mesh._rz
      temp._sx = mesh._sx
      temp._sy = mesh._sy
      temp._sz = mesh._sz
      axesScene.addMesh(temp)
    }
  }
  /*  Para cada mesh en la escena, crear un los 3 meshes de ejes */
  scene._meshes.forEach(generateAxesMeshes)
  return axesScene
}
const axesScene = generateAxesScene(scene)
// -------------------
//  Dibujar la escena
// -------------------
function main () {
  //  Refrescar pantalla
  window.requestAnimationFrame(main)
  //  Dibujar escena principal
  renderer.render(scene, cameras[context.gui.camara.camara])
  //  Base sin luz
  renderer.renderNoLights(darkScene, cameras[context.gui.camara.camara])
  //  Dibujar ejes de objetos seleccionados
  renderer.renderNoLights(axesScene, cameras[context.gui.camara.camara], { checkFlag: 'drawAxes' })
  //  Test para visualizar pickingScene
  //  renderer.renderNoLights(scene, cameras[context.gui.camara.camara], true, true)
}
window.requestAnimationFrame(main)
// -------------------
//  Preparar los observer que vinculan cada figura con los meshes de sus ejes
// -------------------
context.gui.observerMeshes = []
for (let i = 0; i < meshes.length; i++) {
  //  Por cada mesh habra 3 en axesScene
  context.gui.observerMeshes[i] = new ObserverMeshes([
    meshes[i],
    axesScene._meshes[i * 3],
    axesScene._meshes[i * 3 + 1],
    axesScene._meshes[i * 3 + 2]
  ])
}
// -------------------
//  Funcion para el click
// -------------------
canvas.addEventListener('click', function (evt) {
  const pickingCoord = {
    x: evt.offsetX,
    y: gl.canvas.height - evt.offsetY
  }
  //  Llamar a la funcion de renderizado
  const color = renderer.processPicking(pickingCoord.x, pickingCoord.y, scene,
    cameras[context.gui.camara.camara])
  //  Obtener id segun el color
  const id = Mesh.getId(color)
  //  Revisar si no es el fondo (color negro)
  if (id === 0) {
    console.log('Fondo seleccionado.')
  } else {
    //  TODO: Obtener indice segun el id. Ahora asumimos que id-1 = idx
    //  Cambiar flag en el axesScene de cada eje, a traves del observer
    context.gui.observerMeshes[id - 1].drawAxes = !context.gui.observerMeshes[id - 1].drawAxes
    console.log('Mesh seleccionado: id = ', id)
  }
})
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
