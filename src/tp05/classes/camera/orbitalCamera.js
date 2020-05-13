const PerspectiveCamera = require('./perspectiveCamera')
const glMatrix = require('gl-matrix')

class OrbitalCamera extends PerspectiveCamera {
  constructor (fovy, aspect, near, far) {
    super(fovy, aspect, near, far)
    this._yaw = 0
    this._pitch = 0
    this._roll = 0
  }
  //  Sobreescribimos el retorno de la matriz de vista
  //  para aplicarle la orbitacion necesaria.
  get viewMatrix () {
    const tempIdentity = this._identityMatrix
    let temp = glMatrix.mat4.lookAt(tempIdentity,
      [this._eyeX, this._eyeY, this._eyeZ], //  Posicion del ojo
      [this._centerX, this._centerY, this._centerZ], //  Hacia donde veo, como vector
      [this._upX, this._upY, this._upZ]) //  Vector que orienta la camara
    //  Orbitar en Y
    temp = glMatrix.mat4.rotate(temp, temp, this._yaw, [temp[1], temp[5], temp[9]])
    //  Orbitar en X
    temp = glMatrix.mat4.rotate(temp, temp, this._pitch, [temp[0], temp[4], temp[8]])
    //  Orbitar en Z
    return glMatrix.mat4.rotate(temp, temp, this._roll, [temp[2], temp[6], temp[10]])
  }
}

module.exports = OrbitalCamera
