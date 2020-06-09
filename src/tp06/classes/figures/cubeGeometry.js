const Geometry = require('./geometry')
/**
 * Clase que calcula vertices, normales y st (coordenadas de texturas) del cubo
 * en funcion del parametro size pasado al constructor.
 * @class CubeGeometry
 * @extends {Geometry}
 */
class CubeGeometry extends Geometry {
  constructor (size) {
    super()
    this._size = size
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
    for (let z of points) {
      for (let x of points) {
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
    //  ST
    for (let i = 0; i < 6; i++) {
      this._st.push(0, 0)
      this._st.push(1, 0)
      this._st.push(1, 1)
      this._st.push(0, 1)
    }

    //  Normales
    this.normals = this._vertices
  }

  /**
   * Funcion para obtener el largo de la figura del centro hasta uno de sus extremos.
   * En el caso de la esfera retorna el size / 2.
   */
  get sizeFromCenter () {
    return this._size / 2
  }
}

module.exports = CubeGeometry
