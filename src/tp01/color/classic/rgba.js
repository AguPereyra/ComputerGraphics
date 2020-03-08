class RGBA {
  constructor (r, g, b, a) {
    //  Revisar rangos validos
    for (let i = 0; i < 4; i++) {
      if (!this.validRange(arguments[i])) {
        throw new Error('Variable ' + arguments[i] + ' should be between 0 and 1.')
      }
    }
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  vec4 () {
    return [
      this.r,
      this.g,
      this.b,
      this.a
    ]
  }

  vec3 () {
    return [
      this.r,
      this.g,
      this.b
    ]
  }

  validRange (x) {
    if (x > 1 || x < 0) {
      return false
    }
    return true
  }
}

module.exports = RGBA
