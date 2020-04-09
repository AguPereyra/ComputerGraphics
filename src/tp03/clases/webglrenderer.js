class WebGLRenderer {
  constructor (canvas) {
    this._gl = canvas.getContext('webgl')
  }

  render (scene, camera) {
    //  Dibujar puntos
    //  --------------
    const vsSource = require('./shaders/vertex-shader.glsl')
    const fsSource = require('./shaders/fragment-shader.glsl')

    //  Compilar programa
    const program = this._compileProgram(vsSource, fsSource)

    //  Activar DEPTH_TEST
    this._gl.enable(this._gl.DEPTH_TEST)
    //  Limpiar pantalla
    //  Color de limpiado
    this._gl.clearColor(scene._clearColor.r, scene._clearColor.g, scene._clearColor.b, scene._clearColor.a)
    //  Limpiar buffers
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT)

    //  Dibujar cada mesh, en orden
    let i = 0
    for (i; i < scene._meshes.length; i++) {
      let mesh = scene._meshes[i]

      const vboData = mesh._geometry._vertices
      const iboData = mesh._geometry._faces
      const cboData = mesh._material

      //  Asignar valores de los vertices
      this._bindDataBuffer(vboData, 'aPosition', program, 3)
      //  Asignar colores
      this._bindDataBuffer(cboData, 'aColor', program, 4)
      //  Asignar Model Matrix
      const uModelMatrix = this._gl.getUniformLocation(program, 'uModelMatrix')
      this._gl.uniformMatrix4fv(uModelMatrix, false, mesh.modelMatrix)
      //  Asignar View Matrix
      const uViewMatrix = this._gl.getUniformLocation(program, 'uViewMatrix')
      this._gl.uniformMatrix4fv(uViewMatrix, false, camera.viewMatrix)
      //  Asignar Projection Matrix
      const uProjectionMatrix = this._gl.getUniformLocation(program, 'uProjectionMatrix')
      this._gl.uniformMatrix4fv(uProjectionMatrix, false, camera.projectionMatrix)
      //  Dibujar puntos
      this._draw(iboData, mesh._drawAsTriangle)
    }
  }

  //  Función que vincula los datos del arreglo
  //  pasados por parámetros con la variable
  //  (pasada por parámetros).
  //  size indica de a cuántos datos se lee el arreglo.
  _bindDataBuffer (boData, variable, program, size) {
    // Crear el Color Buffer Object
    const bo = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, bo)
    this._gl.bufferData(this._gl.ARRAY_BUFFER, boData, this._gl.STATIC_DRAW)

    // Vincular el buffer con el atribute del vertex shader
    const attribute = this._gl.getAttribLocation(program, variable)
    this._gl.vertexAttribPointer(
      attribute, size, this._gl.FLOAT, false,
      boData.BYTES_PER_ELEMENT * 0, boData.BYTES_PER_ELEMENT * 0
    )
    this._gl.enableVertexAttribArray(attribute)

    // Limpiar buffer
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null)
  }

  //  Función que compila el código de ambos shaders
  //  pasados por parámetros, y establece el programa
  //  resultante como aquel a usar. Retorna una referencia
  //  al programa
  _compileProgram (vsSource, fsSource) {
    //  Crear Vertex shader y compilar
    const vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER)
    this._gl.shaderSource(vertexShader, vsSource)
    this._gl.compileShader(vertexShader)

    //  Crear Fragment shader y compilar
    const fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER)
    this._gl.shaderSource(fragmentShader, fsSource)
    this._gl.compileShader(fragmentShader)

    //  Crear el programa combinado
    const program = this._gl.createProgram()
    this._gl.attachShader(program, vertexShader)
    this._gl.attachShader(program, fragmentShader)

    //  Usar el programa combinado
    this._gl.linkProgram(program)
    this._gl.useProgram(program)

    return program
  }

  //  Función que dibuja la figura en función
  //  de los índices pasados por parámetros, y
  //  del color de limpiado de la escena.
  //  Dibuja usando triangulos si triangles es verdadero,
  //  sino dibuja con lineas.
  _draw (iboData, triangles) {
    //  Buffer Indices
    const ibo = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, ibo)

    //  Poner datos en el buffer
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, iboData, this._gl.STATIC_DRAW)

    //  Establecer el mapeo de clips al viewport
    this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight)

    //  Dibujar
    if (triangles) {
      this._gl.drawElements(this._gl.TRIANGLES, iboData.length, this._gl.UNSIGNED_SHORT, 0)
    } else {
      this._gl.drawElements(this._gl.LINES, iboData.length, this._gl.UNSIGNED_SHORT, 0)
    }

    //  Limpiar buffer
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null)
  }
}

module.exports = WebGLRenderer
