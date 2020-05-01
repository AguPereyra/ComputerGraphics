const twgl = require('twgl.js')
const CubeGeometry = require('./figures/cubeGeometry')

class WebglRenderer {
  constructor (canvas) {
    this._gl = twgl.getWebGLContext(canvas)
    this._cache = {
      figures: []
    }
  }

  render (scene, camera) {
    const vs = require('./shaders/vertex-shader.glsl')
    const fs = require('./shaders/fragment-shader.glsl')
    // Cache de programa
    if (!this._cache.programInfo) {
      this._cache.programInfo = twgl.createProgramInfo(this._gl, [vs, fs])
    }

    twgl.resizeCanvasToDisplaySize(this._gl.canvas)
    this._gl.clearColor(0.2, 0.2, 0.2, 1)
    this._gl.enable(this._gl.DEPTH_TEST)
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT)
    this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight)

    //  Light Box
    this._renderLightBox(camera, scene)

    this._gl.useProgram(this._cache.programInfo.program)

    //  Dibujar cada mesh, en orden
    let i = 0
    for (i; i < scene._meshes.length; i++) {
      let mesh = scene._meshes[i]

      //  Cache de bufferInfo
      if (!this._cache.figures[i]) {
        const arrays = {
          aPosition: mesh._geometry._vertices,
          aColor: mesh._material,
          aNormal: mesh._geometry.normals,
          indices: mesh._geometry._faces
        }
        this._cache.figures[i] = twgl.createBufferInfoFromArrays(this._gl, arrays)
      }

      const uniforms = {
        uProjectionMatrix: camera.projectionMatrix,
        uViewMatrix: camera.viewMatrix,
        uModelMatrix: mesh.modelMatrix,
        uLightColor: scene._ambientLight._color,
        uNormalMatrix: mesh.normalMatrix,
        uLightPos: [0, 3, 3],
        uViewPos: [camera._eyeX, camera._eyeY, camera._eyeZ]
      }

      twgl.setBuffersAndAttributes(this._gl, this._cache.programInfo, this._cache.figures[i])
      twgl.setUniforms(this._cache.programInfo, uniforms)
      twgl.drawBufferInfo(this._gl, this._cache.figures[i],
        (mesh._drawAsTriangle) ? this._gl.TRIANGLES : this._gl.LINES)
    }
  }

  _renderLightBox (camera, scene) {
    const vs = require('./shaders/light-vs.glsl')
    const fs = require('./shaders/light-fs.glsl')
    // Cache de programa
    if (!this._cache.programInfoLight) {
      this._cache.programInfoLight = twgl.createProgramInfo(this._gl, [vs, fs])
    }
    this._gl.useProgram(this._cache.programInfoLight.program)

    //  Cache de bufferInfo
    if (!this._cache.lightBox) {
      const cube = new CubeGeometry(1)
      const arrays = {
        aPosition: cube._vertices,
        indices: cube._faces
      }
      this._cache.lightBox = twgl.createBufferInfoFromArrays(this._gl, arrays)
    }

    const uniforms = {
      uProjectionMatrix: camera.projectionMatrix,
      uViewMatrix: camera.viewMatrix,
      uModelMatrix: [1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 3, 3, 1],
      uLightColor: scene._ambientLight._color
    }

    twgl.setBuffersAndAttributes(this._gl, this._cache.programInfoLight, this._cache.lightBox)
    twgl.setUniforms(this._cache.programInfoLight, uniforms)
    twgl.drawBufferInfo(this._gl, this._cache.lightBox, this._gl.TRIANGLES)
  }
}

module.exports = WebglRenderer
