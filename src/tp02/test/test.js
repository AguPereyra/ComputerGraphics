function main () {
  const canvas = document.querySelector('#c')
  const gl = canvas.getContext('webgl')
  const glMatrix = require('gl-matrix')

  //  Solo continuar si WebGL esta disponible
  if (gl === null) {
    alert('Imposible inicializar WebGL.')
    return 0
  }

  gl.clearColor(0.0, 1.0, 0.0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const vsSource = require('./vertex-shader.glsl')
  const fsSource = require('./fragment-shader.glsl')

  //  Iniciar el shader
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

  //  Juntar los datos de este shader
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
    }
  }

  //  Crear el buffer con la informacion del dibujo
  const buffers = initBuffers(gl)

  //  Dibujar
  drawScene(gl, programInfo, buffers, glMatrix)
}

//  Iniciar el programa shader
function initShaderProgram (gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  //  Crear el programa Shader
  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  //  Si se falla al crear el programa, alertar
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Imposible iniciar el programa shader: ' + gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

// Crear el shader del tipo dado, cargar la fuente y compilar
function loadShader (gl, type, source) {
  const shader = gl.createShader(type)

  //  Enviar la fuente al objeto shader
  gl.shaderSource(shader, source)

  //  Compilar el shader
  gl.compileShader(shader)

  //  Verificar que la compilacion funciono
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('Hubo en error al compilar el shader: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

//  Crear el buffer que contiene las posiciones de los vertices
function initBuffers (gl) {
  const positionBuffer = gl.createBuffer()

  //  Seleccionar el buffer para que sea desde el cual aplicar las operaciones
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  //  Crear un arreglo con las posiciones
  const positions = [
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0
  ]

  //  Pasar la lista de posiciones a WebGL para crear la forma
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW)

  return {
    position: positionBuffer
  }
}

//  Cargar la imagen
function drawScene (gl, programInfo, buffers, glMatrix) {
  gl.clearColor(0.0, 0.0, 0.0, 1)
  gl.clearDepth(1.0) //  Limpiar todo
  gl.enable(gl.DEPTH_TEST) //  Permitir testeo profundo
  gl.depthFunc(gl.LEQUAL) //  Objetos cercanos obscurecen los lejanos

  //  Limpiar el canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  //  Crear una matriz de perspectiva, usada para simular la
  //  distorsion de perspectiva en camara.
  const fieldOfView = 45 * Math.PI / 180 // Radianes
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = glMatrix.mat4.create()

  glMatrix.mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar)

  //  Colocar el punto de dibujo al centro de la escena
  const modelViewMatrix = glMatrix.mat4.create()

  //  Mover el punto de dibujo a donde deseamos iniciar el trazado
  glMatrix.mat4.translate(modelViewMatrix, //  Matriz destino
    modelViewMatrix, //  Matriz a traducir
    [-0.0, 0.0, -6.0]) //  Cantidad a traducir

  // Explicar a WebGL como tomar las posiciones del buffer
  //  para colocarlas en el atributo vertexPosition
  {
    const numComponents = 2 //  Tomar 2 valores por iteracion
    const type = gl.FLOAT //  La informacion en el buffer son floats de 32b
    const normalize = false //  No normalizar
    const stride = 0 //  Cuantos bytes tomar entre valores,0 = usar numComponents y type
    const offset = 0 //  Donde empezar (bytes) del buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition
    )
  }

  //  WebGL debe usar nuestro programa al dibujar
  gl.useProgram(programInfo.program)

  //  Establecer los uniforms de los shaders
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  )
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  )

  {
    const offset = 0
    const vertexCount = 4
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
  }
}
window.onload = main
