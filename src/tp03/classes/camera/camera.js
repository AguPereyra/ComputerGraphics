const glMatrix = require('gl-matrix')

class Camera {
  constructor () {
    this._viewMatrix = glMatrix.mat4.create()
    this._projectionMatrix = glMatrix.mat4.create()
    this._eyeX = 5
    this._eyeY = 5
    this._eyeZ = 5
    this._centerX = 10
    this._centerY = 0
    this._centerZ = 0
    this._upX = 0
    this._upY = 1
    this._upZ = 0

    // Cargar Matrices con valores por defecto
    this.updateViewMatrix()
  }

  //  Función de utilidad para actualizar la view matrix
  //  antes de consumirla, para asegurarse que si se
  //  cambió el valor de algunos de los parámetros, la
  //  matriz esté acorde.
  updateViewMatrix () {
    const tempMatrix = glMatrix.mat4.create()
    this._viewMatrix = glMatrix.mat4.lookAt(tempMatrix,
      [this._eyeX, this._eyeY, this._eyeZ], //  Posicion del ojo
      [this._centerX, this._centerY, this._centerZ], //  Hacia donde veo
      [this._upX, this._upY, this._upZ]) //  Vector que orienta la camara
  }
  get viewMatrix () {
    this.updateViewMatrix()
    return this._viewMatrix
  }

  get projectionMatrix () {
    return this._projectionMatrix
  }
}

module.exports = Camera
