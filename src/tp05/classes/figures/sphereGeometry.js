const Geometry = require('./geometry')

class SphereGeometry extends Geometry {
  constructor (radius) {
    super()
    this._radius = radius
    //  Construir puntos de la esfera
    //  Con stackCount y sectorCount indicando la cantidad
    //  de puntos a calcular por sector y stack.
    const stackCount = 8
    const sectorCount = 8
    let stackStep = Math.PI / stackCount
    let sectorStep = (2 * Math.PI) / sectorCount
    const stackBound = Math.PI / 2
    for (let stackAngle = -stackBound; stackAngle <= stackBound; stackAngle += stackStep) {
      let z = this._radius * Math.sin(stackAngle)
      for (let sectorAngle = 0; sectorAngle <= 2 * Math.PI; sectorAngle += sectorStep) {
        let x = this._radius * Math.cos(stackAngle) * Math.cos(sectorAngle)
        let y = this._radius * Math.cos(stackAngle) * Math.sin(sectorAngle)
        this._vertices.push(x, y, z)
      }
    }

    //  Calcular indices
    //  Recorro cada sector, y dibujo 2 triangulos con sentido antihorario.
    //  Se recorre la esfera de abajo hacia arriba, en sentido antihorario en el plano
    //  xy.
    //  Donde k1 es el punto inferior izquierdo del sector, y k2 el punto superior
    //  izquierdo, k1+1 el punto inferior derecho, y k2+1 el punto superior derecho.
    //  ver lo hecho en: http://www.songho.ca/opengl/gl_sphere.html.
    let k1
    let k2
    for (let stack = 0; stack < stackCount; ++stack) {
      k1 = stack * (sectorCount + 1)
      k2 = k1 + sectorCount + 1

      for (let sector = 0; sector < sectorCount; ++sector, ++k2, ++k1) {
        if (stack !== 0) {
          this._faces.push(k1, k2, k1 + 1)
        }

        //  Bordes
        if (stack !== (stackCount - 1)) {
          this._faces.push(k1 + 1, k2, k2 + 1)
        }
      }
    }

    //  Normales
    this.normals = this._vertices
  }
}

module.exports = SphereGeometry
