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
    //  Variables que almacenan el angulo en grados
    //  solo para que sea mas facil leer desde interfaz
    this._radInnCO = angles.innerCutOff
    this._radOutCO = angles.outerCutOff
  }

  // Metodos para poder editar los inner y outer
  // cutoff como angulos centigrados
  set innerCutOff (angle) {
    this._radInnCO = angle * Math.PI / 180
    this._innerCutOff = Math.cos(this._radInnCO)
  }

  set outerCutOff (angle) {
    this._radOutCO = angle * Math.PI / 180
    this._outerCutOff = Math.cos(this._radOutCO)
  }

  get innerCutOff () {
    return this._radInnCO * 180 / Math.PI
  }

  get outerCutOff () {
    return this._radOutCO * 180 / Math.PI
  }
}

module.exports = SpotLight
