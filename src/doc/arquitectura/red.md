# Arquitectura de red

En esta sección vamos a detallar la arquitectura de red utilizada para la comunicación entre servidores.

## Diagrama general de red

A un nivel alto de abstracción, este es el esquema de red que tendrá la infraestructura.

![Diagrama general de la red](/img/diagrama-general-red.png)

En el se muestra como quedarían repartidos los grupos de balanceadores y concentradores Fedicom3 en las distintas sedes de Hefame, y las rede que estos utilizarán para comunican entre sí, con los clientes y con los servidores SAP.


### Red Vodafone

La red Vodafone es la que permite que los clientes sean capaces de llegar a la red de servidores Fedicom 3.
Los balanceadores de carga se conectan directamente a esta red y todos tendrán, de una manera u otra, configurada la misma IP, que es en concreto la IP de de acceso al servicio `185.103.124.150/22`.

Como detallaremos en próximos capítulos, configuraremos una serie de mecanismos para permitir que todos los balanceadores tengan la misma IP sin que esto provoque mal funcionamiento de la red IP. En concreto, usaremos 2 mecanismos:
- Para la gestión de la IP entre las máquinas de una misma sede, como es el caso de Santomera, utilizaremos un servicio que implementa VRRP (*Virtual Router Redundancy Protocol*). Este servicio utiliza los mecanismos a nivel de enlace de la red para, mediante el uso de paquetes `ARP` y el direccionamiento multicast, determinar el estado de salud de los balanceadores conectados al mismo enlace de red, y levantar la IP en el que convenga.
- Para la gestión de la IP entre máquinas de distintas sedes, lo que se hará en realidad será activar la misma IP en ambas sedes, pero solicitar la configuración de los routers de VODAFONE para que la IP se anuncie en ambas ubicaciones con distinto peso.


![Diagrama de conexiones en la red VODAFONE](/img/diagrama-red-vodafone.png)


### Red Intersap 1: Santomera

### Red Intersap 2: Madrid




### LAN Hefame
