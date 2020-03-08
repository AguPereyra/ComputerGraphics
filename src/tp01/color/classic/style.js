const Hex = require('./hex')

class Style extends Hex {
  constructor (styleStr) {
    //  Obtener hexadecimal
    const match = /^#([A-Fa-f0-9]+)$/.exec(styleStr)
    if (match === null) {
      throw new Error('Passed argument should be of form #ff0000 or #f00')
    }
    //  Verificar largo
    let hexTemp = match[1]
    const size = hexTemp.length
    if (size === 3) {
      // Transformar a hexa correcto
      hexTemp = hexTemp.charAt(0) + hexTemp.charAt(0) + hexTemp.charAt(1) + hexTemp.charAt(1) +
                    hexTemp.charAt(2) + hexTemp.charAt(2)
    }
    super(parseInt(hexTemp, 16))
  }
}

module.exports = Style
