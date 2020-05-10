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

  // Metodos para poder editar los inner y outer
  // cutoff como angulos
  set innerCutOff (angle) {
    this._innerCutOff = Math.cos(angle)
  }

  set outerCutOff (angle) {
    this._outerCutOff = Math.cos(angle)
  }

  get innerCutOff () {
    return Math.acos(this._innerCutOff)
  }

  get outerCutOff () {
    return Math.acos(this._outerCutOff)
  }
}

module.exports = SpotLight
