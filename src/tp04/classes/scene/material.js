class Material {
  constructor (color) {
    this.surface = color.surface
    this.ambient = color.ambient
    this.diffuse = color.diffuse
    this.specular = color.specular
    this.shininess = color.shininess
  }
}

module.exports = Material
