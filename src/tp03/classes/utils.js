const Dat = require('dat.gui')
const Geometry = require('./figures/geometry')
const Mesh = require('./mesh')
const RegPol = require('./figures/regularConvexPolygonGeometry')
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
  //  positivos XY con rojo y verde en
  //  una malla de la escena.
  static defaultVertexes () {
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
  //  Función que dibuja una grilla, con el color
  //  pasado por parámetros, entre los puntos indicados por parámetros.
  //  [x,y,z]Range deben contener los valores mínimos y máximos de cada eje,
  //  y color debe ser un arreglo con los valores de r,g,b,a que se usarán.
  //  Ejemplo de arreglo color:[1.0, 1.0, 0.0, 1.0]
  static generateGrid (xRange, yRange, zRange, color) {
    let vertices = []
    let indexes = []
    for (let x = xRange[0]; x <= xRange[1]; x++) {
      for (let y = yRange[0]; y <= yRange[1]; y++) {
        for (let z = zRange[0]; z <= zRange[1]; z++) {
          vertices.push(x, y, z)
        }
      }
    }
    //  Generar índices correspondientes,
    //  uniendo los puntos de a cuatro.
    //  Se que (N-4)/2 + 1 da la
    //  cantidad cuadrados que se tienen
    const squares = (vertices.length - 4) / 2 + 1
    for (let pivot = 0; pivot < squares; pivot++) {
      //  Definir los triangulos internos
      indexes.push(pivot, pivot + 1, pivot + 3)
      indexes.push(pivot, pivot + 4, pivot + 3)
    }
    //  Generar colores
    const colors = this.generateColorsArray(color, vertices.length)
    //  Generar mesh
    const geometry = new Geometry()
    geometry._faces = indexes
    geometry._vertices = vertices
    const mesh = new Mesh(geometry, colors)
    return mesh
  }

  //  Función que genera el Dat Gui con los parámetros necesarios
  //  para el TP3
  static generateDatGui (args) {
    const meshes = args.meshes
    const camarasGui = args.camarasGui
    const cameras = args.cameras
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
      polGui[i].add(meshes[i], '_rx').min(0).max(360).step(0.1)
      polGui[i].add(meshes[i], '_ry').min(0).max(360).step(0.1)
      polGui[i].add(meshes[i], '_rz').min(0).max(360).step(0.1)
      polGui[i].add(meshes[i], '_sx').min(0).step(0.1)
      polGui[i].add(meshes[i], '_sy').min(0).step(0.1)
      polGui[i].add(meshes[i], '_sz').min(0).step(0.1)
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
  }
}

module.exports = Utils
