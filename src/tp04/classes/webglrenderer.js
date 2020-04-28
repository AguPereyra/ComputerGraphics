const twgl = require('twgl.js')

class WebglRenderer {
  constructor (canvas) {
    this._gl = twgl.getWebGLContext(canvas)
  }

  render (scene, camera) {
    const vs = require('./shaders/vertex-shader.glsl')
    const fs = require('./shaders/fragment-shader.glsl')
    const programInfo = twgl.createProgramInfo(this._gl, [vs, fs])
    this._gl.useProgram(programInfo.program)

    twgl.resizeCanvasToDisplaySize(this._gl.canvas)
    this._gl.clearColor(0.2, 0.2, 0.2, 1)
    this._gl.enable(this._gl.DEPTH_TEST)
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT)
    this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight)

    //  Dibujar cada mesh, en orden
    let i = 0
    for (i; i < scene._meshes.length; i++) {
      let mesh = scene._meshes[i]

      const arrays = {
        aPosition: mesh._geometry._vertices,
        aColor: mesh._material,
        indices: mesh._geometry._faces
      }
      const bufferInfo = twgl.createBufferInfoFromArrays(this._gl, arrays)

      const uniforms = {
        uProjectionMatrix: camera.projectionMatrix,
        uViewMatrix: camera.viewMatrix,
        uModelMatrix: mesh.modelMatrix
      }
      twgl.setBuffersAndAttributes(this._gl, programInfo, bufferInfo)
      twgl.setUniforms(programInfo, uniforms)
      twgl.drawBufferInfo(this._gl, bufferInfo,
        (mesh._drawAsTriangle) ? this._gl.TRIANGLES : this._gl.LINES)
    }
  }
}

module.exports = WebglRenderer
