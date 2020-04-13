const RegPol = require('./regularConvexPolygonGeometry')

class ConeGeometry extends RegPol {
  constructor (height, radius = 1) {
    //  Generar polígono de base
    super(16)
    //  Agregar punta del cono a la figura
    this._vertices.push(0, 0, height) //  Agregar punta del cono
    for (let i = 0; i < 15; i++) {
      this._faces.push(16, i, i + 1)
    }
  }
}

module.exports = ConeGeometry
