# Despliegue de aplicación

## Preparativos previos

### Usuarios y grupos

Solo necesitaremos crear el usuario `fedicom3`, que es quien ejecuta todas las aplicaciones del ecosistema fedicom3:

```
# useradd -u 1100 -U -m fedicom3
```

El usuario tendrá su directorio home por defecto `/home/fedicom3`.


## Directorios

Será necesario crear varios directorios, preferiblemente dentro del home del usuario `fedicom3`

- `log`: Directorio de logs de la aplicación del concentrador Fedicom 3.
- `pid`: Directorio donde se almacenarán los ficheros con los PIDs de los distintos procesos de la aplicación.
- `db`: Directorio donde se almacenará la base de datos de emergencia. Cuando falla la conexión a MongoDB, el concentrador utiliza una base de datos SQLite ubicada en este directorio.
- `ssl`: Directorio donde se almacenarán los ficheros necesarios para las comunicaciones SSL.

```
su - fedicom3
for DIR in pid log db ssl
do
    mkdir $HOME/$DIR
    chmod 700 $HOME/$DIR
done
```

## Certificado para Active Directory

Para que la aplicación pueda autenticar a los usuarios del dominio Windows usando un canal seguro de comunicación con el servidor LDAP de HEFAME, copiaremos en la ruta `$HOME/ssl/ad1_ca_cert.crt` el certificado del servidor de dominio.

```
echo "-----BEGIN CERTIFICATE-----
MIIDhDCCAmygAwIBAgIQU62pA4nkZZ5OL4pSSinXVTANBgkqhkiG9w0BAQsFADBJ
MRIwEAYKCZImiZPyLGQBGRYCZXMxFjAUBgoJkiaJk/IsZAEZFgZoZWZhbWUxGzAZ
BgNVBAMTEmhlZmFtZS1TMjAxMkFEMS1DQTAgFw0xNjA0MjUwNzM0NTRaGA8zMDE1
MDQyNTA3NDQ1NFowSTESMBAGCgmSJomT8ixkARkWAmVzMRYwFAYKCZImiZPyLGQB
GRYGaGVmYW1lMRswGQYDVQQDExJoZWZhbWUtUzIwMTJBRDEtQ0EwggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQCXR8DGA3YuCHwwcs9KOfSh3Iq3+40JlflT
DV6iw2AJNkauzh23rP44XO3zhj9YSU7++P0KTv5jEgiU8eqc8fH3PrHq2qbs3bmb
l8KKv9j3OOAunLsDdJ+ny6I77BiNZj6rV+0vvRGCGoqdHCNafPspcTaIW5ID76rq
i+DrrKWaqzhA5bLNEJNJWCINROj/t/F8jGIQB4SK7eUU3CViuvye7vSuW235/NRc
hOsLz/OoFnvIyt8/kk69xJo/S/mcMQ1hLXe4SC6N0js7vmTRNAyuumuIPUSC9Ef5
MgKZorvWPO/t1unutas2WYf1ktQcPWOaeMBuaL3gAi7PF2Hg28qpAgMBAAGjZjBk
MBMGCSsGAQQBgjcUAgQGHgQAQwBBMAsGA1UdDwQEAwIBRjAPBgNVHRMBAf8EBTAD
AQH/MB0GA1UdDgQWBBSfm3MLxnyrHejJVKJRb6vG3fkwlDAQBgkrBgEEAYI3FQEE
AwIBADANBgkqhkiG9w0BAQsFAAOCAQEAcSztHN+JIaYzdemG8wZ+61Si74gDoWPM
E1gRv4ebrYbFq/pkhmBz4Kj2cpGPF6WhBZlpp9vxJ0p1Amy8ZkEOZiX2aCEn4j3X
bzA1eFiZ8QR4srHqEEF3fPYIKn8K6rgGwv89lerBuB89TcKKYIX0jbMmv0aZlUjx
/7GYowPWCYcwIY8bO4D0nj0PoGKCgQ8FkNGhQp/ZoLfrXIZxSv0b/EXbQRHj7KuA
iqePXkHhaaaI0CAHR/Ud9ealRrWxQalYfJRJBAK+IOQJnh1Dg1J5gNePEl5zwtt3
HjYApCo1J7nH24zv3m3QxX1X5dM4Yj3MATo1PKmTi+ZO7idAEM0+jQ==
-----END CERTIFICATE-----" > $HOME/ssl/ad1_ca_cert.crt
```


## Instalación inicial

Descarga del código fuente e instalación inicial
Nos logeamos con el usuario "fedicom3" y hacemos la primera descarga del código fuente desde el repositorio. 
Este repositorio contiene el código de las aplicaciones CORE y WATCHDOG en conjunto, ya que ambas comparten gran cantidad de código y librerías.

```
su - fedicom3
cd $HOME
git clone https://github.com/AlejandroAbad/fedicom3-core.git
```

Esto nos crea en la carpeta `fedicom-core` el codigo fuente de la aplicación.

> **Extra**: Si queremos que la máquina recuerde nuestra password de GIT, ejecutaremos este comando, y la siguiente vez que nos pida contraseña la almacenará en caché local.
    ```
    $ git config --global credential.helper cache
    ```

Una vez descargadas las fuentes de la aplicación, **es muy conveniente** crear un enlace simbólico al script de arranque parada en el directorio `bin` del usuario. Para esto:

```
ln -s /home/fedicom3/fedicom3-core/script/fedicom3.sh /home/fedicom3/bin/f3
ln -s /home/fedicom3/fedicom3-core/script/fedicom3.sh /home/fedicom3/bin/fedicom3
```

> Por defecto, asumimos que el directorio existe y está en el `$PATH` del usuario