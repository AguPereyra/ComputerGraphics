class Scene {
  constructor (clearColor) {
    this._clearColor = clearColor
    this._meshes = []
  }

  addMesh (mesh) {
    this._meshes.push(mesh)
  }
}

module.exports = Scene
