precision mediump float;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vFragPos;

uniform vec3 uLightColor;
uniform vec3 uViewPos;
uniform vec3 uLightPos;

void main() {
  //  Factor para luz de ambiente
  float ambientFactor = 0.2;
  vec3 ambientColor = ambientFactor * uLightColor;
  //  Luz difusa
  vec3 norm = normalize(vNormal);
  vec3 lightDir = normalize(uLightPos - vFragPos);
  float diff = max(dot(norm, lightDir), 0.0);
  vec3 diffuseColor = diff * uLightColor;
  //  Luz especular
  float specularStrength = 0.5;
  float shininess = 32.0;
  vec3 viewDir = normalize(uViewPos - vFragPos);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
  vec3 specularColor = specularStrength * spec * uLightColor;

  gl_FragColor = vec4(ambientColor + diffuseColor + specularColor, 1.0) * vColor;
}
