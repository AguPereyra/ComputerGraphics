const PerspectiveCamera = require('./perspectiveCamera')
const glMatrix = require('gl-matrix')

class RotationalCamera extends PerspectiveCamera {
  constructor (fovy, aspect, near, far) {
    super(fovy, aspect, near, far)
    this._yaw = 0
    this._pitch = 0
    this._roll = 0
  }
  //  Sobreescribimos el retorno de la matriz de vista
  //  para aplicarle la rotacion necesaria.
  get viewMatrix () {
    //  Direccion hacia donde mira la carama
    //  Obtenemos vector de direccion rotado
    this._dirX = Math.cos(this._yaw) * Math.cos(this._pitch)
    this._dirY = Math.sin(this._pitch)
    this._dirZ = Math.sin(this._yaw) * Math.cos(this._pitch)
    //  Frente de la camara
    this._cameraFront = []
    this._cameraFront = glMatrix.vec3.normalize(this._cameraFront, [this._dirX, this._dirY, this._dirZ])
    //  Roll
    this._upX = Math.cos(this._roll)
    this._upY = Math.sin(this._roll)
    const tempIdentity = Object.assign([], this._identityMatrix)
    return glMatrix.mat4.lookAt(tempIdentity,
      [this._eyeX, this._eyeY, this._eyeZ], //  Posicion del ojo
      [this._eyeX + this._dirX, this._eyeY + this._dirY, this._eyeZ + this._dirZ], //  Hacia donde veo, como vector
      [this._upX, this._upY, this._upZ]) //  Vector que orienta la camara
  }
}

module.exports = RotationalCamera
