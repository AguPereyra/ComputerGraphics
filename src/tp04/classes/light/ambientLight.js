const Light = require('./light')

class AmbientLight extends Light {
  //  Se espera que direction sea un arreglo
  //  con la direccion como [x, y, z]
  constructor (direction, color) {
    super(color)
    this.direction = direction
  }
}

module.exports = AmbientLight
