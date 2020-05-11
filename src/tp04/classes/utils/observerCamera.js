//  Clase de utilidad para cambiar los atributos
//  de posicion de cualquiera de las camaras con
//  una sola variable en dat.GUI.
class ObserverCamera {
  constructor (args) {
    this._orthoCamera = args.orthoCamera
    this._orbitalCamera = args.orbitalCamera
  }
  //  Setters que se usan para modificar los datos de
  //  posicion de ambas camaras a la vez.
  set eyeX (eyeX) {
    this._orthoCamera._eyeX = eyeX
    this._orbitalCamera._eyeX = eyeX
  }
  set eyeY (eyeY) {
    this._orthoCamera._eyeY = eyeY
    this._orbitalCamera._eyeY = eyeY
  }
  set eyeZ (eyeZ) {
    this._orthoCamera._eyeZ = eyeZ
    this._orbitalCamera._eyeZ = eyeZ
  }
  set centerX (centerX) {
    this._orthoCamera._centerX = centerX
    this._orbitalCamera._centerX = centerX
  }
  set centerY (centerY) {
    this._orthoCamera._centerY = centerY
    this._orbitalCamera._centerY = centerY
  }
  set centerZ (centerZ) {
    this._orthoCamera._centerZ = centerZ
    this._orbitalCamera._centerZ = centerZ
  }
  set upX (upX) {
    this._orthoCamera._upX = upX
    this._orbitalCamera._upX = upX
  }
  set upY (upY) {
    this._orthoCamera._upY = upY
    this._orbitalCamera._upY = upY
  }
  set upZ (upZ) {
    this._orthoCamera._upZ = upZ
    this._orbitalCamera._upZ = upZ
  }
  //  Getters necesarios para el acceso
  //  Recordar: Los dos son iguales
  get eyeX () {
    return this._orthoCamera._eyeX
  }
  get eyeY () {
    return this._orthoCamera._eyeY
  }
  get eyeZ () {
    return this._orthoCamera._eyeZ
  }
  get centerX () {
    return this._orthoCamera._centerX
  }
  get centerY () {
    return this._orthoCamera._centerY
  }
  get centerZ () {
    return this._orthoCamera._centerZ
  }
  get upX () {
    return this._orthoCamera._upX
  }
  get upY () {
    return this._orthoCamera._upY
  }
  get upZ () {
    return this._orthoCamera._upZ
  }
}

module.exports = ObserverCamera
