const PointLight = require('./pointLight')

class SpotLight extends PointLight {
  constructor (position, color, spotDirection, angles) {
    super(position, color)
    this._sdX = spotDirection.x
    this._sdY = spotDirection.y
    this._sdZ = spotDirection.z
    //  Guardamos directamente los cosenos para ahorrar calculo
    //  en los shaders (ahorrar el arco-cos)
    this._innerCutOff = Math.cos(angles.innerCutOff)
    this._outerCutOff = Math.cos(angles.outerCutOff)
  }
}

module.exports = SpotLight
