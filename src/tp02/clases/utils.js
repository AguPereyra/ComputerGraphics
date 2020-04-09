const Dat = require('dat.gui')
const Geometry = require('./geometry')
const Mesh = require('./mesh')
const RegPol = require('./regularConvexPolygonGeometry')
//  Clase que contiene funciones de utilidad
//  para generar arreglos de un color,
//  inicializar los meshes con poligonos,
//  instanciar un mesh con los ejes pintados,
//  y generar el dat GUI.
class Utils {
  //  Función que genera el arreglo Float32Array
  //  del largo necesario para establecer el color en todos los
  //  vértices de la figura. El color que establece es el pasado
  //  por parámetros.
  //  Se espera que color sea un vector en rgba.
  static generateColorsArray (color, edges) {
    let colors = []
    for (let i = 0; i < edges; i++) {
      colors.push(color[0], color[1], color[2], color[3])
    }
    return new Float32Array(colors)
  }

  //  Función que dibuja los vertices
  //  positivos XY con rojo y verde en
  //  una malla de la escena.
  static defaultVertexes () {
    //  Ejes
    const vertices = new Float32Array([
      0.0, 0.0, 0.0, //  X
      0.0, 0.0, 0.0, //  Y
      1.0, 0.0, 0.0, //  X
      0.0, 1.0, 0.0 //  Y
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
  //  Función que genera el DatGui para el TP2.
  static generateDatGui (meshes) {
    //  DatGUI
    const gui = new Dat.GUI()
    //  Polígonos
    const polGui = []
    for (let i = 0; i < meshes.length; i++) {
      polGui.push(gui.addFolder('Polygon ' + i))
      polGui[i].add(meshes[i], '_tx').min(-5).max(5).step(0.01)
      polGui[i].add(meshes[i], '_ty').min(-5).max(5).step(0.01)
      polGui[i].add(meshes[i], '_tz').min(-5).max(5).step(0.01)
      polGui[i].add(meshes[i], '_rz').min(0).max(360).step(0.1)
      polGui[i].add(meshes[i], '_sx').min(0).step(0.1)
      polGui[i].add(meshes[i], '_sy').min(0).step(0.1)
    }
  }
}

module.exports = Utils
