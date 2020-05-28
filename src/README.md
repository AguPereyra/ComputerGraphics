## TP3
En la carpeta de cámaras hay una cámara rotacional y una cámara orbital. Sólo se utiliza la orbital, la
rotacional en realidad está porque la hice al no comprender bien la consigna, y consideré que sería mejor
dejarla que borrarla.

## TP4

Trabajo de luces. La cámara de perspectiva permite rotaciones con roll, yaw y pitch, pero la cámara ortográfica no.

Las luces adquieren el color que esté indicado por la componente de ambiente.

## TP5
1. El sampler2d deberia ir para material.diffuse y material.specular? En ese caso, usamos el mismo?
2. Usar distintas texturas para ambient y para diffuse. (modificar renderer)
3. No se pueden cargar imagenes sin tener que usar el path relativo hardcodeado en el renderer?
4. Picking: no va a funcionar si cambiamos de camara, porque la funcion de click esta definida fuera del main. 
5. Picking: Ver de hacer que para el clearColor se indique un mensaje distinto al id.
6. Light: Hacer que cada objeto tenga su color propio tambien.
7. Esta bien si dejo que ambient sea un color? (Para seguir el video)