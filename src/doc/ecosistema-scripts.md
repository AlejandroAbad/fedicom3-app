# Scripts y crontab

## Rotación de logs de MongoDB

MongoDB va dejando un log en `/var/log/mongodb/mongod.log`. Este log va llenandose hasta el infinito si no se controla.

Una de las maneras que tiene MongoDB para indicarle al proceso de que debe rotar el log es mandándole la señal `SIGUSR1` al mismo.
Esto hace que el antiguo fichero `mongod.log` se renombre con la forma `mongod.log.yyyy-mm-ssThh:MM:ss`, y se genere un nuevo `mongod.log` vacío.
La documentación detallada de la rotación de logs en MongoDB se explica [aquí](https://docs.mongodb.com/manual/tutorial/rotate-log-files/).

Para lograr la rotación diaria de los logs, hemos creado un script en `/usr/local/bin/mongod-logrotate` que provoca la rotación de log
en el proceso mongod, lo comprime y elimina los anteriores a 30 días.

```
#!/bin/sh

PIDFILE=/var/run/mongodb/mongod.pid
LOGDIR=/var/log/mongodb

# Indicamos al proceso de mongod que realize la rotacion del log
kill -10 $(cat $PIDFILE) 2>/dev/null

# Comprimimos todos los ficheros de log no comprimidos, excluyendo el actual "mongod.log"
find $LOGDIR -name "mongod.log.*" -and ! -name "*.gz" -exec gzip {} \;

# Eliminamos los anteriores a 30 dias
find $LOGDIR -name "mongod.log.*.gz" -mtime +30 -exec rm -f {} \;
```

Este script se ejecutará a diario en cada instancia de MongoDB a las 4 de la madrugada mediante el `crontab` del usuario `root`.

```
# Rotación de logs de MongoDB
00 04 * * * /usr/local/bin/mongod-logrotate >/dev/null 2>/dev/null
```
