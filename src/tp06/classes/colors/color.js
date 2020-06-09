//  Clase de utilidad para poder alterar colores
//  con valores de 0 a 255.
class Color {
  constructor () {
    this._ambient = [0.0, 0.0, 0.0]
    this._diffuse = [0.0, 0.0, 0.0]
    this._specular = [0.0, 0.0, 0.0]
  }
  //  Seters que permiten pasar colores en RGB
  //  con valores de 0 a 255
  set ambientRGB (color) {
    this._ambient = [
      color[0] / 255,
      color[1] / 255,
      color[2] / 255
    ]
  }

  set diffuseRGB (color) {
    this._diffuse = [
      color[0] / 255,
      color[1] / 255,
      color[2] / 255
    ]
  }

  set specularRGB (color) {
    this._specular = [
      color[0] / 255,
      color[1] / 255,
      color[2] / 255
    ]
  }

  get ambientRGB () {
    return [
      this._ambient[0] * 255,
      this._ambient[1] * 255,
      this._ambient[2] * 255,
    ]
  }

  get diffuseRGB () {
    return [
      this._diffuse[0] * 255,
      this._diffuse[1] * 255,
      this._diffuse[2] * 255,
    ]
  }

  get specularRGB () {
    return [
      this._specular[0] * 255,
      this._specular[1] * 255,
      this._specular[2] * 255,
    ]
  }
}

module.exports = Color
