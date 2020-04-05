const glMatrix = require('gl-matrix')

class Camera {
  constructor () {
    this._viewMatrix = null
    this._projectionMatrix = null
    this._eyeX = null
    this._eyeY = null
    this._eyeZ = null
    this._centerX = null
    this._centerY = null
    this._centerZ = null
    this._upX = null
    this._upY = null
    this._upZ = null
  }

  get viewMatrix () {
    return glMatrix.mat4.create()
  }

  get projectionMatrix () {
    return glMatrix.mat4.create()
  }
}

module.exports = Camera
