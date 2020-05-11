const glMatrix = require('gl-matrix')

class Geometry {
  constructor () {
    this._vertices = []
    this._faces = []
  }

  // Funcion que calcula las normales si no se ha hecho
  // ya, en funcion de los vertices y caras. Sino solo
  // devuelve las normales existentes.
  //  Retorno: Normales YA NORMALIZADAS.
  get normals () {
    //  Solo si no se calcularon ya
    if (this._normals) {
      return this._normals
    }
    //  Calcular normales
    this._normals = []
    for (let i = 0; i < this._vertices.length / 3; i++) {
      this._normals.push(0.0, 0.0, 0.0)
    }
    for (let i = 0; i < this._faces.length; i += 3) {
      //  Multiplico por 3 para considerar que en
      //  this._vertices voy de a 3 valores (x, y, z)
      const ia = this._faces[i] * 3
      const ib = this._faces[i + 1] * 3
      const ic = this._faces[i + 2] * 3

      const e1 = glMatrix.vec3.subtract([],
        this._vertices.slice(ia, ia + 3),
        this._vertices.slice(ib, ib + 3))
      const e2 = glMatrix.vec3.subtract([],
        this._vertices.slice(ic, ic + 3),
        this._vertices.slice(ib, ib + 3))
      const crossProd = glMatrix.vec3.cross([], e1, e2)

      this._normals[ia] += crossProd[0]
      this._normals[ia + 1] += crossProd[1]
      this._normals[ia + 2] += crossProd[2]
      this._normals[ib] += crossProd[0]
      this._normals[ib + 1] += crossProd[1]
      this._normals[ib + 2] += crossProd[2]
      this._normals[ic] += crossProd[0]
      this._normals[ic + 1] += crossProd[1]
      this._normals[ic + 2] += crossProd[2]
    }

    return this._normals
  }

  set normals (norm) {
    this._normals = norm
  }
}

module.exports = Geometry
