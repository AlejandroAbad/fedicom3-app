# Esquema de la aplicación

La aplicación Fedicom3 está compuesta de varios módulos diseñados para ser independientes:

## Procesos **CORE**
Son los procesos encargado de recepcionar las transmisiones de las farmacias para enviarlas a SAP. 
Simplificando, cuando entra una transmisión con un pedido de una farmacia, hace lo siguiente:

1. Comprueba las credenciales del usuario.
2. Comprueba que la estructura del mensaje sea correcta y que no falte ningún campo obligatorio.
3. Genera el CRC del pedido.
4. Comprueba si el pedido es un duplicado y en caso afirmativo informa al cliente y termina el procesamiento.
5. Almacena la transmisión en su base de datos y la marca como `RECEPCIONADA`.
6. Lanza el pedido contra SAP para que este le devuelva incidencias.
7. Retorna las incidencias al cliente.
8. Marca la transmisión como `FALTAS ENVIADAS`.
9. Cuando SAP finaliza el proceso de creación del pedido, hace una llamada al conecntrador para confirmar el procesamiento del mismo, e indicar los números de pedido asociados a la transmisión. Cuando esto sucede, la transmisión se marca como `OK`.

![Diagrama de funciones del CORE](img/diagrama-funciones-core.png)

Esta aplicación también se encarga de recepcionar las solicitudes de Devoluciones y otras consultas. 
El proceso es similar al del Pedido en muchos casos, pero al tratarse de procesos menos críticos para el negocio, se simplifica el proceso.

Los procesos CORE se inician desde un proceso `core-master` que lanza tantos procesos `core-worker-#` como se le indique en la configuración.
Un ejemplo de jerarquía de procesos **CORE**:

```
PID   		PPID 		COMMAND
29485 	    	1		f3-core-master
29505 		29485		\_ f3-core-worker-1
29507 		29485		\_ f3-core-worker-2
29508 		29485		\_ f3-core-worker-3
29514 		29485		\_ f3-core-worker-4
```

El proceso master vigila que los workers estén funcionando correctamente, y en caso de que alguno falle, lo relanza.


## Proceso **WatchDog**
Es el proceso que se encarga de recuperar transmisiones que han quedado en un estado no satisfactorio.
Principalmente se encarga de las siguientes tareas periódicamente:

1. Realiza búsquedas en la base de datos, identificando transmisiones no completadas. 
Por ejemplo, cuando una transmisión no obtiene faltas de SAP, por estar SAP caído. Cuando encuentra transmisiones en estos estados, realiza las modificaciones necesarias para llevarlas a un estado válido. Por ejemplo, retransmitiendolas a SAP. La lista de casos en los que una transmisión se considera en error, y las acciones que se realizan se detallan mas adelante en la documentación específica de este componente.
2. Cuando la aplicación CORE falla al escribir en MongoDB, esta almacena la escritura en una base de datos local (SQLite) para garantizar su persistencia. El Watchdog vigila constantemente si aparecen entradas en la base de datos local para volcarlas a MongoDB tan pronto como sea posible.


## Proceso **Monitor**
El proceso **monitor** se encarga de atender a las peticiones de monitorización y control de la aplicación.
Estas peticiones son, por ejemplo:
- Consultas genéricas de transmisiones.
- Consulta del estado de los procesos Fedicom.
- Consulta del estado de la base de datos.
- Consulta del estado de los concentradores.