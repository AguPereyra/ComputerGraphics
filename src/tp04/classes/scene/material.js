class Material {
  constructor (color) {
    this.diffuse = color.diffuse
    this.specular = color.specular
    this.shininess = color.shininess
  }
}

module.exports = Material
