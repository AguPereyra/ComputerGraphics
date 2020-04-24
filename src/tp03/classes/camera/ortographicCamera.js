const Camera = require('./camera')
const glMatrix = require('gl-matrix')

class OrtographicCamera extends Camera {
  constructor (left, right, bottom, top, near, far) {
    super()
    this._left = left
    this._right = right
    this._bottom = bottom
    this._top = top
    this._near = near
    this._far = far
  }
  //  Función para que, antes de leer la matriz de proyección,
  //  se actualize con los valores necesarios
  get projectionMatrix () {
    return glMatrix.mat4.ortho(this._identityMatrix, this._left, this._right,
      this._bottom, this._top, this._near, this._far)
  }
}

module.exports = OrtographicCamera
