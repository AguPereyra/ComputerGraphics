const Geometry = require('../geometry')
/**
 * Clase que parsea archivos .OBJ a objetos figures/Geometry
 *
 * @class GeometryParser
 */
class GeometryParser {
  static parseFile ({ path = '../models/cube.obj' }) {
    if (path === '') {
      throw Error('Path should not be empty')
    }
    const file = require('../../../../models/cube.obj')
    return this._readFunction(file)
  }

  static _readFunction (data) {
    //  Patron para vertices
    const verticesPattern = /(-?[0-9]+\.[0-9]+)/g
    //  TODO: Aceptar indices negativos
    const indicesPattern = /([0-9]+)/g
    let tempArray
    //  Geometry que contiene la informacion
    let geometry = new Geometry()
    //  Leer archivo por lineas
    const lines = data.split('\n')
    let line = ''
    for (line of lines) {
      switch (line.slice(0, 2)) {
        //  Vertice
        case 'v ':
          tempArray = line.match(verticesPattern)
          //  Convertir a numeros e insertar en geometria
          for (let i = 0; i < tempArray.length; i++) {
            geometry._vertices.push(parseFloat(tempArray[i]))
          }
          tempArray = []
          break
        case 'f ':
          tempArray = line.match(indicesPattern)
          //  Convertir a numeros e insertar en geometria
          for (let i = 0; i < tempArray.length; i++) {
            geometry._faces.push(parseFloat(tempArray[i] - 1))
          }
          tempArray = []
          break
      }
    }
    return geometry
  }
}

module.exports = GeometryParser
