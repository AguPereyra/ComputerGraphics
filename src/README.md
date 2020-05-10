## TP3
En la carpeta de cámaras hay una cámara rotacional y una cámara orbital. Sólo se utiliza la orbital, la
rotacional en realidad está porque la hice al no comprender bien la consigna, y consideré que sería mejor
dejarla que borrarla.

## TP4
TODO:
* Parametrizar AmbientStrength del fragment shader.
* Pasar todo de Model a ViewModel.
* PointLight y AmbientLight deberian recibir la posicion/direccion de la misma forma (no vector/objeto).


## Dudas
1. ¿Está bien usar dos programas para dibujar la luz y el resto de los objetos o hay alguna otra forma de trabajar?
2. ¿Es válido si trabajo desde el model y no desde el view? Si
3. ¿Puedo asumir que material.ambient es igual al color de la superficie del objeto? Ver, puedo hacer ambos.
4. ¿Puedo asumir que para el objeto la luz de ambiente y la difusa son lo mismo?
5. ¿Importa cómo defino las propiedades de las luces para la malla y los ejes? (ejes, shininess,...)
Dibujarlos con el shader de luces, que es mas simple.
6. ¿Está bien si para tener en cuenta la cámara orbital hago uViewMatrix * viewPos en el fs?
7. ¿Y no es muy demandante que para lograr lo de 6 use precisión hihgp en el fs?
8. ¿Qué onda el reflejo trasero? Ver producto punto de spotlight! Probar normales con colores. Dice el profe que algo falta.
9. ¿Cómo uso colores con datGUI? (me falla con objetos y arreglos) Fijate
