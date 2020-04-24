const Camera = require('./camera')
const glMatrix = require('gl-matrix')

class PerspectiveCamera extends Camera {
  constructor (fovy, aspect, near, far) {
    super()
    this._fovy = fovy
    this._aspect = aspect
    this._near = near
    this._far = far
  }
  //  Función para que, antes de leer la matriz de proyección,
  //  se actualize con los valores necesarios
  get projectionMatrix () {
    return glMatrix.mat4.perspective(this._identityMatrix, this._fovy,
      this._aspect, this._near, this._far)
  }
}

module.exports = PerspectiveCamera
