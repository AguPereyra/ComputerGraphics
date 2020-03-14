const Utilities = {
  getRGB (p, q, t) {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t)
    return p
  },

  hue2rgb (h, s, l) {
    const a = s * Math.min(l, 1 - l)
    //  Funcion obtenida de https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
    const f = function (n) {
      const k = (n + h / 30) % 12
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    }
    return {
      r: f(0),
      g: f(8),
      b: f(4)
    }
  }
}

module.exports = Utilities
