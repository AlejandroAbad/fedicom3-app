# Despliegue de un concentrador



## Filesystems
Aparte de los filesystems habituales de los sistemas Linux, un concentrador únicamente tendrá un volúmen exclusivo para la base de datos MongoDB.
Lo recomendado para la version de mongo que vamos a instalar, es utilizar un filesystem XFS para albergar la base de datos. 
En concreto, crearemos un VG con un LV exclusivo para el directorio `/var/lib/mongo`, donde se almacena la base de datos. Tal que:
```
# lsblk /dev/sdd
NAME              MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
sdd                 8:48   0   5G  0 disk
└─mongovg-lvmongo 254:3    0   5G  0 lvm  /var/lib/mongo
```

```
# mount | grep mongo
/dev/mapper/mongovg-lvmongo on /var/lib/mongo type xfs (rw,relatime,attr2,inode64,noquota)
```


## Tunning de memoria
Es recomendable deshabilitar el uso de HugePages para el uso de MongoDB. Para esto:

```
Yast > System > Boot Loader > Kernel Parameters
    En la opción "Optional Kernel Command Line Parameter", añadimos "transparent_hugepage=never"
```

Si queremos aplicar la configuración sin reiniciar, podemos ejecutar lo siguiente 
> **Importante**: Esta accicón NO guarda la configuración para el próximo reinicio

```
echo never > /sys/kernel/mm/transparent_hugepage/enabled
```

## Interfaces de red
Como ya vimos en el capítulo de [arquitectura de red]($DOC$/arquitectura/red), un concentrador cuenta con dos interfaces de red.
Configuraremos las interfaces tal que:
- `eth0`: Interfaz conectada a la red LAN de HEFAME de la sede donde se encuentre el servidor *(Por ejemplo, en Santomera: 172.30.10.0/24)*. 
- `eth1`: Interfaz conectada a la red INTERFEDI de la sede donde se encuentre el servidor *(Por ejemplo, en Santomera: 192.168.100.0/28)*.

El servidor tendrá como gateway por defecto el gateway de la red LAN HEFAME donde esté conectado, y tendrá rutas establecidas para alcanzar al resto de redes INTERSAP. Por ejemplo en Santomera:

```
# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         172.30.10.240   0.0.0.0         UG    0      0        0 eth0 # Enlace por defecto
172.30.10.0     0.0.0.0         255.255.255.0   U     0      0        0 eth0 # Enlace local en eth0
192.168.100.0   0.0.0.0         255.255.240.0   U     0      0        0 eth1 # Enlace local en eth1
192.168.100.16  192.168.100.14  255.255.240.0   U     0      0        0 eth1 # Acceso a la red 192.168.100.16/28 por el GW de la red 192.168.100.0/28
```

### DNS y NTP
Los concentradores usaran los servidores DNS y NTP internos de la red de HEFAME: `172.30.1.30` y `172.30.1.31`.


## Cortafuegos
Configuraremos el cortafuegos del servidor para proteger el acceso desde el interfaz de las redes INTERFEDI. Esto es, protegeremos el servidor del tráfico proviniente del interfaz `eth1`.


```
Yast > System > Security and Users > Firewall
```

En `Start-Up`:

```
    Marcamos la "Enable Firewall Automatic Starting"
```

En `Interfaces`:

```
Device                     │Interface or String│Configured In
VMXNET3 Ethernet Controller│eth0               │Internal Zone
VMXNET3 Ethernet Controller│eth1               │External Zone
```

En `Allowed Services`, para la zona `External Zone`, iremos al botón `Advanced ...` y habilitaremos únicamente los puertos:
- **TCP 5000**. El que usa la aplicación del concentrador para recibir peticiones Fedicom3.
- **TCP 5001**. El que usa la aplicación del concentrador para recibir peticiones de monitorización.


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
                                                                 
       +  TCP Ports: 5000, 5001          
```



#### `/etc/hosts`

Definiremos en el fichero de hosts un  nombre especial `proxysap` apuntando al host local.


```
127.0.0.1       localhost

# Nombre para el Proxy Balanceador a SAP (El servidor Apache local)
# (En el caso de desarrollo, el llamaremos a esta dirección proxysap-dev)
127.0.0.1       proxysap 
```



## Software
Un concentrador Fedicom 3 contendrá el siguiente software instalado:

#### Runtime JavaScript Node.js v10

```
# SUSEConnect -p sle-module-web-scripting/12/x86_64
# zypper install nodejs10
```

#### Control de versiones GIT

```
# zypper install git-core
```

#### Base de datos MongoDB v4.2

[Detalles de la instalación de MongoDB]($DOC$/mdb/instalacion)


#### Servidor Apache2 v2.4 con módulos para el balanceo de carga

[Detalles de la instalación de Apache2]($DOC$/apache2/instalacion)






