# Inicialización del ReplicaSet

Vamos a crear una réplica de los datos de la base de datos. 
Para esto, partimos de al menos dos de las instancias de MongoDB configuradas exactamente como hemos explicado en las notas anteriores.

> ¡¡ El fichero `/var/lib/mongo/mongo.key` debe ser exactamente el mismo en todas las instancias !!

Como vimos en la introducción a MongoDB, desplegaremos 4 instancias MongoDB formando un ReplicaSet, tal que:

![Esquema MongoDB](img/replicaset.png)

---
#### Configuración previa de los nodos

Para cada uno de los nodos que vayan a conformar el clúster, es preciso que el su fichero `/etc/mongod.conf` se 
especifique la siguiente configuración de réplica (igual en todos los nodos):

```
replication:
    replSetName: "fedicom3"
```

Donde `fedicom3` es el nombre del ReplicaSet. _(En el caso de desarrollo, el replicaset se llama `fedicom3-dev`)_

Hay que reiniciar el servicio mongod para que tome los cambios.

## Configuración **incial** del ReplicaSet

Nos conectamos a la instancia local de cualquiera de los nodos con el comando `mongo` e inicializamos el ReplicaSet. 
Imaginemos que lo hacemos desde la instancia en `f3san1.hefame.es`:

```
> use admin
> db.auth("admin", "password")
> rs.initiate( {
    _id : "fedicom3",
    members: [ { _id : 0, host : "f3san1.hefame.es:27017" } ]
})
```

Con esto, ya tenemos el primer nodo de la réplica. 

Veremos en el prompt de la aplicación como aparece el texto `rs0:PRIMARY>` indicándonos que estamos en el nodo primario de la réplica. 
Esto quiere decir que este nodo es el nodo primario, el cual manda sobre el resto de nodos del ReplicaSet. A consecuencia de esto:
> **¡¡ Los nodos que se vayan añadiendo al ReplicaSet sobreescribirán todos sus datos con los datos del nodo primario !!**

---
## Añadir miembros al ReplicaSet

Para añadir miembros al ReplicaSet, utilizaremos el método `rs.add()` siempre desde el nodo primario. 
Vamos a añadir el nodo de Madrid como un nodo normal del replicaSet, con prioridad 50.

```
fedicom3:PRIMARY> rs.add( { host: "f3mad.hefame.es:27017", priority: 50 })
```

A continuacion comprobamos el estado del ReplicaSet:

```
fedicom3:PRIMARY> rs.status().members;
...
    {
        "_id" : 0,
        "name" : "f3san1.hefame.es:27017",
        "stateStr" : "PRIMARY",
        ...
    },
    {
        "_id" : 1,
        "name" : "f3mad1.hefame.es:27017",
        "stateStr" : "SECONDARY",
        ...
    }
```


## Añadimos un árbitro al ReplicaSet

Para evitar casos de split-brain, es necesario añadir un tercer miembro al ReplicaSet. 
Se puede añadir un miembro normal, tal y como hicimos con el nodo de Madrid, sin embargo, para Barcelona vamos a añadir el nodo como árbitro, 
de modo que actúa como un miembro más cuando se hace la elección del nodo primario, pero no guarda una copia de los datos del ReplicaSet.

```
fedicom3:PRIMARY> rs.addArb("f3bcn.hefame.es:27017")
```

Podemos ver como queda la configuración de los miembros de la réplica:

```
fedicom3:PRIMARY> rs.conf().members
...
    {
        "_id" : 2,
        "host" : "f3bcn.hefame.es:27017",
        "arbiterOnly" : true,
        "priority" : 0,
        "votes" : 1,
        ...
    }

```

## Cambiando la configuración 

Podemos cambiar los pesos y votos de los nodos del ReplicaSet en caliente.

Comenzaremos por copiar la configuración del ReplicaSet a una variable en el Mongo Shell:

```
fedicom3:PRIMARY> var cfg = rs.conf();
```

A continuación, realizamos los cambios que queramos sobre la variable `cfg`. Para esto, modificaremos los datos de la variable `cfg.members[#]`, donde `#` es el número del nodo que queremos cambiar. Los nodos se muestran en orden si escribimos `cfg.members` en cualquier momento.

- Para forzar a que el nodo primario sea siempre que se a posible `F3SAN1`, le aumentaremos la prioridad a 100 (por defecto es 1):


```
fedicom3:PRIMARY> cfg.members[0].priority = 100
```

- Para que el nodo de madrid sea la segunda opción a la hora de elegir un nodo primario, le pondremos una prioridad de 50:

```
fedicom3:PRIMARY> cfg.members[1].priority = 50
```

- Para quitarle el derecho a voto a la instancia en `F3SAN2`, tenemos que ponerle tanto la prioridad como los votos a 0:

```
fedicom3:PRIMARY> cfg.members[2].votes = 0
fedicom3:PRIMARY> cfg.members[2].priority = 0
```

Finalmente, con todos los cambios realizados sobre la variable `cfg`, los aplicamos en el ReplicaSet:

```
fedicom3:PRIMARY> rs.reconfig(rs)
```

Existen algunas restricciones que deben cumplirse, o el comando `reconfig` nos tirará para atrás el cambio:

- Los nodos árbitro, obligatoriamente tendran votes = 1 y priority = 0.
- Un nodo con votes = 0, tiene que tener priority = 0.
- No puede haber mas de 7 miembros del ReplicaSet con derecho a voto.