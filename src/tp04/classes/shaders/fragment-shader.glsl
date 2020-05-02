precision mediump float;

// Material Struct
struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  float shininess;
};
//  PointLight Struct
struct PointLight {
  vec3 position;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vFragPos;

uniform vec3 uViewPos;
uniform vec3 uLightPos;

uniform Material uMaterial;
uniform PointLight uPointLight;

void main() {
  //  Factor para luz de ambiente
  vec3 ambientColor = uPointLight.ambient * uMaterial.ambient;
  //  Luz difusa
  vec3 norm = normalize(vNormal);
  vec3 lightDir = normalize(uLightPos - vFragPos);
  float diff = max(dot(norm, lightDir), 0.0);
  vec3 diffuseColor = uPointLight.diffuse * uMaterial.diffuse * diff;
  //  Luz especular
  vec3 viewDir = normalize(uViewPos - vFragPos);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
  vec3 specularColor = uPointLight.specular * uMaterial.specular * spec;

  gl_FragColor = vec4(ambientColor + diffuseColor + specularColor, 1.0) * vColor;
}
