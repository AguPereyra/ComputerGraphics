precision mediump float;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vFragPos;

uniform vec3 uLightColor;
uniform vec3 uViewPos;

void main() {
  // Factor para luz de ambiente
  float ambientFactor = 0.2;
  vec3 ambientColor = ambientFactor * uLightColor;
  //  Luz difusa
  vec3 norm = normalize(vNormal);
  vec3 lightDir = normalize(uViewPos - vFragPos);
  float diff = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diff * uLightColor;

  gl_FragColor = vec4(ambientColor + diffuse, 1.0) * vColor;
}
