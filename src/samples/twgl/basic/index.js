const twgl = require('twgl.js')
const fs = require('./shaders/fs.glsl')
const vs = require('./shaders/vs.glsl')

const gl = twgl.getWebGLContext(document.getElementById('c'))
const programInfo = twgl.createProgramInfo(gl, [vs, fs])

const arrays = {
  aPosition: [
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0
  ]
}
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

function render (time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas)

  gl.clearColor(0.2, 0.2, 0.2, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  const uniforms = {
    uColor: [1, 1, 0]
  }

  gl.useProgram(programInfo.program)
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
  twgl.setUniforms(programInfo, uniforms)
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES)

  window.requestAnimationFrame(render)
}
window.requestAnimationFrame(render)
