# El **JWT** - JSON Web Token

## Autenticación basada en tokens
El protocolo Fedicom v3 utiliza autenticación basada en tokens.
Este tipo de autenticación envía un token en cada petición en lugar de mantener la información de autenticación en sesiones o cookies.
El token en sí mismo contiene toda la información necesaria para verificar que el mismo token es válido y a que usuario pertenece, por lo que evita
que se tenga que guardar ningún estado entre las diferentes peticiones al concentrador.

El funcionamiento de la autenticación con tokens, a grandes rasgos, es el siguiente: 

1. El usuario se autentica en nuestra aplicación con usuario y contraseña mediante un servicio implementado a tal efecto.
2. El servidor verifica las credenciales y genera un token de acceso que se entrega al usuario.
3. A partir de entonces, cada petición que haga el usuario va acompañada de este token.

Como hemos dicho, este token tiene la información necesaria para ser verificado e identificar al usuario para el que se generó.
Obviamente, este token debe implementar medidas de seguridad que impidan a un usuario malicioso falsificarlo y hacerse pasar por otro usuario.

Para llevar a cabo este mecanismo, Fedicom v3 propone utilizar una implementación concreta de esto llamada **JSON Web Tokens (JWT)**.

## JSON Web Token
JWT es un estándar abierto basado en JSON para crear tokens de acceso que permiten el uso de recursos de una aplicación
 o API de una forma segura. Este token llevará incorporada la información del usuario que necesita el servidor para identificarlo, así como información adicional que
pueda serle útil (roles, permisos, etc.). Una ventaja de utilizar JWT es que ya existem librerías hechas para la generación y verificación de estos tokens.

Un token con JWT tiene la siguiente pinta:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJIRUZBTUVAZjNkZXYiLCJzdWIiOiIxMDEwNzUwNkBoZWZhbWUiLCJhdWQiOiJGRURJQ09NIiwiZXhwIjoxNTY5OTQzNTc5NDc3LCJpYXQiOjE1Njk5Mzk5Nzk0NzcsImp0aSI6IjVkOTM2MjBiNTQzZTE0MDdjODk5ZDk5NyJ9.
WL1dnpnNNpby3pN2YCLHzvMSIauVoGAkei2ZI4AKHo0
```

Un JWT está compuesto en 3 partes codificadas en base 64, separadas por un punto (`.`):

### Header
Es la primera parte del token que contiene metainformacion sobre el propio token como el formato del mismo, el algoritmo de 
seguridad utilizado, etc ... En nuestro concentrador generamos tokens estandard `JWT` con firma `HS256` (HMAC with SHA-256)
```
{
    "typ": "JWT",
    "alg": "HS256"
}
```

### Payload
Esta segunda parte es el payload, está compuesto por los llamados JWT Claims donde irán colocados la
atributos que definen nuestro token. Existe múltiple información que podemos proporcionar, en nuestro caso los tokens generados contendrán los siguientes campos:
- `aud` - **El domino del usuario**. Es el dominio de autenticación. A grandes rasgos, indica el tipo de usuario del que se trata. P.e. `FEDICOM` para usuarios Fedicom, `EMPLEADO` para vales de empleado, `FMAS` para llamadas desde F+Online, etc...
- `sub` - **El código del usuario**. Es el código del usuario Fedicom para el que se expidió el token.
- `exp` - **Fecha de expedición**. Indica el instante en el que se generó el token.
- `iat` - **Valido hasta**. Indica el instante en el que el token debe dejar de aceptarse.
- `jti` - **ID transmisión generadora**. Indica el ID de la transmisión en la que se generó este token.

Por ejemplo:
```
{
  "sub": "10107506@hefame",
  "aud": "FEDICOM",
  "exp": 1569943579477,
  "iat": 1569939979477,
  "jti": "5d93620b543e1407c899d997"
}
```

En el futuro podrían añadirse mas campos a los tokens y esto no afectaría al funcionamiento.

### Signature
La tercera parte del token es la firma del mismo, esta se genera utilizando los componentes anteriores (header y payload)
más una clave secreta que únicamente conocerá nuestro concentrador. 
En nuestro caso, utilizamos HMAC con SHA256 ([Literatura interesante sobre que es un MAC](http://www.crypto-it.net/eng/theory/mac.html)):

```
HMAC = HMACSHA256(
    base64(header) + "." + base64(payload), <secret_key>
)
Signature = base64(HMAC)
```



---
## Verificación de JWT

Una vez que el usuario ha obtenido un token, siempre que el usuario necesite acceder a un recurso protegido, deberá de enviarlo con la solicitud. 
La manera de enviarlo debe ser mediante el uso de la cabecera HTTP llamada `Authorization`, con la siguiente forma:

```
Authorization: Bearer <token>
```

El concentrador, al recibir el token, debe comprobar que la firma es válida. Para esto, debe repetir la operacion de generación
de la misma y comprobar que esta coincide con la firma incluida en el token. Dado que para generar esta firma es necesario
conocer la clave secreta, podemos tener la seguridad de que fuimos nosotros los que generamos el token y además tenemos garantía
de que el contenido del token no se ha modificado.