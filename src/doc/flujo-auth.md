# El flujo de autenticación

Las transmisiones de autenticación son aquellas que van dirigidas a la URL `/authenticate` con el método `POST`.
El objetivo de estas transmisiones es el de retornarle al cliente un token de autenticación (o JWT - JSON Web Token), el cual podrá
utilizar posteriormente para llamar al resto de servicios del concentrador. [Detalles de los JWT]($DOC$/conceptos-jwt).

Como va a ser habitual para todas las transmisiones, cuando esta se recibe se le asignarán las propiedades básicas
como un ID de transmisión, y los datos de la petición HTTP, y se almacenará en la base de datos con el tipo establecido a
`AUTENTICAR` y el estado de `RECEPCIONADA`.

A continuación, se verifica que el contenido de la transmisión sea válido. 

Una autenticación válida tiene 3 componentes: un dominio (campo `domain`), un nombre de usuario (campo `user`) y una clave (el nombre del campo depende del dominio especifico).
Para que sea considerada válida debe cumplir uno de los siguientes casos, en funcion del valor del campo `domain` que indique:

- Si no aparece el campo `domain` o `domain = 'FEDICOM'`, se trata de una **autenticacion Fedicom standard**. 
En este caso, se espera que la petición indique los campos `user` y `password` con las credenciales Fedicom del cliente. Si el campo `domain` no existiera, este
se establece al valor `'FEDICOM'` por defecto.

- Si el campo `domain = 'APIKEY'`, se trata de **autenticación con API KEY**. En este caso, se espera que la se indiquen los campos `user` y `apikey`.

En el caso de que no se cumpla alguno de los casos expuestos, la transmisión se marcará con el estado de `PETICION_INCORRECTA` y se
retornará una respuesta con el error al cliente. En resumen, el siguiente diagrama muestra este proceso.

![]($IMG$/decision-auth.png)


En el caso de tratarse de una petición correcta, se procederá a la verificación de las credenciales. 
El método usado para la verificación de estas credenciales dependerá del dominio de la petición. 

---
## Autenticación del dominio FEDICOM
La autenticación en el domino FEDICOM implica que las credenciales del usuario deben comprobarse en la tabla SAP para este cometido.
Para esto, se realiza una llamada HTTP al sistema SAP con los siguientes parámetros:

- **Método:** ``POST``
- **URL:** ``/api/zverify_fedi_credentials``
- **Body:** 
    ```
    {
        user : <user>
        password : <password>
    }
    ```
Donde se sustituyen los valores de `<user>` y `<password>` por los indicados en la petición del cliente.
> **Apunte**: Para evitar problemas con los programas de farmacia que añaden un espacio al final del nombre de usuario y de la contraseña (herencia de Fedicom2), se elimina 
cualquier espacio en estos campos antes de enviárselos a SAP.

Si todo va como Dios manda, y las credenciales son correctas, SAP responderá a esta petición con estado `200 OK` y un mensaje de la siguiente forma:
```
{
    username : <user>
}
```
Si esto es así, se genera un JWT con los datos del usuario y se le envía en la respuesta. El estado de la transmisión pasa a ser `OK` y se acaba el procesamiento.

En caso de que las credenciales no sean válidas, SAP igualmente devolverá el estado `200 OK`, pero dará un mensaje de la forma:
```
[
    {
        "codigo": "AUTH-005",
        "descripcion": "Usuario o contraseña inválidos"
    }
]
```
En esta situación, el mismo mensaje que dió SAP se le envía al usuario, esta vez con código de estado `401 Unauthorized`, y la transmisión
pasa al estado de `FALLO_AUTENTICACION`. Se finaliza así el procesamiento de la transmisión.

Existe un tercer caso, en el que SAP devuelve un error o no está disponible. En este caso, como no se sabe si las credenciales son correctas o no, se asume que
si lo son y se genera un token no verificado que se envía al usuario y la transmisión se marca como `NO_SAP`, terminando así el procesamiento de la misma.
Por el momento no se hace ningún tratamiento especial de los tokens no verificados, pero se plantea la posibilidad de hacer una verificación a posteriori de los mismos.


---
## Autenticación del dominio APIKEY
Actualmente para el dominio `APIKEY` se genera un token siempre, en el sistema productivo se comprobará que el campo `apikey` de la petición contenga un valor válido previamente acordado con el cliente. 
Por ahora, siempre se genera un JWT con los datos del usuario y se le envía en la respuesta. El estado de la transmisión pasa a ser `OK` y se acaba el procesamiento.







