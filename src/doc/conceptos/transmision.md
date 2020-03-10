# El concepto de **Transmision**

Llamaremos transmisión a toda aquella llamada que se reciba cualquier servicio del concentrador, ya sea una
llamada para hacer un pedido, una devolución, una llamada incorrecta, o cualquier otro motivo.

El modo de representar internamente una transmisión es mediante un objeto JSON que contiene toda la información
de la misma. Este objeto residirá en la base de datos MongoDB, y por si mismo tiene toda la información 
de su ciclo de vida o al menos, en el peor de los casos (ante fallos del sistema), siempre contendrá y toda la información necesaria
para reprocesarse.

Toda transmisión tendrá asociadas, como mínimo, las siguientes propiedades:

- `_id` - **ID de transmisión** (en adelante `txId`). Es el identificador único en todo el sistema para cada transmisión. El formato del mismo es el de un [ObjectID](https://docs.mongodb.com/manual/reference/method/ObjectId/) (una cadena hexadecimal de 24 caracteres) 
- `type` - **Tipo de transmisión**. Es un valor numérico que identifica la naturaleza de la transmisión. Por ejemplo, si la transmisión es para crear un pedido, consultar una factura, ... o si está descartada por no haber podido identificar el tipo.
- `status` - **Estado de la transmisión**. Es un valor numérico que indica el estado actual de procesamiento de la transmisión. Por ejemplo, _enviado a SAP_, _fallo de autenticación_, _esperando incidencias de SAP_, ...
- `createdAt` - **Fecha de entrada de la transmisión**.
- `modifiedAt` - **Fecha de la última modificación**. Fecha de la última vez que se modificó la transmisión.
- `iid` - **ID instancia**. Identificador del ID de proceso Fedicom que atendió la petición. P.e: `f3dev-1992-1569485052699-0.6.3`.
- `clientRequest` - **Petición HTTP de entrada**. Contiene toda la información relacionada con la petición que creó la transmisión. Como mínimo:
    - `method` - El método HTTP usado: `GET`, `POST`, `PUT` ...
    - `headers` - La lista de cabeceras de la solicitud HTTP.
    - `body` - El mensaje de la transmisión.
    - `url` - La URL especificada por el cliente.
    - `route` - El controlador que se ejecuta en el concentrador.


Como norma general, cuando entran las peticiones al concentrador, lo primero que se hace es determinar su ID `txId`, y en función
de la URL a la que se dirija, se hacen unas breves comprobaciones que determinan el resto de propiedades de la transmisión antes de 
grabarla en la base de datos. Por ejemplo, si la URL a la que va dirigido es `POST /pedidos`, se determinará que el tipo es `CREAR_PEDIDO` 
y se analizará brevemente el contenido del mensaje para saber si la autenticación es correcta, el mensaje es correcto para determinar el estado.
En la sección de flujos se detallan todos los casos posibles.

Además de los campos ya comentados, hay otro conjunto de datos que generalmente aparecerá en las transmisiones, aunque su aparición o no
depende del propio contenido de la transmisión. Estos campos son:

- `clientResponse` - **Respuesta HTTP enviada**. Es la respuesta HTTP enviada al cliente como resultado de procesar la transmisión. Contiene los siguientes valores:
    - `timestamp` - Momento en el que se envía la respuesta.
    - `status` - Codigo de estado HTTP devuelto. (P.e: `200 OK`, `400 Bad Request`, etc ...)
    - `headers` - Las cabeceras HTTP enviadas con la respuesta.
    - `body` - El cuerpo del mensaje enviado.
- `sapRequest` - **Petición HTTP a SAP**. Si durante el procesamiento de la transmisión se realiza alguna llamada a SAP, este campos contiene la información HTTP de la misma. En concreto:
    - `timestamp` - Momento en el que se envía la respuesta.
    - `method` - El método HTTP usado: `GET`, `POST`, `PUT` ...
    - `headers` - La lista de cabeceras de la solicitud HTTP.
    - `body` - El cuerpo del mensaje enviado a SAP.
    - `url` - La URL contra la que se lanza la petición.
- `sapResponse` - **Respuesta HTTP de SAP**. Este campos contiene la información de la respuesta HTTP que SAP dió. En concreto:
    - `timestamp` - Momento en el que se envía la respuesta.
    - `statusCode` - Codigo de estado HTTP devuelto. (P.e: `200 OK`, `400 Bad Request`, etc ...)
    - `headers` - La lista de cabeceras de la solicitud HTTP.
    - `body` - El cuerpo del mensaje enviado a SAP.
    - `error` - Si la comunicación con SAP falló, este objeto aparecerá relleno con los siguientes campos:
        - `source` - La fuente del error. Puede tener los valores `SAP` o `NET`. Los errores de SAP son aquellos en los que SAP responde, pero la respuesta no es la esperada (p.e. SAP retorna el código HTTP 500). Los errores tipo NET son aquellos que se dan cuando no se puede alcanzar el servidor SAP y no hay respuesta de SAP (p.e. no hay red).
        - `statusCode` - Si el error es de SAP, contendrá el código de respuesta HTTP. Si el error es de red, contendrá el `errno` del fallo.
        - `statusCode` - Si el error es de SAP, contendrá el mensaje HTTP con el error. Si el error es de red, contendrá el `errmsg` del fallo.
- `authenticatingUser` - **Cliente Fedicom**. Si se puede identificar, este valor contendrá el código de cliente Fedicom con el que se está accediendo.
- `client` - **Cliente SAP**. Si se puede identificar, este valor contendrá el cliente SAP para el que se realiza la transmisión.
- `clientRequest`.`authentication` - **Datos de autenticación de la petición HTTP**. Si la petición viene autenticada mediante un token JWT (el standard en Fedicom v3), este campo reflejará el contenido del mismo y el resultado de su validación:
    - `aud` - **El domino del usuario**. Es el dominio de autenticación. A grandes rasgos, indica el tipo de usuario del que se trata. P.e. `FEDICOM` para usuarios Fedicom, `EMPLEADO` para vales de empleado, `FMAS` para llamadas desde F+Online, etc...
    - `sub` - **El código del usuario**. Es el código del usuario Fedicom para el que se expidió el token.
    - `exp` - **Fecha de expedición**. Indica el instante en el que se generó el token.
    - `iat` - **Valido hasta**. Indica el instante en el que el token debe dejar de aceptarse.
    - `iss` - **Emisor**. *(Obsoleto)*Indica el ID del proceso fedicom que genero el token.
    - `jti` - **ID transmisión generadora**. Indica el ID de la transmisión en la que se generó este token.
    - `meta` - **Metadatos**. Datos generados durante la verificación del token.
        - `ok`. Indica si el token es válido o no.
        - `error`. Si el token no es válido, indica el motivo. (P.e. _Firma incorrecta_ o _Token caducado_.
        - `verified`. *(Obsoleto)* Indica si la contraseña del usuario fué realmente verificada cuando se generó el token.


        
