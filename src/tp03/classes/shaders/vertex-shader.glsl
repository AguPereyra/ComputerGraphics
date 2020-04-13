attribute vec4 aPosition;
attribute vec4 aColor;

varying vec4 vColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
  vColor = aColor;
}
