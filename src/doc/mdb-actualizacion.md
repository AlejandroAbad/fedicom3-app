# Actualización de un nodo MongoDB

Vamos a describir el proceso de actualización de los nodos de MongoDB de la versión 4.0 a la última disponible, la 4.2.

> **IMPORTANTE**. Revisad las guías oficiales de actualización están disponibles en los siguientes enlaces:
> - [Servidores Standalone](https://docs.mongodb.com/manual/release-notes/4.2-upgrade-standalone/)
> - [Servidores en ReplicaSet](https://docs.mongodb.com/manual/release-notes/4.2-upgrade-replica-set/)

---
## Comprobaciones previas de compatibilidad

Asumimos que la version antigua es la 4.0 y corriendo en todos los nodos del ReplicaSet. 
Si esto es así, __el cambio de 4.0 a 4.2 es directo__, de lo contrario, debemos buscar información al respecto.

```
# mongo
MongoDB shell version v4.0.12
MongoDB server version: 4.0.12
```

Comprobamos si hay características antiguas incompatibles con la nueva versión.
Para esto, ejecutamos el siguiente comando en el mongo shell:
```
> db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
    {  "featureCompatibilityVersion" : { "version" : "4.0" } }
```

Si da un valor inferior a `4.0` deberemos buscar información sobre características que
dejan de estar disponibles antes de cambiar este valor. Para cambiarlo ejecutaremos el siguiente comando:

```
> db.adminCommand( { setFeatureCompatibilityVersion: "4.0" } )
```

---
## Configuración de repositorios
También asumimos estará disponible el repositorio de la versión antigua. Deberemos eliminar el repositorio 
antiguo para evitar conflictos durante la actualización:

```
# zypper lr | grep mongo
8 | mongodb-4.0                                                          | mongodb-4.0                                  | Yes     | (r ) Yes  | No

# zypper rr mongodb-4.0
```

Instalaremos el repositorio de la versión 4.2 de la siguiente manera:

```
# rpm --import https://www.mongodb.org/static/pgp/server-4.2.asc
# zypper addrepo --gpgcheck "https://repo.mongodb.com/zypper/suse/12/mongodb-enterprise/4.2/x86_64/" mongodb-4.2
Adding repository 'mongodb-4.2' ..............................................................[done]
Repository 'mongodb-4.2' successfully added

URI         : https://repo.mongodb.com/zypper/suse/12/mongodb-enterprise/4.2/x86_64/
Enabled     : Yes
GPG Check   : Yes
Autorefresh : No
Priority    : 99 (default priority)

Repository priorities are without effect. All enabled repositories share the same priority.
```

---
## Actualización de la base de datos

> **IMPORTANTE** - Comenzaremos por actualizar los nodos SECUNDARIOS y ÁRBITROS.

```
# zypper ref
# zypper update mongodb-enterprise
```

Y tras la actualización, el nodo ya estará corriendo en la versión actualizada:
```
# mongo
MongoDB shell version v4.2.0
MongoDB server version: 4.2.0
```


Cuando ya estén actualizados todos los nodos menos el primario, forzaremos la elección de un 
nuevo nodo primario (convirtiendo el actual nodo primario en un nodo secundario) y acto seguido
procederemos a actualizarlo al igual que el resto.

Para forzar la reelección, ejecturaremos en el mongo shell:

```
MongoDB Enterprise fedicom3:PRIMARY> rs.stepDown()
MongoDB Enterprise fedicom3:SECONDARY> 
```

---
## Activación de características 4.2

En este momento, estaremos ejecutando los binarios de la versión 4.2, pero con las características de la 4.0.
Cuando estemos seguros de que no necesitamos características de la version 4.0, ejecutaremos el siguiente
comando en el nodo primario:

```
> db.adminCommand( { setFeatureCompatibilityVersion: "4.2" } )
```

La lista de cambios en la 4.2 está disponible en [este enlace](https://docs.mongodb.com/manual/release-notes/4.2-compatibility).

