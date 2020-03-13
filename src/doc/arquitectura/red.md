# Arquitectura de red

En esta sección vamos a detallar la arquitectura de red utilizada para la comunicación entre servidores.

## Diagrama general de red

A un nivel alto de abstracción, este es el esquema de red que tendrá la infraestructura.

![Diagrama general de la red](/img/diagrama-general-red.png)

En el se muestra como quedarían repartidos los grupos de balanceadores y concentradores Fedicom3 en las distintas sedes de Hefame, y las rede que estos utilizarán para comunican entre sí, con los clientes y con los servidores SAP.


### Red VODAFONE

La red VODAFONE es la que permite que los clientes sean capaces de llegar a la red de servidores Fedicom 3.
Los balanceadores de carga se conectan directamente a esta red y todos tendrán, de una manera u otra, configurada la misma IP, que es en concreto la IP de de acceso al servicio `185.103.124.150/22`.

Como detallaremos en próximos capítulos, configuraremos una serie de mecanismos para permitir que todos los balanceadores tengan la misma IP sin que esto provoque mal funcionamiento de la red IP. En concreto, usaremos 2 mecanismos:
- Para la gestión de la IP entre las máquinas de una misma sede, como es el caso de Santomera, utilizaremos un servicio que implementa VRRP (*Virtual Router Redundancy Protocol*). Este servicio utiliza los mecanismos a nivel de enlace de la red para, mediante el uso de paquetes `ARP` y el direccionamiento multicast, determinar el estado de salud de los balanceadores conectados al mismo enlace de red, y levantar la IP en el que convenga.
- Para la gestión de la IP entre máquinas de distintas sedes, lo que se hará en realidad será activar la misma IP en ambas sedes, pero solicitar la configuración de los routers de VODAFONE para que la IP se anuncie en ambas ubicaciones con distinto peso.


![Diagrama de conexiones en la red VODAFONE](/img/diagrama-red-vodafone.png)


### Redes INTERFEDI

Las reded INTERFEDI son las que interconectan a los distintos balanceadores y conentradores del sistema.
Cuando los balanceadores reciben peticiones de los clientes, estos balancean las peticiones entre los distintos balanceadores a través de estas redes.

Por restricciones de la WAN entre almacenes de HEFAME, no es posible propagar una VLAN entre distintos almacenes, por lo que hay que separar las redes INTERFEDI en distintas subredes. En concreto, vamos a utilizar redes con máscara /28 en el rango 192.168.10.X.

<center>

| Sede      | Dirección de red | Rango usable para Fedicom3    | Puerta enlace | Broadcast     |
| --------- | ---------------- | ----------------------------- | ------------- | ------------- |
| Santomera | 192.168.10.0/22  | 192.168.10.1 - 192.168.10.13  | 192.168.10.14 | 192.168.10.15 |
| Madrid    | 192.168.10.16/22 | 192.168.10.17 - 192.168.10.29 | 192.168.10.30 | 192.168.10.31 |

</center>


![Diagrama de conexiones en las redes INTERFEDI](/img/diagrama-red-interfedi.png)



### LAN Hefame

La LAN Hefame, en el rango `172.30.0.0/16`, permite la interconexión de máquinas entre las distintas sedes de manera interna.

A través de esta red los concentradores son capaces de alcanzar a los distintos servidores SAP.

![Diagrama de conexiones en las red HEFAME](/img/diagrama-red-hefame.png)
