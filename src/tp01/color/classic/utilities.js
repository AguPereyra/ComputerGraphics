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
    let r
    let g
    let b
    // Pasar hue entre 0 y 1
    h = h / 360
    if (s === 0) {
      r = g = b = l
    } else {
      const p = l <= 0.5 ? l * (1 + s) : l + s - (l * s)
      const q = (2 * l) - p

      r = this.getRGB(q, p, h + 1 / 3)
      g = this.getRGB(q, p, h)
      b = this.getRGB(q, p, h - 1 / 3)
    }

    return {
      r: r,
      g: g,
      b: b
    }
  }
}

module.exports = Utilities
