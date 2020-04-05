const Camera = require('./camera')

class OrtographicCamera extends Camera {
  constructor (left, right, bottom, top, near, far) {
    super()
    this._left = left
    this._right = right
    this._bottom = bottom
    this._top = top
    this._near = near
    this._far = far
  }
}

module.exports = OrtographicCamera
