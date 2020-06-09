const Geometry = require('../geometry')
/**
 * Clase que parsea archivos .OBJ a objetos figures/Geometry
 *
 * @class GeometryParser
 */
class GeometryParser {
  static parseFile ({ path = 'cube.obj' }) {
    if (path === '') {
      throw Error('Path should not be empty')
    }
    const file = require('../../../../models/' + path)
    return this._readFunction(file)
  }

  static _readFunction (data) {
    //  Patron para vértices y normales
    const verticesPattern = /(-?[0-9]+\.[0-9]+)/g
    //  TODO: Aceptar índices negativos
    //  TODO: Revisar la exigencia de que haya un punto
    const indicesPattern = /([0-9]+)/g
    /*  Explicación de patrón: Se busca un valor entre +-[0, 1]. Por ende será
    *   /(-?0\.[0-9]*)/g   Patrón para valor entre +-[0.0, 0.999...]
    *   |                  o
    *   /(-?1\.0*)/g       Patrón para valor de +-1.000....
    */
    const textCoordsPattern = /(-?0\.[0-9]*)|(-?1\.0*)/g
    let tempArray
    //  Geometry que contiene la informacion
    let geometry = new Geometry()
    //  Leer archivo por lineas
    const lines = data.split('\n')
    let line = ''
    for (line of lines) {
      switch (line.slice(0, 2)) {
        //  Vértices
        case 'v ':
          tempArray = line.match(verticesPattern)
          //  Convertir a numeros e insertar en geometría
          for (let i = 0; i < tempArray.length; i++) {
            geometry._vertices.push(parseFloat(tempArray[i]))
          }
          tempArray = []
          break
        //  Caras
        case 'f ':
          tempArray = line.match(indicesPattern)
          //  Convertir a numeros e insertar en geometría
          for (let i = 0; i < tempArray.length; i++) {
            geometry._faces.push(parseFloat(tempArray[i] - 1))
          }
          tempArray = []
          break
        //  Coordenadas de texturas
        case 'vt':
          tempArray = line.match(textCoordsPattern)
          //  Convertir a numeros e insertar en geometría
          for (let i = 0; i < tempArray.length; i++) {
            geometry._st.push(parseFloat(tempArray[i]))
          }
          tempArray = []
          break
        //  Normales
        case 'vn':
          tempArray = line.match(verticesPattern)
          //  Convertir a numeros e insertar en geometría
          for (let i = 0; i < tempArray.length; i++) {
            geometry._normals.push(parseFloat(tempArray[i]))
          }
          tempArray = []
          break
        //  Nombre de la figura
        case 'o ':
          geometry.name = line.slice(2).trim()
          break
      }
    }
    return geometry
  }
}

module.exports = GeometryParser
