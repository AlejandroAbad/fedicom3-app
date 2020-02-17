# Servicio **CORE**

## Arranque del servicio CORE

Nos logeamos con el usuario `fedicom3` y nos moveremos al directorio del código y ejecutaremos:

```
fedicom3@f3dev:~> cd fedicom3-core
fedicom3@f3dev:~/fedicom3-core> npm run core
```

Si todo ha ido correctamente, en el fichero de log generado `./fedicom3-core.log` debería aparecer algo similar a:

```
[master][2019-09-10T08:48:29.842Z][5000][server] **** ARRANCANDO CONCENTRADOR FEDICOM 3 - 0.5.2 ****
[master][2019-09-10T08:48:29.843Z][5000][server] *** Implementando protololo Fedicom v3.3.5 ****
[master][2019-09-10T08:48:29.843Z][5000][cluster] *** ID master: f3dev-13011-1568105309688-0.5.2
[master][2019-09-10T08:48:29.844Z][5000][cluster] ** Lanzando 2 workers
[master][2019-09-10T08:48:29.932Z][5000][logs] *** Conectado a la colección [fedicom3.log] para almacenamiento de logs
[th#2][2019-09-10T08:48:30.298Z][5000][cluster] *** Iniciado worker,[object Object]
[th#1][2019-09-10T08:48:30.303Z][5000][cluster] *** Iniciado worker,[object Object]
[th#2][2019-09-10T08:48:30.816Z][5000][sqlite] *** Conectado a la base de datos de emergencia SQLite3,/home/fedicom3/db/sqlite.db
[th#2][2019-09-10T08:48:30.819Z][5000][server] Servidor HTTP a la escucha en el puerto 50001
[th#2][2019-09-10T08:48:30.819Z][5000][server] Servidor HTTPS a la escucha en el puerto 50000
[th#1][2019-09-10T08:48:30.821Z][5000][sqlite] *** Conectado a la base de datos de emergencia SQLite3,/home/fedicom3/db/sqlite.db
[th#1][2019-09-10T08:48:30.824Z][5000][server] Servidor HTTP a la escucha en el puerto 50001
[th#1][2019-09-10T08:48:30.824Z][5000][server] Servidor HTTPS a la escucha en el puerto 50000
[th#2][2019-09-10T08:48:30.872Z][5000][logs] *** Conectado a la colección [fedicom3.log] para almacenamiento de logs
[th#1][2019-09-10T08:48:30.874Z][5000][logs] *** Conectado a la colección [fedicom3.log] para almacenamiento de logs
[th#1][2019-09-10T08:48:30.886Z][5000][mongodb] *** Conexión #0 a la colección [fedicom3.tx] para almacenamiento de transmisiones
[th#1][2019-09-10T08:48:30.887Z][5000][mongodb] *** Conexión #0 a la colección [fedicom3.discard] para almacenamiento de transmisiones descartadas
[th#2][2019-09-10T08:48:30.889Z][5000][mongodb] *** Conexión #0 a la colección [fedicom3.tx] para almacenamiento de transmisiones
[th#2][2019-09-10T08:48:30.890Z][5000][mongodb] *** Conexión #0 a la colección [fedicom3.discard] para almacenamiento de transmisiones descartadas
```

Donde veremos como el proceso "master" lanza tantos workers como se le haya indicado en el fichero de configuración.
También podremos ver los distintos procesos con el comando 'ps':

```
fedicom3@f3dev:~> ps lf | grep f3
0  1001 13011     1  20   0 768124 45760 -      Sl   pts/0      0:00 f3-core-master
0  1001 13023 13011  20   0 863608 56640 -      Sl   pts/0      0:00  \_ f3-core-worker-1
0  1001 13024 13011  20   0 863076 56036 -      Sl   pts/0      0:00  \_ f3-core-worker-2
```


Y también podemos ver como se ha generado el fichero con el PID del proceso maestro:

```
fedicom3@f3dev:~> ls -l /var/run/fedicom3/f3-core-master.pid
-rw-r--r-- 1 fedicom3 users 5 Sep 10 10:48 /var/run/fedicom3/f3-core-master.pid
fedicom3@f3dev:~> cat /var/run/fedicom3/f3-core-master.pid
13011
```

> El directorio donde se genera el fichero con el PID es configurable, por lo que puede variar. El nombre del archivo siempre será `f3-core-master.pid`


## Parada del servicio CORE

Para detener el servicio simplemente debemos matar al proceso master.
Como este deja en el fichero .pid su PID, podemos matarlo rápidamente con:

```
fedicom3@f3dev:~> kill $(cat /var/run/fedicom3/f3-core-master.pid)
```

---
# Servicio **WATCHDOG**


## Arranque del servicio WATCHDOG

Nos logeamos con el usuario "fedicom3" y nos moveremos al directorio del código y ejecutaremos:

```
fedicom3@f3dev:~> cd fedicom3-core
fedicom3@f3dev:~/fedicom3-core> npm run watchdog
```

Si todo ha ido correctamente, en el fichero de log generado `./fedicom3-watchdog.log` debería aparecer algo similar a:

```
[master][2019-09-10T09:02:09.863Z][5000][server] **** ARRANCANDO WATCHDOG FEDICOM 3 - 0.3.2 ****
[master][2019-09-10T09:02:09.864Z][5000][server] *** Implementando protololo Fedicom v3.3.5 ****
[master][2019-09-10T09:02:09.865Z][5000][server] *** ID de instancia: f3dev-13139-1568106129714-0.3.2-wd
[master][2019-09-10T09:02:10.129Z][5000][server] Servidor HTTPS a la escucha en el puerto 50010
[master][2019-09-10T09:02:10.131Z][5000][sqlite] *** Conectado a la base de datos de emergencia SQLite3,/home/fedicom3/db/sqlite.db
[master][2019-09-10T09:02:10.167Z][5000][logs] *** Conectado a la colección [fedicom3.log] para almacenamiento de logs
[master][2019-09-10T09:02:10.174Z][5000][mongodb] *** Conexión #0 a la colección [fedicom3.tx] para almacenamiento de transmisiones
[master][2019-09-10T09:02:10.174Z][5000][mongodb] *** Conexión #0 a la colección [fedicom3.discard] para almacenamiento de transmisiones descartadas
```


También podremos ver el proceso con el comando `ps`:

```
fedicom3@f3dev:~> ps lf | grep f3
0  1001 13139     1  20   0 861980 56060 -      Sl   pts/0      0:00 f3-watchdog
0  1001 13011     1  20   0 768124 45768 -      Sl   pts/0      0:00 f3-core-master
0  1001 13023 13011  20   0 863608 56932 -      Sl   pts/0      0:00  \_ f3-core-worker-1
0  1001 13024 13011  20   0 863076 56368 -      Sl   pts/0      0:00  \_ f3-core-worker-2
```

Y también podemos ver como se ha generado el fichero con el PID del proceso:

```
fedicom3@f3dev:~> ls -l /var/run/fedicom3/f3-watchdog.pid
-rw-r--r-- 1 fedicom3 users 5 Sep 10 11:02 /var/run/fedicom3/f3-watchdog.pid
fedicom3@f3dev:~> cat /var/run/fedicom3/f3-watchdog.pid
13139
```

> El directorio donde se genera el fichero con el PID es configurable, por lo que puede variar. El nombre del archivo siempre será `f3-watchdog.pid`


## Parada del servicio WATCHDOG

Para detener el servicio simplemente debemos matar el proceso.
Como este deja en el fichero .pid su PID, podemos matarlo rápidamente con:

```
fedicom3@f3dev:~> kill $(cat /var/run/fedicom3/f3-watchdog.pid)
```
