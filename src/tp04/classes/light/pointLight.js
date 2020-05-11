const Light = require('./light')

class PointLight extends Light {
  constructor (position, color) {
    super(color)
    this._px = position[0]
    this._py = position[1]
    this._pz = position[2]
    //  Valores por defecto
    this._constant = 1.0
    this._linear = 0.09
    this._quadratic = 0.032
  }
}

module.exports = PointLight
