# Instalación de un nodo MongoDB

Vamos a instalar mongo enterprise en la versión 4.2 (la última a 09 de marzo de 2020)

> Para obterner información adicional, puedes seguir [Enlace al manual oficial de instalación en SUSE Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-suse/)

Para tener acceso a los binarios de MongoDB 4.2, debemos instalar los repositorios para esta versión:

```
rpm --import https://www.mongodb.org/static/pgp/server-4.2.asc
zypper addrepo --gpgcheck "https://repo.mongodb.com/zypper/suse/12/mongodb-enterprise/4.2/x86_64/" mongodb-4.2
```

Ya podemos instalar el servicio de mongod con zypper.

```
# zypper install mongodb-enterprise
( . . . )
The following 5 NEW packages are going to be installed:
  mongodb-enterprise mongodb-enterprise-mongos mongodb-enterprise-server mongodb-enterprise-shell mongodb-enterprise-tools
```

Una vez instalado, lo configuramos para que el servicio arranque con el servidor:

```
chkconfig mongod on
systemctl enable mongod
```

Y ya podemos arrancar y parar la base de datos con systemctl

```
systemctl start/stop/status mongod
```

Podemos comprobar que el servicio está arrancado en el log `/var/log/mongodb/mongod.log`. 
Únicamente deberemos ver un WARNING, indicando que el control de acceso esta deshabilitado, lo cual es normal en una instalación desde cero como la que acabamos de hacer:

```
I CONTROL  [initandlisten]
I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
I CONTROL  [initandlisten]
I NETWORK  [thread1] waiting for connections on port 27017
```

---
## Tareas post-instalacion

#### Creación de clave de interconexión

> **Nota:** Si este **NO es el primer servidor** que configuramos para el ReplicaSet, la clave ya la habremos generado en el primer servidor. Simplemente tenemos que copiar el fichero `/var/lib/mongo/mongo.key` del primer servidor en este servidor **respetando los permisos y propietario del fichero**. De lo contrario:

Por defecto, la instancia MongoDB no cifra las claves de los usuiario. Al crear el fichero `/var/lib/mongo/mongo.key` con una clave de cifrado, la instancia la usará automáticamente para almacenar los datos de autenticación de los usuarios de la bbdd y para securizar la comunicación entre las distintas réplicas de la base de datos. Para generar el fichero `/var/lib/mongo/mongo.key` con una clave de 1024 bits, haremos lo siguiente:

    ```
    openssl rand -base64 756 > /var/lib/mongo/mongo.key
    chmod 400 /var/lib/mongo/mongo.key
    chown mongod:mongod /var/lib/mongo/mongo.key
    ```



#### Configuración del servicio

Editamos el fichero de configuración `/etc/mongod.conf` para realizar los siguientes cambios:

1. Que el servicio escuche en todas las interfaces, cambiando el parámetro net.bindIp para que escuche en 0.0.0.0.
1. Indicaremos a la instancia de Mongo que use el fichero `/var/lib/mongo/mongo.key` estableciendo el parámetro `security.keyFile`.
1. Creamos un usuario `admin` en la base de datos del mismo nombre, con rol de administrador.
Para conectarnos a la consola de mongodb, usamos el comando mongo.

    ```
    # mongo
    > use admin
    > db.createUser( {
        user: "admin",
        pwd: "password",
        roles: [ { role: "root", db: "admin" } ]
    });
    ```

Al crear este usuario, se considera que todo acceso a la base de datos debe autenticarse, por lo que el warning que nos daba inicialmente desaparecerá tras esta acción. Por tanto, a partir de este punto, para poder realizar acciones de administración deberemos autenticarnos. Nótese, que los usuarios van ligados a una base de datos, por lo que para autenticarnos con los mismos, deberemos estar en dicha base de datos. Usamos el comando `use <db>` para cambiar de una base de datos a otra. Por tanto, para autenticarnos con el usuario `admin` de la base de datos `admin` haremos lo siguiente:

```
> use admin
> db.auth("admin", "password")
```

Como este usuario tiene el rol `root` de la base de datos `admin`, se considera un superusuario para toda la instancia `mongos`.


#### Rotación de logs de MongoDB

MongoDB va dejando un log en `/var/log/mongodb/mongod.log`. Este log va llenandose hasta el infinito si no se controla.

Una de las maneras que tiene MongoDB para indicarle al proceso de que debe rotar el log es mandándole la señal `SIGUSR1` al mismo.
Esto hace que el antiguo fichero `mongod.log` se renombre con la forma `mongod.log.yyyy-mm-ssThh:MM:ss`, y se genere un nuevo `mongod.log` vacío.
La documentación detallada de la rotación de logs en MongoDB se explica [aquí](https://docs.mongodb.com/manual/tutorial/rotate-log-files/).

Para lograr la rotación diaria de los logs, hemos creado un script en `/usr/local/bin/mongod-logrotate` que provoca la rotación de log
en el proceso mongod, lo comprime y elimina los anteriores a 30 días.

```
#!/bin/sh

PIDFILE=/var/run/mongodb/mongod.pid
LOGDIR=/var/log/mongodb

# Indicamos al proceso de mongod que realize la rotacion del log
kill -10 $(cat $PIDFILE) 2>/dev/null

# Comprimimos todos los ficheros de log no comprimidos, excluyendo el actual "mongod.log"
find $LOGDIR -name "mongod.log.*" -and ! -name "*.gz" -exec gzip {} \;

# Eliminamos los anteriores a 30 dias
find $LOGDIR -name "mongod.log.*.gz" -mtime +30 -exec rm -f {} \;
```

Este script se ejecutará a diario en cada instancia de MongoDB a las 4 de la madrugada mediante el `crontab` del usuario `root`.

```
# Rotación de logs de MongoDB
00 04 * * * /usr/local/bin/mongod-logrotate >/dev/null 2>/dev/null
```




## Siguientes pasos:
> - [Inclusión del nodo en el RéplicaSet]($DOC$/mdb/replicaset-init)
- [Creación de usuarios]($DOC$/mdb/users)
- [Creación de índices]($DOC$/mdb/indices)