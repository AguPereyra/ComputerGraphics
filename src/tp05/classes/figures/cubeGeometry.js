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
    //  Caras en -x/+x
    for (let x of points) {
      for (let z of points) {
        this._vertices.push(x, z, z)
        this._vertices.push(x, -z, z)
      }
    }
    //  Caras en -z/+z
    for (let x of points) {
      for (let z of points) {
        this._vertices.push(x, x, z)
        this._vertices.push(-x, x, z)
      }
    }
    //  Caras en -y/+y
    for (let y of points) {
      for (let z of points) {
        this._vertices.push(z, y, z)
        this._vertices.push(-z, y, z)
      }
    }
    //  Generar indices
    //  Cuerpo, tope y base.
    //  Atencion, si se usase para calcular normales, el tope estaria al reves.
    let k1 = 0
    let k2 = k1 + 3
    for (; k1 <= 20; k1 += 4, k2 += 4) {
      this._faces.push(k1, k1 + 1, k2)
      this._faces.push(k2, k1 + 1, k2 - 1)
    }

    //  Normales
    this.normals = this._vertices
  }
}

module.exports = CubeGeometry
