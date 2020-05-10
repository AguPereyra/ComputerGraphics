const Color = require('../colors/color')

class Light {
  //  Clase que define los colores
  //  de ambiente, difusos y especulares
  //  para la luz. Los pasados por el constructor
  //  deben estar en formato rgb con rango de 0 a 1.
  //  Si se modifica sobre los atributos publicos,
  //  se espera rgb con valores de 0 a 255.
  constructor (color) {
    this.color = new Color()
    this.color._ambient = color.ambient
    this.color._diffuse = color.diffuse
    this.color._specular = color.specular
    //  Luz activa por defecto
    this.active = true
  }
}

module.exports = Light
