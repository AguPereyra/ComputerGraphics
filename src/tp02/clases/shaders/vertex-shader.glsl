attribute vec4 aPosition;
attribute vec4 aColor;

varying vec4 vColor;

uniform mat4 uModelMatrix;

void main() {
  gl_Position = uModelMatrix * aPosition;
  vColor = aColor;
}
