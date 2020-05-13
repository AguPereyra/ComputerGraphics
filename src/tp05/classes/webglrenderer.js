const twgl = require('twgl.js')
const CubeGeometry = require('./figures/cubeGeometry')
const CylinderGeometry = require('./figures/cylinderGeometry')
const glMatrix = require('gl-matrix')

class WebglRenderer {
  constructor (canvas) {
    this._gl = twgl.getWebGLContext(canvas)
    this._cache = {
      figures: []
    }
    this._cacheNoLights = {
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

    //  Light Boxes solo si existen
    if (typeof scene._pointLight === 'object') {
      this._renderlightPointBox(camera, scene)
    }

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
        'uMaterial.ambient': mesh._material.color._ambient,
        'uMaterial.diffuse': mesh._material.color._diffuse,
        'uMaterial.specular': mesh._material.color._specular,
        'uMaterial.shininess': mesh._material.shininess,
        'uDirLight.active': scene._ambientLight.active,
        'uDirLight.direction': [scene._ambientLight._dirX,
          scene._ambientLight._dirY,
          scene._ambientLight._dirZ],
        'uDirLight.ambient': scene._ambientLight.color._ambient,
        'uDirLight.diffuse': scene._ambientLight.color._diffuse,
        'uDirLight.specular': scene._ambientLight.color._specular,
        'uSpotLight.active': scene._spotLight.active,
        'uSpotLight.position': [scene._spotLight._px,
          scene._spotLight._py,
          scene._spotLight._pz],
        'uSpotLight.spotDirection': [scene._spotLight._sdX,
          scene._spotLight._sdY,
          scene._spotLight._sdZ],
        'uSpotLight.innerCutOff': scene._spotLight._innerCutOff,
        'uSpotLight.outerCutOff': scene._spotLight._outerCutOff,
        'uSpotLight.ambient': scene._spotLight.color._ambient,
        'uSpotLight.diffuse': scene._spotLight.color._diffuse,
        'uSpotLight.specular': scene._spotLight.color._specular,
        'uSpotLight.constant': scene._spotLight._constant,
        'uSpotLight.linear': scene._spotLight._linear,
        'uSpotLight.quadratic': scene._spotLight._quadratic,
      }

      // Insertar en Uniforms las distintas pointlights
      for (let i = 0; i < scene._pointLight.length; i++) {
        const pointLight = scene._pointLight[i]

        // Luces puntuales
        uniforms['uPointLight[' + i + '].active'] = pointLight.active
        uniforms['uPointLight[' + i + '].position'] = [pointLight._px,
          pointLight._py,
          pointLight._pz]
        uniforms['uPointLight[' + i + '].ambient'] = pointLight.color._ambient
        uniforms['uPointLight[' + i + '].diffuse'] = pointLight.color._diffuse
        uniforms['uPointLight[' + i + '].specular'] = pointLight.color._specular
        uniforms['uPointLight[' + i + '].constant'] = pointLight._constant
        uniforms['uPointLight[' + i + '].linear'] = pointLight._linear
        uniforms['uPointLight[' + i + '].quadratic'] = pointLight._quadratic
      }

      twgl.setBuffersAndAttributes(this._gl, this._cache.programInfo, this._cache.figures[i])
      twgl.setUniforms(this._cache.programInfo, uniforms)
      twgl.drawBufferInfo(this._gl, this._cache.figures[i],
        (mesh._drawAsTriangle) ? this._gl.TRIANGLES : this._gl.LINES)
    }
  }

  //  Funcion para renderizar sin luces
  renderNoLights (scene, camera) {
    const vs = require('./shaders/light-vs.glsl')
    const fs = require('./shaders/light-fs.glsl')
    // Cache de programa
    if (!this._cacheNoLights.programInfo) {
      this._cacheNoLights.programInfo = twgl.createProgramInfo(this._gl, [vs, fs])
    }

    this._gl.useProgram(this._cacheNoLights.programInfo.program)

    //  Dibujar cada mesh, en orden
    let i = 0
    for (i; i < scene._meshes.length; i++) {
      let mesh = scene._meshes[i]

      //  Cache de bufferInfo
      if (!this._cacheNoLights.figures[i]) {
        const arrays = {
          aPosition: mesh._geometry._vertices,
          indices: mesh._geometry._faces
        }
        this._cacheNoLights.figures[i] = twgl.createBufferInfoFromArrays(this._gl, arrays)
      }

      const uniforms = {
        uProjectionMatrix: camera.projectionMatrix,
        uViewMatrix: camera.viewMatrix,
        uModelMatrix: mesh.modelMatrix,
        uColor: mesh._material
      }

      twgl.setBuffersAndAttributes(this._gl, this._cacheNoLights.programInfo, this._cacheNoLights.figures[i])
      twgl.setUniforms(this._cacheNoLights.programInfo, uniforms)
      twgl.drawBufferInfo(this._gl, this._cacheNoLights.figures[i],
        (mesh._drawAsTriangle) ? this._gl.TRIANGLES : this._gl.LINES)
    }
  }

  _renderlightPointBox (camera, scene) {
    const vs = require('./shaders/light-vs.glsl')
    const fs = require('./shaders/light-fs.glsl')
    // Cache de programa
    if (!this._cache.programInfoLight) {
      this._cache.programInfoLight = twgl.createProgramInfo(this._gl, [vs, fs])
    }
    this._gl.useProgram(this._cache.programInfoLight.program)

    // Crear figura de cubo para luces puntuales
    const cube = new CubeGeometry(1)

    // Para cada una de las luces puntuales
    for (let i = 0; i < scene._pointLight.length; i++) {
      //  Solo si la luz esta activa
      if (!scene._pointLight[i].active) {
        continue
      }
      const pointLight = scene._pointLight[i]
      //  Cache de bufferInfo
      if (!this._cache.lightPointBox) {
        const arrays = {
          aPosition: cube._vertices,
          indices: cube._faces
        }
        this._cache.lightPointBox = twgl.createBufferInfoFromArrays(this._gl, arrays)
      }

      const uniforms = {
        uProjectionMatrix: camera.projectionMatrix,
        uViewMatrix: camera.viewMatrix,
        uModelMatrix: [1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          pointLight._px, pointLight._py, pointLight._pz, 1],
        uColor: pointLight.color._diffuse
      }

      twgl.setBuffersAndAttributes(this._gl, this._cache.programInfoLight, this._cache.lightPointBox)
      twgl.setUniforms(this._cache.programInfoLight, uniforms)
      twgl.drawBufferInfo(this._gl, this._cache.lightPointBox, this._gl.TRIANGLES)
    }

    //  Crear figura de cono para luz focal
    const coneHeigt = 1
    const cone = new CylinderGeometry(coneHeigt, [1, 0])

    if (scene._spotLight.active) {
      //  Cache de bufferInfo
      if (!this._cache.lightSpotBox) {
        const arrays = {
          aPosition: cone._vertices,
          indices: cone._faces
        }
        this._cache.lightSpotBox = twgl.createBufferInfoFromArrays(this._gl, arrays)
      }

      const uniforms = {
        uProjectionMatrix: camera.projectionMatrix,
        uViewMatrix: camera.viewMatrix,
        uModelMatrix: glMatrix.mat4.targetTo([],
          [scene._spotLight._px, scene._spotLight._py, scene._spotLight._pz],
          [scene._spotLight._sdX, scene._spotLight._sdY, scene._spotLight._sdZ],
          [1, 0, 0]),
        uColor: scene._spotLight.color._diffuse
      }

      twgl.setBuffersAndAttributes(this._gl, this._cache.programInfoLight, this._cache.lightSpotBox)
      twgl.setUniforms(this._cache.programInfoLight, uniforms)
      twgl.drawBufferInfo(this._gl, this._cache.lightSpotBox, this._gl.TRIANGLES)
    }
  }
}

module.exports = WebglRenderer
