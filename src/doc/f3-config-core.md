# Configuración del módulo CORE

El código fuente de la aplicación trae consigo un fichero de configuración de ejemplo.
Solamente tendremos que copiar el fichero de configuración que viene de ejemplo y modificarlo según las necesidades.

```
# su - fedicom3
~$ cd fedicom3-core
~/fedicom3-core$ cp config-sample.json config.json
```

Este es el aspecto del fichero de ejemplo:


```
{
	"workers": 8,
	"pid": "/var/run/f3",
        "depurar_transmisiones": false,
	"mongodb": {
		"username": "fedicom",
		"pwd": "fedicom3",
		"hosts": [
			"fedicom1.mydomain.com:27017",
			"fedicom2.mydomain.com:27017"
		],
		"database": "fedicom",
		"replicaset": "rs0",
		"writeconcern": 1,
		"txCollection": "myCollection",
		"discardCollection": "myDiscardCollection",
		"logCollection": "log"
	},
	"sqlite": {
		"db_path": "./db/sqlite.db"
	},
	"http": {
		"port": 80
	},
	"https": {
		"port": 443,
		"cert": "path/to/server.crt",
		"key": "path/to/server.key",
		"passphrase": "keyPass"
	},
	"jwt": {
		"token_signing_key": "SecretOne",
		"password_encryption_key": "SecretTwo",
		"token_lifetime_minutes": 30,
		"token_validation_skew_clock_seconds": 10
	},
	"sap_systems": {
		"default": "P01",
		"P01": {
			"host": "p01.hefame.es",
			"port": 11081,
			"https": true,
			"username": "fedicom",
			"password": "secretP01"
		},
		"T01": {
			"host": "t01.hefame.es",
			"port": 21081,
			"https": true,
			"username": "fedicom",
			"password": "secretT01"
		}
	},
	"watchdog": {
		"https": {
			"port": 50010,
			"cert": "ssl/server.crt",
			"key": "ssl/server.key",
			"passphrase": ""
		},
		"mdbwatch": {
			"buffer_size": 10,
			"interval": 5,
			"minimum_age": 600
		},
		"sqlite": {
			"interval": 5
		}
	}
}
```

---
## Configuración general

| Parámetro                     | Obligatorio   | Defecto | Descripción        |
| ------------------            |:-------------:|:-------:| ------------------ |
| `workers`                     | no            | `1`     | El número de procesos hijo que la aplicación desplegará para atender peticiones. |
| `pid`                         | no            | `.`     | Directorio donde se creará el fichero con el PID del proceso padre. |
| `depurar_transmisiones`       | no            | `false` | Indica si se deben añadir mensajes con los errores del protocolo encontrados. |
| &nbsp; | | | |
| `http`                        | si            |         | Un objeto con la configuración para HTTP. |
| `http`.`port`                 | si            |         | El puerto donde escuchar peticiones HTTP. |
| &nbsp; | | | |
| `https`                       | si            |         | Un objeto con la configuración para HTTPS. |
| `https`.`port`                | si            |         | El puerto donde escuchar peticiones HTTPS. |
| `https`.`cert`                | si            |         | El certificado RSA del servidor. |
| `https`.`key`                 | si            |         | La clave privada RSA del servidor. |
| `https`.`passphrase`          | no            | ''      | Contraseña para desencriptar la clave RSA. |

---
## Configuración de bases de datos

| Parámetro                     | Obligatorio   | Defecto   | Descripción        |
| ------------------            |:-------------:|:---------:| ------------------ |
| `mongodb`                     | si            |           | Un objeto con la configuración de MongoDB. |
| `mongodb`.`username`          | si            |           | El usuario a utilizar para la conexión a MongoDB. |
| `mongodb`.`pwd`               | si            |           | La contraseña del usuario para la conexión a MongoDB. |
| `mongodb`.`hosts`             | si            |           | Un array con los nombres de host de los servidores del ReplicaSet de MongoDB. |
| `mongodb`.`database`          | si            |           | El nombre de la base de datos. |
| `mongodb`.`replicaset`        | si            |           | El nombre del replica set. |
| `mongodb`.`writeconcern`      | no            | `1`       | El [Write-Concern](https://docs.mongodb.com/manual/reference/write-concern/) que se usa a la hora de escribir a MongoDB.  |
| `mongodb`.`txCollection`      | no            | 'tx'      | Nombre de la colección de transmisiones |
| `mongodb`.`logCollection`     | no            | 'log'     | Nombre de la colección de log |
| `mongodb`.`discardCollection` | no            | 'discard' | Nombre de la colección de descartes |
| &nbsp; | | | |
| `sqlite`                      | si            |           | Objeto con la configuración de la base de datos de respaldo SQLite. |
| `sqlite`.`db_path`            | si            |           | Ruta al fichero de SQLite. |

---
## Configuración de JWT

| Parámetro                                   | Obligatorio | Defecto | Descripción        |
| ------------------                          | ----------- | ------- | ------------------ |
| `jwt`                                       | si          |         | Objeto de configuración de JWT. |
| `jwt`.`token_signing_key`                   | si          |         | Clave de firma para la generación de JWT. |
| `jwt`.`password_encryption_key`             | si          |         | Clave de cifrado de contraseñas en JWT. |
| `jwt`.`token_lifetime_minutes`              | no          | `30`    | Tiempo de validez de los tokens generados, en minutos. |
| `jwt`.`token_validation_skew_clock_seconds` | no          | `10`    | Segundos de margen para la validación de tokens. |

---
## Configuración de sistemas SAP

| Parámetro                            | Obligatorio | Defecto | Descripción        |
| ------------------------------------ | ----------- | ------- | ------------------ |
| `sap_systems`                        | si          |         | Objeto de configuración de los sistemas SAP. |
| `sap_systems`.`default`              | si          |         | El ID del sistema SAP por defecto. |
| &nbsp; | | | |
| `sap_systems`.`<SID>`                | si          |         | Objeto de configuración de un sistema SAP concreto, cuyo ID es `<SID>`. |
| `sap_systems`.`<SID>`.`host`         | si          |         | Nombre del host del sistema SAP. |
| `sap_systems`.`<SID>`.`port`         | si          |         | Puerto de acceso al sistema SAP. |
| `sap_systems`.`<SID>`.`https`        | si          |         | `true` si se utiliza HTTPS, `false` de lo contrario. |
| `sap_systems`.`<SID>`.`username`     | si          |         | Usuario a utilizar para la autenticación contra el sistema SAP. |
| `sap_systems`.`<SID>`.`password`     | si          |         | Contraseña para autenticación contra el sistema SAP. |

---
## Configuración de WatchDog

| Parámetro                             | Obligatorio   | Defecto | Descripción        |
| ------------------                    | ------------- | ------- | ------------------ |
| `watchdog`                            | WatchDog      |         | Objeto de configuración del módulo WatchDog. |
| &nbsp; | | | |
| `watchdog`.`https`                    | WatchDog      |         | Objeto de configuración de HTTPS. |
| `watchdog`.`https`.`port`             | WatchDog      |         | El puerto donde escuchar peticiones HTTPS. |
| `watchdog`.`https`.`cert`             | WatchDog      |         | El certificado RSA del servidor. |
| `watchdog`.`https`.`key`              | WatchDog      |         | La clave privada RSA del servidor. |
| `watchdog`.`https`.`passphrase`       | no            | ''      | Contraseña para desencriptar la clave RSA. |
| &nbsp; | | | |
| `watchdog`.`mdbwatch`                 | no            |         | Objeto de configuración del escaner de pedidos erroneos en MongoDB. |
| `watchdog`.`mdbwatch`.`buffer_size`   | no            | `10`    | Número de transmisiones que el MdbWatch va a tratar simultáneamente como máximo. |
| `watchdog`.`mdbwatch`.`interval`      | no            | `5`     | Intervalo, en segundos, entre escaneos de la base de datos. |
| `watchdog`.`mdbwatch`.`minimum_age`   | no            | `600`   | Tiempo, en segudos, tras el cual una transmisión no confirmada se considerará en error. |
| &nbsp; | | | |
| `watchdog`.`sqlite`                   | no            |         | Objeto de configuración del escaner de SQLite. |
| `watchdog`.`sqlite`.`interval`        | no            | `5`     | Intervalo, en segundos, entre escaneos de la base de datos. |



