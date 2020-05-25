const Mesh = require('../scene/mesh')
//  Clase para crear Meshes con IDs unicos
//  secuenciales
class MeshFactory {
  constructor () {
    this.count = 0
  }
  //  Metodo usado para incrementar obtener meshes
  //  con IDs diferentes y secuenciales
  getMesh (geometry, material) {
    this.count += 1
    const mesh = new Mesh(geometry, material)
    mesh.id = this.count
    return mesh
  }
}

module.exports = MeshFactory
