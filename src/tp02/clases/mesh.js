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
    //  Matriz 'Model', que aplica traslación en x,y,z;
    //  rotación en z; escalamiento en x e y.
    this._modelMatrix = glMatrix.mat4.create()
    this.updateModelMatrix()
  }
  //  Función que calcula la matriz modelo
  //  aplicandole el escalamiento, la rotación
  //  y la traslación indicadas por las propiedades internas.
  updateModelMatrix () {
    let tempMatrix = glMatrix.mat4.create() //  Crear matriz de identidad
    // Definimos el Quaternion (C, X*S, Y*S, Z*S)
    //  C = COS(θ/2)
    const c = Math.cos(this._rz / 2)
    //  S = SEN(θ/2)
    const s = Math.sin(this._rz / 2)
    this._modelMatrix = glMatrix.mat4.fromRotationTranslationScale(tempMatrix,
      [c, 0, 0, s],
      [this._tx, this._ty, this._tz],
      [this._sx, this._sy, 1])
  }

  //  Getter que se asegura que la
  //  matriz modelo esté actualizada
  get modelMatrix () {
    this.updateModelMatrix()
    return this._modelMatrix
  }

}

module.exports = Mesh
