# Instalación de un nodo MongoDB

Vamos a instalar mongo enterprise en la versión 4.2 (la última a 30/sept/2019)

[Fuente](https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-suse/)

Para tener acceso a los binarios de MongoDB 4.2, debemos instalar los repositorios para esta versión:

```
rpm --import https://www.mongodb.org/static/pgp/server-4.2.asc
zypper addrepo --gpgcheck "https://repo.mongodb.com/zypper/suse/12/mongodb-enterprise/4.2/x86_64/" mongodb-4.0
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
Editamos el fichero de configuración `/etc/mongod.conf` para realizar los siguientes cambios:

1. Que el servicio escuche en todas las interfaces, cambiando el parámetro net.bindIp para que escuche en 0.0.0.0.
2. Crearemos una clave de cifrado para almacenar los datos de autenticación de los usuarios de la bbdd (posteriormente, este fichero también será usado para la comunicación entre las distintas réplicas de la base de datos). 
Para esto, generaremos un fichero `/var/lib/mongo/mongo.key` con una clave de 1024 bits, y en el fichero de configuración de Mongo estableceremos el parámetro `security.keyFile` para que apunte al mismo. Para generar el fichero haremos lo siguiente:

    ```
    openssl rand -base64 756 > /var/lib/mongo/mongo.key
    chmod 400 /var/lib/mongo/mongo.key
    chown mongod:mongod /var/lib/mongo/mongo.key
    ```

3. Por último, creamos un usuario `admin` en la base de datos del mismo nombre, con rol de administrador.
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

Al crear este usuario, se considera que todo acceso a la base de datos debe autenticarse, por lo que el warning que nos daba inicialmente desaparecerá tras esta acción. Por tanto, a partir de este punto, para poder realizar acciones de administración deberemos autenticarnos. Nótese, que los usuarios van ligados a una base de datos, por lo que para autenticarnos con los mismos, deberemos estar en dicha base de datos. Usamos el comando `use <db>` para cambiar de una base de datos a otra. Por tanto, para autenticarnos con el usuario `admin` de la base de datos  `admin` haremos lo siguiente:

```
> use admin
> db.auth("admin", "password")
```

Como este usuario tiene el rol `root` de la base de datos `admin`, se considera un superusuario para toda la instancia `mongos`.



