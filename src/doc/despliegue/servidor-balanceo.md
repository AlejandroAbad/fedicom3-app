# Despliegue de un balanceador



## Filesystems
Aparte de los filesystems habituales de los sistemas Linux, un balanceador no necesita nada más.


## Interfaces de red
Como ya vimos en el capítulo de [arquitectura de red]($DOC$/arquitectura/red), un balanceador cuenta con dos interfaces de red.
Configuraremos las interfaces tal que:
- `eth0`: Interfaz conectada a la red INTERFEDI de la sede donde se encuentre el servidor *(Por ejemplo, en Santomera: 192.168.10.0/28)*. 
- `eth1`: Interfaz conectada a la red VODAFONE. La configuración específica de este interzaz depende de si el balanceador va a actuar en solitario (como el de Madrid) o si va a ser parte de un clúster VRRP con otros balanceadores (como en Santomera). 

#### Confguración sin VRRP
El servidor tendrá establecida en el interfaz `eth1` la dirección IP de acceso publica del servicio Fedicom, esto es: la `185.103.124.150/22`.

El servidor tendrá como gateway por defecto el gateway de la red VODAFONE donde esté conectado, que es el `185.103.127.254` y tendrá rutas establecidas para alcanzar al resto de redes INTERSAP. Por ejemplo en Madrid:

```
# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         185.103.127.254 0.0.0.0         UG    0      0        0 eth1
185.103.124.0   0.0.0.0         255.255.252.0   U     0      0        0 eth1
192.168.10.16  0.0.0.0         255.255.240.0   U     0      0        0 eth0
192.168.10.0   192.168.10.30  255.255.240.0   U     0      0        0 eth0 # Acceso a la red 192.168.10.0/28 por el GW de la red 192.168.10.16/28
```

#### Configuración con VRRP
Si el servidor de balanceo va a ejecutar el protocolo VRRP para dar alta disponibilidad con otros balanceadores de la misma sede, el interfaz de acceso a la red VODAFONE, el `eth1` deberá dejarse configurado **sin dirección IP**.

El servidor tampoco tendrá un gateway por defecto, solamente tendrá rutas establecidas para alcanzar al resto de redes INTERSAP. Por ejemplo en Santomera:

```
# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
192.168.10.0   0.0.0.0         255.255.240.0   U     0      0        0 eth0
192.168.10.16  192.168.10.14  255.255.240.0   U     0      0        0 eth0 # Acceso a la red 192.168.10.16/28 por el GW de la red 192.168.10./28
```

> **Aclaración**: La configuración del interfaz `eth1` la administra el demonio *Keepalived* de manera dinámica, en función de si el servidor es o no es el nodo activo en la red.


### DNS y NTP

Los balanceadores usaran los DNS públicos de google: `8.8.8.8` y `8.8.4.4`.

Para mantener la hora del servidor, configuraremos el servidor NTP `es.pool.ntp.org`.



## Cortafuegos
Configuraremos el cortafuegos del servidor para proteger el acceso desde el interfaz de la red de VODAFONE. Esto es, protegeremos el servidor del tráfico proviniente del interfaz `eth1`.


```
Yast > System > Security and Users > Firewall
```

En `Start-Up`:

```
    Marcamos la "Enable Firewall Automatic Starting"
```

En `Interfaces`:

```
Device                      │ Interface or String │ Configured In
VMXNET3 Ethernet Controller │ eth0                │ Internal Zone
VMXNET3 Ethernet Controller │ eth1                │ External Zone
```

En `Allowed Services`, para la zona `External Zone`, habilitaremos los servicios HTTP y HTTPS:

```
Allowed Service │ Description                          
HTTP Server     │ Opens ports for Apache Web Server.   
HTTPS Server    │ Opens ports for Apache Web Server.   
```


En resumen, el sumario de la configuración debe quedar tal que:

```
Firewall Starting                                                 
                                                                
   *  Enable firewall automatic starting                         
   *  Firewall starts after the configuration has been written   
                                                                 
  Internal Zone                                                  
                                                                 
      Interfaces                                                 
                                                                 
       +  VMXNET3 Ethernet Controller / eth0                     
      Open Services, Ports, and Protocols                        
                                                                 
       +  Internal zone is unprotected. All ports are open.      
                                                                 
  Demilitarized Zone                                             
                                                                 
   *  No interfaces assigned to this zone.                       
                                                                 
  External Zone                                                  
                                                                 
      Interfaces                                                 
                                                                 
       +  VMXNET3 Ethernet Controller / eth1                     
      Open Services, Ports, and Protocols                        
                                                                 
       +  HTTP Server
       +  HTTPS Server
```


## Ficheros

#### `/etc/hosts`

Definiremos en el fichero de hosts local las siguientes direcciones:
- Los servidores de las redes INTERFEDI
- La IP pública de acceso al servicio

```
127.0.0.1       localhost

# Santomera
192.168.10.1   f3san1
192.168.10.2   f3san2
192.168.10.3   f3san1-fw
192.168.10.4   f3san2-fw

# Madrid
192.168.10.17   f3mad1
192.168.10.18   f3mad1-fw

# IP Acceso al servicio
185.103.124.150 fedicom3 fedicom3.hefame.es
```


## Software
Un concentrador Fedicom 3 contendrá el siguiente software instalado:

- [Servidor Apache2 v2.4 con módulos para el balanceo de carga]($DOC$/apache2/instalacion)
- [Demonio Keepalived v2.0 para la implementación de VRRP]($DOC$/keepalived/instalacion)









