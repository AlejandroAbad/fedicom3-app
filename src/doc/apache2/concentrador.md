# Apache2 como balanceador de entrada de pedidos

En las máquinas usadas como concentradores, configuraremos el servidor Apache para hacer de proxy-balanceador
entre los concentradores Fedicom3 del servidor local y los distintos destinos SAP. Para esto, haremos que Apache escuche a
peticiones locales y que las redirija al sistema SAP que le indiquemos. 

Para lograr este comportamiento, usaremos un servidor virtual de Apache (*vhost*) que llamaremos `proxysap`, y que se accederá solo desde el servidor local. Este servidor virtual se accederá con el nombre de `proxysap`, nombre que ya habíamos configurador en el `/etc/hosts` del servidor durante la instalación del mismo. A modo de recordatorio, el fichero de hosts debe tener esta entrada:

```
127.0.0.1       proxysap               # En el caso de desarrollo, será proxysap-dev
```

Para configurar el servicio en Apache, crearemos el fichero `/etc/apache2/vhosts.d/proxysap.conf` con el contenido que iremos detallando.

## Configuración del VHOST

El servidor virtual está pensado sólo para escuchar peticiones desde el servidor local, por lo que no vemos necesario protegerlo con SSL.
Por esto, el VHOST escuchará únicamente en el puerto 80.

```
<VirtualHost _default_:80>
        ServerName proxysap.hefame.es

        ErrorLog /var/log/apache2/error_log
        TransferLog /var/log/apache2/access_log
```

## Definición de los grupos de balanceo

Definimos un grupo de balanceo por sistema SAP al que queramos que este proxy pueda hacer peticiones. 
Las opciones de configuración del balanceador son un mundo aparte, pero en principio, para P01 usaremos los nodos pares de manera general
y los impares solo en el caso de que no haya nodo pares disponibles.

Una configuración típica quedaría tal que así:

```
        <Proxy balancer://sapp01>
                BalancerMember http://sap1p01:8011 connectiontimeout=5 status=+H
                BalancerMember http://sap2p01:8012 connectiontimeout=5 
                BalancerMember http://sap3p01:8013 connectiontimeout=5 status=+H
                BalancerMember http://sap4p01:8014 connectiontimeout=5 
                BalancerMember http://sap5p01:8015 connectiontimeout=5 status=+H
                BalancerMember http://sap6p01:8016 connectiontimeout=5 
                BalancerMember http://sap7p01:8017 connectiontimeout=5 status=+H
                BalancerMember http://sap8p01:8018 connectiontimeout=5 
                ProxySet lbmethod=bybusyness growth=8
        </Proxy>

        <Proxy balancer://sapt01>
                BalancerMember http://sap1t01:8000 connectiontimeout=5 
                BalancerMember http://sap2t01:8000 connectiontimeout=5 
                BalancerMember http://sap3t01:8000 connectiontimeout=5 
                BalancerMember http://sap4t01:8000 connectiontimeout=5 
                ProxySet lbmethod=bybusyness growth=6
        </Proxy>


        <Proxy balancer://sapd01>
                BalancerMember http://d01:8000 connectiontimeout=5 
                ProxySet lbmethod=bybusyness growth=6
        </Proxy>
```

De las opciones utilizadas, estas son las destacables:

- Indicando la opción `status=+H`, estamos indicando que el nodo es un *Hot Standby*, luego que solo se enviarán peticiones al mismo
si el resto de nodos está caído. Adicionalemente, podemos usar la opción  `loadfactor` entre 1 y 100 para dar distinto peso a los servidores, en nuestro caso no nos interesa.
- Usamos `lbmethod=bybusyness` para indicar el algoritmo de balanceo que vamos a usar. Este creo que es el mas adecuado para nuestro caso, ya que mantiene la cuenta de peticiones activas de cada servidor y se las manda al que menos tenga.
- La opción `growth` de la directiva `ProxySet` nos permite añadir en caliente nuevos servidores al balanceo de carga.
- La opción `connectiontimeout` especifica el tiempo en segundos que el balanceador va a esperar durante el establecimiento de la conexión antes de considerar al miembro del grupo de balanceo como en error. No debe confundirse con la directiva `timeout`, que especifica el tiempo tras el cual la conexión se cierra.

> Información en detalle: 
- [Aquí podemos encontrar información completa de las opciones de la directiva BalancerMember](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#BalancerMember)
- [Aquí podemos encontrar información completa de los distintos métodos de balanceo de carga](https://httpd.apache.org/docs/2.4/mod/mod_proxy_balancer.html)





## Mapeo de peticiones a los distintos sistemas SAP

Para indicarle a Apache a cual balanceador debe mandar cada petición (y por tanto que sistema SAP va a dirigirse), vamos a usar el prefijo en la URL. 

Para nuestro caso:
- Las peticiones que comiencen por `/p01` se enviarán al balanceador de P01.
- Las peticiones que comiencen por `/t01` se enviarán al balanceador de T01.
- Las peticiones que comiencen por `/d01` se enviarán al balanceador de D01.

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

Nótese que no se pasa el prefijo `/p01` al dirigir la petición a SAP. Imaginemos el siguiente ejemplo:

1. El balanceador recibe una petición dirigda a la siguiente URL: `/p01/sap/public/ping`.
1. Como la URL comienza por `/p01`, el balanceador escogerá un miembro activo del balanceador `sapp01`, por ejemplo, `http://sap6p01:8016`.
1. El balanceador realiza la petición HTTP contra `http://sap6p01:8016/sap/public/ping`.

## Prueba de funcionamiento

Desde la consola de comandos del servidor podemos realizar una simple prueba de acceso al servicio SAP a través del balanceador. Para esto, haremos la siguiente petición HTTP con la herramienta `curl`:

```
$ curl http://proxysap-dev/t01/sap/public/info
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Body>
    <rfc:RFC_SYSTEM_INFO.Response xmlns:rfc="urn:sap-com:document:sap:rfc:functions">
      <RFCSI>
        <RFCPROTO>011</RFCPROTO>
        <RFCCHARTYP>1100</RFCCHARTYP>
        <RFCINTTYP>BIG</RFCINTTYP>
        <RFCFLOTYP>IE3</RFCFLOTYP>
        <RFCDEST>sap2t01_T01_00</RFCDEST>
        <RFCHOST>sap2t01</RFCHOST>
        <RFCSYSID>T01</RFCSYSID>
        <RFCDATABS>T01</RFCDATABS>
        <RFCDBHOST>rac2t01</RFCDBHOST>
        <RFCDBSYS>ORACLE</RFCDBSYS>
        <RFCSAPRL>740</RFCSAPRL>
        <RFCMACH>  324</RFCMACH>
        <RFCOPSYS>AIX</RFCOPSYS>
        <RFCTZONE>  3600</RFCTZONE>
        <RFCDAYST></RFCDAYST>
        <RFCIPADDR>10.11.11.80</RFCIPADDR>
        <RFCKERNRL>753</RFCKERNRL>
        <RFCHOST2>sap2t01</RFCHOST2>
        <RFCSI_RESV></RFCSI_RESV>
        <RFCIPV6ADDR>10.11.11.80</RFCIPV6ADDR>
      </RFCSI>
    </rfc:RFC_SYSTEM_INFO.Response>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

En el ejemplo anterior, si nos fijamos en la respuesta obtenida, vemos que se ha realizado la petición a la instancia SAP `sap2t01_T01_00`.