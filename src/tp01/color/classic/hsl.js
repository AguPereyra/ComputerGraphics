const RGBA = require('./rgba')
const Utilities = require('./utilities')

class HSL extends RGBA {
  constructor (h, s, l) {
    if (h < 0 || h > 360) {
      throw new Error('Variable h should be between 0 and 1.')
    }
    if (s < 0 || s > 1 || l < 0 || l > 1) {
      throw new Error('Variables s and l should be between 0 and 1.')
    }
    const rgbArray = Utilities.hue2rgb(h, s, l)
    super(rgbArray.r, rgbArray.g, rgbArray.b, 1)
  }
}

module.exports = HSL
