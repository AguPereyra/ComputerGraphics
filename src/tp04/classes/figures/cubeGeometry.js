const Geometry = require('./geometry')

class CubeGeometry extends Geometry {
  constructor (size) {
    super()
    //  Definir vertices de cubo de lado size
    //  centrado en (0,0,0)
    const points = [-size / 2, size / 2] // Puntos positivo y negativo de los ejes
    //  Generar vertices
    //  Se genera el cubo como:
    //      +--------+
    //     /        /|
    //    /        / |   ^
    // k2+--------+  |   |
    //   |        |  |   | y
    //   |        |  +
    //   |        | /
    //   |        |/
    //   +--------+
    //  k1
    //  plano xz --->
    for (let y of points) {
      for (let z of points) {
        this._vertices.push(z, y, z)
        this._vertices.push(-z, y, z)
      }
    }
    //  Generar indices
    //  Cuerpo
    const k1 = 0
    const k2 = k1 + 4
    for (let i = 0; i < 4; i++) {
      this._faces.push(k1 + i, k1 + (i + 1) % 4, k2 + i)
      this._faces.push(k2 + i, k1 + (i + 1) % 4, k2 + (i + 1) % 4)
    }
    //  Tope y base
    for (let i = 0; i < 2; i++) {
      this._faces.push(k1 + i, k1 + 3, k1 + 1 + i)
      this._faces.push(k2 + i, k2 + 1 + i, k2 + 3)
    }
  }
}

module.exports = CubeGeometry
