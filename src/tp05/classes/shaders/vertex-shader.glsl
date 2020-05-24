attribute vec4 aPosition;
attribute vec3 aNormal;
attribute vec2 aTextCoords;

varying vec3 vNormal;
varying vec3 vFragPos;
varying vec2 vTextCoords;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
  vFragPos = vec3(uModelMatrix * aPosition);
  vNormal = mat3(uNormalMatrix) * aNormal;
  vTextCoords = aTextCoords;
}
