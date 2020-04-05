const Camera = require('./camera')

class PerspectiveCamera extends Camera {
  constructor (fovy, aspect, near, far) {
    super()
    this._fovy = fovy
    this._aspect = aspect
    this._near = near
    this._far = far
  }
}

module.exports = PerspectiveCamera
