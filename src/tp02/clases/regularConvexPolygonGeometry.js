const Geometry = require('./geometry')

class RegularConvexPolygonGeometry extends Geometry {
  constructor (edges) {
    super()
    //  Revisar que edges >= 3
    if (edges < 3) {
      throw new Error('Edges expected to be greater or equal to 4, but ' + edges + ' received insted.')
    }
    this.edges = edges
    //  Angulo entre vertices
    const angleBP = (2 * Math.PI) / edges
    let vertices = []
    let indexes = []
    let x
    let y
    //  Definir vertices e indices
    //  de forma que entren en la circunferencia
    //  de radio r=1, con centro en 0,0
    for (let i = 0; i < edges; i++) {
      x = Math.cos(angleBP * i)
      y = Math.sin(angleBP * i)
      vertices.push(x, y, 0)
    }
    //  Definir indices para dibujar triangulos
    //  Recordar: Los triangulos de un polígono
    //  se obtienen dibujando segmentos de línea
    //  de un vértice a todos los demás.
    //  Y el número de triángulos en un polígono
    //  es edges-2
    //  Ver: https://www.mathopenref.com/polygontriangles.html
    //  En nuestro caso, el vértice a unir con todos es 0
    for (let i = 1; i <= edges - 2; i++) {
      indexes.push(0, i, i + 1)
    }

    //  Convertir datos en Float32Array para los buffers
    this._vertices = new Float32Array(vertices)
    this._faces = new Uint16Array(indexes)
  }
}

module.exports = RegularConvexPolygonGeometry
