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

    //  Generar la Matriz de proyección ortogonal
    this.updateProjectionMatrix()
  }
  //  Función para que, antes de leer la matriz de proyección,
  //  se actualize con los valores necesarios
  updateProjectionMatrix () {
    const temp = glMatrix.mat4.create()
    this._projectionMatrix = glMatrix.mat4.ortho(temp, this._left, this._right,
      this._bottom, this._top, this._near, this._far)
  }
  get projectionMatrix () {
    this.updateProjectionMatrix()
    return this._projectionMatrix
  }
}

module.exports = OrtographicCamera
