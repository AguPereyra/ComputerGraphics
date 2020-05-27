const glMatrix = require('gl-matrix')

class Mesh {
  constructor (geometry, material) {
    //  ID que debe ser asignada externamente
    this.id = 0
    //  Variable que almacenara un color en
    //  funcion del ID
    this._pickingColor = null
    this._geometry = geometry
    this._material = material
    this._normalMatrix = null
    this._tx = 0
    this._ty = 0
    this._tz = 0
    this._rx = 0
    this._ry = 0
    this._rz = 0
    this._sx = 1.0
    this._sy = 1.0
    this._sz = 1.0
    this._drawAsTriangle = true
    //  Guardar la matriz identidad para mejorar la performance
    this._identityMatrix = glMatrix.mat4.create()
    //  Flag para indicar que se le dibujen los ejes
    this.drawAxes = false
  }

  //  Funcion estatica que permite obtener e ID del mesh
  //  en funcion de un patron RGB.
  //  NOTA: Si se modifica esta funcion se debe cambiar "get pickingColor"
  static getId (rgb = [0, 0, 0]) {
    const id = rgb[0] + rgb[1] * 256 + rgb[2] * 256 ** 2
    return id
  }
  //  Función que calcula la matriz modelo
  //  aplicandole el escalamiento, la rotación
  //  y la traslación indicadas por las propiedades internas.
  //  Luego retorna el resultado del calculo.
  get modelMatrix () {
    // Definimos el Quaternion
    let quaternion = glMatrix.quat.create()
    quaternion = glMatrix.quat.fromEuler(quaternion, this._rx, this._ry, this._rz)
    return glMatrix.mat4.fromRotationTranslationScale(this._identityMatrix,
      quaternion,
      [this._tx, this._ty, this._tz],
      [this._sx, this._sy, this._sz])
  }

  //  Funcion que calcula la matrix normal
  //  aplicando los calculos necesarios.
  get normalMatrix () {
    return glMatrix.mat4.transpose([],
      glMatrix.mat4.invert([], this.modelMatrix))
  }

  //  Function que retorna el color en funcion del ID
  //  ATENCION: Se espera que el ID sea un entero de
  //  hasta 24 bits.
  //  NOTA: Si se modifica esta funcion se debe cambiar "static getId"
  get pickingColor () {
    if (this.id > 2 ** 24) {
      const error = {
        msg: 'ID bound exceded 2**24'
      }
      throw error
    }
    if (!this._pickingColor) {
      const r = (this.id & 0x0000FF) >> 0
      const g = (this.id & 0X00FF00) >> 8
      const b = (this.id & 0xFF0000) >> 16
      this._pickingColor = [
        r / 255,
        g / 255,
        b / 255
      ]
    }
    return this._pickingColor
  }
}

module.exports = Mesh
