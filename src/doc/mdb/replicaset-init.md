# Inicialización del ReplicaSet

Vamos a crear una réplica de los datos de la base de datos. 
Para esto, partimos de las tres instancias de MongoDB configuradas exactamente como hemos explicado en las notas anteriores.

> ¡¡ El fichero `/var/lib/mongo/mongo.key` debe ser exactamente el mismo en todas las instancias !!

Para el sistema productivo, el ReplicaSet estará compuesto por las siguientes máquinas:

```
SANTOMERA:      f3san1
                f3san2
MADRID:         f3mad1
BARCELONA:      f3bcn
```

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

## Configuración incial del ReplicaSet

Nos conectamos a la instancia local de cualquiera de los nodos con el comando `mongo` e inicializamos el ReplicaSet. 
Imaginemos que lo hacemos desde la instancia en `f3san.hefame.es`:

```
> use admin
> db.auth("admin", "password")
> rs.initiate( {
    _id : "fedicom3",
    members: [ { _id : 0, host : "f3san.hefame.es:27017" } ]
})
```

Con esto, ya tenemos el primer nodo de la réplica. 

Veremos en el prompt de la aplicación como aparece el texto `rs0:PRIMARY>` indicándonos que estamos en el nodo primario de la réplica. 
Esto quiere decir que este nodo es el nodo primario, el cual manda sobre el resto de nodos del ReplicaSet. A consecuencia de esto:
> **¡¡ Los nodos que se vayan añadiendo al ReplicaSet sobreescribirán todos sus datos con los datos del nodo primario !!**

---
## Añadir miembros al ReplicaSet

A cada nodo se le puede establecer una prioridad. Por defecto esta prioridad es 1. Para forzar a que el nodo primario sea siempre el nodo de Santomera, le aumentaremos la prioridad a 100.

```
fedicom3:PRIMARY> var cfg = rs.conf();
fedicom3:PRIMARY> cfg.members[0].priority = 100
fedicom3:PRIMARY> rs.reconfig(cfg)
```

Para añadir miembros al ReplicaSet, utilizaremos el método `rs.add()` siempre desde el nodo primario. 
Vamos a añadir el nodo de Madrid como un nodo normal del replicaSet, con prioridad 50.

```
fedicom3:PRIMARY> rs.add( { host: "f3mad.hefame.es:27017", priority: 50 })
```

A continuacion comprobamos el estado del ReplicaSet:

```
fedicom3:PRIMARY> rs.status().members;
[
    {
        "_id" : 0,
        "name" : "f3san.hefame.es:27017",
        "health" : 1,
        "state" : 1,
        "stateStr" : "PRIMARY",
        "syncingTo" : "",
        "syncSourceHost" : "",
        "syncSourceId" : -1,
        "infoMessage" : "",
        "electionTime" : Timestamp(1543403336, 1),
        "electionDate" : ISODate("2018-11-28T11:08:56Z"),
        "configVersion" : 5,
        "lastHeartbeatMessage" : ""
    },
    {
        "_id" : 1,
        "name" : "f3mad.hefame.es:27017",
        "health" : 1,
        "state" : 2,
        "stateStr" : "SECONDARY",
        "pingMs" : NumberLong(12),
        "lastHeartbeatMessage" : "",
        "syncingTo" : "f3san.hefame.es:27017",
        "syncSourceHost" : "f3san.hefame.es:27017",
        "syncSourceId" : 0,
        "infoMessage" : "",
        "configVersion" : 5
    }
]
```

---
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
[
    {
        "_id" : 0,
        "host" : "f3san.hefame.es:27017",
        "arbiterOnly" : false,
        "buildIndexes" : true,
        "hidden" : false,
        "priority" : 100,
        "votes" : 1
    },
    {
        "_id" : 1,
        "host" : "f3mad.hefame.es:27017",
        "arbiterOnly" : false,
        "buildIndexes" : true,
        "hidden" : false,
        "priority" : 50,
        "votes" : 1
    },
    {
        "_id" : 2,
        "host" : "f3bcn.hefame.es:27017",
        "arbiterOnly" : true,
        "buildIndexes" : true,
        "hidden" : false,
        "priority" : 0,
        "votes" : 1
    }
]


