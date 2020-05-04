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
          aNormal: mesh._geometry.normals,
          indices: mesh._geometry._faces
        }
        this._cache.figures[i] = twgl.createBufferInfoFromArrays(this._gl, arrays)
      }

      const uniforms = {
        uProjectionMatrix: camera.projectionMatrix,
        uViewMatrix: camera.viewMatrix,
        uModelMatrix: mesh.modelMatrix,
        uNormalMatrix: mesh.normalMatrix,
        uViewPos: [camera._eyeX, camera._eyeY, camera._eyeZ],
        'uMaterial.ambient': mesh._material.diffuse,
        'uMaterial.diffuse': mesh._material.diffuse,
        'uMaterial.specular': mesh._material.specular,
        'uMaterial.shininess': mesh._material.shininess,
        'uDirLight.direction': scene._ambientLight.direction,
        'uDirLight.ambient': scene._ambientLight.color.ambient,
        'uDirLight.diffuse': scene._ambientLight.color.diffuse,
        'uDirLight.specular': scene._ambientLight.color.specular,
        'uPointLight.position': [scene._pointLight._px,
          scene._pointLight._py,
          scene._pointLight._pz],
        'uPointLight.ambient': scene._pointLight.color.ambient,
        'uPointLight.diffuse': scene._pointLight.color.diffuse,
        'uPointLight.specular': scene._pointLight.color.specular,
        'uPointLight.constant': scene._pointLight._constant,
        'uPointLight.linear': scene._pointLight._linear,
        'uPointLight.quadratic': scene._pointLight._quadratic,
        'uSpotLight.position': [scene._spotLight._px,
          scene._spotLight._py,
          scene._spotLight._pz],
        'uSpotLight.spotDirection': [scene._spotLight._sdX,
          scene._spotLight._sdY,
          scene._spotLight._sdZ],
        'uSpotLight.innerCutOff': scene._spotLight._innerCutOff,
        'uSpotLight.outerCutOff': scene._spotLight._outerCutOff,
        'uSpotLight.ambient': scene._spotLight.color.ambient,
        'uSpotLight.diffuse': scene._spotLight.color.diffuse,
        'uSpotLight.specular': scene._spotLight.color.specular,
        'uSpotLight.constant': scene._spotLight._constant,
        'uSpotLight.linear': scene._spotLight._linear,
        'uSpotLight.quadratic': scene._spotLight._quadratic,
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
      uLightColor: scene._pointLight.color.ambient
    }

    twgl.setBuffersAndAttributes(this._gl, this._cache.programInfoLight, this._cache.lightBox)
    twgl.setUniforms(this._cache.programInfoLight, uniforms)
    twgl.drawBufferInfo(this._gl, this._cache.lightBox, this._gl.TRIANGLES)
  }
}

module.exports = WebglRenderer
