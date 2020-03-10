# Creación de usuarios y roles en MongoDB

Las bases de datos son los contenedores principales de las instancias `mongod`. 
Dentro de estas, se almacenan los usuarios y las colecciones. Dentro de las colecciones, se encuentran los datos de las aplicaciones.

---
## Bases de datos y colecciones
Inicialmente veremos que solo existen las bases de datos `admin`, `config` y `local`.

```
fedicom3:PRIMARY> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
```

Con el comando `use <db>` podemos cambiar de una base de datos a otra.
Para crear una base de datos no existe ningún comando explícito, simplemente, por el hecho de crear una colección 
dentro de una base de datos, esta se crea. Así por ejemplo, crearemos la colección 'tx' en la base de datos 'fedicom3'.

```
fedicom3:PRIMARY> use fedicom3
switched to db fedicom3
fedicom3:PRIMARY> db.createCollection('tx')
```


También crearemos una colección "capada" que se limita a un máximo de tamaño (para nuestro caso, 1Gb). 
Esta colección elimina las entradas mas antiguas para no superar nunca este tamaño. también existe la opción de limitar por número de documentos 
(Mas info: [https://docs.mongodb.com/manual/core/capped-collections/](https://docs.mongodb.com/manual/core/capped-collections/)).

```
fedicom3:PRIMARY> db.createCollection('log', { capped : true, size : 1073741824 });
```

---
## Usuarios
Para permitir el acceso desde la aplicación, vamos a crear el usuario 'fedicom3' con plenos permisos sobre la base de datos 'fedicom3', y para que el mismo usuario
pueda acceder a datos básicos de monitorización de la propia bbdd, le daremos el rol `clusterMonitor` sobre la base de datos `admin`.

```
fedicom3:PRIMARY> use fedicom3
switched to db fedicom3
fedicom3:PRIMARY> db.createUser(
    {
        user: "fedicom3",
        pwd: "fedicom3",
        roles: [
            { role: "readWrite", db: "fedicom3" }
            { role: "clusterMonitor", db: "admin" }
        ]
    }
)
```

---
## Roles

Si quisieramos crear usuarios con permisos especificos, deberemos usar roles. 
Por el momento no crearemos ningún rol para la aplicación Fedicom3, pero dejamos esta información por si fuera conveniente en el futuro.

A continuación mostramos un ejemplo de un usuario que solo puede leer de la colección `tx` de la base de datos `fedicom3`:

```
> db.createRole(
    {
        role: "soloLectura",
        privileges: [
            {
                resource: { db: "fedicom3", collection: "tx" },
                actions: [ "find" ]
            },
            {
                resource: { db: "fedicom3", collection: "log" },
                actions: [ "find" ]
            }
        ],
        roles: [ ]
    }
)

> db.createUser(
    {
        user: "usuarioVisor",
        pwd: "12345678",
        roles: [
            { role: "soloLectura", db: "fedicom3" }
        ]
    }
)
```
