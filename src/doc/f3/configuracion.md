# Configuración del módulo CORE

El código fuente de la aplicación trae consigo un fichero de configuración de ejemplo.
Solamente tendremos que copiar el fichero de configuración que viene de ejemplo y modificarlo según las necesidades.

```
# su - fedicom3
$ cd fedicom3-core
/fedicom3-core$ cp config-sample.json config.json
```

Este es el aspecto del fichero de ejemplo:


```
{
	"production": false, 
	"workers": 8,
	"logdir": "/home/fedicom3/log",
	"pid": "/home/fedicom3/pid",
	"depurar_transmisiones": false,
	"mongodb": {
		"username": "fedicom",
		"pwd": "fedicom3",
		"hosts": [
			"fedicom1.mydomain.com:27017",
			"fedicom2.mydomain.com:27017"
		],
		"database": "fedicom3",
		"replicaset": "fedicom3",
		"writeconcern": 1,
		"txCollection": "tx",
		"discardCollection": "discard",
		"logCollection": "log"
	},
	"sqlite": {
		"db_path": "/home/fedicom3/db/sqlite.db"
	},
	"http": {
		"port": 5000
	},
	"jwt": {
		"token_signing_key": "SecretOne",
		"token_lifetime_minutes": 30,
		"token_validation_skew_clock_seconds": 10
	},
	"sap_systems": {
		"default": "D01",
		"D01": {
			"host": "d01.hefame.es",
			"port": 11081,
			"https": true,
			"username": "fedicom",
			"password": "secretD01",
			"prefix": "/devel"
		},
		"T01": {
			"host": "t01.hefame.es",
			"port": 21081,
			"https": true,
			"username": "fedicom",
			"password": "secretT01",
			"prefix": "/test"
		}
	},
	"watchdog": {
		"mdbwatch": {
			"buffer_size": 10,
			"interval": 5,
			"minimum_age": 600
		},
		"sqlite": {
			"interval": 5,
			"maxRetries": 10
		},
		"priority": 100
	},
	"ldap": {
		"url": "ldap://ad.domain.com",
		"cacert": "ssl/ad_ca_cert.crt"
	},
	"monitor": {
		"http": {
				"port": 5001
		}
	}
}

```

---
## Configuración general

| Parámetro                     | Obligatorio   | Defecto | Descripción        |
| ------------------            |:-------------:| ------- | ------------------ |
| `production`                  | si            |         | Indica si la instancia es de producción o de test. Las instancias de producción no admiten transmisiones desde el simulador y pueden llevar a cabo otras comprobaciones para evitar que algún despistado la líe. |
| `workers`                     | no            | `1`     | El número de procesos hijo que la aplicación desplegará para atender peticiones. |
| `logdir`                      | no            | '.'     | Directorio donde se escribirán los logs de los distintos procesos de la aplicación. |
| `pid`                         | no            | '.'     | Directorio donde se creará el fichero con el PID del proceso padre. |
| `depurar_transmisiones`       | no            | `false` | Indica si se deben añadir mensajes con los errores del protocolo encontrados. |
| &nbsp; | | | |
| `http`                        | si            |         | *Un objeto con la configuración para HTTP.* |
| `http`.`port`                 | si            |         | El puerto donde escuchar peticiones HTTP. |


---
## Configuración de bases de datos

| Parámetro                     | Obligatorio   | Defecto   | Descripción        |
| ------------------            |:-------------:| --------- | ------------------ |
| `mongodb`                     | si            |           | *Un objeto con la configuración de MongoDB.* |
| `mongodb`.`username`          | si            |           | El usuario a utilizar para la conexión a MongoDB. |
| `mongodb`.`pwd`               | si            |           | La contraseña del usuario para la conexión a MongoDB. |
| `mongodb`.`hosts`             | si            |           | Una lista con los nombres de host de los servidores del ReplicaSet de MongoDB. |
| `mongodb`.`database`          | si            |           | El nombre de la base de datos. |
| `mongodb`.`replicaset`        | si            |           | El nombre del replica set. |
| `mongodb`.`writeconcern`      | no            | `1`       | El [Write-Concern](https://docs.mongodb.com/manual/reference/write-concern/) que se usa a la hora de escribir a MongoDB.  |
| `mongodb`.`txCollection`      | no            | 'tx'      | Nombre de la colección de transmisiones |
| `mongodb`.`logCollection`     | no            | 'log'     | Nombre de la colección de log |
| `mongodb`.`discardCollection` | no            | 'discard' | Nombre de la colección de descartes |
| &nbsp; | | | |
| `sqlite`                      | si            |           | *Objeto con la configuración de la base de datos de respaldo SQLite.* |
| `sqlite`.`db_path`            | si            |           | Ruta al fichero de SQLite. |

---
## Configuración de JWT

| Parámetro                                   | Obligatorio | Defecto | Descripción        |
| ------------------                          | ----------- | ------- | ------------------ |
| `jwt`                                       | si          |         | *Objeto de configuración de JWT.* |
| `jwt`.`token_signing_key`                   | si          |         | Clave de firma para la generación de JWT. **Nota:** Esta clave debe ser la misma en todas las instancias o no se realizará correctamente el balanceo de carga de las peticiones. |
| `jwt`.`token_lifetime_minutes`              | no          | `30`    | Tiempo de validez de los tokens generados, en minutos. |
| `jwt`.`token_validation_skew_clock_seconds` | no          | `10`    | Segundos de margen para la validación de tokens. |

---
## Configuración de sistemas SAP

| Parámetro                            | Obligatorio | Defecto | Descripción        |
| ------------------------------------ | ----------- | ------- | ------------------ |
| `sap_systems`                        | si          |         | *Objeto de configuración de los sistemas SAP.* |
| `sap_systems`.`default`              | si          |         | El ID del sistema SAP por defecto. |
| &nbsp; | | | |
| `sap_systems`.`<SID>`                | si          |         | *Objeto de configuración de un sistema SAP concreto, cuyo ID es `<SID>`.* |
| `sap_systems`.`<SID>`.`host`         | si          |         | Nombre del host del sistema SAP. |
| `sap_systems`.`<SID>`.`port`         | si          |         | Puerto de acceso al sistema SAP. |
| `sap_systems`.`<SID>`.`https`        | si          |         | `true` si se utiliza HTTPS, `false` de lo contrario. |
| `sap_systems`.`<SID>`.`username`     | si          |         | Usuario a utilizar para la autenticación contra el sistema SAP. |
| `sap_systems`.`<SID>`.`password`     | si          |         | Contraseña para autenticación contra el sistema SAP. |
| `sap_systems`.`<SID>`.`prefix`       | no          |         | Prefijo a incluir delante de todas las peticiones HTTP que se dirijan a este sistema SAP. Por ejemplo `/t01`. |

---
## Configuración de WatchDog

| Parámetro                             | Obligatorio   | Defecto | Descripción        |
| ------------------                    | ------------- | ------- | ------------------ |
| `watchdog`                            | si            |         | Objeto de configuración del módulo WatchDog. |
| `watchdog`.`priority`                 | no            | `-1`    | Prioridad que tiene este WatchDog para convertirse en el WatchDog maestro. El WatchDog disponible con el mayor número será elegido como primario. |
| &nbsp; | | | |
| `watchdog`.`mdbwatch`                 | no            |         | Objeto de configuración del escaner de pedidos erroneos en MongoDB. |
| `watchdog`.`mdbwatch`.`buffer_size`   | no            | `10`    | Número de transmisiones que el MdbWatch va a tratar simultáneamente como máximo. |
| `watchdog`.`mdbwatch`.`interval`      | no            | `5`     | Intervalo, en segundos, entre escaneos de la base de datos. |
| `watchdog`.`mdbwatch`.`minimum_age`   | no            | `600`   | Tiempo, en segudos, tras el cual una transmisión no confirmada se considerará en error. |
| &nbsp; | | | |
| `watchdog`.`sqlite`                   | no            |         | Objeto de configuración del escaner de SQLite. |
| `watchdog`.`sqlite`.`interval`        | no            | `5`     | Intervalo, en segundos, entre escaneos de la base de datos. |


## Configuración del monitor

| Parámetro                             | Obligatorio   | Defecto | Descripción        |
| ------------------                    | ------------- | ------- | ------------------ |
| `monitor`                            | si            |         | *Un objeto con la configuración del monitor.* |
| `monitor`.`http`                                | si            |         | *Un objeto con la configuración para HTTP para el monitor.* |
| `monitor`.`http`.`port`                         | si            |         | El puerto donde el monitor escuchará peticiones HTTP. |

