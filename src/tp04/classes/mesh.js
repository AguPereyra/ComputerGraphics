const glMatrix = require('gl-matrix')

class Mesh {
  constructor (geometry, material) {
    this._geometry = geometry
    this._material = material
    this._tx = 0
    this._ty = 0
    this._tz = 0
    this._rx = 0
    this._ry = 0
    this._rz = 0
    this._sx = 1.0
    this._sy = 1.0
    this._sz = 1.0
    this._drawAsTriangle = true
    //  Guardar la matriz identidad para mejorar la performance
    this._identityMatrix = glMatrix.mat4.create()
  }
  //  Función que calcula la matriz modelo
  //  aplicandole el escalamiento, la rotación
  //  y la traslación indicadas por las propiedades internas.
  //  Luego retorna el resultado del calculo.
  get modelMatrix () {
    // Definimos el Quaternion
    let quaternion = glMatrix.quat.create()
    quaternion = glMatrix.quat.fromEuler(quaternion, this._rx, this._ry, this._rz)
    return glMatrix.mat4.fromRotationTranslationScale(this._identityMatrix,
      quaternion,
      [this._tx, this._ty, this._tz],
      [this._sx, this._sy, this._sz])
  }
}

module.exports = Mesh
