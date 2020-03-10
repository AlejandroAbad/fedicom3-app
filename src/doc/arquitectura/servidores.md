# Arquitectura del sistema Fedicom3

El objetivo de la arquitectura de servidores diseñada es el de ofrecer un sistema de recepción de transmisiones del protocolo Fedicom 3 que sea resistente a fallos de sistema (red, disco, aplicativos, etc ...) y ataques externos, y garantize que las transmisiones de los clientes son almacenadas para poder recuperarlas en caso de necesitarlo. 

Para lograr estos objetivos, la arquitectura contará una serie de servidores **Linux SLES 12** repartidos en ubicaciones separadas dentro de la red HEFAME. El esquema de la siguiente imagen muestra a rasgos generales como se distribuyen estos servidores en 2 grupos.

![Diagrama de componentes de un balanceador de carga](/img/diagrama-general-maquinas.png)

## Tipificación de servidores
Los servidores se dividen en 2 tipos según la funionalidad que vayan a realizar: 


### Balanceador de carga
Los balanceadores de carga son los servidores que están publicados directamente en internet y reciben las peticiones de los clientes.
Estas máquinas cumplen dos funciones para toda la infraestructura Fedicom 3:

1. Se encargan de **balancear la carga** de las transmisiones entre los distintos conentradores Fedicom 3. Además, el servicio de balanceo utilizado (`Apache2`) es capaz de detectar si un concentrador no está respondiendo y sacarlo del grupo de balanceo.
2. Se encargan de la **seguridad**: Cuentan con un cortafuegos `SUSE Firewalld` que solo permite el tráfico HTTP entrante, y el balanceador de carga se encarga de filtrar todas las peticiones que no vayan dirigidas a una ruta válida Fedicom 3.


Adicionalmente, los balanceadores cuentan con un demonio `Keepalived` que implementa el protocolo VRRP. Esto nos permite tener varios balanceadores funcionando en alta disponibilidad dentro de una misma ubicación, como veremos en el capítulo dedicado a este tema.

![Diagrama de componentes de un balanceador de carga](/img/diagrama-balanceador.png)

### Concentrador Fedicom3
Los concentradores son las máquinas que correran la aplicación del concentrador Fedicom 3 para el tratamiento de transmisiones de los clientes.
Estas máquinas son las encargadas de recepcionar las peticiones de los clientes (a través de los concentradores de carga), para, por un lado, almacenarlas en una base de datos distribuida entre todos los concentradores para poder recuperarlas en el caso de ser necesario, y por otro lado, tratarlas debidamente, llamando a la interfaces de SAP pertinentes para el tratamiento de las mismas.

A modo de resumen, el software que corre en un concentrador es:
- Aplicación Fedicom 3, implementada en NodeJS.
- Instancia MongoDB para el almacenamiento persistente de las transmisiones de los clientes.
- Un servidor Apache que hará de pasarela entre la aplicación Fedicom 3 y SAP, haciendo las funciones de balanceo.

![Diagrama de componentes de un concentrador](/img/diagrama-concentrador.png)




## Despliegue de servidores

En la implementación de la arquitectura, vamos a utilizar 3 sedes de Hefame: **Santomera**, **Madrid** y **Barcelona**.

#### Santomera
Esta sede dispondrá de los siguientes elementos:
- **Una pareja de balanceadores**: `f3san1-fw` y `f3san2-fw`. Estarán en alta disponibilidad (activo/pasivo mediante VRRP)
- **Una pareja de concentradores** : `f3san1` y `f3san2`. Todos los balanceadores de esta y otras sedes están activos. Es mediante el balanceo HTTP que se realiza la alta disponibilidad entre todos los conentradores disponibles del sistema (¡ Sin importar en que sede estén !)

#### Madrid
Esta sede dispondrá de los siguientes elementos:
- **Un balanceador**: `f3mad1-fw`. Estará en alta disponibilidad (activo/pasivo por propagación de tablas de enrutamiento en la red VODAFONE)
- **Un concentrador**: `f3mad1`.

#### Barcelona
Esta sede dispondrá de los siguientes elementos:
- **Un concentrador**: `f3bcn1`. Como veremos más adelante, este conentrador se despliega principalmente con el propósito de actuar como árbitro para el sistema de base de datos distribuido.


La foto de la arquitectura con los servidores definidos es la siguiente: 
![Diagrama general de servidores](/img/diagrama-general-servidores.png)
