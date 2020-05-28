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
    this._cacheNoLights = {}
  }

  render (scene, camera) {
    const vs = require('./shaders/vertex-shader.glsl')
    const fs = require('./shaders/fragment-shader.glsl')
    // Cache de programa
    if (!this._cache.programInfo) {
      this._cache.programInfo = twgl.createProgramInfo(this._gl, [vs, fs])
    }

    twgl.resizeCanvasToDisplaySize(this._gl.canvas)
    this._gl.clearColor(scene.clearColor.r, scene.clearColor.g, scene.clearColor.b, scene.clearColor.a)
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
          aTextCoords: mesh._geometry._st,
          indices: mesh._geometry._faces
        }
        this._cache.figures[i] = {}
        this._cache.figures[i].bufferInfo = twgl.createBufferInfoFromArrays(this._gl, arrays)

        //  Cacheamos la textura
        this._cache.figures[i].texture = twgl.createTextures(this._gl, {
          diffuse: {
            src: require('./textures/' + mesh._material.map)
          }
        })
      }

      const uniforms = {
        uProjectionMatrix: camera.projectionMatrix,
        uViewMatrix: camera.viewMatrix,
        uModelMatrix: mesh.modelMatrix,
        uNormalMatrix: mesh.normalMatrix,
        uViewPos: [camera._eyeX, camera._eyeY, camera._eyeZ],
        'uMaterial.ambient': this._cache.figures[i].texture.diffuse,
        'uMaterial.diffuse': this._cache.figures[i].texture.diffuse,
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

      twgl.setBuffersAndAttributes(this._gl, this._cache.programInfo, this._cache.figures[i].bufferInfo)
      twgl.setUniforms(this._cache.programInfo, uniforms)
      twgl.drawBufferInfo(this._gl, this._cache.figures[i].bufferInfo,
        (mesh._drawAsTriangle) ? this._gl.TRIANGLES : this._gl.LINES)
    }
  }

  //  Funcion para renderizar sin luces
  //  El parametro pickingColor permite saber
  //  si se debe renderizar con el material o con
  //  un color generado para ser unico
  //  La variable clean es para indicar si limpiamos o no la pantalla.
  //  Sirve si se usa despues de render() para no pisar lo dibujado.
  //  El parametro checkFlag le indica a renderNoLights que debe dibujar
  //  solamente las mallas que tengan esa bandera en true. Si no se desea
  //  observar ninguna bandera, no se debe pasar.
  renderNoLights (scene, camera, { pickingColor = false, clean = false, checkFlag = '' } = {}) {
    const vs = require('./shaders/simple-vs.glsl')
    const fs = require('./shaders/simple-fs.glsl')
    // Cache de programa
    if (!this._cacheNoLights.programInfo) {
      this._cacheNoLights.programInfo = twgl.createProgramInfo(this._gl, [vs, fs])
    }

    if (clean) {
      twgl.resizeCanvasToDisplaySize(this._gl.canvas)
      this._gl.clearColor(scene.clearColor.r, scene.clearColor.g, scene.clearColor.b, scene.clearColor.a)
      this._gl.enable(this._gl.DEPTH_TEST)
      this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT)
      this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight)
    }

    this._gl.useProgram(this._cacheNoLights.programInfo.program)

    //  Dibujar cada mesh, en orden
    let i = 0
    for (i; i < scene._meshes.length; i++) {
      let mesh = scene._meshes[i]

      //  Revisamos la flag (si se pidio)
      if (checkFlag.length === 0 ||
        (checkFlag.length > 0 && mesh[checkFlag])) {
        //  Cache de bufferInfo en el mesh, para asegurar
        //  que si pasan otro mesh, debo crear el buffer.
        if (!mesh.bufferInfo) {
          const arrays = {
            aPosition: mesh._geometry._vertices,
            indices: mesh._geometry._faces
          }
          mesh.bufferInfo = twgl.createBufferInfoFromArrays(this._gl, arrays)
        }

        const uniforms = {
          uProjectionMatrix: camera.projectionMatrix,
          uViewMatrix: camera.viewMatrix,
          uModelMatrix: mesh.modelMatrix,
          uColor: (pickingColor) ? mesh.pickingColor : mesh._material
        }

        twgl.setBuffersAndAttributes(this._gl, this._cacheNoLights.programInfo, mesh.bufferInfo)
        twgl.setUniforms(this._cacheNoLights.programInfo, uniforms)
        twgl.drawBufferInfo(this._gl, mesh.bufferInfo,
          (mesh._drawAsTriangle) ? this._gl.TRIANGLES : this._gl.LINES)
      }
    }
  }

  //  Funcion para obtener informacion de picking
  //  Retorna el color seleccionado.
  processPicking (x, y, scene, camera) {
    //  Crear el buffer de dibujo fuera de escena
    //  en cache
    if (!this._cache.pickingBuffer) {
      const attachments = [
        {
          format: this._gl.RGBA,
          type: this._gl.UNSIGNED_BYTE,
          min: this._gl.LINEAR,
          mag: this._gl.LINEAR,
          wrap: this._gl.CLAMP_TO_EDGE
        },
        {
          format: this._gl.DEPTH_COMPONENT16
        }
      ]

      twgl.resizeCanvasToDisplaySize(this._gl.canvas)
      this._cache.pickingBuffer = twgl.createFramebufferInfo(this._gl, attachments, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight)
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null)
    }

    const readout = new Uint8Array(4) //  Es 4 por RGBA
    //  Dibujar en una textura
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._cache.pickingBuffer.framebuffer)
    //  Renderizar sin luces
    this.renderNoLights(scene, camera, { pickingColor: true, clean: true })
    // Leer el pixel
    this._gl.readPixels(x, y, 1, 1, this._gl.RGBA, this._gl.UNSIGNED_BYTE, readout)

    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null)

    //  Retornar color seleccionado
    return readout
  }

  _renderlightPointBox (camera, scene) {
    const vs = require('./shaders/simple-vs.glsl')
    const fs = require('./shaders/simple-fs.glsl')
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
