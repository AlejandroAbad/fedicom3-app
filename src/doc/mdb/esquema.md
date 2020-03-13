# Introducción a MongoDB

La aplicación Fedicom3 utiliza una base de datos MongoDB para almacenar todos los datos necesarios para garantizar que estos entran en SAP.
Esta base de datos es el sustituyente de las librerías ISAM de Fedicom2, obteniendo varias ventajas en el cambio:

1. Soporte nativo de JSON, lo cual es conveniente teniendo en cuenta que el protocolo Fedicom3 se basa en JSON.
2. Replicación automática de la base de datos, consiguiendo que cada nodo tenga exactamente la misma visión de los datos en cualquier momento, y obteniendo HA en los mismos.
3. Salto a un sistema gestor de BBDD actual, mantenido y que es capaz de escalar.

Aunque MongoDB tiene sistemas para balancear los datos (llamado Sharding), no vamos a utilizarlo por el momento ya que no se prevee una carga que lo exija e instalar un sistema con Sharding implica aumentar el número de nodos de Mongo DB.

Para la aplicación, vamos a montar una única base de datos replicada, mediante lo que se conoce como un ReplicaSet. En un ReplicaSet, hay un nodo PRIMARIO que es quien recibe las ordenes de escritura y las replica al resto de nodos SECUNDARIOS. Adicionalmente puede existir un nodo ARBITRO que no tiene copia de los datos, sino que sirve para evitar split-brain en caso de caída de un nodo.

Los clientes, a la hora de conectarse, deben conocer previamente una lista de servidores a los que conectarse, esto es, no existe una IP virtual ni nada similar.

En la operativa normal, un cliente se conectará a cualquiera de los nodos de su lista y este le indicará cual es el nodo primario al que debe conectarse. Si el nodo primario cae, el resto de los nodos realizarán una votación para elegir quien será el nuevo nodo primario. La elección del nodo primario se hace mediante votación, donde cada nodo tiene un número de votos asignados (1 o 0) y se requiere que haya consenso de mas de la mitad de los votos para la elección. Para determinar de entre los nodos vivos quien debe asumir el rol de primario, se especifica un peso a cada nodo. 

Para nuestra aplicación, montaremos el siguiente escenario:

![Esquema MongoDB](img/replicaset.png)

- Las instancias `F3SAN1`, y `F3MAD1` son las que están pensadas para la alta disponibilidad activa/pasiva, teniendo las instancias de de Santomera las prioridades mas altas a la hora de convertirse en nodos primarios.
- La instancia `F3BCN` está puesta en modo árbitro, por lo que solo está para romper el empate de votos que podría haber entre Santomera y Madrid en caso de que no pudieran comunicarse.
- La instancia `F3SAN2` no tiene votos, por lo tanto, no puede tener peso. Esto es así para mantener el mismo número de votos en cada sede. Esta instancia tendrá copia de los datos y podrá accederse a la misma en modo de solo lectura. En cualquier momento, como veremos en secciones posteriores, podremos variar estos parámetros.
