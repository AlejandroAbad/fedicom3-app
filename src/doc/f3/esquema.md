# Esquema de la aplicación

La aplicación Fedicom3 está compuesta de varios módulos diseñados para ser independientes:

---
## Módulo **CORE**
Es la aplicación encargada de recepcionar las transmisiones de las farmacias para enviarlos a SAP. 
Simplificando, cuando entra una transmisión con un pedido de una farmacia, hace lo siguiente:
	1. Comprueba las credenciales del usuario.
	2. Comprueba que la estructura del mensaje sea correcta y que no falte ningún campo obligatorio.
	3. Genera el CRC del pedido.
	4. Comprueba si el pedido es un duplicado y en caso afirmativo responde con la misma respuesta que se diera al pedido original.
	5. Almacena la trama en su base de datos y la marca como `Pdte. Envio`.
	6. Lanza el pedido contra SAP para que este le devuelva incidencias.
	7. Retorna las incidencias al cliente.
	8. Marca la trama como `Pdte. Confirmar`.
	9. Cuando SAP finaliza el proceso de creación del pedido, hace una llamada de vuelta para confirmar el mismo, e indicar los números de pedido asociados a la transmisión. Cuando esto sucede, la transmisión se marca como `OK`.

![Diagrama de funciones del CORE]($IMG$/diagrama-funciones-core.png)

Esta aplicación también se encarga de recepcionar las solicitudes de Devoluciones y otras consultas. 
El proceso es similar al del Pedido en muchos casos, pero al tratarse de procesos menos críticos para el negocio, se simplifica el proceso.

---
## Módulo **WatchDog**
Es la aplicación que se encarga de recuperar transmisiones que han quedado en un estado no satisfactorio.
Principalmente se encarga de las siguientes tareas periódicamente:
1. Realiza búsquedas en la base de datos, identificando transmisiones no completadas. 
    Por ejemplo, cuando una transmisión no obtiene faltas de SAP, por estar SAP caído. Cuando encuentra transmisiones en 
    estos estados, realiza las modificaciones necesarias para llevarlas a un estado válido. Por ejemplo, retransmitiendolas a SAP. 
    La lista de casos en los que una transmisión se considera en error, y las acciones que se realizan se detallan mas adelante en la 
    documentación específica de este componente.
2. Cuando la aplicación CORE falla al escribir en MongoDB, esta almacena la escritura en una base de datos local (SQLite) 
    para garantizar su persistencia. El Watchdog vigila constantemente si aparecen entradas en la base de datos local para 
    volcarlas a MongoDB tan pronto como sea posible.




