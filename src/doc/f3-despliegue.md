# Despliegue de aplicación

---
## Instalación inicial

cDescarga del código fuente e instalación inicial
Nos logeamos con el usuario "fedicom3" y hacemos la primera descarga del código fuente desde el repositorio. 
Este repositorio contiene el código de las aplicaciones CORE y WATCHDOG en conjunto, ya que ambas comparten gran cantidad de código y librerías.

```
# su - fedicom3
~$ git clone https://github.com/AlejandroAbad/fedicom3-core.git
```

Esto nos crea en la carpeta `fedicom-core` el codigo fuente de la aplicación.

> **Extra**: Si queremos que la máquina recuerde nuestra password de GIT, ejecutaremos este comando, y la siguiente vez que nos pida contraseña la almacenará en caché local.
    ```
    ~$ git config --global credential.helper cache
    ```

Para instalar las dependencias necesarias:

```
~$ cd fedicom3-core
~/fedicom3-core$ npm install
```


---
## Actualización de la aplicación

Cuando realizamos cambios en el código fuente de la aplicación y ya los hemos subido al repositorio, es fácil aplicar los cambios a producción, solo tenemos que hacer un pull del repositorio. Para esto:

```
# su - fedicom3
~$ cd fedicom3-core
~/fedicom3-core$ git pull
Already up-to-date.
```

Para actualizar las dependencias de la aplicación, bastará con ejecutar:

```
# su - fedicom3
~$ cd fedicom3-core
~/fedicom3-core$ npm update
```






