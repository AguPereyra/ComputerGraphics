const Dat = require('dat.gui')
const Geometry = require('../figures/geometry')
const Mesh = require('../scene/mesh')
const RegPol = require('../figures/regularConvexPolygonGeometry')
//  Clase que contiene funciones de utilidad
//  para generar arreglos de un color,
//  inicializar los meshes con poligonos,
//  instanciar un mesh con los ejes pintados,
//  y generar el dat GUI, entre otras.
class Utils {
  //  Función que genera el arreglo
  //  del largo necesario para establecer el color en todos los
  //  vértices de la figura. El color que establece es el pasado
  //  por parámetros.
  //  Se espera que color sea un vector en rgba.
  //  edges es el arreglo que contiene en cada índice la cantidad de
  //  vértices de cada figura. Osea 1 índice -> 1 figura.
  static generateColorsArray (color, edges) {
    let colors = []
    for (let i = 0; i < edges; i++) {
      colors.push(color[0], color[1], color[2], color[3])
    }
    return colors
  }
  //  Función que genera tantos meshes como se le
  //  indique en el arreglo 'edges', conteniendo
  //  cada uno un poligono de 'edges[i]' lados
  //  y 'colors[i]' como color para el poligono.
  static generatePolMeshes (edges, colors) {
    //  Polígonos en las mallas a renderizar
    let meshes = []
    //  Generar polígonos e insertar en los meshes
    for (let i = 0; i < edges.length; i++) {
      let pol = new RegPol(edges[i])
      let polColor = this.generateColorsArray(colors[i], edges[i])
      meshes[i] = new Mesh(pol, polColor)
    }
    return meshes
  }
  //  Función que dibuja los vertices
  //  positivos XYZ con rojo, verde y azul en
  //  3 mallas de la escena.
  static defaultVertexes () {
    //  Ejes
    const vertices = [
      0.0, 0.0, 0.0, // Línea roja (X)
      10.0, 0.0, 0.0, // Línea roja (X)
      0.0, 0.0, 0.0, // Línea verde (Y)
      0.0, 10.0, 0.0, // Línea verde (Y)
      0.0, 0.0, 0.0, // Línea azul (Z)
      0.0, 0.0, 10.0 // Línea azul (Z)
    ]
    const colors = [1.0, 0.0, 0.0,
      0.0, 0.1, 0.0,
      0.0, 0.0, 1.0]
    //  Crear Meshes
    const meshes = []
    for (let i = 0; i < 9; i += 3) {
      const geometry = new Geometry()
      geometry._vertices.push(vertices[2 * i], vertices[2 * i + 1], vertices[2 * i + 2])
      geometry._vertices.push(vertices[2 * i + 3], vertices[2 * i + 4], vertices[2 * i + 5])
      geometry._faces = [0, 1]
      geometry._normals = [vertices[2 * i + 3] / 10, vertices[2 * i + 4] / 10, vertices[2 * i + 5] / 10,
        vertices[2 * i + 3] / 10, vertices[2 * i + 4] / 10, vertices[2 * i + 5] / 10]
      const material = {
        diffuse: [colors[i], colors[i + 1], colors[i + 2]],
        specular: [1.0, 1.0, 1.0],
        shininess: 1.0
      }
      meshes.push(new Mesh(geometry, material))
      meshes[i / 3]._drawAsTriangle = false // Dibujar meshes con LINES y no con TRIANGLES
    }
    return meshes
  }
  //  Función que dibuja una grilla, con el color
  //  pasado por parámetros, entre los puntos indicados por parámetros, en
  //  el plano paralelo a XZ.
  //  [x,z]Range deben contener los valores mínimos (en índice 0) y máximos (en índice 1)
  //  de cada eje, yPos contiene la posición en Y del plano,
  //  y color debe ser un arreglo con los valores de r,g,b,a que se usarán.
  //  Ejemplo de arreglo color:[1.0, 1.0, 0.0, 1.0]
  static generateGrid (xRange, yPos, zRange, color) {
    let vertices = []
    let indexes = []
    let posZ = 0
    for (let x = xRange[0]; x <= xRange[1]; x++) {
      indexes.push(posZ) // Punto menor a unir para este x
      for (let z = zRange[0]; z <= zRange[1]; z++) {
        vertices.push(x, yPos, z)
        posZ++ //  Nos desplazamos en los indices
      }
      indexes.push(posZ - 1) // Punto mayor a unir para este x
    }
    //  Indices para los ejes X
    const zNorm = Math.abs(zRange[0]) + Math.abs(zRange[1])
    let posXMin = 0
    let posXMax = vertices.length / 3 - zNorm - 1
    for (let z = zRange[0]; z <= zRange[1]; z++) {
      indexes.push(posXMin, posXMax)
      posXMin++ //  Nos movemos al proximo punto
      posXMax++ //  Vamos al anterior
    }
    //  Generar colores
    const colors = {
      diffuse: color,
      specular: [1.0, 1.0, 1.0],
      shininess: 32
    }
    //  Generar mesh
    const geometry = new Geometry()
    geometry._faces = indexes
    geometry._vertices = vertices
    const mesh = new Mesh(geometry, colors)
    //  Indicar que se dibuje con lineas
    mesh._drawAsTriangle = false
    return mesh
  }

  //  Función que genera el Dat Gui con los parámetros necesarios
  //  para el TP3
  static generateDatGui (args) {
    const meshes = args.meshes
    const camarasGui = args.camarasGui
    const cameras = args.cameras
    const figures = args.figures
    const observerCamera = args.observerCamera
    //  DatGUI
    const guiFigures = new Dat.GUI()
    const guiCamera = new Dat.GUI()
    //  Figuras
    const figuresFolder = guiFigures.addFolder('Figures')
    let figuresGui = []
    for (let i = 0; i < meshes.length; i++) {
      figuresGui.push(figuresFolder.addFolder(figures[i]))
      figuresGui[i].add(meshes[i], '_tx').min(-20).max(20).step(0.01)
      figuresGui[i].add(meshes[i], '_ty').min(-20).max(20).step(0.01)
      figuresGui[i].add(meshes[i], '_tz').min(-20).max(20).step(0.01)
      figuresGui[i].add(meshes[i], '_rx').min(0).max(360).step(0.1)
      figuresGui[i].add(meshes[i], '_ry').min(0).max(360).step(0.1)
      figuresGui[i].add(meshes[i], '_rz').min(0).max(360).step(0.1)
      figuresGui[i].add(meshes[i], '_sx').min(0).step(0.1)
      figuresGui[i].add(meshes[i], '_sy').min(0).step(0.1)
      figuresGui[i].add(meshes[i], '_sz').min(0).step(0.1)
    }
    //  Cámaras
    const camaraFolder = guiCamera.addFolder('Camera')
    camaraFolder.add(camarasGui, 'camara', { Perspective: 0, Orthographic: 1, Orbital: 2 })
    //  Posición de la cámara
    const cameraPosFolder = camaraFolder.addFolder('Position')
    //  Posición del ojo
    cameraPosFolder.add(observerCamera, 'eyeX').min(-10).max(10).step(0.1)
    cameraPosFolder.add(observerCamera, 'eyeY').min(-10).max(10).step(0.1)
    cameraPosFolder.add(observerCamera, 'eyeZ').min(-10).max(10).step(0.1)
    //  Hacia donde se mira
    cameraPosFolder.add(observerCamera, 'centerX').min(-10).max(10).step(0.1)
    cameraPosFolder.add(observerCamera, 'centerY').min(-10).max(10).step(0.1)
    cameraPosFolder.add(observerCamera, 'centerZ').min(-10).max(10).step(0.1)
    //  Orientación de la camara
    cameraPosFolder.add(observerCamera, 'upX').min(-10).max(10).step(0.1)
    cameraPosFolder.add(observerCamera, 'upY').min(-10).max(10).step(0.1)
    cameraPosFolder.add(observerCamera, 'upZ').min(-10).max(10).step(0.1)

    //  Cámara de Proyección Ortográfica
    const orthoFolder = camaraFolder.addFolder('Orthographic Camera')
    orthoFolder.add(cameras[1], '_left').min(-1000).max(0).step(0.01)
    orthoFolder.add(cameras[1], '_right').min(0).max(1000).step(0.01)
    orthoFolder.add(cameras[1], '_bottom').min(-1000).max(0).step(0.01)
    orthoFolder.add(cameras[1], '_top').min(0).max(1000).step(0.01)
    orthoFolder.add(cameras[1], '_near').min(0).max(100).step(0.001)
    orthoFolder.add(cameras[1], '_far').min(0).max(1000).step(0.01)

    //  Cámara de Proyección en Perspectiva
    const perspectiveFolder = camaraFolder.addFolder('Perspective Camera')
    perspectiveFolder.add(cameras[0], '_fovy').min(0).max(2 * Math.PI).step(0.01)
    perspectiveFolder.add(cameras[0], '_aspect')
    perspectiveFolder.add(cameras[0], '_near').min(0).max(100).step(0.001)
    perspectiveFolder.add(cameras[0], '_far').min(0).max(1000).step(0.01)

    //  Cámara de rotación
    const rotationFolder = camaraFolder.addFolder('Rotation Camera')
    rotationFolder.add(cameras[2], '_yaw').min(0).max(2 * Math.PI).step(0.01)
    rotationFolder.add(cameras[2], '_pitch').min(0).max(2 * Math.PI).step(0.01)
    rotationFolder.add(cameras[2], '_roll').min(0).max(2 * Math.PI).step(0.01)
  }
}

module.exports = Utils
