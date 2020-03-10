# Arranque - Parada

Las operaciones de arranque y parada del servicio Fedicom3 se realizan mediante el script `f3` que habremos linkeado en el directorio `bin` del usuario `fedicom3` durante el [despliegue de la aplicación en el servidor]($DOC$/f3/despliegue).

## Documentación del script `f3`

```
f3 (<accion> [<opciones>]) | -h

	-h 	Muestra esta ayuda

<accion>:
	start
		Arranca los procesos de la aplicación Fedicom 3.
		<opciones>:
			-u	Actualiza la aplicación desde el repositorio GIT.

	stop
		Detiene los procesos de la aplicación Fedicom 3.

	restart
		Reinicia los procesos de la aplicación Fedicom 3. 
		Equivale a ejecutar 'f3 stop' y 'f3 start' en ese orden.
		<opciones>:
			-u	Actualiza la aplicación desde el repositorio GIT.

	status
		Muestra el estado de los procesos Fedicom 3 ejecuntandose en el servidor.
```

## Logs de la aplicación

La aplicación Fedicom 3 consta de varios procesos. El número de procesos depende de la configuración de la misma. Podemos encontrar el log de cada proceso independiente dentro del directorio `/home/fedicom3/log` con la forma `<YYYYMMD>-f3-<processType>-<PID>.log`.

Por lo general, encontraremos los siguientes ficheros:
- `<YYYYMMD>-f3-core-master-<PID>.log`: Log del proceso master.
- `<YYYYMMD>-f3-core-worker-<workerID>-<PID>.log`: Logs de los procesos workers. Cada worker genera un fichero con su `workerID`.
- `<YYYYMMD>-f3-watchdog-<PID>.log`: Log del proceso watchdog.
- `<YYYYMMD>-f3-monitor-<PID>.log`: Log del proceso monitor.

Por ejemplo, si el arranquje ha ido correctamente, veremos por ejemplo el siguiente fichero `20200310-f3-core-worker-2-13117.log` con el contenido:

```
161256.111|INF|        cluster|["*** Iniciado worker",{"instanceID":"f3dev1-13117-0.9.3","pid":13117,"workerID":2}]
161258.670|INF|         sqlite|["*** Conectado a la base de datos de emergencia SQLite3","/home/fedicom3/db/sqlite.db"]
161258.672|INF|         server|["Servidor HTTP a la escucha en el puerto 5000"]
161258.842|INF|        mongodb|["*** Conexión a la base de datos [fedicom3]"]
161258.843|INF|        mongodb|["*** Conexión a la colección [fedicom3.tx] para almacenamiento de transmisiones"]
161258.864|INF|        mongodb|["*** Conexión a la colección [fedicom3.discard] para almacenamiento de transmisiones descartadas"]
161258.864|INF|        mongodb|["*** Conexión a la colección [fedicom3.control] para control"]

```


## Visualizar estado de procesos

La herramienta `f3` nos permite utilizar la opcion `status` para mostrar el estado de los procesos Fedicom 3.

```
$ f3 status
F   UID   PID  PPID PRI  NI    VSZ   RSS WCHAN  STAT TTY        TIME COMMAND
0  1100 13195     1  20   0 845824 55796 -      Sl   pts/1      0:04 f3-watchdog
0  1100 13164     1  20   0 862744 57332 -      Sl   pts/1      0:04 f3-monitor
0  1100 13095     1  20   0 839412 48532 -      Sl   pts/1      0:04 f3-core-master
0  1100 13115 13095  20   0 865712 59960 -      Sl   pts/1      0:04  \_ f3-core-worker-1
0  1100 13117 13095  20   0 866228 60448 -      Sl   pts/1      0:04  \_ f3-core-worker-2
0  1100 13119 13095  20   0 867808 60584 -      Sl   pts/1      0:04  \_ f3-core-worker-3
0  1100 13124 13095  20   0 867420 62360 -      Sl   pts/1      0:04  \_ f3-core-worker-4
```
