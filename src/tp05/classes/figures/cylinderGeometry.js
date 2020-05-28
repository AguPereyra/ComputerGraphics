const Geometry = require('./geometry')

/**
 *
 *
 * @class CylinderGeometry
 * @extends {Geometry}
 * Clase que calcula vertices, normales y st (coordenadas de texturas) del cilindro
 * por defecto.
 * Si al constructor se le pasa un arreglo de radios [0, 1] o [1, 0] se genera un cono.
 */
class CylinderGeometry extends Geometry {
  //  radius: arreglo que define el radio de la base
  //    en la posicion 0 y el radio del tope en la posicion 1.
  constructor (height, radius = [1, 1]) {
    super()
    this._height = height
    this._radius = radius
    //  Este codigo esta basado en el hallado en: http://www.songho.ca/opengl/gl_cylinder.html
    //  Para disminuir calculos hacemos una
    //  circunferencia de radio unitario y luego
    //  la trasladamos en z y le modificamos el r.
    const sectorCount = 24 //  Cantidad de muestras para dibujar la circunferencia
    //  Definimos los vertices
    const verticesUnit = this._getUnitCircle(sectorCount)

    //  ST
    const xTextStep = 1 / sectorCount
    let yText = 0
    let xText = 0

    //  Colocamos las circunferencias en la base
    //  y en el tope, con sus respectivos radios.
    //  Para aceptar texturas, generamos los vertices
    //  tres veces (cuerpo, tope y base).
    const heights = [-height / 2, height / 2]
    for (let k = 0; k < 3; k++) {
      yText = 0
      for (let j = 0; j < 2; j++, yText++) {
        xText = 0
        for (let i = 0; i < verticesUnit.length; i += 2, xText += xTextStep) {
          this._vertices.push(verticesUnit[i] * radius[j]) //  x
          this._vertices.push(verticesUnit[i + 1] * radius[j]) // y
          this._vertices.push(heights[j]) //  z
          //  Solo la textura del cuerpo
          this._st.push(xText, yText)
        }
      }
    }

    //  Generamos los indices
    //  Indices del cuerpo, sin contar la union entre el
    //  ultimo y el primero
    //  k2 ****** k2 + 1
    //     **   *
    //     * *  *
    //     *  * *
    //     *   **
    //  k1 ****** k1+1
    let k1 = 0
    let k2 = sectorCount
    for (let i = 0; i < sectorCount - 1; i++, k1++, k2++) {
      //  Insertamos los dos triangulos para el sector
      this._faces.push(k2, k1 + 1, k1)
      this._faces.push(k1 + 1, k2, k2 + 1)
    }
    //  Indices para el sector que une los ultimos
    //  vertice con los primeros
    //  k1: ultimo de la base
    //  k2: ultimo del tope
    this._faces.push(sectorCount * 2 - 1, 0, sectorCount - 1)
    this._faces.push(0, sectorCount * 2 - 1, sectorCount)

    //  Definir los indices de la base y tope
    this._getIndicesTopBottom(sectorCount)

    //  Normales
    this.normals = this._vertices
  }
  //  Funcion que genera los vertices de un circulo
  //  de radio unitario, sobre el plano xy
  _getUnitCircle (sectorCount) {
    let x, y
    const sectorAngle = (2 * Math.PI) / sectorCount //  Angulo de posicion
    let vertices = []
    for (let i = 0; i < sectorCount; i++) {
      x = Math.cos(sectorAngle * i)
      y = Math.sin(sectorAngle * i)
      vertices.push(x, y)
    }
    return vertices
  }

  //  Funcion que genera los indices de los extremos
  _getIndicesTopBottom (sectorCount) {
    //  Base
    const base = sectorCount * 2
    const top = sectorCount * 3
    let i = base + 1
    for (; i <= top - 2; i++) {
      this._faces.push(base, i, i + 1)
    }
    //  Tope
    for (i = top; i <= top + sectorCount - 2; i++) {
      this._faces.push(sectorCount, i + 1, i)
    }
  }

  /**
   * Funcion para obtener el largo de la figura del centro hasta uno de sus extremos.
   * En el caso de la esfera retorna el mayor valor entre los radios y la altura/2.
   */
  get sizeFromCenter () {
    return Math.max(this._radius[0], this._radius[1], this._height / 2)
  }
}

module.exports = CylinderGeometry
