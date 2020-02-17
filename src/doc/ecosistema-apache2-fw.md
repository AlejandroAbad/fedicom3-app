# Apache2 como balanceador de entrada de pedidos

En las máquinas usadas como cortafuegos, configuraremos el servidor Apache para hacer de proxy-balanceador
entre los clientes y los conecntradores Fedicom3.


Para esto, crearemos el fichero `/etc/apache2/vhosts.d/fedicom3.conf` con el siguiente contenido:

## Configuración de conexiones inseguras

Por defecto, redirigiremos todo el tráfico no seguro del puerto 80 al 443 con HTTPS.

```
<VirtualHost _default_:80>
        ServerName fedicom3.hefame.es

        ErrorLog /var/log/apache2/error_log
        TransferLog /var/log/apache2/access_log
        CustomLog /var/log/apache2/ssl_request_log   ssl_combined

        RewriteEngine On
        RewriteCond %{HTTPS} off
        RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI}

</VirtualHost>
```

## Inicio de la configuración del servidor virtual para HTTPS

```
<IfDefine SSL>
<IfDefine !NOSSL>

<VirtualHost _default_:443>

        ServerName fedicom3.hefame.es

        ErrorLog /var/log/apache2/error_log
        TransferLog /var/log/apache2/access_log
        CustomLog /var/log/apache2/ssl_request_log   ssl_combined
```

## Definición de los grupos de balanceo

Definimos 2 grupos de balanceo a los que redirigiremos posteriormente las peticiones de los clientes. Las opciones de configuración aquí son un
mundo aparte. Explicamos a continuación las usadas y dejamos el enlace a la referencia completa.

> Indicando la opción `status=+H`, estamos indicando que el nodo es un *Hot Standby*, luego que solo se enviarán peticiones al mismo
si el resto de nodos está caído. Adicionalemente, podemos usar la opción  `loadfactor` entre 1 y 100 para dar dintinto peso a los servidores. 
- [Aquí podemos encontrar información completa de las opciones de la directiva BalancerMember](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#BalancerMember)

---

> Usamos `lbmethod=bybusyness` para indicar el algoritmo de balanceo que vamos a usar. Este creo que es el mas adecuado para nuestro caso, ya que mantiene la cuenta de peticiones 
activas de cada servidor y se las manda al que menos tenga.
- [Aquí podemos encontrar información completa de los distintos métodos de balanceo de carga](https://httpd.apache.org/docs/2.4/mod/mod_proxy_balancer.html)



```
        <Proxy balancer://fedicom3-pedidos>
                BalancerMember http://f3san:50001 timeout=5
                BalancerMember http://f3mad:50001 timeout=5 status=+H
                BalancerMember http://f3bcn:50001 status=+H
                ProxySet lbmethod=bybusyness
        </Proxy>

        <Proxy balancer://fedicom3-general>
                BalancerMember http://f3san:50001 timeout=5 status=+H
                BalancerMember http://f3mad:50001 timeout=5
                BalancerMember http://f3bcn:50001 status=+H
                ProxySet lbmethod=bybusyness
        </Proxy>
```

## Mapeo de peticiones Fedicom3 a los distintos balanceadores

En este caso, vamos a lanzar todas las peticiones de pedidos y autenticaciones contra el grupo de balanceo `balancer://fedicom3-pedidos` y el resto de peticiones Fedicom3 al
grupo de balanceo `balancer://fedicom3-general`. Por último, la directiva `ProxyPass / !` hace que no se haga proxy de las peticiones que no hayan conincido con ninguna de 
las establecidas previamente, y como el servidor no tiene nada configurado se devolverá un error 403.

```
        ProxyRequests Off
        <Location "/authenticate">
                ProxyPass balancer://fedicom3-pedidos/authenticate
        </Location>

        <Location "/pedidos">
                ProxyPass balancer://fedicom3-pedidos/pedidos
        </Location>

        <Location "/devoluciones">
                ProxyPass balancer://fedicom3-general/devoluciones
        </Location>

        <Location "/albaranes">
                ProxyPass balancer://fedicom3-general/albaranes
        </Location>

        <Location "/facturas">
                ProxyPass balancer://fedicom3-general/facturas
        </Location>

        ProxyPass / !
```




## Configuración para SSL y fin de la definición del servidor virtual

```
        #   Enable/Disable SSL for this virtual host.
        SSLEngine on
        SSLProtocol all -SSLv2 -SSLv3
        SSLCipherSuite ALL:!aNULL:!eNULL:!SSLv2:!LOW:!EXP:!MD5:@STRENGTH
        SSLCertificateFile /etc/apache2/ssl.crt/hefame.crt
        SSLCertificateKeyFile /etc/apache2/ssl.key/hefame.key
        SSLCertificateChainFile /etc/apache2/ssl.crt/intermediate.crt
        SSLCACertificatePath /etc/ssl/certs/

</VirtualHost>

</IfDefine>
</IfDefine>
```
