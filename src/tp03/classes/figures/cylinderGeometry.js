const Geometry = require('./geometry')
const RegPol = require('./regularConvexPolygonGeometry')

class CylinderGeometry extends Geometry {
  constructor (height, radius = 1) {
    super()
    this._sideA = new RegPol(16)
    this._sideB = new RegPol(16, height) //  A FUTURO: Potencial problema con las normales
    //  Generar los vertices copiando los lados
    let vertices = []
    let indexes = []
    for (let i = 0; i < this._sideA._vertices.length; i++) {
      vertices.push(this._sideA._vertices[i])
    }
    for (let i = 0; i < this._sideB._vertices.length; i++) {
      vertices.push(this._sideB._vertices[i])
    }
    //  Unir con un punto todo el resto
    for (let i = 0; i <= 14; i++) {
      //  Evitar unir con el punto contrario
      if (i !== 0) {
        indexes.push(16 / 2 + 16, i, i + 1)
      }
    }
    //  Unir el punto contrario
    for (let i = 16; i <= 30; i++) {
      //  Evitar unir con el punto contrario
      if (i !== 16 / 2 + 16) {
        indexes.push(0, i, i + 1)
      }
    }
    //  Meter índices de extremos
    for (let i = 0; i < this._sideA._faces.length; i++) {
      indexes.push(this._sideA._faces[i])
    }
    for (let i = 0; i < this._sideB._faces.length; i++) {
      indexes.push(this._sideA._faces[i] + 16)
    }

    this._faces = indexes
    this._vertices = vertices
  }
}

module.exports = CylinderGeometry
