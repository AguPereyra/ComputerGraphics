const Geometry = require('./geometry')

class CubeGeometry extends Geometry {
  constructor (size) {
    super()
    //  Angulo entre vertices
    this.edges = 4
    const angleBP = (2 * Math.PI) / this.edges
    let vertices = []
    let indexes = []
    let x
    let y
    //  Definir vertices e indices
    //  de forma que entren en la circunferencia
    //  de radio r=1, con centro en 0,0
    for (let z = 0; z < 2; z++) {
      for (let i = 0; i < this.edges; i++) {
        x = Math.cos(angleBP * i)
        y = Math.sin(angleBP * i)
        vertices.push(x, y, z)
      }
    }
    //  Generar indices
    //  NOTA A FUTURO: HACERLO MAS EFICIENTE
    //  Definir indices para dibujar triangulos
    //  Recordar: Los triangulos de un polígono
    //  se obtienen dibujando segmentos de línea
    //  de un vértice a todos los demás.
    //  Y el número de triángulos en un polígono
    //  es edges-2
    //  Ver: https://www.mathopenref.com/polygontriangles.html
    //  En nuestro caso, el vértice a unir con todos es 0
    //  Cara de abajo
    for (let i = 1; i <= this.edges - 2; i++) {
      indexes.push(0, i, i + 1)
    }
    //  Cara de arriba
    for (let i = 5; i < 7; i++) {
      indexes.push(4, i, i + 1)
    }
    //  Caras del cubo (en indices):
    //  con la regla de la mano derecha
    //  [0, 3, 2, 1]
    //  [0, 1, 5, 4] a
    //  [1, 2, 6, 5] b
    //  [2, 3, 7, 6] c
    //  [3, 0, 4, 7] d
    //  [4, 5, 6, 7]
    //  Costados a,b,c
    for (let i = 0; i < 3; i++) {
      indexes.push(i, i + 1, i + 5)
      indexes.push(i, i + 5, i + 4)
    }
    //  Costado d
    indexes.push(3, 0, 4)
    indexes.push(3, 4, 7)
    this._vertices = vertices
    this._faces = indexes
  }
}

module.exports = CubeGeometry
