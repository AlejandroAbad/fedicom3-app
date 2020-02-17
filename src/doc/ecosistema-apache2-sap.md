# Apache2 como balanceador de entrada de pedidos

En las máquinas usadas como cortafuegos, configuraremos el servidor Apache para hacer de proxy-balanceador
entre los concentradores Fedicom3 y los distintos destinos SAP. Para esto, haremos que Apache escuche a
peticiones locales y que las redirija al sistema SAP que le indiquemos. Para esto, usaremos un servidor
virtual de Apache que llamaremos `proxysap`, y que se accederá solo en local, por lo que deberemos incluir
la siguiente entrada en el `/etc/hosts` de la máquina:

```
127.0.0.1       proxysap proxysap.hefame.es
```

Para configurar el servicio en Apache, crearemos el fichero `/etc/apache2/vhosts.d/proxysap.conf` con el siguiente contenido:

## Configuración de conexiones inseguras

Por defecto, redirigiremos todo el tráfico no seguro del puerto 80 al 443 con HTTPS.

```
<VirtualHost _default_:80>
        ServerName proxysap.hefame.es

        ErrorLog /var/log/apache2/error_log
        TransferLog /var/log/apache2/access_log
        CustomLog /var/log/apache2/ssl_request_log   ssl_combined
```

## Definición de los grupos de balanceo

Definimos un grupos de balanceo por sistema SAP al que queramos que este proxy pueda hacer peticiones. 
Las opciones de configuración del balanceador son un mundo aparte, pero en principio, para P01 usaremos los nodos pares de manera general
y los impares solo en el caso de que no haya nodo pares disponibles.

> Indicando la opción `status=+H`, estamos indicando que el nodo es un *Hot Standby*, luego que solo se enviarán peticiones al mismo
si el resto de nodos está caído. Adicionalemente, podemos usar la opción  `loadfactor` entre 1 y 100 para dar dintinto peso a los servidores. 
- [Aquí podemos encontrar información completa de las opciones de la directiva BalancerMember](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#BalancerMember)

---

> Usamos `lbmethod=bybusyness` para indicar el algoritmo de balanceo que vamos a usar. Este creo que es el mas adecuado para nuestro caso, ya que mantiene la cuenta de peticiones 
activas de cada servidor y se las manda al que menos tenga.
- [Aquí podemos encontrar información completa de los distintos métodos de balanceo de carga](https://httpd.apache.org/docs/2.4/mod/mod_proxy_balancer.html)

```
        <Proxy balancer://sapp01>
                BalancerMember http://sap1p01:8011 status=+H
                BalancerMember http://sap2p01:8012
                BalancerMember http://sap3p01:8013 status=+H
                BalancerMember http://sap4p01:8014
                BalancerMember http://sap5p01:8015 status=+H
                BalancerMember http://sap6p01:8016
                BalancerMember http://sap7p01:8017 status=+H
                BalancerMember http://sap8p01:8018
                ProxySet lbmethod=bybusyness
        </Proxy>

        <Proxy balancer://sapt01>
                BalancerMember http://sap1t01:8000
                BalancerMember http://sap2t01:8000
                BalancerMember http://sap3t01:8000
                BalancerMember http://sap4t01:8000
                ProxySet lbmethod=bybusyness
        </Proxy>


        <Proxy balancer://sapd01>
                BalancerMember http://d01:8000
                ProxySet lbmethod=bybusyness
        </Proxy>
```

## Mapeo de peticiones a los distintos sistemas SAP

Para indicarle a Apache a cual balanceador debe mandar cada petición (y por tanto que sistema SAP va a dirigirse),
vamos a usar el prefijo en la URL. En este caso, las peticiones que comiencen por `/p01` (p.e. `/p01/resto/de/url`) se enviarán al 
balanceador de P01 como `balancer://sapp01/resto/de/url`.

> Nótese que no se pasa el prefijo `/p01` al dirigir la petición a SAP.


```
        ProxyRequests Off
        <Location "/p01">
                ProxyPass balancer://sapp01
        </Location>

        <Location "/t01">
                ProxyPass balancer://sapt01
        </Location>

        <Location "/d01">
                ProxyPass balancer://sapd01
        </Location>

        ProxyPass / !

</VirtualHost>
```

