precision highp float;

#define NR_POINT_LIGHTS 2

// Material Struct
struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;

  float shininess;
};
//  PointLight Struct
struct PointLight {
  bool active;

  vec3 position;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;

  float constant;
  float linear;
  float quadratic;
};
//  DirectionLight Struct
struct DirectionLight {
  bool active;

  vec3 direction;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};
//  SpotLight Struct
struct SpotLight {
  bool active;

  vec3 position;
  vec3 spotDirection;
  //  Cosenos de los angulos, no
  //  los angulos en si, para ahorrar calculo.
  float innerCutOff;
  float outerCutOff;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;

  float constant;
  float linear;
  float quadratic;
};

varying vec3 vNormal;
varying vec3 vFragPos;

uniform vec3 uViewPos;

uniform Material uMaterial;
uniform DirectionLight uDirLight;
uniform PointLight uPointLight[NR_POINT_LIGHTS];
uniform SpotLight uSpotLight;

//  Usamos la view Matrix para que
//  al orbitar la camara con yaw,
//  pitch y roll se vean los efectos
//  en la viewPos
uniform mat4 uViewMatrix;

//  Funciones para calculo de luces
vec3 getDirLight(vec3 normal, vec3 viewDir);
vec3 getPointLight(PointLight light, vec3 normal, vec3 viewDir);
vec3 getSpotLight(SpotLight light, vec3 normal, vec3 viewDir);

void main() {
  vec3 result = vec3(0.0);
  vec3 normal = normalize(vNormal);

  vec3 finalViewPos = mat3(uViewMatrix) * uViewPos;
  vec3 viewDir = normalize(finalViewPos - vFragPos);

  //  Luz direccional
  if (uDirLight.active) {
    result += getDirLight(normal, viewDir);
  }

  //  Luces posicionales
  for (int i = 0; i < NR_POINT_LIGHTS; i++) {
    //  Solo si luz activa
    if (uPointLight[i].active) {
      result += getPointLight(uPointLight[i], normal, viewDir);
    }
  }

  // Luces de foco
  if (uSpotLight.active) {
    result += getSpotLight(uSpotLight, normal, viewDir);
  }

  gl_FragColor = vec4(result, 1.0);
  //gl_FragColor = vec4(normal, 1.0);
}

vec3 getDirLight(vec3 normal, vec3 viewDir) {
  vec3 lightDir = normalize(-uDirLight.direction);
  //  Factor para luz de ambiente
  vec3 ambientColor = uDirLight.ambient * uMaterial.ambient;
  //  Luz difusa
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuseColor = uDirLight.diffuse * uMaterial.diffuse * diff;
  //  Luz especular
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
  vec3 specularColor = uDirLight.specular * uMaterial.specular * spec;

  return (ambientColor + diffuseColor + specularColor);
}

vec3 getPointLight(PointLight light, vec3 normal, vec3 viewDir) {
  vec3 lightDir = normalize(light.position - vFragPos);
  //  Factor para luz de ambiente
  vec3 ambientColor = light.ambient * uMaterial.ambient;
  //  Luz difusa
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuseColor = light.diffuse * uMaterial.diffuse * diff;
  //  Luz especular
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
  vec3 specularColor = light.specular * uMaterial.specular * spec;

  //  Calculo de atenuacion
  float distance = length(light.position - vFragPos);
  float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

  //  Genramos atenuacion
  ambientColor *= attenuation;
  diffuseColor *= attenuation;
  specularColor *= attenuation;

  return (ambientColor + diffuseColor + specularColor);
}

vec3 getSpotLight(SpotLight light, vec3 normal, vec3 viewDir) {
  vec3 lightDir = normalize(light.position - vFragPos);

  //  Calculo de luz para conos externo e interno
  float theta = dot(lightDir, normalize(-light.spotDirection));
  float epsilon = light.innerCutOff - light.outerCutOff;
  float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);

  //  Factor para luz de ambiente
  vec3 ambientColor = light.ambient * uMaterial.ambient;
  //  Luz difusa
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuseColor = light.diffuse * uMaterial.diffuse * diff;
  //  Luz especular
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
  vec3 specularColor = light.specular * uMaterial.specular * spec;

  //  Calculo de atenuacion
  float distance = length(light.position - vFragPos);
  float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

  //  Genramos atenuacion
  ambientColor *= attenuation * intensity;
  diffuseColor *= attenuation * intensity;
  specularColor *= attenuation * intensity;

  return (ambientColor + diffuseColor + specularColor);
}
