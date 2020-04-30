precision mediump float;

varying vec4 vColor;
varying vec3 vNormal;

uniform vec3 uLightColor;

void main() {
  // Factor para luz de ambiente
  float ambientFactor = 0.2;
  vec3 ambientColor = ambientFactor * uLightColor;

  gl_FragColor = vec4(ambientColor, 1.0) * vColor;
}
