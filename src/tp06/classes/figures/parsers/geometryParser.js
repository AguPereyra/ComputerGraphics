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
    //  Patrón para vértices y normales
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
    //  Patrón para flat shading
    const flatShadingPattern = /\s+off\s*$/g
    //  Variable para almacenar arreglos
    let tempArray
    //  Geometry que contiene la información
    let geometry = new Geometry()
    //  Variable que indica si paras a flatshading
    let flatShading = false
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
        //  Ver si smooth shading está deshabilitado
        case 's ':
          flatShading = line.match(flatShadingPattern) !== null
          break
      }
    }

    //  Si se requirere flatshading, repetimos la información de
    //  vértices y normales
    if (flatShading) {
      const flatedPoints = this._toFlatShading({
        _vertices: geometry._vertices,
        _faces: geometry._faces
      })
      geometry._faces = flatedPoints.faces
      geometry._vertices = flatedPoints.vertices
    }
    return geometry
  }

  //  Funcion para aumentar la informacion y asi hacer flat shading
  //  TODO: Acomodar ST
  static _toFlatShading ({ _vertices = [], _faces = [] }) {
    const checkV = typeof _vertices !== 'undefined' && _vertices.length > 0
    const checkF = typeof _faces !== 'undefined' && _faces.length > 0
    if (!checkF || !checkV) {
      throw Error('Lacking parameters of function. Make sure vertices, normals and faces are not empty arrays.')
    }

    let faces = [..._faces]
    //  TODO: Multiplicacion variable de vertices
    const redundantVertices = _vertices.concat(_vertices, _vertices)

    /* Acomodar índices de acuerdo a las nuevas posiciones */
    //  Variable que lleva el conteo de cuántas veces apareció
    //  el vértice en faces, para acomodar la referencia acorde.
    //  El índice se usa como referencia del vértice, y el valor
    //  indica la cantidad de veces que apareció ese vértice en faces.
    let countUsed = []
    for (let i = 0; i < _vertices.length; i++) {
      countUsed[i] = 0
    }
    //  Acomodar índices
    for (let i = 0; i < faces.length; i++) {
      faces[i] = faces[i] + (_vertices.length / 3) * countUsed[faces[i]]
      countUsed[faces[i]] += 1
    }
    return {
      faces: faces,
      vertices: redundantVertices
    }
  }
}

module.exports = GeometryParser
