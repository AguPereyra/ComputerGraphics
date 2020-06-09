const Geometry = require('./geometry')

/**
 * Clase que calcula vertices, normales y st (coordenadas de texturas) de la esfera
 * por defecto.
 *
 * @class SphereGeometry
 * @extends {Geometry}
 */
class SphereGeometry extends Geometry {
  constructor (radius) {
    super()
    this._radius = radius
    //  Construir puntos de la esfera
    //  Con stackCount y sectorCount indicando la cantidad
    //  de puntos a calcular por sector y stack.
    //  Construir st por defecto al mismo tiempo.
    //  Vertices
    const stackCount = 8
    const sectorCount = 8
    let stackStep = Math.PI / stackCount
    let sectorStep = (2 * Math.PI) / sectorCount
    const stackBound = Math.PI / 2
    //  ST
    const yTextStep = 1 / stackCount
    const xTextStep = 1 / sectorCount
    let yText = 0
    let xText = 0
    for (let stackAngle = -stackBound; stackAngle <= stackBound; stackAngle += stackStep, yText += yTextStep) {
      let z = this._radius * Math.sin(stackAngle)
      xText = 0
      for (let sectorAngle = 0; sectorAngle <= 2 * Math.PI; sectorAngle += sectorStep, xText += xTextStep) {
        let x = this._radius * Math.cos(stackAngle) * Math.cos(sectorAngle)
        let y = this._radius * Math.cos(stackAngle) * Math.sin(sectorAngle)
        this._vertices.push(x, y, z)
        this._st.push(xText, yText)
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

  /**
   * Funcion para obtener el largo de la figura del centro hasta uno de sus extremos.
   * En el caso de la esfera retorna el radio.
   */
  get sizeFromCenter () {
    return this._radius
  }
}

module.exports = SphereGeometry
