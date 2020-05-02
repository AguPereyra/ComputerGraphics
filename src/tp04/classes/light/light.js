class Light {
  constructor (color) {
    this.color = {}
    this.color.ambient = color.ambient
    this.color.diffuse = color.diffuse
    this.color.specular = color.specular
  }
}

module.exports = Light
