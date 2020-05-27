class Scene {
  constructor (clearColor) {
    this.clearColor = clearColor
    this._meshes = []
    this._ambientLight = null
    this._pointLight = null
    this._spotLight = null
  }

  addMesh (mesh) {
    this._meshes.push(mesh)
  }
}

module.exports = Scene
