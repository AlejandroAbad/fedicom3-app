# Despliegue de máquinas Fedicom3

Para la infraestructura Fedicom3 vamos a despleguar 3 máquinas **SLES 12 SP4** en 3 ubicaciones distintas, dentro de la red HEFAME.
Adicionalmente, tambien desplegamos una cuarta máquina para desarrollo.

---
## Interfaces de red

```
SANTOMERA:  f3san.hefame.es - 172.30.10.169
MADRID:     f3mad.hefame.es - 172.30.132.169
BARCELONA:  f3bcn.hefame.es - 172.30.50.169

DESARROLLO: f3dev.hefame.es - 172.30.10.170
```

---
## Filesystems
Lo recomendado para la version de mongo que vamos a instalar, es utilizar un filesystem XFS para albergar la base de datos. 
En concreto, crearemos un VG con un LV exclusivo para el directorio `/var/lib/mongo`, donde se almacena la base de datos. Tal que:
```
# lsblk
sdd                 8:48   0    5G  0 disk
└─mongovg-lvmongo 254:8    0    5G  0 lvm  /var/lib/mongo
# mount
/dev/mapper/mongovg-lvmongo on /var/lib/mongo type xfs (rw,relatime,attr2,inode64,noquota)
```

---
## Tunning de memoria
Es recomendable deshabilitar el uso de HugePages para el uso de MongoDB. Para esto:

```
Yast > System > Boot Loader > Kernel Parameters
    En la opción "Optional Kernel Command Line Parameter", añadimos "transparent_hugepage=never"
```

Si queremos aplicar la configuración sin reiniciar, podemos ejecutar lo siguiente (ojo: esto NO guarda la configuración para el próximo reinicio)

```
echo never > /sys/kernel/mm/transparent_hugepage/enabled
```






---
## Cortafuegos







