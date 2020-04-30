const glMatrix = require('gl-matrix')

class Camera {
  constructor () {
    this._identityMatrix = glMatrix.mat4.create()
    this._eyeX = 5.5
    this._eyeY = 5
    this._eyeZ = 5
    this._centerX = 0
    this._centerY = 0
    this._centerZ = 0
    this._upX = 0
    this._upY = 1
    this._upZ = 0
  }
  //  Función de utilidad para actualizar la view matrix
  //  antes de consumirla, para asegurarse que si se
  //  cambió el valor de algunos de los parámetros, la
  //  matriz esté acorde.
  get viewMatrix () {
    const tempIdentity = this._identityMatrix
    return glMatrix.mat4.lookAt(tempIdentity,
      [this._eyeX, this._eyeY, this._eyeZ], //  Posicion del ojo
      [this._centerX, this._centerY, this._centerZ], //  Hacia donde veo
      [this._upX, this._upY, this._upZ]) //  Vector que orienta la camara
  }

  get projectionMatrix () {
    return this._identityMatrix
  }
}

module.exports = Camera
