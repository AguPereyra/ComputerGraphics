const RGB = require('./rgb')

class Hex extends RGB {
  constructor (hexNumber) {
    //  Convertir colores
    const maskRed = 0xff0000
    const maskGreen = 0x00ff00
    const maskBlue = 0x0000ff
    //  Obtener componentes
    let r = hexNumber & maskRed
    let g = hexNumber & maskGreen
    let b = hexNumber & maskBlue
    //  Obtener solo los numeros hexadecimales de cada color, y pasarlos a enteros entre 0 y 1
    r = parseInt(r.toString(16).slice(0, 2), 16) / 255
    g = parseInt(g.toString(16).slice(0, 2), 16) / 255
    b = parseInt(b.toString(16).slice(0, 2), 16) / 255
    super(r, g, b)
  }
}

module.exports = Hex
