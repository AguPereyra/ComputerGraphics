const Light = require('./light')

class AmbientLight extends Light {
  //  Se espera que direction sea un arreglo
  //  con la direccion como [x, y, z]
  constructor (direction, color) {
    super(color)
    this._dirX = direction[0]
    this._dirY = direction[1]
    this._dirZ = direction[2]
  }
}

module.exports = AmbientLight
