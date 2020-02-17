# Preparativos para despleguar la aplicación
Para el correcto despliegue y funcionamiento del concentrador, es preciso que el sistema 
disponga de la configuración que se detalla a continuación. Nótese que esta configuración
es opcional y no es crítica para el funcionamiento de la aplicación, pero es recomendable
seguir estos pasos para garantizar que no se deriven problemas.

---
## Instalación de paquetes necesarios

* ### GIT
Para poder descargar el código de la aplicación es necesario tener instalado el cliente de GIT.

    ````
    # zypper install git-core
    ````

* ### NodeJS v10
NodeJS es el interprete del código de la aplicación de Fedicom3. Es necesario registrar la máquina SUSE con la extensión para Web Scripting

    ```
    # SUSEConnect -p sle-module-web-scripting/12/x86_64
    # zypper install nodejs10 nodejs10-devel
    ```


* ### Memcached _(opcional)_
La aplicación utiliza memcached, un demonio de caché in-memory para compartir datos entre los distintos procesos de la aplicación.
Estos datos son de caracter estadístico, y la aplicación es capaz de funcionar correctamente sin este servicio.

    ```
    zypper install memcached
    systemctl start memcached.service
    ```

    Podemos configurar el arranque de este servicio en el fichero `/etc/sysconfig/memcached`, aunque en principio la configuración por defecto es válida.
    Memcached arranca escuchando solo peticiones locales en el puerto 11211:

    ```
    tcp        0      0 127.0.0.1:11211         0.0.0.0:*               LISTEN      1323/memcached
    ```

---
## Usuarios y grupos

Solo necesitaremos crear el usuario `fedicom3`, que es quien ejecuta todas las aplicaciones del ecosistema fedicom3:

```
# useradd -u 1100 -U -m fedicom3
```

---
## Directorios

* ### Process ID
Como veremos más adelante, los servicios Fedicom3 guardan su PID de ejecución en un directorio que es configurable. 
Recomendamos que se establezca al directorio estándar de los sistemas Linux `/var/run/fedicom3`.

    Para esto, deberemos crear el directorio y haberle dado los permisos adecuados:

    ```
    # mkdir -p /var/run/fedicom3
    # chown fedicom3:users /var/run/fedicom3
    # chmod 700 /var/run/fedicom3
    ```

* ### SQLite
También es necesario que creemos el directorio donde se almacenará la base de datos auxiliar (SQLite). 
Este directorio se puede definir en la configuración del servicio, pero deberá existir.
Asumimos que el fichero será `/home/fedicom3/db/sqlite.db`. En tal caso:

    ```
    # su - fedicom3
    $ mkdir -p /home/fedicom3/db/
    $ chmod 700 /home/fedicom3/db/
    ```

---
## Certificados digitales

Para poder funcionar con HTTPS, es necesario disponer de un certificado digital y su clave asociada. La ubicación de estos ficheros se puede definir en la configuración del servicio.
Recomentamos enormemente que estos ficheros estén en un directorio distinto del que contiene los ejecutables del servicio.
Asumimos que el directorio será `/home/fedicom3/ssl/` y que hemos depositado en este los ficheros `server.crt` y `server.key`. En tal caso:

```
# su - fedicom3
$ mkdir -p /home/fedicom3/ssl/
$ chmod 700 /home/fedicom3/ssl/
$ chmod 600 /home/fedicom3/ssl/*
```



