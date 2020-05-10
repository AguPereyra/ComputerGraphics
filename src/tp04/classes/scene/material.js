const Color = require('../colors/color')

class Material {
  constructor (color) {
    this.color = new Color()
    this.color._ambient = color.ambient
    this.color._diffuse = color.diffuse
    this.color._specular = color.specular
    this.shininess = color.shininess
  }
}

module.exports = Material
