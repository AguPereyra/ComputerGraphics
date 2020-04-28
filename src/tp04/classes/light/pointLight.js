const Light = require('./light')

class PointLight extends Light {
  constructor (position, color) {
    super(color)
    this._px = position.x
    this._py = position.y
    this._pz = position.z
  }
}

module.exports = PointLight
