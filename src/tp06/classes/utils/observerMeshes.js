/** Clase de utilidad para modificar varios meshes en paralelo
    En la practica se puede usar para modificar los meshes de los ejes y de la figura
    al mismo tiempo.
*/
class ObserverMeshes {
  constructor (meshes = []) {
    this._meshes = meshes
  }

  set tx (tx) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._tx = tx
    }
  }

  get tx () {
    return this._meshes[0]._tx
  }

  set ty (ty) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._ty = ty
    }
  }

  get ty () {
    return this._meshes[0]._ty
  }

  set tz (tz) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._tz = tz
    }
  }

  get tz () {
    return this._meshes[0]._tz
  }

  set rx (rx) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._rx = rx
    }
  }

  get rx () {
    return this._meshes[0]._rx
  }

  set ry (ry) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._ry = ry
    }
  }

  get ry () {
    return this._meshes[0]._ry
  }

  set rz (rz) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._rz = rz
    }
  }

  get rz () {
    return this._meshes[0]._rz
  }

  set sx (sx) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._sx = sx
    }
  }

  get sx () {
    return this._meshes[0]._sx
  }

  set sy (sy) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._sy = sy
    }
  }

  get sy () {
    return this._meshes[0]._sy
  }

  set sz (sz) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i]._sz = sz
    }
  }

  get sz () {
    return this._meshes[0]._sz
  }

  set drawAxes (drawAxes) {
    for (let i = 0; i < this._meshes.length; i++) {
      this._meshes[i].drawAxes = drawAxes
    }
  }

  get drawAxes () {
    return this._meshes[0].drawAxes
  }
}

module.exports = ObserverMeshes
