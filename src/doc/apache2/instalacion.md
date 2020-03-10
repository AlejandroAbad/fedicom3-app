# Apache2 - Reverse-proxy/balanceador

Tanto en las máquinas usadas como cortafuegos como en los concentradores, instalaremos servidores Apache2 
para hacer las veces de proxy inverso, con la capacidad de balancear las peticiones.

> **Nota**: Vamos a instalar Apache con el MPM *(Multi Processing Module)* denominado `worker` ([Documentación oficial](https://httpd.apache.org/docs/2.4/mod/worker.html)). Este MPM permite que las peticiones de los clientes puedan atenderse dentro de hilos de un mismo proceso, reduciendo notablemente el número de procesos Apache necesarios, y por lo tanto, reduciendo enormemente el gasto de recursos, ya que los hilos de un mismo proceso comparten RAM y se reducen los saltos de contexto del procesador.

A continuación describiremos el proceso de instalación y configuración de una instancia de Apache2 preparada
para hacer de proxy/balanceador y nada mas.


## Instalación de Apache y módulos necesarios
```
zypper install apache2-worker
systemctl enable apache2
```


## Configuración general

### Despliegue de los certificados del servidor

```
/etc/apache2/
    ssl.crt/
        ca.crt
        hefame.crt
        intermediate.crt
    ssl.key/
        hefame.key
```

```
chmod 600 /etc/apache2/ssl.key/hefame.key
```

---

### Configuración de módulos a cargar

Hay ciertos módulos que vienen activos por defecto en la instalación de Apache2 que no necesitaremos. También, hay otros que deberemos activar.
Para esto, activaremos los siguientes módulos:

```
a2enmod rewrite
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_balancer
a2enmod mod_slotmem_shm
a2enmod lbmethod_bybusyness
```

Y haremos los siguientes cambios en el fichero `/etc/sysconfig/apache2`.

```
APACHE_CONF_INCLUDE_FILES="/etc/apache2/mod_proxy_balancer.conf"
APACHE_MODULES="alias authz_host authz_core env include log_config mime setenvif ssl reqtimeout authn_core rewrite proxy proxy_http status proxy_balancer mod_slotmem_shm lbmethod_bybusyness"
APACHE_SERVER_FLAGS="SSL STATUS"
APACHE_MPM="worker"
APACHE_SERVERNAME="<<hostname>>"
```

>*Nota: El fichero `/etc/apache2/mod_proxy_balancer.conf` lo crearemos mas adelante.*

Para evitar errores por los módulos desactivados, comentaremos las siguientes líneas en `/etc/apache2/httpd.conf`

```
#Include /etc/apache2/mod_info.conf
#Include /etc/apache2/mod_cgid-timeout.conf
#Include /etc/apache2/mod_usertrack.conf
#Include /etc/apache2/mod_autoindex-defaults.conf
#TypesConfig /etc/apache2/mime.types
#Include /etc/apache2/mod_mime-defaults.conf
#DirectoryIndex index.html index.html.var
#Include /etc/apache2/default-server.conf
```

---

### Configuramos el acceso al panel de control del módulo de balanceo HTTP

Para esto, creamos el fichero `/etc/apache2/mod_proxy_balancer.conf` con el siguiente contenido:

```
<IfModule mod_proxy_balancer.c>
    <Location "/balancer-manager">
        SetHandler balancer-manager
        Require ip 195.57.209.104 172.30.0.0/16
        Require local
    </Location>
</IfModule>
```

---

### Eliminamos directivas `mod_access_compat`

Por último, un paso opcional que me gusta hacer para dejar la configuración de Apache lo mas limpia posible, es
eliminar las directivas `mod_access_compat`, que son para compatibilidad con la antigua nomenclatura de Apache2.2.

Para esto, donde veamos el siguiente patrón:

```
<IfModule !mod_access_compat.c>
    Require local
</IfModule>
<IfModule mod_access_compat.c>
    Order deny,allow
    Deny from all
    Allow from localhost
</IfModule>
```

Podemos eliminarlo todo y dejar solo lo que está entre `<IfModule !mod_access_compat.c>`, que en el ejemplo anterior sería:

```
Require local
```

Así queda mas claro que lo que tiene que hacer ¿No crees?


### Configuración de logrotate

Vamos a configurar la rotación de logs de Apache con la utilidad `logrotate` de SUSE.

Comenzamos por editar el fichero de configuración de logrotate para apache `/etc/logrotate.d/apache2` tal que:

```
/var/log/apache2/*log {
    copytruncate
    compress
    dateext
    maxage 30
    rotate 99
    size=+1024k
    notifempty
    missingok
    create 644 root root
}
```

Añadimos la siguiente línea en el crontab del usuario root:

```
# Rotación de logs de Apache2
00 04 * * * root /usr/sbin/logrotate /etc/logrotate.conf >/dev/null 2>/dev/null
```



## Siguientes pasos:

> - [Configurar Apache2 para un **BALANCEADOR**]($DOC$/apache2/balanceador).
> - [Configurar Apache2 para un **CONCENTRADOR**]($DOC$/apache2/concentrador).